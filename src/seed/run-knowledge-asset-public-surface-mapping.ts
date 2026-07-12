import "./load-env";
import { pathToFileURL } from "node:url";

import {
  getKnowledgeAssetPublicSurfaceMappingReportSummary,
  writeKnowledgeAssetPublicSurfaceMappingReport,
} from "./knowledge-asset-public-surface-mapping";

async function main() {
  const reportPath = writeKnowledgeAssetPublicSurfaceMappingReport();
  const summary = getKnowledgeAssetPublicSurfaceMappingReportSummary();

  console.log(
    JSON.stringify(
      {
        reportPath,
        ...summary,
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
