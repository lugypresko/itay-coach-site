import "./load-env";
import { pathToFileURL } from "node:url";

import { getServerPayload } from "../lib/payload";
import { knowledgeAssetConversionSprintEntries } from "./knowledge-asset-conversion-sprint";

type PayloadLike = Awaited<ReturnType<typeof getServerPayload>>;
type CollectionSlug = Parameters<PayloadLike["find"]>[0]["collection"];

function toTextItems(values: readonly string[]) {
  return values.map((value) => ({ value }));
}

async function upsertBySourceInsightId(
  payload: PayloadLike,
  collection: CollectionSlug,
  sourceInsightId: string,
  data: Record<string, unknown>,
) {
  const existing = await payload.find({
    collection,
    where: {
      sourceInsightId: {
        equals: sourceInsightId,
      },
    },
    limit: 1,
    depth: 0,
  });

  const doc = existing.docs[0] as { id: string | number } | undefined;

  if (doc) {
    return payload.update({
      collection,
      id: doc.id,
      data: data as never,
    });
  }

  return payload.create({
    collection,
    data: data as never,
  });
}

export async function runKnowledgeAssetPayloadSeed() {
  const payload = await getServerPayload();

  for (const entry of knowledgeAssetConversionSprintEntries) {
    const approvedInsight = await payload.find({
      collection: "approved_insights",
      where: {
        sourceInsightId: {
          equals: entry.sourceInsightId,
        },
      },
      limit: 1,
      depth: 0,
    });

    const approvedDoc = approvedInsight.docs[0] as { id: string | number } | undefined;

    if (!approvedDoc) {
      throw new Error(`Missing approved insight in Payload: ${entry.sourceInsightId}`);
    }

    await upsertBySourceInsightId(payload, "knowledge_assets", entry.sourceInsightId, {
      sourceInsightId: entry.sourceInsightId,
      sourceInsightRecord: approvedDoc.id,
      claimIds: toTextItems(entry.knowledgeAsset.claimIds),
      targetQueries: toTextItems(entry.knowledgeAsset.targetQueries),
      targetEntities: toTextItems(entry.knowledgeAsset.targetEntities),
      shortAnswer: entry.knowledgeAsset.shortAnswer,
      reviewStatus: entry.knowledgeAsset.reviewStatus,
      title: entry.knowledgeAsset.title,
      summary: entry.knowledgeAsset.summary,
      evidenceUrls: toTextItems(entry.knowledgeAsset.evidenceUrls),
      sourceUrls: toTextItems(entry.knowledgeAsset.sourceUrls),
      reviewerNotes: entry.knowledgeAsset.reviewerNotes,
    });
  }

  return {
    knowledgeAssetCount: knowledgeAssetConversionSprintEntries.length,
  };
}

async function main() {
  const result = await runKnowledgeAssetPayloadSeed();
  console.log(`Seeded ${result.knowledgeAssetCount} knowledge asset record(s).`);
  process.exit(0);
}

const knowledgeAssetEntryPoint = process.argv[1];

if (knowledgeAssetEntryPoint && import.meta.url === pathToFileURL(knowledgeAssetEntryPoint).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
