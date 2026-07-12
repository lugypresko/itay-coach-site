import { describe, expect, it } from "vitest";

import { buildOperatingCycle, buildSystemSnapshot, resumeOperatingCycle } from "../../src/ai/workflows/operating-cycle";

describe("operating cycle", () => {
  it("records a single next best action and a pending deployment measurement window during local verification", () => {
    const snapshot = buildSystemSnapshot({
      observedAt: "2026-07-12T10:00:00.000Z",
      trigger: "manual_trigger",
      publishedProblemPages: [
        "/problems/cto-becomes-the-bottleneck",
        "/problems/vp-rnd-losing-execution-control",
      ],
      draftProblemPages: [
        "/problems/good-managers-burning-out-quietly",
      ],
      latestVisibilityObservationAt: "2026-07-12T08:00:00.000Z",
      gscLiveAccess: "unavailable",
      vercelLiveAccess: "unavailable",
      payloadLiveAccess: "unavailable",
      aiRecommendationVisibility: "unmeasured",
    });

    const cycle = buildOperatingCycle({
      trigger: "manual_trigger",
      observedAt: "2026-07-12T10:00:00.000Z",
      snapshot,
      currentState: "publication_state_integrity",
      bottleneck: "publication_state_integrity",
      supportingEvidence: ["9 problem pages noindex in production", "draft pages present in sitemap"],
      nextBestAction: {
        category: "repair_visibility_gap",
        title: "Repair publication-state integrity",
        targetIds: ["problems:cto-becomes-the-bottleneck", "problems:vp-rnd-losing-execution-control"],
        owner: "Engineering",
        expectedImpact: "Restore trustworthy discovery surfaces before opening a measurement window.",
        requiredEvidence: ["shared publication decision passes", "drafts removed from sitemap and llms.txt"],
        humanApprovalRequired: true,
        stopPoint: "wait_for_human_publication_approval",
        nextReviewAt: "2026-07-13T00:00:00.000Z",
        whatNotToDo: ["Do not publish drafts automatically.", "Do not open a live measurement window locally."],
      },
      supportingRecommendations: [
        "Use one shared publication decision helper across route metadata, sitemap, and llms.txt.",
      ],
      measurementWindow: {
        status: "pending_deployment",
        requiredDeploymentReference: "deployment identifier or timestamp from an authorized deploy",
        intendedStartCondition: "Open only after verified production deployment of the repaired publication state.",
        intendedDurationOrMinimumSample: "At least one post-deployment observation window.",
      },
    });

    expect(cycle.nextBestAction.category).toBe("repair_visibility_gap");
    expect(cycle.supportingRecommendations).toHaveLength(1);
    expect(cycle.measurementWindow.status).toBe("pending_deployment");
    expect(cycle.measurementWindow.requiredDeploymentReference).toContain("deployment identifier");
    expect(cycle.humanApprovalRequired).toBe(true);
    expect(cycle.stopPoint).toBe("wait_for_human_publication_approval");
  });

  it("resumes deterministically from the last stop point without creating a second active action", () => {
    const snapshot = buildSystemSnapshot({
      observedAt: "2026-07-12T10:00:00.000Z",
      trigger: "weekly_observation",
      publishedProblemPages: [
        "/problems/cto-becomes-the-bottleneck",
        "/problems/vp-rnd-losing-execution-control",
      ],
      draftProblemPages: [],
      latestVisibilityObservationAt: null,
      gscLiveAccess: "unavailable",
      vercelLiveAccess: "unavailable",
      payloadLiveAccess: "unavailable",
      aiRecommendationVisibility: "unmeasured",
    });

    const cycle = buildOperatingCycle({
      trigger: "weekly_observation",
      observedAt: "2026-07-12T10:00:00.000Z",
      snapshot,
      currentState: "observation_gap",
      bottleneck: "stale_or_missing_observations",
      supportingEvidence: ["latest visibility observation is missing"],
      nextBestAction: {
        category: "improve_measurement",
        title: "Repair measurement coverage",
        targetIds: ["visibility:latest-observation"],
        owner: "Visibility",
        expectedImpact: "Restore a trustworthy baseline for the next decision cycle.",
        requiredEvidence: ["fresh observation window opened", "latest visibility observation recorded"],
        humanApprovalRequired: false,
        stopPoint: "wait_for_new_observation",
        nextReviewAt: "2026-07-19T00:00:00.000Z",
        whatNotToDo: ["Do not create a second active action.", "Do not infer AI recommendation visibility."],
      },
      supportingRecommendations: [],
      measurementWindow: {
        status: "open",
        deploymentReference: "dpl_verified_2026_07_12_1000",
        intendedStartCondition: "Production deployment has already been verified.",
        intendedDurationOrMinimumSample: "Minimum sample window is open.",
      },
    });

    const resumed = resumeOperatingCycle(cycle, {
      observedAt: "2026-07-12T11:00:00.000Z",
      snapshot: {
        ...snapshot,
        observedAt: "2026-07-12T11:00:00.000Z",
      },
    });

    expect(resumed.cycleId).toBe(cycle.cycleId);
    expect(resumed.stopPoint).toBe(cycle.stopPoint);
    expect(resumed.nextBestAction.title).toBe(cycle.nextBestAction.title);
    expect(resumed.revision).toBe(cycle.revision + 1);
  });

  it("marks stale and missing visibility observations explicitly", () => {
    const missingSnapshot = buildSystemSnapshot({
      observedAt: "2026-07-12T10:00:00.000Z",
      trigger: "material_signal_change",
      publishedProblemPages: [],
      draftProblemPages: [],
      latestVisibilityObservationAt: null,
      gscLiveAccess: "unavailable",
      vercelLiveAccess: "unavailable",
      payloadLiveAccess: "unavailable",
      aiRecommendationVisibility: "unmeasured",
    });

    const staleSnapshot = buildSystemSnapshot({
      observedAt: "2026-07-12T10:00:00.000Z",
      trigger: "material_signal_change",
      publishedProblemPages: [],
      draftProblemPages: [],
      latestVisibilityObservationAt: "2026-06-01T10:00:00.000Z",
      gscLiveAccess: "unavailable",
      vercelLiveAccess: "unavailable",
      payloadLiveAccess: "unavailable",
      aiRecommendationVisibility: "unmeasured",
    });

    expect(missingSnapshot.visibilityObservationState).toBe("missing");
    expect(staleSnapshot.visibilityObservationState).toBe("stale");
  });
});
