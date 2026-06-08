import fs from "node:fs";
import path from "node:path";

import "./load-env";

import { getServerPayload } from "../lib/payload";
import { loadPublishedPublicContent } from "../lib/public-content-loader";

type EntityRecord = {
  id: number;
  slug: string;
  entityTags?: Array<{ value?: string }>;
};

type SurfaceRecord = {
  id: number;
  title?: string;
  slug?: string;
  status?: string;
  entityTags?: Array<{ value?: string }>;
  internalLinks?: Array<{
    targetSlug?: string;
    anchorText?: string;
    reason?: string;
  }>;
};

function unique(values: string[]) {
  return [...new Set(values)];
}

async function findBySlug<T extends SurfaceRecord | EntityRecord>(
  payload: Awaited<ReturnType<typeof getServerPayload>>,
  collection: "entity-pages" | "frameworks" | "pillar-pages" | "entities",
  slug: string,
) {
  const result = await payload.find({
    collection,
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 0,
  });

  return result.docs[0] as unknown as T | undefined;
}

async function main() {
  const payload = await getServerPayload();

  const entityTagSet = new Set<string>();
  const entityResult = await payload.find({
    collection: "entities",
    limit: 20,
    depth: 0,
  });

  for (const entity of entityResult.docs as EntityRecord[]) {
    for (const tag of entity.entityTags ?? []) {
      const value = tag.value ?? (tag as { tag?: string }).tag;
      if (value) {
        entityTagSet.add(value);
      }
    }
  }

  const records: Array<{
    collection: "entity-pages" | "frameworks" | "pillar-pages";
    expectedTitle: string;
    expectedStatus: string;
    expectedSlug: string;
    expectedSection: "entities" | "frameworks" | "pillars";
    expectedLinkedSlugs: string[];
  }> = [
    {
      collection: "entity-pages",
      expectedTitle: "The Push",
      expectedStatus: "review",
      expectedSlug: "the-push",
      expectedSection: "entities",
      expectedLinkedSlugs: ["itay-foyerstein", "invisible-executor"],
    },
    {
      collection: "frameworks",
      expectedTitle: "Invisible Executor Framework",
      expectedStatus: "review",
      expectedSlug: "invisible-executor",
      expectedSection: "frameworks",
      expectedLinkedSlugs: ["the-push", "tech-leadership-coaching"],
    },
    {
      collection: "pillar-pages",
      expectedTitle: "Tech Leadership Coaching for Engineering Managers, CTOs and VP R&D",
      expectedStatus: "review",
      expectedSlug: "tech-leadership-coaching",
      expectedSection: "pillars",
      expectedLinkedSlugs: ["itay-foyerstein", "the-push", "invisible-executor"],
    },
  ];

  const recordChecks = [];
  for (const recordDef of records) {
    const record = (await findBySlug<SurfaceRecord>(payload, recordDef.collection, recordDef.expectedSlug)) ?? null;
    const page = await loadPublishedPublicContent(recordDef.expectedSection, recordDef.expectedSlug, "http://localhost:3000");

    const entityTags = record?.entityTags?.map((entry) => entry.value ?? (entry as { tag?: string }).tag ?? "").filter(Boolean) ?? [];
    const internalLinks = record?.internalLinks ?? [];
    const linkedSlugs = unique(internalLinks.map((link) => link.targetSlug ?? "").filter(Boolean));

    recordChecks.push({
      slug: recordDef.expectedSlug,
      exists: Boolean(record),
      titleOk: record?.title === recordDef.expectedTitle,
      statusOk: record?.status === recordDef.expectedStatus,
      routeOk: Boolean(page),
      entityTagsOk: entityTags.length > 0 && entityTags.every((tag) => entityTagSet.has(tag)),
      linksOk: recordDef.expectedLinkedSlugs.every((slug) => linkedSlugs.includes(slug)),
    });
  }

  const counts = {
    entities: (await payload.count({ collection: "entities" })).totalDocs,
    relationships: (await payload.count({ collection: "entity_relationships" })).totalDocs,
    insights: (await payload.count({ collection: "insight_extractions" })).totalDocs,
  };

  const report = {
    counts,
    entityTagsChecked: entityTagSet.size,
    recordChecks,
    passes:
      counts.entities >= 9 &&
      counts.relationships >= 8 &&
      counts.insights >= 1 &&
      recordChecks.every((check) => check.exists && check.titleOk && check.statusOk && check.routeOk && check.entityTagsOk && check.linksOk),
  };

  const outputPath = path.resolve(process.cwd(), "TASK_013_VERIFICATION_REPORT.md");
  const md = `# Task 013 Verification Report

## Counts

- entities: ${counts.entities}
- relationships: ${counts.relationships}
- insights: ${counts.insights}

## Record checks

${recordChecks
  .map(
    (check) => `- ${check.slug}: exists=${check.exists ? "pass" : "fail"}, title=${check.titleOk ? "pass" : "fail"}, status=${check.statusOk ? "pass" : "fail"}, public-route=${check.routeOk ? "pass" : "fail"}, entity-tags=${check.entityTagsOk ? "pass" : "fail"}, links=${check.linksOk ? "pass" : "fail"}`,
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
