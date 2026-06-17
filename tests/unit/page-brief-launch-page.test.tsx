import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { aboutPageBrief, leadershipCoachingForTechLeadersPageBrief } from "../../src/lib/authority-launch-pages";
import { PageBriefLaunchPage } from "../../src/components/page-brief-launch-page";

describe("page brief launch page", () => {
  it("renders a human-first recommendation page without query metadata", () => {
    const html = renderToStaticMarkup(<PageBriefLaunchPage brief={leadershipCoachingForTechLeadersPageBrief} />);

    expect(html).toContain("<h1>Leadership Coaching for Tech Leaders</h1>");
    expect(html).toContain("The leader is still carrying too much execution load.");
    expect(html).toContain("Audience pain");
    expect(html).toContain("Why Itay / The Push");
    expect(html).toContain("Book a fit call");
    expect(html).not.toContain("Query:");
    expect(html).not.toContain("Entity focus");
    expect(html).not.toContain("pageType");
    expect(html).not.toContain("template");
    expect(html).not.toContain("canonicalPath");
    expect(html.indexOf("Audience pain")).toBeLessThan(html.indexOf("Why Itay / The Push"));
  });

  it("renders proof-backed trust blocks for customer-path briefs", () => {
    const html = renderToStaticMarkup(<PageBriefLaunchPage brief={aboutPageBrief} />);

    expect(html).toContain("Proof-backed trust");
    expect(html).toContain(
      "Itay Foyerstein is a Tech Leadership Coach focused on helping technical leaders move from execution mode into strategic leadership.",
    );
    expect(html).toContain(
      "The Push is the methodology layer that gives Itay's coaching a stable public label and keeps the framework stack consistent across the graph.",
    );
  });
});
