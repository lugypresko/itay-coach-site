import { z } from "zod";

import { insightExtractionSourceTypeOptions } from "./insightExtractionContracts";

export const agentFactoryVersion = "1.0.0" as const;

export const agentFactoryAgentNameOptions = [
  "MarketIntelligenceAgent",
  "AudiencePainAgent",
  "SearchIntentAgent",
  "TopicClusterAgent",
  "ResearchSourceAgent",
  "SourceVerificationAgent",
  "FrameworkBuilderAgent",
  "OutlineAgent",
  "ContentWriterAgent",
  "LLMCitationAgent",
  "InternalLinkingAgent",
  "SchemaAgent",
  "BrandVoiceAgent",
  "QualityGateAgent",
  "PayloadPublisherAgent",
  "DistributionAgent",
] as const;

export type AgentFactoryAgentName = (typeof agentFactoryAgentNameOptions)[number];

export const agentFactoryPhaseOptions = [
  "discovery",
  "analysis",
  "authoring",
  "governance",
  "release",
  "distribution",
] as const;

export type AgentFactoryPhase = (typeof agentFactoryPhaseOptions)[number];

export const reviewStatusOptions = ["draft", "in_review", "approved", "rejected"] as const;

export type ReviewStatus = (typeof reviewStatusOptions)[number];

export const claimTypeOptions = [
  "factual",
  "research",
  "client_outcome",
  "framework",
  "opinion",
] as const;

export type ClaimType = (typeof claimTypeOptions)[number];

export const distributionChannelOptions = [
  "linkedin_post",
  "linkedin_carousel_outline",
  "email_teaser",
  "whatsapp_post",
  "short_video_script",
  "cta_variant",
  "retargeting_angle",
] as const;

export type DistributionChannel = (typeof distributionChannelOptions)[number];

export const performanceSignalTypeOptions = [
  "ai_mention",
  "ai_citation",
  "query_visibility",
  "page_view",
  "cta_click",
  "lead_source",
  "content_source",
  "assessment_completion",
  "diagnosis_call_request",
  "booked_call",
  "close_rate",
] as const;

export type PerformanceSignalType = (typeof performanceSignalTypeOptions)[number];

export const authorityOutcomeFocusOptions = [
  "authority_visibility",
  "content_inventory_health",
  "content_release_velocity",
  "lead_pipeline_quality",
  "player_trap_conversion",
  "search_visibility_health",
] as const;

export type AuthorityOutcomeFocus = (typeof authorityOutcomeFocusOptions)[number];

export const authorityOutcomeStatusOptions = ["healthy", "watch", "at_risk", "blocked"] as const;

export type AuthorityOutcomeStatus = (typeof authorityOutcomeStatusOptions)[number];

export const chiefOfStaffActionCategoryOptions = [
  "publish_more_evidence",
  "stop_publishing",
  "improve_conversion_path",
  "repair_visibility_gap",
  "repair_inventory_gap",
  "refresh_authority_asset",
  "request_human_review",
  "tighten_internal_links",
  "improve_measurement",
] as const;

export type ChiefOfStaffActionCategory = (typeof chiefOfStaffActionCategoryOptions)[number];

const nonEmptyStringSchema = z.string().trim().min(1);
const nonEmptyStringArraySchema = z.array(nonEmptyStringSchema).min(1);
const urlArraySchema = z.array(z.string().url()).default([]);

function futureDateSchema(fieldName: string): z.ZodString {
  return z
    .string()
    .datetime()
    .refine((value) => new Date(value).getTime() > Date.now(), {
      message: `${fieldName} must be in the future`,
    });
}

export const approvedInsightSchema = z
  .object({
    id: nonEmptyStringSchema,
    sourceTitle: nonEmptyStringSchema,
    sourceType: z.enum(insightExtractionSourceTypeOptions),
    status: z.literal("approved"),
    capturedAt: z.string().datetime(),
    approvedAt: z.string().datetime(),
    approvedBy: nonEmptyStringSchema,
    freshnessExpiresAt: futureDateSchema("freshnessExpiresAt"),
    summary: nonEmptyStringSchema,
    rawText: z.string().optional(),
    claims: z.array(
      z.object({
        text: nonEmptyStringSchema,
        evidenceUrls: z.array(z.string().url()),
        targetQueries: nonEmptyStringArraySchema,
        targetEntities: nonEmptyStringArraySchema,
      }),
    ).default([]),
    evidenceUrls: urlArraySchema,
    entityTags: z.array(nonEmptyStringSchema).default([]),
    targetQueries: nonEmptyStringArraySchema,
    targetRecommendationQueries: z.array(nonEmptyStringSchema).default([]),
    sourceUrls: urlArraySchema,
    authorityPurpose: z.string().trim().optional(),
    linkedContentJobId: nonEmptyStringSchema.optional(),
    reviewerNotes: z.string().trim().optional(),
  })
  .strict();

