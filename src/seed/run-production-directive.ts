import fs from "node:fs";
import path from "node:path";

import { approvedInsightRepository } from "../ai/insights";
import { buildOperatingCycle, buildSystemSnapshot } from "../ai/workflows/operating-cycle";
import { runProductionDirective } from "../ai/workflows/production-directive";
import { knowledgeAssetConversionSprintAssets } from "./knowledge-asset-conversion-sprint";

const now = "2026-07-12T20:00:00.000Z";

const snapshot = buildSystemSnapshot({
  observedAt: now,
  trigger: "manual_trigger",
  publishedProblemPages: ["/problems/cto-becomes-the-bottleneck", "/problems/vp-rnd-losing-execution-control"],
  draftProblemPages: [
    "/problems/engineering-managers-stuck-in-firefighting",
    "/problems/senior-developer-still-acting-like-a-developer",
    "/problems/ai-adoption-creates-more-work-not-leverage",
    "/problems/product-engineering-misalignment",
    "/problems/squads-depend-on-one-strong-manager",
    "/problems/busy-execution-without-business-results",
    "/problems/leadership-team-cannot-scale-decisions",
    "/problems/good-managers-burning-out-quietly",
  ],
  latestVisibilityObservationAt: null,
  gscLiveAccess: "unavailable",
  vercelLiveAccess: "unavailable",
  payloadLiveAccess: "unavailable",
  aiRecommendationVisibility: "unmeasured",
});

const cycle = buildOperatingCycle({
  trigger: "manual_trigger",
  observedAt: now,
  snapshot,
  currentState: "40 approved insights remain; bounded factory continuation is available",
  bottleneck: "missing executable factory continuation",
  supportingEvidence: ["TASK_060_AUTHORITY_FACTORY_ROOT_CAUSE_REPORT.md", "TASK_033_CONVERSION_REPORT.md"],
  nextBestAction: {
    category: "publish_more_evidence",
    title: "Run bounded Player Trap ProductionDirective",
    targetIds: ["Player Trap"],
    owner: "Engineering",
    expectedImpact: "Create differentiated review-ready authority assets for qualified discovery.",
    requiredEvidence: ["claim-level evidence", "unique canonical owner", "WIP availability"],
    humanApprovalRequired: true,
    stopPoint: "stop at scaffold or review-ready before publication",
    nextReviewAt: "2026-07-19T00:00:00.000Z",
    whatNotToDo: ["do not publish", "do not create a new page per insight automatically"],
  },
  supportingRecommendations: [],
  measurementWindow: {
    status: "pending_deployment",
    intendedStartCondition: "verified deployment and post-deployment observation",
    intendedDurationOrMinimumSample: "one observation window",
  },
});

const result = runProductionDirective({
  directive: {
    id: "directive-player-trap-2026-07-12-manual",
    cluster: "Player Trap",
    targetKnowledgeAssets: 3,
    maxDrafts: 3,
    reviewWipLimit: 3,
    currentReviewWip: 0,
    expiresAt: "2026-07-19T00:00:00.000Z",
  },
  insights: approvedInsightRepository,
  existingKnowledgeAssetSourceInsightIds: knowledgeAssetConversionSprintAssets.map((asset) => asset.sourceInsightId),
  existingCanonicalPaths: [
    "/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck",
    "/frameworks/invisible-executor",
    "/clusters/engineering-manager-coach-for-strategic-leadership",
  ],
  cycle,
  now,
  contentDecisions: [],
});

const reportPath = path.resolve(process.cwd(), "TASK_061_MANUAL_PRODUCTION_DIRECTIVE_RUN.md");
const report = `# Task 061 — Manual ProductionDirective Run

Run at: \`${now}\`  
Cluster: **${result.selectedCluster}**  
Directive: \`${result.cycle.productionDirective?.directiveId}\`

## Results

- Insights consumed: ${result.insightsConsumed.length} (${result.insightsConsumed.join(", ")})
- KnowledgeAssets created: ${result.knowledgeAssets.length} (${result.knowledgeAssets.map((asset) => asset.id).join(", ")})
- Scaffolds / review-ready outputs created: ${result.drafts.length} (${result.drafts.map((draft) => `${draft.id}:${draft.saveStatus}`).join(", ")})
- Final OperatingCycle stop point: \`${result.cycle.productionDirective?.stopPoint}\`
- Human approval required: \`${result.cycle.humanApprovalRequired}\`
- Measurement window: \`${result.cycle.measurementWindow.status}\`

## Draft status

All outputs stop at \`scaffold\`, \`needs_generation\`, \`needs_revision\`, or \`review_ready\`; no publication path was invoked.

## Blocked candidates

${result.blockedCandidates.length ? result.blockedCandidates.map((item) => `- ${item.insightId}: ${item.reason}`).join("\\n") : "- None"}

## Persisted execution state

The bounded execution state is attached to the returned \`OperatingCycle.productionDirective\` record. No Action Router, scheduler, AgentRun, ContentJob, deployment, or publication was used.
`;

fs.writeFileSync(reportPath, report, "utf8");
console.log(JSON.stringify({ reportPath, result }, null, 2));
