type ChiefOfStaffActionCategory =
  | "publish_more_evidence"
  | "stop_publishing"
  | "improve_conversion_path"
  | "repair_visibility_gap"
  | "repair_inventory_gap"
  | "refresh_authority_asset"
  | "request_human_review"
  | "tighten_internal_links"
  | "improve_measurement";

export type OperatingCycleTrigger =
  | "weekly_observation"
  | "content_published"
  | "measurement_window_closed"
  | "material_signal_change"
  | "manual_trigger";

export type ObservationFreshness = "fresh" | "stale" | "missing";

export type MeasurementWindowStatus = "pending_deployment" | "open" | "closed";

export interface SystemSnapshotInput {
  observedAt: string;
  trigger: OperatingCycleTrigger;
  publishedProblemPages: string[];
  draftProblemPages: string[];
  latestVisibilityObservationAt: string | null;
  gscLiveAccess: "available" | "unavailable";
  vercelLiveAccess: "available" | "unavailable";
  payloadLiveAccess: "available" | "unavailable";
  aiRecommendationVisibility: "unmeasured" | "measured";
}

export interface SystemSnapshot extends SystemSnapshotInput {
  visibilityObservationState: ObservationFreshness;
}

export interface OperatingCycleNextBestAction {
  category: ChiefOfStaffActionCategory;
  title: string;
  targetIds: string[];
  owner: string;
  expectedImpact: string;
  requiredEvidence: string[];
  humanApprovalRequired: boolean;
  stopPoint: string;
  nextReviewAt: string;
  whatNotToDo: string[];
}

export interface OperatingCycleMeasurementWindowInput {
  status?: MeasurementWindowStatus;
  requiredDeploymentReference?: string;
  deploymentReference?: string;
  intendedStartCondition: string;
  intendedDurationOrMinimumSample: string;
}

export interface OperatingCycleMeasurementWindow {
  status: MeasurementWindowStatus;
  requiredDeploymentReference?: string;
  deploymentReference?: string;
  intendedStartCondition: string;
  intendedDurationOrMinimumSample: string;
}

export interface ProductionDirectiveExecutionState {
  directiveId: string;
  cluster: string;
  targetKnowledgeAssets: number;
  maxDrafts: number;
  reviewWipLimit: number;
  currentReviewWip: number;
  consumedInsightIds: string[];
  createdKnowledgeAssetIds: string[];
  createdDraftIds: string[];
  blockedCandidates: Array<{ insightId: string; reason: string }>;
  stopPoint: string;
}

export interface OperatingCycleInput {
  trigger: OperatingCycleTrigger;
  observedAt: string;
  snapshot: SystemSnapshot;
  currentState: string;
  bottleneck: string;
  supportingEvidence: string[];
  nextBestAction: OperatingCycleNextBestAction;
  supportingRecommendations: string[];
  measurementWindow: OperatingCycleMeasurementWindowInput;
  productionDirective?: ProductionDirectiveExecutionState;
}

export interface OperatingCycle {
  cycleId: string;
  trigger: OperatingCycleTrigger;
  observedAt: string;
  snapshot: SystemSnapshot;
  currentState: string;
  bottleneck: string;
  supportingEvidence: string[];
  nextBestAction: OperatingCycleNextBestAction;
  supportingRecommendations: string[];
  measurementWindow: OperatingCycleMeasurementWindow;
  humanApprovalRequired: boolean;
  stopPoint: string;
  nextReviewAt: string;
  whatNotToDo: string[];
  revision: number;
  productionDirective?: ProductionDirectiveExecutionState;
}

function normalizeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function daysBetween(later: Date, earlier: Date): number {
  return Math.floor((later.getTime() - earlier.getTime()) / (1000 * 60 * 60 * 24));
}

function determineObservationFreshness(observedAt: string, latestVisibilityObservationAt: string | null): ObservationFreshness {
  if (!latestVisibilityObservationAt) {
    return "missing";
  }

  const observedDate = new Date(observedAt);
  const latestDate = new Date(latestVisibilityObservationAt);

  if (Number.isNaN(observedDate.getTime()) || Number.isNaN(latestDate.getTime())) {
    return "missing";
  }

  return daysBetween(observedDate, latestDate) > 30 ? "stale" : "fresh";
}

export function buildSystemSnapshot(input: SystemSnapshotInput): SystemSnapshot {
  return {
    ...input,
    visibilityObservationState: determineObservationFreshness(input.observedAt, input.latestVisibilityObservationAt),
  };
}

function buildCycleId(input: OperatingCycleInput): string {
  return [
    normalizeSlug(input.trigger),
    input.observedAt,
    normalizeSlug(input.currentState),
    normalizeSlug(input.bottleneck),
    normalizeSlug(input.nextBestAction.category),
    normalizeSlug(input.nextBestAction.title),
  ].join(":");
}

function resolveMeasurementWindow(input: OperatingCycleMeasurementWindowInput): OperatingCycleMeasurementWindow {
  const status = input.status ?? (input.deploymentReference ? "open" : "pending_deployment");

  return {
    status,
    requiredDeploymentReference: input.requiredDeploymentReference,
    deploymentReference: input.deploymentReference,
    intendedStartCondition: input.intendedStartCondition,
    intendedDurationOrMinimumSample: input.intendedDurationOrMinimumSample,
  };
}

export function buildOperatingCycle(input: OperatingCycleInput): OperatingCycle {
  const measurementWindow = resolveMeasurementWindow(input.measurementWindow);
  const humanApprovalRequired = input.nextBestAction.humanApprovalRequired;

  return {
    cycleId: buildCycleId(input),
    trigger: input.trigger,
    observedAt: input.observedAt,
    snapshot: input.snapshot,
    currentState: input.currentState,
    bottleneck: input.bottleneck,
    supportingEvidence: [...input.supportingEvidence],
    nextBestAction: input.nextBestAction,
    supportingRecommendations: [...input.supportingRecommendations],
    measurementWindow,
    humanApprovalRequired,
    stopPoint: input.nextBestAction.stopPoint,
    nextReviewAt: input.nextBestAction.nextReviewAt,
    whatNotToDo: [...input.nextBestAction.whatNotToDo],
    revision: 1,
    productionDirective: input.productionDirective,
  };
}

export function resumeOperatingCycle(previous: OperatingCycle, input: { observedAt: string; snapshot: SystemSnapshot }): OperatingCycle {
  return {
    ...previous,
    observedAt: input.observedAt,
    snapshot: input.snapshot,
    revision: previous.revision + 1,
  };
}
