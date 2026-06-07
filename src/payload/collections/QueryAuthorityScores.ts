import { buildQueryAuthorityScoreCollection } from "./authority-model";

export const QueryAuthorityScores = buildQueryAuthorityScoreCollection({
  slug: "query_authority_scores",
  singular: "Query Authority Score",
  plural: "Query Authority Scores",
  description: "Canonical query-level authority records that define recommendation visibility.",
});

