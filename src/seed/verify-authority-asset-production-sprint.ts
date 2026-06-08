import fs from "node:fs";
import path from "node:path";

import "./load-env";

import { getServerPayload } from "../lib/payload";
import { loadPublishedPublicContent } from "../lib/public-content-loader";
import { authorityAssetProductionSprintAssets } from "./authority-asset-production-sprint";

type ContentRecord = {
  id: number;
  slug?: string;
  title?: string;
  status?: string;
  entityTags?: Array<{ value?: string; tag?: string }>;
  internalLinks?: Array<{ targetSlug?: string }>;
};

const sectionByCollection: Record<string, "clusters" | "faqs" | "glossary" | "case-studies"> = {
  "cluster-pages": "clusters",
  faqs: "faqs",
  "glossary-terms": "glossary",
  "case-studies": "case-studies",
};

const renderableCollections = new Set(["cluster-pages", "faqs", "glossary-terms"]);

async function findBySlug(
  payload: Awaited<ReturnType<typeof getServerPayload>>,
  collection: "cluster-pages" | "faqs" | "glossary-terms" | "case-studies",
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
  const origin = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";

  const assetChecks = [];

  for (const asset of authorityAssetProductionSprintAssets) {
    const record = await findBySlug(payload, asset.payloadCollection, asset.payloadData.slug);
    const route = renderableCollections.has(asset.payloadCollection)
      ? await loadPublishedPublicContent(sectionByCollection[asset.payloadCollection], asset.payloadData.slug, origin)
      : null;

    const linkedSlugs = unique((record?.internalLinks ?? []).map((link) => link.targetSlug ?? "").filter(Boolean));
    const entityTags = (record?.entityTags ?? []).map((entry) => entry.value ?? entry.tag ?? "").filter(Boolean);

    assetChecks.push({
      slug: asset.payloadData.slug,
      collection: asset.payloadCollection,
      exists: Boolean(record),
      statusOk: record?.status === asset.payloadData.status,
      routeOk: asset.payloadData.status === "review" ? Boolean(route) : route === null,
      titleOk: record?.title === asset.payloadData.title,
      entityTagsOk: entityTags.length > 0,
      linksOk: asset.payloadData.internalLinks.every((link) => linkedSlugs.includes(link.targetSlug)),
    });
  }

  const report = {
    assetCount: authorityAssetProductionSprintAssets.length,
    reviewCount: authorityAssetProductionSprintAssets.filter((asset) => asset.payloadData.status === "review").length,
    draftCount: authorityAssetProductionSprintAssets.filter((asset) => asset.payloadData.status === "draft").length,
    assetChecks,
    passes:
      assetChecks.length === 10 &&
      assetChecks.every((check) => check.exists && check.statusOk && check.titleOk && check.entityTagsOk && check.linksOk && check.routeOk),
  };

  const outputPath = path.resolve(process.cwd(), "TASK_017_VERIFICATION_REPORT.md");
  const md = `# Task 017 Verification Report

## Assets

- total: ${report.assetCount}
- review: ${report.reviewCount}
- draft: ${report.draftCount}

## Record checks

${assetChecks
  .map(
    (check) =>
      `- ${check.slug} (${check.collection}): exists=${check.exists ? "pass" : "fail"}, title=${check.titleOk ? "pass" : "fail"}, status=${check.statusOk ? "pass" : "fail"}, route=${check.routeOk ? "pass" : "fail"}, entity-tags=${check.entityTagsOk ? "pass" : "fail"}, links=${check.linksOk ? "pass" : "fail"}`,
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
