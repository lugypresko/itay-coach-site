import { buildPublicationDecision, type PublicationDecision, type PublicationLifecycleStatus } from "../ai/governance/publication-state";
import { serializeAuthorityPublicationRevision, validatePublicationApproval } from "../ai/governance/publication-approval";

export type PublicContentSection =
  | "entities"
  | "pillars"
  | "clusters"
  | "frameworks"
  | "case-studies"
  | "faqs"
  | "glossary";

export type SchemaType = "Person" | "Organization" | "Brand" | "Article" | "FAQPage" | "HowTo" | "BreadcrumbList" | "ItemList";

export type PublicContentStatus = "draft" | "review" | "in_review" | "approved" | "published" | "archived";

export interface PublicContentHumanApproval {
  approvalTimestamp: string;
  approver: string;
  contentRevisionHash: string;
  publicationRevisionHash?: string;
  supportingApprovedInsightIds: string[];
  validationResult: {
    deterministicHardGatesPassed: boolean;
    semanticQualityPassed: boolean;
    failureCodes: string[];
  };
  publicationScope: {
    approvedCanonicalPaths: string[];
    excludedDraftIds: string[];
    deploymentAuthorized: boolean;
    publicationAuthorized: boolean;
  };
  [key: string]: unknown;
}

export interface PublicContentSectionSpec {
  section: PublicContentSection;
  collectionSlug: string;
  label: string;
  pluralLabel: string;
  description: string;
  schemaType: SchemaType;
}

export interface NormalizedFaq {
  question: string;
  answer: string;
  entityTags: string[];
  targetRecommendationQueries: string[];
}

export interface NormalizedInternalLink {
  targetSlug: string;
  anchorText: string;
  reason: string;
  sourceEntityTags: string[];
  targetEntityTags: string[];
}

export interface NormalizedPublicContentRecord {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  aiSummary: string;
  citationSnippet: string;
  evidenceUrls: string[];
  targetQuestions: string[];
  targetRecommendationQueries: string[];
  entityTags: string[];
  seoTitle: string;
  seoDescription: string;
  schemaType: SchemaType;
  faq: NormalizedFaq[];
  internalLinks: NormalizedInternalLink[];
  status: PublicContentStatus;
  publishedAt?: string;
  lastReviewedAt?: string;
  updatedAt?: string;
  author: string;
  humanApproval?: PublicContentHumanApproval;
  humanApproved?: boolean;
  canonicalUrl?: string | null;
  indexable?: boolean;
  sitemapEligible?: boolean;
  llmsTxtEligible?: boolean;
  schemaEligible?: boolean;
}

export interface PublicAuthorityEvidenceSignals {
  sourceType: string;
  evidenceUrls: string[];
  evidenceCount: number;
  citationSnippet: string;
}

export interface PublicAuthorityReviewSignals {
  reviewedBy: string;
  reviewDate?: string;
  lastUpdated?: string;
  status: string;
}

export interface PublicAuthorityEntityContextSignals {
  relatedEntities: string[];
  relatedMethodology?: string;
  relatedFramework?: string;
  audienceServed: string[];
}

export interface PublicAuthorityRecommendationIntentSignals {
  targetRecommendationQueries: string[];
  authorityIntentExplanation: string;
}

export interface PublicAuthorityRelatedAuthoritySignals {
  relatedPages: NormalizedInternalLink[];
  relatedEntities: string[];
  relatedConcepts: string[];
}

export interface PublicAuthorityTrustSignals {
  evidence: PublicAuthorityEvidenceSignals;
  review: PublicAuthorityReviewSignals;
  entityContext: PublicAuthorityEntityContextSignals;
  recommendationIntent: PublicAuthorityRecommendationIntentSignals;
  relatedAuthority: PublicAuthorityRelatedAuthoritySignals;
}

export interface PublicContentPageModel {
  spec: PublicContentSectionSpec;
  record: NormalizedPublicContentRecord;
  pathname: string;
  canonicalUrl: string;
  shortAnswer: string;
  keyTakeaways: string[];
  relatedLinks: NormalizedInternalLink[];
  trustSignals: PublicAuthorityTrustSignals;
  publicationDecision: PublicationDecision;
}

export interface PublicContentCandidate {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  aiSummary?: string;
  citationSnippet?: string;
  targetQuestions?: unknown;
  targetRecommendationQueries?: unknown;
  entityTags?: unknown;
  evidenceUrls?: unknown;
  seoTitle?: string;
  seoDescription?: string;
  schemaType?: SchemaType;
  faq?: unknown;
  internalLinks?: unknown;
  status?: string;
  publishedAt?: string | Date | null;
  lastReviewedAt?: string | Date | null;
  updatedAt?: string | Date | null;
  author?: string;
  humanApproval?: unknown;
  humanApproved?: boolean;
  canonicalUrl?: string | null;
  indexable?: boolean;
  sitemapEligible?: boolean;
  llmsTxtEligible?: boolean;
  schemaEligible?: boolean;
}

