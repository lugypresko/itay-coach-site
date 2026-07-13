import type { ProblemPageModel } from "./problem-pages";

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function buildProblemPageJsonLd(page: ProblemPageModel) {
  if (!page.publicationDecision.schemaEligible || !page.publicationDecision.canonicalUrl) {
    return [];
  }
  const canonicalUrl = page.publicationDecision.canonicalUrl;

  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: page.record.seoTitle || page.record.title,
      description: stripHtml(page.record.seoDescription || page.record.painStatement),
      author: {
        "@type": "Person",
        name: "Itay Foyerstein",
        sameAs: ["https://www.linkedin.com/in/itayfoyerstein/"],
      },
      dateModified: page.record.updatedAt,
      mainEntityOfPage: canonicalUrl,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: new URL("/", canonicalUrl).toString(),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Problems",
          item: new URL("/problems", canonicalUrl).toString(),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: page.record.title,
          item: canonicalUrl,
        },
      ],
    },
  ];
}
