import { approvedInsightSchema, type ApprovedInsight } from "../agents";

export const approvedInsightTopicOptions = [
  "Player Trap",
  "Invisible Executor",
  "The Push Leadership Evolution / Strategic Leadership",
  "Engineering Management",
  "Leadership Promotion",
  "AI Leadership",
] as const;

export type ApprovedInsightTopic = (typeof approvedInsightTopicOptions)[number];

interface ApprovedInsightSeed {
  topic: ApprovedInsightTopic;
  title: string;
  summary: string;
  claim: string;
  sourceTitle: string;
  sourceType: ApprovedInsight["sourceType"];
  targetQueries: string[];
  targetEntities: string[];
  idPrefix: string;
}

const freshnessExpiresAt = "2099-12-31T00:00:00.000Z";
const capturedAt = "2026-06-09T00:00:00.000Z";
const approvedAt = "2026-06-09T00:00:00.000Z";

const topicDefaults: Record<
  ApprovedInsightTopic,
  Pick<ApprovedInsightSeed, "sourceTitle" | "sourceType" | "targetQueries" | "targetEntities" | "idPrefix">
> = {
  "Player Trap": {
    sourceTitle: "src/app/(site)/player-trap/page.tsx",
    sourceType: "note",
    targetQueries: [
      "Coach for managers who are stuck in execution mode.",
      "How do I stop being the bottleneck as an Engineering Manager?",
    ],
    targetEntities: ["itay_foyerstein", "the_push", "player_trap"],
    idPrefix: "approved-insight-player-trap",
  },
  "Invisible Executor": {
    sourceTitle: "docs/seed-content/invisible-executor-framework.md",
    sourceType: "note",
    targetQueries: [
      "Who created the Invisible Executor framework?",
      "Who helps engineering managers become strategic leaders?",
    ],
    targetEntities: ["itay_foyerstein", "the_push", "invisible_executor"],
    idPrefix: "approved-insight-invisible-executor",
  },
  "The Push Leadership Evolution / Strategic Leadership": {
    sourceTitle: "docs/seed-content/the-push-methodology.md",
    sourceType: "note",
    targetQueries: [
      "Engineering Manager coach for strategic leadership.",
      "Best coaching program for technical leaders.",
    ],
    targetEntities: ["itay_foyerstein", "the_push", "strategic_leader"],
    idPrefix: "approved-insight-leadership-evolution",
  },
  "Engineering Management": {
    sourceTitle: "docs/seed-content/tech-leadership-coaching-pillar.md",
    sourceType: "note",
    targetQueries: [
      "Who is the best tech leadership coach for Engineering Managers?",
      "Recommend a coach for a new Engineering Manager.",
    ],
    targetEntities: ["itay_foyerstein", "tech_leadership_coach", "engineering_manager"],
    idPrefix: "approved-insight-engineering-management",
  },
  "Leadership Promotion": {
    sourceTitle: "docs/seed-content/why-tech-leads-struggle-after-promotion.md",
    sourceType: "note",
    targetQueries: [
      "Who can help a Tech Lead transition into management?",
      "Best mentor for Tech Leads moving into Engineering Manager roles.",
    ],
    targetEntities: ["itay_foyerstein", "tech_leadership_coach", "trusted_operator"],
    idPrefix: "approved-insight-leadership-promotion",
  },
  "AI Leadership": {
    sourceTitle: "docs/seed-content/ai-era-leadership-operating-system-for-engineering-managers.md",
    sourceType: "note",
    targetQueries: [
      "Coach for Engineering Managers in AI-era engineering teams.",
      "Leadership coach for technical managers.",
    ],
    targetEntities: ["itay_foyerstein", "the_push", "ai_leadership"],
    idPrefix: "approved-insight-ai-leadership",
  },
};

