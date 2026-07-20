import { describe, expect, it } from "vitest";

import { campaignPageCopy } from "../../src/lib/campaign-page-copy";

const blockedClaims = ["73%", "41%", "2.5x", "tested in production", "clients include"];

describe("campaign evidence gate", () => {
  it("does not expose unsupported proof claims in public campaign copy", () => {
    const copy = JSON.stringify(campaignPageCopy).toLowerCase();
    for (const claim of blockedClaims) {
      expect(copy).not.toContain(claim.toLowerCase());
    }
  });

  it("keeps framework positioning separate from outcome proof", () => {
    expect(JSON.stringify(campaignPageCopy)).toContain("informational, not a psychological evaluation");
    expect(JSON.stringify(campaignPageCopy)).toContain("The assessment is informational");
  });
});