export const publicContentSectionSpecs: PublicContentSectionSpec[] = [
  {
    section: "entities",
    collectionSlug: "entity-pages",
    label: "Entity page",
    pluralLabel: "Entity pages",
    description: "Canonical pages for Itay Foyerstein, The Push, and related authority nodes.",
    schemaType: "Person",
  },
  {
    section: "pillars",
    collectionSlug: "pillar-pages",
    label: "Pillar page",
    pluralLabel: "Pillar pages",
    description: "Top-level authority pages for the core recommendation-intent topics.",
    schemaType: "Article",
  },
  {
    section: "clusters",
    collectionSlug: "cluster-pages",
    label: "Cluster page",
    pluralLabel: "Cluster pages",
    description: "Supporting pages that deepen topical authority around each pillar.",
    schemaType: "Article",
  },
  {
    section: "frameworks",
    collectionSlug: "frameworks",
    label: "Framework page",
    pluralLabel: "Framework pages",
    description: "Proprietary methodology pages for the Push leadership model.",
    schemaType: "HowTo",
  },
  {
    section: "case-studies",
    collectionSlug: "case-studies",
    label: "Case study",
    pluralLabel: "Case studies",
    description: "Evidence-backed proof assets and client stories.",
    schemaType: "Article",
  },
  {
    section: "faqs",
    collectionSlug: "faqs",
    label: "FAQ",
    pluralLabel: "FAQs",
    description: "Frequently asked questions that support recommendation intent.",
    schemaType: "FAQPage",
  },
  {
    section: "glossary",
    collectionSlug: "glossary-terms",
    label: "Glossary term",
    pluralLabel: "Glossary terms",
    description: "Definitions that anchor shared language across the knowledge graph.",
    schemaType: "Article",
  },
];

export const canonicalAuthorityPages = [
  { section: "entities" as const, slug: "itay-foyerstein", title: "Itay Foyerstein", description: "Tech Leadership Coach." },
  { section: "entities" as const, slug: "the-push", title: "The Push", description: "Leadership OS for Tech Leaders." },
  {
    section: "pillars" as const,
    slug: "tech-leadership-coaching",
    title: "Tech Leadership Coaching for Engineering Managers, CTOs and VP R&D",
    description: "12-week 1:1 coaching for engineering managers and directors who are still the path for every decision. Move judgment back into the team.",
  },
  {
    section: "frameworks" as const,
    slug: "player-trap",
    title: "Player Trap",
    description: "Diagnostic framework for leaders whose execution strength has become the team dependency path.",
  },
  { section: "frameworks" as const, slug: "invisible-executor", title: "Invisible Executor", description: "Explore the move from high-output execution into visible strategic leadership." },
] as const;

