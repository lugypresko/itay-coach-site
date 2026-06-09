import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import {
  buildPlayerTrapDiagnosisCallUrl,
  buildPlayerTrapFollowUpEmail,
  buildPlayerTrapReport,
  buildPlayerTrapReportLabels,
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
} from "../../src/lib/player-trap";

describe("player trap conversion infrastructure", () => {
  it("defines the campaign surfaces and Hebrew equivalents", () => {
    const english = getPlayerTrapFunnelCopy("en");
    const hebrew = getPlayerTrapFunnelCopy("he");

    expect(playerTrapQuestions).toHaveLength(5);
    expect(playerTrapQuestionsHebrew).toHaveLength(5);
    expect(playerTrapNurtureSequence).toHaveLength(5);
    expect(playerTrapNurtureSequence[0].slug).toBe("diagnostic-report");

    expect(english.hero.headline).toBe("Build a team that moves without waiting for you.");
    expect(english.hero.cta).toBe("Take the 3-Minute Test");
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
    expect(playerTrapHeroCopy.cta).toBe("Take the 3-Minute Test");
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
    expect(playerTrapAuthorityCopy.headline).toContain("120+ managers");
    expect(playerTrapAuthorityCopyHebrew.headline).toContain("120+");
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

  it("renders separate English and Hebrew campaign surfaces", () => {
    const page = readFileSync(new URL("../../src/app/(site)/player-trap/page.tsx", import.meta.url), "utf8");
    const hebrewPage = readFileSync(new URL("../../src/app/(site)/player-trap-he/page.tsx", import.meta.url), "utf8");
    const reportPage = readFileSync(
      new URL("../../src/app/(site)/player-trap/report/[token]/page.tsx", import.meta.url),
      "utf8",
    );
    const client = readFileSync(
      new URL("../../src/app/(site)/player-trap/player-trap-assessment-client.tsx", import.meta.url),
      "utf8",
    );
    const componentsCss = readFileSync(new URL("../../src/styles/components.css", import.meta.url), "utf8");

    expect(page).toContain('className="content-shell player-trap-shell"');
    expect(page).toContain('getPlayerTrapFunnelCopy("en")');
    expect(page).toContain('pageLanguage="en"');
    expect(page).toContain('href="#player-trap-self-check"');
    expect(page).toContain('id="player-trap-framework"');

    expect(hebrewPage).toContain('dir="rtl"');
    expect(hebrewPage).toContain('getPlayerTrapFunnelCopy("he")');
    expect(hebrewPage).toContain('pageLanguage="he"');
    expect(hebrewPage).toContain('getPlayerTrapQuestions("he")');
    expect(hebrewPage).toContain('playerTrapAuthorityCopyHebrew');
    expect(hebrewPage).toContain('playerTrapImpactChartPointsHebrew');

    expect(reportPage).toContain("diagnosisCallSupport");
    expect(reportPage).toContain("labels.primaryCta");
    expect(reportPage).toContain('lang={pageLanguage}');
    expect(reportPage).toContain('dir={pageLanguage === "he" ? "rtl" : "ltr"}');

    expect(client).toContain('fetch("/api/player-trap/lead"');
    expect(client).toContain("questions.every");
    expect(client).toContain("answers: buildAnswerRecord(answers, questions)");
    expect(client).toContain("pageLanguage");
    expect(client).toContain("consentAccepted");
    expect(client).toContain("contentConsentAccepted");
    expect(client).toContain("cookiesConsentAccepted");
    expect(client).toContain("copy.resultGateTitle");
    expect(client).toContain("function LeadCaptureForm");
    expect(client).toContain("disabled || status === \"submitting\"");
    expect(client).not.toContain("quickChecks.map");

    expect(componentsCss).toContain(".player-trap-shell");
    expect(componentsCss).toContain(".form-consent");
    expect(componentsCss).toContain("--color-bg: #0b0b0b");
    expect(componentsCss).toContain("--color-accent: #d4af37");
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
    expect(englishLabels.diagnosisCallCta).toBe("Book a Pre-Promoted Diagnosis Call");
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
