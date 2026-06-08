import { describe, expect, it } from "vitest";

import {
  buildPlayerTrapDiagnosisCallUrl,
  buildPlayerTrapFollowUpEmail,
  buildPlayerTrapReport,
  buildPlayerTrapReportUrl,
  normalizeUtmAttribution,
  playerTrapNurtureSequence,
  playerTrapQuestions,
  scorePlayerTrap,
} from "../../src/lib/player-trap";

describe("player trap conversion infrastructure", () => {
  it("defines five diagnostic questions and a five-email nurture sequence", () => {
    expect(playerTrapQuestions).toHaveLength(5);
    expect(playerTrapNurtureSequence).toHaveLength(5);
    expect(playerTrapNurtureSequence[0].slug).toBe("diagnostic-report");
  });

  it("scores low-risk, mid-risk, and high-risk inputs into the expected tiers", () => {
    const trustedOperator = scorePlayerTrap({
      final_reviewer: "Rarely; decisions stay distributed.",
      delegation_rules: "Written and used consistently.",
      ai_review_load: "Rarely.",
      leadership_visibility: "Very visible and documented.",
      default_escalation: "Rarely.",
    });

    const invisibleExecutor = scorePlayerTrap({
      final_reviewer: "Sometimes; only a few items escalate.",
      delegation_rules: "Known by a few people, not the whole team.",
      ai_review_load: "Often.",
      leadership_visibility: "Partly visible.",
      default_escalation: "Often.",
    });

    const executionBottleneck = scorePlayerTrap({
      final_reviewer: "Almost always; the team waits on my approval.",
      delegation_rules: "Mostly implicit.",
      ai_review_load: "Constantly.",
      leadership_visibility: "Mostly invisible.",
      default_escalation: "Always.",
    });

    expect(trustedOperator.tier).toBe("trusted-operator");
    expect(invisibleExecutor.tier).toBe("invisible-executor");
    expect(executionBottleneck.tier).toBe("execution-bottleneck");
  });

  it("builds report and follow-up email copy with the expected URLs", () => {
    const result = scorePlayerTrap({
      final_reviewer: "Almost always; the team waits on my approval.",
      delegation_rules: "Mostly implicit.",
      ai_review_load: "Constantly.",
      leadership_visibility: "Mostly invisible.",
      default_escalation: "Always.",
    });

    const reportUrl = buildPlayerTrapReportUrl("abc123");
    const diagnosisCallUrl = buildPlayerTrapDiagnosisCallUrl("abc123");
    const report = buildPlayerTrapReport(result, {
      name: "Itay",
      reportUrl,
      diagnosisCallUrl,
    });
    const email = buildPlayerTrapFollowUpEmail(playerTrapNurtureSequence[0], {
      name: "Itay",
      email: "itay@example.com",
      reportUrl,
      diagnosisCallUrl,
      result,
    });

    expect(normalizeUtmAttribution({ utmSource: "  google  " }).utmSource).toBe("google");
    expect(report.text).toContain(reportUrl);
    expect(report.text).toContain(diagnosisCallUrl);
    expect(email.subject).toContain("Player Trap diagnostic report");
    expect(email.text).toContain(reportUrl);
  });
});
