import type { CollectionConfig, Field } from "payload";

import { contentCollectionStatusOptions } from "./content";

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

const relatedLinkField = (name: string): Field => ({
  name,
  type: "array",
  fields: [
    { name: "label", type: "text", required: true },
    { name: "href", type: "text", required: true },
    { name: "reason", type: "textarea", required: true },
  ],
});

const evidenceBlockField: Field = {
  name: "evidenceBlock",
  type: "group",
  fields: [
    { name: "claim", type: "textarea", required: true },
    { name: "source", type: "text", required: true },
    { name: "relatedEntity", type: "text", required: true },
    {
      name: "confidence",
      type: "select",
      required: true,
      options: ["high", "medium", "low"],
      defaultValue: "high",
    },
    {
      name: "approvalStatus",
      type: "select",
      required: true,
      options: ["approved", "source-backed", "review"],
      defaultValue: "source-backed",
    },
  ],
};

const primaryCtaField: Field = {
  name: "primaryCTA",
  type: "group",
  fields: [
    { name: "label", type: "text", required: true },
    { name: "href", type: "text", required: true },
    { name: "rationale", type: "textarea", required: true },
  ],
};

export const ProblemPages: CollectionConfig = {
  slug: "problem-pages",
  labels: {
    singular: "Problem Page",
    plural: "Problem Pages",
  },
  admin: {
    description: "Decision-stage pages that turn problem recognition into qualified customer conversations.",
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
    { name: "title", type: "text", required: true, index: true },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "painStatement", type: "textarea", required: true },
    arrayTextField("dailyScenes", true),
    arrayTextField("whatTheyTried", true),
    { name: "whyItFailed", type: "textarea", required: true },
    { name: "diagnosis", type: "textarea", required: true },
    evidenceBlockField,
    primaryCtaField,
    relatedLinkField("relatedFrameworks"),
    relatedLinkField("relatedClusters"),
    { name: "seoTitle", type: "text", required: true },
    { name: "seoDescription", type: "textarea", required: true },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: [...contentCollectionStatusOptions],
      index: true,
    },
  ],
};

