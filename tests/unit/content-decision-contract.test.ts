import { describe, expect, it } from "vitest";

import { contentDecisionSchema } from "../../src/ai/content-decision/contracts";

const validDecision = {
  id: "decision-em-bottleneck",
  decisionVersion: 1,
  pagePatternId: "problem_page" as const,
  contentArchetype: "problem" as const,
  primaryAudienceEntityId: "engineering-manager",
  primaryProblemId: "execution-bottleneck",
  symptomIds: ["approval-dependency", "strategic-time-collapse"],
  primaryFrameworkEntityId: "invisible-executor-framework",
  primaryOfferId: "the-push-coaching",
  primaryCtaId: "book-fit-call",
  journeyStage: "coach_intent",
  claimIds: ["claim-leaders-become-default-route"],
  evidenceIds: ["evidence-approved-insight-player-trap"],
  canonicalPath: "/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck",
  sourceInsightIds: ["approved-insight-player-trap-05"],
  status: "draft",
  lastValidatedAt: null,
  validationStatus: "unvalidated",
};

describe("ContentDecision contract", () => {
  it("accepts the explicit versioned ID-based decision shape", () => {
    expect(contentDecisionSchema.parse(validDecision)).toEqual(validDecision);
  });

  it("rejects a decision that replaces canonical IDs with prose", () => {
    expect(() => contentDecisionSchema.parse({ ...validDecision, primaryOfferId: "Book a coaching call" })).toThrow();
  });

  it("rejects an invalid validation timestamp", () => {
    expect(() => contentDecisionSchema.parse({ ...validDecision, lastValidatedAt: "yesterday" })).toThrow();
  });
});
