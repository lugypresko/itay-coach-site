import { describe, expect, it } from "vitest";

import { buildContentDecisionCoverageReport } from "../../src/seed/verify-content-decision-coverage";
import { contentDecisionPageDecisions, contentDecisionPageMappings } from "../../src/seed/content-decision-page-mapping";
import { contentDecisionVocabulary } from "../../src/ai/content-decision/vocabulary";

describe("ContentDecision coverage report", () => {
  it("passes the five GO metrics for the Phase 0 mapping baseline", () => {
    const report = buildContentDecisionCoverageReport({
      pages: contentDecisionPageMappings,
      decisions: contentDecisionPageDecisions,
      vocabulary: contentDecisionVocabulary,
    });

    expect(report.totalPages).toBe(12);
    expect(report.completePages).toBe(11);
    expect(report.excludedPages).toEqual([{ canonicalPath: "/contact", reason: "Routing surface only; it is not a canonical authority or content-decision owner." }]);
    expect(report.goMetrics).toEqual({
      decisionCoverage: true,
      explicitSubgraphResolution: true,
      graphCleanliness: true,
      evidenceCoverage: true,
      deterministicRepeatability: true,
    });
    expect(report.go).toBe(true);
  });

  it("is deterministic for identical inputs", () => {
    const input = { pages: contentDecisionPageMappings, decisions: contentDecisionPageDecisions, vocabulary: contentDecisionVocabulary };
    expect(buildContentDecisionCoverageReport(input)).toEqual(buildContentDecisionCoverageReport(input));
  });
});
