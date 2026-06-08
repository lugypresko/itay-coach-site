import { describe, expect, it } from "vitest";

import {
  authorityBaselinePlatforms,
  authorityBaselineQueryDefinitions,
  buildAuthorityBaselineReport,
  buildAuthorityGapReport,
} from "../../src/ai/monitoring/authority-baseline";

describe("authority baseline reports", () => {
  it("tracks the top 20 queries across the four target platforms", () => {
    expect(authorityBaselineQueryDefinitions).toHaveLength(20);
    expect(authorityBaselinePlatforms).toEqual(["ChatGPT", "Perplexity", "Claude", "Google AI Overviews"]);
  });

  it("builds a baseline report with manual capture workflow guidance", () => {
    const report = buildAuthorityBaselineReport("2026-06-08");

    expect(report).toContain("# Authority Baseline Report");
    expect(report).toContain("tracked_queries: 20");
    expect(report).toContain("capture_slots: 80");
    expect(report).toContain("Manual capture workflow");
    expect(report).toContain("pending manual capture");
  });

  it("builds a gap report that identifies the current measurement gaps", () => {
    const report = buildAuthorityGapReport("2026-06-08");

    expect(report).toContain("# Authority Gaps Report");
    expect(report).toContain("tracked_queries: 20");
    expect(report).toContain("Authority gaps identified");
    expect(report).toContain("Freshness gap");
  });
});
