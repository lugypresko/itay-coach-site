import fs from "node:fs";
import path from "node:path";

import {
  approvedInsightRepository,
  approvedInsightTopicOptions,
  getApprovedInsightsForTopic,
} from "../ai/insights";
import { knowledgeAssetSchema, type KnowledgeAsset } from "../ai/agents";

export type KnowledgeAssetConversionSprintTopic = (typeof approvedInsightTopicOptions)[number];

export interface KnowledgeAssetConversionSprintEntry {
  topic: KnowledgeAssetConversionSprintTopic;
  sourceInsightId: string;
  knowledgeAsset: KnowledgeAsset;
}

export interface KnowledgeAssetConversionSprintReport {
  totalApprovedInsights: number;
  convertedCount: number;
  remainingCount: number;
  selectedTopics: Record<KnowledgeAssetConversionSprintTopic, number>;
  convertedSourceInsightIds: string[];
  backlogSourceInsightIds: string[];
}

const sprintTopicQuotas: Record<KnowledgeAssetConversionSprintTopic, number> = {
  "Player Trap": 4,
  "Invisible Executor": 3,
  "The Push Leadership Evolution / Strategic Leadership": 3,
  "Engineering Management": 0,
  "Leadership Promotion": 0,
  "AI Leadership": 0,
};

function buildClaimIds(sourceInsightId: string, claimCount: number) {
  return Array.from({ length: Math.max(claimCount, 1) }, (_, index) => `${sourceInsightId}:claim-${index + 1}`);
}

function convertInsightToKnowledgeAsset(topic: KnowledgeAssetConversionSprintTopic, sourceInsightId: string) {
  const insight = approvedInsightRepository.find((entry) => entry.id === sourceInsightId);

  if (!insight) {
    throw new Error(`Missing approved insight: ${sourceInsightId}`);
  }

  const knowledgeAsset = knowledgeAssetSchema.parse({
    id: `knowledge-asset-${sourceInsightId}`,
    sourceInsightId: insight.id,
    claimIds: buildClaimIds(insight.id, insight.claims.length),
    targetQueries: insight.targetQueries,
    targetEntities: insight.entityTags,
    shortAnswer: insight.summary,
    reviewStatus: "in_review",
    title: `${topic} - ${insight.summary}`,
    summary: `Converted from approved insight ${insight.id} for ${topic}.`,
    evidenceUrls: insight.evidenceUrls,
    sourceUrls: insight.sourceUrls,
    reviewerNotes: `Task 033 conversion from approved insight ${insight.id}.`,
  });

  return knowledgeAsset;
}

export function getKnowledgeAssetConversionSprintEntries(): KnowledgeAssetConversionSprintEntry[] {
  const selectedInsights = approvedInsightTopicOptions.flatMap((topic) =>
    getApprovedInsightsForTopic(topic)
      .slice(0, sprintTopicQuotas[topic])
      .map((insight) => ({
        topic,
        sourceInsightId: insight.id,
      })),
  );

  return selectedInsights.map(({ topic, sourceInsightId }) => ({
    topic,
    sourceInsightId,
    knowledgeAsset: convertInsightToKnowledgeAsset(topic, sourceInsightId),
  }));
}

export const knowledgeAssetConversionSprintEntries = getKnowledgeAssetConversionSprintEntries();

export const knowledgeAssetConversionSprintAssets = knowledgeAssetConversionSprintEntries.map(
  (entry) => entry.knowledgeAsset,
);

export function getKnowledgeAssetConversionSprintReport(): KnowledgeAssetConversionSprintReport {
  const entries = knowledgeAssetConversionSprintEntries;
  const convertedSourceInsightIds = entries.map((entry) => entry.sourceInsightId);
  const backlogSourceInsightIds = approvedInsightRepository
    .map((insight) => insight.id)
    .filter((id) => !convertedSourceInsightIds.includes(id));

  const selectedTopics = approvedInsightTopicOptions.reduce(
    (counts, topic) => {
      counts[topic] = entries.filter((entry) => entry.topic === topic).length;
      return counts;
    },
    {} as Record<KnowledgeAssetConversionSprintTopic, number>,
  );

  return {
    totalApprovedInsights: approvedInsightRepository.length,
    convertedCount: entries.length,
    remainingCount: backlogSourceInsightIds.length,
    selectedTopics,
    convertedSourceInsightIds,
    backlogSourceInsightIds,
  };
}

export function buildKnowledgeAssetConversionSprintReportMarkdown() {
  const report = getKnowledgeAssetConversionSprintReport();
  const entries = knowledgeAssetConversionSprintEntries;

  return `# Task 033 Conversion Report

## Chief of Staff Recommendation

Treat the current \`content_inventory_health = at_risk\` state as a controlled KnowledgeAsset conversion sprint.

## Summary

- total approved insights: ${report.totalApprovedInsights}
- converted KnowledgeAssets: ${report.convertedCount}
- remaining approved insights: ${report.remainingCount}

## Selection Policy

- Player Trap: ${report.selectedTopics["Player Trap"]}
- Invisible Executor: ${report.selectedTopics["Invisible Executor"]}
- The Push Leadership Evolution / Strategic Leadership: ${report.selectedTopics["The Push Leadership Evolution / Strategic Leadership"]}
- Engineering Management: ${report.selectedTopics["Engineering Management"]}
- Leadership Promotion: ${report.selectedTopics["Leadership Promotion"]}
- AI Leadership: ${report.selectedTopics["AI Leadership"]}

## Converted Assets

${entries
  .map(
    (entry, index) => `- ${index + 1}. ${entry.sourceInsightId} -> ${entry.knowledgeAsset.id} (${entry.topic}) [${entry.knowledgeAsset.reviewStatus}]`,
  )
  .join("\n")}

## Backlog

- remaining approved insights: ${report.remainingCount}
- backlog source insight IDs: ${report.backlogSourceInsightIds.join(", ")}

## Notes

- KnowledgeAssets remain draft/in_review only.
- No publishing, distribution, or runtime Chief of Staff behavior was introduced.
- The first 10 assets prioritize Player Trap, Invisible Executor, and The Push / Strategic Leadership.
`;
}

export function writeKnowledgeAssetConversionSprintReport(outputFilePath = path.resolve(process.cwd(), "TASK_033_CONVERSION_REPORT.md")) {
  const markdown = buildKnowledgeAssetConversionSprintReportMarkdown();
  fs.writeFileSync(outputFilePath, markdown, "utf8");
  return outputFilePath;
}
