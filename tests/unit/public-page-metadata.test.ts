import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.resetModules();
  vi.unstubAllEnvs();
  vi.doUnmock("../../src/lib/public-content-loader");
  vi.doUnmock("../../src/lib/problem-pages");
  vi.doUnmock("../../src/lib/reader-facing-publication");
});

describe("governed public page metadata", () => {
  it("derives indexable robots and canonical metadata from the public content loader", async () => {
    vi.stubEnv("SITE_URL", "https://itayfoyerstein.com");
    vi.doMock("../../src/lib/public-content-loader", () => ({
      loadPublishedPublicContent: async () => ({
        canonicalUrl: "https://itayfoyerstein.com/clusters/review-asset",
        publicationDecision: { indexable: true },
        record: { seoTitle: "Review asset", seoDescription: "Review copy" },
      }),
    }));

    const { generateMetadata } = await import("../../src/app/(site)/[section]/[slug]/page");
    const metadata = await generateMetadata({
      params: Promise.resolve({ section: "clusters", slug: "review-asset" }),
    });

    expect(metadata.robots).toEqual({ index: true, follow: true });
    expect(metadata.alternates?.canonical).toBe("https://itayfoyerstein.com/clusters/review-asset");
  });

  it("emits no route metadata when the public content loader returns no page", async () => {
    vi.doMock("../../src/lib/public-content-loader", () => ({
      loadPublishedPublicContent: async () => null,
    }));

    const { generateMetadata } = await import("../../src/app/(site)/[section]/[slug]/page");
    const metadata = await generateMetadata({
      params: Promise.resolve({ section: "clusters", slug: "invalid-canonical-asset" }),
    });

    expect(metadata).toEqual({});
  });
});