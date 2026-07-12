import { describe, expect, it } from "vitest";

import { knowledgeAssetConversionSprintAssets } from "../../src/seed";
import {
  buildKnowledgeAssetPublicSurfaceMappingMarkdown,
  getKnowledgeAssetPublicSurfaceCreateNextCandidates,
  getKnowledgeAssetPublicSurfaceMappings,
  getKnowledgeAssetPublicSurfaceMappingReportSummary,
} from "../../src/seed";

describe("knowledge asset public surface mapping", () => {
  it("maps all 10 in-review knowledge assets to valid public surfaces", () => {
    const mappings = getKnowledgeAssetPublicSurfaceMappings();
    const summary = getKnowledgeAssetPublicSurfaceMappingReportSummary();
    const createNextCandidates = getKnowledgeAssetPublicSurfaceCreateNextCandidates();

    expect(knowledgeAssetConversionSprintAssets).toHaveLength(10);
    expect(knowledgeAssetConversionSprintAssets.every((asset) => asset.reviewStatus === "in_review")).toBe(true);
    expect(mappings).toHaveLength(10);
    expect(summary.mappedCount).toBe(10);
    expect(summary.createNextCount).toBe(3);
    expect(summary.needsExpansionCount).toBe(3);
    expect(summary.holdCount).toBe(4);
    expect(mappings.every((mapping) => Boolean(mapping.sourceInsightId))).toBe(true);
    expect(
      mappings.every((mapping) =>
        ["glossary", "faq", "cluster page", "recommendation page", "framework page", "distribution seed"].includes(
          mapping.recommendedPublicSurface,
        ),
      ),
    ).toBe(true);
    expect(createNextCandidates.map((entry) => entry.sourceInsightId)).toEqual([
      "approved-insight-player-trap-01",
      "approved-insight-invisible-executor-21",
      "approved-insight-leadership-evolution-36",
    ]);
  });

  it("writes a report with the first three create_next candidates", () => {
    const markdown = buildKnowledgeAssetPublicSurfaceMappingMarkdown();

    expect(markdown).toContain("KnowledgeAsset Public Surface Mapping");
    expect(markdown).toContain("create_next candidates: 3");
    expect(markdown).toContain("coach-for-engineering-managers-stuck-as-the-bottleneck");
    expect(markdown).toContain("invisible-executor");
    expect(markdown).toContain("engineering-manager-coach-for-strategic-leadership");
  });
});
