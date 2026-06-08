import type { PublicContentSection } from "./public-content";
import { canonicalAuthorityPages, publicContentSectionSpecs } from "./public-content";

export type PublicAuthorityAssetStatus = "draft" | "review" | "published";

export interface PublicAuthorityAssetRoute {
  section: PublicContentSection;
  slug: string;
  status: PublicAuthorityAssetStatus;
}

export const publicAuthorityLandingPathnames = [
  "/",
  "/book-a-fit-call",
  "/ai-first-leadership",
  "/invisible-executor-assessment",
  "/tech-leadership-visibility-scorecard",
] as const;

export const publicAuthorityAssetRoutes: PublicAuthorityAssetRoute[] = [
  { section: "entities", slug: "itay-foyerstein", status: "review" },
  { section: "entities", slug: "the-push", status: "review" },
  { section: "pillars", slug: "tech-leadership-coaching", status: "review" },
  { section: "frameworks", slug: "invisible-executor", status: "review" },
  { section: "clusters", slug: "how-engineering-managers-become-bottlenecks-in-ai-assisted-teams", status: "review" },
  { section: "clusters", slug: "how-to-lead-ai-generated-code-reviews-without-drowning", status: "review" },
  { section: "clusters", slug: "from-technical-expert-to-strategic-engineering-leader", status: "review" },
  { section: "clusters", slug: "why-tech-leads-struggle-after-promotion", status: "review" },
  { section: "clusters", slug: "ai-era-leadership-operating-system-for-engineering-managers", status: "review" },
  { section: "faqs", slug: "ai-first-leadership-for-tech-managers", status: "review" },
  { section: "glossary", slug: "invisible-executor", status: "review" },
  { section: "glossary", slug: "trusted-operator", status: "review" },
  { section: "glossary", slug: "strategic-leader", status: "review" },
  { section: "case-studies", slug: "promoted-technical-manager-becomes-execution-bottleneck", status: "draft" },
];

export function getPublicAuthoritySectionPathnames(): string[] {
  return publicContentSectionSpecs.map((spec) => `/${spec.section}`);
}

export function getPublicAuthorityCanonicalPathnames(): string[] {
  return canonicalAuthorityPages.map((page) => `/${page.section}/${page.slug}`);
}

export function getPublicAuthorityAssetPathnames(options?: { includeDrafts?: boolean }): string[] {
  const includeDrafts = options?.includeDrafts ?? false;

  return publicAuthorityAssetRoutes
    .filter((route) => includeDrafts || route.status !== "draft")
    .map((route) => `/${route.section}/${route.slug}`);
}

export function getPublicAuthoritySitemapPathnames(): string[] {
  return [
    ...publicAuthorityLandingPathnames,
    ...getPublicAuthoritySectionPathnames(),
    ...getPublicAuthorityCanonicalPathnames(),
    ...getPublicAuthorityAssetPathnames(),
  ].filter((pathname, index, values) => values.indexOf(pathname) === index);
}

