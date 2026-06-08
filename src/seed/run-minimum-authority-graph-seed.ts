import "./load-env";

import { calculateEntityAuthorityScore } from "../ai/governance/authority-model";
import { getServerPayload } from "../lib/payload";
import { minimumAuthorityGraphSeed } from "./minimum-authority-graph";

type PayloadLike = Awaited<ReturnType<typeof getServerPayload>>;
type CollectionSlug = Parameters<PayloadLike["find"]>[0]["collection"];

function toTextItems(values: readonly string[]) {
  return values.map((value) => ({ value }));
}

function toClaimItems(
  claims: readonly {
    text: string;
    evidenceUrls: readonly string[];
    targetRecommendationQueries: readonly string[];
    entityTags: readonly string[];
  }[],
) {
  return claims.map((claim) => ({
    text: claim.text,
    evidenceUrls: toTextItems(claim.evidenceUrls),
    targetRecommendationQueries: toTextItems(claim.targetRecommendationQueries),
    entityTags: toTextItems(claim.entityTags),
  }));
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

async function upsertInsight(payload: PayloadLike) {
  const insight = minimumAuthorityGraphSeed.insight;

  const existing = await payload.find({
    collection: "insight_extractions",
    where: {
      and: [
        {
          sourceTitle: {
            equals: insight.sourceTitle,
          },
        },
        {
          sourceType: {
            equals: insight.sourceType,
          },
        },
        {
          capturedAt: {
            equals: insight.capturedAt,
          },
        },
      ],
    },
    limit: 1,
    depth: 0,
  });

  const data = {
    sourceTitle: insight.sourceTitle,
    sourceType: insight.sourceType,
    status: insight.status,
    capturedAt: insight.capturedAt,
    approvedAt: insight.approvedAt,
      summary: insight.summary,
      rawText: insight.rawText,
      claims: toClaimItems(insight.claims),
      evidenceUrls: toTextItems(insight.evidenceUrls),
      entityTags: toTextItems(insight.entityTags),
      targetRecommendationQueries: toTextItems(insight.targetRecommendationQueries),
      sourceUrls: toTextItems(insight.sourceUrls),
      approvedBy: insight.approvedBy,
      authorityPurpose: insight.authorityPurpose,
      linkedContentJobId: insight.linkedContentJobId,
      reviewerNotes: insight.reviewerNotes,
    };

  const doc = existing.docs[0] as { id: string | number } | undefined;

  if (doc) {
    return payload.update({
      collection: "insight_extractions",
      id: doc.id,
      data: data as never,
    });
  }

  return payload.create({
    collection: "insight_extractions",
    data: data as never,
  });
}

type SeedRunSummary = {
  entityCount: number;
  relationshipCount: number;
  insightCount: number;
};

export async function runMinimumAuthorityGraphSeed(): Promise<SeedRunSummary> {
  const payload = await getServerPayload();

  const createdEntities = new Map<string, { id: string | number; data: (typeof minimumAuthorityGraphSeed.entities)[number] }>();

  for (const entity of minimumAuthorityGraphSeed.entities) {
    const created = await upsertBySlug(payload, "entities", entity.slug, {
      name: entity.name,
      slug: entity.slug,
      entityType: entity.entityType,
      category: entity.category,
      canonicalRole: entity.canonicalRole,
      description: entity.description,
      targetRecommendationQueries: toTextItems(entity.targetRecommendationQueries),
      entityTags: toTextItems(entity.entityTags),
      evidenceUrls: toTextItems(entity.evidenceUrls),
      status: entity.status,
      notes: entity.notes,
      authorityScore: 0,
      authorityTier: "foundational",
    });

    createdEntities.set(entity.slug, { id: created.id, data: entity });
  }

  for (const relationship of minimumAuthorityGraphSeed.relationships) {
    const source = createdEntities.get(relationship.sourceSlug);
    const target = createdEntities.get(relationship.targetSlug);

    if (!source || !target) {
      throw new Error(`Missing entity for relationship ${relationship.sourceSlug} -> ${relationship.targetSlug}`);
    }

    const existing = await payload.find({
      collection: "entity_relationships",
      where: {
        and: [
          {
            sourceEntity: {
              equals: source.id,
            },
          },
          {
            targetEntity: {
              equals: target.id,
            },
          },
          {
            relationshipType: {
              equals: relationship.relationshipType,
            },
          },
        ],
      },
      limit: 1,
      depth: 0,
    });

    const data = {
      sourceEntity: source.id,
      targetEntity: target.id,
      relationshipType: relationship.relationshipType,
      weight: relationship.weight,
      rationale: relationship.rationale,
      targetRecommendationQueries: toTextItems(relationship.targetRecommendationQueries),
      evidenceUrls: toTextItems(relationship.evidenceUrls),
      status: relationship.status,
      notes: relationship.notes,
    };

    const doc = existing.docs[0] as { id: string | number } | undefined;

    if (doc) {
      await payload.update({
        collection: "entity_relationships",
        id: doc.id,
        data: data as never,
      });
    } else {
      await payload.create({
        collection: "entity_relationships",
        data: data as never,
      });
    }
  }

  const relationships = await payload.find({
    collection: "entity_relationships",
    depth: 0,
    limit: 100,
  });

  for (const entity of minimumAuthorityGraphSeed.entities) {
    const entityId = createdEntities.get(entity.slug)?.id;
    const sourceCount = relationships.docs.filter((record) => (record as { sourceEntity?: string | number }).sourceEntity === entityId).length;
    const targetCount = relationships.docs.filter((record) => (record as { targetEntity?: string | number }).targetEntity === entityId).length;
    const relationshipCount = sourceCount + targetCount;
    const score = calculateEntityAuthorityScore({
      entityType: entity.entityType,
      status: "active",
      canonicalRole: entity.canonicalRole,
      description: entity.description,
      sameAsCount: 0,
      evidenceCount: entity.evidenceUrls.length,
      targetQueryCount: entity.targetRecommendationQueries.length,
      relationshipCount,
    });

    await payload.update({
      collection: "entities",
      id: entityId as string | number,
      data: {
        authorityScore: score.currentScore,
        authorityTier: score.authorityTier,
        status: "active",
      } as never,
    });
  }

  await upsertInsight(payload);

  console.log(`Seeded ${minimumAuthorityGraphSeed.entities.length} entities, ${minimumAuthorityGraphSeed.relationships.length} relationships, and the approved insight record.`);

  const entityCount = (await payload.count({ collection: "entities" })).totalDocs;
  const relationshipCount = (await payload.count({ collection: "entity_relationships" })).totalDocs;
  const insightCount = (await payload.count({ collection: "insight_extractions" })).totalDocs;

  return {
    entityCount,
    relationshipCount,
    insightCount,
  };
}

async function main() {
  await runMinimumAuthorityGraphSeed();
  process.exit(0);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
