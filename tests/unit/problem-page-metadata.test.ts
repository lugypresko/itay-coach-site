import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.resetModules();
  vi.unstubAllEnvs();
  vi.doUnmock("../../src/lib/problem-pages");
});

describe("problem page route metadata", () => {
  it("derives indexable robots and canonical metadata from the problem loader", async () => {
    vi.stubEnv("SITE_URL", "https://itayfoyerstein.com");
    vi.doMock("../../src/lib/problem-pages", () => ({
      loadProblemPage: async () => ({
        canonicalUrl: "https://itayfoyerstein.com/problems/cto-becomes-the-bottleneck",
        publicationDecision: { indexable: true },
        record: { seoTitle: "CTO Becomes the Bottleneck | The Push", seoDescription: "Problem copy" },
      }),
    }));

    const { generateMetadata } = await import("../../src/app/(site)/problems/[slug]/page");
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "cto-becomes-the-bottleneck" }),
    });

    expect(metadata.robots).toEqual({ index: true, follow: true });
    expect(metadata.alternates?.canonical).toBe("https://itayfoyerstein.com/problems/cto-becomes-the-bottleneck");
  });

  it("emits no route metadata when the problem loader returns no page", async () => {
    vi.doMock("../../src/lib/problem-pages", () => ({
      loadProblemPage: async () => null,
    }));

    const { generateMetadata } = await import("../../src/app/(site)/problems/[slug]/page");
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "missing-problem" }),
    });

    expect(metadata).toEqual({});
  });
});