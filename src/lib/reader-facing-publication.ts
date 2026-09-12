import { buildProblemPageJsonLd } from "./problem-page-schema";
import type { ProblemPageModel } from "./problem-pages";
import type { PublicContentPageModel } from "./public-content";
import { buildPageJsonLd } from "./public-schema";

export interface ReaderFacingLink {
  label: string;
  href: string;
}

export interface ReaderFacingCta extends ReaderFacingLink {
  ctaType: "diagnostic" | "fit_call";
}

export interface ReaderFacingPublicContentPage {
  pathname: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  primaryCta: ReaderFacingCta;
  relatedLinks: ReaderFacingLink[];
  jsonLd: Array<Record<string, unknown>>;
}

export function getReaderFacingDescription(content: string): string {
  const paragraph = content
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .find((item) => item && !/^#{1,6}\s/.test(item) && !/^[-*]\s/m.test(item));

  return (paragraph ?? "")
    .replace(/\[([^\]]+)\]\([^\s)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export interface ReaderFacingProblemPage {
  pathname: string;
  title: string;
  slug: string;
  painStatement: string;
  dailyScenes: string[];
  whatTheyTried: string[];
  whyItFailed: string;
  diagnosis: string;
  primaryCta: ReaderFacingCta;
  relatedFrameworks: ReaderFacingLink[];
  relatedClusters: ReaderFacingLink[];
  jsonLd: Array<Record<string, unknown>>;
}

function hrefForInternalLink(targetSlug: string, sourcePath?: string): string {
  if (targetSlug === "tech-leadership-coaching") return "/pillars/tech-leadership-coaching";
  if (targetSlug === "player-trap" && sourcePath === "/entities/the-push") return "/player-trap";
  if (targetSlug === "player-trap" || targetSlug === "invisible-executor") return `/frameworks/${targetSlug}`;
  if (targetSlug === "the-push") return "/entities/the-push";
  if (targetSlug === "itay-foyerstein") return "/entities/itay-foyerstein";
  return `/${targetSlug}`;
}

function publicContentCta(page: PublicContentPageModel): ReaderFacingCta {
  if (page.pathname === "/frameworks/player-trap") {
    return { href: "/player-trap", label: "Take the Player Trap Diagnostic", ctaType: "diagnostic" };
  }

  return { href: "/book-a-fit-call", label: "Book a Fit Call", ctaType: "fit_call" };
}

export function toReaderFacingPublicContentPage(page: PublicContentPageModel): ReaderFacingPublicContentPage {
  const description = getReaderFacingDescription(page.record.content);
  const schemaPage: PublicContentPageModel = {
    ...page,
    record: {
      ...page.record,
      excerpt: description,
      seoDescription: description,
      faq: [],
    },
  };

  return {
    pathname: page.pathname,
    title: page.record.title,
    slug: page.record.slug,
    description,
    content: page.record.content,
    primaryCta: publicContentCta(page),
    relatedLinks: page.relatedLinks.map((link) => ({
      label: link.anchorText,
      href: hrefForInternalLink(link.targetSlug, page.pathname),
    })),
    // Non-public content emits no schema. FAQ schema is fail-closed until FAQ
    // records distinguish reader-facing questions from CMS/editorial prompts.
    jsonLd: page.publicationDecision.indexable ? buildPageJsonLd(schemaPage) : [],
  };
}

export function toReaderFacingProblemPage(page: ProblemPageModel): ReaderFacingProblemPage {
  return {
    pathname: page.pathname,
    title: page.record.title,
    slug: page.record.slug,
    painStatement: page.record.painStatement,
    dailyScenes: [...page.record.dailyScenes],
    whatTheyTried: [...page.record.whatTheyTried],
    whyItFailed: page.record.whyItFailed,
    diagnosis: page.record.diagnosis,
    primaryCta: {
      label: page.record.primaryCTA.label,
      href: page.record.primaryCTA.href,
      ctaType: page.record.primaryCTA.href === "/player-trap" ? "diagnostic" : "fit_call",
    },
    relatedFrameworks: page.record.relatedFrameworks.map((link) => ({ label: link.label, href: link.href })),
    relatedClusters: page.record.relatedClusters.map((link) => ({ label: link.label, href: link.href })),
    jsonLd: buildProblemPageJsonLd(page),
  };
}
