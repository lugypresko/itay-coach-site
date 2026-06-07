export type ItayInsightSourceType = "voice_memo" | "interview" | "review" | "note" | "approved_quote";

export type ItayInsightStatus = "draft" | "approved" | "archived";

export interface ItayInsight {
  id: string;
  title: string;
  sourceType: ItayInsightSourceType;
  status: ItayInsightStatus;
  capturedAt: string;
  approvedAt?: string;
  summary: string;
  rawText?: string;
  evidenceUrls: string[];
  entityTags: string[];
  targetRecommendationQueries: string[];
}

export interface ContentGenerationReadiness {
  canGenerate: boolean;
  reason: string;
  latestInsightAt?: string;
  daysSinceLatestInsight?: number;
  freshApprovedInsightCount: number;
  requiredFreshnessDays: number;
  requiredInsightStatus: ItayInsightStatus;
}