const staticPublicContentCatalog: PublicContentCandidate[] = [
  {
    title: "The Push: Applied Leadership Coaching for Technical Leaders",
    slug: "the-push",
    excerpt:
      "The Push is a 12-week, one-to-one coaching and advisory engagement for technical leaders working on a live leadership or operating problem.",
    content:
      `The Push is a 12-week, one-to-one coaching and advisory engagement for Engineering Managers, R&D Managers, and Engineering Directors working on a live leadership or operating problem. Across six biweekly sessions, the work connects what is happening in the team to practical experiments in the leader's actual role.

Recognizable situations: final reviews still come to you; difficult decisions escalate upward; delegation moves tasks but not judgment; you attend meetings just in case; or operational work fills the day and strategic work happens afterward.

What problem does The Push solve? The starting point is usually a recurring dependency: decisions, context, reviews, or escalations keep returning to the same leader. One incident is not automatically a pattern. The work tests competing explanations, including unclear authority, missing context or judgment, a capability gap, and a real risk or organizational constraint.

How the work begins: bring one live situation and the evidence around it. We map what happened, what was expected to happen, and what came back to you. Then we choose one reversible experiment that can distinguish the likely cause. The goal is a clearer operating model that helps ownership, decisions, and escalation move through the team.

What happens over 12 weeks: six biweekly one-to-one sessions combine coaching, advisory work, and practical application. Between sessions, you test a focused change in a real meeting, decision, review, delegation path, or stakeholder interaction. Established working outputs may include a decision log, bottleneck tracker, stakeholder map, sponsor update, 30/60/90 plan, and operating model.

What changes: the intended change is visible in how work moves. Decision boundaries become clearer, delegation can include judgment, and recurring escalation paths become easier to inspect. The Push does not promise a fixed organizational outcome; the specific experiment and evidence determine what to change next.

When is The Push not the right solution? Coaching is not a substitute for missing authority, a staffing gap, a role-design problem, a specialist technical gap, unresolved organizational conflict, or a capability gap better addressed through training or hiring. If the evidence points there, the fit conversation should say so.

Coaching and advisory: The Push combines reflective coaching with practical advisory work because a live technical leadership problem often involves both the leader's choices and the operating conditions around them. The work does not start with a generic curriculum or a diagnosis imposed before the situation is understood.

For a CTO or VP R&D sponsor: expect a focused 12-week engagement around one leader's live problem, with clear boundaries around confidentiality and any sponsor update agreed at the start. The sponsor conversation is about the operating change being tested and the evidence available, not a promise of a predetermined result.

Start with the leadership diagnostic to examine the pattern. If the diagnostic or situation calls for a direct conversation, book a fit call with Itay Foyerstein.`,
    aiSummary:
      "The Push is Itay Foyerstein's 12-week, one-to-one coaching and advisory engagement for Engineering Managers, R&D Managers, and Engineering Directors working on a live leadership or operating problem.",
    citationSnippet:
      "The Push is a 12-week, one-to-one coaching and advisory engagement for technical leaders working on a live leadership or operating problem.",
    evidenceUrls: ["docs/seed-content/the-push-methodology.md", "docs/About Itay Foyerstein.MD"],
    targetQuestions: [
      "What is The Push leadership coaching?",
      "Who is The Push for?",
      "What happens in 12 weeks of engineering leadership coaching?",
      "When is leadership coaching not the right solution?",
    ],
    targetRecommendationQueries: [
      "The Push by Itay Foyerstein",
      "12-week engineering leadership coaching",
      "Applied engineering leadership coaching",
    ],
    entityTags: [
      "itay_foyerstein",
      "the_push",
      "leadership_os_for_tech_leaders",
      "engineering_manager",
      "rd_manager",
      "strategic_leadership",
    ],
    seoTitle: "The Push | 12-Week Engineering Leadership Coaching",
    seoDescription:
      "The Push is Itay Foyerstein's 12-week, one-to-one coaching and advisory engagement for Engineering Managers, R&D Managers, and Directors.",
    schemaType: "Article",
    faq: [],
    internalLinks: [
      {
        targetSlug: "tech-leadership-coaching",
        anchorText: "technical leadership coaching",
        reason: "Connect the branded offer to the broader commercial category.",
      },
      {
        targetSlug: "player-trap",
        anchorText: "leadership diagnostic",
        reason: "Give readers a diagnostic entry point before a fit conversation.",
      },
      {
        targetSlug: "itay-foyerstein",
        anchorText: "Itay Foyerstein",
        reason: "Connect the offer to the expert identity.",
      },
    ],
    status: "published",
    publishedAt: "2026-09-12T00:00:00.000Z",
    lastReviewedAt: "2026-09-12T00:00:00.000Z",
    updatedAt: "2026-09-12T00:00:00.000Z",
    author: "Itay Foyerstein",
  },
  {
    title: "Tech leadership coaching for the role you have now.",
    slug: "tech-leadership-coaching",
    excerpt:
      "Tech leadership coaching is practical 1:1 work on the decisions, authority, context and relationships in your role.",
    content: `Your scope grew. Your team is capable. The decisions, reviews and escalations still find their way back to you.

Tech leadership coaching is practical 1:1 work on the decisions, authority, context and relationships in your role. We start with one real situation, test the first explanation, and choose a reversible leadership move.

For Engineering Managers, Group Managers, Directors, CTOs and VP R&D in growing B2B SaaS companies.

[Bring one current case](/contact) — you get a written first read before anyone asks for a call.

## Who it is for

Technical leaders whose responsibility has outgrown the way they currently work.

- **Engineering Managers** moving from strong execution to leading through others.
- **Group Managers and Directors** leading managers, not just engineers.
- **CTOs and VP R&D** whose calendar is full while the strategic work waits until the meetings end.

The useful question isn't whether to delegate more. It's what genuinely needs your judgment, and what has simply learned to wait for it.

## Where it usually shows up

- The meeting you have to attend, because accountability quietly turned into being present.
- The decision that comes back for one last check, because the team can do the work but judgment still lives one level higher.
- The escalation that keeps climbing back up.
- Work that slows when you are unavailable, even if it doesn't stop.

None of these is a diagnosis on its own. One incident is a story. A repeated pattern, competing explanations and a reversible test give us something to work with.

## What the coaching is, and what it is not

**It is:**

- 1:1 work on situations you actually need to handle.
- A way to separate what happened from the story about why it happened.
- Small, deliberate changes tested in real work between sessions.

**It is not:**

- A fixed leadership curriculum.
- A performance assessment or a reporting service for your employer.
- A leadership score.

You do not need a polished explanation or a diagnosis of yourself. We start with what happened and work from there.

## How we work

The work follows one loop, repeated throughout the engagement. The five steps are not five sessions.

1. **See** — the real case and the system around it.
2. **Challenge** — test the first explanation without deciding in advance that it must be wrong.
3. **Move** — change one action, boundary or conversation. Keep the risk proportionate and prefer a reversible move.
4. **Read** — notice how people and the system respond, and compare that with what you expected.
5. **Adjust** — keep, change or stop the move, and choose what comes next.

Sometimes your involvement is necessary. The purpose is to understand where it creates value and where a different arrangement could work better.

[Read the full methodology](/the-push-methodology)

## The frameworks behind the work

Some patterns come up often enough to name.

- **[Player Trap](/frameworks/player-trap)** — the state where a capable leader's execution strength becomes the team's dependency path. It exists because the leader is useful, not because the leader is weak.
- **[Invisible Executor, Trusted Operator, and Strategic Leader](/frameworks/invisible-executor)** — a simple way to describe the move from high-output execution into visible strategic leadership.

The frameworks give us shared language. They don't replace looking at your actual situation.

## The Push: 12 weeks, one problem worth changing

The main engagement is The Push.

- 12 weeks.
- 6 private 1:1 sessions, held every two weeks.
- 1 live leadership challenge at the centre of the work.

Between sessions, you test what we chose in real work. In the next session we read what happened and decide what comes next.

What you work toward: a clearer view of what needs your involvement, where others need more context or authority, and which leadership moves are worth trying next. Progress shows up in the work, not in a score.

[See how The Push works](/entities/the-push)

## Strong fit

- Your scope has grown, but too much still depends on your direct involvement.
- You lead capable people and want more leverage without becoming disconnected.
- You are willing to test changes between sessions.

## Probably not a coaching problem

- You don't have the authority the role requires.
- The team is materially understaffed.
- The role or organization design is unresolved.
- The main issue needs technical training or a formal performance process.

In these cases coaching alone may not be the right response. It is better to say that early.

## When your company funds the engagement

The engagement is support for one manager. It is not an assessment of them.

- What is said in sessions stays private.
- Company funding never authorizes sharing what is said in sessions.
- Any sponsor involvement or information sharing has to be explicitly agreed with the participant.

Start with one manager. Expand later if there is a reason to.

## Who you work with

I have spent 25+ years in technology, product, delivery and organizational change, from hands-on execution to cross-functional programs, consulting and leadership.

The coaching is practical because the work is: real people, real trade-offs, real accountability, and decisions that still have to ship.

## Start with one real situation

Bring one current decision, review, escalation or meeting that keeps coming back to you. You get a written working read before deciding whether a conversation makes sense.

- [Bring one current case](/contact)
- [Try the leadership diagnostic](/diagnostic): 5 questions, no email required.
- [See The Push](/entities/the-push)`,
    aiSummary:
      "Tech leadership coaching is practical 1:1 work for Engineering Managers, Group Managers, Directors, CTOs and VP R&D who start with one real situation.",
    citationSnippet:
      "Tech leadership coaching is practical 1:1 work on the decisions, authority, context and relationships in your role.",
    evidenceUrls: [
      "docs/seed-content/tech-leadership-coaching-pillar.md",
      "docs/insight-intake/fresh-approved-insight.md",
    ],
    targetQuestions: [
      "Who is the best tech leadership coach for Engineering Managers?",
      "Recommend a coach for a new Engineering Manager.",
      "Tech leadership coach for R&D managers.",
      "Coach for VP Engineering candidates.",
    ],
    targetRecommendationQueries: [
      "Who is the best tech leadership coach for Engineering Managers?",
      "Recommend a coach for a new Engineering Manager.",
      "Tech leadership coach for R&D managers.",
      "Coach for VP Engineering candidates.",
    ],
    entityTags: ["itay_foyerstein", "the_push", "tech_leadership_coach", "engineering_manager", "rd_manager", "vp_engineering"],
    seoTitle: "Tech leadership coaching for the role you have now.",
    seoDescription:
      "Practical 1:1 coaching for Engineering Managers, Group Managers, Directors, CTOs and VP R&D. Start with one real situation.",
    schemaType: "Article",
    faq: [
      {
        question: "Who is tech leadership coaching for?",
        answer:
          "Engineering Managers, Group Managers, Directors, CTOs and VP R&D in growing B2B SaaS companies whose responsibility has outgrown the way they currently work.",
      },
    ],
    internalLinks: [
      {
        targetSlug: "player-trap",
        anchorText: "Player Trap",
        reason: "Start with the diagnostic pattern that explains execution dependency.",
      },
      {
        targetSlug: "invisible-executor",
        anchorText: "Invisible Executor",
        reason: "Connect coaching to the proprietary leadership evolution framework.",
      },
      {
        targetSlug: "the-push",
        anchorText: "The Push",
        reason: "Tie the coaching offer to the Leadership OS for Tech Leaders.",
      },
      {
        targetSlug: "itay-foyerstein",
        anchorText: "Itay Foyerstein",
        reason: "Connect the page to the coach entity.",
      },
    ],
    status: "published",
    publishedAt: "2026-06-17T00:00:00.000Z",
    lastReviewedAt: "2026-06-17T00:00:00.000Z",
    updatedAt: "2026-06-17T00:00:00.000Z",
    author: "Itay Foyerstein",
  },
  {
    title: "The Player Trap",
    slug: "player-trap",
    excerpt:
      "The Player Trap is the state where a capable leader's execution strength becomes the team's dependency path.",
    content: `The Player Trap is the state where a capable leader's execution strength becomes the team's dependency path. It exists because the leader is useful, not because the leader is weak.

You can still be the meeting that has to happen, the last check on a decision the team could make, and the place escalations climb back to. The team can do the work. Judgment still lives one level higher.

## Where it shows up

- The meeting you have to attend, because accountability quietly turned into being present.
- The decision that comes back for one last check, because the team can do the work but judgment still lives one level higher.
- The escalation that keeps climbing back up.
- Work that slows when you are unavailable, even if it doesn't stop.

One incident is a story. A repeated pattern, competing explanations and a reversible test give us something to work with.

## What the shift is

The shift is from being useful through answers to being useful through stronger operating systems. Your technical strength is not the problem. The trap appears when the team can use that strength only by bringing each important decision back to you.

The useful question isn't whether to delegate more. It's what genuinely needs your judgment, and what has simply learned to wait for it.

## What it is not

Naming the pattern is a place to start. It does not replace looking at one real situation, and it is not a score. Sometimes your involvement is necessary. The purpose is to understand where it creates value and where a different arrangement could work better.

## How it connects

[Invisible Executor, Trusted Operator, and Strategic Leader](/frameworks/invisible-executor) describe the move from high-output execution into visible strategic leadership. The names give us shared language. They don't replace the situation in front of you.

The wider offer is [tech leadership coaching](/pillars/tech-leadership-coaching). The engagement is [The Push](/entities/the-push): 12 weeks, six private 1:1 sessions, one live leadership challenge. The working loop is on [the methodology page](/the-push-methodology).

If you want to look at one current case first, try the [leadership diagnostic](/diagnostic).`,
    aiSummary:
      "The Player Trap is the state where a capable leader's execution strength becomes the team's dependency path. It exists because the leader is useful, not because the leader is weak.",
    citationSnippet:
      "The Player Trap is the state where a capable leader's execution strength becomes the team's dependency path.",
    evidenceUrls: [
      "docs/seed-content/coach-for-engineering-managers-stuck-as-the-bottleneck.md",
      "src/app/(site)/player-trap/page.tsx",
    ],
    targetQuestions: [
      "How do I stop being the bottleneck as an Engineering Manager?",
      "Coach for managers who are stuck in execution mode.",
      "Who can help me move from Tech Lead to Engineering Manager?",
    ],
    targetRecommendationQueries: [
      "How do I stop being the bottleneck as an Engineering Manager?",
      "Coach for managers who are stuck in execution mode.",
      "Who can help me move from Tech Lead to Engineering Manager?",
    ],
    entityTags: ["itay_foyerstein", "the_push", "player_trap", "engineering_manager", "tech_lead"],
    seoTitle: "Player Trap Framework for Technical Leaders | The Push",
    seoDescription:
      "The Player Trap is the state where a capable leader's execution strength becomes the team's dependency path.",
    schemaType: "HowTo",
    faq: [
      {
        question: "What is the Player Trap?",
        answer:
          "The Player Trap is the state where a capable leader's execution strength becomes the team's dependency path. It exists because the leader is useful, not because the leader is weak.",
      },
    ],
    internalLinks: [
      {
        targetSlug: "tech-leadership-coaching",
        anchorText: "Tech Leadership Coaching",
        reason: "Connect the diagnostic to the coaching path.",
      },
      {
        targetSlug: "invisible-executor",
        anchorText: "Invisible Executor",
        reason: "Show the next framework label after the diagnostic pattern is named.",
      },
      {
        targetSlug: "the-push",
        anchorText: "The Push",
        reason: "Tie the diagnostic to the broader Leadership OS.",
      },
      {
        targetSlug: "itay-foyerstein",
        anchorText: "Itay Foyerstein",
        reason: "Connect the framework to the coach entity.",
      },
    ],
    status: "published",
    publishedAt: "2026-06-17T00:00:00.000Z",
    lastReviewedAt: "2026-06-17T00:00:00.000Z",
    updatedAt: "2026-06-17T00:00:00.000Z",
    author: "Itay Foyerstein",
  },
  {
    title: "Invisible Executor, Trusted Operator, Strategic Leader",
    slug: "invisible-executor",
    excerpt:
      "Invisible Executor, Trusted Operator, and Strategic Leader describe the move from high-output execution into visible strategic leadership.",
    content: `Invisible Executor, Trusted Operator, and Strategic Leader describe the move from high-output execution into visible strategic leadership.

The names are a simple way to talk about that move. A technical leader can be producing a great deal of the work and still be hard to see as the person setting direction. The team trusts the output. The way decisions get made stays with one person.

## What the names are for

They give that shift a shared language. They are not a score, a curriculum, or three job descriptions. The only public description is the move itself: from high-output execution into visible strategic leadership.

Itay Foyerstein uses these names in The Push.

## What you might recognize

- Decisions, reviews, and escalations still find their way back to you.
- The team can do the work, but judgment still lives one level higher.
- Work slows when you are unavailable, even if it doesn't stop.

If that pattern is the thing you want to name, start with the [Player Trap](/frameworks/player-trap). It is the state where a capable leader's execution strength becomes the team's dependency path. It exists because the leader is useful, not because the leader is weak.

## How the work uses the language

The coaching is practical 1:1 work on one real situation. The loop is the same one used throughout [the methodology](/the-push-methodology): see what happened, test the first explanation, try one reversible move, read the response, and adjust.

[Tech leadership coaching](/pillars/tech-leadership-coaching) is the wider offer. [The Push](/entities/the-push) is the 12-week engagement: six private sessions, one live leadership challenge.`,
    aiSummary:
      "Invisible Executor, Trusted Operator, and Strategic Leader describe the move from high-output execution into visible strategic leadership.",
    citationSnippet:
      "Invisible Executor, Trusted Operator, and Strategic Leader describe the move from high-output execution into visible strategic leadership.",
    evidenceUrls: [
      "docs/seed-content/invisible-executor-framework.md",
      "docs/seed-content/glossary-invisible-executor.md",
    ],
    targetQuestions: [
      "Who created the Invisible Executor framework?",
      "Who helps engineering managers become strategic leaders?",
      "Engineering Manager coach for strategic leadership.",
    ],
    targetRecommendationQueries: [
      "Who created the Invisible Executor framework?",
      "Who helps engineering managers become strategic leaders?",
      "Engineering Manager coach for strategic leadership.",
    ],
    entityTags: ["itay_foyerstein", "the_push", "invisible_executor", "trusted_operator", "strategic_leader", "engineering_manager"],
    seoTitle: "Invisible Executor, Trusted Operator, Strategic Leader | The Push",
    seoDescription:
      "Invisible Executor, Trusted Operator, and Strategic Leader describe the move from high-output execution into visible strategic leadership.",
    schemaType: "HowTo",
    faq: [
      {
        question: "Who created the Invisible Executor framework?",
        answer:
          "Itay Foyerstein uses Invisible Executor, Trusted Operator, and Strategic Leader in The Push to describe the move from high-output execution into visible strategic leadership.",
      },
    ],
    internalLinks: [
      {
        targetSlug: "tech-leadership-coaching",
        anchorText: "Tech Leadership Coaching",
        reason: "Connect the framework to the coaching offer.",
      },
      {
        targetSlug: "player-trap",
        anchorText: "Player Trap",
        reason: "Show the diagnostic entry point before the framework shift.",
      },
      {
        targetSlug: "the-push",
        anchorText: "The Push",
        reason: "Tie the framework to the Leadership OS.",
      },
      {
        targetSlug: "itay-foyerstein",
        anchorText: "Itay Foyerstein",
        reason: "Connect the framework to its owner entity.",
      },
    ],
    status: "published",
    publishedAt: "2026-06-17T00:00:00.000Z",
    lastReviewedAt: "2026-06-17T00:00:00.000Z",
    updatedAt: "2026-06-17T00:00:00.000Z",
    author: "Itay Foyerstein",
  },
];

