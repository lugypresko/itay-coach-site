import { createReaderFacingArtifactDraft } from "../domain/reader-facing-page-artifact";
import {
  validateArtifactInternalLanguage,
  validateReaderFacingArtifactDeterministically,
  type ArtifactProvenance,
  type ArtifactSemanticReview,
} from "../ai/governance/reader-facing-artifact-governance";

export const draft05ReaderFacingArtifact = createReaderFacingArtifactDraft({
  artifactId: "authority-draft-approved-insight-player-trap-05",
  artifactVersion: 2,
  schemaVersion: "1.0.0",
  createdAt: "2026-07-13T12:00:00.000Z",
  pageType: "cluster",
  canonicalPath: "/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck",
  locale: "en",
  title: "Your team should not need you for every important decision",
  description: "If reviews, escalations, and uncertain choices keep returning to you, working harder will not fix the pattern. Change how judgment and ownership operate across the team.",
  body: [
    {
      sectionId: "recognition",
      heading: "You may be stuck in the Player Trap if",
      paragraphs: ["The pattern usually appears in ordinary work before it looks like a leadership problem."],
      bullets: [
        "Important reviews wait for you.",
        "Senior engineers escalate whenever risk rises.",
        "Delegation gives people tasks, but not real authority.",
        "Incidents pull you back into execution.",
        "AI increases output, but your approval queue grows.",
        "Strategy gets postponed because delivery always feels urgent.",
      ],
    },
    {
      sectionId: "reframe",
      heading: "This is not mainly a time-management problem",
      paragraphs: [
        "The team depends on information, judgment, or permission that still lives only with you. You may have delegated implementation while keeping the trade-offs, decision rules, and exception handling in your own head.",
        "That is why a better calendar rarely solves the problem. The work returns because the operating model still treats your involvement as the safest route to a good decision.",
      ],
    },
    {
      sectionId: "cost",
      heading: "The cost grows on four fronts",
      paragraphs: [
        "Delivery slows because work queues behind one reviewer. The team learns to escalate instead of building judgment. Your own role stays tactical because strategic work is repeatedly displaced by urgent execution. Personally, you carry the tension of being responsible for outcomes while never having enough uninterrupted space to lead them.",
        "The dangerous part is that rescue work often produces a short-term win. You resolve the incident, unblock the review, or settle the trade-off. But if the decision rule remains invisible, the next version of the same problem comes back to you.",
      ],
    },
    {
      sectionId: "self-diagnosis",
      heading: "Diagnose the dependency before changing it",
      paragraphs: ["Look at the last two weeks and answer three questions:"],
      bullets: [
        "Which decisions waited for me?",
        "Which reviews or incidents could not close without me?",
        "What knowledge, judgment, or permission did the team need from me each time?",
      ],
    },
    {
      sectionId: "player-trap-definition",
      heading: "What the Player Trap means",
      paragraphs: [
        "The Player Trap is the dependency pattern that appears when a strong technical contributor becomes a manager but remains the team's central executor and decision point. Technical strength is not the problem. The trap is that the team can use that strength only by routing important work back through the manager.",
        "Escalation then reinforces itself: the manager steps in because it is faster, the team gets less practice making bounded decisions, and the next uncertain situation feels even more dependent on the manager.",
      ],
    },
    {
      sectionId: "small-intervention",
      heading: "Try one dependency-map intervention",
      paragraphs: [
        "Choose one repeated decision that currently returns to you. Create three columns: the decision, why it returns, and the rule or ownership change that would let the team handle it.",
        "Name the owner, the constraints that matter, the conditions that require escalation, and what a good decision looks like. Let the owner make the next decision inside those guardrails. Review the rule afterward instead of taking the decision back. Start with one high-frequency decision rather than launching a company-wide delegation program.",
      ],
    },
    {
      sectionId: "why-fixes-fail",
      heading: "Why the usual fixes fail",
      paragraphs: ["Most familiar responses increase capacity around the dependency without removing it."],
      bullets: [
        "Delegate more fails when tasks move but authority does not.",
        "Work longer increases how much dependency you can absorb.",
        "Hire another engineer adds capability without clarifying decision ownership.",
        "Add more process creates meetings and gates if the underlying judgment remains private.",
        "Answer faster trains the team to keep using you as the shortest path.",
        "Introduce AI tools increases output, but can enlarge the approval queue when decision rights stay unchanged.",
      ],
    },
    {
      sectionId: "operating-model-shift",
      heading: "The shift is from private expertise to visible operating rules",
      paragraphs: [
        "You do not need to stop being technical. You need to make your technical judgment reusable. Clear ownership, explicit guardrails, visible trade-offs, and deliberate escalation rules let the team act without guessing what you would have done.",
        "This is the broader move from hidden execution toward strategic leadership described in the Invisible Executor framework: your contribution becomes the system that improves decisions, not your presence in every decision.",
      ],
    },
    {
      sectionId: "coaching",
      heading: "What coaching changes",
      paragraphs: [
        "Coaching makes the recurring dependency visible, chooses a bounded operating change, and examines what happens when you stop rescuing the old pattern. The work is specific to your role: which decisions should move, what authority the owner needs, how you communicate guardrails, and how you handle risk without reclaiming control.",
        "The intended outcome is not generic confidence or a busier delegation checklist. It is a team that can make more sound decisions without waiting for you, while you recover the capacity to set direction, develop leaders, and work on the problems only you should own.",
      ],
    },
    {
      sectionId: "proof-boundary",
      heading: "Why this approach is specific to The Push",
      paragraphs: [
        "The diagnosis uses two first-party frameworks developed for technical leadership: the Player Trap names the dependency pattern, and the Invisible Executor progression describes the shift from hidden execution to visible strategic leadership. This draft does not claim client outcomes, metrics, company endorsements, or testimonials that have not been separately verified and approved.",
      ],
    },
  ],
  primaryCta: {
    label: "Diagnose your bottleneck pattern",
    href: "/player-trap",
    context: "Use the Player Trap diagnostic to identify which decisions, reviews, and escalations still depend on you.",
  },
  secondaryCta: {
    label: "Book a fit call",
    href: "/book-a-fit-call",
    context: "If you can see the pattern but cannot change it alone, use a fit call to decide whether coaching is the right next step.",
  },
  internalLinks: [
    { label: "Player Trap diagnostic", href: "/player-trap" },
    { label: "Invisible Executor framework", href: "/frameworks/invisible-executor" },
    { label: "Tech Leadership Coaching", href: "/pillars/tech-leadership-coaching" },
  ],
  faq: [
    { question: "Is this just a delegation problem?", answer: "Not necessarily. Tasks can be delegated while judgment, permission, and exception handling still return to the manager." },
    { question: "Do I need to stop being technical?", answer: "No. The goal is to make technical judgment reusable through explicit ownership, constraints, and escalation rules instead of requiring your involvement in every decision." },
    { question: "When is coaching useful?", answer: "Coaching is useful when you recognize the dependency pattern, have tried local fixes, and need a deliberate way to change the operating model without abandoning delivery responsibility." },
  ],
  seo: {
    title: "Stop Being the Bottleneck as an Engineering Manager | The Push",
    description: "Diagnose the Player Trap and change the decision and ownership pattern that keeps pulling an Engineering Manager back into execution.",
  },
  structuredDataInput: { type: "Article", authorName: "Itay Foyerstein" },
});

