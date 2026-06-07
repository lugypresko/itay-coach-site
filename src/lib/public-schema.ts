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
  const schemaType = page.record.schemaType;
  const pieces: Array<Record<string, unknown>> = [buildBreadcrumbJsonLd(page)];

  if (schemaType === "Person") {
    pieces.unshift(buildPersonJsonLd(page));
  } else if (schemaType === "Organization" || schemaType === "Brand") {
    pieces.unshift(buildOrganizationJsonLd(page));
  } else if (schemaType === "FAQPage") {
    const faqJsonLd = buildFaqJsonLd(page);
    if (faqJsonLd) {
      pieces.unshift(faqJsonLd);
    }
    pieces.unshift(buildArticleJsonLd(page));
  } else if (schemaType === "HowTo") {
    pieces.unshift(buildHowToJsonLd(page));
    pieces.unshift(buildArticleJsonLd(page));
  } else {
    pieces.unshift(buildArticleJsonLd(page));
  }

  return pieces;
}
