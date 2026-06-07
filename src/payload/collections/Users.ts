import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: false,
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "human",
      options: ["admin", "editor", "agent", "human"],
      index: true,
    },
  ],
  timestamps: true,
};
