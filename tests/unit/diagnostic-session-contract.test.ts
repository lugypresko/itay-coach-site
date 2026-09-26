import { describe, expect, it } from "vitest";

import type {
  DiagnosticAnswers,
  DiagnosticLifecycleStatus,
  DiagnosticResult,
  DiagnosticSession,
} from "@/lib/diagnostic-funnel/types";

describe("diagnostic funnel session contract", () => {
  it("accepts the complete anonymous session shape", () => {
    const answers: DiagnosticAnswers = {
      caseType: "decision",
      caseEvent: "The team asked me to make the final call.",
      selfExplanation: "They wanted authority.",
      absenceOutcome: "They would delay the decision",
      frequency: "often",
      context: "A launch decision kept returning to me.",
    };

    const result: DiagnosticResult = {
      observedPattern: "Important decisions keep returning to one leader.",
      hypothesis: {
        primary: "authority",
        confidence: "medium",
        explanation: "The team may not have a clear decision boundary.",
      },
      evidenceAgainst: ["The risk may genuinely require executive judgment."],
      experiment: {
        action: "Define one decision category the team can own.",
        observation: "Notice whether the decision returns with a clearer question.",
        duration: "one week",
      },
      nextStep: "coaching",
    };

    const session: DiagnosticSession = {
      id: "session-123",
      source: { entryPoint: "homepage", utmSource: "linkedin" },
      status: "result_viewed",
      answers,
      result,
      timestamps: {
        createdAt: "2026-09-26T10:00:00.000Z",
        updatedAt: "2026-09-26T10:05:00.000Z",
        resultViewedAt: "2026-09-26T10:05:00.000Z",
      },
    };

    expect(session.answers.frequency).toBe("often");
    expect(session.result?.hypothesis.primary).toBe("authority");
    expect(session.status).toBe("result_viewed");
  });

  it("keeps lead and fit metadata optional and lifecycle statuses explicit", () => {
    const status: DiagnosticLifecycleStatus = "fit_call_submitted";
    const session: DiagnosticSession = {
      id: "session-456",
      source: {},
      status,
      answers: {
        caseType: "other",
        frequency: "rarely",
      },
      lead: { email: "leader@example.com", marketingConsent: false },
      fit: { role: "Engineering Director", urgency: "this quarter" },
      timestamps: {
        createdAt: "2026-09-26T10:00:00.000Z",
        updatedAt: "2026-09-26T10:10:00.000Z",
        fitCallStartedAt: "2026-09-26T10:09:00.000Z",
        fitCallSubmittedAt: "2026-09-26T10:10:00.000Z",
      },
    };

    expect(session.lead?.marketingConsent).toBe(false);
    expect(session.fit?.role).toBe("Engineering Director");
    expect(session.result).toBeUndefined();
  });
});
