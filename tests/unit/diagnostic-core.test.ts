import { describe, expect, it } from "vitest";

import {
  createDiagnosticSession,
  recordDiagnosticAnswer,
  buildMicroInsight,
  buildDiagnosis,
  routeDiagnosticWithReasons,
  type DiagnosticSession,
} from "../../src/lib/diagnostic-core";

describe("diagnostic core", () => {
  it("keeps raw answers and derives evidence with source turn provenance", () => {
    const session = createDiagnosticSession("session-1");
    const result = recordDiagnosticAnswer(session, {
      turnId: "turn-1",
      state: "ROLE",
      answer: "I lead engineering at a SaaS company.",
    });

    expect(result.session.turns[0]).toMatchObject({
      id: "turn-1",
      rawAnswer: "I lead engineering at a SaaS company.",
    });
    expect(result.session.evidence.identifiedPain.status).toBe("UNKNOWN");
    expect(result.session.evidence.identifiedPain.sourceTurnIds).toEqual([]);
    expect(result.session.state).toBe("PAIN_RAW");
  });

  it("produces a deterministic reflection and next question from the current answer", () => {
    const result = recordDiagnosticAnswer(createDiagnosticSession("s"), {
      turnId: "t1",
      state: "PAIN_RAW",
      answer: "Every important decision comes back to me for review.",
    });

    expect(result.reflection.toLowerCase()).toContain("decision");
    expect(result.nextQuestion).toContain("depends");
    expect(result.session.evidence.identifiedPain.status).toBe("SIGNAL");
    expect(result.session.evidence.identifiedPain.sourceTurnIds).toEqual(["t1"]);
  });

  it("requires explicit confirmation before marking pain user confirmed", () => {
    const session = createDiagnosticSession("s");
    const signal = recordDiagnosticAnswer(session, {
      turnId: "t1", state: "PAIN_RAW", answer: "The team waits for me.",
    }).session;
    const rejected = recordDiagnosticAnswer(signal, {
      turnId: "t2", state: "PATTERN_HYPOTHESES", answer: "No, that is not it.",
    }).session;
    expect(rejected.evidence.identifiedPain.status).toBe("SIGNAL");

    const confirmed = recordDiagnosticAnswer(signal, {
      turnId: "t3", state: "PATTERN_HYPOTHESES", answer: "Yes, that is accurate.",
      confirmation: true,
    }).session;
    expect(confirmed.evidence.identifiedPain.status).toBe("USER_CONFIRMED");
    expect(confirmed.evidence.identifiedPain.sourceTurnIds).toEqual(["t1", "t3"]);
  });

  it("builds a useful insight and diagnosis without exposing a score", () => {
    const session: DiagnosticSession = {
      ...createDiagnosticSession("s"),
      state: "DIAGNOSIS",
      turns: [{ id: "t1", state: "PAIN_RAW", rawAnswer: "Decisions return to me.", answer: "Decisions return to me." }],
      evidence: {
        ...createDiagnosticSession("s").evidence,
        identifiedPain: { status: "USER_CONFIRMED", value: "decisions return upward", sourceTurnIds: ["t1"], confidence: 0.9 },
      },
    };
    expect(buildMicroInsight(session).text).toContain("decision");
    const diagnosis = buildDiagnosis(session);
    expect(diagnosis.observedPattern).toBeTruthy();
    expect(diagnosis.reversibleExperiment).toBeTruthy();
    expect(JSON.stringify(diagnosis)).not.toContain("score");
  });

  it("returns explicit reasons for every DQL route", () => {
    expect(routeDiagnosticWithReasons({ fit: true, pain: true, now: true, intent: "talk_now" }).route).toBe("TALK_NOW");
    expect(routeDiagnosticWithReasons({ fit: true, pain: true, now: false, intent: "later" }).route).toBe("NURTURE");
    expect(routeDiagnosticWithReasons({ fit: false, pain: true, now: true, intent: "talk_now" }).route).toBe("NO_FIT");
    expect(routeDiagnosticWithReasons({ fit: true, pain: true, now: true, intent: "none" }).route).toBe("INSUFFICIENT_EVIDENCE");
    expect(routeDiagnosticWithReasons({ fit: true, pain: true, now: true, intent: "talk_now" }).reasons.length).toBeGreaterThan(0);
  });
});
