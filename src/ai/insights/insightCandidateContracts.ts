import { z } from "zod";

export const insightCandidateSourceTypeOptions = [
  "payload_content",
  "seed_content",
  "seed_script",
  "player_trap_source",
  "contract_docs",
  "payload_authority_content",
  "planning_docs",
  "authority_report",
  "historical_artifact",
] as const;

export type InsightCandidateSourceType = (typeof insightCandidateSourceTypeOptions)[number];

export const insightCandidateReviewStatusOptions = [
  "extracted",
  "reviewed",
  "promoted",
  "rejected",
] as const;

export type InsightCandidateReviewStatus = (typeof insightCandidateReviewStatusOptions)[number];

export const insightCandidateClaimTypeOptions = [
  "factual",
  "framework",
  "recommendation",
  "process",
  "proof_point",
  "opinion",
] as const;

export type InsightCandidateClaimType = (typeof insightCandidateClaimTypeOptions)[number];

const nonEmptyStringSchema = z.string().trim().min(1);
const nonEmptyStringArraySchema = z.array(nonEmptyStringSchema).min(1);

export const insightCandidateClaimSchema = z
  .object({
    text: nonEmptyStringSchema,
    claimType: z.enum(insightCandidateClaimTypeOptions),
    evidenceReferences: nonEmptyStringArraySchema,
    targetQueries: z.array(nonEmptyStringSchema).default([]),
    targetEntities: z.array(nonEmptyStringSchema).default([]),
  })
  .strict();

export type InsightCandidateClaim = z.infer<typeof insightCandidateClaimSchema>;

export const insightCandidateSchema = z
  .object({
    source: nonEmptyStringSchema,
    sourceType: z.enum(insightCandidateSourceTypeOptions),
    title: nonEmptyStringSchema,
    extractedInsight: nonEmptyStringSchema,
    targetQueries: nonEmptyStringArraySchema,
    targetEntities: nonEmptyStringArraySchema,
    candidateClaims: z.array(insightCandidateClaimSchema).min(1),
    evidenceReferences: nonEmptyStringArraySchema,
    reviewStatus: z.enum(insightCandidateReviewStatusOptions),
    notes: z.string().trim().optional(),
  })
  .strict();

export type InsightCandidate = z.infer<typeof insightCandidateSchema>;
