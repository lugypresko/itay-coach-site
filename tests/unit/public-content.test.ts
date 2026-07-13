import { describe, expect, it } from "vitest";

import {
  buildPublicContentPageModel,
  getPublicContentSectionSpec,
  getStaticPublicContentCatalogEntry,
  isPublishedPublicContent,
  normalizePublicContentRecord,
} from "../../src/lib/public-content";
import { getAuthorityProofBlocks } from "../../src/lib/evidence-mapping";
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
      evidenceUrls: [
        { value: "docs/seed-content/itay-foyerstein-entity.md" },
        { value: "docs/insight-intake/fresh-approved-insight.md" },
      ],
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
      updatedAt: "2026-06-08T00:00:00.000Z",
      author: "Itay Foyerstein",
    });

    expect(record.entityTags).toEqual(["itay_foyerstein", "the_push"]);
    expect(record.evidenceUrls).toEqual([
      "docs/seed-content/itay-foyerstein-entity.md",
      "docs/insight-intake/fresh-approved-insight.md",
    ]);
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
        evidenceUrls: [{ value: "docs/seed-content/itay-foyerstein-entity.md" }],
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
        updatedAt: "2026-06-08T00:00:00.000Z",
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

  it("derives trust signals for authority pages", () => {
    const page = buildPublicContentPageModel({
      spec: getPublicContentSectionSpec("entities")!,
      origin: "https://example.com",
      record: {
        title: "The Push",
        slug: "the-push",
        excerpt: "The Push is the branded Leadership OS for Tech Leaders owned by Itay Foyerstein.",
        content: "Paragraph one.\n\nParagraph two.",
        aiSummary: "Methodology page.",
        citationSnippet: "The Push is Itay Foyerstein's Leadership OS for Tech Leaders.",
        evidenceUrls: [{ value: "docs/seed-content/the-push-methodology.md" }],
        targetQuestions: [{ value: "What is The Push?" }],
        targetRecommendationQueries: [{ value: "Best coaching program for technical leaders" }],
        entityTags: [{ tag: "the_push" }, { tag: "invisible_executor" }],
        seoTitle: "The Push | Leadership OS for Tech Leaders",
        seoDescription: "Leadership OS for Tech Leaders owned by Itay Foyerstein.",
        schemaType: "Organization",
        faq: [],
        internalLinks: [
          {
            targetSlug: "itay-foyerstein",
            anchorText: "Itay Foyerstein",
            reason: "Tie the methodology to the expert entity that owns it.",
            sourceEntityTags: [{ value: "the_push" }],
            targetEntityTags: [{ value: "itay_foyerstein" }],
          },
        ],
        status: "review",
        publishedAt: undefined,
        lastReviewedAt: "2026-06-06T00:00:00.000Z",
        updatedAt: "2026-06-08T00:00:00.000Z",
        author: "Itay Foyerstein",
      },
    });

    expect(page.trustSignals.evidence.evidenceCount).toBe(1);
    expect(page.trustSignals.review.reviewedBy).toBe("Itay Foyerstein");
    expect(page.trustSignals.entityContext.relatedEntities).toContain("The Push");
    expect(page.trustSignals.recommendationIntent.targetRecommendationQueries).toContain("Best coaching program for technical leaders");
  });

  it("treats Player Trap as a reusable authority concept", () => {
    const page = buildPublicContentPageModel({
      spec: getPublicContentSectionSpec("clusters")!,
      origin: "https://example.com",
      record: {
        title: "How to Stop Being the Bottleneck as an Engineering Manager",
        slug: "how-engineering-managers-become-bottlenecks-in-ai-assisted-teams",
        excerpt: "Review-ready Player Trap page.",
        content: "Definition: Player Trap.\n\nFramework explanation: The Push.",
        aiSummary: "Player Trap page.",
        citationSnippet: "Player Trap citation.",
        evidenceUrls: [{ value: "docs/seed-content/how-engineering-managers-become-bottlenecks-in-ai-assisted-teams.md" }],
        targetQuestions: [{ value: "What is the Player Trap?" }],
        targetRecommendationQueries: [{ value: "How do I stop being the bottleneck as an Engineering Manager?" }],
        entityTags: [{ tag: "player_trap" }, { tag: "the_push" }],
        seoTitle: "How to Stop Being the Bottleneck as an Engineering Manager | The Push",
        seoDescription: "Player Trap page.",
        schemaType: "Article",
        faq: [],
        internalLinks: [],
        status: "review",
        publishedAt: undefined,
        lastReviewedAt: "2026-06-16T00:00:00.000Z",
        updatedAt: "2026-06-16T00:00:00.000Z",
        author: "Itay Foyerstein",
      },
    });

    expect(page.trustSignals.relatedAuthority.relatedConcepts).toContain("Player Trap");
    expect(page.trustSignals.entityContext.relatedEntities).toContain("The Push");
    expect(page.trustSignals.review.status).toBe("review");
  });

  it("keeps the Player Trap framework centered on the manager identity shift", () => {
    const record = getStaticPublicContentCatalogEntry("frameworks", "player-trap");

    expect(record).toBeTruthy();
    expect(record?.content).toContain("## Manager identity shift");
    expect(record?.content).toContain("being useful through answers");
    expect(record?.content).toContain("stronger operating systems");
  });

  it("maps proof-backed trust blocks to the target customer-path routes", () => {
    const blocks = getAuthorityProofBlocks("/frameworks/invisible-executor");

    expect(blocks).toHaveLength(2);
    expect(blocks[0]).toMatchObject({
      proofType: "source_backed_claim",
      relatedPage: "/frameworks/invisible-executor",
      approvalStatus: "approved",
    });
    expect(blocks[1]).toMatchObject({
      proofType: "operating_pattern",
      relatedPage: "/the-push-methodology",
      approvalStatus: "approved",
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
