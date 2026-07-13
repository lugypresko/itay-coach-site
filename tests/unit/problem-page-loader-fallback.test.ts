import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.resetModules();
  vi.doUnmock("../../src/lib/payload");
  vi.unstubAllEnvs();
});

describe("Problem Page loader fallback", () => {
  it("fails closed in production when live Payload is unavailable", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const { loadProblemPage } = await import("../../src/lib/problem-pages");

    await expect(
      loadProblemPage("cto-becomes-the-bottleneck", "https://itayfoyerstein.com", {
        payload: {
          find: async () => {
            throw new Error("Payload unavailable");
          },
        },
        allowStaticFallback: false,
      }),
    ).resolves.toBeNull();
  });

  it("allows the explicit static catalog fallback in local and test environments", async () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.doMock("../../src/lib/payload", () => ({
      getServerPayload: async () => {
        throw new Error("Payload unavailable");
      },
    }));

    const { loadProblemPage } = await import("../../src/lib/problem-pages");
    const page = await loadProblemPage("cto-becomes-the-bottleneck", "https://itayfoyerstein.com");

    expect(page?.record.slug).toBe("cto-becomes-the-bottleneck");
  });
});
