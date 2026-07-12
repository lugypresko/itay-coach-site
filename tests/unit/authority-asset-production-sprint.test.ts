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

  it("publishes three priority review-ready authority pages with funnel CTAs and structured authority copy", () => {
    const priorityPages = authorityAssetProductionSprintAssets.filter((asset) =>
      [
        "how-engineering-managers-become-bottlenecks-in-ai-assisted-teams",
        "from-technical-expert-to-strategic-engineering-leader",
        "why-tech-leads-struggle-after-promotion",
      ].includes(asset.payloadData.slug),
    );

    expect(priorityPages).toHaveLength(3);

    for (const asset of priorityPages) {
      expect(asset.payloadData.status).toBe("review");
      expect(asset.payloadData.content).toContain("Definition:");
      expect(asset.payloadData.content).toContain("Framework explanation:");
      expect(asset.payloadData.content).toContain("Specific symptoms:");
      expect(asset.payloadData.content).toContain("Uncomfortable truth:");
      expect(asset.payloadData.content).toContain("Target questions:");
      expect(asset.payloadData.content).toContain("Citation-worthy snippet:");
      expect(asset.payloadData.faq.length).toBeGreaterThanOrEqual(3);
      expect(asset.payloadData.internalLinks.some((link) => link.targetSlug === "player-trap")).toBe(true);
      expect(asset.payloadData.internalLinks.some((link) => link.targetSlug === "the-push")).toBe(true);
      expect(asset.payloadData.internalLinks.some((link) => link.targetSlug === "invisible-executor")).toBe(true);
      expect(asset.payloadData.targetRecommendationQueries.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("keeps the case study draft unpublished", () => {
    const caseStudy = authorityAssetProductionSprintAssets.find((asset) => asset.payloadCollection === "case-studies");

    expect(caseStudy?.payloadData.slug).toBe("promoted-technical-manager-becomes-execution-bottleneck");
    expect(caseStudy?.payloadData.status).toBe("draft");
  });
});