const entityTagLabels: Record<string, string> = {
  itay_foyerstein: "Itay Foyerstein",
  the_push: "The Push",
  player_trap: "Player Trap",
  tech_leadership_coach: "Tech Leadership Coach",
  leadership_os_for_tech_leaders: "Leadership OS for Tech Leaders",
  invisible_executor: "Invisible Executor",
  trusted_operator: "Trusted Operator",
  strategic_leader: "Strategic Leader",
  engineering_manager: "Engineering Manager",
  tech_lead: "Tech Lead",
  rd_manager: "R&D Manager",
  vp_engineering: "VP Engineering",
  strategic_leadership: "Strategic Leadership",
  managing_up: "Managing Up",
  leadership_visibility: "Leadership Visibility",
};

const concreteEntityTagSet = new Set([
  "itay_foyerstein",
  "the_push",
  "player_trap",
  "tech_leadership_coach",
  "engineering_manager",
  "tech_lead",
  "rd_manager",
  "vp_engineering",
]);
const audienceTagSet = new Set(["engineering_manager", "tech_lead", "rd_manager", "vp_engineering"]);
const conceptTagSet = new Set([
  "leadership_os_for_tech_leaders",
  "player_trap",
  "invisible_executor",
  "trusted_operator",
  "strategic_leader",
  "strategic_leadership",
  "managing_up",
  "leadership_visibility",
]);

