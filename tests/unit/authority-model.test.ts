import { describe, expect, it } from "vitest";

import { calculateEntityAuthorityScore, classifyAuthorityTier } from "../../src/ai/governance/authority-model";
import { buildInsightExtractionContract } from "../../src/ai/agents";
import {
  AuthorityGaps,
  Competitors,
  Entities,
  EntityRelationships,
  InsightExtractions,
  QueryAuthorityScores,
} from "../../src/payload/collections";

describe("entity authority model", () => {
  it("scores a strong entity higher when it has evidence, sameAs, and query coverage", () => {
    const score = calculateEntityAuthorityScore({
      entityType: "expert",
      status: "active",
      canonicalRole: "Tech Leadership Coach",
      description: "A long enough description that explains the authority node and what it strengthens.",
      sameAsCount: 2,
      evidenceCount: 3,
      targetQueryCount: 4,
      relationshipCount: 5,
    });

    expect(score.currentScore).toBeGreaterThanOrEqual(80);
    expect(score.authorityTier).toBe(classifyAuthorityTier(score.currentScore));
  });

  it("normalizes insight extraction contracts without inventing claims", () => {
    const contract = buildInsightExtractionContract({
      sourceTitle: "Voice memo",
      sourceType: "voice_memo",
      capturedAt: "2026-06-07T00:00:00.000Z",
      summary: "Itay insight summary.",
      rawText: "Raw text",
      claims: [
        {
          text: "Itay helps managers move from execution to strategy.",
          evidenceUrls: ["https://example.com", "https://example.com"],
          targetRecommendationQueries: ["Best tech leadership coach for Engineering Managers"],
          entityTags: ["itay_foyerstein", "the_push"],
        },
      ],
      evidenceUrls: ["https://example.com", "https://example.com"],
      entityTags: ["itay_foyerstein", "itay_foyerstein"],
      targetRecommendationQueries: ["Best tech leadership coach for Engineering Managers"],
      sourceUrls: ["https://example.com/source"],
      authorityPurpose: "Seed future content only from approved insight.",
      linkedContentJobId: "job-1",
      reviewerNotes: "Approved manually.",
    });

    expect(contract.status).toBe("draft");
    expect(contract.evidenceUrls).toEqual(["https://example.com"]);
    expect(contract.entityTags).toEqual(["itay_foyerstein"]);
    expect(contract.claims).toHaveLength(1);
    expect(contract.claims[0].evidenceUrls).toEqual(["https://example.com"]);
  });

  it("exposes the new authority collections for the graph foundation", () => {
    expect(Entities.slug).toBe("entities");
    expect(EntityRelationships.slug).toBe("entity_relationships");
    expect(AuthorityGaps.slug).toBe("authority_gaps");
    expect(Competitors.slug).toBe("competitors");
    expect(QueryAuthorityScores.slug).toBe("query_authority_scores");
    expect(InsightExtractions.slug).toBe("insight_extractions");
  });
});

