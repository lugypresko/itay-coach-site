import { describe, expect, it } from "vitest";

import { evaluateContentQuality, type SemanticQualityEvaluation } from "../../src/ai/governance/content-quality-gate";

const passingSemanticEvaluation: SemanticQualityEvaluation = {
  dimensions: [
    { dimension: "clarity", score: 4, passed: true, reason: "The diagnosis is stated in the opening and uses concrete decision and review examples." },
    { dimension: "depth", score: 4, passed: true, reason: "The draft explains the dependency loop, its cause, and an operating-model response.", revisionRecommendation: undefined },
    { dimension: "usefulness", score: 4, passed: true, reason: "The reader receives a decision-rights exercise that can be applied to one recurring decision." },
    { dimension: "differentiation", score: 4, passed: true, reason: "The Player Trap and Invisible Executor progression provide a named first-party frame." },
    { dimension: "repetition", score: 4, passed: true, reason: "Symptoms, causes, and actions are separated without repeating the same list." },
    { dimension: "audience_fit", score: 5, passed: true, reason: "Examples refer directly to Engineering Manager reviews, escalations, and technical decisions." },
    { dimension: "persuasion", score: 4, passed: true, reason: "The CTA follows a practical diagnostic step and states who the fit call is for." },
    { dimension: "authority_strength", score: 4, passed: true, reason: "Named frameworks are bounded by first-party sources and approved insights." },
  ],
};

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
    }, passingSemanticEvaluation);

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
    }, passingSemanticEvaluation);

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
    }, passingSemanticEvaluation);

    expect(result.approved).toBe(true);
    expect(result.decision).toBe("approved");
    expect(result.dimensions).toHaveLength(8);
    expect(result.dimensions.every((dimension) => dimension.passed)).toBe(true);
    expect(result.reasons).not.toContain("Content satisfies the current quality gate.");
  });

  it("requires a specific revision recommendation for every failed semantic dimension", () => {
    const semanticEvaluation = structuredClone(passingSemanticEvaluation);
    semanticEvaluation.dimensions[1] = {
      dimension: "depth",
      score: 2,
      passed: false,
      reason: "The draft names delegation but does not explain why private decision rules recreate the bottleneck.",
      revisionRecommendation: "Add a causal example showing how one repeated decision returns to the manager.",
    };

    const result = evaluateContentQuality({
      title: "Coach for Engineering Managers Stuck as the Bottleneck",
      excerpt: "A diagnostic guide for Engineering Managers.",
      content: "Reader-facing draft content.",
      citationSnippet: "The Player Trap names a recurring execution dependency.",
      author: "Itay Foyerstein",
      entityTags: ["itay_foyerstein", "the_push"],
      targetRecommendationQueries: ["How do I stop being the bottleneck as an Engineering Manager?"],
      schemaType: "Article",
      evidenceUrls: ["src/app/(site)/player-trap/page.tsx"],
    }, semanticEvaluation);

    expect(result.approved).toBe(false);
    expect(result.decision).toBe("needs_review");
    expect(result.dimensions.find((item) => item.dimension === "depth")?.revisionRecommendation).toMatch(/causal example/i);
  });
});
