import {
  buildPublicationDecision,
  type PublicationDecision,
  type PublicationLifecycleStatus,
} from "../ai/governance/publication-state";
import {
  buildPublicContentPageModel,
  canonicalAuthorityPages,
  getStaticPublicContentCatalogEntry,
  publicContentSectionSpecs,
  type PublicContentCandidate,
  type PublicContentPageModel,
  type PublicContentSectionSpec,
} from "./public-content";
import { getServerPayload } from "./payload";
import {
  buildProblemPagePublicationDecision,
  normalizeProblemPageRecord,
  problemPageCatalog,
  type ProblemPageModel,
  type ProblemPageRecord,
} from "./problem-pages";

export interface PublicationSurfaceEntry {
  pathname: string;
  publicationDecision: PublicationDecision;
  /** The source record's last known content change, used by sitemap.xml. */
  lastModified?: Date;
  sourceKind?: "fixed" | "public_content" | "problem_page";
  publicContentPage?: PublicContentPageModel;
  problemPage?: ProblemPageModel;
}

export interface PublicationSurfaceProjection {
  entries: PublicationSurfaceEntry[];
  byPathname: Map<string, PublicationSurfaceEntry>;
  sitemapPathnames: string[];
  llmsTxtPathnames: string[];
}

interface PublicationPayloadReader {
  find(args: Record<string, unknown>): Promise<{ docs: unknown[]; hasNextPage?: boolean }>;
}

export interface LoadPublicationSurfaceProjectionOptions {
  payload?: unknown;
  allowStaticFallback?: boolean;
}

export interface FixedPublicationSurfaceRoute {
  pathname: string;
  llmsTxtEligible: boolean;
}

const fixedPublicationLastModified = new Date("2026-09-12T00:00:00.000Z");

