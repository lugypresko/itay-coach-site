import { describe, expect, it } from "vitest";

import {
  approvedInsightSchema,
  authorityContentSchema,
  knowledgeAssetSchema,
  visibilityObservationSchema,
} from "../../src/domain/authority-contracts";

const claim = {
  text: "Execution dependency limits strategic leadership.",
  evidenceUrls: ["https://example.com/source"],
  targetQueries: ["How do I stop being the bottleneck?"],
  targetEntities: ["itay_foyerstein"],
};

describe("canonical authority contracts", () => {
  it("accepts a fresh approved insight with claim-level evidence", () => {
    const result = approvedInsightSchema.safeParse({
      id: "insight-1",
      sourceTitle: "Approved interview",
      sourceType: "interview",
      status: "approved",
      capturedAt: "2026-07-01T00:00:00.000Z",
      approvedAt: "2026-07-02T00:00:00.000Z",
      approvedBy: "Itay Foyerstein",
      freshnessExpiresAt: "2026-12-01T00:00:00.000Z",
      summary: "A specific leadership insight.",
      claims: [claim],
      evidenceUrls: ["https://example.com/source"],
      entityTags: ["itay_foyerstein"],
      targetQueries: ["How do I stop being the bottleneck?"],
      sourceUrls: ["https://example.com/source"],
    });

    expect(result.success).toBe(true);
  });

  it("rejects approved insights without claims", () => {
    expect(() => approvedInsightSchema.parse({ claims: [] })).toThrow();
  });

  it("accepts a review-safe knowledge asset", () => {
    expect(knowledgeAssetSchema.parse({
      id: "asset-1",
      sourceInsightIds: ["insight-1"],
      claims: [claim],
      title: "Execution bottlenecks",
      shortAnswer: "Leadership must create progress without manager dependency.",
      targetQueries: ["How do I stop being the bottleneck?"],
      targetEntities: ["itay_foyerstein"],
      reviewStatus: "draft",
    }).reviewStatus).toBe("draft");
  });

  it("accepts one unified authority-content shape", () => {
    expect(authorityContentSchema.parse({
      id: "content-1",
      contentType: "framework",
      title: "Invisible Executor",
      slug: "invisible-executor",
      body: "Framework body",
      targetQueries: ["Who created the Invisible Executor framework?"],
      targetEntities: ["itay_foyerstein"],
      sourceInsightIds: ["insight-1"],
      status: "in_review",
    }).contentType).toBe("framework");
  });

  it("accepts an append-only visibility observation", () => {
    expect(visibilityObservationSchema.parse({
      id: "observation-1",
      query: "Best tech leadership coach",
      platform: "ChatGPT",
      checkedAt: "2026-07-12T00:00:00.000Z",
      rawAnswer: "Answer",
      recommendationLevel: 2,
      mentionedEntities: [],
      citedUrls: [],
      competitorNames: [],
    }).recommendationLevel).toBe(2);
  });
});
