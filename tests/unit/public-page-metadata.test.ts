import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.resetModules();
  vi.unstubAllEnvs();
  vi.doUnmock("../../src/lib/reader-facing-artifact-public-projection");
});

describe("governed public page metadata", () => {
  it("derives indexable robots and canonical metadata only from the public artifact projection", async () => {
    vi.stubEnv("SITE_URL", "https://itayfoyerstein.com");
    vi.doMock("../../src/lib/reader-facing-artifact-public-projection", () => ({
      loadReaderFacingArtifactPublicProjection: async () => ({
        byPathname: new Map([["/clusters/review-asset", {
          canonicalPath: "/clusters/review-asset",
          seo: { title: "Review asset", description: "Review copy" },
        }]]),
      }),
    }));

    const { generateMetadata } = await import("../../src/app/(site)/[section]/[slug]/page");
    const metadata = await generateMetadata({
      params: Promise.resolve({ section: "clusters", slug: "review-asset" }),
    });

    expect(metadata.robots).toEqual({ index: true, follow: true });
    expect(metadata.alternates?.canonical).toBe("https://itayfoyerstein.com/clusters/review-asset");
  });

  it("emits no route metadata when the artifact is absent from the fail-closed projection", async () => {
    vi.doMock("../../src/lib/reader-facing-artifact-public-projection", () => ({
      loadReaderFacingArtifactPublicProjection: async () => ({ byPathname: new Map() }),
    }));

    const { generateMetadata } = await import("../../src/app/(site)/[section]/[slug]/page");
    const metadata = await generateMetadata({
      params: Promise.resolve({ section: "clusters", slug: "invalid-canonical-asset" }),
    });

    expect(metadata).toEqual({});
  });
});
