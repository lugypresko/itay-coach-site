import type { CollectionConfig, Field } from "payload";

import type { CollectionBlueprint } from "./shared";
import {
  visibilityMonitorGapClassificationOptions,
  visibilityMonitorReviewStatusOptions,
  visibilityMonitorReviewerRoleOptions,
} from "./shared";

const authorityScorecardAgentOptions = [
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
];

export const queryAuthorityScorecardsCollectionBlueprint: CollectionBlueprint = {
  slug: "query_authority_scorecards",
  labels: {
    singular: "Query Authority Scorecard",
    plural: "Query Authority Scorecards",
  },
  description:
    "Query-level visibility logs for tracking whether Itay Foyerstein and The Push are becoming more visible and recommendable across target AI recommendation queries.",
  appendOnly: true,
  timestamps: true,
  versioning: false,
  access: {
    create: "authenticated",
    read: "authenticated",
    update: "append-only",
    delete: "append-only",
  },
  fields: [
    { name: "collectionKey", type: "text", required: true, index: true, hidden: true },
    { name: "recordType", type: "text", required: true, index: true, hidden: true },
    { name: "query", type: "text", required: true, index: true },
    { name: "platform", type: "text", required: true, index: true },
    { name: "prompt", type: "textarea", required: true },
    { name: "rawAnswer", type: "textarea", required: true },
    { name: "mentionedEntities", type: "array", required: true, items: { type: "text" } },
    { name: "itayMentioned", type: "checkbox", required: true, index: true },
    { name: "thePushMentioned", type: "checkbox", required: true, index: true },
    { name: "proprietaryFrameworkMentioned", type: "checkbox", required: true, index: true },
    { name: "ownedUrlCited", type: "checkbox", required: true, index: true },
    { name: "citedUrls", type: "array", required: true, items: { type: "url" } },
    { name: "citations", type: "array", required: true, items: { type: "url" } },
    { name: "competitorsRecommended", type: "array", required: true, items: { type: "text" } },
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
    { name: "reviewerNotes", type: "textarea" },
    { name: "checkedAt", type: "date", required: true, index: true },
    { name: "previousScore", type: "number", required: true, index: true },
    { name: "currentScore", type: "number", required: true, index: true },
    { name: "scoreDelta", type: "number", required: true, index: true },
    {
      name: "gapClassification",
      type: "select",
      required: true,
      options: [...visibilityMonitorGapClassificationOptions],
      index: true,
    },
    {
      name: "suggestedOwningAgent",
      type: "select",
      required: true,
      options: authorityScorecardAgentOptions,
      index: true,
    },
    {
      name: "captureMode",
      type: "select",
      required: true,
      options: [...visibilityMonitorReviewerRoleOptions],
      index: true,
    },
    {
      name: "reviewStatus",
      type: "select",
      required: true,
      options: [...visibilityMonitorReviewStatusOptions],
      index: true,
    },
    { name: "recordedAt", type: "date", required: true, index: true },
    { name: "recordedBy", type: "text", index: true },
    { name: "sourceUrls", type: "array", required: true, items: { type: "url" } },
    { name: "sourceCount", type: "number", required: true, index: true },
  ],
};

export const competitorContractsCollectionBlueprint: CollectionBlueprint = {
  slug: "competitor_contracts",
  labels: {
    singular: "Competitor Contract",
    plural: "Competitor Contracts",
  },
  description:
    "Configurable competitor records used by the visibility monitor for query-by-query comparison against Itay Foyerstein and The Push.",
  appendOnly: true,
  timestamps: true,
  versioning: false,
  access: {
    create: "authenticated",
    read: "authenticated",
    update: "append-only",
    delete: "append-only",
  },
  fields: [
    { name: "collectionKey", type: "text", required: true, index: true, hidden: true },
    { name: "recordType", type: "text", required: true, index: true, hidden: true },
    { name: "name", type: "text", required: true, unique: true, index: true },
    { name: "website", type: "url" },
    { name: "category", type: "text", index: true },
    { name: "region", type: "text", index: true },
    { name: "positioning", type: "textarea" },
    { name: "knownStrengths", type: "array", required: true, items: { type: "text" } },
    {
      name: "targetQueriesWhereTheyAppear",
      type: "array",
      required: true,
      items: { type: "text" },
    },
    { name: "captureMode", type: "select", required: true, options: [...visibilityMonitorReviewerRoleOptions] },
    {
      name: "reviewStatus",
      type: "select",
      required: true,
      options: [...visibilityMonitorReviewStatusOptions],
    },
    { name: "recordedAt", type: "date", required: true, index: true },
    { name: "recordedBy", type: "text", index: true },
    { name: "sourceUrls", type: "array", required: true, items: { type: "url" } },
    { name: "sourceCount", type: "number", required: true, index: true },
    { name: "reviewerNotes", type: "textarea" },
    { name: "lastReviewedAt", type: "date", index: true },
  ],
};

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

