import "./load-env";
import { pathToFileURL } from "node:url";

import { getKnowledgeAssetConversionSprintReport, writeKnowledgeAssetConversionSprintReport } from "./knowledge-asset-conversion-sprint";

async function main() {
  const reportPath = writeKnowledgeAssetConversionSprintReport();
  const report = getKnowledgeAssetConversionSprintReport();

  console.log(
    JSON.stringify(
      {
        reportPath,
        convertedCount: report.convertedCount,
        remainingCount: report.remainingCount,
      },
      null,
      2,
    ),
  );
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
