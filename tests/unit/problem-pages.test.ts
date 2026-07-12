import { describe, expect, it } from "vitest";

import { getProblemPageCatalogEntry, getProblemPagePathnames, getProblemPagesForSurface } from "../../src/lib/problem-pages";

describe("problem pages", () => {
  it("exposes ten draft problem page routes", () => {
    const pathnames = getProblemPagePathnames();

    expect(pathnames).toHaveLength(10);
    expect(pathnames).toContain("/problems/cto-becomes-the-bottleneck");
    expect(pathnames).toContain("/problems/good-managers-burning-out-quietly");
  });

  it("maps problem pages back to framework and cluster surfaces", () => {
    const pages = getProblemPagesForSurface("/frameworks/invisible-executor");

    expect(pages.length).toBeGreaterThan(0);
    expect(pages.some((page) => page.slug === "cto-becomes-the-bottleneck")).toBe(true);
    expect(pages.some((page) => page.slug === "good-managers-burning-out-quietly")).toBe(true);
  });

  it("keeps the catalog entries explicit and draft-only", () => {
    const page = getProblemPageCatalogEntry("product-engineering-misalignment");

    expect(page?.status).toBe("draft");
    expect(page?.primaryCTA.href).toBe("/book-a-fit-call");
    expect(page?.relatedFrameworks.length).toBeGreaterThan(0);
  });
});

