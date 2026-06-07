import type { CollectionConfig } from "payload";

export const InternalLinks: CollectionConfig = {
  slug: "internal-links",
  labels: {
    singular: "Internal Link",
    plural: "Internal Links",
  },
  admin: {
    useAsTitle: "anchorText",
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => false,
  },
  timestamps: true,
  fields: [
    { name: "targetSlug", type: "text", required: true, index: true },
    { name: "anchorText", type: "text", required: true, index: true },
    { name: "reason", type: "textarea", required: true },
    {
      name: "sourceEntityTags",
      type: "array",
      fields: [{ name: "value", type: "text", required: true }],
    },
    {
      name: "targetEntityTags",
      type: "array",
      fields: [{ name: "value", type: "text", required: true }],
    },
    { name: "sourceSlug", type: "text", required: true, index: true },
    { name: "reviewStatus", type: "select", required: true, defaultValue: "draft", options: ["draft", "approved", "rejected"] },
  ],
};
