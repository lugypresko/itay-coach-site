import type { CollectionConfig, Field } from "payload";

const arrayTextField = (name: string, required = false): Field => ({
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

const claimField: Field = {
  name: "claims",
  type: "array",
  fields: [
    { name: "text", type: "textarea", required: true },
    arrayTextField("evidenceUrls"),
    arrayTextField("targetQueries", true),
    arrayTextField("targetEntities", true),
  ],
};

export const ApprovedInsights: CollectionConfig = {
  slug: "approved_insights",
  labels: {
    singular: "Approved Insight",
    plural: "Approved Insights",
  },
  admin: {
    description: "Payload-managed approved Itay insights that authorize future factory output.",
    useAsTitle: "sourceTitle",
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => false,
  },
  timestamps: true,
  fields: [
    { name: "sourceInsightId", type: "text", required: true, unique: true, index: true },
    { name: "sourceTitle", type: "text", required: true, index: true },
    {
      name: "sourceType",
      type: "select",
      required: true,
      options: ["voice_memo", "interview", "review", "note", "approved_quote"],
      index: true,
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "approved",
      options: ["approved"],
      index: true,
    },
    { name: "capturedAt", type: "date", required: true, index: true },
    { name: "approvedAt", type: "date", required: true, index: true },
    { name: "approvedBy", type: "text", required: true, index: true },
    { name: "freshnessExpiresAt", type: "date", required: true, index: true },
    { name: "summary", type: "textarea", required: true },
    { name: "rawText", type: "textarea" },
    claimField,
    arrayTextField("evidenceUrls"),
    arrayTextField("entityTags", true),
    arrayTextField("targetQueries", true),
    arrayTextField("targetRecommendationQueries"),
    arrayTextField("sourceUrls"),
    { name: "authorityPurpose", type: "textarea" },
    { name: "linkedContentJobId", type: "text", index: true },
    { name: "reviewerNotes", type: "textarea" },
  ],
};