export type ApprovedInsight = z.infer<typeof approvedInsightSchema>;

export const approvedInsightClaimSchema = z
  .object({
    text: nonEmptyStringSchema,
    evidenceUrls: z.array(z.string().url()),
    targetQueries: nonEmptyStringArraySchema,
    targetEntities: nonEmptyStringArraySchema,
  })
  .strict();

export type ApprovedInsightClaim = z.infer<typeof approvedInsightClaimSchema>;

export const claimLedgerEntrySchema = z
  .object({
    id: nonEmptyStringSchema,
    claimType: z.enum(claimTypeOptions),
    claimText: nonEmptyStringSchema,
    sourceInsightId: nonEmptyStringSchema,
    evidenceUrls: urlArraySchema,
    targetQueries: z.array(nonEmptyStringSchema).default([]),
    targetEntities: z.array(nonEmptyStringSchema).default([]),
    reviewStatus: z.enum(reviewStatusOptions),
    notes: z.string().trim().optional(),
  })
  .strict();

export type ClaimLedgerEntry = z.infer<typeof claimLedgerEntrySchema>;

export const claimLedgerSchema = z
  .object({
    id: nonEmptyStringSchema,
    sourceInsightId: nonEmptyStringSchema,
    reviewStatus: z.enum(reviewStatusOptions),
    entries: z.array(claimLedgerEntrySchema).min(1),
  })
  .strict();

export type ClaimLedger = z.infer<typeof claimLedgerSchema>;

export const knowledgeAssetSchema = z
  .object({
    id: nonEmptyStringSchema,
    sourceInsightId: nonEmptyStringSchema,
    claimIds: nonEmptyStringArraySchema,
    targetQueries: nonEmptyStringArraySchema,
    targetEntities: nonEmptyStringArraySchema,
    shortAnswer: nonEmptyStringSchema,
    reviewStatus: z.enum(reviewStatusOptions),
    title: z.string().trim().optional(),
    summary: z.string().trim().optional(),
    evidenceUrls: urlArraySchema,
    sourceUrls: urlArraySchema,
    reviewerNotes: z.string().trim().optional(),
  })
  .strict();

export type KnowledgeAsset = z.infer<typeof knowledgeAssetSchema>;

export const pageBriefContentPlanItemSchema = z
  .object({
    sectionTitle: nonEmptyStringSchema,
    purpose: nonEmptyStringSchema,
    proofNeeded: nonEmptyStringArraySchema,
    notes: z.string().trim().optional(),
  })
  .strict();

export type PageBriefContentPlanItem = z.infer<typeof pageBriefContentPlanItemSchema>;

export const pageBriefMarketContextSchema = z
  .object({
    summary: nonEmptyStringSchema,
    marketMap: nonEmptyStringArraySchema,
    trendList: nonEmptyStringArraySchema,
    riskNotes: nonEmptyStringArraySchema,
  })
  .strict();

export type PageBriefMarketContext = z.infer<typeof pageBriefMarketContextSchema>;

export const pageBriefAudiencePainSchema = z
  .object({
    summary: nonEmptyStringSchema,
    painThemes: nonEmptyStringArraySchema,
    workarounds: nonEmptyStringArraySchema,
    triggerEvents: nonEmptyStringArraySchema,
  })
  .strict();

export type PageBriefAudiencePain = z.infer<typeof pageBriefAudiencePainSchema>;

export const pageBriefSearchIntentSchema = z
  .object({
    summary: nonEmptyStringSchema,
    intentClusters: nonEmptyStringArraySchema,
    priorityQueries: nonEmptyStringArraySchema,
  })
  .strict();

export type PageBriefSearchIntent = z.infer<typeof pageBriefSearchIntentSchema>;

export const pageBriefTopicClusterPositionSchema = z
  .object({
    summary: nonEmptyStringSchema,
    pillar: nonEmptyStringSchema,
    cluster: nonEmptyStringSchema.optional(),
    clusterRole: nonEmptyStringSchema,
    internalLinks: nonEmptyStringArraySchema,
  })
  .strict();

export type PageBriefTopicClusterPosition = z.infer<typeof pageBriefTopicClusterPositionSchema>;

export const pageBriefCtaSchema = z
  .object({
    label: nonEmptyStringSchema,
    href: z.string().trim().startsWith("/"),
    rationale: nonEmptyStringSchema,
  })
  .strict();

export type PageBriefCta = z.infer<typeof pageBriefCtaSchema>;

