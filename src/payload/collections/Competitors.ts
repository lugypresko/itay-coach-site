import { buildCompetitorCollection } from "./authority-model";

export const Competitors = buildCompetitorCollection({
  slug: "competitors",
  singular: "Competitor",
  plural: "Competitors",
  description: "Manual competitor records used for graph-level authority comparison.",
});

