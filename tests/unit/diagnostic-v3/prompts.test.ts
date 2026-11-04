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
    const fetch = vi.fn().mockResolvedValueOnce({ok: true, status: 200, headers: new Headers(), json: async () => ({choices: [{message: {content: JSON.stringify(first)}}]})}).mockResolvedValueOnce({ok: true, status: 200, headers: new Headers(), json: async () => ({choices: [{message: {content: JSON.stringify(second)}}]})});
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
  it("allows a silent per-call model override without changing the configured model", async () => {
    vi.stubEnv("DIAGNOSTIC_V3_AI_ENABLED", "true");
    vi.stubEnv("GROQ_ZDR_VERIFIED", "true");
    vi.stubEnv("GROQ_API_KEY", "test-only");
    vi.stubEnv("DIAGNOSTIC_V3_GROQ_MODEL", "openai/gpt-oss-20b");
    const response = { ok: true, status: 200, headers: new Headers(), json: async () => ({ choices: [{ message: { content: JSON.stringify(fallback(answers)) } }] }) };
    const fetch = vi.fn().mockResolvedValue(response);
    vi.stubGlobal("fetch", fetch);
    const log = vi.spyOn(console, "info").mockImplementation(() => {});

    await analyze("synthetic", 1, answers, "full", partialFallback(answers), [], {
      modelOverride: "openai/gpt-oss-120b",
      suppressTelemetry: true,
    });

    expect(JSON.parse(String(fetch.mock.calls[0][1]?.body)).model).toBe("openai/gpt-oss-120b");
    expect(process.env.DIAGNOSTIC_V3_GROQ_MODEL).toBe("openai/gpt-oss-20b");
    expect(log).not.toHaveBeenCalled();
    log.mockRestore();
  });
  it("retries a First Read json_validate_failed response once with the identical Groq request", async () => {
    vi.stubEnv("DIAGNOSTIC_V3_AI_ENABLED", "true");
    vi.stubEnv("GROQ_ZDR_VERIFIED", "true");
    vi.stubEnv("GROQ_API_KEY", "test-only");
    vi.stubEnv("VERCEL_ENV", "preview");
    const retryData = partialFallback(answers);
    const firstRequestId = "req-first";
    const retryRequestId = "req-retry";
    const failed = {
      ok: false,
      status: 400,
      headers: new Headers({ "x-request-id": firstRequestId }),
      text: async () => JSON.stringify({ error: { type: "invalid_request_error", code: "json_validate_failed", message: "schema rejected" } }),
    };
    const succeeded = {
      ok: true,
      status: 200,
      headers: new Headers({ "x-request-id": retryRequestId }),
      json: async () => ({ choices: [{ message: { content: JSON.stringify(retryData) } }] }),
    };
    const fetch = vi.fn().mockResolvedValueOnce(failed).mockResolvedValueOnce(succeeded);
    vi.stubGlobal("fetch", fetch);
    const log = vi.spyOn(console, "info").mockImplementation(() => {});

    const result = await analyze("private-session", 4, answers, "partial");

    expect(result.source).toBe("groq");
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch.mock.calls[1][1]).toMatchObject({ method: "POST", headers: { Authorization: "Bearer test-only", "Content-Type": "application/json" } });
    expect(JSON.parse(String(fetch.mock.calls[1][1]?.body))).toEqual(JSON.parse(String(fetch.mock.calls[0][1]?.body)));
    expect(log).toHaveBeenCalledWith(expect.stringContaining('"event":"diagnostic_v3_groq_retry"'));
    expect(log.mock.calls.some(([line]) => String(line).includes('"outcome":"succeeded"') && String(line).includes(retryRequestId))).toBe(true);
    expect(log.mock.calls.map(([line]) => String(line)).join(" ")).not.toMatch(/test-only|Two teams wait|private-session/);
    log.mockRestore();
  });
  it("does not retry other 400 errors or Full Read failures", async () => {
    vi.stubEnv("DIAGNOSTIC_V3_AI_ENABLED", "true");
    vi.stubEnv("GROQ_ZDR_VERIFIED", "true");
    vi.stubEnv("GROQ_API_KEY", "test-only");
    const response = {
      ok: false,
      status: 400,
      headers: new Headers(),
      text: async () => JSON.stringify({ error: { code: "invalid_payload", message: "rejected" } }),
    };
    const fetch = vi.fn().mockResolvedValue(response);
    vi.stubGlobal("fetch", fetch);

    const partial = await analyze("private-session", 4, answers, "partial");
    expect(partial.source).toBe("fallback");
    expect(fetch).toHaveBeenCalledTimes(1);
    await analyze("private-session", 4, answers, "full", partialFallback(answers));
    expect(fetch).toHaveBeenCalledTimes(2);
  });
  it("keeps deterministic fallback and logs a bounded retry failure", async () => {
    vi.stubEnv("DIAGNOSTIC_V3_AI_ENABLED", "true");
    vi.stubEnv("GROQ_ZDR_VERIFIED", "true");
    vi.stubEnv("GROQ_API_KEY", "test-only");
    vi.stubEnv("VERCEL_ENV", "preview");
    const bad = () => ({
      ok: false,
      status: 400,
      headers: new Headers(),
      text: async () => JSON.stringify({ error: { code: "json_validate_failed", message: "schema rejected" } }),
    });
    const fetch = vi.fn().mockResolvedValueOnce(bad()).mockResolvedValueOnce(bad());
    vi.stubGlobal("fetch", fetch);
    const log = vi.spyOn(console, "info").mockImplementation(() => {});

    const result = await analyze("private-session", 4, answers, "partial");

    expect(result.source).toBe("fallback");
    expect(result.fallback_reason).toBe("http_400");
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(log.mock.calls.some(([line]) => String(line).includes('"outcome":"failed"'))).toBe(true);
    log.mockRestore();
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
