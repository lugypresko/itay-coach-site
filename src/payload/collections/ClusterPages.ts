import { buildAuthorityContentCollection } from "./content";

export const ClusterPages = buildAuthorityContentCollection({
  slug: "cluster-pages",
  singular: "Cluster Page",
  plural: "Cluster Pages",
  description: "Supporting topical cluster pages that reinforce pillar and entity authority.",
  schemaType: "Article",
});
