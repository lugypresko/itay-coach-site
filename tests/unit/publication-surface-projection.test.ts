import { describe, expect, it } from "vitest";

import { buildPublicationDecision } from "../../src/ai/governance/publication-state";
import { createContentRevisionHash } from "../../src/ai/governance/content-revision-hash";
import {
  createPublicationRevisionHash,
  serializeAuthorityPublicationRevision,
} from "../../src/ai/governance/publication-approval";
import { getPublicContentSectionSpec } from "../../src/lib/public-content";
import { getProblemPageCatalogEntry } from "../../src/lib/problem-pages";
import {
  buildProblemPageSurfaceEntry,
  buildPublicContentSurfaceEntry,
  buildPublicationSurfaceProjection,
  loadPublicationSurfaceProjection,
} from "../../src/lib/publication-surface-projection";

const origin = "https://itayfoyerstein.com";

function decision(pathname: string, status: "review" | "published") {
  return buildPublicationDecision(
    {
      slug: pathname.split("/").at(-1)!,
      status,
      title: "Authority surface",
      seoDescription: "A governed authority surface with enough publication shape.",
      painStatement: "A concrete leadership problem is diagnosed here.",
      humanApproved: status === "published",
      canonicalUrl: `${origin}${pathname}`,
    },
    { origin, pathname },
  );
}

