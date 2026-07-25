import { describe, expect, it } from "vitest";

import { validateContentDecisions } from "../../src/ai/content-decision/validate-content-decision";
import { contentDecisionVocabulary } from "../../src/ai/content-decision/vocabulary";

const base = {
  id: "decision-one",
  decisionVersion: 1,
  primaryAudienceEntityId: "engineering-manager",
  primaryProblemId: "execution-bottleneck",
  symptomIds: ["approval-dependency"],
  primaryFrameworkEntityId: "invisible-executor-framework",
  primaryOfferId: "the-push-coaching",
  primaryCtaId: "book-fit-call",
  journeyStage: "coach_intent" as const,
  claimIds: ["claim-leaders-become-default-route"],
  evidenceIds: ["evidence-approved-insight-player-trap"],
  canonicalPath: "/page-one",
  sourceInsightIds: ["approved-insight-player-trap-05"],
  status: "active" as const,
  lastValidatedAt: null,
  validationStatus: "unvalidated" as const,
};

describe("ContentDecision batch validator", () => {
  it("detects duplicate active canonical paths and conflicting versions", () => {
    const result = validateContentDecisions(
      [base, { ...base, id: "decision-two", decisionVersion: 2 }],
      { vocabulary: contentDecisionVocabulary },
    );
    expect(result.failureCodes).toEqual(["duplicate_canonical_path", "conflicting_active_version"]);
  });
});
