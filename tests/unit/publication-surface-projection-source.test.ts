import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.resetModules();
  vi.doUnmock("../../src/lib/payload");
  vi.unstubAllEnvs();
});

describe("publication projection source loading", () => {
  it("resolves the configured Payload source in tests instead of bypassing it", async () => {
    vi.stubEnv("NODE_ENV", "test");
    const find = vi.fn(async ({ collection }: { collection: string }) => ({
      docs:
        collection === "cluster-pages"
          ? [
              {
                title: "Configured source review asset",
                slug: "configured-source-review-asset",
                excerpt: "A review asset loaded from the configured source.",
                content: "Reader-facing review content.",
                seoDescription: "A configured-source review asset.",
                status: "review",
              },
            ]
          : [],
      hasNextPage: false,
    }));
    const getServerPayload = vi.fn(async () => ({ find }));
    vi.doMock("../../src/lib/payload", () => ({ getServerPayload }));

    const { loadPublicationSurfaceProjection } = await import("../../src/lib/publication-surface-projection");
    const projection = await loadPublicationSurfaceProjection("https://itayfoyerstein.com");

    expect(getServerPayload).toHaveBeenCalledOnce();
    expect(projection.byPathname.has("/clusters/configured-source-review-asset")).toBe(true);
  });
});
