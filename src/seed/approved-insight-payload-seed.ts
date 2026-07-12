import "./load-env";
import { pathToFileURL } from "node:url";

import { approvedInsightRepository } from "../ai/insights";
import { getServerPayload } from "../lib/payload";

type PayloadLike = Awaited<ReturnType<typeof getServerPayload>>;
type CollectionSlug = Parameters<PayloadLike["find"]>[0]["collection"];

function toTextItems(values: readonly string[]) {
  return values.map((value) => ({ value }));
}

function toClaimItems(
  claims: readonly {
    text: string;
    evidenceUrls: readonly string[];
    targetQueries: readonly string[];
    targetEntities: readonly string[];
  }[],
) {
  return claims.map((claim) => ({
    text: claim.text,
    evidenceUrls: toTextItems(claim.evidenceUrls),
    targetQueries: toTextItems(claim.targetQueries),
    targetEntities: toTextItems(claim.targetEntities),
  }));
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

export function getApprovedInsightPayloadSeedEntries() {
  return approvedInsightRepository.map((insight) => ({
    sourceInsightId: insight.id,
    payloadData: {
      sourceInsightId: insight.id,
      sourceTitle: insight.sourceTitle,
      sourceType: insight.sourceType,
      status: "approved" as const,
      capturedAt: insight.capturedAt,
      approvedAt: insight.approvedAt,
      approvedBy: insight.approvedBy,
      freshnessExpiresAt: insight.freshnessExpiresAt,
      summary: insight.summary,
      rawText: insight.rawText,
      claims: toClaimItems(insight.claims),
      evidenceUrls: toTextItems(insight.evidenceUrls),
      entityTags: toTextItems(insight.entityTags),
      targetQueries: toTextItems(insight.targetQueries),
      targetRecommendationQueries: toTextItems(insight.targetRecommendationQueries ?? insight.targetQueries),
      sourceUrls: toTextItems(insight.sourceUrls),
      authorityPurpose: insight.authorityPurpose,
      linkedContentJobId: insight.linkedContentJobId,
      reviewerNotes: insight.reviewerNotes,
    },
  }));
}

export const approvedInsightPayloadSeedEntries = getApprovedInsightPayloadSeedEntries();

export async function runApprovedInsightPayloadSeed() {
  const payload = await getServerPayload();

  for (const entry of approvedInsightPayloadSeedEntries) {
    await upsertBySourceInsightId(payload, "approved_insights", entry.sourceInsightId, {
      ...entry.payloadData,
    });
  }

  return {
    approvedInsightCount: approvedInsightPayloadSeedEntries.length,
  };
}

async function main() {
  const result = await runApprovedInsightPayloadSeed();
  console.log(`Seeded ${result.approvedInsightCount} approved insight record(s).`);
  process.exit(0);
}

const approvedInsightEntryPoint = process.argv[1];

if (approvedInsightEntryPoint && import.meta.url === pathToFileURL(approvedInsightEntryPoint).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
