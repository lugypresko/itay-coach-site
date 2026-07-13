import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { aboutPageBrief, leadershipCoachingForTechLeadersPageBrief } from "../../src/lib/authority-launch-pages";
import { PageBriefLaunchPage } from "../../src/components/page-brief-launch-page";

describe("page brief launch page", () => {
  it("fails closed instead of rendering PageBrief/internal language publicly", () => {
    expect(() => renderToStaticMarkup(<PageBriefLaunchPage brief={leadershipCoachingForTechLeadersPageBrief} />)).toThrow();
  });

  it("does not treat proof blocks on a PageBrief as an approved public artifact", () => {
    expect(() => renderToStaticMarkup(<PageBriefLaunchPage brief={aboutPageBrief} />)).toThrow();
  });
});
