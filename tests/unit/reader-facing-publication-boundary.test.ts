import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ProblemPage } from "../../src/components/problem-page";
import { PublicContentPage } from "../../src/components/public-content-page";
import { reviewReadyPublicSurfaceBatchAssets } from "../../src/seed/review-ready-public-surface-batch";
import {
  buildPublicContentPageModel,
  getPublicContentSectionSpec,
} from "../../src/lib/public-content";
import {
  buildProblemPagePublicationDecision,
  getProblemPageCatalogEntry,
} from "../../src/lib/problem-pages";
import {
  toReaderFacingProblemPage,
  toReaderFacingPublicContentPage,
} from "../../src/lib/reader-facing-publication";

const origin = "https://itayfoyerstein.com";

describe("reader-facing publication boundary", () => {
  it("projects Draft 05 without CMS, review, evidence-source, or audit fields", () => {
    const asset = reviewReadyPublicSurfaceBatchAssets.find(
      (entry) => entry.humanApproval?.draftId === "authority-draft-approved-insight-player-trap-05",
    );
    const spec = getPublicContentSectionSpec("clusters");
    expect(asset).toBeDefined();
    expect(spec).toBeDefined();

    const page = buildPublicContentPageModel({
      spec: spec!,
      record: {
        ...asset!.payloadData,
        canonicalUrl: `${origin}/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck`,
      },
      origin,
    });
    const publicPage = toReaderFacingPublicContentPage(page);
    const serialized = JSON.stringify(publicPage);

    expect(serialized).not.toContain("humanApproval");
    expect(serialized).not.toContain("publicationDecision");
    expect(serialized).not.toContain("trustSignals");
    expect(serialized).not.toContain("evidenceUrls");
    expect(serialized).not.toContain("docs/seed-content");
    expect(serialized).not.toContain("What should this page strengthen?");
    expect(serialized).not.toContain('"status":"review"');
    expect(serialized).not.toContain("review-ready recommendation page");
    expect(serialized).not.toContain("Cluster page");
    expect(page.publicationDecision.indexable).toBe(false);
    expect(page.publicationDecision.sitemapEligible).toBe(false);
    expect(page.publicationDecision.llmsTxtEligible).toBe(false);

    const html = renderToStaticMarkup(createElement(PublicContentPage, { page: publicPage }));
    expect(html).toContain("Your technical strength is not the problem");
    expect(html).not.toContain("Not reviewed yet");
    expect(html).not.toContain("Content status");
    expect(html).not.toContain("Evidence block");
    expect(html).not.toContain("docs/seed-content");
    expect(html).not.toContain("What should this page strengthen?");
  });

  it("projects a Problem Page without internal evidence and approval metadata", () => {
    const record = getProblemPageCatalogEntry("cto-becomes-the-bottleneck");
    expect(record).toBeDefined();
    const pathname = `/problems/${record!.slug}`;
    const page = {
      record: record!,
      pathname,
      canonicalUrl: `${origin}${pathname}`,
      publicationDecision: buildProblemPagePublicationDecision(record!, {
        origin,
        pathname,
        treatAsHumanApproved: true,
      }),
    };
    const publicPage = toReaderFacingProblemPage(page);
    const serialized = JSON.stringify(publicPage);

    expect(serialized).not.toContain("humanApproval");
    expect(serialized).not.toContain("publicationDecision");
    expect(serialized).not.toContain("evidenceBlock");
    expect(serialized).not.toContain("approvalStatus");
    expect(serialized).not.toContain("confidence");

    const html = renderToStaticMarkup(createElement(ProblemPage, { page: publicPage }));
    expect(html).toContain(record!.diagnosis);
    expect(html).not.toContain("Content status");
    expect(html).not.toContain("Approval status");
    expect(html).not.toContain("Confidence");
    expect(html).not.toContain(record!.evidenceBlock.source);
  });
});
