import { z } from "zod";

const nonEmpty = z.string().trim().min(1);
const nonEmptyList = z.array(nonEmpty).min(1);
const urls = z.array(z.string().url()).default([]);

export const authorityClaimSchema = z.object({
  text: nonEmpty,
  evidenceUrls: urls,
  targetQueries: nonEmptyList,
  targetEntities: nonEmptyList,
}).strict();

export const approvedInsightSchema = z.object({
  id: nonEmpty,
  sourceTitle: nonEmpty,
  sourceType: z.enum(["voice_memo", "interview", "review", "note", "approved_quote"]),
  status: z.literal("approved"),
  capturedAt: z.string().datetime(),
  approvedAt: z.string().datetime(),
  approvedBy: nonEmpty,
  freshnessExpiresAt: z.string().datetime(),
  summary: nonEmpty,
  rawText: nonEmpty.optional(),
  claims: z.array(authorityClaimSchema).min(1),
  evidenceUrls: urls,
  entityTags: nonEmptyList,
  targetQueries: nonEmptyList,
  sourceUrls: urls,
}).strict();

export const knowledgeAssetSchema = z.object({
  id: nonEmpty,
  sourceInsightIds: nonEmptyList,
  claims: z.array(authorityClaimSchema).min(1),
  title: nonEmpty,
  shortAnswer: nonEmpty,
  targetQueries: nonEmptyList,
  targetEntities: nonEmptyList,
  reviewStatus: z.enum(["draft", "in_review", "approved", "rejected"]),
  reviewerNotes: nonEmpty.optional(),
}).strict();

export const authorityContentTypeSchema = z.enum([
  "entity",
  "pillar",
  "cluster",
  "framework",
  "case_study",
  "faq",
  "glossary",
  "lead_magnet",
  "problem",
]);

export const authorityContentSchema = z.object({
  id: nonEmpty,
  contentType: authorityContentTypeSchema,
  title: nonEmpty,
  slug: nonEmpty,
  body: nonEmpty,
  targetQueries: nonEmptyList,
  targetEntities: nonEmptyList,
  sourceInsightIds: nonEmptyList,
  status: z.enum(["draft", "in_review", "approved", "published", "archived"]),
}).strict();

export const visibilityObservationSchema = z.object({
  id: nonEmpty,
  query: nonEmpty,
  platform: nonEmpty,
  checkedAt: z.string().datetime(),
  rawAnswer: nonEmpty,
  recommendationLevel: z.number().int().min(0).max(5),
  recommendationPosition: z.number().int().positive().optional(),
  mentionedEntities: z.array(nonEmpty).default([]),
  citedUrls: urls,
  competitorNames: z.array(nonEmpty).default([]),
}).strict();

export const publicationReasonCodeSchema = z.enum([
  "draft_not_indexable",
  "draft_not_in_sitemap",
  "draft_not_in_llms_txt",
  "published_not_human_approved",
  "published_missing_canonical_url",
  "published_noindex_conflict",
  "publication_surface_conflict",
  "schema_ineligible",
]);

export const publicationDecisionSchema = z
  .object({
    lifecycleStatus: z.enum(["draft", "review", "published", "archived"]),
    humanApproved: z.boolean(),
    publiclyAccessible: z.boolean(),
    indexable: z.boolean(),
    sitemapEligible: z.boolean(),
    llmsTxtEligible: z.boolean(),
    canonicalUrl: z.string().url().nullable(),
    schemaEligible: z.boolean(),
    reasonCodes: z.array(publicationReasonCodeSchema).default([]),
  })
  .strict();

export const operatingCycleTriggerSchema = z.enum([
  "weekly_observation",
  "content_published",
  "measurement_window_closed",
  "material_signal_change",
  "manual_trigger",
]);

