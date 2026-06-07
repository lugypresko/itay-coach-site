import { buildAuthorityContentCollection } from "./content";

export const EntityPages = buildAuthorityContentCollection({
  slug: "entity-pages",
  singular: "Entity Page",
  plural: "Entity Pages",
  description: "Canonical entity pages for Itay Foyerstein, The Push, and adjacent authority nodes.",
  schemaType: "Person",
});
