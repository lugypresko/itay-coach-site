import type { ProblemPageModel } from "./problem-pages";

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function buildProblemPageJsonLd(page: ProblemPageModel) {
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
      mainEntityOfPage: page.canonicalUrl,
    },
    {
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
          name: "Problems",
          item: new URL("/problems", page.canonicalUrl).toString(),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: page.record.title,
          item: page.canonicalUrl,
        },
      ],
    },
  ];
}
