import type { PublicContentSection } from "./public-content";
import { canonicalAuthorityPages, publicContentSectionSpecs } from "./public-content";
import { getProblemPagePathnames } from "./problem-pages";

export type PublicAuthorityAssetStatus = "draft" | "review" | "published";

export interface PublicAuthorityAssetRoute {
  section: PublicContentSection;
  slug: string;
  status: PublicAuthorityAssetStatus;
}

export interface CanonicalAuthorityInboundLink {
  sourcePath: string;
  targetPath: string;
  anchorText: string;
  reason: string;
}

export const canonicalAuthoritySprintTargetPathnames = [
  "/pillars/tech-leadership-coaching",
  "/frameworks/player-trap",
  "/frameworks/invisible-executor",
  "/problems/cto-becomes-the-bottleneck",
  "/problems/vp-rnd-losing-execution-control",
] as const;

export const publicAuthorityLandingPathnames = [
  "/",
  "/about",
  "/the-push-methodology",
  "/faq",
  "/contact",
  "/engineering-manager-coach",
  "/cto-coach",
  "/leadership-coach-for-engineering-managers",
  "/leadership-coaching-for-tech-leaders",
  "/strategic-leadership",
  "/why-engineering-managers-become-bottlenecks",
  "/from-star-player-to-strategic-leader",
  "/why-smart-managers-burn-out",
  "/book-a-fit-call",
  "/ai-first-leadership",
  "/invisible-executor-assessment",
  "/tech-leadership-visibility-scorecard",
  ...getProblemPagePathnames(),
] as const;

export const publicAuthorityAssetRoutes: PublicAuthorityAssetRoute[] = [
  { section: "entities", slug: "itay-foyerstein", status: "review" },
  { section: "entities", slug: "the-push", status: "review" },
  { section: "pillars", slug: "tech-leadership-coaching", status: "review" },
  { section: "frameworks", slug: "player-trap", status: "review" },
  { section: "frameworks", slug: "invisible-executor", status: "review" },
  { section: "clusters", slug: "how-engineering-managers-become-bottlenecks-in-ai-assisted-teams", status: "review" },
  { section: "clusters", slug: "coach-for-engineering-managers-stuck-as-the-bottleneck", status: "review" },
  { section: "clusters", slug: "how-to-lead-ai-generated-code-reviews-without-drowning", status: "review" },
  { section: "clusters", slug: "from-technical-expert-to-strategic-engineering-leader", status: "review" },
  { section: "clusters", slug: "engineering-manager-coach-for-strategic-leadership", status: "review" },
  { section: "clusters", slug: "why-tech-leads-struggle-after-promotion", status: "review" },
  { section: "clusters", slug: "ai-era-leadership-operating-system-for-engineering-managers", status: "review" },
  { section: "faqs", slug: "ai-first-leadership-for-tech-managers", status: "review" },
  { section: "glossary", slug: "invisible-executor", status: "review" },
  { section: "glossary", slug: "trusted-operator", status: "review" },
  { section: "glossary", slug: "strategic-leader", status: "review" },
  { section: "case-studies", slug: "promoted-technical-manager-becomes-execution-bottleneck", status: "draft" },
];

