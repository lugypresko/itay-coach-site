import { describe, expect, it, vi, afterEach } from "vitest";

import robots from "../../src/app/robots";
import sitemap from "../../src/app/sitemap";
import { GET as getLlmsTxt } from "../../src/app/llms.txt/route";
import { publicAuthorityAssetRoutes, getPublicAuthorityAssetPathnames } from "../../src/lib/public-authority-routes";
import { getProblemPagePathnames } from "../../src/lib/problem-pages";
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
        "/problems/cto-becomes-the-bottleneck",
        "/problems/vp-rnd-losing-execution-control",
        "/problems/engineering-managers-stuck-in-firefighting",
        "/problems/senior-developer-still-acting-like-a-developer",
        "/problems/ai-adoption-creates-more-work-not-leverage",
        "/problems/product-engineering-misalignment",
        "/problems/squads-depend-on-one-strong-manager",
        "/problems/busy-execution-without-business-results",
        "/problems/leadership-team-cannot-scale-decisions",
        "/problems/good-managers-burning-out-quietly",
        "/ai-first-leadership",
        "/invisible-executor-assessment",
        "/tech-leadership-visibility-scorecard",
        "/entities",
        "/entities/itay-foyerstein",
        "/entities/the-push",
        "/pillars",
        "/pillars/tech-leadership-coaching",
        "/frameworks",
        "/frameworks/player-trap",
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
    expect(getProblemPagePathnames()).toHaveLength(10);
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

  it("lists the canonical authority sprint targets in llms.txt", async () => {
    vi.stubEnv("NODE_ENV", "production");

    const response = await getLlmsTxt();
    const body = await response.text();

    expect(body).toContain("Canonical authority sprint targets:");
    expect(body).toContain("https://itayfoyerstein.com/pillars/tech-leadership-coaching");
    expect(body).toContain("https://itayfoyerstein.com/frameworks/player-trap");
    expect(body).toContain("https://itayfoyerstein.com/frameworks/invisible-executor");
    expect(body).toContain("https://itayfoyerstein.com/problems/cto-becomes-the-bottleneck");
    expect(body).toContain("https://itayfoyerstein.com/problems/vp-rnd-losing-execution-control");
  });
});
