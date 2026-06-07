import { buildAuthorityContentCollection } from "./content";

export const PillarPages = buildAuthorityContentCollection({
  slug: "pillar-pages",
  singular: "Pillar Page",
  plural: "Pillar Pages",
  description: "Top-level authority pages for core recommendation-intent topics.",
  schemaType: "Article",
});
