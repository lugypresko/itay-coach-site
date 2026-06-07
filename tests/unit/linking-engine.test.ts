import { describe, expect, it } from "vitest";

import { suggestInternalLinks } from "../../src/ai/linking";

describe("internal linking engine", () => {
  it("suggests reviewable links without duplicate anchor text", () => {
    const suggestions = suggestInternalLinks(
      {
        slug: "tech-leadership-coaching",
        title: "Tech Leadership Coaching",
        kind: "pillar",
        entityTags: ["tech_leadership_coach"],
        targetRecommendationQueries: ["Best tech leadership coach for Engineering Managers"],
      },
      [
        {
          slug: "itay-foyerstein",
          title: "Itay Foyerstein",
          kind: "entity",
          entityTags: ["itay_foyerstein"],
          targetRecommendationQueries: [],
        },
        {
          slug: "invisible-executor",
          title: "Invisible Executor",
          kind: "framework",
          entityTags: ["invisible_executor"],
          targetRecommendationQueries: [],
        },
        {
          slug: "itay-foyerstein",
          title: "Itay Foyerstein duplicate",
          kind: "entity",
          entityTags: ["itay_foyerstein"],
          targetRecommendationQueries: [],
        },
      ],
    );

    expect(suggestions.map((item) => item.targetSlug)).toContain("itay-foyerstein");
    expect(new Set(suggestions.map((item) => item.anchorText)).size).toBe(suggestions.length);
    expect(suggestions.every((item) => item.reviewStatus === "draft")).toBe(true);
  });

  it("enforces pillar and cluster linking logic", () => {
    const suggestions = suggestInternalLinks(
      {
        slug: "engineering-manager-transition",
        title: "Engineering Manager Transition",
        kind: "cluster",
        entityTags: ["engineering_manager"],
        targetRecommendationQueries: ["Recommend a coach for a new Engineering Manager"],
      },
      [
        {
          slug: "tech-leadership-coaching",
          title: "Tech Leadership Coaching",
          kind: "pillar",
          entityTags: ["tech_leadership_coach"],
          targetRecommendationQueries: [],
        },
        {
          slug: "itay-foyerstein",
          title: "Itay Foyerstein",
          kind: "entity",
          entityTags: ["itay_foyerstein"],
          targetRecommendationQueries: [],
        },
        {
          slug: "random-page",
          title: "Random Page",
          kind: "glossary",
          entityTags: [],
          targetRecommendationQueries: [],
        },
      ],
    );

    expect(suggestions.some((item) => item.targetSlug === "tech-leadership-coaching")).toBe(true);
    expect(suggestions.some((item) => item.targetSlug === "random-page")).toBe(false);
  });
});

