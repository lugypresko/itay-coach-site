import fs from "node:fs";
import path from "node:path";

import "./load-env";

import { getServerPayload } from "../lib/payload";
import { getPublicAuthorityAssetPathnames } from "../lib/public-authority-routes";
import { loadPublishedPublicContent } from "../lib/public-content-loader";
import { reviewReadyPublicSurfaceBatchAssets } from "./review-ready-public-surface-batch";

type ContentRecord = {
  id: number;
  slug?: string;
  title?: string;
  status?: string;
  entityTags?: Array<{ value?: string; tag?: string }>;
  internalLinks?: Array<{ targetSlug?: string }>;
};

const sectionByCollection: Record<string, "clusters" | "frameworks"> = {
  "cluster-pages": "clusters",
  frameworks: "frameworks",
};

async function findBySlug(
  payload: Awaited<ReturnType<typeof getServerPayload>>,
  collection: "cluster-pages" | "frameworks",
  slug: string,
) {
  const result = await payload.find({
    collection,
    overrideAccess: true,
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 0,
  });

  return result.docs[0] as ContentRecord | undefined;
}

function unique(values: string[]) {
  return [...new Set(values)];
}

async function main() {
  const payload = await getServerPayload();
  const origin = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3003";

  const assetChecks = [];

  for (const asset of reviewReadyPublicSurfaceBatchAssets) {
    const collection = asset.payloadCollection === "frameworks" ? "frameworks" : "cluster-pages";
    const record = await findBySlug(payload, collection, asset.payloadData.slug);
    const section = sectionByCollection[collection];
    const route = await loadPublishedPublicContent(section, asset.payloadData.slug, origin);
    const assetPathnames = getPublicAuthorityAssetPathnames({ includeDrafts: true });
    const expectedPathname = `/${section}/${asset.payloadData.slug}`;

    const linkedSlugs = unique((record?.internalLinks ?? []).map((link) => link.targetSlug ?? "").filter(Boolean));
    const entityTags = (record?.entityTags ?? []).map((entry) => entry.value ?? entry.tag ?? "").filter(Boolean);

    assetChecks.push({
      slug: asset.payloadData.slug,
      collection: asset.payloadCollection,
      exists: Boolean(record),
      statusOk: record?.status === asset.payloadData.status,
      routeOk: Boolean(route),
      titleOk: record?.title === asset.payloadData.title,
      entityTagsOk: entityTags.length > 0,
      linksOk: asset.payloadData.internalLinks.every((link) => linkedSlugs.includes(link.targetSlug)),
      routeListedOk: assetPathnames.includes(expectedPathname),
    });
  }

  const report = {
    assetCount: reviewReadyPublicSurfaceBatchAssets.length,
    assetChecks,
    passes:
      assetChecks.length === 3 &&
      assetChecks.every(
        (check) => check.exists && check.statusOk && check.titleOk && check.entityTagsOk && check.linksOk && check.routeOk && check.routeListedOk,
      ),
  };

  const outputPath = path.resolve(process.cwd(), "TASK_038_PUBLIC_SURFACE_BATCH_REPORT.md");
  const md = `# Task 038 Verification Report

## Assets

- total: ${report.assetCount}
- review-ready: ${report.assetCount}

## Record checks

${assetChecks
  .map(
    (check) =>
      `- ${check.slug} (${check.collection}): exists=${check.exists ? "pass" : "fail"}, title=${check.titleOk ? "pass" : "fail"}, status=${check.statusOk ? "pass" : "fail"}, route=${check.routeOk ? "pass" : "fail"}, route-listed=${check.routeListedOk ? "pass" : "fail"}, entity-tags=${check.entityTagsOk ? "pass" : "fail"}, links=${check.linksOk ? "pass" : "fail"}`,
  )
  .join("\n")}

## Result

- overall: ${report.passes ? "pass" : "fail"}
`;

  fs.writeFileSync(outputPath, md, "utf8");
  console.log(JSON.stringify(report, null, 2));

  if (!report.passes) {
    process.exit(1);
  }

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
