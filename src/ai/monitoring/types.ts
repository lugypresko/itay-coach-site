export type VisibilityPlatform =
  | "ChatGPT"
  | "Perplexity"
  | "Claude"
  | "Gemini"
  | "Google AI Overviews"
  | "Copilot"
  | string;

export type RecommendationLevel = 0 | 1 | 2 | 3 | 4 | 5;

export type Sentiment = "positive" | "neutral" | "negative";

export type GapClassification =
  | "entity_gap"
  | "methodology_gap"
  | "framework_gap"
  | "evidence_gap"
  | "schema_gap"
  | "link_graph_gap"
  | "freshness_gap"
  | "third_party_gap"
  | "intent_gap"
  | "competitor_gap"
  | "unknown";

export type OwningAgent =
  | "ResearchAgent"
  | "IntentClusterAgent"
  | "OutlineAgent"
  | "ContentWriterAgent"
  | "LLMSEOAgent"
  | "InternalLinkingAgent"
  | "QualityGateAgent"
  | "PayloadPublisherAgent"
  | "SocialDistributionAgent"
  | "VisibilityMonitorAgent";

export interface Competitor {
  name: string;
  website?: string;
  category?: string;
  region?: string;
  positioning?: string;
  knownStrengths: string[];
  targetQueriesWhereTheyAppear: string[];
}

export interface QueryAuthorityReviewInput {
  query: string;
  platform: VisibilityPlatform;
  prompt: string;
  rawAnswer: string;
  mentionedEntities: string[];
  itayMentioned: boolean;
  thePushMentioned: boolean;
  proprietaryFrameworkMentioned: boolean;
  ownedUrlCited: boolean;
  citedUrls: string[];
  citations: string[];
  competitorsRecommended: string[];
  recommendationLevel: RecommendationLevel;
  recommendationPosition?: number;
  confidence?: number;
  sentiment?: Sentiment;
  reviewerNotes?: string;
  checkedAt: string;
  previousScore: number;
  wrongPositioning?: boolean;
  unsupportedClaim?: boolean;
}

export interface QueryAuthorityScorecard extends QueryAuthorityReviewInput {
  ownedUrlCited: boolean;
  gapClassification: GapClassification;
  suggestedOwningAgent: OwningAgent;
  currentScore: number;
  scoreDelta: number;
}

export interface VisibilityMonitorReport {
  scorecard: QueryAuthorityScorecard;
  query: string;
  platform: VisibilityPlatform;
  gapClassification: GapClassification;
  suggestedOwningAgent: OwningAgent;
}
