import { describe, expect, it } from "vitest";

import { authoritySurfaceSeedAssets } from "../../src/seed";

describe("authority surface seed manifest", () => {
  it("exposes the three surface assets as review-only drafts", () => {
    expect(authoritySurfaceSeedAssets).toHaveLength(3);

    for (const asset of authoritySurfaceSeedAssets) {
      expect(asset.kind).toBe("content");
      expect(asset.reviewRequired).toBe(true);
      expect(asset.payloadData.status).toBe("review");
      expect(asset.payloadData.entityTags.length).toBeGreaterThan(0);
      expect(asset.payloadData.targetRecommendationQueries.length).toBeGreaterThan(0);
      expect(asset.payloadData.targetQuestions.length).toBeGreaterThan(0);
      expect(asset.payloadData.faq.length).toBeGreaterThan(0);
      expect(asset.payloadData.internalLinks.length).toBeGreaterThan(0);
      expect(asset.payloadData.evidenceUrls.length).toBeGreaterThan(0);
    }
  });

  it("anchors the requested structure-first titles", () => {
    const titles = authoritySurfaceSeedAssets.map((asset) => asset.payloadData.title);

    expect(titles).toEqual([
      "The Push",
      "Invisible Executor Framework",
      "Tech Leadership Coaching for Engineering Managers, CTOs and VP R&D",
    ]);
  });
});
