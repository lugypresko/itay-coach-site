import { describe, expect, it } from "vitest";

import { campaignPageCopy } from "../../src/lib/campaign-page-copy";
import { metadata as operatorsMetadata } from "../../src/app/(site)/campaigns/operators-memo/page";
import { metadata as fieldNotesMetadata } from "../../src/app/(site)/campaigns/field-notes/page";
import { metadata as leadershipOsMetadata } from "../../src/app/(site)/campaigns/leadership-os/page";

describe("campaign landing page content", () => {
  it("keeps the first three campaigns distinct and aligned with their CTA contracts", () => {
    expect(campaignPageCopy["operators-memo"].audience).toContain("CTO");
    expect(campaignPageCopy["operators-memo"].primaryCta).toBe(
      "Discuss coaching for your managers",
    );
    expect(campaignPageCopy["field-notes"].audience).toContain("manager");
    expect(campaignPageCopy["field-notes"].primaryCta).toBe("Book a fit call");
    expect(campaignPageCopy["leadership-os"].primaryCta).toBe(
      "Run the Leadership Dependency Assessment",
    );
  });

  it("marks acquisition pages noindex while preserving their campaign URLs", () => {
    for (const page of [operatorsMetadata, fieldNotesMetadata, leadershipOsMetadata]) {
      expect(page.robots).toEqual({ index: false, follow: false });
      expect(page.alternates?.canonical).toMatch(/^\/campaigns\/[a-z-]+$/);
    }
  });
});
