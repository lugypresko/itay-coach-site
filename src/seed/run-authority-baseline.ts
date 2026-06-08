import "./load-env";
import { pathToFileURL } from "node:url";
import fs from "node:fs";
import path from "node:path";

import { buildAuthorityBaselineReport, buildAuthorityGapReport } from "../ai/monitoring/authority-baseline";

function writeReport(filename: string, content: string) {
  const outputPath = path.resolve(process.cwd(), filename);
  fs.writeFileSync(outputPath, content, "utf8");
  return outputPath;
}

export function runAuthorityBaselineReports() {
  const baselineReport = buildAuthorityBaselineReport();
  const gapReport = buildAuthorityGapReport();

  const baselinePath = writeReport("AUTHORITY_BASELINE_REPORT.md", baselineReport);
  const gapPath = writeReport("AUTHORITY_GAPS_REPORT.md", gapReport);

  return {
    baselinePath,
    gapPath,
  };
}

async function main() {
  const result = runAuthorityBaselineReports();
  console.log(`Wrote ${result.baselinePath}`);
  console.log(`Wrote ${result.gapPath}`);
  process.exit(0);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
