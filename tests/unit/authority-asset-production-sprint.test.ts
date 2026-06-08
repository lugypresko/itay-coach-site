import { describe, expect, it } from "vitest";

import { authorityAssetProductionSprintAssets } from "../../src/seed/authority-asset-production-sprint";

describe("authority asset production sprint manifest", () => {
  it("exposes the ten requested assets", () => {
    expect(authorityAssetProductionSprintAssets).toHaveLength(10);

    const counts = authorityAssetProductionSprintAssets.reduce(
      (acc, asset) => {
        acc[asset.payloadCollection] += 1;
        return acc;
      },
      {
        "cluster-pages": 0,
        faqs: 0,
        "glossary-terms": 0,
        "case-studies": 0,
      },
    );

    expect(counts["cluster-pages"]).toBe(5);
    expect(counts.faqs).toBe(1);
    expect(counts["glossary-terms"]).toBe(3);
    expect(counts["case-studies"]).toBe(1);
  });

  it("keeps all assets review-safe and source-backed", () => {
    for (const asset of authorityAssetProductionSprintAssets) {
      expect(asset.reviewRequired).toBe(true);
      expect(["draft", "review"]).toContain(asset.payloadData.status);
      expect(asset.payloadData.entityTags.length).toBeGreaterThan(0);
      expect(asset.payloadData.targetRecommendationQueries.length).toBeGreaterThan(0);
      expect(asset.payloadData.internalLinks.length).toBeGreaterThan(0);
      expect(asset.payloadData.faq.length).toBeGreaterThan(0);
      expect(asset.payloadData.evidenceUrls.length).toBeGreaterThan(0);
    }
  });

  it("keeps the case study draft unpublished", () => {
    const caseStudy = authorityAssetProductionSprintAssets.find((asset) => asset.payloadCollection === "case-studies");

    expect(caseStudy?.payloadData.slug).toBe("promoted-technical-manager-becomes-execution-bottleneck");
    expect(caseStudy?.payloadData.status).toBe("draft");
  });
});
