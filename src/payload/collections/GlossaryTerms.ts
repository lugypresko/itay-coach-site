import { buildAuthorityContentCollection } from "./content";

export const GlossaryTerms = buildAuthorityContentCollection({
  slug: "glossary-terms",
  singular: "Glossary Term",
  plural: "Glossary Terms",
  description: "Definitions of core authority and leadership concepts.",
  schemaType: "Article",
});
