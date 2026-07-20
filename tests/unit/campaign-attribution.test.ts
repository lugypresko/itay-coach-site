import { describe, expect, it } from "vitest";

import {
  buildCampaignAttribution,
  buildCampaignDestination,
  type CampaignAttributionInput,
} from "../../src/lib/campaign-attribution";

const input: CampaignAttributionInput = {
  search: "?utm_source=linkedin&utm_medium=paid-social&utm_campaign=message-fit&utm_content=operators-memo&utm_term=cto",
  landingPath: "/campaigns/operators-memo",
  lpConcept: "operators-memo",
  audience: "sponsor",
  ctaId: "campaign-primary",
};

describe("campaign attribution", () => {
  it("captures standard UTM fields and campaign context", () => {
    expect(buildCampaignAttribution(input)).toEqual({
      utm_source: "linkedin",
      utm_medium: "paid-social",
      utm_campaign: "message-fit",
      utm_content: "operators-memo",
      utm_term: "cto",
      lp_concept: "operators-memo",
      audience: "sponsor",
      cta_id: "campaign-primary",
      landing_path: "/campaigns/operators-memo",
    });
  });

  it("preserves attribution when a CTA moves to the next route", () => {
    expect(buildCampaignDestination("/for-organizations", input)).toBe(
      "/for-organizations?utm_source=linkedin&utm_medium=paid-social&utm_campaign=message-fit&utm_content=operators-memo&utm_term=cto&lp_concept=operators-memo&audience=sponsor&cta_id=campaign-primary&landing_path=%2Fcampaigns%2Foperators-memo",
    );
  });
});
