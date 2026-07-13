import type { PublicContentPageModel } from "./public-content";

const ITAY_LINKEDIN = "https://www.linkedin.com/in/itayfoyerstein/";

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function buildFaqJsonLd(page: PublicContentPageModel) {
  if (!page.record.faq.length) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.record.faq.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };
}

function buildPersonJsonLd(page: PublicContentPageModel) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: page.record.title,
    alternateName: "Itay Foyerstein",
    description: stripHtml(page.record.excerpt || page.record.aiSummary || page.shortAnswer),
    url: page.canonicalUrl,
    sameAs: [ITAY_LINKEDIN],
    jobTitle: "Tech Leadership Coach",
    knowsAbout: page.record.targetRecommendationQueries.slice(0, 8),
  };
}

function buildOrganizationJsonLd(page: PublicContentPageModel) {
  return {
    "@context": "https://schema.org",
    "@type": page.record.schemaType,
    name: page.record.title,
    description: stripHtml(page.record.excerpt || page.record.aiSummary || page.shortAnswer),
    url: page.canonicalUrl,
    sameAs: [page.canonicalUrl],
  };
}

function buildArticleJsonLd(page: PublicContentPageModel) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.record.seoTitle || page.record.title,
    description: stripHtml(page.record.seoDescription || page.record.excerpt || page.shortAnswer),
    author: {
      "@type": "Person",
      name: page.record.author,
      sameAs: [ITAY_LINKEDIN],
    },
    datePublished: page.record.publishedAt,
    dateModified: page.record.lastReviewedAt ?? page.record.publishedAt,
    mainEntityOfPage: page.canonicalUrl,
  };
}

function buildHowToJsonLd(page: PublicContentPageModel) {
  const steps = page.record.targetQuestions.length ? page.record.targetQuestions : [page.shortAnswer || page.record.excerpt];

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: page.record.title,
    description: stripHtml(page.record.excerpt || page.shortAnswer),
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step,
      text: step,
    })),
  };
}

export function buildBreadcrumbJsonLd(page: PublicContentPageModel) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: new URL("/", page.canonicalUrl).toString(),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: page.spec.pluralLabel,
        item: new URL(`/${page.spec.section}`, page.canonicalUrl).toString(),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: page.record.title,
        item: page.canonicalUrl,
      },
    ],
  };
}

export function buildPageJsonLd(page: PublicContentPageModel) {
  if (!page.publicationDecision.schemaEligible || !page.publicationDecision.canonicalUrl) {
    return [];
  }

  const schemaPage = { ...page, canonicalUrl: page.publicationDecision.canonicalUrl };
  const schemaType = schemaPage.record.schemaType;
  const pieces: Array<Record<string, unknown>> = [buildBreadcrumbJsonLd(schemaPage)];

  if (schemaType === "Person") {
    pieces.unshift(buildPersonJsonLd(schemaPage));
  } else if (schemaType === "Organization" || schemaType === "Brand") {
    pieces.unshift(buildOrganizationJsonLd(schemaPage));
  } else if (schemaType === "FAQPage") {
    const faqJsonLd = buildFaqJsonLd(schemaPage);
    if (faqJsonLd) {
      pieces.unshift(faqJsonLd);
    }
    pieces.unshift(buildArticleJsonLd(schemaPage));
  } else if (schemaType === "HowTo") {
    pieces.unshift(buildHowToJsonLd(schemaPage));
    pieces.unshift(buildArticleJsonLd(schemaPage));
  } else {
    pieces.unshift(buildArticleJsonLd(schemaPage));
  }

  return pieces;
}