export const pageBriefSchema = z
  .object({
    id: nonEmptyStringSchema,
    sourceInsightIds: nonEmptyStringArraySchema,
    title: nonEmptyStringSchema,
    canonicalPath: z.string().trim().startsWith("/"),
    reviewStatus: z.enum(reviewStatusOptions),
    marketContext: pageBriefMarketContextSchema,
    audiencePain: pageBriefAudiencePainSchema,
    searchIntent: pageBriefSearchIntentSchema,
    topicClusterPosition: pageBriefTopicClusterPositionSchema,
    uniqueAngle: nonEmptyStringSchema,
    proofNeeded: nonEmptyStringArraySchema,
    pagePromise: nonEmptyStringSchema,
    contentPlan: z.array(pageBriefContentPlanItemSchema).min(1),
    cta: pageBriefCtaSchema,
    author: z.string().trim().optional(),
    reviewerNotes: z.string().trim().optional(),
  })
  .strict();

export type PageBrief = z.infer<typeof pageBriefSchema>;

export const distributionAssetSchema = z
  .object({
    id: nonEmptyStringSchema,
    knowledgeAssetId: nonEmptyStringSchema,
    channel: z.enum(distributionChannelOptions),
    reviewStatus: z.literal("draft"),
    title: nonEmptyStringSchema,
    body: nonEmptyStringSchema,
    targetQueries: nonEmptyStringArraySchema,
    targetEntities: nonEmptyStringArraySchema,
    promptVersion: nonEmptyStringSchema,
    phase: z.enum(agentFactoryPhaseOptions),
    reviewerNotes: z.string().trim().optional(),
  })
  .strict();

export type DistributionAsset = z.infer<typeof distributionAssetSchema>;

export const performanceSignalSchema = z
  .object({
    id: nonEmptyStringSchema,
    assetId: nonEmptyStringSchema,
    signalType: z.enum(performanceSignalTypeOptions),
    signalState: z.enum(["observed", "placeholder"]),
    observedAt: z.string().datetime(),
    source: nonEmptyStringSchema,
    value: z.number(),
    unit: z.string().trim().optional(),
    platform: z.string().trim().optional(),
    query: z.string().trim().optional(),
    notes: z.string().trim().optional(),
  })
  .strict();

export type PerformanceSignal = z.infer<typeof performanceSignalSchema>;

export const authorityOutcomeSchema = z
  .object({
    id: nonEmptyStringSchema,
    focus: z.enum(authorityOutcomeFocusOptions),
    title: nonEmptyStringSchema,
    status: z.enum(authorityOutcomeStatusOptions),
    summary: nonEmptyStringSchema,
    signalIds: nonEmptyStringArraySchema,
    signals: z.array(performanceSignalSchema).min(1),
    observedAt: z.string().datetime(),
    nextBestAction: nonEmptyStringSchema,
    ownerSuggestion: z.string().trim().optional(),
    reviewerNotes: z.string().trim().optional(),
  })
  .strict();

export type AuthorityOutcome = z.infer<typeof authorityOutcomeSchema>;

export const chiefOfStaffTrafficSnapshotSchema = z
  .object({
    sessions: z.number().nonnegative().optional(),
    users: z.number().nonnegative().optional(),
    topSource: z.string().trim().optional(),
    notes: z.string().trim().optional(),
  })
  .strict();

export type ChiefOfStaffTrafficSnapshot = z.infer<typeof chiefOfStaffTrafficSnapshotSchema>;

export const chiefOfStaffLeadSnapshotSchema = z
  .object({
    totalLeads: z.number().nonnegative().optional(),
    qualifiedLeads: z.number().nonnegative().optional(),
    bookedCalls: z.number().nonnegative().optional(),
    notes: z.string().trim().optional(),
  })
  .strict();

export type ChiefOfStaffLeadSnapshot = z.infer<typeof chiefOfStaffLeadSnapshotSchema>;

export const chiefOfStaffContentInventorySnapshotSchema = z
  .object({
    totalAssets: z.number().nonnegative().optional(),
    reviewReadyAssets: z.number().nonnegative().optional(),
    publishedAssets: z.number().nonnegative().optional(),
    notes: z.string().trim().optional(),
  })
  .strict();

export type ChiefOfStaffContentInventorySnapshot = z.infer<typeof chiefOfStaffContentInventorySnapshotSchema>;

export const chiefOfStaffPublishedAssetsSnapshotSchema = z
  .object({
    slugs: nonEmptyStringArraySchema,
    notes: z.string().trim().optional(),
  })
  .strict();

export type ChiefOfStaffPublishedAssetsSnapshot = z.infer<typeof chiefOfStaffPublishedAssetsSnapshotSchema>;

