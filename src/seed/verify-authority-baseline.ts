import fs from "node:fs";
import path from "node:path";

import "./load-env";

import {
  authorityBaselinePlatforms,
  authorityBaselineQueryDefinitions,
  buildAuthorityBaselineReport,
  buildAuthorityGapReport,
} from "../ai/monitoring/authority-baseline";
import { runAuthorityBaselineReports } from "./run-authority-baseline";

function verifyReportFile(filename: string) {
  const filePath = path.resolve(process.cwd(), filename);
  return fs.existsSync(filePath) && fs.readFileSync(filePath, "utf8").length > 0;
}

function countMeasurementRows(report: string) {
  return report
    .split("\n")
    .filter((line) => line.startsWith("| ") && line.includes("pending manual capture"))
    .length;
}

async function main() {
  const result = runAuthorityBaselineReports();

  const baseline = fs.readFileSync(result.baselinePath, "utf8");
  const gaps = fs.readFileSync(result.gapPath, "utf8");

  const report = {
    trackedQueries: authorityBaselineQueryDefinitions.length,
    platforms: authorityBaselinePlatforms.length,
    baselineExists: verifyReportFile("AUTHORITY_BASELINE_REPORT.md"),
    gapsExists: verifyReportFile("AUTHORITY_GAPS_REPORT.md"),
    baselineMeasurementRows: countMeasurementRows(baseline),
    baselineMentionsManualWorkflow: baseline.includes("Manual capture workflow"),
    gapsMentionsAuthorityGaps: gaps.includes("Authority gaps identified"),
    gapsMentionsManualFollowUp: gaps.includes("Manual follow-up"),
    expectedBaselineMatches: baseline === buildAuthorityBaselineReport(),
    expectedGapMatches: gaps === buildAuthorityGapReport(),
  };

  const passes =
    report.trackedQueries === 20 &&
    report.platforms === 4 &&
    report.baselineExists &&
    report.gapsExists &&
    report.baselineMeasurementRows === 80 &&
    report.baselineMentionsManualWorkflow &&
    report.gapsMentionsAuthorityGaps &&
    report.gapsMentionsManualFollowUp &&
    report.expectedBaselineMatches &&
    report.expectedGapMatches;

  console.log(JSON.stringify({ ...report, passes }, null, 2));

  if (!passes) {
    process.exit(1);
  }

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
