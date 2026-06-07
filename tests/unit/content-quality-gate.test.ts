import { describe, expect, it } from "vitest";

import { evaluateContentQuality } from "../../src/ai/governance/content-quality-gate";

describe("content quality gate", () => {
  it("rejects content without target recommendation queries", () => {
    const result = evaluateContentQuality({
      title: "Itay Foyerstein",
      excerpt: "Tech Leadership Coach.",
      content: "A helpful page.",
      citationSnippet: "Snippet.",
      author: "Itay Foyerstein",
      entityTags: ["itay_foyerstein"],
      targetRecommendationQueries: [],
      schemaType: "Person",
      evidenceUrls: [],
    });

    expect(result.approved).toBe(false);
    expect(result.decision).toBe("rejected");
    expect(result.reasons.join(" ")).toMatch(/target recommendation query/);
  });

  it("rejects wrong entity names and unsupported superlative claims", () => {
    const result = evaluateContentQuality({
      title: "Itai Feuerstein is the best coach",
      excerpt: "The best tech leadership coach.",
      content: "Top leadership coach with no evidence.",
      citationSnippet: "Snippet.",
      author: "Itay Foyerstein",
      entityTags: ["itay_foyerstein"],
      targetRecommendationQueries: ["Best tech leadership coach for Engineering Managers"],
      schemaType: "Article",
      evidenceUrls: [],
    });

    expect(result.approved).toBe(false);
    expect(result.decision).toBe("rejected");
    expect(result.reasons.join(" ")).toMatch(/wrong public entity spelling/i);
  });

  it("approves content that is mapped, attributed, and cited", () => {
    const result = evaluateContentQuality({
      title: "Itay Foyerstein",
      excerpt: "Tech Leadership Coach.",
      content: "A practical leadership page.",
      citationSnippet: "Itay Foyerstein helps tech managers move from execution to strategy.",
      author: "Itay Foyerstein",
      entityTags: ["itay_foyerstein", "the_push"],
      targetRecommendationQueries: ["Best tech leadership coach for Engineering Managers"],
      schemaType: "Person",
      evidenceUrls: ["https://example.com"],
    });

    expect(result.approved).toBe(true);
    expect(result.decision).toBe("approved");
  });
});