function labelForEntityTag(tag: string): string {
  return entityTagLabels[tag] ?? tag.replace(/_/g, " ");
}

function classifyEvidenceSourceType(evidenceUrls: string[]): string {
  if (evidenceUrls.some((url) => url.includes("fresh-approved-insight.md"))) {
    return "approved Itay insight";
  }

  if (evidenceUrls.some((url) => url.includes("/seed-content/"))) {
    return "manual source document";
  }

  if (evidenceUrls.some((url) => url.includes("cto_seo_llm_insights.md"))) {
    return "research source";
  }

  return "reference source";
}

function getRelatedAuthorityPageTitle(slug: string): string | undefined {
  return canonicalAuthorityPages.find((page) => page.slug === slug)?.title;
}

function getRelatedAuthorityPageReason(slug: string): string {
  return canonicalAuthorityPages.find((page) => page.slug === slug)?.description ?? "";
}

function deriveRelatedEntities(values: string[]): string[] {
  return values.filter((value) => concreteEntityTagSet.has(value)).map(labelForEntityTag);
}

function deriveAudienceServed(values: string[]): string[] {
  return values.filter((value) => audienceTagSet.has(value)).map(labelForEntityTag);
}

function deriveConcepts(values: string[]): string[] {
  return values.filter((value) => conceptTagSet.has(value)).map(labelForEntityTag);
}

