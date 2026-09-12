import { getSiteUrl } from "./site-url";

export type PlayerTrapQuestionId =
  | "final_reviewer"
  | "delegation_rules"
  | "ai_review_load"
  | "leadership_visibility"
  | "default_escalation";

export type PlayerTrapTier = "trusted-operator" | "invisible-executor" | "execution-bottleneck";
export type PlayerTrapLanguage = "en" | "he";

const PLAYER_TRAP_MAX_TEXT_LENGTH = 500;

export interface PlayerTrapChoice {
  label: string;
  score: number;
}

export interface PlayerTrapQuestion {
  id: PlayerTrapQuestionId;
  prompt: string;
  help: string;
  choices: PlayerTrapChoice[];
}

/** Validate that a submission contains exactly the answer values offered by the selected language. */
export function validatePlayerTrapAnswers(
  answers: Partial<Record<PlayerTrapQuestionId, string>>,
  questions: PlayerTrapQuestion[] = playerTrapQuestions,
): string[] {
  const errors: string[] = [];
  for (const question of questions) {
    const answer = answers[question.id];
    if (!answer || !question.choices.some((choice) => choice.label === answer)) {
      errors.push(question.id);
    } else if (answer.length > PLAYER_TRAP_MAX_TEXT_LENGTH) {
      errors.push(question.id);
    }
  }
  return errors;
}

export interface PlayerTrapResult {
  totalScore: number;
  maxScore: number;
  tier: PlayerTrapTier;
  title: string;
  summary: string;
  diagnosis: string;
  primaryCTA: string;
  secondaryCTA: string;
  nextStep: string;
}

export interface PlayerTrapEmailTemplate {
  dayOffset: number;
  slug: string;
  subject: string;
  previewText: string;
  body: string;
}

export interface PlayerTrapSubmissionContext {
  name?: string;
  email: string;
  reportUrl: string;
  diagnosisCallUrl: string;
  result: PlayerTrapResult;
}

export interface PlayerTrapUtmAttribution {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
}

export interface PlayerTrapSubmissionRecord {
  name?: string;
  email: string;
  reportToken: string;
  reportUrl: string;
  diagnosisCallUrl: string;
  assessmentScore: number;
  assessmentTier: PlayerTrapTier;
  assessmentResult: string;
  assessmentAnswers: string;
  pageLanguage: PlayerTrapLanguage;
  resultProfile: PlayerTrapTier;
  resultScore: number;
  contentConsentAccepted: boolean;
  cookiesConsentAccepted: boolean;
  consentAcceptedAt: string;
  lifecycleStage: string;
  leadSource: string;
  source: string;
  tags: Array<{ value: string }>;
  status: "subscribed";
  reportedAt: string;
  reportViewedAt?: string;
  reportRequestedAt?: string;
  diagnosisCallRequestedAt?: string;
  testCompletedAt?: string;
  nurtureSequenceKey: string;
  nurtureStep: number;
  nurtureLastEmailSlug: string;
  nurtureLastEmailSentAt: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
}

export interface PlayerTrapFunnelCopy {
  language: PlayerTrapLanguage;
  direction: "ltr" | "rtl";
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    description: string;
    cta: string;
    secondaryCta: string;
    microcopy: string;
  };
  dailyScenes: {
    label: string;
    headline: string;
    scenes: string[];
  };
  wrongFix: {
    label: string;
    headline: string;
    lines: string[];
  };
  reframe: {
    label: string;
    headline: string;
    lines: string[];
  };
  pattern: {
    label: string;
    headline: string;
    body: string;
  };
  framework: {
    label: string;
    headline: string;
    body: string;
  };
  chart: {
    label: string;
    headline: string;
  };
  assessment: PlayerTrapAssessmentCopy;
}

export interface PlayerTrapAssessmentCopy {
  quickLabel: string;
  quickIntro: string;
  alert: string;
  noAlert: string;
  resultLabel: string;
  resultPromptTitle: string;
  resultPromptBody: string;
  fullAssessmentLabel: string;
  fullAssessmentIntro: string;
  formMeta: string;
  utmSourceLabel: string;
  submitIdle: string;
  submitSubmitting: string;
  nameLabel: string;
  emailLabel: string;
  consentLabel: string;
  consentError: string;
  resultGateTitle: string;
  resultGateBody: string;
  yesLabel: string;
  noLabel: string;
  scoreLabel: string;
  scoreConnector: string;
  diagnosisLabel: string;
  nextStepLabel: string;
}

