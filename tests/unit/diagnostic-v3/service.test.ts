import { afterEach, describe, expect, it, vi } from "vitest";
import type { FullAnalysis, Session } from "@/lib/diagnostic-v3/contracts";
import { act, deliverSummary, publicSession, renderSummaryEmail } from "@/lib/diagnostic-v3/service";
import { partialFallback } from "@/lib/diagnostic-v3/analysis";
import type { Store } from "@/lib/diagnostic-v3/store";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

const full: FullAnalysis = {
  primary_pattern: "decision_rights_gap",
  likely_explanation:
    "The manager appears to have authority but defers the final decision to you. This delays releases.",
  alternative_hypothesis: "A risk policy could require your approval.",
  evidence: [],
  case_summary: "Do not include this full case summary in the email.",
  leadership_move: "Agree on the decision boundary and the exact condition for escalation.",
  manager_question: "What condition makes you need my approval for this release?",
  seven_day_experiment: {
    action: "Do not include the full experiment details.",
    trigger: "Do not include its trigger.",
    safety_boundary: "Do not include its safety boundary.",
    observation: "Do not include its observation details.",
    review_point: "Do not include its review point.",
  },
  success_signal: "The manager makes the next in-scope release decision without escalating it.",
  unresolved_question: "Do not include unresolved questions.",
};

function mailSession(): Session {
  const id = "d1a5d300-6c53-4a13-a707-30e6a7b4c6f1";
  return {
    id,
    diagnostic_version: "v3",
    record_version: 1,
    answer_revision: 9,
    answers: {},
    step: 8,
    stage: "full",
    identity: { first_name: "QA", email: "qa@example.test", company: "QA" },
    full: {
      session_id: id,
      answer_revision: 9,
      analysis_version: "analysis-v2",
      data: full,
      source: "groq",
      model: "qa-model",
    },
    scoring: {
      scoring_version: "scoring-v1",
      fit_status: "unknown",
      fit: null,
      pain: 0,
      urgency: 0,
      readiness: 0,
      total: null,
      route: "unqualified_nurture",
      rule: "test",
    },
    events: [],
    created_at: new Date(0).toISOString(),
    expires_at: new Date(Date.now() + 86400000).toISOString(),
    mail: "queued",
  };
}

function storeWithSuccessfulSaves(): Store {
  return {
    create: vi.fn(async () => {}),
    read: vi.fn(async () => null),
    save: vi.fn(async () => true),
    remove: vi.fn(async () => {}),
    consumeReturn: vi.fn(async () => true),
  };
}

