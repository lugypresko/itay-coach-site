import { describe, expect, it } from "vitest";

import { validateContentDecision } from "../../src/ai/content-decision/validate-content-decision";
import { contentDecisionVocabulary } from "../../src/ai/content-decision/vocabulary";

const decision = {
  id: "decision-em-bottleneck",
  decisionVersion: 1,
  pagePatternId: "conversion_landing_page" as const,
  contentArchetype: "conversion" as const,
  primaryAudienceEntityId: "engineering-manager",
  primaryProblemId: "execution-bottleneck",
  symptomIds: ["approval-dependency", "strategic-time-collapse"],
  primaryFrameworkEntityId: "invisible-executor-framework",
  primaryOfferId: "the-push-coaching",
  primaryCtaId: "book-fit-call",
  journeyStage: "coach_intent" as const,
  claimIds: ["claim-leaders-become-default-route"],
  evidenceIds: ["evidence-approved-insight-player-trap"],
  canonicalPath: "/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck",
  sourceInsightIds: ["approved-insight-player-trap-05"],
  status: "active" as const,
  lastValidatedAt: null,
  validationStatus: "unvalidated" as const,
};

describe("ContentDecision validator", () => {
  it("returns a valid result for a complete decision", () => {
    const result = validateContentDecision(decision, { vocabulary: contentDecisionVocabulary });
    expect(result).toMatchObject({ valid: true, failureCodes: [] });
  });

  it("reports missing and orphan references deterministically", () => {
    const result = validateContentDecision({ ...decision, primaryOfferId: "missing-offer", evidenceIds: [] }, { vocabulary: contentDecisionVocabulary });
    expect(result.failureCodes).toEqual(["orphan_reference", "missing_evidence"]);
  });

  it("reports stale validation without mutating the decision", () => {
    const stale = { ...decision, lastValidatedAt: "2020-01-01T00:00:00.000Z", validationStatus: "valid" as const };
    const result = validateContentDecision(stale, { vocabulary: contentDecisionVocabulary, now: "2026-07-25T00:00:00.000Z", maxAgeDays: 30 });
    expect(result.failureCodes).toEqual(["stale_validation"]);
    expect(stale.lastValidatedAt).toBe("2020-01-01T00:00:00.000Z");
  });
});
