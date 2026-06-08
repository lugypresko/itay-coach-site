import { describe, expect, it, vi, afterEach } from "vitest";

import robots from "../../src/app/robots";
import sitemap from "../../src/app/sitemap";
import { publicAuthorityAssetRoutes, getPublicAuthorityAssetPathnames } from "../../src/lib/public-authority-routes";
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
  it("uses the production site url and never emits localhost in production", () => {
    vi.stubEnv("NODE_ENV", "production");

    const robotsConfig = robots();
    const sitemapEntries = sitemap();
    const sitemapUrls = sitemapEntries.map((entry) => entry.url);
    const sitemapPathnames = sitemapUrls.map((url) => new URL(url).pathname);

    expect(robotsConfig.sitemap).toBe("https://itayfoyerstein.com/sitemap.xml");
    expect(sitemapUrls.every((url) => url.startsWith("https://itayfoyerstein.com"))).toBe(true);
    expect(sitemapUrls.some((url) => url.includes("localhost"))).toBe(false);
    expect(robotsConfig.sitemap?.includes("localhost")).toBe(false);

    expect(sitemapPathnames).toEqual(
      expect.arrayContaining([
        "/",
        "/book-a-fit-call",
        "/ai-first-leadership",
        "/invisible-executor-assessment",
        "/tech-leadership-visibility-scorecard",
        "/entities",
        "/entities/itay-foyerstein",
        "/entities/the-push",
        "/pillars",
        "/pillars/tech-leadership-coaching",
        "/frameworks",
        "/frameworks/invisible-executor",
        "/clusters",
        "/clusters/how-engineering-managers-become-bottlenecks-in-ai-assisted-teams",
        "/clusters/how-to-lead-ai-generated-code-reviews-without-drowning",
        "/clusters/from-technical-expert-to-strategic-engineering-leader",
        "/clusters/why-tech-leads-struggle-after-promotion",
        "/clusters/ai-era-leadership-operating-system-for-engineering-managers",
        "/faqs",
        "/faqs/ai-first-leadership-for-tech-managers",
        "/glossary",
        "/glossary/invisible-executor",
        "/glossary/trusted-operator",
        "/glossary/strategic-leader",
        "/case-studies",
      ]),
    );

    expect(sitemapPathnames).not.toContain("/case-studies/promoted-technical-manager-becomes-execution-bottleneck");
    expect(sitemapPathnames).not.toContain("/case-studies/case-study-new-engineering-manager");
  });

  it("keeps the full task asset registry available for audit purposes", () => {
    const registryPathnames = getPublicAuthorityAssetPathnames({ includeDrafts: true });

    expect(registryPathnames).toEqual(
      expect.arrayContaining([
        "/entities/itay-foyerstein",
        "/entities/the-push",
        "/pillars/tech-leadership-coaching",
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
});