export interface PlayerTrapReportLabels {
  eyebrow: string;
  score: string;
  scoreConnector: string;
  diagnosis: string;
  nextStep: string;
  primaryCta: string;
  diagnosisCallCta: string;
  diagnosisCallSupport: string;
  scorecardCta: string;
  reportRequested: string;
  leadEmail: string;
  diagnosisCallTracked: string;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function normalizePlayerTrapLanguage(value?: string | null): PlayerTrapLanguage {
  return value === "he" ? "he" : "en";
}

const englishAssessmentCopy: PlayerTrapAssessmentCopy = {
  quickLabel: "3-minute diagnostic",
  quickIntro: "Answer five questions to see whether dependency is being built around you.",
  alert: "You may be the strongest operator in the room while the organization still needs a system builder.",
  noAlert: "If these scenes feel familiar, the full diagnostic will show where dependency is forming.",
  resultLabel: "Result",
  resultPromptTitle: "Finish the 5 questions to unlock your result.",
  resultPromptBody:
    "After the questions, leave your first name and email, confirm consent, and get the diagnostic report.",
  fullAssessmentLabel: "Unlock the result",
  fullAssessmentIntro: "Five questions. Then your name, email, and consent so we can send the result.",
  formMeta: "Free diagnostic. No spam. Built for tech managers.",
  utmSourceLabel: "UTM source",
  submitIdle: "Get My Result",
  submitSubmitting: "Preparing your report",
  nameLabel: "First name",
  emailLabel: "Email",
  consentLabel: "I agree to receive content from Itay Foyerstein / The Push and accept cookies for this diagnostic flow.",
  consentError: "Please confirm consent to receive your result.",
  resultGateTitle: "Your result is ready.",
  resultGateBody: "Leave your first name and email, confirm consent, and we will send the report.",
  yesLabel: "Yes",
  noLabel: "No",
  scoreLabel: "Score",
  scoreConnector: "of",
  diagnosisLabel: "Diagnosis",
  nextStepLabel: "Next step",
};

const hebrewAssessmentCopy: PlayerTrapAssessmentCopy = {
  quickLabel: "אבחון של 3 דקות",
  quickIntro: "ענו על חמש שאלות כדי לראות אם התלות עדיין נבנית סביבך.",
  alert: "יכול להיות שאתה המוציא לפועל הכי חזק בחדר, אבל הארגון עדיין צריך בונה מערכת.",
  noAlert: "אם הסצנות האלה נשמעות מוכרות, האבחון המלא יראה איפה התלות נבנית.",
  resultLabel: "תוצאה",
  resultPromptTitle: "סיימו את 5 השאלות כדי לפתוח את התוצאה.",
  resultPromptBody: "אחרי השאלות, השאירו שם פרטי ואימייל, אשרו הסכמה, וקבלו את דוח האבחון.",
  fullAssessmentLabel: "פתיחת התוצאה",
  fullAssessmentIntro: "חמש שאלות. ואז שם פרטי, אימייל והסכמה כדי שנוכל לשלוח את התוצאה.",
  formMeta: "אבחון חינמי. בלי ספאם. בנוי למנהלים טכנולוגיים.",
  utmSourceLabel: "מקור UTM",
  submitIdle: "קבלו את התוצאה",
  submitSubmitting: "מכין את הדוח שלך",
  nameLabel: "שם פרטי",
  emailLabel: "אימייל",
  consentLabel: "אני מסכים/ה לקבל תכנים מ-Itay Foyerstein / The Push ולאשר עוגיות עבור תהליך האבחון הזה.",
  consentError: "יש לאשר הסכמה כדי לקבל את התוצאה.",
  resultGateTitle: "התוצאה שלך מוכנה.",
  resultGateBody: "השאירו שם פרטי ואימייל, אשרו הסכמה, ואנחנו נשלח את הדוח.",
  yesLabel: "כן",
  noLabel: "לא",
  scoreLabel: "ניקוד",
  scoreConnector: "מתוך",
  diagnosisLabel: "אבחון",
  nextStepLabel: "צעד הבא",
};

export const playerTrapQuestions: PlayerTrapQuestion[] = [
  {
    id: "final_reviewer",
    prompt: "How often do you become the final reviewer for engineering decisions?",
    help: "This captures whether work waits on your approval instead of moving through a clear decision model.",
    choices: [
      { label: "Rarely; decisions stay distributed.", score: 0 },
      { label: "Sometimes; only a few items escalate.", score: 1 },
      { label: "Often; important choices keep landing on me.", score: 2 },
      { label: "Almost always; the team waits on my approval.", score: 3 },
    ],
  },
  {
    id: "delegation_rules",
    prompt: "How explicit are your delegation boundaries and decision rules?",
    help: "This shows whether the team can act without repeatedly asking for permission.",
    choices: [
      { label: "Written and used consistently.", score: 0 },
      { label: "Mostly clear, with occasional exceptions.", score: 1 },
      { label: "Known by a few people, not the whole team.", score: 2 },
      { label: "Mostly implicit.", score: 3 },
    ],
  },
  {
    id: "ai_review_load",
    prompt: "How often do AI-generated reviews or suggestions create extra review load for you?",
    help: "This measures whether AI-assisted work is adding to your approval queue instead of reducing it.",
    choices: [
      { label: "Rarely.", score: 0 },
      { label: "Sometimes.", score: 1 },
      { label: "Often.", score: 2 },
      { label: "Constantly.", score: 3 },
    ],
  },
  {
    id: "leadership_visibility",
    prompt: "How visible is your leadership model to your team?",
    help: "If the team cannot see the model, they cannot repeat it without you.",
    choices: [
      { label: "Very visible and documented.", score: 0 },
      { label: "Mostly visible.", score: 1 },
      { label: "Partly visible.", score: 2 },
      { label: "Mostly invisible.", score: 3 },
    ],
  },
  {
    id: "default_escalation",
    prompt: "How often are you the default escalation path when work gets stuck?",
    help: "This isolates whether the team escalates because the operating model is unclear.",
    choices: [
      { label: "Rarely.", score: 0 },
      { label: "Sometimes.", score: 1 },
      { label: "Often.", score: 2 },
      { label: "Always.", score: 3 },
    ],
  },
];

export const playerTrapQuestionsHebrew: PlayerTrapQuestion[] = [
  {
    id: "final_reviewer",
    prompt: "באיזו תדירות אנשים מחכים לאישור שלך?",
    help: "בודק אם עבודה נתקעת כי מסלול האישור עדיין מסתיים אצלך.",
    choices: [
      { label: "כמעט אף פעם; ההחלטות מפוזרות בצוות.", score: 0 },
      { label: "לפעמים; רק כמה דברים מגיעים אליי.", score: 1 },
      { label: "לעיתים קרובות; החלטות חשובות נוחתות אצלי.", score: 2 },
      { label: "כמעט תמיד; הצוות מחכה לאישור שלי.", score: 3 },
    ],
  },
  {
    id: "delegation_rules",
    prompt: "עד כמה כללי האצלה והחלטה אצלך ברורים?",
    help: "בודק אם הצוות יכול לפעול בלי לבקש ממך שוב ושוב אישור.",
    choices: [
      { label: "כתובים ומשתמשים בהם באופן עקבי.", score: 0 },
      { label: "ברורים ברובם, עם חריגים מדי פעם.", score: 1 },
      { label: "מוכרים לכמה אנשים, לא לכל הצוות.", score: 2 },
      { label: "ברובם סמויים.", score: 3 },
    ],
  },
  {
    id: "ai_review_load",
    prompt: "עד כמה בדיקות או המלצות של AI מוסיפות לך עומס בדיקה?",
    help: "בודק אם עבודה בעזרת AI מוסיפה עוד תור אישורים במקום להוריד עומס.",
    choices: [
      { label: "כמעט אף פעם.", score: 0 },
      { label: "לפעמים.", score: 1 },
      { label: "לעיתים קרובות.", score: 2 },
      { label: "כל הזמן.", score: 3 },
    ],
  },
  {
    id: "leadership_visibility",
    prompt: "עד כמה מודל ההובלה שלך גלוי לצוות?",
    help: "אם הצוות לא רואה את המודל, הוא לא יכול לשחזר אותו בלעדיך.",
    choices: [
      { label: "גלוי ומסודר מאוד.", score: 0 },
      { label: "גלוי ברובו.", score: 1 },
      { label: "גלוי חלקית.", score: 2 },
      { label: "ברובו נסתר.", score: 3 },
    ],
  },
  {
    id: "default_escalation",
    prompt: "עד כמה אתה מסלול ההסלמה ברירת המחדל כשעבודה נתקעת?",
    help: "בודק אם הצוות מסלים כי מודל ההפעלה לא מספיק ברור.",
    choices: [
      { label: "כמעט אף פעם.", score: 0 },
      { label: "לפעמים.", score: 1 },
      { label: "לעיתים קרובות.", score: 2 },
      { label: "תמיד.", score: 3 },
    ],
  },
];

const playerTrapFunnelCopy: Record<PlayerTrapLanguage, PlayerTrapFunnelCopy> = {
  en: {
    language: "en",
    direction: "ltr",
    hero: {
      eyebrow: "Player Trap diagnostic",
      headline: "Build a team that moves without waiting for you.",
      subheadline: "See whether your operating model still routes too many decisions through you.",
      description:
        "A 3-minute diagnostic for tech managers who want less dependency, clearer ownership, and more room to lead at the next level.",
      cta: "Take the 3-Minute Test",
      secondaryCta: "See the dependency pattern",
      microcopy: "3 minutes. For tech managers. No fluff.",
    },
    dailyScenes: {
      label: "Daily dependency scenes",
      headline: "The day looks productive. The dependency keeps growing.",
      scenes: [
        "A quick approval still blocks work that should already be moving.",
        "Escalations skip the system and land directly with you.",
        "AI-assisted output creates another review queue instead of reducing load.",
        "The team can move fast, but only after checking what you think.",
      ],
    },
    wrongFix: {
      label: "What you already tried",
      headline: "You worked on the symptoms. The dependency stayed.",
      lines: [
        "You tried delegating more.",
        "You tried clearer priorities.",
        "You tried better 1:1s.",
        "You tried async updates.",
        "You tried being more available.",
        "You tried working longer.",
        "Some of it helped.",
        "But the dependency stayed.",
      ],
    },
    reframe: {
      label: "The reframe",
      headline: "The issue is not effort. It is the route work takes.",
      lines: [
        "The problem is not that you're underperforming.",
        "The problem is that the operating model around you still treats you as the fastest path to progress.",
        "Your strength became the route.",
        "The route became the habit.",
        "The habit became the bottleneck.",
      ],
    },
    pattern: {
      label: "Name the pattern",
      headline: "This is The Player Trap.",
      body:
        "The Player Trap happens when the manager's strongest execution habits become the team's default path for decisions, escalations, and progress.",
    },
    framework: {
      label: "Leadership evolution",
      headline: "The Evolution of a Tech Leader",
      body:
        "The next level is not more personal throughput. It is a visible operating model the team can use without waiting for you.",
    },
    chart: {
      label: "Impact vs involvement",
      headline: "Where are you operating today?",
    },
    assessment: englishAssessmentCopy,
  },
  he: {
    language: "he",
    direction: "rtl",
    hero: {
      eyebrow: "אבחון מלכודת השחקן",
      headline: "אם הכל עדיין עובר דרכך — אתה לא באמת מוביל סקייל.",
      subheadline: "בדיקה קצרה לראות אם המערכת סביבך עדיין תלויה בך כדי לזוז מהר.",
      description:
        "אבחון של 3 דקות למנהלים טכנולוגיים שרוצים פחות תלות, יותר בעלות, ויותר מרחב להוביל ברמה הבאה.",
      cta: "קח את המבחן",
      secondaryCta: "ראה את דפוס התלות",
      microcopy: "3 דקות. למנהלים טכנולוגיים. בלי בולשיט.",
    },
    dailyScenes: {
      label: "סצנות תלות יומיומיות",
      headline: "היום נראה תפוס. התלות רק ממשיכה לגדול.",
      scenes: [
        "אישור קטן אחד עדיין עוצר עבודה שכבר הייתה אמורה לזוז.",
        "הסלמות עוקפות את המערכת ונוחתות ישר עליך.",
        "פלט AI יוצר עוד תור בדיקה במקום להוריד עומס.",
        "הצוות זז מהר רק אחרי שהוא בודק מה אתה חושב.",
      ],
    },
    wrongFix: {
      label: "מה כבר ניסית",
      headline: "ניסית לטפל בתסמינים. התלות נשארה.",
      lines: [
        "ניסית להאציל יותר.",
        "ניסית לחדד סדרי עדיפויות.",
        "ניסית עוד 1:1.",
        "ניסית עדכונים אסינכרוניים.",
        "ניסית להיות יותר זמין.",
        "ניסית לעבוד עוד קצת כדי שזה יזוז.",
        "חלק מזה עזר.",
        "אבל התלות נשארה.",
      ],
    },
    reframe: {
      label: "ההיפוך",
      headline: "הבעיה היא לא שאתה לא מתפקד. הבעיה היא מסלול העבודה סביבך.",
      lines: [
        "הבעיה היא לא שאתה לא מתפקד.",
        "הבעיה היא שהמערכת סביבך עדיין מתייחסת אליך כאל הדרך הכי מהירה להזיז דברים.",
        "החוזקה שלך הפכה לנתיב.",
        "הנתיב הפך להרגל.",
        "ההרגל הפך לצוואר בקבוק.",
      ],
    },
    pattern: {
      label: "שם לדפוס",
      headline: "זו מלכודת השחקן המצטיין.",
      body:
        "מלכודת השחקן המצטיין נוצרת כשהחוזקות הכי חזקות שלך בביצוע הופכות למסלול ברירת המחדל של הצוות להחלטות, הסלמות והתקדמות.",
    },
    framework: {
      label: "אבולוציית הובלה",
      headline: "ההתפתחות של מוביל טכנולוגי",
      body:
        "הרמה הבאה היא לא עוד תפוקה אישית. זה מודל הפעלה גלוי שהצוות יכול להשתמש בו בלי לחכות לך.",
    },
    chart: {
      label: "השפעה מול מעורבות",
      headline: "איפה אתה פועל היום?",
    },
    assessment: hebrewAssessmentCopy,
  },
};

export const playerTrapHeroCopy = { ...playerTrapFunnelCopy.en.hero } as const;

export const playerTrapDiagnosticSigns = [
  {
    title: "The team waits for you too often.",
    detail: "Work stalls because the approval path still ends with you.",
  },
  {
    title: "You solve problems faster than the system can.",
    detail: "Execution stays dependent on your personal throughput instead of the team operating model.",
  },
  {
    title: "Your workload grows with every promotion.",
    detail: "Scope increases, but the hidden decision load grows faster.",
  },
  {
    title: "Everyone values you. Not everyone sees you as the next-level leader.",
    detail: "High performance is visible. Strategic leadership is not yet as visible.",
  },
] as const;

export const playerTrapEvolutionStages = [
  {
    title: "Star Player",
    description: "You create momentum through direct action and fast problem solving.",
    bottleneck: "Everything relies on your personal throughput.",
    nextChallenge: "Turn repeatable action into a visible operating model.",
  },
  {
    title: "Captain",
    description: "You coordinate people and keep the team moving.",
    bottleneck: "The team still looks to you for too many decisions.",
    nextChallenge: "Move from direction to explicit delegation rules.",
  },
  {
    title: "System Builder",
    description: "You make the rules, standards, and decision paths visible.",
    bottleneck: "The system can still drift back toward hidden dependency.",
    nextChallenge: "Keep the model legible as AI-assisted work increases.",
  },
  {
    title: "Pre-Promoted Leader",
    description: "The organization already experiences you as operating one level higher.",
    bottleneck: "The old execution reflex no longer matches the role the company needs.",
    nextChallenge: "Shift identity from high performer to strategic multiplier.",
  },
] as const;

export const playerTrapEvolutionStagesHebrew = [
  {
    title: "Star Player",
    description: "אתה מזיז דברים דרך פעולה מהירה ופתרון בעיות ישיר.",
    bottleneck: "יותר מדי עדיין תלוי בתפוקה האישית שלך.",
    nextChallenge: "להפוך פעולה חוזרת למודל עבודה גלוי.",
  },
  {
    title: "Captain",
    description: "אתה מתאם אנשים ושומר על התקדמות.",
    bottleneck: "הצוות עדיין מסתכל עליך ביותר מדי החלטות.",
    nextChallenge: "לעבור מכיוון כללי לכללי האצלה מפורשים.",
  },
  {
    title: "System Builder",
    description: "אתה הופך כללים, סטנדרטים ונתיבי החלטה לגלויים.",
    bottleneck: "המערכת עדיין יכולה להחליק חזרה לתלות סמויה.",
    nextChallenge: "לשמור על מודל ברור גם כשהעבודה בעזרת AI גדלה.",
  },
  {
    title: "Pre-Promoted Leader",
    description: "הארגון כבר חווה אותך כאילו אתה פועל רמה אחת קדימה.",
    bottleneck: "רפלקס הביצוע הישן כבר לא מתאים למה שהחברה צריכה.",
    nextChallenge: "לעבור מזהות של מבצע חזק למכפיל אסטרטגי.",
  },
] as const;

export const playerTrapQuickChecks = [
  "Do people wait for your approval too often?",
  "Do you regularly jump into execution?",
  "Do escalations land directly on your desk?",
  "Do you feel responsible for too many decisions?",
  "Do you work harder as your scope grows?",
] as const;

export const playerTrapQuickChecksHebrew = [
  "האם אנשים מחכים לאישור שלך יותר מדי?",
  "האם אתה קופץ שוב ושוב לביצוע?",
  "האם הסלמות מגיעות ישר אליך?",
  "האם אתה מרגיש אחראי על יותר מדי החלטות?",
  "האם אתה עובד קשה יותר ככל שהסקופ שלך גדל?",
] as const;

export const playerTrapAuthorityCopy = {
  eyebrow: "Authority",
  headline: "Trusted by 120+ managers in fast-moving engineering orgs.",
  body: "The Push helps technical leaders make the operating model visible before the system turns them into the default bottleneck.",
} as const;

export const playerTrapAuthorityCopyHebrew = {
  eyebrow: "סמכות",
  headline: "120+ מנהלים בוחרים לעבוד על המודל, לא רק על העומס.",
  body: "The Push עוזר למובילים טכנולוגיים להפוך את מודל ההפעלה לגלוי לפני שהמערכת הופכת אותם לצוואר הבקבוק ברירת המחדל.",
} as const;

export const playerTrapImpactChartPoints = [
  { stage: "Star Player", x: "High", y: "Personal execution" },
  { stage: "Captain", x: "High", y: "Coordination" },
  { stage: "System Builder", x: "Medium", y: "Operating model" },
  { stage: "Pre-Promoted Leader", x: "Low", y: "Strategic leverage" },
] as const;

export const playerTrapImpactChartPointsHebrew = [
  { stage: "Star Player", x: "גבוהה", y: "ביצוע אישי" },
  { stage: "Captain", x: "גבוהה", y: "תיאום" },
  { stage: "System Builder", x: "בינונית", y: "מודל הפעלה" },
  { stage: "Pre-Promoted Leader", x: "נמוכה", y: "מינוף אסטרטגי" },
] as const;

export const playerTrapNurtureSequence: PlayerTrapEmailTemplate[] = [
  {
    dayOffset: 0,
    slug: "diagnostic-report",
    subject: "Your Player Trap diagnostic report",
    previewText: "Your score, diagnosis, and next step are ready.",
    body:
      "This is the diagnostic report you requested. It summarizes the score, the leadership pattern, and the next step to reduce bottleneck risk.",
  },
  {
    dayOffset: 1,
    slug: "stop-being-the-bottleneck",
    subject: "How bottlenecks form in AI-assisted teams",
    previewText: "A short explanation of the pattern behind the score.",
    body:
      "This email explains how engineering managers become the default review and escalation path when decision rules stay implicit.",
  },
  {
    dayOffset: 3,
    slug: "delegate-with-clarity",
    subject: "Make delegation visible before it becomes a problem",
    previewText: "Clarity in rules matters more than more review time.",
    body:
      "This email shows how explicit delegation boundaries and decision rules reduce unnecessary review load.",
  },
  {
    dayOffset: 5,
    slug: "ai-review-load",
    subject: "Reduce AI review load without lowering standards",
    previewText: "AI-generated output should not become another hidden queue.",
    body:
      "This email explains how to review AI-assisted output with clear thresholds instead of ad hoc approval behavior.",
  },
  {
    dayOffset: 7,
    slug: "diagnosis-call",
    subject: "If you want a diagnosis call, start here",
    previewText: "The final step is a live diagnosis call if the gap is still active.",
    body:
      "This email routes the lead toward a diagnosis call when the current operating model still produces bottlenecks.",
  },
];

export function getPlayerTrapFunnelCopy(language: PlayerTrapLanguage): PlayerTrapFunnelCopy {
  return playerTrapFunnelCopy[language];
}

export function getPlayerTrapQuestions(language: PlayerTrapLanguage): PlayerTrapQuestion[] {
  return language === "he" ? playerTrapQuestionsHebrew : playerTrapQuestions;
}

export function getPlayerTrapQuickChecks(language: PlayerTrapLanguage): readonly string[] {
  return language === "he" ? playerTrapQuickChecksHebrew : playerTrapQuickChecks;
}

export function normalizeUtmAttribution(input?: Partial<PlayerTrapUtmAttribution> | null): PlayerTrapUtmAttribution {
  return {
    utmSource: input?.utmSource?.trim() ?? "",
    utmMedium: input?.utmMedium?.trim() ?? "",
    utmCampaign: input?.utmCampaign?.trim() ?? "",
    utmContent: input?.utmContent?.trim() ?? "",
    utmTerm: input?.utmTerm?.trim() ?? "",
  };
}

function scorePlayerTrapEnglish(
  answers: Partial<Record<PlayerTrapQuestionId, string>>,
  questions: PlayerTrapQuestion[] = playerTrapQuestions,
): PlayerTrapResult {
  const totalScore = questions.reduce((sum, question) => {
    const choice = question.choices.find((entry) => entry.label === answers[question.id]);
    return sum + (choice?.score ?? question.choices[question.choices.length - 1].score);
  }, 0);
  const maxScore = questions.reduce((sum, question) => sum + question.choices[question.choices.length - 1].score, 0);

  if (totalScore <= 4) {
    return {
      totalScore,
      maxScore,
      tier: "trusted-operator",
      title: "Trusted Operator",
      summary:
        "You are probably still the clear coordination point today. The team can move, but it still checks in with you when the risk feels real.",
      diagnosis:
        "The hidden cost is that your speed can train the system to ask you instead of deciding without you.",
      primaryCTA: "The next leadership move is to keep the decision rules visible before the load grows.",
      secondaryCTA: "Use the scorecard to check whether the approval path is still too personal.",
      nextStep: "Move the approval path into the system, not your inbox.",
    };
  }

  if (totalScore <= 9) {
    return {
      totalScore,
      maxScore,
      tier: "invisible-executor",
      title: "Invisible Executor",
      summary: "You are probably carrying a lot of the system even when the team looks productive.",
      diagnosis:
        "The hidden cost is that your execution strength creates a quiet dependency that does not always show up in status updates.",
      primaryCTA: "The next leadership move is to make the delegation and escalation rules visible enough for others to use.",
      secondaryCTA: "Check the scorecard before the queue becomes another habit.",
      nextStep: "Turn the model into something the team can repeat without asking you.",
    };
  }

  return {
    totalScore,
    maxScore,
    tier: "execution-bottleneck",
    title: "Execution Bottleneck",
    summary: "You are probably the default place where decisions, escalations, and reviews end up.",
    diagnosis: "The hidden cost is that the team has learned to wait for you, which keeps the operating model from scaling.",
    primaryCTA: "The next leadership move is to step back from being the fastest path and define the path the team should follow.",
    secondaryCTA: "Use the scorecard to see how much of the system still routes through you.",
    nextStep: "Redesign the route so progress does not depend on your personal availability.",
  };
}

function scorePlayerTrapHebrew(answers: Partial<Record<PlayerTrapQuestionId, string>>): PlayerTrapResult {
  const result = scorePlayerTrapEnglish(answers, playerTrapQuestionsHebrew);
  const localized: Record<PlayerTrapTier, PlayerTrapResult> = {
    "trusted-operator": {
      ...result,
      title: "מפעיל אמין",
      summary: "כנראה שעדיין אתה נקודת התיאום הברורה. הצוות זז, אבל עדיין בודק איתך כשיש סיכון אמיתי.",
      diagnosis: "העלות הסמויה היא שהמהירות שלך מאמנת את המערכת לשאול אותך במקום להחליט בלעדיך.",
      primaryCTA: "הצעד הבא הוא לשמור על כללי ההחלטה גלויים לפני שהעומס גדל.",
      secondaryCTA: "השתמש בכרטיס הניקוד כדי לבדוק אם מסלול האישור עדיין אישי מדי.",
      nextStep: "העבר את מסלול האישור לתוך המערכת, לא לתיבת הדואר שלך.",
    },
    "invisible-executor": {
      ...result,
      title: "מבצע שקוף",
      summary: "כנראה שאתה סוחב הרבה מהמערכת גם כשהצוות נראה פרודוקטיבי.",
      diagnosis: "העלות הסמויה היא שחוזק הביצוע שלך יוצר תלות שקטה שלא תמיד רואים בעדכוני מצב.",
      primaryCTA: "הצעד הבא הוא להפוך את כללי ההאצלה וההסלמה לגלויים מספיק כדי שאחרים ישתמשו בהם.",
      secondaryCTA: "בדוק את כרטיס הניקוד לפני שהתור הופך להרגל נוסף.",
      nextStep: "הפוך את המודל למשהו שהצוות יכול לחזור עליו בלי לשאול אותך.",
    },
    "execution-bottleneck": {
      ...result,
      title: "צוואר בקבוק תפעולי",
      summary: "כנראה שאתה נקודת הסיום של החלטות, הסלמות ובדיקות.",
      diagnosis: "העלות הסמויה היא שהצוות למד לחכות לך, ולכן מודל ההפעלה לא מצליח להתרחב.",
      primaryCTA: "הצעד הבא הוא להפסיק להיות המסלול המהיר ביותר ולהגדיר את המסלול שהצוות צריך לעקוב אחריו.",
      secondaryCTA: "השתמש בכרטיס הניקוד כדי לראות כמה מהמערכת עדיין עובר דרכך.",
      nextStep: "עצב מחדש את המסלול כך שההתקדמות לא תהיה תלויה בזמינות האישית שלך.",
    },
  };

  return localized[result.tier];
}

export function scorePlayerTrap(
  answers: Partial<Record<PlayerTrapQuestionId, string>>,
  questions: PlayerTrapQuestion[] = playerTrapQuestions,
): PlayerTrapResult {
  if (questions === playerTrapQuestions) {
    return scorePlayerTrapEnglish(answers, questions);
  }

  if (questions === playerTrapQuestionsHebrew) {
    return scorePlayerTrapHebrew(answers);
  }

  return scorePlayerTrapEnglish(answers, questions);
}

export function buildPlayerTrapReportLabels(language: PlayerTrapLanguage): PlayerTrapReportLabels {
  if (language === "he") {
    return {
      eyebrow: "דוח אבחון",
      score: "ניקוד",
      scoreConnector: "מתוך",
      diagnosis: "אבחון",
      nextStep: "צעד הבא",
      primaryCta: "המסר המרכזי",
      diagnosisCallCta: "קבע שיחת אבחון Pre-Promoted",
      diagnosisCallSupport:
        "זו לא שיחת קואצ׳ינג כללית. זו שיחת אבחון ממוקדת שמזהה איפה אתה עדיין סוחב את המערכת — ומה צריך להשתנות כדי שתיתפס כרמה הבאה.",
      scorecardCta: "פתח את כרטיס הניקוד",
      reportRequested: "הדוח נשלח",
      leadEmail: "אימייל ליד",
      diagnosisCallTracked: "בקשת שיחת האבחון תירשם ותשלח אותך לטופס ההזמנה.",
    };
  }

  return {
    eyebrow: "Diagnostic report",
    score: "Score",
    scoreConnector: "of",
    diagnosis: "Diagnosis",
    nextStep: "Next step",
    primaryCta: "Primary CTA",
    diagnosisCallCta: "Book a Pre-Promoted Diagnosis Call",
    diagnosisCallSupport:
      "This is not a generic coaching call. It is a focused diagnosis of where you are still carrying the system and what needs to change next.",
    scorecardCta: "Open the scorecard",
    reportRequested: "Report requested",
    leadEmail: "Lead email",
    diagnosisCallTracked: "The diagnosis call request is tracked on the button below.",
  };
}

export function localizePlayerTrapResult(result: PlayerTrapResult, language: PlayerTrapLanguage): PlayerTrapResult {
  if (language === "en") {
    return result;
  }

  const localized: Record<PlayerTrapTier, PlayerTrapResult> = {
    "trusted-operator": {
      ...result,
      title: "מפעיל אמין",
      summary: "כנראה שעדיין אתה נקודת התיאום הברורה. הצוות זז, אבל עדיין בודק איתך כשיש סיכון אמיתי.",
      diagnosis: "העלות הסמויה היא שהמהירות שלך מאמנת את המערכת לשאול אותך במקום להחליט בלעדיך.",
      primaryCTA: "הצעד הבא הוא לשמור על כללי ההחלטה גלויים לפני שהעומס גדל.",
      secondaryCTA: "השתמש בכרטיס הניקוד כדי לבדוק אם מסלול האישור עדיין אישי מדי.",
      nextStep: "העבר את מסלול האישור לתוך המערכת, לא לתיבת הדואר שלך.",
    },
    "invisible-executor": {
      ...result,
      title: "מבצע שקוף",
      summary: "כנראה שאתה סוחב הרבה מהמערכת גם כשהצוות נראה פרודוקטיבי.",
      diagnosis: "העלות הסמויה היא שחוזק הביצוע שלך יוצר תלות שקטה שלא תמיד רואים בעדכוני מצב.",
      primaryCTA: "הצעד הבא הוא להפוך את כללי ההאצלה וההסלמה לגלויים מספיק כדי שאחרים ישתמשו בהם.",
      secondaryCTA: "בדוק את כרטיס הניקוד לפני שהתור הופך להרגל נוסף.",
      nextStep: "הפוך את המודל למשהו שהצוות יכול לחזור עליו בלי לשאול אותך.",
    },
    "execution-bottleneck": {
      ...result,
      title: "צוואר בקבוק תפעולי",
      summary: "כנראה שאתה נקודת הסיום של החלטות, הסלמות ובדיקות.",
      diagnosis: "העלות הסמויה היא שהצוות למד לחכות לך, ולכן מודל ההפעלה לא מצליח להתרחב.",
      primaryCTA: "הצעד הבא הוא להפסיק להיות המסלול המהיר ביותר ולהגדיר את המסלול שהצוות צריך לעקוב אחריו.",
      secondaryCTA: "השתמש בכרטיס הניקוד כדי לראות כמה מהמערכת עדיין עובר דרכך.",
      nextStep: "עצב מחדש את המסלול כך שההתקדמות לא תהיה תלויה בזמינות האישית שלך.",
    },
  };

  return localized[result.tier];
}

export function buildPlayerTrapSubmissionData(input: {
  email: string;
  name?: string;
  answers: Partial<Record<PlayerTrapQuestionId, string>>;
  result: PlayerTrapResult;
  reportToken: string;
  reportUrl: string;
  diagnosisCallUrl: string;
  pageLanguage?: PlayerTrapLanguage;
  contentConsentAccepted?: boolean;
  cookiesConsentAccepted?: boolean;
  utm: PlayerTrapUtmAttribution;
  now: string;
}) {
  const pageLanguage = normalizePlayerTrapLanguage(input.pageLanguage);

  return {
    name: input.name?.trim() || undefined,
    email: input.email.trim().toLowerCase(),
    reportToken: input.reportToken,
    reportUrl: input.reportUrl,
    diagnosisCallUrl: input.diagnosisCallUrl,
    assessmentScore: input.result.totalScore,
    assessmentTier: input.result.tier,
    assessmentResult: JSON.stringify(input.result),
    assessmentAnswers: serializeAnswers(input.answers),
    pageLanguage,
    resultProfile: input.result.tier,
    resultScore: input.result.totalScore,
    contentConsentAccepted: input.contentConsentAccepted === true,
    cookiesConsentAccepted: input.cookiesConsentAccepted === true,
    consentAcceptedAt: input.now,
    lifecycleStage: "test_completed",
    leadSource: pageLanguage === "he" ? "player-trap-he" : "player-trap",
    source: pageLanguage === "he" ? "player-trap-he" : "player-trap",
    tags: [{ value: "player-trap" }, { value: "diagnostic" }, { value: pageLanguage }, { value: input.result.tier }],
    status: "subscribed" as const,
    reportedAt: input.now,
    testCompletedAt: input.now,
    reportRequestedAt: input.now,
    nurtureSequenceKey: "player-trap-2026",
    nurtureStep: 1,
    nurtureLastEmailSlug: playerTrapNurtureSequence[0].slug,
    nurtureLastEmailSentAt: input.now,
    utmSource: input.utm.utmSource || undefined,
    utmMedium: input.utm.utmMedium || undefined,
    utmCampaign: input.utm.utmCampaign || undefined,
    utmContent: input.utm.utmContent || undefined,
    utmTerm: input.utm.utmTerm || undefined,
  };
}

export function buildPlayerTrapReport(
  result: PlayerTrapResult,
  context: { name?: string; reportUrl: string; diagnosisCallUrl: string },
) {
  const intro = context.name ? `Hi ${context.name},` : "Here is your diagnostic report.";
  const scoreLine = `${result.totalScore}/${result.maxScore}`;

  return {
    subject: `Player Trap diagnostic report - ${result.title}`,
    text: [
      intro,
      "",
      `Score: ${scoreLine}`,
      `Diagnosis: ${result.diagnosis}`,
      `Summary: ${result.summary}`,
      "",
      `Primary CTA: ${result.primaryCTA}`,
      `Secondary CTA: ${result.secondaryCTA}`,
      "",
      `Report: ${context.reportUrl}`,
      `Diagnosis call: ${context.diagnosisCallUrl}`,
      "",
      "This report is aligned to The Push, the Invisible Executor framework, and the Tech Leadership Coaching pillar.",
    ].join("\n"),
    html: [
      `<p>${context.name ? `Hi ${escapeHtml(context.name)},` : "Here is your diagnostic report."}</p>`,
      `<p><strong>Score:</strong> ${scoreLine}</p>`,
      `<p><strong>Diagnosis:</strong> ${result.diagnosis}</p>`,
      `<p><strong>Summary:</strong> ${result.summary}</p>`,
      `<p><strong>Primary CTA:</strong> ${result.primaryCTA}</p>`,
      `<p><strong>Secondary CTA:</strong> ${result.secondaryCTA}</p>`,
      `<p><a href="${context.reportUrl}">Open your report</a></p>`,
      `<p><a href="${context.diagnosisCallUrl}">Request a diagnosis call</a></p>`,
      `<p>This report is aligned to The Push, the Invisible Executor framework, and the Tech Leadership Coaching pillar.</p>`,
    ].join(""),
  };
}

export function buildPlayerTrapFollowUpEmail(template: PlayerTrapEmailTemplate, context: PlayerTrapSubmissionContext) {
  const scoreLine = `${context.result.totalScore}/${context.result.maxScore}`;
  const reportLink = context.reportUrl;

  return {
    subject: template.subject,
    previewText: template.previewText,
    text: [
      context.name ? `Hi ${context.name},` : "Hi,",
      "",
      template.body,
      "",
      `Report score: ${scoreLine}`,
      `Report: ${reportLink}`,
      `Diagnosis call: ${context.diagnosisCallUrl}`,
      "",
      `Next step: ${context.result.nextStep}`,
    ].join("\n"),
    html: [
      context.name ? `<p>Hi ${escapeHtml(context.name)},</p>` : "<p>Hi,</p>",
      `<p>${template.body}</p>`,
      `<p><strong>Report score:</strong> ${scoreLine}</p>`,
      `<p><a href="${reportLink}">Open the report</a></p>`,
      `<p><a href="${context.diagnosisCallUrl}">Request a diagnosis call</a></p>`,
      `<p><strong>Next step:</strong> ${context.result.nextStep}</p>`,
    ].join(""),
  };
}

export function buildPlayerTrapReportUrl(reportToken: string, baseUrl = getSiteUrl()) {
  return new URL(`/player-trap/report/${reportToken}`, baseUrl).toString();
}

export function buildPlayerTrapDiagnosisCallUrl(reportToken: string, baseUrl = getSiteUrl()) {
  return new URL(
    `/api/player-trap/diagnosis-call?reportToken=${encodeURIComponent(reportToken)}`,
    baseUrl,
  ).toString();
}

export function serializeAnswers(answers: Partial<Record<PlayerTrapQuestionId, string>>) {
  return JSON.stringify(answers);
}
