import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.resetModules();
  vi.doUnmock("../../src/lib/payload");
  vi.unstubAllEnvs();
});

describe("public content loader fallback", () => {
  it("uses a static canonical fallback when Payload has a non-renderable target record", async () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.doMock("../../src/lib/payload", () => ({
      getServerPayload: async () => ({
        find: async () => ({
          docs: [
            {
              slug: "player-trap",
              status: "draft",
              publishedAt: null,
            },
          ],
        }),
      }),
    }));

    const { loadPublishedPublicContent } = await import("../../src/lib/public-content-loader");

    const page = await loadPublishedPublicContent("frameworks", "player-trap", "https://itayfoyerstein.com");

    expect(page?.pathname).toBe("/frameworks/player-trap");
    expect(page?.record.status).toBe("published");
    expect(page?.record.seoTitle).toBe("Player Trap Framework for Technical Leaders | The Push");
  });

  it("fails closed in production when live Payload is unavailable", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.doMock("../../src/lib/payload", () => ({
      getServerPayload: async () => {
        throw new Error("Payload unavailable");
      },
    }));
    const { loadPublishedPublicContent } = await import("../../src/lib/public-content-loader");

    await expect(
      loadPublishedPublicContent("frameworks", "player-trap", "https://itayfoyerstein.com", {
        payload: {
          find: async () => {
            throw new Error("Payload unavailable");
          },
        },
        allowStaticFallback: false,
      }),
    ).resolves.toBeNull();
  });
});
