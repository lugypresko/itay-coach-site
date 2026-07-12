import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.resetModules();
  vi.doUnmock("../../src/lib/payload");
});

describe("public content loader fallback", () => {
  it("uses a static canonical fallback when Payload has a non-renderable target record", async () => {
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
});
