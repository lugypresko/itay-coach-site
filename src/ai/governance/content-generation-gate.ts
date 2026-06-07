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
  const latestApprovedInsight = approvedInsights
    .map((insight) => ({ insight, capturedAt: toUtcDate(insight.capturedAt) }))
    .sort((a, b) => b.capturedAt.getTime() - a.capturedAt.getTime())[0];

  if (!latestApprovedInsight) {
    return {
      canGenerate: false,
      reason: "No approved Itay insight exists, so the system must not generate new content.",
      freshApprovedInsightCount: 0,
      requiredFreshnessDays,
      requiredInsightStatus: "approved",
    };
  }

  const daysSinceLatestInsight = diffDays(now, latestApprovedInsight.capturedAt);

  if (daysSinceLatestInsight > requiredFreshnessDays) {
    return {
      canGenerate: false,
      reason: `Latest approved Itay insight is ${daysSinceLatestInsight} days old, exceeding the ${requiredFreshnessDays}-day freshness gate.`,
      latestInsightAt: latestApprovedInsight.insight.capturedAt,
      daysSinceLatestInsight,
      freshApprovedInsightCount: approvedInsights.filter((insight) => {
        const capturedAt = toUtcDate(insight.capturedAt);
        return diffDays(now, capturedAt) <= requiredFreshnessDays;
      }).length,
      requiredFreshnessDays,
      requiredInsightStatus: "approved",
    };
  }

  return {
    canGenerate: true,
    reason: "A fresh approved Itay insight exists, so content generation is allowed.",
    latestInsightAt: latestApprovedInsight.insight.capturedAt,
    daysSinceLatestInsight,
    freshApprovedInsightCount: approvedInsights.filter((insight) => {
      const capturedAt = toUtcDate(insight.capturedAt);
      return diffDays(now, capturedAt) <= requiredFreshnessDays;
    }).length,
    requiredFreshnessDays,
    requiredInsightStatus: "approved",
  };
}