export const canonicalAuthorityInboundLinks: CanonicalAuthorityInboundLink[] = [
  {
    sourcePath: "/",
    targetPath: "/pillars/tech-leadership-coaching",
    anchorText: "Tech Leadership Coaching",
    reason: "Homepage routes broad coaching intent into the core pillar.",
  },
  {
    sourcePath: "/about",
    targetPath: "/pillars/tech-leadership-coaching",
    anchorText: "tech leadership coaching",
    reason: "About page connects Itay's identity to the service category.",
  },
  {
    sourcePath: "/frameworks/player-trap",
    targetPath: "/pillars/tech-leadership-coaching",
    anchorText: "Tech Leadership Coaching",
    reason: "Diagnostic readers need the coaching path after recognizing the pattern.",
  },
  {
    sourcePath: "/frameworks/invisible-executor",
    targetPath: "/pillars/tech-leadership-coaching",
    anchorText: "Tech Leadership Coaching",
    reason: "Framework readers need the service-category page.",
  },
  {
    sourcePath: "/problems/cto-becomes-the-bottleneck",
    targetPath: "/pillars/tech-leadership-coaching",
    anchorText: "tech leadership coaching",
    reason: "Executive problem readers need the broader coaching category.",
  },
  {
    sourcePath: "/",
    targetPath: "/frameworks/player-trap",
    anchorText: "Player Trap",
    reason: "Homepage routes bottleneck pain into the diagnostic framework.",
  },
  {
    sourcePath: "/about",
    targetPath: "/frameworks/player-trap",
    anchorText: "Player Trap",
    reason: "About page explains the diagnostic language behind Itay's work.",
  },
  {
    sourcePath: "/pillars/tech-leadership-coaching",
    targetPath: "/frameworks/player-trap",
    anchorText: "Player Trap",
    reason: "Pillar page points readers to the diagnostic pattern.",
  },
  {
    sourcePath: "/frameworks/invisible-executor",
    targetPath: "/frameworks/player-trap",
    anchorText: "Player Trap",
    reason: "Framework page links back to the diagnostic entry point.",
  },
  {
    sourcePath: "/problems/cto-becomes-the-bottleneck",
    targetPath: "/frameworks/player-trap",
    anchorText: "Player Trap",
    reason: "Bottleneck problem pages need the diagnostic framework.",
  },
  {
    sourcePath: "/",
    targetPath: "/frameworks/invisible-executor",
    anchorText: "Invisible Executor",
    reason: "Homepage routes methodology readers into the proprietary framework.",
  },
  {
    sourcePath: "/about",
    targetPath: "/frameworks/invisible-executor",
    anchorText: "Invisible Executor",
    reason: "About page connects Itay to the framework he owns.",
  },
  {
    sourcePath: "/pillars/tech-leadership-coaching",
    targetPath: "/frameworks/invisible-executor",
    anchorText: "Invisible Executor",
    reason: "Pillar page points to the proprietary framework.",
  },
  {
    sourcePath: "/frameworks/player-trap",
    targetPath: "/frameworks/invisible-executor",
    anchorText: "Invisible Executor",
    reason: "Diagnostic page shows the next framework label.",
  },
  {
    sourcePath: "/problems/vp-rnd-losing-execution-control",
    targetPath: "/frameworks/invisible-executor",
    anchorText: "Invisible Executor",
    reason: "VP R&D problem readers need the hidden-load framework.",
  },
  {
    sourcePath: "/",
    targetPath: "/problems/cto-becomes-the-bottleneck",
    anchorText: "CTO Becomes the Bottleneck",
    reason: "Homepage routes executive bottleneck pain to the exact problem page.",
  },
  {
    sourcePath: "/about",
    targetPath: "/problems/cto-becomes-the-bottleneck",
    anchorText: "CTO bottleneck",
    reason: "About page links trust evaluation to a concrete executive problem.",
  },
  {
    sourcePath: "/pillars/tech-leadership-coaching",
    targetPath: "/problems/cto-becomes-the-bottleneck",
    anchorText: "CTO Becomes the Bottleneck",
    reason: "Pillar page links to high-intent executive pain.",
  },
  {
    sourcePath: "/frameworks/player-trap",
    targetPath: "/problems/cto-becomes-the-bottleneck",
    anchorText: "CTO bottleneck",
    reason: "Diagnostic page points to the CTO version of the pattern.",
  },
  {
    sourcePath: "/frameworks/invisible-executor",
    targetPath: "/problems/cto-becomes-the-bottleneck",
    anchorText: "CTO Becomes the Bottleneck",
    reason: "Framework page links to the executive bottleneck application.",
  },
  {
    sourcePath: "/",
    targetPath: "/problems/vp-rnd-losing-execution-control",
    anchorText: "VP R&D Losing Execution Control",
    reason: "Homepage routes VP R&D pain to the exact problem page.",
  },
  {
    sourcePath: "/about",
    targetPath: "/problems/vp-rnd-losing-execution-control",
    anchorText: "VP R&D execution control",
    reason: "About page links trust evaluation to a concrete VP R&D problem.",
  },
  {
    sourcePath: "/pillars/tech-leadership-coaching",
    targetPath: "/problems/vp-rnd-losing-execution-control",
    anchorText: "VP R&D Losing Execution Control",
    reason: "Pillar page links to high-intent VP R&D pain.",
  },
  {
    sourcePath: "/frameworks/player-trap",
    targetPath: "/problems/vp-rnd-losing-execution-control",
    anchorText: "VP R&D execution control",
    reason: "Diagnostic page points to the VP R&D version of the pattern.",
  },
  {
    sourcePath: "/frameworks/invisible-executor",
    targetPath: "/problems/vp-rnd-losing-execution-control",
    anchorText: "VP R&D Losing Execution Control",
    reason: "Framework page links to the executive execution-control application.",
  },
];

export function getCanonicalAuthorityInboundLinks(pathname: string): CanonicalAuthorityInboundLink[] {
  return canonicalAuthorityInboundLinks.filter((link) => link.targetPath === pathname);
}

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
