import "./load-env";
import { pathToFileURL } from "node:url";

import { getServerPayload } from "../lib/payload";
import {
  approvedInsightPayloadSeedEntries,
} from "./approved-insight-payload-seed";
import { knowledgeAssetConversionSprintEntries } from "./knowledge-asset-conversion-sprint";
import { getKnowledgeAssetPublicSurfaceCreateNextCandidates } from "./knowledge-asset-public-surface-mapping";

export interface PayloadFactoryStorageVerificationReport {
  approvedInsightCount: number;
  knowledgeAssetCount: number;
  approvedInsightIds: string[];
  knowledgeAssetSourceInsightIds: string[];
  linkedKnowledgeAssetCount: number;
  createNextCandidateIds: string[];
  status: "pass" | "fail";
}

export async function getPayloadFactoryStorageVerificationReport(): Promise<PayloadFactoryStorageVerificationReport> {
  const payload = await getServerPayload();

  const approvedInsights = await payload.find({
    collection: "approved_insights",
    limit: 100,
    depth: 0,
  });
  const knowledgeAssets = await payload.find({
    collection: "knowledge_assets",
    limit: 100,
    depth: 0,
  });

  const approvedInsightIds = approvedInsights.docs.map((doc) => (doc as { sourceInsightId?: string }).sourceInsightId ?? "");
  const knowledgeAssetSourceInsightIds = knowledgeAssets.docs.map(
    (doc) => (doc as { sourceInsightId?: string }).sourceInsightId ?? "",
  );

  const linkedKnowledgeAssetCount = knowledgeAssets.docs.filter((doc) => {
    const record = doc as { sourceInsightRecord?: string | number | { id?: string | number } };
    return Boolean(record.sourceInsightRecord);
  }).length;

  const expectedApprovedCount = approvedInsightPayloadSeedEntries.length;
  const expectedKnowledgeAssetCount = knowledgeAssetConversionSprintEntries.length;

  const status =
    approvedInsights.totalDocs === expectedApprovedCount &&
    knowledgeAssets.totalDocs === expectedKnowledgeAssetCount &&
    linkedKnowledgeAssetCount === expectedKnowledgeAssetCount &&
    knowledgeAssetSourceInsightIds.every((sourceInsightId) =>
      approvedInsightIds.includes(sourceInsightId),
    )
      ? "pass"
      : "fail";

  return {
    approvedInsightCount: approvedInsights.totalDocs,
    knowledgeAssetCount: knowledgeAssets.totalDocs,
    approvedInsightIds,
    knowledgeAssetSourceInsightIds,
    linkedKnowledgeAssetCount,
    createNextCandidateIds: getKnowledgeAssetPublicSurfaceCreateNextCandidates().map(
      (entry) => entry.sourceInsightId,
    ),
    status,
  };
}

async function main() {
  const report = await getPayloadFactoryStorageVerificationReport();

  console.log(JSON.stringify(report, null, 2));

  if (report.status !== "pass") {
    process.exit(1);
  }

  process.exit(0);
}

const payloadFactoryStorageEntryPoint = process.argv[1];

if (payloadFactoryStorageEntryPoint && import.meta.url === pathToFileURL(payloadFactoryStorageEntryPoint).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
