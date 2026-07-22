import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import AboutPage from "../../src/app/(site)/about/page";
import CtoCoachPage from "../../src/app/(site)/cto-coach/page";
import EngineeringManagerCoachPage from "../../src/app/(site)/engineering-manager-coach/page";
import FaqPage from "../../src/app/(site)/faq/page";
import FromStarPlayerToStrategicLeaderPage from "../../src/app/(site)/from-star-player-to-strategic-leader/page";
import LeadershipCoachForEngineeringManagersPage from "../../src/app/(site)/leadership-coach-for-engineering-managers/page";
import StrategicLeadershipPage from "../../src/app/(site)/strategic-leadership/page";
import ThePushMethodologyPage from "../../src/app/(site)/the-push-methodology/page";
import WhyEngineeringManagersBecomeBottlenecksPage from "../../src/app/(site)/why-engineering-managers-become-bottlenecks/page";
import WhySmartManagersBurnOutPage from "../../src/app/(site)/why-smart-managers-burn-out/page";

describe("legacy static page rewrites", () => {
  it("renders the rewritten pages through PageBrief without visible metadata", () => {
    const aboutHtml = renderToStaticMarkup(<AboutPage />);
    const ctoHtml = renderToStaticMarkup(<CtoCoachPage />);
    const emHtml = renderToStaticMarkup(<EngineeringManagerCoachPage />);
    const faqHtml = renderToStaticMarkup(<FaqPage />);
    const strategicHtml = renderToStaticMarkup(<StrategicLeadershipPage />);
    const bottleneckHtml = renderToStaticMarkup(<WhyEngineeringManagersBecomeBottlenecksPage />);
    const starHtml = renderToStaticMarkup(<FromStarPlayerToStrategicLeaderPage />);
    const burnOutHtml = renderToStaticMarkup(<WhySmartManagersBurnOutPage />);
    const leadershipHtml = renderToStaticMarkup(<LeadershipCoachForEngineeringManagersPage />);
    const pushHtml = renderToStaticMarkup(<ThePushMethodologyPage />);

    for (const html of [aboutHtml, ctoHtml, emHtml, faqHtml, strategicHtml, bottleneckHtml, starHtml, burnOutHtml, leadershipHtml, pushHtml]) {
      expect(html).toContain("<h1>");
      expect(html).toContain("Audience pain");
      expect(html).toContain("Why Itay / The Push");
      expect(html).toContain("Book a fit call");
      expect(html).not.toContain("Query:");
      expect(html).not.toContain("Entity focus");
      expect(html).not.toContain("pageType");
      expect(html).not.toContain("template");
      expect(html).not.toContain("canonicalPath");
    }

    expect(aboutHtml).toContain("About Itay Foyerstein");
    expect(ctoHtml).toContain("CTO Coach");
    expect(emHtml).toContain("Engineering Manager Coach");
    expect(leadershipHtml).toContain("Leadership Coach for Engineering Managers");
    expect(pushHtml).toContain("The Push Methodology");
    expect(faqHtml).toContain("FAQ Hub");
    expect(faqHtml).toContain("<details");
    expect(faqHtml).toContain('href="#faq-section-');
    expect(faqHtml).not.toContain("](/");
    expect(strategicHtml).toContain("Strategic Leadership");
    expect(bottleneckHtml).toContain("Why Engineering Managers Become Bottlenecks");
    expect(starHtml).toContain("From Star Player to Strategic Leader");
    expect(burnOutHtml).toContain("Why Smart Managers Burn Out");
    expect(aboutHtml.indexOf("Audience pain")).toBeLessThan(aboutHtml.indexOf("Why Itay / The Push"));
    expect(ctoHtml.indexOf("Audience pain")).toBeLessThan(ctoHtml.indexOf("Why Itay / The Push"));
    expect(emHtml.indexOf("Audience pain")).toBeLessThan(emHtml.indexOf("Why Itay / The Push"));
    expect(strategicHtml.indexOf("Audience pain")).toBeLessThan(strategicHtml.indexOf("Why Itay / The Push"));
    expect(bottleneckHtml.indexOf("Audience pain")).toBeLessThan(bottleneckHtml.indexOf("Why Itay / The Push"));
    expect(starHtml.indexOf("Audience pain")).toBeLessThan(starHtml.indexOf("Why Itay / The Push"));
    expect(burnOutHtml.indexOf("Audience pain")).toBeLessThan(burnOutHtml.indexOf("Why Itay / The Push"));
    expect(leadershipHtml.indexOf("Audience pain")).toBeLessThan(leadershipHtml.indexOf("Why Itay / The Push"));
    expect(pushHtml.indexOf("Audience pain")).toBeLessThan(pushHtml.indexOf("Why Itay / The Push"));
    expect(faqHtml.indexOf("Audience pain")).toBeLessThan(faqHtml.indexOf("Why Itay / The Push"));
  });
});