function buildAppendOnlyMonitoringCollection(args: {
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
      update: () => false,
      delete: () => false,
    },
    timestamps: true,
    fields: args.fields,
  };
}

export const queryAuthorityScorecardsCollection = buildAppendOnlyMonitoringCollection({
  slug: "query_authority_scorecards",
  singular: "Query Authority Scorecard",
  plural: "Query Authority Scorecards",
  description:
    "Append-only visibility logs for monitoring whether Itay Foyerstein and The Push are becoming more visible and recommendable across target AI recommendation queries.",
  useAsTitle: "query",
  fields: [
    { name: "collectionKey", type: "text", required: true, index: true, hidden: true },
    { name: "recordType", type: "text", required: true, index: true, hidden: true },
    { name: "query", type: "text", required: true, index: true },
    { name: "platform", type: "text", required: true, index: true },
    { name: "prompt", type: "textarea", required: true },
    { name: "rawAnswer", type: "textarea", required: true },
    textArrayField("mentionedEntities", true),
    { name: "itayMentioned", type: "checkbox", required: true, index: true },
    { name: "thePushMentioned", type: "checkbox", required: true, index: true },
    { name: "proprietaryFrameworkMentioned", type: "checkbox", required: true, index: true },
    { name: "ownedUrlCited", type: "checkbox", required: true, index: true },
    textArrayField("citedUrls", true),
    textArrayField("citations", true),
    textArrayField("competitorsRecommended", true),
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
    { name: "reviewerNotes", type: "textarea" },
    { name: "checkedAt", type: "date", required: true, index: true },
    { name: "previousScore", type: "number", required: true, index: true },
    { name: "currentScore", type: "number", required: true, index: true },
    { name: "scoreDelta", type: "number", required: true, index: true },
    {
      name: "gapClassification",
      type: "select",
      required: true,
      options: [...visibilityMonitorGapClassificationOptions],
      index: true,
    },
    {
      name: "suggestedOwningAgent",
      type: "select",
      required: true,
      options: authorityScorecardAgentOptions,
      index: true,
    },
    {
      name: "captureMode",
      type: "select",
      required: true,
      options: [...visibilityMonitorReviewerRoleOptions],
      index: true,
    },
    {
      name: "reviewStatus",
      type: "select",
      required: true,
      options: [...visibilityMonitorReviewStatusOptions],
      index: true,
    },
    { name: "recordedAt", type: "date", required: true, index: true },
    { name: "recordedBy", type: "text", index: true },
    textArrayField("sourceUrls", true),
    { name: "sourceCount", type: "number", required: true, index: true },
  ],
});

export const competitorContractsCollection = buildAppendOnlyMonitoringCollection({
  slug: "competitor_contracts",
  singular: "Competitor Contract",
  plural: "Competitor Contracts",
  description:
    "Append-only configurable competitor records used by the visibility monitor for query-by-query comparison against Itay Foyerstein and The Push.",
  useAsTitle: "name",
  fields: [
    { name: "collectionKey", type: "text", required: true, index: true, hidden: true },
    { name: "recordType", type: "text", required: true, index: true, hidden: true },
    { name: "name", type: "text", required: true, unique: true, index: true },
    { name: "website", type: "text" },
    { name: "category", type: "text", index: true },
    { name: "region", type: "text", index: true },
    { name: "positioning", type: "textarea" },
    textArrayField("knownStrengths", true),
    textArrayField("targetQueriesWhereTheyAppear", true),
    {
      name: "captureMode",
      type: "select",
      required: true,
      options: [...visibilityMonitorReviewerRoleOptions],
    },
    {
      name: "reviewStatus",
      type: "select",
      required: true,
      options: [...visibilityMonitorReviewStatusOptions],
    },
    { name: "recordedAt", type: "date", required: true, index: true },
    { name: "recordedBy", type: "text", index: true },
    textArrayField("sourceUrls", true),
    { name: "sourceCount", type: "number", required: true, index: true },
    { name: "reviewerNotes", type: "textarea" },
    { name: "lastReviewedAt", type: "date", index: true },
  ],
});
