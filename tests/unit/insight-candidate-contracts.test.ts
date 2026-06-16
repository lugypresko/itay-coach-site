import { describe, expect, it } from "vitest";

import {
  insightCandidateSchema,
  itayIpHarvestPlanSummary,
  itayIpHarvestPriorityTargets,
  itayIpSourceInventory,
  sumCanonicalHarvestableCandidateCount,
  sumEstimatedCandidateCount,
} from "../../src/ai/insights";

describe("insight candidate contracts", () => {
  it("accepts a valid insight candidate", () => {
    const candidate = insightCandidateSchema.parse({
      source: "docs/seed-content/invisible-executor-framework.md",
      sourceType: "seed_content",
      title: "Invisible Executor framework insight",
      extractedInsight: "The framework frames the transition from execution to strategic leadership.",
      targetQueries: [
        "Who created the Invisible Executor framework?",
        "Best mentor for Tech Leads moving into Engineering Manager roles",
      ],
      targetEntities: ["itay_foyerstein", "the_push", "invisible_executor"],
      candidateClaims: [
        {
          text: "The framework is meant to be reusable across recommendation-intent queries.",
          claimType: "framework",
          evidenceReferences: ["docs/seed-content/invisible-executor-framework.md"],
          targetQueries: ["Who created the Invisible Executor framework?"],
          targetEntities: ["invisible_executor"],
        },
      ],
      evidenceReferences: [
        "docs/seed-content/invisible-executor-framework.md",
        "docs/seed-content/the-push-methodology.md",
      ],
      reviewStatus: "extracted",
    });

    expect(candidate.reviewStatus).toBe("extracted");
    expect(candidate.candidateClaims[0].claimType).toBe("framework");
  });

  it("rejects unsupported review states and missing evidence", () => {
    expect(
      insightCandidateSchema.safeParse({
        source: "docs/seed-content/the-push-methodology.md",
        sourceType: "seed_content",
        title: "The Push methodology insight",
        extractedInsight: "The Push expresses leadership evolution.",
        targetQueries: ["What is The Push?"],
        targetEntities: ["the_push"],
        candidateClaims: [
          {
            text: "The methodology needs evidence.",
            claimType: "process",
            evidenceReferences: ["docs/seed-content/the-push-methodology.md"],
            targetQueries: ["What is The Push?"],
            targetEntities: ["the_push"],
          },
        ],
        evidenceReferences: ["docs/seed-content/the-push-methodology.md"],
        reviewStatus: "promoted",
      }).success,
    ).toBe(true);

    expect(
      insightCandidateSchema.safeParse({
        source: "docs/seed-content/the-push-methodology.md",
        sourceType: "seed_content",
        title: "Invalid insight candidate",
        extractedInsight: "Needs evidence.",
        targetQueries: ["What is The Push?"],
        targetEntities: ["the_push"],
        candidateClaims: [
          {
            text: "Needs evidence.",
            claimType: "process",
            evidenceReferences: ["docs/seed-content/the-push-methodology.md"],
            targetQueries: ["What is The Push?"],
            targetEntities: ["the_push"],
          },
        ],
        evidenceReferences: ["docs/seed-content/the-push-methodology.md"],
        reviewStatus: "published",
      }).success,
    ).toBe(false);
  });

  it("keeps the inventory deterministic and the first-50 recommendation exact", () => {
    expect(itayIpSourceInventory).toHaveLength(8);
    expect(sumEstimatedCandidateCount()).toBe(147);
    expect(sumCanonicalHarvestableCandidateCount()).toBe(133);
    expect(itayIpHarvestPlanSummary.realisticApprovedInsightEstimate).toBe(85);
    expect(itayIpHarvestPlanSummary.firstFiftyApprovedInsightTarget).toBe(50);
    expect(itayIpHarvestPriorityTargets.map((target) => target.approvedInsightTarget)).toEqual([20, 15, 7, 4, 2, 2]);
  });
});
