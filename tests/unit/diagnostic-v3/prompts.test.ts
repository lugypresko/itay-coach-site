import { afterEach, describe, expect, it, vi } from "vitest";
import { analyze, fallback, partialFallback, providerAnswers, validateEvidence } from "@/lib/diagnostic-v3/analysis";
import { fullSchema, partialSchema, type Answers, type Session } from "@/lib/diagnostic-v3/contracts";
import { FIRST_READ_SYSTEM, FULL_READ_SYSTEM } from "@/lib/diagnostic-v3/prompts";
import { currentAnalysis, newSession } from "@/lib/diagnostic-v3/store";
const answers: Answers = {situation: "decision", absence: "wait", owner: "manager", authority: "checks", duration: "long", frequency: "several", attempts: ["decide"], impact: ["customer"], desired: "managers", context: "Two teams wait for a release decision."};
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
describe("approved two-pass prompts", () => {
  it("maps independent question IDs to human-readable answers", () => {
    const data = providerAnswers(answers);
    expect(data.Q3).toEqual([{field: "owner", value: "One manager clearly owns it"}]);
    expect(data.Q5).toHaveLength(2);
    expect(data.Q9).toEqual(data.CASE_CONTEXT);
  });
  it("full contract requires review point and rejects qualification fields", () => {
    const good = fallback(answers);
    expect(fullSchema.safeParse(good).success).toBe(true);
    const {review_point: omitted, ...experiment} = good.seven_day_experiment;
    expect(omitted).toContain("seven days");
    expect(fullSchema.safeParse({...good, seven_day_experiment: experiment}).success).toBe(false);
    expect(fullSchema.safeParse({...good, fit: 9}).success).toBe(false);
    expect(good.manager_question.match(/\?/g)).toHaveLength(1);
    expect(partialSchema.safeParse({...partialFallback(answers), primary_pattern: "authority"}).success).toBe(false);
  });
  it("CASE_CONTEXT and Q9 cannot manufacture independent evidence", () => {
    const first = partialFallback(answers);
    first.evidence = [{answer_reference: "Q9", interpretation: "case"}];
    first.confidence = "high";
    expect(validateEvidence(first, answers).confidence).toBe("low");
    const full = fallback(answers);
    full.evidence = [{answer_reference: "CASE_CONTEXT", interpretation: "case"}];
    expect(() => validateEvidence(full, {...answers, context: ""})).toThrow();
  });
  it("selects distinct prompts, validates both passes, and passes only case data", async () => {
    vi.stubEnv("DIAGNOSTIC_V3_AI_ENABLED", "true");
    vi.stubEnv("GROQ_ZDR_VERIFIED", "true");
    vi.stubEnv("GROQ_API_KEY", "test-only");
    const first = partialFallback(answers);
    const second = fallback(answers);
    const fetch = vi.fn().mockResolvedValueOnce({ok: true, status: 200, json: async () => ({choices: [{message: {content: JSON.stringify(first)}}]})}).mockResolvedValueOnce({ok: true, status: 200, json: async () => ({choices: [{message: {content: JSON.stringify(second)}}]})});
    vi.stubGlobal("fetch", fetch);
    expect((await analyze("private-session", 4, answers, "partial")).source).toBe("groq");
    expect((await analyze("private-session", 4, answers, "full", first, ["private-email", "private-company"])).source).toBe("groq");
    const requests = fetch.mock.calls.map((call) => JSON.parse(call[1].body));
    expect(requests[0].messages[0].content).toContain(FIRST_READ_SYSTEM);
    expect(requests[1].messages[0].content).toContain(FULL_READ_SYSTEM);
    expect(JSON.parse(requests[1].messages[1].content).previous_analysis).toEqual(first);
    expect(JSON.stringify(requests)).not.toMatch(/private-session|private-email|private-company/);
    expect(requests[1].response_format.json_schema.schema.additionalProperties).toBe(false);
  });
  it("invalidates legacy reads while retaining answers, identity and lead brief", () => {
    const s = newSession();
    s.answers = answers;
    s.identity = {first_name: "Fictional", email: "fictional@example.com", company: "QA"};
    s.sales_brief = "retained";
    s.stage = "full";
    s.full = {session_id: s.id, answer_revision: 1, analysis_version: "analysis-v1", source: "fallback", model: "old", data: {}} as unknown as Session["full"];
    const active = currentAnalysis(s);
    expect(active.full).toBeUndefined();
    expect(active.stage).toBe("answering");
    expect(active.identity).toEqual(s.identity);
    expect(active.sales_brief).toBe("retained");
    expect(active.answers).toEqual(answers);
  });
});
