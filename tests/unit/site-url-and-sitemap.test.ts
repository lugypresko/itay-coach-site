import { describe, expect, it, vi, afterEach } from "vitest";

vi.mock("../../src/lib/payload", () => ({
  getServerPayload: async () => {
    throw new Error("Payload unavailable in sitemap unit test");
  },
}));

import robots from "../../src/app/robots";
import sitemap from "../../src/app/sitemap";
import { metadata as aboutMetadata } from "../../src/app/(site)/about/page";
import { metadata as faqMetadata } from "../../src/app/(site)/faq/page";
import { metadata as methodologyMetadata } from "../../src/app/(site)/the-push-methodology/page";
import { GET as getLlmsTxt } from "../../src/app/llms.txt/route";
import { publicAuthorityAssetRoutes, getPublicAuthorityAssetPathnames, getPublicAuthoritySitemapPathnames } from "../../src/lib/public-authority-routes";
import { getProblemPagePathnames, getPublishedProblemPagePathnames } from "../../src/lib/problem-pages";
import { getSiteUrl } from "../../src/lib/site-url";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("site url helper", () => {
  it("uses the production domain in production when env vars are missing or point to localhost", () => {
    vi.stubEnv("NODE_ENV", "production");

    expect(getSiteUrl()).toBe("https://itayfoyerstein.com");

    vi.stubEnv("SITE_URL", "http://localhost:3000");
    expect(getSiteUrl()).toBe("https://itayfoyerstein.com");

    vi.stubEnv("SITE_URL", "https://example.com");
    expect(getSiteUrl()).toBe("https://example.com");

    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://public.example.com");
    expect(getSiteUrl()).toBe("https://public.example.com");
  });

  it("falls back to localhost in local development when env vars are missing", () => {
    vi.stubEnv("NODE_ENV", "development");

    expect(getSiteUrl()).toBe("http://localhost:3000");
  });
});

describe("robots and sitemap", () => {
  it("uses the production site url and never emits localhost in production", async () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("SITE_URL", "https://itayfoyerstein.com");

    const robotsConfig = robots();
    const sitemapEntries = await sitemap();
    const sitemapUrls = sitemapEntries.map((entry) => entry.url);
    const sitemapPathnames = sitemapUrls.map((url) => new URL(url).pathname);

    expect(robotsConfig.sitemap).toBe("https://itayfoyerstein.com/sitemap.xml");
    expect(sitemapUrls.every((url) => url.startsWith("https://itayfoyerstein.com"))).toBe(true);
    expect(sitemapUrls.some((url) => url.includes("localhost"))).toBe(false);
    expect(robotsConfig.sitemap?.includes("localhost")).toBe(false);

    expect(sitemapPathnames).toEqual(expect.arrayContaining(getPublicAuthoritySitemapPathnames()));

    expect(sitemapPathnames).toContain("/");
    expect(sitemapPathnames).not.toContain("/engineering-manager-coach");
    expect(sitemapPathnames).not.toContain("/problems/good-managers-burning-out-quietly");
    expect(sitemapPathnames).not.toContain("/case-studies/promoted-technical-manager-becomes-execution-bottleneck");
    expect(sitemapPathnames).not.toContain("/case-studies/case-study-new-engineering-manager");
    expect(sitemapPathnames).not.toContain("/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck");
    expect(sitemapPathnames).not.toContain("/clusters/how-engineering-managers-become-bottlenecks-in-ai-assisted-teams");
    expect(sitemapPathnames).not.toContain("/faqs/ai-first-leadership-for-tech-managers");
    expect(sitemapPathnames).not.toContain("/glossary/invisible-executor");
    expect(getPublishedProblemPagePathnames()).toEqual([
      "/problems/cto-becomes-the-bottleneck",
      "/problems/vp-rnd-losing-execution-control",
    ]);
    expect(getProblemPagePathnames()).toHaveLength(10);
    expect(aboutMetadata.robots).toEqual({ index: true, follow: true });
    expect(faqMetadata.robots).toEqual({ index: true, follow: true });
    expect(methodologyMetadata.robots).toEqual({ index: true, follow: true });
  });

  it("keeps the full task asset registry available for audit purposes", () => {
    const registryPathnames = getPublicAuthorityAssetPathnames({ includeDrafts: true });

    expect(registryPathnames).toEqual(
      expect.arrayContaining([
        "/entities/itay-foyerstein",
        "/entities/the-push",
        "/pillars/tech-leadership-coaching",
        "/frameworks/player-trap",
        "/frameworks/invisible-executor",
        "/clusters/how-engineering-managers-become-bottlenecks-in-ai-assisted-teams",
        "/clusters/how-to-lead-ai-generated-code-reviews-without-drowning",
        "/clusters/from-technical-expert-to-strategic-engineering-leader",
        "/clusters/why-tech-leads-struggle-after-promotion",
        "/clusters/ai-era-leadership-operating-system-for-engineering-managers",
        "/faqs/ai-first-leadership-for-tech-managers",
        "/glossary/invisible-executor",
        "/glossary/trusted-operator",
        "/glossary/strategic-leader",
        "/case-studies/promoted-technical-manager-becomes-execution-bottleneck",
      ]),
    );

    expect(publicAuthorityAssetRoutes.find((route) => route.slug === "promoted-technical-manager-becomes-execution-bottleneck")?.status).toBe("draft");
  });

  it("uses the shared public projection in llms.txt", async () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("SITE_URL", "https://itayfoyerstein.com");

    const response = await getLlmsTxt();
    const body = await response.text();

    expect(body).toContain("Public routes:");
    expect(body).not.toContain("Canonical authority sprint targets:");
    expect(body).toContain("https://itayfoyerstein.com/pillars/tech-leadership-coaching");
    expect(body).toContain("https://itayfoyerstein.com/faq");
    expect(body).toContain("https://itayfoyerstein.com/problems/cto-becomes-the-bottleneck");
    expect(body).toContain("https://itayfoyerstein.com/problems/vp-rnd-losing-execution-control");
  });
});
