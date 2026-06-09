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

export function rejectAgentFactoryRuntime(): never {
  throw new Error("Task 025 is contracts-only; runtime execution is deferred to Task 026.");
}