export const systemSnapshotSchema = z
  .object({
    observedAt: z.string().datetime(),
    trigger: operatingCycleTriggerSchema,
    publishedProblemPages: z.array(z.string().trim().startsWith("/problems/")).default([]),
    draftProblemPages: z.array(z.string().trim().startsWith("/problems/")).default([]),
    latestVisibilityObservationAt: z.string().datetime().nullable(),
    visibilityObservationState: z.enum(["fresh", "stale", "missing"]),
    gscLiveAccess: z.enum(["available", "unavailable"]),
    vercelLiveAccess: z.enum(["available", "unavailable"]),
    payloadLiveAccess: z.enum(["available", "unavailable"]),
    aiRecommendationVisibility: z.enum(["unmeasured", "measured"]),
  })
  .strict();

export const operatingCycleNextBestActionSchema = z
  .object({
    category: z.enum([
      "publish_more_evidence",
      "stop_publishing",
      "improve_conversion_path",
      "repair_visibility_gap",
      "repair_inventory_gap",
      "refresh_authority_asset",
      "request_human_review",
      "tighten_internal_links",
      "improve_measurement",
    ]),
    title: z.string().trim().min(1),
    targetIds: z.array(z.string().trim().min(1)).min(1),
    owner: z.string().trim().min(1),
    expectedImpact: z.string().trim().min(1),
    requiredEvidence: z.array(z.string().trim().min(1)).min(1),
    humanApprovalRequired: z.boolean(),
    stopPoint: z.string().trim().min(1),
    nextReviewAt: z.string().datetime(),
    whatNotToDo: z.array(z.string().trim().min(1)).min(1),
  })
  .strict();

export const operatingCycleMeasurementWindowSchema = z
  .object({
    status: z.enum(["pending_deployment", "open", "closed"]),
    requiredDeploymentReference: z.string().trim().optional(),
    deploymentReference: z.string().trim().optional(),
    intendedStartCondition: z.string().trim().min(1),
    intendedDurationOrMinimumSample: z.string().trim().min(1),
  })
  .strict();

export const productionDirectiveExecutionStateSchema = z
  .object({
    directiveId: z.string().trim().min(1),
    cluster: z.string().trim().min(1),
    targetKnowledgeAssets: z.number().int().nonnegative(),
    maxDrafts: z.number().int().nonnegative(),
    reviewWipLimit: z.number().int().nonnegative(),
    currentReviewWip: z.number().int().nonnegative(),
    consumedInsightIds: z.array(z.string().trim().min(1)),
    createdKnowledgeAssetIds: z.array(z.string().trim().min(1)),
    createdDraftIds: z.array(z.string().trim().min(1)),
    blockedCandidates: z.array(
      z.object({ insightId: z.string().trim().min(1), reason: z.string().trim().min(1) }).strict(),
    ),
    stopPoint: z.string().trim().min(1),
  })
  .strict();

export const operatingCycleSchema = z
  .object({
    cycleId: z.string().trim().min(1),
    trigger: operatingCycleTriggerSchema,
    observedAt: z.string().datetime(),
    snapshot: systemSnapshotSchema,
    currentState: z.string().trim().min(1),
    bottleneck: z.string().trim().min(1),
    supportingEvidence: z.array(z.string().trim().min(1)).default([]),
    nextBestAction: operatingCycleNextBestActionSchema,
    supportingRecommendations: z.array(z.string().trim().min(1)).default([]),
    measurementWindow: operatingCycleMeasurementWindowSchema,
    humanApprovalRequired: z.boolean(),
    stopPoint: z.string().trim().min(1),
    nextReviewAt: z.string().datetime(),
    whatNotToDo: z.array(z.string().trim().min(1)).min(1),
    revision: z.number().int().nonnegative(),
    productionDirective: productionDirectiveExecutionStateSchema.optional(),
  })
  .strict();

export type AuthorityClaim = z.infer<typeof authorityClaimSchema>;
export type ApprovedInsight = z.infer<typeof approvedInsightSchema>;
export type KnowledgeAsset = z.infer<typeof knowledgeAssetSchema>;
export type AuthorityContent = z.infer<typeof authorityContentSchema>;
export type VisibilityObservation = z.infer<typeof visibilityObservationSchema>;
export type PublicationDecision = z.infer<typeof publicationDecisionSchema>;
export type OperatingCycle = z.infer<typeof operatingCycleSchema>;