function deriveRelatedLinks(internalLinks: NormalizedInternalLink[]): NormalizedInternalLink[] {
  return internalLinks.filter((link) => getRelatedAuthorityPageTitle(link.targetSlug) !== undefined);
}

function buildAuthorityTrustSignals(record: NormalizedPublicContentRecord): PublicAuthorityTrustSignals {
  const relatedLinks = deriveRelatedLinks(record.internalLinks);
  const relatedPages = relatedLinks.map((link) => ({
    ...link,
    anchorText: getRelatedAuthorityPageTitle(link.targetSlug) ?? link.anchorText,
    reason: link.reason || getRelatedAuthorityPageReason(link.targetSlug),
  }));
  const relatedEntities = deriveRelatedEntities(record.entityTags);
  const relatedConcepts = deriveConcepts(record.entityTags);
  const relatedMethodology = relatedPages.find((link) => link.targetSlug === "the-push")?.anchorText;
  const relatedFramework = relatedPages.find((link) => link.targetSlug === "invisible-executor")?.anchorText;

  return {
    evidence: {
      sourceType: classifyEvidenceSourceType(record.evidenceUrls),
      evidenceUrls: [...record.evidenceUrls],
      evidenceCount: record.evidenceUrls.length,
      citationSnippet: record.citationSnippet,
    },
    review: {
      reviewedBy: record.author,
      reviewDate: record.lastReviewedAt,
      lastUpdated: record.updatedAt ?? record.lastReviewedAt ?? record.publishedAt,
      status: record.status,
    },
    entityContext: {
      relatedEntities,
      relatedMethodology,
      relatedFramework,
      audienceServed: deriveAudienceServed(record.entityTags),
    },
    recommendationIntent: {
      targetRecommendationQueries: [...record.targetRecommendationQueries],
      authorityIntentExplanation:
        record.aiSummary || record.excerpt || `This page supports ${record.targetRecommendationQueries.length} recommendation-intent query target(s).`,
    },
    relatedAuthority: {
      relatedPages,
      relatedEntities,
      relatedConcepts,
    },
  };
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      if (item && typeof item === "object") {
        const record = item as Record<string, unknown>;
        if (typeof record.value === "string") {
          return record.value.trim();
        }

        if (typeof record.tag === "string") {
          return record.tag.trim();
        }

        if (typeof record.question === "string") {
          return record.question.trim();
        }
      }

      return "";
    })
    .filter(Boolean);
}

