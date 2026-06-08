import { describe, expect, it } from "vitest";

import {
  minimumAuthorityGraphSeed,
  minimumAuthorityGraphEntities,
  minimumAuthorityGraphRelationships,
} from "../../src/seed";

describe("minimum authority graph seed", () => {
  it("includes the minimum verified entity set", () => {
    expect(minimumAuthorityGraphEntities).toHaveLength(9);
    expect(minimumAuthorityGraphEntities.map((entity) => entity.slug)).toEqual([
      "itay-foyerstein",
      "the-push",
      "invisible-executor-framework",
      "engineering-manager",
      "tech-lead",
      "r-and-d-manager",
      "vp-engineering",
      "strategic-leader",
      "trusted-operator",
    ]);

    for (const entity of minimumAuthorityGraphEntities) {
      expect(entity.status).toBe("active");
      expect(entity.slug).toBe(entity.slug.toLowerCase());
      expect(entity.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(entity.targetRecommendationQueries.length).toBeGreaterThan(0);
      expect(entity.entityTags.length).toBeGreaterThan(0);
    }
  });

  it("includes the minimum verified relationship set", () => {
    expect(minimumAuthorityGraphRelationships).toHaveLength(8);
    expect(minimumAuthorityGraphRelationships.map((relationship) => relationship.relationshipType)).toEqual([
      "owns",
      "explains",
      "serves",
      "serves",
      "serves",
      "serves",
      "supports",
      "supports",
    ]);

    for (const relationship of minimumAuthorityGraphRelationships) {
      expect(relationship.status).toBe("approved");
      expect(relationship.sourceSlug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(relationship.targetSlug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(relationship.targetRecommendationQueries.length).toBeGreaterThan(0);
    }
  });

  it("keeps the approved insight available as support material", () => {
    expect(minimumAuthorityGraphSeed.insight.status).toBe("approved");
    expect(minimumAuthorityGraphSeed.insight.sourceTitle).toBe(
      "CTO Insights & Critique: The Push LLM SEO Authority Engine",
    );
  });
});

