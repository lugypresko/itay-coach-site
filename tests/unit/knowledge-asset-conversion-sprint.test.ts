import { describe, expect, it } from "vitest";

import { knowledgeAssetSchema } from "../../src/ai/agents";
import { approvedInsightRepository } from "../../src/ai/insights";
import {
  buildKnowledgeAssetConversionSprintReportMarkdown,
  knowledgeAssetConversionSprintAssets,
  getKnowledgeAssetConversionSprintEntries,
  getKnowledgeAssetConversionSprintReport,
} from "../../src/seed";

describe("knowledge asset conversion sprint", () => {
  it("converts the first 10 approved insights into review-ready knowledge assets", () => {
    const entries = getKnowledgeAssetConversionSprintEntries();
    const report = getKnowledgeAssetConversionSprintReport();

    expect(entries).toHaveLength(10);
    expect(knowledgeAssetConversionSprintAssets).toHaveLength(10);
    expect(report.convertedCount).toBe(10);
    expect(report.remainingCount).toBe(40);
    expect(report.backlogSourceInsightIds).toHaveLength(40);
    expect(report.selectedTopics["Player Trap"]).toBe(4);
    expect(report.selectedTopics["Invisible Executor"]).toBe(3);
    expect(report.selectedTopics["The Push Leadership Evolution / Strategic Leadership"]).toBe(3);

    for (const entry of entries) {
      expect(approvedInsightRepository.some((insight) => insight.id === entry.sourceInsightId)).toBe(true);
      expect(entry.knowledgeAsset.sourceInsightId).toBe(entry.sourceInsightId);
      expect(entry.knowledgeAsset.reviewStatus).toBe("in_review");
      expect(knowledgeAssetSchema.safeParse(entry.knowledgeAsset).success).toBe(true);
    }
  });

  it("writes a conversion report that records the controlled backlog", () => {
    const reportMarkdown = buildKnowledgeAssetConversionSprintReportMarkdown();

    expect(reportMarkdown).toContain("Task 033 Conversion Report");
    expect(reportMarkdown).toContain("- converted KnowledgeAssets: 10");
    expect(reportMarkdown).toContain("- remaining approved insights: 40");
    expect(reportMarkdown).toContain("Player Trap: 4");
    expect(reportMarkdown).toContain("Invisible Executor: 3");
    expect(reportMarkdown).toContain("The Push Leadership Evolution / Strategic Leadership: 3");
  });
});
