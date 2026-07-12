import type { CollectionConfig, Field } from "payload";

import { reviewStatusOptions } from "../../ai/agents";

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

export const KnowledgeAssets: CollectionConfig = {
  slug: "knowledge_assets",
  labels: {
    singular: "Knowledge Asset",
    plural: "Knowledge Assets",
  },
  admin: {
    description: "Canonical factory output records derived from approved insights.",
    useAsTitle: "title",
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
    {
      name: "sourceInsightRecord",
      type: "relationship",
      relationTo: "approved_insights",
      required: true,
      index: true,
    },
    arrayTextField("claimIds", true),
    arrayTextField("targetQueries", true),
    arrayTextField("targetEntities", true),
    { name: "shortAnswer", type: "textarea", required: true },
    {
      name: "reviewStatus",
      type: "select",
      required: true,
      options: [...reviewStatusOptions],
      index: true,
    },
    { name: "title", type: "text", index: true },
    { name: "summary", type: "textarea" },
    arrayTextField("evidenceUrls"),
    arrayTextField("sourceUrls"),
    { name: "reviewerNotes", type: "textarea" },
  ],
};
