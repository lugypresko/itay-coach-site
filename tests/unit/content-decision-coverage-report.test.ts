import { describe, expect, it } from "vitest";

import { buildContentDecisionCoverageReport } from "../../src/seed/verify-content-decision-coverage";
import { contentDecisionPageDecisions, contentDecisionPageMappings } from "../../src/seed/content-decision-page-mapping";
import { contentDecisionVocabulary } from "../../src/ai/content-decision/vocabulary";

describe("ContentDecision coverage report", () => {
  it("records that the engineering-manager decision is outside the validation window", () => {
    const report = buildContentDecisionCoverageReport({
      pages: contentDecisionPageMappings,
      decisions: contentDecisionPageDecisions,
      vocabulary: contentDecisionVocabulary,
    });

    expect(report.totalPages).toBe(12);
    expect(report.mappedPages).toBe(11);
    expect(report.completePages).toBe(10);
    expect(report.incompletePages).toBe(1);
    expect(report.excludedPages).toEqual([{ canonicalPath: "/contact", reason: "Routing surface only; it is not a canonical authority or content-decision owner." }]);
    expect(report.failures).toEqual([
      {
        canonicalPath: "/engineering-manager-coach",
        failureCodes: ["stale_validation"],
        details: ["lastValidatedAt is outside the allowed validation window."],
      },
      {
        canonicalPath: "__batch__",
        failureCodes: ["stale_validation"],
        details: ["lastValidatedAt is outside the allowed validation window."],
      },
    ]);
    expect(report.goMetrics).toEqual({
      decisionCoverage: false,
      explicitSubgraphResolution: false,
      graphCleanliness: true,
      evidenceCoverage: true,
      deterministicRepeatability: true,
    });
    expect(report.go).toBe(false);
  });

  it("is deterministic for identical inputs", () => {
    const input = { pages: contentDecisionPageMappings, decisions: contentDecisionPageDecisions, vocabulary: contentDecisionVocabulary };
    expect(buildContentDecisionCoverageReport(input)).toEqual(buildContentDecisionCoverageReport(input));
  });
});
