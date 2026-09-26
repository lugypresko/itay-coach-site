import { describe, expect, it } from "vitest";

import { buildDeterministicDiagnosticResult } from "@/lib/diagnostic-funnel/deterministic-result";
import type { DiagnosticAnswers, DiagnosticResult } from "@/lib/diagnostic-funnel/types";

describe("deterministic diagnostic result", () => {
  it("returns all five result blocks for a supported decision pattern", () => {
    const result = buildDeterministicDiagnosticResult({
      caseType: "decision",
      caseEvent: "Important launch decisions keep returning to me for approval.",
      selfExplanation: "The team says I have the final authority.",
      absenceOutcome: "The decision waits when I am unavailable.",
      frequency: "often",
    });

    expect(Object.keys(result)).toEqual([
      "observedPattern",
      "hypothesis",
      "evidenceAgainst",
      "experiment",
      "nextStep",
    ]);
    expect(result.hypothesis.primary).toBe("authority");
    expect(result.observedPattern).toContain("decision");
    expect(result.evidenceAgainst.length).toBeGreaterThan(0);
    expect(result.experiment.action).toBeTruthy();
    expect(result.experiment.observation).toBeTruthy();
    expect(result.nextStep).toBe("coaching");
  });

  it("returns insufficient evidence instead of forcing a bottleneck diagnosis", () => {
    const answers: DiagnosticAnswers = { caseType: "other", frequency: "rarely" };

    const result: DiagnosticResult = buildDeterministicDiagnosticResult(answers);

    expect(result.hypothesis.primary).toBe("insufficient_evidence");
    expect(result.hypothesis.confidence).toBe("low");
    expect(result.nextStep).toBe("more_evidence");
    expect(result.observedPattern.toLowerCase()).toContain("not enough");
  });

  it("selects a non-authority hypothesis when the evidence points elsewhere", () => {
    const result = buildDeterministicDiagnosticResult({
      caseType: "meeting",
      caseEvent: "The meeting keeps expanding because nobody knows who owns the decision.",
      selfExplanation: "The roles and handoffs are unclear.",
      absenceOutcome: "The team revisits the same agenda without a decision.",
      frequency: "sometimes",
    });

    expect(result.hypothesis.primary).toBe("role_design");
    expect(result.hypothesis.primary).not.toBe("authority");
    expect(result.nextStep).toBe("organizational_change");
  });
});