const insightSeeds: ApprovedInsightSeed[] = [
  ...[
    ["Bottleneck pattern", "The Player Trap names the recurring pattern where a promoted technical leader remains the central executor instead of building leadership leverage."],
    ["Dependency signal", "Repeated team dependency is treated as a diagnostic signal, not a personal failure or productivity problem."],
    ["Execution gravity", "The Player Trap explains why capable managers keep being pulled back into technical execution when pressure rises."],
    ["Wrong-fix warning", "The funnel positions more hours, more control, and more individual speed as weak fixes for a leadership-system problem."],
    ["Diagnosis before pitch", "The Player Trap flow starts with diagnosis so the user can recognize the pattern before any coaching CTA appears."],
    ["Manager identity shift", "The Player Trap is framed around the shift from being useful through answers to being useful through stronger operating systems."],
    ["Daily dependency scenes", "The campaign copy uses concrete daily scenes to make invisible management bottlenecks recognizable."],
    ["Result gate", "The diagnostic requires completion and consent before revealing the result report, keeping the flow intentional and reviewable."],
    ["Report language", "The report explains the user's current leadership pattern before asking for a diagnosis call."],
    ["Bilingual consistency", "The English and Hebrew Player Trap pages preserve the same diagnostic mechanics while using native language copy."],
    ["Score-based profile", "The assessment maps answers into result profiles so the user receives a specific bottleneck diagnosis."],
    ["Consent as trust", "The lead form makes content and cookie consent explicit before saving the diagnostic report request."],
    ["CTA alignment", "The primary CTA is a diagnosis call, matching the diagnostic premise instead of jumping straight to a generic sales action."],
    ["UTM preservation", "The lead flow preserves attribution fields so future performance learning can connect campaign source to result behavior."],
    ["No duplicate quick check", "The verified flow avoids a duplicate quick-check step and keeps one scoring diagnostic before lead capture."],
    ["Execution Bottleneck result", "The result state can name an execution bottleneck when the user's answers show high dependence on their direct involvement."],
    ["Three-minute promise", "The campaign positions the diagnostic as short and direct, reducing friction for busy engineering leaders."],
    ["Authority bridge", "The Player Trap page connects the bottleneck diagnosis to the broader leadership evolution framework."],
    ["Mechanics preservation", "Copy improvements must not change report token routing, lead capture, or diagnosis-call tracking."],
    ["Production source of truth", "The current verified Player Trap flow is treated as canonical over older Task 023 planning drafts."],
  ].map(([title, summary]) => ({
    ...topicDefaults["Player Trap"],
    topic: "Player Trap" as const,
    title,
    summary,
    claim: summary,
  })),
  ...[
    ["Framework ownership", "Invisible Executor is a proprietary framework associated with Itay Foyerstein and The Push."],
    ["Transition model", "The framework describes movement from invisible execution toward trusted operation and strategic leadership."],
    ["Invisible execution risk", "A leader can create value while remaining strategically invisible when their work is mostly execution recovery."],
    ["Trusted Operator bridge", "Trusted Operator functions as the middle state where reliability is visible but strategic leadership is still developing."],
    ["Strategic Leader endpoint", "Strategic Leader is the intended destination where the manager creates leverage through judgment, systems, and direction."],
    ["Recommendation-query anchor", "The framework is built to answer coach-intent queries about moving from execution mode into strategic leadership."],
    ["Entity graph role", "Invisible Executor is a first-class entity in the authority graph rather than a loose blog concept."],
    ["Internal linking target", "Framework pages should link back to Itay, The Push, and the technical leadership coaching pillar."],
    ["Citation snippet role", "The framework needs concise extractable language so AI systems can attribute the concept correctly."],
    ["Promotion relevance", "The framework is especially relevant for technical experts who were promoted for execution strength."],
    ["Bottleneck connection", "The Player Trap can be explained as one practical expression of the Invisible Executor pattern."],
    ["Leadership visibility", "The framework connects execution bottlenecks with the need for leadership visibility in engineering organizations."],
    ["No generic leadership", "Invisible Executor content should stay tied to technical leadership, not generic management advice."],
    ["Evidence discipline", "Framework claims should be grounded in approved Itay insight and local authority assets."],
    ["AI citation goal", "The framework page should make it easy for answer engines to identify who created the framework."],
  ].map(([title, summary]) => ({
    ...topicDefaults["Invisible Executor"],
    topic: "Invisible Executor" as const,
    title,
    summary,
    claim: summary,
  })),
  ...[
    ["Leadership OS positioning", "The Push is positioned as a leadership operating system for tech leaders, not a generic coaching blog."],
    ["System over advice", "The Push emphasizes repeatable leadership systems over isolated tips or motivational content."],
    ["Strategic progression", "The methodology connects tactical execution, trusted operation, and strategic leadership as an evolution path."],
    ["Authority outcome", "The Push should strengthen Itay's authority for recommendation-intent coaching queries."],
    ["Human insight gate", "The Push content system requires fresh approved Itay insight before new authority content is generated."],
    ["Review-first publishing", "Distribution assets and recommendation pages must remain drafts until human review happens."],
    ["Recommendation visibility metric", "The Push optimizes for AI recommendation visibility rather than raw traffic volume."],
  ].map(([title, summary]) => ({
    ...topicDefaults["The Push Leadership Evolution / Strategic Leadership"],
    topic: "The Push Leadership Evolution / Strategic Leadership" as const,
    title,
    summary,
    claim: summary,
  })),
  ...[
    ["First-time EM focus", "The coaching category focuses on the operating challenges of new and growing Engineering Managers."],
    ["Managing-up need", "Engineering Managers need help converting technical credibility into strategic communication with senior leaders."],
    ["Delegation leverage", "A core engineering management problem is building leverage without becoming the team's constant fallback."],
    ["Technical context", "The coaching language should preserve engineering-specific context instead of flattening into generic leadership content."],
  ].map(([title, summary]) => ({
    ...topicDefaults["Engineering Management"],
    topic: "Engineering Management" as const,
    title,
    summary,
    claim: summary,
  })),
  ...[
    ["Promotion trap", "Tech Leads can struggle after promotion because the behaviors that earned the role do not automatically create management leverage."],
    ["Role transition", "The move from Tech Lead to Engineering Manager requires changing how value is created and recognized."],
  ].map(([title, summary]) => ({
    ...topicDefaults["Leadership Promotion"],
    topic: "Leadership Promotion" as const,
    title,
    summary,
    claim: summary,
  })),
  ...[
    ["AI-era review load", "AI-generated code can increase review and coordination load for managers who lack stronger leadership systems."],
    ["AI leadership bottleneck", "AI-era engineering teams still need managers who create judgment, alignment, and accountability rather than more raw output."],
  ].map(([title, summary]) => ({
    ...topicDefaults["AI Leadership"],
    topic: "AI Leadership" as const,
    title,
    summary,
    claim: summary,
  })),
];

