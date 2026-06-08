import "./load-env";
import { pathToFileURL } from "node:url";

import { getServerPayload } from "../lib/payload";
import { authoritySurfaceSeedAssets } from "./authority-surface-seed";

type PayloadLike = Awaited<ReturnType<typeof getServerPayload>>;
type CollectionSlug = Parameters<PayloadLike["find"]>[0]["collection"];

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
      data: data as never,
    });
  }

  return payload.create({
    collection,
    data: data as never,
  });
}

export async function runAuthoritySurfaceSeed() {
  const payload = await getServerPayload();

  for (const asset of authoritySurfaceSeedAssets) {
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
    assetCount: authoritySurfaceSeedAssets.length,
  };
}

async function main() {
  const result = await runAuthoritySurfaceSeed();
  console.log(`Seeded ${result.assetCount} authority surface asset(s).`);
  process.exit(0);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