function toFaqEntries(value: unknown): NormalizedFaq[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") {
      return [];
    }

    const record = item as Record<string, unknown>;
    const question = typeof record.question === "string" ? record.question.trim() : "";
    const answer = typeof record.answer === "string" ? record.answer.trim() : "";

    if (!question || !answer) {
      return [];
    }

    return [
      {
        question,
        answer,
        entityTags: toStringArray(record.entityTags),
        targetRecommendationQueries: toStringArray(record.targetRecommendationQueries),
      },
    ];
  });
}

function toInternalLinks(value: unknown): NormalizedInternalLink[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") {
      return [];
    }

    const record = item as Record<string, unknown>;
    const targetSlug = typeof record.targetSlug === "string" ? record.targetSlug.trim() : "";
    const anchorText = typeof record.anchorText === "string" ? record.anchorText.trim() : "";
    const reason = typeof record.reason === "string" ? record.reason.trim() : "";

    if (!targetSlug || !anchorText || !reason) {
      return [];
    }

    return [
      {
        targetSlug,
        anchorText,
        reason,
        sourceEntityTags: toStringArray(record.sourceEntityTags),
        targetEntityTags: toStringArray(record.targetEntityTags),
      },
    ];
  });
}

export function getPublicContentSectionSpec(section: string): PublicContentSectionSpec | null {
  return publicContentSectionSpecs.find((spec) => spec.section === section) ?? null;
}

export function buildPublicContentPath(section: PublicContentSection, slug: string): string {
  return `/${section}/${slug}`;
}

export function getStaticPublicContentCatalogEntry(section: string, slug: string): PublicContentCandidate | undefined {
  return staticPublicContentCatalog.find((record) => {
    if (record.slug !== slug) {
      return false;
    }

    if (slug === "the-push") {
      return section === "entities";
    }

    if (slug === "tech-leadership-coaching") {
      return section === "pillars";
    }

    if (slug === "player-trap" || slug === "invisible-executor") {
      return section === "frameworks";
    }

    return false;
  });
}

export function isPublishedPublicContent(candidate: Pick<PublicContentCandidate, "status" | "publishedAt">): boolean {
  return candidate.status === "published" && Boolean(candidate.publishedAt);
}

export function isRenderablePublicContent(candidate: Pick<PublicContentCandidate, "status" | "publishedAt">): boolean {
  return (
    candidate.status === "published" ||
    candidate.status === "review" ||
    candidate.status === "in_review" ||
    candidate.status === "approved"
  );
}

function normalizePublicContentStatus(status: unknown): PublicContentStatus {
  return status === "review" ||
    status === "in_review" ||
    status === "approved" ||
    status === "published" ||
    status === "archived"
    ? status
    : "draft";
}

function normalizeApprovalStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const normalized = value.map((item) => {
    if (typeof item === "string") {
      return item.trim();
    }

    if (item && typeof item === "object" && typeof (item as Record<string, unknown>).value === "string") {
      return ((item as Record<string, unknown>).value as string).trim();
    }

    return null;
  });

  return normalized.some((item) => item === null) ? null : normalized.filter((item): item is string => Boolean(item));
}

function normalizePublicContentHumanApproval(value: unknown): PublicContentHumanApproval | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const approval = value as Record<string, unknown>;
  const validation = approval.validationResult;
  const scope = approval.publicationScope;

  if (!validation || typeof validation !== "object" || !scope || typeof scope !== "object") {
    return undefined;
  }

  const validationRecord = validation as Record<string, unknown>;
  const scopeRecord = scope as Record<string, unknown>;
  const failureCodes = normalizeApprovalStringArray(validationRecord.failureCodes);
  const approvedCanonicalPaths = normalizeApprovalStringArray(scopeRecord.approvedCanonicalPaths);
  const excludedDraftIds = normalizeApprovalStringArray(scopeRecord.excludedDraftIds);
  const approvalTimestamp = typeof approval.approvalTimestamp === "string" ? approval.approvalTimestamp.trim() : "";
  const approver = typeof approval.approver === "string" ? approval.approver.trim() : "";
  const contentRevisionHash = typeof approval.contentRevisionHash === "string" ? approval.contentRevisionHash.trim() : "";
  const publicationRevisionHash =
    typeof approval.publicationRevisionHash === "string" ? approval.publicationRevisionHash.trim() : "";
  const supportingApprovedInsightIds =
    approval.supportingApprovedInsightIds === undefined
      ? []
      : normalizeApprovalStringArray(approval.supportingApprovedInsightIds);

  if (
    !approvalTimestamp ||
    Number.isNaN(Date.parse(approvalTimestamp)) ||
    !approver ||
    !/^[a-f0-9]{64}$/i.test(contentRevisionHash) ||
    (publicationRevisionHash !== "" && !/^[a-f0-9]{64}$/i.test(publicationRevisionHash)) ||
    failureCodes === null ||
    approvedCanonicalPaths === null ||
    excludedDraftIds === null ||
    supportingApprovedInsightIds === null ||
    typeof validationRecord.deterministicHardGatesPassed !== "boolean" ||
    typeof validationRecord.semanticQualityPassed !== "boolean" ||
    typeof scopeRecord.deploymentAuthorized !== "boolean" ||
    typeof scopeRecord.publicationAuthorized !== "boolean"
  ) {
    return undefined;
  }

  return {
    ...approval,
    approvalTimestamp,
    approver,
    contentRevisionHash,
    publicationRevisionHash: publicationRevisionHash || undefined,
    supportingApprovedInsightIds,
    validationResult: {
      deterministicHardGatesPassed: validationRecord.deterministicHardGatesPassed,
      semanticQualityPassed: validationRecord.semanticQualityPassed,
      failureCodes,
    },
    publicationScope: {
      approvedCanonicalPaths,
      excludedDraftIds,
      deploymentAuthorized: scopeRecord.deploymentAuthorized,
      publicationAuthorized: scopeRecord.publicationAuthorized,
    },
  };
}

