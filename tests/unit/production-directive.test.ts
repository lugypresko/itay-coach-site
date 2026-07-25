import { describe, expect, it } from "vitest";

import { approvedInsightRepository } from "../../src/ai/insights";
import { buildSystemSnapshot, buildOperatingCycle } from "../../src/ai/workflows/operating-cycle";
import { runProductionDirective } from "../../src/ai/workflows/production-directive";

const bottleneckDecision = {
  id: "decision-production-bottleneck",
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
  canonicalPath: "/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck",
  sourceInsightIds: [
    "approved-insight-player-trap-01",
    "approved-insight-player-trap-02",
    "approved-insight-player-trap-03",
    "approved-insight-player-trap-04",
    "approved-insight-player-trap-05",
    "approved-insight-player-trap-06",
    "approved-insight-player-trap-07",
  ],
  status: "active" as const,
  lastValidatedAt: "2026-07-12T00:00:00.000Z",
  validationStatus: "valid" as const,
};

function baseCycle() {
  const observedAt = "2026-07-12T00:00:00.000Z";
  const snapshot = buildSystemSnapshot({
    observedAt,
    trigger: "manual_trigger",
    publishedProblemPages: [],
    draftProblemPages: [],
    latestVisibilityObservationAt: null,
    gscLiveAccess: "unavailable",
    vercelLiveAccess: "unavailable",
    payloadLiveAccess: "unavailable",
    aiRecommendationVisibility: "unmeasured",
  });

  return buildOperatingCycle({
    trigger: "manual_trigger",
    observedAt,
    snapshot,
    currentState: "authority factory ready for bounded continuation",
    bottleneck: "content production throughput",
    supportingEvidence: ["TASK_060_AUTHORITY_FACTORY_ROOT_CAUSE_REPORT.md"],
    nextBestAction: {
      category: "publish_more_evidence",
      title: "Run one bounded Player Trap production directive",
      targetIds: ["Player Trap"],
      owner: "Engineering",
      expectedImpact: "Create review-ready authority assets for qualified discovery.",
      requiredEvidence: ["claim-level evidence", "unique canonical ownership"],
      humanApprovalRequired: true,
      stopPoint: "stop before publication",
      nextReviewAt: "2026-07-19T00:00:00.000Z",
      whatNotToDo: ["do not publish"],
    },
    supportingRecommendations: [],
    measurementWindow: {
      status: "pending_deployment",
      intendedStartCondition: "verified deployment",
      intendedDurationOrMinimumSample: "one observation window",
    },
  });
}

describe("bounded ProductionDirective executor", () => {
  it("consumes one eligible insight and produces one review-ready canonical draft", () => {
    const result = runProductionDirective({
      directive: {
        id: "directive-player-trap-2026-07-12",
        cluster: "Player Trap",
        targetKnowledgeAssets: 1,
        maxDrafts: 1,
        reviewWipLimit: 1,
        currentReviewWip: 0,
        expiresAt: "2026-07-19T00:00:00.000Z",
      },
      insights: approvedInsightRepository,
      existingKnowledgeAssetSourceInsightIds: [
        "approved-insight-player-trap-01",
        "approved-insight-player-trap-02",
        "approved-insight-player-trap-03",
        "approved-insight-player-trap-04",
      ],
      existingCanonicalPaths: ["/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck"],
      cycle: baseCycle(),
      now: "2026-07-12T00:00:00.000Z",
      contentDecisions: [bottleneckDecision],
    });

    expect(result.selectedCluster).toBe("Player Trap");
    expect(result.knowledgeAssets).toHaveLength(1);
    expect(result.drafts).toHaveLength(1);
    expect(result.insightsConsumed).toEqual(["approved-insight-player-trap-05"]);
    expect(result.drafts[0]?.id).toBe("authority-draft-approved-insight-player-trap-05");
    expect(result.drafts[0]?.pageBrief.canonicalPath).toBe("/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck");
    expect(result.drafts[0]?.pageBrief.reviewStatus).toBe("draft");
    expect(result.drafts[0]?.draft.maturity).toBe("review_ready");
    expect(result.drafts[0]?.saveStatus).toBe("review_ready");
    expect(result.drafts[0]?.draft.content).not.toMatch(/\bthe page (?:starts|explains)\b/i);
    expect(result.drafts[0]?.draft.content).toContain("[Tech Leadership Coaching](/pillars/tech-leadership-coaching)");
    expect(result.drafts[0]?.draft.content).toContain("[Book a fit call](/book-a-fit-call)");
    expect(result.drafts[0]?.draft.claimEvidenceMappings?.length).toBeGreaterThanOrEqual(5);
    expect(result.drafts[0]?.compliance.passed).toBe(true);
    expect(result.drafts[0]?.quality.dimensions).toHaveLength(8);
    expect(result.drafts[0]?.quality.dimensions.every((dimension) => dimension.passed)).toBe(true);
    expect(result.blockedCandidates).toHaveLength(0);
    expect(result.cycle.productionDirective?.stopPoint).toBe("directive_target_reached");
    expect(result.cycle.productionDirective?.consumedInsightIds).toHaveLength(1);
  });

  it("stops at the review WIP limit and records blocked candidates", () => {
    const result = runProductionDirective({
      directive: {
        id: "directive-player-trap-wip",
        cluster: "Player Trap",
        targetKnowledgeAssets: 3,
        maxDrafts: 3,
        reviewWipLimit: 2,
        currentReviewWip: 2,
        expiresAt: "2026-07-19T00:00:00.000Z",
      },
      insights: approvedInsightRepository,
      existingKnowledgeAssetSourceInsightIds: [],
      existingCanonicalPaths: [],
      cycle: baseCycle(),
      now: "2026-07-12T00:00:00.000Z",
      contentDecisions: [],
    });

    expect(result.knowledgeAssets).toHaveLength(0);
    expect(result.drafts).toHaveLength(0);
    expect(result.blockedCandidates[0]?.reason).toBe("review_wip_limit_reached");
    expect(result.cycle.productionDirective?.stopPoint).toBe("review_wip_limit_reached");
  });

  it("blocks a claim without evidence and does not publish", () => {
    const result = runProductionDirective({
      directive: {
        id: "directive-evidence-block",
        cluster: "Player Trap",
        targetKnowledgeAssets: 1,
        maxDrafts: 1,
        reviewWipLimit: 1,
        currentReviewWip: 0,
        expiresAt: "2026-07-19T00:00:00.000Z",
      },
      insights: [
        {
          ...approvedInsightRepository[0],
          sourceTitle: "",
          reviewerNotes: "",
          claims: [{ ...approvedInsightRepository[0].claims[0], evidenceUrls: [] }],
          evidenceUrls: [],
          sourceUrls: [],
        },
      ],
      existingKnowledgeAssetSourceInsightIds: [],
      existingCanonicalPaths: [],
      cycle: baseCycle(),
      now: "2026-07-12T00:00:00.000Z",
      contentDecisions: [],
    });

    expect(result.knowledgeAssets).toHaveLength(0);
    expect(result.drafts).toHaveLength(0);
    expect(result.blockedCandidates[0]?.reason).toBe("insufficient_evidence");
    expect(result.cycle.humanApprovalRequired).toBe(true);
  });
});