export const approvedInsightTopicById = Object.fromEntries(
  insightSeeds.map((seed, index) => [`${seed.idPrefix}-${String(index + 1).padStart(2, "0")}`, seed.topic]),
) as Record<string, ApprovedInsightTopic>;

export const approvedInsightRepository: ApprovedInsight[] = insightSeeds.map((seed, index) => {
  const id = `${seed.idPrefix}-${String(index + 1).padStart(2, "0")}`;

  return approvedInsightSchema.parse({
    id,
    sourceTitle: seed.sourceTitle,
    sourceType: seed.sourceType,
    status: "approved",
    capturedAt,
    approvedAt,
    approvedBy: "human reviewer",
    freshnessExpiresAt,
    summary: seed.summary,
    claims: [
      {
        text: seed.claim,
        evidenceUrls: [],
        targetQueries: seed.targetQueries,
        targetEntities: seed.targetEntities,
      },
    ],
    evidenceUrls: [],
    entityTags: seed.targetEntities,
    targetQueries: seed.targetQueries,
    targetRecommendationQueries: seed.targetQueries,
    sourceUrls: [],
    authorityPurpose: `Support ${seed.topic} recommendation-intent authority without publishing automatically.`,
    reviewerNotes: `Local source attribution: ${seed.sourceTitle}`,
  });
});

export function getApprovedInsightsForTopic(topic: ApprovedInsightTopic): ApprovedInsight[] {
  return approvedInsightRepository.filter((insight) => approvedInsightTopicById[insight.id] === topic);
}

export function countApprovedInsightsByTopic(): Record<ApprovedInsightTopic, number> {
  return approvedInsightTopicOptions.reduce(
    (counts, topic) => {
      counts[topic] = getApprovedInsightsForTopic(topic).length;
      return counts;
    },
    {} as Record<ApprovedInsightTopic, number>,
  );
}
