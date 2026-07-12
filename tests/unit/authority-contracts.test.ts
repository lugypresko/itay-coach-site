import { describe, expect, it } from "vitest";

import {
  approvedInsightSchema,
  authorityContentSchema,
  knowledgeAssetSchema,
  operatingCycleSchema,
  publicationDecisionSchema,
  visibilityObservationSchema,
} from "../../src/domain/authority-contracts";

const claim = {
  text: "Execution dependency limits strategic leadership.",
  evidenceUrls: ["https://example.com/source"],
  targetQueries: ["How do I stop being the bottleneck?"],
  targetEntities: ["itay_foyerstein"],
};

describe("canonical authority contracts", () => {
  it("accepts a fresh approved insight with claim-level evidence", () => {
    const result = approvedInsightSchema.safeParse({
      id: "insight-1",
      sourceTitle: "Approved interview",
      sourceType: "interview",
      status: "approved",
      capturedAt: "2026-07-01T00:00:00.000Z",
      approvedAt: "2026-07-02T00:00:00.000Z",
      approvedBy: "Itay Foyerstein",
      freshnessExpiresAt: "2026-12-01T00:00:00.000Z",
      summary: "A specific leadership insight.",
      claims: [claim],
      evidenceUrls: ["https://example.com/source"],
      entityTags: ["itay_foyerstein"],
      targetQueries: ["How do I stop being the bottleneck?"],
      sourceUrls: ["https://example.com/source"],
    });

    expect(result.success).toBe(true);
  });

  it("rejects approved insights without claims", () => {
    expect(() => approvedInsightSchema.parse({ claims: [] })).toThrow();
  });

  it("accepts a review-safe knowledge asset", () => {
    expect(knowledgeAssetSchema.parse({
      id: "asset-1",
      sourceInsightIds: ["insight-1"],
      claims: [claim],
      title: "Execution bottlenecks",
      shortAnswer: "Leadership must create progress without manager dependency.",
      targetQueries: ["How do I stop being the bottleneck?"],
      targetEntities: ["itay_foyerstein"],
      reviewStatus: "draft",
    }).reviewStatus).toBe("draft");
  });

  it("accepts one unified authority-content shape", () => {
    expect(authorityContentSchema.parse({
      id: "content-1",
      contentType: "framework",
      title: "Invisible Executor",
      slug: "invisible-executor",
      body: "Framework body",
      targetQueries: ["Who created the Invisible Executor framework?"],
      targetEntities: ["itay_foyerstein"],
      sourceInsightIds: ["insight-1"],
      status: "in_review",
    }).contentType).toBe("framework");
  });

  it("accepts an append-only visibility observation", () => {
    expect(visibilityObservationSchema.parse({
      id: "observation-1",
      query: "Best tech leadership coach",
      platform: "ChatGPT",
      checkedAt: "2026-07-12T00:00:00.000Z",
      rawAnswer: "Answer",
      recommendationLevel: 2,
      mentionedEntities: [],
      citedUrls: [],
      competitorNames: [],
    }).recommendationLevel).toBe(2);
  });

  it("accepts a publication decision contract with explicit reason codes", () => {
    expect(publicationDecisionSchema.parse({
      lifecycleStatus: "published",
      humanApproved: true,
      publiclyAccessible: true,
      indexable: true,
      sitemapEligible: true,
      llmsTxtEligible: true,
      canonicalUrl: "https://itayfoyerstein.com/problems/cto-becomes-the-bottleneck",
      schemaEligible: true,
      reasonCodes: [],
    }).indexable).toBe(true);
  });

  it("accepts an operating cycle contract with one active next best action", () => {
    expect(operatingCycleSchema.parse({
      cycleId: "manual_trigger:2026-07-12T10:00:00.000Z:publication_state_integrity:repair_visibility_gap:repair-publication-state-integrity",
      trigger: "manual_trigger",
      observedAt: "2026-07-12T10:00:00.000Z",
      snapshot: {
        observedAt: "2026-07-12T10:00:00.000Z",
        trigger: "manual_trigger",
        publishedProblemPages: ["/problems/cto-becomes-the-bottleneck"],
        draftProblemPages: ["/problems/good-managers-burning-out-quietly"],
        latestVisibilityObservationAt: "2026-07-12T08:00:00.000Z",
        visibilityObservationState: "fresh",
        gscLiveAccess: "unavailable",
        vercelLiveAccess: "unavailable",
        payloadLiveAccess: "unavailable",
        aiRecommendationVisibility: "unmeasured",
      },
      currentState: "publication_state_integrity",
      bottleneck: "publication_state_integrity",
      supportingEvidence: ["draft pages are leaking into discovery surfaces"],
      nextBestAction: {
        category: "repair_visibility_gap",
        title: "Repair publication-state integrity",
        targetIds: ["problems:cto-becomes-the-bottleneck"],
        owner: "Engineering",
        expectedImpact: "Restore consistent discovery surfaces.",
        requiredEvidence: ["shared publication decision helper in use"],
        humanApprovalRequired: true,
        stopPoint: "wait_for_human_publication_approval",
        nextReviewAt: "2026-07-13T00:00:00.000Z",
        whatNotToDo: ["Do not publish drafts automatically."],
      },
      supportingRecommendations: ["Keep the recommendation layer deterministic."],
      measurementWindow: {
        status: "pending_deployment",
        requiredDeploymentReference: "deployment identifier or timestamp",
        intendedStartCondition: "After verified deployment.",
        intendedDurationOrMinimumSample: "One post-deployment observation window.",
      },
      humanApprovalRequired: true,
      stopPoint: "wait_for_human_publication_approval",
      nextReviewAt: "2026-07-13T00:00:00.000Z",
      whatNotToDo: ["Do not publish drafts automatically."],
      revision: 1,
    }).measurementWindow.status).toBe("pending_deployment");
  });
});