export const chiefOfStaffGscSnapshotSchema = z
  .object({
    queriesTracked: z.number().nonnegative().optional(),
    impressions: z.number().nonnegative().optional(),
    clicks: z.number().nonnegative().optional(),
    notes: z.string().trim().optional(),
  })
  .strict();

export type ChiefOfStaffGscSnapshot = z.infer<typeof chiefOfStaffGscSnapshotSchema>;

export const chiefOfStaffPlayerTrapFunnelSnapshotSchema = z
  .object({
    visits: z.number().nonnegative().optional(),
    completions: z.number().nonnegative().optional(),
    diagnosisCallRequests: z.number().nonnegative().optional(),
    bookedCalls: z.number().nonnegative().optional(),
    notes: z.string().trim().optional(),
  })
  .strict();

export type ChiefOfStaffPlayerTrapFunnelSnapshot = z.infer<typeof chiefOfStaffPlayerTrapFunnelSnapshotSchema>;

export const chiefOfStaffInputSchema = z
  .object({
    traffic: chiefOfStaffTrafficSnapshotSchema,
    leads: chiefOfStaffLeadSnapshotSchema,
    contentInventory: chiefOfStaffContentInventorySnapshotSchema,
    publishedAssets: chiefOfStaffPublishedAssetsSnapshotSchema,
    gsc: chiefOfStaffGscSnapshotSchema,
    playerTrapFunnel: chiefOfStaffPlayerTrapFunnelSnapshotSchema,
    authorityOutcomes: z.array(authorityOutcomeSchema).min(1),
    supportingSignals: z.array(performanceSignalSchema).default([]),
  })
  .strict();

export type ChiefOfStaffInput = z.infer<typeof chiefOfStaffInputSchema>;

export const chiefOfStaffRecommendationSchema = z
  .object({
    id: nonEmptyStringSchema,
    generatedAt: z.string().datetime(),
    primaryOutcomeId: nonEmptyStringSchema,
    supportingOutcomeIds: nonEmptyStringArraySchema,
    nextBestActionCategory: z.enum(chiefOfStaffActionCategoryOptions),
    nextBestAction: nonEmptyStringSchema,
    rationale: nonEmptyStringSchema,
    humanOwnerSuggestion: z.string().trim().optional(),
    supportingSignalIds: z.array(nonEmptyStringSchema).default([]),
  })
  .strict();

export type ChiefOfStaffRecommendation = z.infer<typeof chiefOfStaffRecommendationSchema>;

export const contentWriterAgentInputSchema = z
  .object({
    mission: nonEmptyStringSchema,
    approvedInsightId: nonEmptyStringSchema.optional(),
    pageBriefId: nonEmptyStringSchema.optional(),
    pageBrief: pageBriefSchema.optional(),
    outlineId: nonEmptyStringSchema.optional(),
    context: z.record(z.string(), z.string()).optional(),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (!value.pageBriefId && !value.pageBrief) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "ContentWriterAgent requires a PageBrief or pageBriefId.",
        path: ["pageBriefId"],
      });
    }
  });

export type ContentWriterAgentInput = z.infer<typeof contentWriterAgentInputSchema>;

function deriveAuthorityOutcomeStatus(signals: PerformanceSignal[]): AuthorityOutcomeStatus {
  if (signals.length === 0) {
    return "blocked";
  }

  if (signals.some((signal) => signal.signalState === "placeholder")) {
    return "watch";
  }

  if (
    signals.some(
      (signal) =>
        (signal.signalType === "close_rate" || signal.signalType === "booked_call" || signal.signalType === "query_visibility") &&
        signal.value <= 0,
    )
  ) {
    return "at_risk";
  }

  return "healthy";
}

export function mapPerformanceSignalsToAuthorityOutcome(input: {
  id: string;
  focus: AuthorityOutcomeFocus;
  title: string;
  signals: PerformanceSignal[];
  observedAt?: string;
  nextBestAction: string;
  summary?: string;
  ownerSuggestion?: string;
  reviewerNotes?: string;
}): AuthorityOutcome {
  return authorityOutcomeSchema.parse({
    id: input.id,
    focus: input.focus,
    title: input.title,
    status: deriveAuthorityOutcomeStatus(input.signals),
    summary:
      input.summary ??
      `Outcome synthesized from ${input.signals.length} performance signal(s) for ${input.focus.replace(/_/g, " ")}.`,
    signalIds: input.signals.map((signal) => signal.id),
    signals: input.signals,
    observedAt: input.observedAt ?? new Date().toISOString(),
    nextBestAction: input.nextBestAction,
    ownerSuggestion: input.ownerSuggestion,
    reviewerNotes: input.reviewerNotes,
  });
}

export function rejectAgentFactoryRuntime(): never {
  throw new Error("Task 025 is contracts-only; runtime execution is deferred to Task 026.");
}
