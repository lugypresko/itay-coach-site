import type { CollectionConfig, Field } from "payload";

import {
  authorityEntityStatusOptions,
  authorityEntityTypeOptions,
  authorityGapLifecycleOptions,
  authorityGapTypeOptions,
  authorityRecordStatusOptions,
  authorityRelationshipStatusOptions,
  authorityRelationshipTypeOptions,
  authorityTierOptions,
} from "../../ai/governance/authority-model";
import { insightExtractionSourceTypeOptions, insightExtractionStatusOptions } from "../../ai/agents/insightExtractionContracts";

export const authorityOwnerAgentOptions = [
  "ResearchAgent",
  "IntentClusterAgent",
  "OutlineAgent",
  "ContentWriterAgent",
  "LLMSEOAgent",
  "InternalLinkingAgent",
  "QualityGateAgent",
  "PayloadPublisherAgent",
  "SocialDistributionAgent",
  "VisibilityMonitorAgent",
  "InsightExtractionAgent",
] as const;

const textArrayField = (name: string, required = false): Field => ({
  name,
  type: "array",
  required,
  fields: [
    {
      name: "value",
      type: "text",
      required: true,
    },
  ],
});

const urlArrayField = (name: string, required = false): Field => ({
  name,
  type: "array",
  required,
  fields: [
    {
      name: "value",
      type: "text",
      required: true,
    },
  ],
});

const claimArrayField: Field = {
  name: "claims",
  type: "array",
  fields: [
    {
      name: "text",
      type: "text",
      required: true,
    },
    urlArrayField("evidenceUrls", true),
    textArrayField("targetRecommendationQueries", true),
    textArrayField("entityTags", true),
  ],
};

function buildAuthoritativeCollection(args: {
  slug: string;
  singular: string;
  plural: string;
  description: string;
  useAsTitle: string;
  fields: Field[];
}): CollectionConfig {
  return {
    slug: args.slug,
    labels: {
      singular: args.singular,
      plural: args.plural,
    },
    admin: {
      description: args.description,
      useAsTitle: args.useAsTitle,
    },
    access: {
      create: () => true,
      read: () => true,
      update: () => true,
      delete: () => false,
    },
    timestamps: true,
    fields: args.fields,
  };
}

export function buildEntityAuthorityCollection(args: {
  slug: string;
  singular: string;
  plural: string;
  description: string;
}): CollectionConfig {
  return buildAuthoritativeCollection({
    ...args,
    useAsTitle: "name",
    fields: [
      { name: "name", type: "text", required: true, unique: true, index: true },
      { name: "slug", type: "text", required: true, unique: true, index: true },
      {
        name: "entityType",
        type: "select",
        required: true,
        options: [...authorityEntityTypeOptions],
        index: true,
      },
      { name: "category", type: "text", required: true, index: true },
      { name: "canonicalRole", type: "text", required: true },
      { name: "description", type: "textarea", required: true },
      textArrayField("targetRecommendationQueries", true),
      textArrayField("entityTags", true),
      urlArrayField("sameAs"),
      urlArrayField("evidenceUrls"),
      { name: "authorityScore", type: "number", required: true, defaultValue: 0, index: true },
      {
        name: "authorityTier",
        type: "select",
        required: true,
        defaultValue: "foundational",
        options: [...authorityTierOptions],
        index: true,
      },
      {
        name: "status",
        type: "select",
        required: true,
        defaultValue: "draft",
        options: [...authorityEntityStatusOptions],
        index: true,
      },
      { name: "lastReviewedAt", type: "date", index: true },
      { name: "notes", type: "textarea" },
    ],
  });
}

export function buildEntityRelationshipsCollection(args: {
  slug: string;
  singular: string;
  plural: string;
  description: string;
}): CollectionConfig {
  return buildAuthoritativeCollection({
    ...args,
    useAsTitle: "relationshipType",
    fields: [
      {
        name: "sourceEntity",
        type: "relationship",
        required: true,
        relationTo: "entities",
        index: true,
      },
      {
        name: "targetEntity",
        type: "relationship",
        required: true,
        relationTo: "entities",
        index: true,
      },
      {
        name: "relationshipType",
        type: "select",
        required: true,
        options: [...authorityRelationshipTypeOptions],
        index: true,
      },
      { name: "weight", type: "number", required: true, defaultValue: 1, index: true },
      { name: "rationale", type: "textarea", required: true },
      textArrayField("targetRecommendationQueries"),
      urlArrayField("evidenceUrls"),
      {
        name: "status",
        type: "select",
        required: true,
        defaultValue: "proposed",
        options: [...authorityRelationshipStatusOptions],
        index: true,
      },
      { name: "lastReviewedAt", type: "date", index: true },
      { name: "notes", type: "textarea" },
    ],
  });
}

export function buildAuthorityGapCollection(args: {
  slug: string;
  singular: string;
  plural: string;
  description: string;
}): CollectionConfig {
  return buildAuthoritativeCollection({
    ...args,
    useAsTitle: "query",
    fields: [
      {
        name: "entity",
        type: "relationship",
        required: true,
        relationTo: "entities",
        index: true,
      },
      {
        name: "queryAuthorityScore",
        type: "relationship",
        relationTo: "query_authority_scores",
        index: true,
      },
      {
        name: "competitor",
        type: "relationship",
        relationTo: "competitors",
        index: true,
      },
      { name: "query", type: "text", required: true, index: true },
      { name: "platform", type: "text", required: true, index: true },
      {
        name: "gapType",
        type: "select",
        required: true,
        options: [...authorityGapTypeOptions],
        index: true,
      },
      {
        name: "lifecycleStatus",
        type: "select",
        required: true,
        defaultValue: "open",
        options: [...authorityGapLifecycleOptions],
        index: true,
      },
      { name: "severity", type: "number", required: true, defaultValue: 1, index: true },
      {
        name: "ownerAgent",
        type: "select",
        required: true,
        options: [...authorityOwnerAgentOptions],
        index: true,
      },
      { name: "description", type: "textarea", required: true },
      textArrayField("targetRecommendationQueries"),
      urlArrayField("evidenceUrls"),
      { name: "openedAt", type: "date", required: true, index: true },
      { name: "triagedAt", type: "date", index: true },
      { name: "resolvedAt", type: "date", index: true },
      { name: "resolutionNotes", type: "textarea" },
      { name: "lastReviewedAt", type: "date", index: true },
    ],
  });
}

