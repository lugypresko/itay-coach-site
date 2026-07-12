import "./load-env";
import { pathToFileURL } from "node:url";

import { getServerPayload } from "../lib/payload";
import { getProblemPageSeedAssets } from "./problem-pages";

type PayloadLike = Awaited<ReturnType<typeof getServerPayload>>;

async function upsertBySlug(payload: PayloadLike, slug: string, data: Record<string, unknown>) {
  const existing = await payload.find({
    collection: "problem-pages" as never,
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
      collection: "problem-pages" as never,
      id: doc.id,
      data: data as never,
    });
  }

  return payload.create({
    collection: "problem-pages" as never,
    data: data as never,
  });
}

export async function runProblemPagesSeed() {
  const payload = await getServerPayload();
  const assets = getProblemPageSeedAssets();

  for (const asset of assets) {
    await upsertBySlug(payload, asset.slug, asset);
  }

  return {
    assetCount: assets.length,
  };
}

async function main() {
  const result = await runProblemPagesSeed();
  console.log(`Seeded ${result.assetCount} problem page(s).`);
  process.exit(0);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
