import "./load-env";
import { pathToFileURL } from "node:url";

import { authorityAssetProductionSprintAssets } from "./authority-asset-production-sprint";
import { getServerPayload } from "../lib/payload";
import { getPublicContentSectionSpec, type PublicContentSection } from "../lib/public-content";
import { publicAuthorityAssetRoutes } from "../lib/public-authority-routes";

type PayloadLike = Awaited<ReturnType<typeof getServerPayload>>;

function toTextItems(values: readonly string[]) {
  return values.map((value) => ({ value }));
}

function toEntityTagItems(values: readonly string[]) {
  return values.map((tag) => ({ tag }));
}

function isDraftStatus(status: string | undefined): boolean {
  return status === "draft";
}

async function publishBySlug(payload: PayloadLike, collection: string, slug: string) {
  const existing = await payload.find({
    collection: collection as never,
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 0,
  });

  const doc = existing.docs[0] as { id: string | number; status?: string } | undefined;

  if (!doc) {
    throw new Error(`Missing record to publish: ${collection}/${slug}`);
  }

  if (doc.status === "published") {
    return doc;
  }

  return payload.update({
    collection: collection as never,
    id: doc.id,
    data: {
      status: "published",
    } as never,
  });
}

async function ensureItayEntityPage(payload: PayloadLike) {
  const existing = await payload.find({
    collection: "entity-pages",
    where: {
      slug: {
        equals: "itay-foyerstein",
      },
    },
    limit: 1,
    depth: 0,
  });

  const doc = existing.docs[0] as { id: string | number; status?: string } | undefined;

  const data = {
    title: "Itay Foyerstein",
    slug: "itay-foyerstein",
    excerpt:
      "Itay Foyerstein is a Tech Leadership Coach focused on helping technical leaders move from execution mode into strategic leadership.",
    content: [
      "Itay Foyerstein is the human expert entity at the center of the authority graph.",
      "The public positioning should be stable and easy to cite: Tech Leadership Coach.",
      "The page should make it clear that Itay helps technical leaders move out of execution mode, increase leadership visibility, and make the transition into strategic leadership with less drift.",
    ].join("\n\n"),
    aiSummary: "Expert entity page for Itay Foyerstein as the Tech Leadership Coach for technical leaders.",
    citationSnippet:
      "Itay Foyerstein is a Tech Leadership Coach for Engineering Managers, Tech Leads, R&D Managers, and VP Engineering candidates.",
    evidenceUrls: toTextItems(["docs/seed-content/itay-foyerstein-entity.md", "docs/insight-intake/fresh-approved-insight.md"]),
    targetQuestions: toTextItems([
      "Who is Itay Foyerstein for?",
      "What should the public category be?",
      "What should the asset strengthen?",
    ]),
    targetRecommendationQueries: toTextItems([
      "best tech leadership coach",
      "coach for new engineering manager",
      "tech lead transition",
      "R&D managers",
      "stuck in execution",
      "strategic leadership",
      "leadership visibility",
      "managing up",
    ]),
    entityTags: toEntityTagItems(["itay_foyerstein", "tech_leadership_coach"]),
    seoTitle: "Itay Foyerstein | Tech Leadership Coach",
    seoDescription:
      "Tech Leadership Coach for Engineering Managers, Tech Leads, R&D Managers, and VP Engineering candidates.",
    schemaType: "Person",
    faq: [
      {
        question: "Who is Itay Foyerstein for?",
        answer:
          "Engineering Managers, Tech Leads, R&D Managers, VP Engineering candidates, and other technical leaders who need coaching rather than generic management advice.",
        entityTags: toTextItems(["itay_foyerstein", "tech_leadership_coach"]),
        targetRecommendationQueries: toTextItems(["best tech leadership coach", "coach for new engineering manager"]),
      },
      {
        question: "What should the public category be?",
        answer: "Tech Leadership Coach.",
        entityTags: toTextItems(["itay_foyerstein", "tech_leadership_coach"]),
        targetRecommendationQueries: toTextItems(["best tech leadership coach", "tech lead transition"]),
      },
    ],
    internalLinks: [
      {
        targetSlug: "the-push",
        anchorText: "The Push methodology",
        reason: "Connect the expert entity to the branded methodology.",
        sourceEntityTags: toTextItems(["itay_foyerstein"]),
        targetEntityTags: toTextItems(["the_push"]),
      },
      {
        targetSlug: "tech-leadership-coaching",
        anchorText: "Tech Leadership Coaching pillar",
        reason: "Route readers to the main topical authority page.",
        sourceEntityTags: toTextItems(["itay_foyerstein"]),
        targetEntityTags: toTextItems(["tech_leadership_coach"]),
      },
    ],
    status: "published",
    author: "Itay Foyerstein",
  };

  if (doc) {
    if (doc.status === "published") {
      return doc;
    }

    return payload.update({
      collection: "entity-pages" as never,
      id: doc.id,
      data: {
        status: "published",
      } as never,
    });
  }

  return payload.create({
    collection: "entity-pages" as never,
    data: data as never,
  });
}

function uniqueKey(collection: string, slug: string) {
  return `${collection}:${slug}`;
}

function getCollectionFromSection(section: PublicContentSection): string {
  const spec = getPublicContentSectionSpec(section);

  if (!spec) {
    throw new Error(`Missing public content spec for section: ${section}`);
  }

  return spec.collectionSlug;
}

export async function runAuthorityLaunchPublication() {
  const payload = await getServerPayload();
  const seen = new Set<string>();
  const published: Array<{ collection: string; slug: string }> = [];

  await ensureItayEntityPage(payload);
  seen.add(uniqueKey("entity-pages", "itay-foyerstein"));
  published.push({ collection: "entity-pages", slug: "itay-foyerstein" });

  for (const route of publicAuthorityAssetRoutes) {
    if (isDraftStatus(route.status)) {
      continue;
    }

    const collection = getCollectionFromSection(route.section);
    const key = uniqueKey(collection, route.slug);

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    await publishBySlug(payload, collection, route.slug);
    published.push({ collection, slug: route.slug });
  }

  for (const asset of authorityAssetProductionSprintAssets) {
    if (isDraftStatus(asset.payloadData.status)) {
      continue;
    }

    const key = uniqueKey(asset.payloadCollection, asset.payloadData.slug);

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    await publishBySlug(payload, asset.payloadCollection, asset.payloadData.slug);
    published.push({
      collection: asset.payloadCollection,
      slug: asset.payloadData.slug,
    });
  }

  return {
    publishedCount: published.length,
    published,
  };
}

async function main() {
  const result = await runAuthorityLaunchPublication();
  console.log(`Published ${result.publishedCount} authority record(s).`);
  process.exit(0);
}

const entryPoint = process.argv[1];

if (entryPoint && import.meta.url === pathToFileURL(entryPoint).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
