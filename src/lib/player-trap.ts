import { getSiteUrl } from "./site-url";

export type PlayerTrapQuestionId =
  | "final_reviewer"
  | "delegation_rules"
  | "ai_review_load"
  | "leadership_visibility"
  | "default_escalation";

export type PlayerTrapTier = "trusted-operator" | "invisible-executor" | "execution-bottleneck";

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
  lifecycleStage: string;
  leadSource: string;
  source: string;
  tags: Array<{ value: string }>;
  status: "subscribed";
  reportedAt: string;
  reportViewedAt?: string;
  diagnosisCallRequestedAt?: string;
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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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

export function normalizeUtmAttribution(input?: Partial<PlayerTrapUtmAttribution> | null): PlayerTrapUtmAttribution {
  return {
    utmSource: input?.utmSource?.trim() ?? "",
    utmMedium: input?.utmMedium?.trim() ?? "",
    utmCampaign: input?.utmCampaign?.trim() ?? "",
    utmContent: input?.utmContent?.trim() ?? "",
    utmTerm: input?.utmTerm?.trim() ?? "",
  };
}

export function scorePlayerTrap(answers: Partial<Record<PlayerTrapQuestionId, string>>): PlayerTrapResult {
  const totalScore = playerTrapQuestions.reduce((sum, question) => {
    const choice = question.choices.find((entry) => entry.label === answers[question.id]);
    return sum + (choice?.score ?? question.choices[question.choices.length - 1].score);
  }, 0);
  const maxScore = playerTrapQuestions.reduce((sum, question) => sum + question.choices[question.choices.length - 1].score, 0);

  if (totalScore <= 4) {
    return {
      totalScore,
      maxScore,
      tier: "trusted-operator",
      title: "Trusted Operator",
      summary: "Your leadership model is relatively visible. The main work is keeping it explicit as the team and AI load increase.",
      diagnosis: "You are not trapped in the Player Trap yet, but the operating model should stay visible so it does not drift toward hidden approval behavior.",
      primaryCTA: "Use the scorecard to keep the model visible.",
      secondaryCTA: "Review the Invisible Executor framework for the delegation model.",
      nextStep: "Keep decision rules explicit and use the scorecard before the approval queue grows.",
    };
  }

  if (totalScore <= 9) {
    return {
      totalScore,
      maxScore,
      tier: "invisible-executor",
      title: "Invisible Executor",
      summary: "You are strong at execution, but the leadership model is likely getting harder for others to see and repeat.",
      diagnosis: "This is the middle zone where strong execution starts to turn into hidden dependency. The team may rely on you because the rules are not yet explicit enough.",
      primaryCTA: "Use the Invisible Executor framework to make the model visible.",
      secondaryCTA: "Check the scorecard before the queue grows.",
      nextStep: "Make delegation and approval rules visible before AI-assisted work adds more review load.",
    };
  }

  return {
    totalScore,
    maxScore,
    tier: "execution-bottleneck",
    title: "Execution Bottleneck",
    summary: "You are likely the default reviewer and escalation path, which creates a bottleneck as AI-assisted work increases.",
    diagnosis: "The team is probably waiting on your approval because the operating model is not visible enough to run without you.",
    primaryCTA: "Request a diagnosis call and remove the bottleneck.",
    secondaryCTA: "Study the Invisible Executor framework to reset the operating model.",
    nextStep: "Use the diagnosis call to reduce hidden approval loops and clarify who owns which decisions.",
  };
}

export function buildPlayerTrapReport(result: PlayerTrapResult, context: { name?: string; reportUrl: string; diagnosisCallUrl: string }) {
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

export function buildPlayerTrapReportUrl(reportToken: string) {
  return new URL(`/player-trap/report/${reportToken}`, getSiteUrl()).toString();
}

export function buildPlayerTrapDiagnosisCallUrl(reportToken: string) {
  return new URL(`/api/player-trap/diagnosis-call?reportToken=${encodeURIComponent(reportToken)}`, getSiteUrl()).toString();
}

export function serializeAnswers(answers: Partial<Record<PlayerTrapQuestionId, string>>) {
  return JSON.stringify(answers);
}
