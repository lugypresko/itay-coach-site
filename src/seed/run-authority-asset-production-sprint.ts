import type { PayloadRequest } from "payload";

import "./load-env";
import { pathToFileURL } from "node:url";

import { getServerPayload } from "../lib/payload";
import { authorityAssetProductionSprintAssets } from "./authority-asset-production-sprint";

type PayloadLike = Awaited<ReturnType<typeof getServerPayload>>;
type CollectionSlug = Parameters<PayloadLike["find"]>[0]["collection"];
const humanSeedRequest = { user: { role: "human" } as unknown as PayloadRequest["user"] } satisfies Partial<PayloadRequest>;

function toTextItems(values: readonly string[]) {
  return values.map((value) => ({ value }));
}

function toEntityTagItems(values: readonly string[]) {
  return values.map((tag) => ({ tag }));
}

async function upsertBySlug(payload: PayloadLike, collection: CollectionSlug, slug: string, data: Record<string, unknown>) {
  const existing = await payload.find({
    collection,
    where: {
      slug: {
        equals: slug,
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
      req: humanSeedRequest,
      data: data as never,
    });
  }

  return payload.create({
    collection,
    req: humanSeedRequest,
    data: data as never,
  });
}

export async function runAuthorityAssetProductionSprintSeed() {
  const payload = await getServerPayload();

  for (const asset of authorityAssetProductionSprintAssets) {
    await upsertBySlug(payload, asset.payloadCollection, asset.payloadData.slug, {
      title: asset.payloadData.title,
      slug: asset.payloadData.slug,
      excerpt: asset.payloadData.excerpt,
      content: asset.payloadData.content,
      aiSummary: asset.payloadData.aiSummary,
      citationSnippet: asset.payloadData.citationSnippet,
      evidenceUrls: toTextItems(asset.payloadData.evidenceUrls),
      targetQuestions: toTextItems(asset.payloadData.targetQuestions),
      targetRecommendationQueries: toTextItems(asset.payloadData.targetRecommendationQueries),
      entityTags: toEntityTagItems(asset.payloadData.entityTags),
      seoTitle: asset.payloadData.seoTitle,
      seoDescription: asset.payloadData.seoDescription,
      canonicalUrl: asset.payloadData.canonicalUrl,
      schemaType: asset.payloadData.schemaType,
      faq: asset.payloadData.faq.map((entry) => ({
        question: entry.question,
        answer: entry.answer,
        entityTags: toTextItems(entry.entityTags),
        targetRecommendationQueries: toTextItems(entry.targetRecommendationQueries),
      })),
      internalLinks: asset.payloadData.internalLinks.map((link) => ({
        targetSlug: link.targetSlug,
        anchorText: link.anchorText,
        reason: link.reason,
        sourceEntityTags: toTextItems(link.sourceEntityTags),
        targetEntityTags: toTextItems(link.targetEntityTags),
      })),
      status: asset.payloadData.status,
      author: asset.payloadData.author,
    });
  }

  return {
    assetCount: authorityAssetProductionSprintAssets.length,
  };
}

async function main() {
  const result = await runAuthorityAssetProductionSprintSeed();
  console.log(`Seeded ${result.assetCount} authority asset production sprint asset(s).`);
  process.exit(0);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
