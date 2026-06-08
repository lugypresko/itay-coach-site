import fs from "node:fs";
import path from "node:path";

import "./load-env";

import { minimumAuthorityGraphEntities } from "./minimum-authority-graph";
import { runMinimumAuthorityGraphSeed } from "./run-minimum-authority-graph-seed";
import { getServerPayload } from "../lib/payload";

type EntityRecord = {
  id: number;
  slug: string;
  status?: string;
};

type RelationshipRecord = {
  id: number;
  sourceEntity?: number;
  targetEntity?: number;
  relationshipType?: string;
  status?: string;
};

type VerificationReport = {
  seedRuns: Array<{
    entityCount: number;
    relationshipCount: number;
    insightCount: number;
  }>;
  totals: {
    entities: number;
    relationships: number;
    insights: number;
  };
  countsOk: boolean;
  statusOk: boolean;
  slugOk: boolean;
  duplicateEntitySlugs: string[];
  duplicateEdges: string[];
  orphanRelationships: string[];
  traversalOk: boolean;
  traversal: {
    itayOutgoing: string[];
    pushOutgoing: string[];
    frameworkOutgoing: string[];
    frameworkIncoming: string[];
  };
};

function toEdgeKey(sourceSlug: string, targetSlug: string, relationshipType: string | undefined) {
  return `${sourceSlug} -> ${targetSlug} (${relationshipType ?? "unknown"})`;
}

function collectDuplicates(values: string[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
    } else {
      seen.add(value);
    }
  }

  return [...duplicates];
}

async function findEntityBySlug(payload: Awaited<ReturnType<typeof getServerPayload>>, slug: string) {
  const result = await payload.find({
    collection: "entities",
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 0,
  });

  const entity = result.docs[0] as EntityRecord | undefined;

  if (!entity) {
    throw new Error(`Missing entity for slug ${slug}`);
  }

  return entity;
}

async function findRelationshipsForEntity(
  payload: Awaited<ReturnType<typeof getServerPayload>>,
  field: "sourceEntity" | "targetEntity",
  entityId: number,
) {
  const result = await payload.find({
    collection: "entity_relationships",
    where: {
      [field]: {
        equals: entityId,
      },
    },
    limit: 50,
    depth: 0,
  });

  return result.docs as RelationshipRecord[];
}

