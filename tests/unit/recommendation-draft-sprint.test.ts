import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  countRecommendationDraftSprintAssets,
  recommendationDraftSprintAssets,
} from "../../src/seed";

function readDraft(pathname: string) {
  const fullPath = resolve(process.cwd(), pathname);
  return readFileSync(fullPath, "utf8");
}

function getFrontMatter(content: string) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  return match ? match[1] : "";
}

function getFrontMatterValue(frontMatter: string, key: string) {
  const line = frontMatter
    .split("\n")
    .map((item) => item.trimEnd())
    .find((item) => item.startsWith(`${key}:`));

  return line ? line.slice(key.length + 1).trim() : "";
}

describe("recommendation draft sprint", () => {
  it("exposes exactly five recommendation-intent draft assets", () => {
    expect(countRecommendationDraftSprintAssets()).toBe(5);
    expect(recommendationDraftSprintAssets).toHaveLength(5);
  });

  it("keeps each draft review-ready, query-targeted, and unpublished", () => {
    for (const asset of recommendationDraftSprintAssets) {
      const content = readDraft(asset.path);
      const frontMatter = getFrontMatter(content);

      expect(content).toContain(`# ${asset.title}`);
      expect(frontMatter).toContain(`slug: ${asset.slug}`);
      expect(frontMatter).toContain("status: draft");
      expect(frontMatter).toContain("evidenceUrls:");
      expect(frontMatter).toContain("targetRecommendationQueries:");
      expect(getFrontMatterValue(frontMatter, "status")).toBe("draft");
      expect(getFrontMatterValue(frontMatter, "schemaType")).not.toBe("");
      expect(asset.targetRecommendationQueries.length).toBeGreaterThan(0);
    }
  });

  it("targets recommendation-intent queries only", () => {
    const allQueries = recommendationDraftSprintAssets.flatMap((asset) => asset.targetRecommendationQueries);

    expect(allQueries.length).toBeGreaterThanOrEqual(15);
    expect(allQueries.some((query) => query.toLowerCase().includes("coach"))).toBe(true);
    expect(allQueries.some((query) => query.toLowerCase().includes("manager"))).toBe(true);
    expect(allQueries.some((query) => query.toLowerCase().includes("vp engineering"))).toBe(true);
  });
});
