// @vitest-environment happy-dom
import { describe, expect, it, vi } from "vitest";
import * as React from "react";
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { PushConversation } from "../../src/components/push-conversation";

Object.assign(globalThis, { React });
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

import {
  buildPlayerTrapDiagnosisCallUrl,
  buildPlayerTrapFollowUpEmail,
  buildPlayerTrapReport,
  buildPlayerTrapReportLabels,
  buildPlayerTrapRequestToTalkUrl,
  buildPlayerTrapReportUrl,
  buildPlayerTrapSubmissionData,
  getPlayerTrapFunnelCopy,
  getPlayerTrapQuestions,
  getPlayerTrapQuickChecks,
  localizePlayerTrapResult,
  normalizeUtmAttribution,
  playerTrapAuthorityCopy,
  playerTrapAuthorityCopyHebrew,
  playerTrapDiagnosticSigns,
  playerTrapEvolutionStages,
  playerTrapEvolutionStagesHebrew,
  playerTrapHeroCopy,
  playerTrapImpactChartPoints,
  playerTrapImpactChartPointsHebrew,
  playerTrapNurtureSequence,
  playerTrapQuickChecks,
  playerTrapQuickChecksHebrew,
  playerTrapQuestions,
  playerTrapQuestionsHebrew,
  scorePlayerTrap,
  validatePlayerTrapAnswers,
  isPlayerTrapReportTokenValid,
  isPlayerTrapReportWithinTtl,
} from "../../src/lib/player-trap";

