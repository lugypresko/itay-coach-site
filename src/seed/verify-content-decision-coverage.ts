import fs from "node:fs";
import path from "node:path";

import { contentDecisionSchema, type ContentDecision } from "../ai/content-decision/contracts";
import { resolveContentDecision } from "../ai/content-decision/resolve-content-decision";
import { validateContentDecision, validateContentDecisions } from "../ai/content-decision/validate-content-decision";
import type { ContentDecisionVocabulary } from "../ai/content-decision/vocabulary";
import type { ContentDecisionPageMapping } from "./content-decision-page-mapping";

export interface ContentDecisionCoverageReport {
  totalPages: number;
  mappedPages: number;
  completePages: number;
  incompletePages: number;
  unmappedPages: string[];
  excludedPages: Array<{ canonicalPath: string; reason: string }>;
  failures: Array<{ canonicalPath: string; failureCodes: string[]; details: string[] }>;
  goMetrics: {
    decisionCoverage: boolean;
    explicitSubgraphResolution: boolean;
    graphCleanliness: boolean;
    evidenceCoverage: boolean;
    deterministicRepeatability: boolean;
  };
  go: boolean;
}

export interface ContentDecisionCoverageInput {
  pages: ContentDecisionPageMapping[];
  decisions: ContentDecision[];
  vocabulary: ContentDecisionVocabulary;
}

function calculateReport(input: ContentDecisionCoverageInput): Omit<ContentDecisionCoverageReport, "goMetrics" | "go"> {
  const decisionById = new Map(input.decisions.map((decision) => [decision.id, decision]));
  const batchValidation = validateContentDecisions(input.decisions, { vocabulary: input.vocabulary });
  const failures: ContentDecisionCoverageReport["failures"] = [];
  const unmappedPages: string[] = [];
  const excludedPages: Array<{ canonicalPath: string; reason: string }> = [];
  let completePages = 0;

  for (const page of input.pages) {
    if (page.mappingStatus === "excluded") {
      excludedPages.push({ canonicalPath: page.canonicalPath, reason: page.exclusionReason ?? "No reason supplied." });
      continue;
    }
    if (!page.decisionId) {
      unmappedPages.push(page.canonicalPath);
      continue;
    }

    const decision = decisionById.get(page.decisionId);
    if (!decision) {
      failures.push({ canonicalPath: page.canonicalPath, failureCodes: ["orphan_reference"], details: [`Missing decision ${page.decisionId}.`] });
      continue;
    }

    const validation = validateContentDecision(decision, { vocabulary: input.vocabulary });
    try {
      resolveContentDecision(input.decisions, page.canonicalPath, input.vocabulary);
    } catch (error) {
      validation.failureCodes.push("orphan_reference");
      validation.details.push(error instanceof Error ? error.message : String(error));
    }

    if (validation.valid) {
      completePages += 1;
    } else {
      failures.push({ canonicalPath: page.canonicalPath, failureCodes: validation.failureCodes, details: validation.details });
    }
  }

  if (!batchValidation.valid) {
    failures.push({ canonicalPath: "__batch__", failureCodes: batchValidation.failureCodes, details: batchValidation.details });
  }

  return {
    totalPages: input.pages.length,
    mappedPages: input.pages.filter((page) => Boolean(page.decisionId)).length,
    completePages,
    incompletePages: input.pages.length - completePages - unmappedPages.length - excludedPages.length,
    unmappedPages,
    excludedPages,
    failures,
  };
}

export function buildContentDecisionCoverageReport(input: ContentDecisionCoverageInput): ContentDecisionCoverageReport {
  const base = calculateReport(input);
  const repeated = calculateReport(input);
  const deterministicRepeatability = JSON.stringify(base) === JSON.stringify(repeated);
  const goMetrics = {
    decisionCoverage: base.completePages >= 11,
    explicitSubgraphResolution: base.mappedPages > 0 && base.completePages === base.mappedPages,
    graphCleanliness: !base.failures.some((failure) => failure.failureCodes.some((code) => ["orphan_reference", "duplicate_canonical_path", "conflicting_active_version"].includes(code))),
    evidenceCoverage: !base.failures.some((failure) => failure.failureCodes.includes("missing_evidence")),
    deterministicRepeatability,
  };

  return { ...base, goMetrics, go: Object.values(goMetrics).every(Boolean) };
}

export function buildContentDecisionCoverageReportMarkdown(report: ContentDecisionCoverageReport) {
  return [
    "# ContentDecision Coverage Report",
    "",
    `- total pages: ${report.totalPages}`,
    `- mapped pages: ${report.mappedPages}`,
    `- complete pages: ${report.completePages}`,
    `- incomplete pages: ${report.incompletePages}`,
    `- unmapped pages: ${report.unmappedPages.length === 0 ? "none" : report.unmappedPages.join(", ")}`,
    `- explicitly excluded pages: ${report.excludedPages.length === 0 ? "none" : report.excludedPages.map((page) => `${page.canonicalPath} (${page.reason})`).join(", ")}`,
    "",
    "## GO metrics",
    `- decision coverage: ${report.goMetrics.decisionCoverage ? "pass" : "fail"}`,
    `- explicit subgraph resolution: ${report.goMetrics.explicitSubgraphResolution ? "pass" : "fail"}`,
    `- graph cleanliness: ${report.goMetrics.graphCleanliness ? "pass" : "fail"}`,
    `- evidence coverage: ${report.goMetrics.evidenceCoverage ? "pass" : "fail"}`,
    `- deterministic repeatability: ${report.goMetrics.deterministicRepeatability ? "pass" : "fail"}`,
    `- overall GO: ${report.go ? "pass" : "fail"}`,
    "",
    "## Failures",
    ...(report.failures.length === 0 ? ["- none"] : report.failures.map((failure) => `- ${failure.canonicalPath}: ${failure.failureCodes.join(", ")} — ${failure.details.join("; ")}`)),
  ].join("\n");
}

export function writeContentDecisionCoverageReport(report: ContentDecisionCoverageReport) {
  const outputPath = path.resolve(process.cwd(), "docs/reports/CONTENT_DECISION_COVERAGE_REPORT.md");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${buildContentDecisionCoverageReportMarkdown(report)}\n`, "utf8");
  return outputPath;
}

export { contentDecisionSchema };
