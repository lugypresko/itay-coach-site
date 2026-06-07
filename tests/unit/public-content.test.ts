import { describe, expect, it } from "vitest";

import {
  buildPublicContentPageModel,
  getPublicContentSectionSpec,
  isPublishedPublicContent,
  normalizePublicContentRecord,
} from "../../src/lib/public-content";
import { buildPageJsonLd } from "../../src/lib/public-schema";

describe("public content helpers", () => {
  it("normalizes public content records and preserves structured fields", () => {
    const record = normalizePublicContentRecord({
      title: "Itay Foyerstein",
      slug: "itay-foyerstein",
      excerpt: "Tech Leadership Coach.",
      content: "Paragraph one.\n\nParagraph two.",
      aiSummary: "Short answer.",
      citationSnippet: "Citation-ready snippet.",
      targetQuestions: [{ value: "Who is Itay Foyerstein?" }, { value: "What does The Push do?" }],
      targetRecommendationQueries: [{ value: "Best tech leadership coach for Engineering Managers" }],
      entityTags: [{ tag: "itay_foyerstein" }, { tag: "the_push" }],
      seoTitle: "Itay Foyerstein | Tech Leadership Coach",
      seoDescription: "Tech leadership coaching for managers.",
      schemaType: "Person",
      faq: [
        {
          question: "Who is Itay Foyerstein?",
          answer: "A tech leadership coach.",
          entityTags: [{ value: "itay_foyerstein" }],
          targetRecommendationQueries: [{ value: "Best tech leadership coach for Engineering Managers" }],
        },
      ],
      internalLinks: [
        {
          targetSlug: "the-push",
          anchorText: "The Push",
          reason: "Reinforce the methodology.",
          sourceEntityTags: [{ value: "itay_foyerstein" }],
          targetEntityTags: [{ value: "the_push" }],
        },
      ],
      status: "published",
      publishedAt: "2026-06-07T00:00:00.000Z",
      lastReviewedAt: "2026-06-06T00:00:00.000Z",
      author: "Itay Foyerstein",
    });

    expect(record.entityTags).toEqual(["itay_foyerstein", "the_push"]);
    expect(record.targetQuestions).toHaveLength(2);
    expect(record.faq).toHaveLength(1);
    expect(record.internalLinks).toHaveLength(1);
    expect(record.publishedAt).toBe("2026-06-07T00:00:00.000Z");
  });

  it("builds a person schema for Itay and FAQ schema for support pages", () => {
    const spec = getPublicContentSectionSpec("entities");
    expect(spec?.collectionSlug).toBe("entity-pages");

    const page = buildPublicContentPageModel({
      spec: spec!,
      origin: "https://example.com",
      record: {
        title: "Itay Foyerstein",
        slug: "itay-foyerstein",
        excerpt: "Tech Leadership Coach.",
        content: "Paragraph one.\n\nParagraph two.",
        aiSummary: "Short answer.",
        citationSnippet: "Citation-ready snippet.",
        targetQuestions: [{ value: "Who is Itay Foyerstein?" }],
        targetRecommendationQueries: [{ value: "Best tech leadership coach for Engineering Managers" }],
        entityTags: [{ tag: "itay_foyerstein" }],
        seoTitle: "Itay Foyerstein | Tech Leadership Coach",
        seoDescription: "Tech leadership coaching for managers.",
        schemaType: "Person",
        faq: [
          {
            question: "Who is Itay Foyerstein?",
            answer: "A tech leadership coach.",
            entityTags: [{ value: "itay_foyerstein" }],
            targetRecommendationQueries: [{ value: "Best tech leadership coach for Engineering Managers" }],
          },
        ],
        internalLinks: [],
        status: "published",
        publishedAt: "2026-06-07T00:00:00.000Z",
        lastReviewedAt: "2026-06-06T00:00:00.000Z",
        author: "Itay Foyerstein",
      },
    });

    const jsonLd = buildPageJsonLd(page);

    expect(Array.isArray(jsonLd)).toBe(true);
    expect(jsonLd[0]).toMatchObject({
      "@type": "Person",
      name: "Itay Foyerstein",
    });
  });

  it("treats only published and dated content as renderable", () => {
    expect(
      isPublishedPublicContent({
        status: "published",
        publishedAt: "2026-06-07T00:00:00.000Z",
      }),
    ).toBe(true);

    expect(
      isPublishedPublicContent({
        status: "draft",
        publishedAt: "2026-06-07T00:00:00.000Z",
      }),
    ).toBe(false);
  });
});