describe("player trap conversion infrastructure", () => {
  it("builds a request-to-talk URL without the legacy booking route", () => {
    const url = buildPlayerTrapRequestToTalkUrl("abc123", "https://example.com");
    expect(url).toBe("https://example.com/contact?source=diagnostic&intent=request_to_talk");
    expect(url).not.toContain("abc123");
    expect(url).not.toContain("book-a-fit-call");
  });

  it("accepts only opaque UUID report tokens and enforces a finite TTL", () => {
    expect(isPlayerTrapReportTokenValid("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
    expect(isPlayerTrapReportTokenValid("manager@example.com")).toBe(false);
    const issued = "2026-09-01T00:00:00.000Z";
    expect(isPlayerTrapReportWithinTtl(issued, Date.parse("2026-09-15T00:00:00.000Z"))).toBe(true);
    expect(isPlayerTrapReportWithinTtl(issued, Date.parse("2026-10-15T00:00:00.000Z"))).toBe(false);
  });

  it("rejects incomplete or tampered diagnostic answers", () => {
    expect(validatePlayerTrapAnswers({})).toHaveLength(5);
    expect(
      validatePlayerTrapAnswers({
        final_reviewer: "made-up answer",
        delegation_rules: "Mostly implicit.",
        ai_review_load: "Constantly.",
        leadership_visibility: "Mostly invisible.",
        default_escalation: "Always.",
      }),
    ).toContain("final_reviewer");
  });

  it("defines the campaign surfaces and Hebrew equivalents", () => {
    const english = getPlayerTrapFunnelCopy("en");
    const hebrew = getPlayerTrapFunnelCopy("he");

    expect(playerTrapQuestions).toHaveLength(5);
    expect(playerTrapQuestionsHebrew).toHaveLength(5);
    expect(playerTrapNurtureSequence).toHaveLength(5);
    expect(playerTrapNurtureSequence[0].slug).toBe("diagnostic-report");

    expect(english.hero.headline).toBe("Build a team that moves without waiting for you.");
    expect(english.hero.cta).toBe("Bring one current case");
    expect(english.wrongFix.lines).toEqual([
      "You tried delegating more.",
      "You tried clearer priorities.",
      "You tried better 1:1s.",
      "You tried async updates.",
      "You tried being more available.",
      "You tried working longer.",
      "Some of it helped.",
      "But the dependency stayed.",
    ]);
    expect(english.reframe.lines).toEqual([
      "The problem is not that you're underperforming.",
      "The problem is that the operating model around you still treats you as the fastest path to progress.",
      "Your strength became the route.",
      "The route became the habit.",
      "The habit became the bottleneck.",
    ]);

    expect(hebrew.hero.headline).toBe("אם הכל עדיין עובר דרכך — אתה לא באמת מוביל סקייל.");
    expect(hebrew.hero.cta).toBe("קח את המבחן");
    expect(hebrew.direction).toBe("rtl");
    expect(hebrew.wrongFix.lines).toEqual([
      "ניסית להאציל יותר.",
      "ניסית לחדד סדרי עדיפויות.",
      "ניסית עוד 1:1.",
      "ניסית עדכונים אסינכרוניים.",
      "ניסית להיות יותר זמין.",
      "ניסית לעבוד עוד קצת כדי שזה יזוז.",
      "חלק מזה עזר.",
      "אבל התלות נשארה.",
    ]);
    expect(hebrew.reframe.lines).toEqual([
      "הבעיה היא לא שאתה לא מתפקד.",
      "הבעיה היא שהמערכת סביבך עדיין מתייחסת אליך כאל הדרך הכי מהירה להזיז דברים.",
      "החוזקה שלך הפכה לנתיב.",
      "הנתיב הפך להרגל.",
      "ההרגל הפך לצוואר בקבוק.",
    ]);
    expect(getPlayerTrapQuestions("he")[0].prompt).toBe("באיזו תדירות אנשים מחכים לאישור שלך?");
    expect(getPlayerTrapQuickChecks("he")).toEqual(playerTrapQuickChecksHebrew);
  });

  it("keeps the campaign framework, authority, and diagnostic contracts", () => {
    expect(playerTrapHeroCopy.headline).toBe("Build a team that moves without waiting for you.");
    expect(playerTrapHeroCopy.cta).toBe("Bring one current case");
    expect(playerTrapDiagnosticSigns.map((sign) => sign.title)).toEqual([
      "The team waits for you too often.",
      "You solve problems faster than the system can.",
      "Your workload grows with every promotion.",
      "Everyone values you. Not everyone sees you as the next-level leader.",
    ]);
    expect(playerTrapEvolutionStages.map((stage) => stage.title)).toEqual([
      "Star Player",
      "Captain",
      "System Builder",
      "Pre-Promoted Leader",
    ]);
    expect(playerTrapEvolutionStagesHebrew.map((stage) => stage.title)).toEqual([
      "Star Player",
      "Captain",
      "System Builder",
      "Pre-Promoted Leader",
    ]);
    expect(playerTrapQuickChecks).toHaveLength(5);
    expect(playerTrapImpactChartPoints.map((point) => point.stage)).toEqual([
      "Star Player",
      "Captain",
      "System Builder",
      "Pre-Promoted Leader",
    ]);
    expect(playerTrapImpactChartPointsHebrew.map((point) => point.stage)).toEqual([
      "Star Player",
      "Captain",
      "System Builder",
      "Pre-Promoted Leader",
    ]);
  });

  it("starts the rendered diagnostic when the CTA is clicked", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          view: {
            step: "incident",
            prompt: {
              title: "Bring one real leadership situation.",
              help: "Describe what happened.",
            },
            turns: [],
            incident: "",
            category: "unclear",
            contact: "offered",
            intent: null,
            route: null,
            reasons: [],
            requested: false,
            diagnosis: null,
          },
          localReview: true,
        }),
        { headers: { "Content-Type": "application/json" } },
      ),
    );
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(createElement(PushConversation));
      await Promise.resolve();
      await Promise.resolve();
    });

    const cta = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent === "Diagnose one situation",
    );
    expect(cta).toBeTruthy();
    expect((cta as HTMLButtonElement).disabled).toBe(false);

    await act(async () => {
      cta?.click();
    });

    expect(container.querySelector(".push-intro")).toBeNull();
    expect(container.querySelector("textarea#answer")).toBeTruthy();
    expect(container.querySelector("h1")?.textContent).toBe("Bring one real leadership situation.");

    root.unmount();
    container.remove();
    fetchMock.mockRestore();
  });

  it("builds language-aware submission records, localized results, and report labels", () => {
    const englishAnswers = {
      final_reviewer: "Almost always; the team waits on my approval.",
      delegation_rules: "Mostly implicit.",
      ai_review_load: "Constantly.",
      leadership_visibility: "Mostly invisible.",
      default_escalation: "Always.",
    } as const;
    const hebrewAnswers = {
      final_reviewer: "כמעט תמיד; הצוות מחכה לאישור שלי.",
      delegation_rules: "ברובם סמויים.",
      ai_review_load: "כל הזמן.",
      leadership_visibility: "ברובו נסתר.",
      default_escalation: "תמיד.",
    } as const;

    const englishResult = scorePlayerTrap(englishAnswers);
    const hebrewResult = scorePlayerTrap(hebrewAnswers, playerTrapQuestionsHebrew);
    const localizedHebrewResult = localizePlayerTrapResult(englishResult, "he");

    const submission = buildPlayerTrapSubmissionData({
      email: " Manager@Example.com ",
      name: "Manager",
      answers: englishAnswers,
      result: englishResult,
      reportToken: "abc123",
      reportUrl: "https://example.com/player-trap/report/abc123",
      diagnosisCallUrl: "https://example.com/api/player-trap/diagnosis-call?reportToken=abc123",
      pageLanguage: "he",
      contentConsentAccepted: true,
      cookiesConsentAccepted: true,
      utm: normalizeUtmAttribution({ utmCampaign: "hebrew-campaign" }),
      now: "2026-06-08T00:00:00.000Z",
    });

    expect(englishResult.tier).toBe("execution-bottleneck");
    expect(hebrewResult.tier).toBe("execution-bottleneck");
    expect(localizedHebrewResult.title).toBe("צוואר בקבוק תפעולי");
    expect(submission.email).toBe("manager@example.com");
    expect(submission.pageLanguage).toBe("he");
    expect(submission.resultProfile).toBe("execution-bottleneck");
    expect(submission.resultScore).toBe(englishResult.totalScore);
    expect(submission.contentConsentAccepted).toBe(true);
    expect(submission.cookiesConsentAccepted).toBe(true);
    expect(submission.consentAcceptedAt).toBe("2026-06-08T00:00:00.000Z");
    expect(submission.testCompletedAt).toBe("2026-06-08T00:00:00.000Z");
    expect(submission.reportRequestedAt).toBe("2026-06-08T00:00:00.000Z");
    expect(submission.utmCampaign).toBe("hebrew-campaign");

    const englishLabels = buildPlayerTrapReportLabels("en");
    const hebrewLabels = buildPlayerTrapReportLabels("he");
    expect(englishLabels.diagnosisCallCta).toBe("Request to talk with Itay");
    expect(englishLabels.diagnosisCallSupport).toContain("generic coaching call");
    expect(hebrewLabels.diagnosisCallCta).toBe("קבע שיחת אבחון Pre-Promoted");
    expect(hebrewLabels.diagnosisCallSupport).toContain("שיחת אבחון ממוקדת");
  });

  it("builds report and follow-up email copy with the expected URLs", () => {
    const result = scorePlayerTrap({
      final_reviewer: "Almost always; the team waits on my approval.",
      delegation_rules: "Mostly implicit.",
      ai_review_load: "Constantly.",
      leadership_visibility: "Mostly invisible.",
      default_escalation: "Always.",
    });

    const reportUrl = buildPlayerTrapReportUrl("abc123");
    const diagnosisCallUrl = buildPlayerTrapDiagnosisCallUrl("abc123");
    const report = buildPlayerTrapReport(result, {
      name: "Itay",
      reportUrl,
      diagnosisCallUrl,
    });
    const email = buildPlayerTrapFollowUpEmail(playerTrapNurtureSequence[0], {
      name: "Itay",
      email: "itay@example.com",
      reportUrl,
      diagnosisCallUrl,
      result,
    });

    expect(normalizeUtmAttribution({ utmSource: "  google  " }).utmSource).toBe("google");
    expect(report.text).toContain(reportUrl);
    expect(report.text).toContain(diagnosisCallUrl);
    expect(email.subject).toContain("Player Trap diagnostic report");
    expect(email.text).toContain(reportUrl);
  });
});
