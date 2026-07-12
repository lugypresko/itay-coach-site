import "./load-env";
import { pathToFileURL } from "node:url";

import { runApprovedInsightPayloadSeed } from "./approved-insight-payload-seed";
import { runKnowledgeAssetPayloadSeed } from "./knowledge-asset-payload-seed";

async function main() {
  const approvedInsightResult = await runApprovedInsightPayloadSeed();
  const knowledgeAssetResult = await runKnowledgeAssetPayloadSeed();

  console.log(
    `Seeded ${approvedInsightResult.approvedInsightCount} approved insight record(s) and ${knowledgeAssetResult.knowledgeAssetCount} knowledge asset record(s).`,
  );
  process.exit(0);
}

const factoryStorageEntryPoint = process.argv[1];

if (factoryStorageEntryPoint && import.meta.url === pathToFileURL(factoryStorageEntryPoint).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