export const draft05ArtifactProvenance: ArtifactProvenance = {
  artifactId: draft05ReaderFacingArtifact.artifactId,
  artifactVersion: draft05ReaderFacingArtifact.artifactVersion,
  artifactHash: draft05ReaderFacingArtifact.artifactHash,
  pageBriefId: "page-brief-approved-insight-player-trap-05",
  generationMode: "hybrid",
  sourceApprovedInsightIds: [
    "approved-insight-player-trap-01",
    "approved-insight-player-trap-02",
    "approved-insight-player-trap-03",
    "approved-insight-player-trap-04",
    "approved-insight-player-trap-05",
    "approved-insight-player-trap-06",
    "approved-insight-player-trap-07",
  ],
  generatedAt: draft05ReaderFacingArtifact.createdAt,
};

export const draft05InternalLanguageValidation = validateArtifactInternalLanguage(
  draft05ReaderFacingArtifact,
  "2026-07-13T12:01:00.000Z",
);

export const draft05DeterministicValidation = validateReaderFacingArtifactDeterministically(
  draft05ReaderFacingArtifact,
  "2026-07-13T12:01:00.000Z",
);

export const draft05SemanticReview: ArtifactSemanticReview = {
  artifactId: draft05ReaderFacingArtifact.artifactId,
  artifactVersion: draft05ReaderFacingArtifact.artifactVersion,
  artifactHash: draft05ReaderFacingArtifact.artifactHash,
  passed: true,
  reviewedAt: "2026-07-13T12:02:00.000Z",
  dimensions: [
    { dimension: "clarity", score: 90, passed: true, reason: "The opening names the dependency problem directly and separates it from time management." },
    { dimension: "depth", score: 86, passed: true, reason: "The draft connects symptoms, reinforcing behavior, decision ownership, guardrails, and escalation rules." },
    { dimension: "usefulness", score: 92, passed: true, reason: "The three diagnostic questions and dependency-map intervention give the reader a bounded next action." },
    { dimension: "differentiation", score: 85, passed: true, reason: "The Player Trap and Invisible Executor concepts create a specific technical-leadership operating-model frame." },
    { dimension: "repetition", score: 84, passed: true, reason: "Recognition, cost, causal explanation, failed fixes, and intervention each serve a distinct reader task." },
    { dimension: "audience_fit", score: 92, passed: true, reason: "Reviews, incidents, senior-engineer escalation, AI output, and decision rights are specific to Engineering Managers." },
    { dimension: "persuasion", score: 82, passed: true, reason: "The diagnostic CTA follows self-recognition and a practical exercise; the fit call remains a secondary option." },
    { dimension: "authority_strength", score: 80, passed: true, reason: "Authority rests on named first-party frameworks while the proof section explicitly avoids unverified outcomes or testimonials." },
  ],
};