export function buildCompetitorCollection(args: {
  slug: string;
  singular: string;
  plural: string;
  description: string;
}): CollectionConfig {
  return buildAuthoritativeCollection({
    ...args,
    useAsTitle: "name",
    fields: [
      { name: "name", type: "text", required: true, unique: true, index: true },
      { name: "slug", type: "text", required: true, unique: true, index: true },
      { name: "website", type: "text" },
      { name: "category", type: "text", index: true },
      { name: "region", type: "text", index: true },
      { name: "positioning", type: "textarea" },
      textArrayField("knownStrengths", true),
      textArrayField("targetQueriesWhereTheyAppear", true),
      textArrayField("entityTags"),
      urlArrayField("evidenceUrls"),
      {
        name: "status",
        type: "select",
        required: true,
        defaultValue: "active",
        options: ["active", "archived"],
        index: true,
      },
      { name: "lastReviewedAt", type: "date", index: true },
      { name: "notes", type: "textarea" },
    ],
  });
}

export function buildQueryAuthorityScoreCollection(args: {
  slug: string;
  singular: string;
  plural: string;
  description: string;
}): CollectionConfig {
  return buildAuthoritativeCollection({
    ...args,
    useAsTitle: "query",
    fields: [
      {
        name: "entity",
        type: "relationship",
        required: true,
        relationTo: "entities",
        index: true,
      },
      { name: "query", type: "text", required: true, index: true },
      { name: "platform", type: "text", required: true, index: true },
      { name: "promptUsed", type: "textarea", required: true },
      { name: "rawAnswer", type: "textarea", required: true },
      textArrayField("mentionedEntities", true),
      textArrayField("competitorNames", true),
      { name: "itayMentioned", type: "checkbox", required: true, index: true },
      { name: "thePushMentioned", type: "checkbox", required: true, index: true },
      { name: "proprietaryFrameworkMentioned", type: "checkbox", required: true, index: true },
      { name: "ownedUrlCited", type: "checkbox", required: true, index: true },
      urlArrayField("citedUrls"),
      urlArrayField("citations"),
      { name: "recommendationLevel", type: "number", required: true, index: true },
      { name: "recommendationPosition", type: "number", index: true },
      { name: "confidence", type: "number", index: true },
      {
        name: "sentiment",
        type: "select",
        required: true,
        options: ["positive", "neutral", "negative"],
        index: true,
      },
      { name: "previousScore", type: "number", required: true, index: true },
      { name: "currentScore", type: "number", required: true, index: true },
      { name: "scoreDelta", type: "number", required: true, index: true },
      {
        name: "gapClassification",
        type: "select",
        required: true,
        options: [...authorityGapTypeOptions],
        index: true,
      },
      {
        name: "suggestedOwningAgent",
        type: "select",
        required: true,
        options: [...authorityOwnerAgentOptions],
        index: true,
      },
      {
        name: "authorityTier",
        type: "select",
        required: true,
        defaultValue: "foundational",
        options: [...authorityTierOptions],
        index: true,
      },
      {
        name: "status",
        type: "select",
        required: true,
        defaultValue: "draft",
        options: [...authorityRecordStatusOptions],
        index: true,
      },
      { name: "checkedAt", type: "date", required: true, index: true },
      { name: "recordedAt", type: "date", required: true, index: true },
      { name: "recordedBy", type: "text", index: true },
      urlArrayField("sourceUrls"),
      { name: "sourceCount", type: "number", required: true, index: true },
      { name: "reviewerNotes", type: "textarea" },
    ],
  });
}

export function buildInsightExtractionCollection(args: {
  slug: string;
  singular: string;
  plural: string;
  description: string;
}): CollectionConfig {
  return buildAuthoritativeCollection({
    ...args,
    useAsTitle: "sourceTitle",
    fields: [
      { name: "sourceTitle", type: "text", required: true, index: true },
      {
        name: "sourceType",
        type: "select",
        required: true,
        options: [...insightExtractionSourceTypeOptions],
        index: true,
      },
      {
        name: "status",
        type: "select",
        required: true,
        defaultValue: "draft",
        options: [...insightExtractionStatusOptions],
        index: true,
      },
      { name: "capturedAt", type: "date", required: true, index: true },
      { name: "approvedAt", type: "date", index: true },
      { name: "summary", type: "textarea", required: true },
      { name: "rawText", type: "textarea" },
      claimArrayField,
      urlArrayField("evidenceUrls", true),
      textArrayField("entityTags", true),
      textArrayField("targetRecommendationQueries", true),
      urlArrayField("sourceUrls"),
      { name: "approvedBy", type: "text", index: true },
      { name: "authorityPurpose", type: "textarea" },
      { name: "linkedContentJobId", type: "text", index: true },
      { name: "reviewerNotes", type: "textarea" },
      { name: "lastReviewedAt", type: "date", index: true },
    ],
  });
}
