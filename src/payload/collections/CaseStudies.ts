import { buildAuthorityContentCollection } from "./content";

export const CaseStudies = buildAuthorityContentCollection({
  slug: "case-studies",
  singular: "Case Study",
  plural: "Case Studies",
  description: "Evidence-backed case studies and client stories.",
  schemaType: "Article",
});