describe("shared publication surface projection", () => {
  it("uses one decision for page metadata, sitemap, and llms.txt eligibility", () => {
    const publishedPath = "/clusters/published-authority-surface";
    const reviewPath = "/clusters/review-authority-surface";
    const projection = buildPublicationSurfaceProjection([
      { pathname: publishedPath, publicationDecision: decision(publishedPath, "published") },
      { pathname: reviewPath, publicationDecision: decision(reviewPath, "review") },
    ]);

    expect(projection.byPathname.get(publishedPath)?.publicationDecision.indexable).toBe(true);
    expect(projection.sitemapPathnames).toContain(publishedPath);
    expect(projection.llmsTxtPathnames).toContain(publishedPath);

    expect(projection.byPathname.get(reviewPath)?.publicationDecision.indexable).toBe(false);
    expect(projection.sitemapPathnames).not.toContain(reviewPath);
    expect(projection.llmsTxtPathnames).not.toContain(reviewPath);
  });

  it("cannot let duplicate static state override a governed Payload decision", () => {
    const pathname = "/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck";

    expect(() =>
      buildPublicationSurfaceProjection([
        { pathname, publicationDecision: decision(pathname, "review") },
        { pathname, publicationDecision: decision(pathname, "published") },
      ]),
    ).toThrow(/duplicate publication projection pathname/i);
  });

  it("projects the Task 070 cluster state from Payload into both discovery surfaces", async () => {
    const pathname = "/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck";
    const title = "Coach for Engineering Managers Stuck as the Bottleneck";
    const content = "The operating model keeps routing decisions through one leader.";
    const canonicalUrl = `${origin}${pathname}`;
    const governedRecord = {
      title,
      slug: "coach-for-engineering-managers-stuck-as-the-bottleneck",
      excerpt: "A concrete diagnosis for leaders who remain the dependency path.",
      content,
      seoDescription: "Diagnose why an Engineering Manager remains the bottleneck.",
      status: "published",
      canonicalUrl,
    } as const;
    const payload = {
      find: async ({ collection }: { collection: string }) => ({
        docs:
          collection === "cluster-pages"
            ? [
                {
                  ...governedRecord,
                  humanApproval: {
                    approvalTimestamp: "2026-07-12T20:00:00.000Z",
                    approver: "human-reviewer",
                    contentRevisionHash: createContentRevisionHash({ title, content, canonicalPath: pathname }),
                    publicationRevisionHash: createPublicationRevisionHash(
                      serializeAuthorityPublicationRevision(governedRecord),
                    ),
                    supportingApprovedInsightIds: ["approved-insight-player-trap-05"],
                    validationResult: {
                      deterministicHardGatesPassed: true,
                      semanticQualityPassed: true,
                      failureCodes: [],
                    },
                    publicationScope: {
                      approvedCanonicalPaths: [pathname],
                      excludedDraftIds: [],
                      deploymentAuthorized: true,
                      publicationAuthorized: true,
                    },
                  },
                },
              ]
            : [],
      }),
    };

    const projection = await loadPublicationSurfaceProjection(origin, {
      payload,
      allowStaticFallback: false,
    });

    expect(projection.byPathname.get(pathname)?.publicationDecision.indexable).toBe(true);
    expect(projection.sitemapPathnames).toContain(pathname);
    expect(projection.llmsTxtPathnames).toContain(pathname);
  });

  it("carries the normalized page model built from the same governed record", () => {
    const entry = buildPublicContentSurfaceEntry({
      spec: getPublicContentSectionSpec("clusters")!,
      record: {
        title: "Review surface",
        slug: "review-surface",
        excerpt: "A review-stage diagnosis.",
        content: "Reader-facing review content.",
        seoDescription: "A review-stage authority surface.",
        status: "review",
        canonicalUrl: `${origin}/clusters/review-surface`,
      },
      origin,
    });

    expect(entry.sourceKind).toBe("public_content");
    expect(entry.publicContentPage?.record.slug).toBe("review-surface");
    expect(entry.publicContentPage?.publicationDecision).toBe(entry.publicationDecision);
  });

  it("fails closed without test fallback when the injected production source is unavailable", async () => {
    const projection = await loadPublicationSurfaceProjection(origin, {
      payload: {
        find: async () => {
          throw new Error("Payload unavailable");
        },
      },
      allowStaticFallback: false,
    });

    expect(projection.entries.every((entry) => entry.sourceKind === "fixed")).toBe(true);
    expect(projection.sitemapPathnames).not.toContain("/problems/cto-becomes-the-bottleneck");
    expect(projection.sitemapPathnames).not.toContain("/frameworks/player-trap");
  });

  it("excludes a published record without a valid approval envelope from every surface", () => {
    const entry = buildPublicContentSurfaceEntry({
      spec: getPublicContentSectionSpec("clusters")!,
      record: {
        title: "Unapproved published surface",
        slug: "unapproved-published-surface",
        excerpt: "A record missing its approval envelope.",
        content: "Reader-facing content exists but approval does not.",
        seoDescription: "A complete but unapproved authority surface.",
        status: "published",
        canonicalUrl: `${origin}/clusters/unapproved-published-surface`,
      },
      origin,
    });

    expect(entry.publicationDecision).toMatchObject({
      humanApproved: false,
      indexable: false,
      sitemapEligible: false,
      llmsTxtEligible: false,
    });
  });

  it("reads every bounded Payload page until hasNextPage is false", async () => {
    const requestedPages: number[] = [];
    const payload = {
      find: async ({ collection, page }: { collection: string; page: number }) => {
        requestedPages.push(page);
        if (collection !== "cluster-pages") return { docs: [], hasNextPage: false };
        return page === 1
          ? {
              docs: [
                {
                  title: "Review page one",
                  slug: "review-page-one",
                  excerpt: "First page.",
                  content: "First reader-facing page.",
                  seoDescription: "First review surface.",
                  status: "review",
                },
              ],
              hasNextPage: true,
            }
          : {
              docs: [
                {
                  title: "Review page two",
                  slug: "review-page-two",
                  excerpt: "Second page.",
                  content: "Second reader-facing page.",
                  seoDescription: "Second review surface.",
                  status: "review",
                },
              ],
              hasNextPage: false,
            };
      },
    };

    const projection = await loadPublicationSurfaceProjection(origin, { payload, allowStaticFallback: false });

    expect(projection.byPathname.has("/clusters/review-page-one")).toBe(true);
    expect(projection.byPathname.has("/clusters/review-page-two")).toBe(true);
    expect(requestedPages).toContain(2);
  });

  it("does not mutate a static source record while projecting trusted fallback approval", () => {
    const { humanApproved: _humanApproved, ...source } = getProblemPageCatalogEntry("cto-becomes-the-bottleneck")!;

    buildProblemPageSurfaceEntry({
      record: source as ReturnType<typeof getProblemPageCatalogEntry> & Record<string, unknown>,
      origin,
      trustStaticApproval: true,
    });

    expect(Object.prototype.hasOwnProperty.call(source, "humanApproved")).toBe(false);
  });
});