async function main() {
  const payload = await getServerPayload();

  const seedRunOne = await runMinimumAuthorityGraphSeed();
  const seedRunTwo = await runMinimumAuthorityGraphSeed();

  const entityResult = await payload.find({
    collection: "entities",
    where: {
      slug: {
        in: minimumAuthorityGraphEntities.map((entity) => entity.slug),
      },
    },
    limit: 20,
    depth: 0,
  });

  const relationshipResult = await payload.find({
    collection: "entity_relationships",
    limit: 50,
    depth: 0,
  });

  const insightResult = await payload.find({
    collection: "insight_extractions",
    where: {
      sourceTitle: {
        equals: "CTO Insights & Critique: The Push LLM SEO Authority Engine",
      },
    },
    limit: 20,
    depth: 0,
  });

  const entityDocs = entityResult.docs as EntityRecord[];
  const relationshipDocs = relationshipResult.docs as RelationshipRecord[];

  const entityById = new Map<number, EntityRecord>();
  for (const entity of entityDocs) {
    entityById.set(entity.id, entity);
  }

  const duplicateEntitySlugs = collectDuplicates(entityDocs.map((entity) => entity.slug));
  const duplicateEdges = collectDuplicates(
    relationshipDocs.map((relationship) => {
      const sourceSlug = entityById.get(relationship.sourceEntity ?? -1)?.slug ?? "missing-source";
      const targetSlug = entityById.get(relationship.targetEntity ?? -1)?.slug ?? "missing-target";
      return toEdgeKey(sourceSlug, targetSlug, relationship.relationshipType);
    }),
  );

  const orphanRelationships = relationshipDocs
    .filter((relationship) => !entityById.has(relationship.sourceEntity ?? -1) || !entityById.has(relationship.targetEntity ?? -1))
    .map((relationship) =>
      toEdgeKey(
        entityById.get(relationship.sourceEntity ?? -1)?.slug ?? "missing-source",
        entityById.get(relationship.targetEntity ?? -1)?.slug ?? "missing-target",
        relationship.relationshipType,
      ),
    );

  const itay = await findEntityBySlug(payload, "itay-foyerstein");
  const push = await findEntityBySlug(payload, "the-push");
  const framework = await findEntityBySlug(payload, "invisible-executor-framework");

  const itayOutgoing = await findRelationshipsForEntity(payload, "sourceEntity", itay.id);
  const pushOutgoing = await findRelationshipsForEntity(payload, "sourceEntity", push.id);
  const frameworkOutgoing = await findRelationshipsForEntity(payload, "sourceEntity", framework.id);
  const frameworkIncoming = await findRelationshipsForEntity(payload, "targetEntity", framework.id);

  const itayToPush = itayOutgoing.some((relationship) => {
    const target = entityById.get(relationship.targetEntity ?? -1);
    return relationship.relationshipType === "owns" && target?.slug === "the-push" && relationship.status === "approved";
  });

  const pushToFramework = pushOutgoing.some((relationship) => {
    const target = entityById.get(relationship.targetEntity ?? -1);
    return (
      relationship.relationshipType === "explains" &&
      target?.slug === "invisible-executor-framework" &&
      relationship.status === "approved"
    );
  });

  const frameworkToAudienceOrConcept = frameworkOutgoing.filter((relationship) => {
    const target = entityById.get(relationship.targetEntity ?? -1);
    return (
      relationship.status === "approved" &&
      (relationship.relationshipType === "serves" || relationship.relationshipType === "supports") &&
      target !== undefined &&
      ["audience", "concept"].includes(
        minimumAuthorityGraphEntities.find((entity) => entity.slug === target.slug)?.entityType ?? "",
      )
    );
  });

  const traversalOk = itayToPush && pushToFramework && frameworkToAudienceOrConcept.length >= 6;

  const countsOk =
    entityResult.docs.length >= 9 &&
    relationshipResult.docs.length >= 8 &&
    insightResult.docs.length >= 1 &&
    entityResult.docs.length === 9 &&
    relationshipResult.docs.length === 8 &&
    insightResult.docs.length === 1;

  const slugOk = entityDocs.every(
    (entity) => entity.slug === entity.slug.toLowerCase() && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entity.slug),
  );

  const statusOk =
    entityDocs.every((entity) => entity.status === "active") &&
    relationshipDocs.every((relationship) => relationship.status === "approved");

  const report: VerificationReport = {
    seedRuns: [seedRunOne, seedRunTwo],
    totals: {
      entities: entityResult.docs.length,
      relationships: relationshipResult.docs.length,
      insights: insightResult.docs.length,
    },
    countsOk,
    statusOk,
    slugOk,
    duplicateEntitySlugs,
    duplicateEdges,
    orphanRelationships,
    traversalOk,
    traversal: {
      itayOutgoing: itayOutgoing.map((relationship) => relationship.relationshipType ?? "unknown"),
      pushOutgoing: pushOutgoing.map((relationship) => relationship.relationshipType ?? "unknown"),
      frameworkOutgoing: frameworkOutgoing.map((relationship) => relationship.relationshipType ?? "unknown"),
      frameworkIncoming: frameworkIncoming.map((relationship) => relationship.relationshipType ?? "unknown"),
    },
  };

  const outputPath = path.resolve(process.cwd(), "TASK_012_VERIFICATION_REPORT.md");
  const md = `# Task 012 Verification Report

## Seed runs

- Run 1: ${seedRunOne.entityCount} entities, ${seedRunOne.relationshipCount} relationships, ${seedRunOne.insightCount} insight(s)
- Run 2: ${seedRunTwo.entityCount} entities, ${seedRunTwo.relationshipCount} relationships, ${seedRunTwo.insightCount} insight(s)

## Required checks

- entity count >= 9: ${report.countsOk ? "pass" : "fail"}
- relationship count >= 8: ${report.countsOk ? "pass" : "fail"}
- approved insight count >= 1: ${report.countsOk ? "pass" : "fail"}
- all entity slugs unique: ${report.duplicateEntitySlugs.length === 0 ? "pass" : "fail"}
- all entity slugs lowercase kebab-case: ${report.slugOk ? "pass" : "fail"}
- all entities status = active: ${report.statusOk ? "pass" : "fail"}
- all relationships status = approved: ${report.statusOk ? "pass" : "fail"}
- no orphan relationships: ${report.orphanRelationships.length === 0 ? "pass" : "fail"}
- traversal chain: ${report.traversalOk ? "pass" : "fail"}

## Traversal

- Itay outgoing: ${report.traversal.itayOutgoing.join(", ")}
- The Push outgoing: ${report.traversal.pushOutgoing.join(", ")}
- Framework outgoing: ${report.traversal.frameworkOutgoing.join(", ")}
- Framework incoming: ${report.traversal.frameworkIncoming.join(", ")}

## Idempotency

- entity count unchanged across two runs: ${seedRunOne.entityCount === seedRunTwo.entityCount ? "pass" : "fail"}
- relationship count unchanged across two runs: ${seedRunOne.relationshipCount === seedRunTwo.relationshipCount ? "pass" : "fail"}
- duplicate entity slugs: ${report.duplicateEntitySlugs.length === 0 ? "none" : report.duplicateEntitySlugs.join(", ")}
- duplicate edges: ${report.duplicateEdges.length === 0 ? "none" : report.duplicateEdges.join(", ")}

## Totals

- entities: ${report.totals.entities}
- relationships: ${report.totals.relationships}
- insights: ${report.totals.insights}

## Orphans

- ${report.orphanRelationships.length === 0 ? "none" : report.orphanRelationships.join("\n- ")}

## Result

- overall: ${
    report.countsOk &&
    report.statusOk &&
    report.slugOk &&
    report.duplicateEntitySlugs.length === 0 &&
    report.duplicateEdges.length === 0 &&
    report.orphanRelationships.length === 0 &&
    report.traversalOk
      ? "pass"
      : "fail"
  }
`;

  fs.writeFileSync(outputPath, md, "utf8");
  console.log(JSON.stringify(report, null, 2));

  if (
    !report.countsOk ||
    !report.statusOk ||
    !report.slugOk ||
    report.duplicateEntitySlugs.length > 0 ||
    report.duplicateEdges.length > 0 ||
    report.orphanRelationships.length > 0 ||
    !report.traversalOk
  ) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
