import { describe, expect, it } from "vitest";

import {
  campaignPageContracts,
  getCampaignPageContract,
} from "../../src/lib/campaign-pages";

describe("campaign page contracts", () => {
  it("defines five acquisition landing pages with distinct audiences and CTAs", () => {
    expect(campaignPageContracts.map((page) => page.slug)).toEqual([
      "operators-memo",
      "field-notes",
      "player-trap",
      "blueprint",
      "leadership-os",
    ]);

    expect(campaignPageContracts.map((page) => page.primaryCta)).toEqual([
      "Discuss coaching for your managers",
      "Book a fit call",
      "Take the Player Trap Diagnostic",
      "Discuss leadership support",
      "Run the Leadership Dependency Assessment",
    ]);
  });

  it("keeps campaign contracts separate from canonical authority destinations", () => {
    const canonicalPaths = new Set([
      "/technical-leadership-coaching",
      "/for-organizations",
    ]);

    for (const page of campaignPageContracts) {
      expect(page.pathname).toMatch(/^\/campaigns\/[a-z-]+$/);
      expect(page.discoverableInPrimaryNavigation).toBe(false);
      expect(canonicalPaths.has(page.pathname)).toBe(false);
    }
  });

  it("returns a contract by slug and rejects unknown campaigns", () => {
    expect(getCampaignPageContract("operators-memo")?.audience).toBe("sponsor");
    expect(getCampaignPageContract("field-notes")?.audience).toBe("individual");
    expect(getCampaignPageContract("leadership-os")?.audience).toBe("diagnostic");
    expect(getCampaignPageContract("missing-campaign")).toBeUndefined();
  });
});
