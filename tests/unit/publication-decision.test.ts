import { describe, expect, it, vi } from "vitest";

import { GET as getLlmsTxt } from "../../src/app/llms.txt/route";
import { getPublicAuthoritySitemapPathnames } from "../../src/lib/public-authority-routes";
import {
  buildProblemPagePublicationDecision,
  getPublishedProblemPagePathnames,
  getProblemPageCatalogEntry,
  getProblemPagePathnames,
} from "../../src/lib/problem-pages";

describe("publication decision", () => {
  it("marks a published problem page as indexable and eligible for sitemap and llms.txt", () => {
    const page = getProblemPageCatalogEntry("cto-becomes-the-bottleneck");

    expect(page).toBeTruthy();

    const decision = buildProblemPagePublicationDecision(page!, {
      origin: "https://itayfoyerstein.com",
    });

    expect(decision).toMatchObject({
      lifecycleStatus: "published",
      humanApproved: true,
      publiclyAccessible: true,
      indexable: true,
      sitemapEligible: true,
      llmsTxtEligible: true,
      canonicalUrl: "https://itayfoyerstein.com/problems/cto-becomes-the-bottleneck",
      schemaEligible: true,
      reasonCodes: [],
    });
  });

  it("keeps draft problem pages out of sitemap and llms.txt", () => {
    const page = getProblemPageCatalogEntry("good-managers-burning-out-quietly");

    expect(page).toBeTruthy();

    const decision = buildProblemPagePublicationDecision(page!, {
      origin: "https://itayfoyerstein.com",
    });

    expect(decision.lifecycleStatus).toBe("draft");
    expect(decision.indexable).toBe(false);
    expect(decision.sitemapEligible).toBe(false);
    expect(decision.llmsTxtEligible).toBe(false);
    expect(decision.reasonCodes).toEqual(
      expect.arrayContaining([
        "draft_not_indexable",
        "draft_not_in_sitemap",
        "draft_not_in_llms_txt",
      ]),
    );
  });

  it("surfaces explicit integrity violations for contradictory publication state", () => {
    const page = getProblemPageCatalogEntry("vp-rnd-losing-execution-control");

    expect(page).toBeTruthy();

    const decision = buildProblemPagePublicationDecision(
      {
        ...page!,
        humanApproved: false,
        canonicalUrl: null,
      },
      {
        origin: "https://itayfoyerstein.com",
        treatAsHumanApproved: false,
        canonicalUrl: null,
      },
    );

    expect(decision.lifecycleStatus).toBe("published");
    expect(decision.indexable).toBe(false);
    expect(decision.reasonCodes).toEqual(
      expect.arrayContaining([
        "published_not_human_approved",
        "published_missing_canonical_url",
        "published_noindex_conflict",
        "publication_surface_conflict",
      ]),
    );
  });

  it("keeps the sitemap aligned to the shared publication helper", () => {
    expect(getPublicAuthoritySitemapPathnames()).toEqual(
      expect.arrayContaining([
        "/problems/cto-becomes-the-bottleneck",
        "/problems/vp-rnd-losing-execution-control",
      ]),
    );

    expect(getPublicAuthoritySitemapPathnames()).not.toContain("/problems/good-managers-burning-out-quietly");
    expect(getPublishedProblemPagePathnames()).toEqual([
      "/problems/cto-becomes-the-bottleneck",
      "/problems/vp-rnd-losing-execution-control",
    ]);
    expect(getProblemPagePathnames()).toHaveLength(10);
  });

  it("keeps llms.txt aligned to the shared publication helper", async () => {
    vi.stubEnv("NODE_ENV", "production");

    const response = await getLlmsTxt();
    const body = await response.text();

    expect(body).toContain("https://itayfoyerstein.com/problems/cto-becomes-the-bottleneck");
    expect(body).toContain("https://itayfoyerstein.com/problems/vp-rnd-losing-execution-control");
    expect(body).not.toContain("https://itayfoyerstein.com/problems/good-managers-burning-out-quietly");
  });
});