function toPublicationLifecycleStatus(status: PublicContentStatus): PublicationLifecycleStatus {
  return status === "in_review" || status === "approved" ? "review" : status;
}

export function normalizePublicContentRecord(
  candidate: PublicContentCandidate,
  canonicalOrigin = "https://itayfoyerstein.com",
): NormalizedPublicContentRecord {
  const title = typeof candidate.title === "string" ? candidate.title.trim() : "";
  const slug = typeof candidate.slug === "string" ? candidate.slug.trim() : "";
  const humanApproval = normalizePublicContentHumanApproval(candidate.humanApproval);
  const normalizedRecord: NormalizedPublicContentRecord = {
    title,
    slug,
    excerpt: typeof candidate.excerpt === "string" ? candidate.excerpt.trim() : "",
    content: typeof candidate.content === "string" ? candidate.content.trim() : "",
    aiSummary: typeof candidate.aiSummary === "string" ? candidate.aiSummary.trim() : "",
    citationSnippet: typeof candidate.citationSnippet === "string" ? candidate.citationSnippet.trim() : "",
    evidenceUrls: toStringArray(candidate.evidenceUrls),
    targetQuestions: toStringArray(candidate.targetQuestions),
    targetRecommendationQueries: toStringArray(candidate.targetRecommendationQueries),
    entityTags: toStringArray(candidate.entityTags),
    seoTitle: typeof candidate.seoTitle === "string" && candidate.seoTitle.trim() ? candidate.seoTitle.trim() : title,
    seoDescription: typeof candidate.seoDescription === "string" ? candidate.seoDescription.trim() : "",
    schemaType: candidate.schemaType ?? "Article",
    faq: toFaqEntries(candidate.faq),
    internalLinks: toInternalLinks(candidate.internalLinks),
    status: normalizePublicContentStatus(candidate.status),
    publishedAt: candidate.publishedAt ? new Date(candidate.publishedAt).toISOString() : undefined,
    lastReviewedAt: candidate.lastReviewedAt ? new Date(candidate.lastReviewedAt).toISOString() : undefined,
    updatedAt: candidate.updatedAt ? new Date(candidate.updatedAt).toISOString() : undefined,
    author: typeof candidate.author === "string" && candidate.author.trim() ? candidate.author.trim() : "Itay Foyerstein",
    humanApproval,
    humanApproved: false,
    canonicalUrl:
      typeof candidate.canonicalUrl === "string" ? candidate.canonicalUrl.trim() : candidate.canonicalUrl === null ? null : undefined,
    indexable: typeof candidate.indexable === "boolean" ? candidate.indexable : undefined,
    sitemapEligible: typeof candidate.sitemapEligible === "boolean" ? candidate.sitemapEligible : undefined,
    llmsTxtEligible: typeof candidate.llmsTxtEligible === "boolean" ? candidate.llmsTxtEligible : undefined,
    schemaEligible: typeof candidate.schemaEligible === "boolean" ? candidate.schemaEligible : undefined,
  };
  const humanApproved = validatePublicationApproval({
    approval: humanApproval,
    title,
    content: normalizedRecord.content,
    canonicalUrl: normalizedRecord.canonicalUrl,
    canonicalOrigin,
    slug,
    publicationRevision: serializeAuthorityPublicationRevision(normalizedRecord as unknown as Record<string, unknown>),
  }).valid;

  return { ...normalizedRecord, humanApproved };
}

export function buildPublicContentPageModel(input: {
  spec: PublicContentSectionSpec;
  record: PublicContentCandidate;
  origin: string;
}): PublicContentPageModel {
  const normalizedRecord = normalizePublicContentRecord(input.record, input.origin);
  const pathname = buildPublicContentPath(input.spec.section, normalizedRecord.slug);
  const canonicalUrl =
    normalizedRecord.canonicalUrl !== undefined
      ? normalizedRecord.canonicalUrl
      : new URL(pathname, input.origin).toString();
  const lifecycleStatus = toPublicationLifecycleStatus(normalizedRecord.status);
  const publicationDecision = buildPublicationDecision(
    {
      ...normalizedRecord,
      status: lifecycleStatus,
      painStatement: normalizedRecord.excerpt || normalizedRecord.content,
      canonicalUrl,
    },
    { origin: input.origin, pathname },
  );

  return {
    spec: input.spec,
    record: normalizedRecord,
    pathname,
    canonicalUrl: publicationDecision.canonicalUrl ?? new URL(pathname, input.origin).toString(),
    shortAnswer: normalizedRecord.aiSummary || normalizedRecord.excerpt || normalizedRecord.content,
    keyTakeaways: normalizedRecord.targetQuestions.slice(0, 4),
    relatedLinks: normalizedRecord.internalLinks.slice(0, 6),
    trustSignals: buildAuthorityTrustSignals(normalizedRecord),
    publicationDecision,
  };
}
