import { describe, expect, it } from "vitest";

import { resolveContentDecision } from "../../src/ai/content-decision/resolve-content-decision";
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

describe("ContentDecision resolver", () => {
  it("returns an explicit page subgraph without inferring from prose", () => {
    const result = resolveContentDecision([decision], decision.canonicalPath, contentDecisionVocabulary);
    expect(result).toMatchObject({
      decisionId: decision.id,
      canonicalPath: decision.canonicalPath,
      audienceEntityId: "engineering-manager",
      problemId: "execution-bottleneck",
      frameworkEntityId: "invisible-executor-framework",
    });
    expect(result.symptomIds).toEqual(decision.symptomIds);
  });

  it("fails when the requested canonical path has no explicit decision", () => {
    expect(() => resolveContentDecision([decision], "/unknown", contentDecisionVocabulary)).toThrow(
      "No explicit ContentDecision",
    );
  });
});
