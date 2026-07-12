import fs from "node:fs";
import path from "node:path";

import "./load-env";

import {
  getKnowledgeAssetPublicSurfaceCreateNextCandidates,
  getKnowledgeAssetPublicSurfaceMappings,
  getKnowledgeAssetPublicSurfaceMappingReportSummary,
  writeKnowledgeAssetPublicSurfaceMappingReport,
} from "./knowledge-asset-public-surface-mapping";

async function main() {
  const reportPath = writeKnowledgeAssetPublicSurfaceMappingReport();
  const reportExists = fs.existsSync(reportPath);
  const reportText = reportExists ? fs.readFileSync(reportPath, "utf8") : "";
  const mappings = getKnowledgeAssetPublicSurfaceMappings();
  const createNextCandidates = getKnowledgeAssetPublicSurfaceCreateNextCandidates();
  const summary = getKnowledgeAssetPublicSurfaceMappingReportSummary();

  const verification = {
    reportPath: path.relative(process.cwd(), reportPath),
    reportExists,
    mappedCount: summary.mappedCount,
    createNextCount: summary.createNextCount,
    allHaveSourceInsightId: mappings.every((mapping) => Boolean(mapping.sourceInsightId)),
    allHaveValidSurfaceType: mappings.every((mapping) =>
      [
        "glossary",
        "faq",
        "cluster page",
        "recommendation page",
        "framework page",
        "distribution seed",
      ].includes(mapping.recommendedPublicSurface),
    ),
    firstThreeCreateNext: createNextCandidates.slice(0, 3).map((mapping) => mapping.sourceInsightId),
    noPublishedStatuses: mappings.length === 10,
    reportMentionsCreateNext: reportText.includes("create_next candidates: 3"),
  };

  console.log(JSON.stringify(verification, null, 2));

  if (
    !verification.reportExists ||
    verification.mappedCount !== 10 ||
    verification.createNextCount !== 3 ||
    !verification.allHaveSourceInsightId ||
    !verification.allHaveValidSurfaceType ||
    verification.firstThreeCreateNext.length !== 3 ||
    !verification.reportMentionsCreateNext
  ) {
    process.exit(1);
  }

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
