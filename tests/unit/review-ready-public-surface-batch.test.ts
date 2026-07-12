import { describe, expect, it } from "vitest";

import { getPublicAuthorityAssetPathnames } from "../../src/lib/public-authority-routes";
import { reviewReadyPublicSurfaceBatchAssets } from "../../src/seed/review-ready-public-surface-batch";

describe("review-ready public surface batch", () => {
  it("contains the three create-next public surfaces", () => {
    expect(reviewReadyPublicSurfaceBatchAssets).toHaveLength(3);

    const slugs = reviewReadyPublicSurfaceBatchAssets.map((asset) => asset.payloadData.slug);

    expect(slugs).toContain("coach-for-engineering-managers-stuck-as-the-bottleneck");
    expect(slugs).toContain("invisible-executor");
    expect(slugs).toContain("engineering-manager-coach-for-strategic-leadership");
  });

  it("keeps all assets in review status", () => {
    expect(reviewReadyPublicSurfaceBatchAssets.every((asset) => asset.payloadData.status === "review")).toBe(true);
  });

  it("exposes the routes for sitemap and build discovery", () => {
    const pathnames = getPublicAuthorityAssetPathnames({ includeDrafts: true });

    expect(pathnames).toContain("/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck");
    expect(pathnames).toContain("/frameworks/invisible-executor");
    expect(pathnames).toContain("/clusters/engineering-manager-coach-for-strategic-leadership");
  });
});
