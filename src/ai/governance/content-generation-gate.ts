import type { ContentGenerationReadiness, ItayInsight } from "./types";

function toUtcDate(value: string): Date {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }

  return date;
}

function diffDays(later: Date, earlier: Date): number {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((later.getTime() - earlier.getTime()) / millisecondsPerDay);
}

export function evaluateContentGenerationReadiness(input: {
  insights: ItayInsight[];
  now?: string;
  requiredFreshnessDays?: number;
}): ContentGenerationReadiness {
  const requiredFreshnessDays = input.requiredFreshnessDays ?? 30;
  const now = input.now ? toUtcDate(input.now) : new Date();
  const approvedInsights = input.insights.filter((insight) => insight.status === "approved");

  if (!approvedInsights.length) {
    return {
      canGenerate: false,
      reason: "No approved Itay insight exists, so the system must not generate new content.",
      freshApprovedInsightCount: 0,
      requiredFreshnessDays,
      requiredInsightStatus: "approved",
    };
  }

  const evidenceBackedInsights = approvedInsights.filter((insight) => insight.evidenceUrls.length > 0);
  if (!evidenceBackedInsights.length) {
    return {
      canGenerate: false,
      reason: "No approved Itay insight has claim-level evidence for the proposed content.",
      latestInsightAt: approvedInsights[0]?.capturedAt,
      daysSinceLatestInsight: approvedInsights[0] ? diffDays(now, toUtcDate(approvedInsights[0].capturedAt)) : undefined,
      freshApprovedInsightCount: 0,
      requiredFreshnessDays,
      requiredInsightStatus: "approved",
    };
  }

  const latestApprovedInsight = evidenceBackedInsights
    .map((insight) => ({ insight, capturedAt: toUtcDate(insight.capturedAt) }))
    .sort((a, b) => b.capturedAt.getTime() - a.capturedAt.getTime())[0];
  const daysSinceLatestInsight = diffDays(now, latestApprovedInsight.capturedAt);

  return {
    canGenerate: true,
    reason: "An approved Itay insight with claim-level evidence exists; freshness is evaluated per claim, not by a global age threshold.",
    latestInsightAt: latestApprovedInsight.insight.capturedAt,
    daysSinceLatestInsight,
    freshApprovedInsightCount: evidenceBackedInsights.length,
    requiredFreshnessDays,
    requiredInsightStatus: "approved",
  };
}
