import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PublicContentPage } from "../../src/components/public-content-page";
import { buildProblemPagePublicationDecision, getProblemPageCatalogEntry } from "../../src/lib/problem-pages";
import { buildProblemPageJsonLd } from "../../src/lib/problem-page-schema";
import {
  canonicalAuthoritySprintTargetPathnames,
  getCanonicalAuthorityInboundLinks,
  getPublicAuthoritySitemapPathnames,
} from "../../src/lib/public-authority-routes";
import {
  buildPublicContentPageModel,
  getPublicContentSectionSpec,
  getStaticPublicContentCatalogEntry,
} from "../../src/lib/public-content";
import { buildPageJsonLd } from "../../src/lib/public-schema";
import { getAuthorityProofBlocks } from "../../src/lib/evidence-mapping";
import {
  buildTargetAnalyticsProperties,
  targetAnalyticsEventNames,
} from "../../src/lib/target-page-analytics";

const targetPathnames = [
  "/pillars/tech-leadership-coaching",
  "/frameworks/player-trap",
  "/frameworks/invisible-executor",
  "/problems/cto-becomes-the-bottleneck",
  "/problems/vp-rnd-losing-execution-control",
];

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("canonical authority sprint", () => {
  it("keeps the five customer-intent pages canonical, indexable, and in the sitemap", () => {
    expect(canonicalAuthoritySprintTargetPathnames).toEqual(targetPathnames);
    expect(getPublicAuthoritySitemapPathnames()).toEqual(expect.arrayContaining(targetPathnames));

    const publicContentTargets = targetPathnames.filter((pathname) => !pathname.startsWith("/problems/"));
    const titles = new Set<string>();
    const descriptions = new Set<string>();

    for (const pathname of publicContentTargets) {
      const [, section, slug] = pathname.split("/");
      const record = getStaticPublicContentCatalogEntry(section, slug);

      expect(record, pathname).toBeTruthy();
      expect(record?.status, pathname).toBe("published");
      expect(record?.publishedAt, pathname).toBeTruthy();
      expect(record?.seoTitle, pathname).toBeTruthy();
      expect(record?.seoDescription, pathname).toBeTruthy();
      titles.add(record?.seoTitle ?? "");
      descriptions.add(record?.seoDescription ?? "");
    }

    expect(titles.size).toBe(publicContentTargets.length);
    expect(descriptions.size).toBe(publicContentTargets.length);

    for (const slug of ["cto-becomes-the-bottleneck", "vp-rnd-losing-execution-control"]) {
      const page = getProblemPageCatalogEntry(slug);

      expect(page?.status, slug).toBe("published");
      expect(page?.seoTitle, slug).toBeTruthy();
      expect(page?.seoDescription, slug).toBeTruthy();
      expect(page?.primaryCTA.href, slug).toBe("/book-a-fit-call");
    }
  });

  it("gives each target page at least five meaningful inbound internal links", () => {
    for (const pathname of targetPathnames) {
      const links = getCanonicalAuthorityInboundLinks(pathname);

      expect(links.length, pathname).toBeGreaterThanOrEqual(5);
      expect(new Set(links.map((link) => `${link.sourcePath}->${link.targetPath}`)).size, pathname).toBe(links.length);
      expect(links.every((link) => link.anchorText.length > 6 && link.reason.length > 12), pathname).toBe(true);
    }
  });

  it("renders public target pages with one primary CTA, evidence, related links, and breadcrumb schema", () => {
    for (const pathname of ["/pillars/tech-leadership-coaching", "/frameworks/player-trap", "/frameworks/invisible-executor"]) {
      const [, section, slug] = pathname.split("/");
      const spec = getPublicContentSectionSpec(section);
      const record = getStaticPublicContentCatalogEntry(section, slug);
      expect(spec, pathname).toBeTruthy();
      expect(record, pathname).toBeTruthy();

      const page = buildPublicContentPageModel({
        spec: spec!,
        record: record!,
        origin: "https://itayfoyerstein.com",
      });
      const html = renderToStaticMarkup(createElement(PublicContentPage, { page }));
      const jsonLd = buildPageJsonLd(page);

      expect(page.canonicalUrl, pathname).toBe(`https://itayfoyerstein.com${pathname}`);
      expect(html, pathname).toContain("Evidence block");
      expect(html, pathname).toContain("Related pages");
      expect(html.match(/class="primary-link"/g)?.length ?? 0, pathname).toBe(2);
      expect(html, pathname).not.toContain("secondary-link");
      expect(jsonLd.some((piece) => piece["@type"] === "BreadcrumbList"), pathname).toBe(true);
      expect(getAuthorityProofBlocks(pathname).length, pathname).toBeGreaterThan(0);
    }
  });

  it("gives problem target pages breadcrumbs, evidence, one CTA, related pages, and proof blocks", () => {
    for (const slug of ["cto-becomes-the-bottleneck", "vp-rnd-losing-execution-control"]) {
      const record = getProblemPageCatalogEntry(slug);
      expect(record).toBeTruthy();

      const page = {
        record: record!,
        pathname: `/problems/${slug}`,
        canonicalUrl: `https://itayfoyerstein.com/problems/${slug}`,
        publicationDecision: buildProblemPagePublicationDecision(record!, {
          origin: "https://itayfoyerstein.com",
          pathname: `/problems/${slug}`,
        }),
      };
      const jsonLd = buildProblemPageJsonLd(page);

      expect(record?.evidenceBlock.claim.length, slug).toBeGreaterThan(20);
      expect(record?.evidenceBlock.confidence, slug).toBe("high");
      expect(record?.primaryCTA.label, slug).toBe("Book a fit call");
      expect(record?.relatedFrameworks.length, slug).toBeGreaterThan(0);
      expect(record?.relatedClusters.length, slug).toBeGreaterThan(0);
      expect(jsonLd.some((piece) => piece["@type"] === "BreadcrumbList"), slug).toBe(true);
      expect(getAuthorityProofBlocks(`/problems/${slug}`).length, slug).toBeGreaterThan(0);
    }
  });

  it("defines target analytics events with path, slug, CTA type, referrer, and UTM fields", () => {
    expect(targetAnalyticsEventNames).toEqual({
      pageView: "target_page_view",
      ctaClick: "target_cta_click",
      diagnosticClick: "diagnostic_click",
      fitCallClick: "fit_call_click",
    });

    vi.stubGlobal("document", { referrer: "https://google.com/search" });

    expect(
      buildTargetAnalyticsProperties({
        path: "/frameworks/player-trap",
        slug: "player-trap",
        ctaType: "diagnostic",
        search: "?utm_source=google&utm_medium=organic&utm_campaign=authority&utm_content=snippet&utm_term=cto",
      }),
    ).toEqual({
      path: "/frameworks/player-trap",
      slug: "player-trap",
      cta_type: "diagnostic",
      referrer: "https://google.com/search",
      utm_source: "google",
      utm_medium: "organic",
      utm_campaign: "authority",
      utm_content: "snippet",
      utm_term: "cto",
    });
  });
});
