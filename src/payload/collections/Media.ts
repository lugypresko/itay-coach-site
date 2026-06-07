import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: "Media",
    plural: "Media",
  },
  upload: true,
  admin: {
    useAsTitle: "filename",
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => false,
  },
  fields: [
    { name: "alt", type: "text" },
    { name: "caption", type: "textarea" },
    { name: "sourceUrl", type: "text" },
  ],
  timestamps: true,
};
