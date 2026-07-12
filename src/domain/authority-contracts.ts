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

export type AuthorityClaim = z.infer<typeof authorityClaimSchema>;
export type ApprovedInsight = z.infer<typeof approvedInsightSchema>;
export type KnowledgeAsset = z.infer<typeof knowledgeAssetSchema>;
export type AuthorityContent = z.infer<typeof authorityContentSchema>;
export type VisibilityObservation = z.infer<typeof visibilityObservationSchema>;
