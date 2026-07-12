import fs from "node:fs";
import path from "node:path";

import "./load-env";

import {
  getKnowledgeAssetConversionSprintEntries,
  getKnowledgeAssetConversionSprintReport,
  writeKnowledgeAssetConversionSprintReport,
} from "./knowledge-asset-conversion-sprint";

async function main() {
  const entries = getKnowledgeAssetConversionSprintEntries();
  const report = getKnowledgeAssetConversionSprintReport();
  const reportPath = writeKnowledgeAssetConversionSprintReport();

  const reportExists = fs.existsSync(reportPath);
  const reportText = reportExists ? fs.readFileSync(reportPath, "utf8") : "";

  const verification = {
    reportPath: path.relative(process.cwd(), reportPath),
    reportExists,
    convertedCount: report.convertedCount,
    remainingCount: report.remainingCount,
    entriesHaveSourceLinks: entries.every((entry) => Boolean(entry.knowledgeAsset.sourceInsightId)),
    entriesAreReviewReady: entries.every((entry) => entry.knowledgeAsset.reviewStatus === "in_review"),
    entriesAreValidCount: entries.length === 10,
    backlogCount: report.backlogSourceInsightIds.length,
    reportMentionsConvertedCount: reportText.includes("- converted KnowledgeAssets: 10"),
    reportMentionsRemainingCount: reportText.includes("- remaining approved insights: 40"),
  };

  console.log(JSON.stringify(verification, null, 2));

  if (
    !verification.reportExists ||
    !verification.entriesAreValidCount ||
    !verification.entriesHaveSourceLinks ||
    !verification.entriesAreReviewReady ||
    verification.convertedCount !== 10 ||
    verification.remainingCount !== 40 ||
    !verification.reportMentionsConvertedCount ||
    !verification.reportMentionsRemainingCount
  ) {
    process.exit(1);
  }

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