function contentLastModified(record: { updatedAt?: string | Date | null; lastReviewedAt?: string | Date | null; publishedAt?: string | Date | null }) {
  const value = record.updatedAt ?? record.lastReviewedAt ?? record.publishedAt;
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

// Keep the public sitemap limited to the small set of reader-facing routes that
// have explicit metadata and a clear buyer or trust job. The rest of the fixed
// routes remain available to the authority engine, but are not advertised to
// crawlers until they have their own publication decision.
export const indexableFixedPathnames = new Set([
  "/",
  "/about",
  "/the-push-methodology",
  "/faq",
  "/book-a-fit-call",
]);

// Keep llms.txt aligned with the same publication boundary as metadata and the
// sitemap. A noindex route must not be advertised as a public authority source.
const llmsFixedPathnames = indexableFixedPathnames;

export const fixedPublicationSurfaceRoutes: FixedPublicationSurfaceRoute[] = [
  "/",
  "/about",
  "/the-push-methodology",
  "/faq",
  "/contact",
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
  "/entities",
  "/pillars",
  "/clusters",
  "/frameworks",
  "/case-studies",
  "/faqs",
  "/glossary",
  "/player-trap",
].map((pathname) => ({ pathname, llmsTxtEligible: llmsFixedPathnames.has(pathname) }));

export function buildPublicationSurfaceProjection(entries: PublicationSurfaceEntry[]): PublicationSurfaceProjection {
  const byPathname = new Map<string, PublicationSurfaceEntry>();

  for (const entry of entries) {
    if (byPathname.has(entry.pathname)) {
      throw new Error(`Duplicate publication projection pathname: ${entry.pathname}`);
    }

    byPathname.set(entry.pathname, entry);
  }

  return {
    entries,
    byPathname,
    sitemapPathnames: entries
      .filter((entry) => {
        const decision = entry.publicationDecision;
        const canonicalPathname = decision.canonicalUrl ? new URL(decision.canonicalUrl).pathname : null;
        return decision.sitemapEligible && decision.indexable && canonicalPathname === entry.pathname;
      })
      .map((entry) => entry.pathname),
    llmsTxtPathnames: entries.filter((entry) => entry.publicationDecision.llmsTxtEligible).map((entry) => entry.pathname),
  };
}

export function buildPublicContentSurfaceEntry(input: {
  spec: PublicContentSectionSpec;
  record: PublicContentCandidate;
  origin: string;
  trustStaticApproval?: boolean;
}): PublicationSurfaceEntry {
  const basePage = buildPublicContentPageModel(input);
  const lifecycleStatus: PublicationLifecycleStatus =
    basePage.record.status === "in_review" || basePage.record.status === "approved"
      ? "review"
      : basePage.record.status;
  const publicationDecision = input.trustStaticApproval
    ? buildPublicationDecision(
        {
          ...basePage.record,
          status: lifecycleStatus,
          painStatement: basePage.record.excerpt || basePage.record.content,
          humanApproved: true,
        },
        { origin: input.origin, pathname: basePage.pathname, treatAsHumanApproved: true },
      )
    : basePage.publicationDecision;
  const page: PublicContentPageModel = {
    ...basePage,
    canonicalUrl: publicationDecision.canonicalUrl ?? basePage.canonicalUrl,
    publicationDecision,
  };
  return {
    pathname: page.pathname,
    publicationDecision,
    lastModified: contentLastModified(basePage.record),
    sourceKind: "public_content",
    publicContentPage: page,
  };
}

export function buildProblemPageSurfaceEntry(input: {
  record: Record<string, unknown> | ProblemPageRecord;
  origin: string;
  trustStaticApproval?: boolean;
}): PublicationSurfaceEntry | null {
  const normalizedSource = input.trustStaticApproval
    ? (input.record as ProblemPageRecord)
    : normalizeProblemPageRecord(input.record as Record<string, unknown>, input.origin);
  if (!normalizedSource) return null;
  const normalized = { ...normalizedSource };
  normalized.humanApproved = input.trustStaticApproval === true || normalized.humanApproved === true;
  const pathname = `/problems/${normalized.slug}`;
  const publicationDecision = buildProblemPagePublicationDecision(normalized, { origin: input.origin, pathname });
  const page: ProblemPageModel = {
    record: normalized,
    pathname,
    canonicalUrl: publicationDecision.canonicalUrl ?? new URL(pathname, input.origin).toString(),
    publicationDecision,
  };
  return {
    pathname,
    publicationDecision,
    // Static catalog records are reviewed source material even when the legacy
    // catalog predates the publishedAt field. Keep their deterministic review
    // date; Payload records without a source date stay out of the sitemap.
    lastModified: contentLastModified(normalized) ?? (input.trustStaticApproval ? fixedPublicationLastModified : undefined),
    sourceKind: "problem_page",
    problemPage: page,
  };
}

function buildFixedEntries(origin: string): PublicationSurfaceEntry[] {
  return fixedPublicationSurfaceRoutes.map(({ pathname, llmsTxtEligible }) => ({
    pathname,
    sourceKind: "fixed",
    lastModified: fixedPublicationLastModified,
    publicationDecision: buildPublicationDecision(
      {
        slug: pathname === "/" ? "home" : pathname.slice(1),
        status: "published",
        title: "The Push authority surface",
        seoDescription: "A public authority surface for technical leadership coaching.",
        painStatement: "Technical leaders need a clearer operating model.",
        humanApproved: true,
        canonicalUrl: new URL(pathname, origin).toString(),
        llmsTxtEligible,
        indexable: indexableFixedPathnames.has(pathname),
        sitemapEligible: indexableFixedPathnames.has(pathname),
      },
      { origin, pathname },
    ),
  }));
}

async function findAllPages(
  payload: PublicationPayloadReader,
  args: Record<string, unknown>,
): Promise<unknown[]> {
  const docs: unknown[] = [];
  const maxPages = 100;

  for (let page = 1; page <= maxPages; page += 1) {
    const result = await payload.find({ ...args, limit: 100, page });
    docs.push(...result.docs);
    if (result.hasNextPage !== true) return docs;
  }

  throw new Error(`Publication projection exceeded ${maxPages} Payload pages for ${String(args.collection)}`);
}

async function loadPayloadEntries(payload: PublicationPayloadReader, origin: string): Promise<PublicationSurfaceEntry[]> {
  const entries: PublicationSurfaceEntry[] = [];
  const [publicResults, problemResult] = await Promise.all([
    Promise.all(
      publicContentSectionSpecs.map((spec) =>
        findAllPages(payload, {
          collection: spec.collectionSlug,
          overrideAccess: true,
        }),
      ),
    ),
    findAllPages(payload, {
      collection: "problem-pages",
      overrideAccess: true,
    }),
  ]);

  publicContentSectionSpecs.forEach((spec, index) => {
    const result = publicResults[index];
    for (const rawRecord of result) {
      if (!rawRecord || typeof rawRecord !== "object") continue;
      const entry = buildPublicContentSurfaceEntry({ spec, record: rawRecord as Record<string, unknown>, origin });
      if (!entry.publicContentPage?.record.slug) continue;
      entries.push(entry);
    }
  });

  for (const rawRecord of problemResult) {
    if (!rawRecord || typeof rawRecord !== "object") continue;
    const entry = buildProblemPageSurfaceEntry({ record: rawRecord as Record<string, unknown>, origin });
    if (entry) entries.push(entry);
  }

  return entries;
}

function buildStaticFallbackEntries(origin: string): PublicationSurfaceEntry[] {
  const entries: PublicationSurfaceEntry[] = canonicalAuthorityPages.flatMap((page) => {
    const spec = publicContentSectionSpecs.find((candidate) => candidate.section === page.section);
    if (!spec) return [];
    const record =
      getStaticPublicContentCatalogEntry(page.section, page.slug) ??
      ({
        title: page.title,
        slug: page.slug,
        excerpt: page.description,
        content: page.description,
        seoDescription: page.description,
        status: "published",
        publishedAt: "2026-01-01T00:00:00.000Z",
      } as const);
    return [buildPublicContentSurfaceEntry({ spec, record, origin, trustStaticApproval: true })];
  });

  for (const record of problemPageCatalog) {
    const entry = buildProblemPageSurfaceEntry({ record, origin, trustStaticApproval: true });
    if (entry) entries.push(entry);
  }

  return entries;
}

export async function loadPublicationSurfaceProjection(
  origin: string,
  options: LoadPublicationSurfaceProjectionOptions = {},
): Promise<PublicationSurfaceProjection> {
  // Intentionally uncached until Payload publication mutations have an explicit invalidation path.
  // Correctness takes priority over avoiding the sitemap/llms request-level read.
  const allowStaticFallback = options.allowStaticFallback ?? process.env.NODE_ENV !== "production";
  let governedEntries: PublicationSurfaceEntry[] = [];

  try {
    const payload = (options.payload ?? (await getServerPayload())) as PublicationPayloadReader;
    governedEntries = await loadPayloadEntries(payload, origin);
  } catch {
    if (!allowStaticFallback) {
      // Payload can be unavailable during a deploy or when the database is
      // asleep. Keep the publication boundary fail-closed by exposing only
      // static records that already carry an explicit published/approved
      // decision; review and draft records remain absent from the surface.
      const approvedStaticEntries = buildStaticFallbackEntries(origin).filter(
        (entry) => entry.publicationDecision.indexable,
      );
      return buildPublicationSurfaceProjection([...buildFixedEntries(origin), ...approvedStaticEntries]);
    }
  }

  if (allowStaticFallback) {
    const seen = new Set(governedEntries.map((entry) => entry.pathname));
    governedEntries.push(...buildStaticFallbackEntries(origin).filter((entry) => !seen.has(entry.pathname)));
  }

  return buildPublicationSurfaceProjection([...buildFixedEntries(origin), ...governedEntries]);
}