describe("Diagnostic V3 summary email", () => {
  it("renders only the fixed concise sections and private return link", () => {
    const returnUrl = "https://preview.example.test/api/diagnostic/v3?return=private-token";
    const text = renderSummaryEmail(full, returnUrl);

    expect(text.split("\n").filter((line) => line)).toEqual([
      "What I noticed",
      "The manager appears to have authority but defers the final decision to you.",
      "Your next move",
      full.leadership_move,
      "One question to ask",
      full.manager_question,
      "7-day success signal",
      full.success_signal,
      "CTA",
      "Open your full read",
      returnUrl,
    ]);
    expect(text).not.toContain(full.case_summary);
    expect(text).not.toContain(full.alternative_hypothesis);
    expect(text).not.toContain(full.seven_day_experiment.action);
    expect(text).not.toContain(full.unresolved_question);
  });

  it("uses neutral language for the known escalating/blame phrasing", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    const text = renderSummaryEmail(
      { ...full, likely_explanation: "You keep escalating and blocking progress." },
      "https://preview.example.test/api/diagnostic/v3?return=private-token",
    );
    expect(text).toContain(
      "The handoff keeps coming back to you and progress slows.",
    );
    expect(text).not.toContain("you keep escalating and blocking progress");
  });

  it("leaves Production email copy unchanged", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const text = renderSummaryEmail(
      { ...full, likely_explanation: "You keep escalating and blocking progress." },
      "https://site.example.test/api/diagnostic/v3?return=private-token",
    );
    expect(text).toContain("You keep escalating and blocking progress.");
  });

  it("sends in Preview only when both mail flags and delivery settings exist", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("DIAGNOSTIC_V3_MAIL_ENABLED", "true");
    vi.stubEnv("DIAGNOSTIC_V3_PREVIEW_MAIL_ENABLED", "true");
    vi.stubEnv("RESEND_API_KEY", "qa-secret");
    vi.stubEnv("DIAGNOSTIC_V3_MAIL_FROM", "Diagnostic QA <diagnostic@example.test>");
    const fetchMock = vi.fn<typeof fetch>(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const session = mailSession();
    const store = storeWithSuccessfulSaves();

    await deliverSummary(store, session, "https://preview.example.test", "session-auth");

    expect(session.mail).toBe("sent");
    expect(fetchMock).toHaveBeenCalledOnce();
    const [, request] = fetchMock.mock.calls[0];
    expect(request?.headers).toMatchObject({
      "Idempotency-Key": `diagnostic-v3-${session.id}-${session.answer_revision}`,
    });
    const body = JSON.parse(String(request?.body));
    expect(body.text).toContain("What I noticed\nThe manager appears to have authority");
    expect(body.text).toContain("Open your full read\nhttps://preview.example.test/api/diagnostic/v3?return=");

    await act(store, session, { action: "summary", expected_version: session.record_version });
    await deliverSummary(store, session, "https://preview.example.test", "session-auth");
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("simulates Preview delivery unless the explicit QA flag is enabled", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("DIAGNOSTIC_V3_MAIL_ENABLED", "true");
    vi.stubEnv("RESEND_API_KEY", "qa-secret");
    vi.stubEnv("DIAGNOSTIC_V3_MAIL_FROM", "Diagnostic QA <diagnostic@example.test>");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const session = mailSession();

    await deliverSummary(storeWithSuccessfulSaves(), session, "https://preview.example.test", "session-auth");

    expect(session.mail).toBe("simulated");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not send from Preview when the base mail flag is disabled", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("DIAGNOSTIC_V3_MAIL_ENABLED", "false");
    vi.stubEnv("DIAGNOSTIC_V3_PREVIEW_MAIL_ENABLED", "true");
    vi.stubEnv("RESEND_API_KEY", "qa-secret");
    vi.stubEnv("DIAGNOSTIC_V3_MAIL_FROM", "Diagnostic QA <diagnostic@example.test>");
    const fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal("fetch", fetchMock);
    const session = mailSession();

    await deliverSummary(storeWithSuccessfulSaves(), session, "https://preview.example.test", "session-auth");

    expect(session.mail).toBe("simulated");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not send from Preview without both Resend delivery settings", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("DIAGNOSTIC_V3_MAIL_ENABLED", "true");
    vi.stubEnv("DIAGNOSTIC_V3_PREVIEW_MAIL_ENABLED", "true");
    const fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal("fetch", fetchMock);
    const session = mailSession();

    await deliverSummary(storeWithSuccessfulSaves(), session, "https://preview.example.test", "session-auth");

    expect(session.mail).toBe("simulated");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("keeps the existing non-Preview mail gate unchanged", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("DIAGNOSTIC_V3_MAIL_ENABLED", "true");
    vi.stubEnv("DIAGNOSTIC_V3_PREVIEW_MAIL_ENABLED", "false");
    vi.stubEnv("RESEND_API_KEY", "qa-secret");
    vi.stubEnv("DIAGNOSTIC_V3_MAIL_FROM", "Diagnostic QA <diagnostic@example.test>");
    const fetchMock = vi.fn<typeof fetch>(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const session = mailSession();

    await deliverSummary(storeWithSuccessfulSaves(), session, "https://site.example.test", "session-auth");

    expect(session.mail).toBe("sent");
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});

describe("Diagnostic V3 Preview QA metadata", () => {
  it("exposes selected analysis sources only in Preview", () => {
    const session = mailSession();
    session.partial = {
      session_id: session.id,
      answer_revision: session.answer_revision,
      analysis_version: "analysis-v2",
      data: partialFallback({}),
      source: "fallback",
      model: "deterministic-v1",
    };

    vi.stubEnv("VERCEL_ENV", "preview");
    expect(publicSession(session).qa_metadata).toEqual({
      first_read_source: "deterministic",
      full_read_source: "groq",
    });

    vi.stubEnv("VERCEL_ENV", "production");
    expect(publicSession(session).qa_metadata).toBeUndefined();
  });
});
