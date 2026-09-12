import { describe, expect, it } from "vitest";

import {
  authorityLaunchPages,
  buildAuthorityLaunchMetadata,
  getAuthorityLaunchPage,
  validateAuthorityLaunchPageConfig,
  validateAuthorityLaunchPagesManifest,
} from "../../src/lib/authority-launch-pages";

describe("authority launch pages", () => {
  it("keeps the launch pages recommendation-intent ready", () => {
    const pages = Object.values(authorityLaunchPages);

    expect(pages.length).toBeGreaterThanOrEqual(10);
    expect(pages.filter((page) => page.pageSource === "legacy_static_page").length).toBe(1);
    expect(pages.filter((page) => page.pageSource === "page_brief").length).toBe(11);

    for (const page of pages) {
      expect(page.pageSource === "legacy_static_page" || page.pageSource === "page_brief").toBe(true);
      expect(page.canonicalPath.startsWith("/")).toBe(true);
      expect(page.relatedLinks.length).toBeGreaterThanOrEqual(2);
      expect(page.targetQuestions.length).toBeGreaterThan(0);
      expect(page.shortAnswer.length).toBeGreaterThan(0);
    }

    expect(authorityLaunchPages.about.pageSource).toBe("page_brief");
    expect(authorityLaunchPages.engineeringManagerCoach.pageSource).toBe("page_brief");
    expect(authorityLaunchPages.ctoCoach.pageSource).toBe("page_brief");
    expect(authorityLaunchPages.leadershipCoachingForTechLeaders.pageSource).toBe("page_brief");
    expect(authorityLaunchPages.leadershipCoachForEngineeringManagers.pageSource).toBe("page_brief");
    expect(authorityLaunchPages.thePushMethodology.pageSource).toBe("page_brief");
    expect(authorityLaunchPages.faq.pageSource).toBe("page_brief");
    expect(authorityLaunchPages.strategicLeadership.pageSource).toBe("page_brief");
    expect(authorityLaunchPages.whyEngineeringManagersBecomeBottlenecks.pageSource).toBe("page_brief");
    expect(authorityLaunchPages.fromStarPlayerToStrategicLeader.pageSource).toBe("page_brief");
    expect(authorityLaunchPages.whySmartManagersBurnOut.pageSource).toBe("page_brief");
    expect(authorityLaunchPages.about.pageBrief?.canonicalPath).toBe("/about");
    expect(authorityLaunchPages.engineeringManagerCoach.pageBrief?.canonicalPath).toBe("/engineering-manager-coach");
    expect(authorityLaunchPages.ctoCoach.pageBrief?.canonicalPath).toBe("/cto-coach");
    expect(authorityLaunchPages.leadershipCoachingForTechLeaders.pageBrief?.title).toBe("Leadership Coaching for Tech Leaders");
    expect(authorityLaunchPages.leadershipCoachForEngineeringManagers.pageBrief?.canonicalPath).toBe("/leadership-coach-for-engineering-managers");
    expect(authorityLaunchPages.thePushMethodology.pageBrief?.canonicalPath).toBe("/the-push-methodology");
    expect(authorityLaunchPages.faq.pageBrief?.canonicalPath).toBe("/faq");
    expect(authorityLaunchPages.strategicLeadership.pageBrief?.canonicalPath).toBe("/strategic-leadership");
    expect(authorityLaunchPages.whyEngineeringManagersBecomeBottlenecks.pageBrief?.canonicalPath).toBe("/why-engineering-managers-become-bottlenecks");
    expect(authorityLaunchPages.fromStarPlayerToStrategicLeader.pageBrief?.canonicalPath).toBe("/from-star-player-to-strategic-leader");
    expect(authorityLaunchPages.whySmartManagersBurnOut.pageBrief?.canonicalPath).toBe("/why-smart-managers-burn-out");
    expect(authorityLaunchPages.contact.pageSource).toBe("legacy_static_page");
    expect(authorityLaunchPages.contact.title).toBe("Talk Through a Leadership Bottleneck");
    expect(authorityLaunchPages.contact.description).not.toMatch(/recommendation-intent|framework/i);
    expect(authorityLaunchPages.contact.relatedLinks).toHaveLength(3);
  });

  it("keeps the FAQ hub high-intent and dense enough", () => {
    expect(authorityLaunchPages.faq.faqEntries).toHaveLength(41);
    expect(authorityLaunchPages.faq.targetQuestions.length).toBeGreaterThanOrEqual(5);
  });

  it("lets only the FAQ launch page emit indexable robots metadata", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("SITE_URL", "https://itayfoyerstein.com");

    expect(buildAuthorityLaunchMetadata(getAuthorityLaunchPage("faq"))).toMatchObject({
      robots: { index: true, follow: true },
      alternates: { canonical: "https://itayfoyerstein.com/faq" },
    });
    expect(buildAuthorityLaunchMetadata(getAuthorityLaunchPage("about"))).toMatchObject({
      robots: { index: false, follow: false },
      alternates: { canonical: "https://itayfoyerstein.com/about" },
    });
    expect(buildAuthorityLaunchMetadata(getAuthorityLaunchPage("contact"))).toMatchObject({
      robots: { index: false, follow: false },
      alternates: { canonical: "https://itayfoyerstein.com/contact" },
    });
  });

  it("validates the launch manifest and rejects new landing pages without PageBrief", () => {
    expect(() => validateAuthorityLaunchPagesManifest()).not.toThrow();

    expect(() =>
      validateAuthorityLaunchPageConfig({
        ...authorityLaunchPages.leadershipCoachingForTechLeaders,
        pageSource: "page_brief",
        pageBrief: undefined,
      } as never),
    ).toThrow(/PageBrief/);

    expect(() =>
      validateAuthorityLaunchPageConfig({
        ...authorityLaunchPages.leadershipCoachingForTechLeaders,
        pageSource: "inferred_static_page",
        pageBrief: undefined,
      } as never),
    ).toThrow(/page source marker|PageBrief path/);
  });
});
