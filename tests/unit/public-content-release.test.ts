import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import SectionLandingPage, { generateMetadata } from "../../src/app/(site)/[section]/page";

const internalCopy = /public knowledge graph|authority graph|recommendation-intent|Section snapshot|Canonical pages|Primary CTA|collection|Citation-worthy|Target questions|The page should/i;

afterEach(() => {
  vi.resetModules();
  vi.doUnmock("../../src/lib/payload");
  vi.unstubAllEnvs();
});

describe("public content release", () => {
  it.each(["pillars", "frameworks"])("renders visitor copy and existing destinations for /%s", async (section) => {
    const params = Promise.resolve({ section });
    const html = renderToStaticMarkup(await SectionLandingPage({ params }));
    expect(html).not.toMatch(internalCopy);
    expect(html).toContain('href="/book-a-fit-call"');
    expect(html).toContain('href="/invisible-executor-assessment"');
    const destinations = section === "pillars"
      ? ["/pillars/tech-leadership-coaching"]
      : ["/frameworks/player-trap", "/frameworks/invisible-executor"];
    for (const href of destinations) expect(html).toContain(`href="${href}"`);
    const metadata = await generateMetadata({ params });
    expect(JSON.stringify(metadata)).not.toMatch(internalCopy);
    expect(metadata.alternates?.canonical).toBe(`/${section}`);
  });

  it.each([
    ["pillars", "tech-leadership-coaching"],
    ["frameworks", "player-trap"],
    ["frameworks", "invisible-executor"],
  ] as const)("keeps stale published CMS copy out of /%s/%s", async (section, slug) => {
    vi.stubEnv("NODE_ENV", "production");
    const find = vi.fn(async () => ({ docs: [{
      title: "Planning", slug, status: "published", publishedAt: "2026-06-17T00:00:00Z",
      content: "The page should surface the authority graph for recommendation-intent visitors.",
    }] }));
    vi.doMock("../../src/lib/payload", () => ({ getServerPayload: async () => ({ find }) }));
    const { loadPublishedPublicContent } = await import("../../src/lib/public-content-loader");
    const { toReaderFacingPublicContentPage } = await import("../../src/lib/reader-facing-publication");
    const { PublicContentPage } = await import("../../src/components/public-content-page");
    const page = await loadPublishedPublicContent(section, slug, "https://itayfoyerstein.com", { allowStaticFallback: true });
    expect(page).not.toBeNull();
    expect(find).not.toHaveBeenCalled();
    const html = renderToStaticMarkup(React.createElement(PublicContentPage, { page: toReaderFacingPublicContentPage(page!) }));
    expect(html).not.toMatch(internalCopy);
    expect(html).not.toContain("1000+ coaching hours");
  });
});
