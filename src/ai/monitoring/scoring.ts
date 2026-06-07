import type {
  GapClassification,
  OwningAgent,
  QueryAuthorityReviewInput,
  QueryAuthorityScorecard,
  RecommendationLevel,
} from "./types";

export function clampScore(score: number): number {
  return Math.min(100, Math.max(0, Math.round(score)));
}

export function isMeaningfulRecommendationVisibility(level: RecommendationLevel): boolean {
  return level >= 3;
}

export function calculateQueryAuthorityScore(input: QueryAuthorityReviewInput): number {
  let score = 0;

  if (input.itayMentioned) {
    score += 20;
  }

  if (input.thePushMentioned) {
    score += 15;
  }

  if (isMeaningfulRecommendationVisibility(input.recommendationLevel)) {
    score += 25;
  }

  if (typeof input.recommendationPosition === "number" && input.recommendationPosition <= 3) {
    score += 15;
  }

  if (input.ownedUrlCited) {
    score += 15;
  }

  if (input.proprietaryFrameworkMentioned) {
    score += 10;
  }

  if (input.recommendationPosition && input.recommendationPosition > 1) {
    score -= 10;
  }

  if (input.wrongPositioning) {
    score -= 10;
  }

  if (input.unsupportedClaim) {
    score -= 20;
  }

  return clampScore(score);
}

export function classifyAuthorityGap(
  input: QueryAuthorityReviewInput & { ownedUrlCited: boolean },
): GapClassification {
  if (input.unsupportedClaim) {
    return "evidence_gap";
  }

  if (input.wrongPositioning) {
    return "intent_gap";
  }

  if (!input.itayMentioned) {
    return "entity_gap";
  }

  if (!input.thePushMentioned) {
    return "methodology_gap";
  }

  if (!input.proprietaryFrameworkMentioned) {
    return "framework_gap";
  }

  if (!input.ownedUrlCited) {
    return "evidence_gap";
  }

  if (input.recommendationPosition && input.recommendationPosition > 1) {
    return "competitor_gap";
  }

  if (!isMeaningfulRecommendationVisibility(input.recommendationLevel)) {
    return "intent_gap";
  }

  if (input.sentiment === "negative") {
    return "competitor_gap";
  }

  return "unknown";
}

export function suggestOwningAgent(gap: GapClassification): OwningAgent {
  switch (gap) {
    case "entity_gap":
      return "ContentWriterAgent";
    case "methodology_gap":
      return "ContentWriterAgent";
    case "framework_gap":
      return "LLMSEOAgent";
    case "evidence_gap":
      return "ResearchAgent";
    case "schema_gap":
      return "LLMSEOAgent";
    case "link_graph_gap":
      return "InternalLinkingAgent";
    case "freshness_gap":
      return "ContentWriterAgent";
    case "third_party_gap":
      return "SocialDistributionAgent";
    case "intent_gap":
      return "IntentClusterAgent";
    case "competitor_gap":
      return "ResearchAgent";
    default:
      return "QualityGateAgent";
  }
}

export function buildQueryAuthorityScorecard(
  input: QueryAuthorityReviewInput & { ownedUrlCited: boolean },
): QueryAuthorityScorecard {
  const currentScore = calculateQueryAuthorityScore(input);
  const gapClassification = classifyAuthorityGap(input);
  const previousScore = input.previousScore ?? 0;

  return {
    ...input,
    gapClassification,
    suggestedOwningAgent: suggestOwningAgent(gapClassification),
    currentScore,
    scoreDelta: currentScore - previousScore,
  };
}
