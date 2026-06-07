import { describe, expect, it } from "vitest";

import { authoritySeedAssets, getFreshApprovedItayInsight } from "../../src/seed";

describe("authority seed manifest", () => {
  it("exposes the five manual seed assets plus the approved insight intake record", () => {
    expect(authoritySeedAssets).toHaveLength(6);

    const contentAssets = authoritySeedAssets.filter((asset) => asset.kind === "content");
    const insightAssets = authoritySeedAssets.filter((asset) => asset.kind === "insight");

    expect(contentAssets).toHaveLength(5);
    expect(insightAssets).toHaveLength(1);
  });

  it("keeps the manual assets review-only and query-aligned", () => {
    const contentAssets = authoritySeedAssets.filter((asset) => asset.kind === "content");

    for (const asset of contentAssets) {
      expect(asset.reviewRequired).toBe(true);
      expect(asset.payloadData.status).toBe("draft");
      expect(asset.payloadData.entityTags.length).toBeGreaterThan(0);
      expect(asset.payloadData.targetRecommendationQueries.length).toBeGreaterThan(0);
      expect(asset.payloadData.targetQuestions.length).toBeGreaterThan(0);
      expect(asset.payloadData.faq.length).toBeGreaterThan(0);
      expect(asset.payloadData.internalLinks.length).toBeGreaterThan(0);
    }
  });

  it("keeps the approved insight fresh and source-backed", () => {
    const insight = getFreshApprovedItayInsight();

    expect(insight.status).toBe("approved");
    expect(insight.sourceType).toBe("review");
    expect(insight.capturedAt).toBe("2026-06-07T00:00:00.000Z");
    expect(insight.approvedAt).toBe("2026-06-07T00:00:00.000Z");
    expect(insight.evidenceUrls).toEqual(["docs/cto_seo_llm_insights.md"]);
    expect(insight.sourceUrls).toEqual(["docs/cto_seo_llm_insights.md"]);
    expect(insight.claims.length).toBeGreaterThan(0);
  });
});

