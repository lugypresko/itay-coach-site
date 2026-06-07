import { buildInsightExtractionCollection } from "./authority-model";

export const InsightExtractions = buildInsightExtractionCollection({
  slug: "insight_extractions",
  singular: "Insight Extraction",
  plural: "Insight Extractions",
  description: "Approved Itay source material extracted into structured, reusable authority inputs.",
});

