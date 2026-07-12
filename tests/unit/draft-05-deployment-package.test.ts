import { describe, expect, it, vi } from "vitest";

import sitemap from "../../src/app/sitemap";
import { GET as getLlmsTxt } from "../../src/app/llms.txt/route";
import { buildProblemPagePublicationDecision, getProblemPageCatalogEntry } from "../../src/lib/problem-pages";
import { buildPublicContentPageModel, getPublicContentSectionSpec } from "../../src/lib/public-content";
import {
  canonicalAuthorityInboundLinks,
  getPublicAuthorityAssetPathnames,
  publicAuthorityAssetRoutes,
  publicAuthorityLandingPathnames,
} from "../../src/lib/public-authority-routes";
import { reviewReadyPublicSurfaceBatchAssets } from "../../src/seed/review-ready-public-surface-batch";

const canonicalPath = "/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck";

describe("Draft 05 authorized deployment package", () => {
  it("keeps the human-approved non-published asset consistent across sitemap and llms.txt", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const sitemapPathnames = sitemap().map((entry) => new URL(entry.url).pathname);
    const llmsBody = await (await getLlmsTxt()).text();

    expect(sitemapPathnames.includes(canonicalPath)).toBe(llmsBody.includes(`https://itayfoyerstein.com${canonicalPath}`));
    expect(sitemapPathnames).not.toContain(canonicalPath);
    expect(llmsBody).not.toContain(`https://itayfoyerstein.com${canonicalPath}`);
  });

  it("introduces no URL and resolves the approved CTA and internal-link destinations", () => {
    const asset = reviewReadyPublicSurfaceBatchAssets.find(
      (entry) => entry.humanApproval?.canonicalPath === canonicalPath,
    );
    const knownPaths = new Set([
      ...publicAuthorityLandingPathnames,
      ...getPublicAuthorityAssetPathnames({ includeDrafts: true }),
    ]);

    expect(publicAuthorityAssetRoutes.filter((route) => `/${route.section}/${route.slug}` === canonicalPath)).toHaveLength(1);
    expect(asset?.payloadData.content).toContain("[Book a fit call](/book-a-fit-call)");
    expect(knownPaths).toContain("/book-a-fit-call");

    for (const destination of [
      "/pillars/tech-leadership-coaching",
      "/frameworks/player-trap",
      "/frameworks/invisible-executor",
    ]) {
      expect(asset?.payloadData.content).toContain(`](${destination})`);
      expect(knownPaths).toContain(destination);
    }

    expect(asset?.humanApproval?.canonicalPath).toBe(`/${asset?.payloadCollection.replace("-pages", "s")}/${asset?.payloadData.slug}`);

    const clusterSpec = getPublicContentSectionSpec("clusters");
    const page = buildPublicContentPageModel({
      spec: clusterSpec!,
      record: asset!.payloadData,
      origin: "https://itayfoyerstein.com",
    });
    expect(page.pathname).toBe(canonicalPath);
    expect(page.canonicalUrl).toBe(`https://itayfoyerstein.com${canonicalPath}`);
  });

  it("includes the CTO publication repair and pillar links to both approved Problem Pages", () => {
    const cto = getProblemPageCatalogEntry("cto-becomes-the-bottleneck");
    expect(cto).toBeTruthy();
    const ctoDecision = buildProblemPagePublicationDecision(cto!, {
      origin: "https://itayfoyerstein.com",
      pathname: "/problems/cto-becomes-the-bottleneck",
    });

    expect(ctoDecision).toMatchObject({
      lifecycleStatus: "published",
      humanApproved: true,
      indexable: true,
      sitemapEligible: true,
      llmsTxtEligible: true,
      canonicalUrl: "https://itayfoyerstein.com/problems/cto-becomes-the-bottleneck",
      reasonCodes: [],
    });

    const pillarProblemLinks = canonicalAuthorityInboundLinks.filter(
      (link) => link.sourcePath === "/pillars/tech-leadership-coaching" && link.targetPath.startsWith("/problems/"),
    );
    expect(pillarProblemLinks.map((link) => link.targetPath)).toEqual(
      expect.arrayContaining([
        "/problems/cto-becomes-the-bottleneck",
        "/problems/vp-rnd-losing-execution-control",
      ]),
    );
  });
});
