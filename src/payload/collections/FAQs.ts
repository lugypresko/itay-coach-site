import { buildAuthorityContentCollection } from "./content";

export const FAQs = buildAuthorityContentCollection({
  slug: "faqs",
  singular: "FAQ",
  plural: "FAQs",
  description: "Frequently asked questions that support recommendation queries and schema.",
  schemaType: "FAQPage",
});
