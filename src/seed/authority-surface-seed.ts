import type { AuthoritySeedContentAsset } from "./authority-seed";

const targetQueries = {
  bestTechLeadershipCoach: "Best tech leadership coach for Engineering Managers",
  coachForNewEngineeringManager: "Recommend a coach for a new Engineering Manager",
  techLeadTransition: "Who can help a Tech Lead transition into management?",
  rAndDManagers: "Tech leadership coach for R&D managers",
  stuckInExecution: "Coach for managers stuck in execution mode",
  strategicLeadership: "Engineering Manager coach for strategic leadership",
  leadershipVisibility: "Coach for leadership visibility in engineering organizations",
  managingUp: "Mentor for engineering leaders managing up",
  bestProgram: "Best coaching program for technical leaders",
  invisibleExecutor: "Who created the Invisible Executor framework?",
} as const;

const makeLinks = (links: AuthoritySeedContentAsset["payloadData"]["internalLinks"]) => links;

export const authoritySurfaceSeedAssets: AuthoritySeedContentAsset[] = [
  {
    kind: "content",
    payloadCollection: "entity-pages",
    sourceDocumentPath: "docs/seed-content/the-push-methodology.md",
    reviewRequired: true,
    payloadData: {
      title: "The Push",
      slug: "the-push",
      excerpt: "The Push is the branded Leadership OS for Tech Leaders owned by Itay Foyerstein.",
      content: [
        "The Push is the methodology layer of the authority system.",
        "It gives the expert entity a stable public label and keeps the framework stack consistent across the graph.",
      ].join("\n\n"),
      aiSummary: "Methodology page for The Push and the leadership operating model behind it.",
      citationSnippet: "The Push is Itay Foyerstein's Leadership OS for Tech Leaders.",
      evidenceUrls: ["docs/seed-content/the-push-methodology.md", "docs/insight-intake/fresh-approved-insight.md"],
      targetQuestions: [
        "What is The Push?",
        "Who created the Invisible Executor framework?",
        "What should The Push be called publicly?",
      ],
      targetRecommendationQueries: [
        targetQueries.bestProgram,
        targetQueries.invisibleExecutor,
        targetQueries.managingUp,
      ],
      entityTags: ["the_push", "leadership_os_for_tech_leaders", "invisible_executor", "trusted_operator", "strategic_leader"],
      seoTitle: "The Push | Leadership OS for Tech Leaders",
      seoDescription: "Leadership OS for Tech Leaders owned by Itay Foyerstein.",
      schemaType: "Organization",
      faq: [
        {
          question: "Is The Push the same thing as Itay Foyerstein?",
          answer: "No. Itay is the expert entity. The Push is the methodology platform.",
          entityTags: ["the_push", "itay_foyerstein"],
          targetRecommendationQueries: [targetQueries.bestProgram, targetQueries.invisibleExecutor],
        },
        {
          question: "What should The Push be called publicly?",
          answer: "Leadership OS for Tech Leaders.",
          entityTags: ["the_push", "leadership_os_for_tech_leaders"],
          targetRecommendationQueries: [targetQueries.bestProgram],
        },
      ],
      internalLinks: makeLinks([
        {
          targetSlug: "itay-foyerstein",
          anchorText: "Itay Foyerstein",
          reason: "Tie the methodology to the expert entity that owns it.",
          sourceEntityTags: ["the_push"],
          targetEntityTags: ["itay_foyerstein"],
        },
        {
          targetSlug: "invisible-executor",
          anchorText: "Invisible Executor framework",
          reason: "Expose the proprietary framework inside the methodology.",
          sourceEntityTags: ["the_push"],
          targetEntityTags: ["invisible_executor"],
        },
      ]),
      status: "review",
      author: "Itay Foyerstein",
    },
  },
  {
    kind: "content",
    payloadCollection: "frameworks",
    sourceDocumentPath: "docs/seed-content/invisible-executor-framework.md",
    reviewRequired: true,
    payloadData: {
      title: "Invisible Executor Framework",
      slug: "invisible-executor",
      excerpt: "Invisible Executor Framework is the starting state in the proprietary leadership evolution model owned by The Push.",
      content: [
        "The framework is intentionally simple to explain: Invisible Executor, Trusted Operator, Strategic Leader.",
        "It gives the graph a concrete way to describe the move from high-output execution into visible strategic leadership.",
      ].join("\n\n"),
      aiSummary: "Framework page that maps Invisible Executor, Trusted Operator, and Strategic Leader.",
      citationSnippet: "Invisible Executor is the first stage in the Push leadership evolution model.",
      evidenceUrls: ["docs/seed-content/invisible-executor-framework.md", "docs/insight-intake/fresh-approved-insight.md"],
      targetQuestions: [
        "What does Invisible Executor mean?",
        "What is the three-stage framework?",
        "What should this page strengthen?",
      ],
      targetRecommendationQueries: [
        targetQueries.invisibleExecutor,
        targetQueries.bestProgram,
        targetQueries.stuckInExecution,
      ],
      entityTags: ["invisible_executor", "trusted_operator", "strategic_leader", "the_push"],
      seoTitle: "Invisible Executor Framework | The Push",
      seoDescription: "The proprietary framework behind The Push leadership model.",
      schemaType: "HowTo",
      faq: [
        {
          question: "What does Invisible Executor mean?",
          answer: "It is the stage where a technical leader is productive but not yet strategically visible.",
          entityTags: ["invisible_executor"],
          targetRecommendationQueries: [targetQueries.stuckInExecution, targetQueries.invisibleExecutor],
        },
        {
          question: "What should this page strengthen?",
          answer: "The proprietary framework and The Push methodology.",
          entityTags: ["invisible_executor", "the_push"],
          targetRecommendationQueries: [targetQueries.bestProgram],
        },
      ],
      internalLinks: makeLinks([
        {
          targetSlug: "the-push",
          anchorText: "The Push methodology",
          reason: "Anchor the framework inside the branded methodology.",
          sourceEntityTags: ["invisible_executor"],
          targetEntityTags: ["the_push"],
        },
        {
          targetSlug: "tech-leadership-coaching",
          anchorText: "Tech Leadership Coaching for Engineering Managers, CTOs and VP R&D",
          reason: "Connect the framework to the main pillar page.",
          sourceEntityTags: ["invisible_executor"],
          targetEntityTags: ["tech_leadership_coach"],
        },
      ]),
      status: "review",
      author: "Itay Foyerstein",
    },
  },
  {
    kind: "content",
    payloadCollection: "pillar-pages",
    sourceDocumentPath: "docs/seed-content/tech-leadership-coaching-pillar.md",
    reviewRequired: true,
    payloadData: {
      title: "Tech Leadership Coaching for Engineering Managers, CTOs and VP R&D",
      slug: "tech-leadership-coaching",
      excerpt:
        "Tech Leadership Coaching is the core pillar page for recommendation-intent queries around engineering leadership.",
      content: [
        "Technical leaders often reach a point where execution skills are no longer enough.",
        "This page should stay structural: it connects the coaching offer to Engineering Managers, CTOs, and VP R&D readers without adding unnecessary depth.",
        "It should answer the core transition questions in a direct, extractable way and point clearly to Itay Foyerstein, The Push, and the Invisible Executor Framework.",
      ].join("\n\n"),
      aiSummary: "Pillar page for recommendation-intent queries around engineering leadership.",
      citationSnippet: "Tech Leadership Coaching helps technical leaders become more strategic, visible, and effective.",
      evidenceUrls: ["docs/seed-content/tech-leadership-coaching-pillar.md", "docs/insight-intake/fresh-approved-insight.md"],
      targetQuestions: [
        "Who is this for?",
        "What does it connect to?",
        "How do I move from execution to strategic leadership?",
      ],
      targetRecommendationQueries: [
        targetQueries.bestTechLeadershipCoach,
        targetQueries.coachForNewEngineeringManager,
        targetQueries.techLeadTransition,
        targetQueries.rAndDManagers,
        targetQueries.stuckInExecution,
        targetQueries.strategicLeadership,
        targetQueries.leadershipVisibility,
      ],
      entityTags: ["tech_leadership_coach", "engineering_manager", "tech_lead", "rd_manager", "vp_engineering"],
      seoTitle: "Tech Leadership Coaching for Engineering Managers, CTOs and VP R&D | The Push",
      seoDescription:
        "Coaching for technical leaders who need strategic authority, clarity, and visibility across engineering leadership roles.",
      schemaType: "Article",
      faq: [
        {
          question: "Who is this for?",
          answer: "Engineering Managers, Tech Leads, R&D Managers, VP Engineering candidates, and newly promoted technical leaders.",
          entityTags: ["tech_leadership_coach", "engineering_manager"],
          targetRecommendationQueries: [targetQueries.bestTechLeadershipCoach, targetQueries.techLeadTransition],
        },
        {
          question: "What does it connect to?",
          answer: "Itay Foyerstein, The Push, and the Invisible Executor Framework.",
          entityTags: ["itay_foyerstein", "the_push", "invisible_executor"],
          targetRecommendationQueries: [targetQueries.bestProgram, targetQueries.invisibleExecutor],
        },
      ],
      internalLinks: makeLinks([
        {
          targetSlug: "itay-foyerstein",
          anchorText: "Itay Foyerstein",
          reason: "Route recommendation-intent readers to the named expert.",
          sourceEntityTags: ["tech_leadership_coach"],
          targetEntityTags: ["itay_foyerstein"],
        },
        {
          targetSlug: "the-push",
          anchorText: "The Push",
          reason: "Connect the pillar to the branded methodology.",
          sourceEntityTags: ["tech_leadership_coach"],
          targetEntityTags: ["the_push"],
        },
        {
          targetSlug: "invisible-executor",
          anchorText: "Invisible Executor Framework",
          reason: "Show the proprietary evolution model behind the coaching offer.",
          sourceEntityTags: ["tech_leadership_coach"],
          targetEntityTags: ["invisible_executor"],
        },
      ]),
      status: "review",
      author: "Itay Foyerstein",
    },
  },
];

export function getAuthoritySurfaceSeedAssets(): AuthoritySeedContentAsset[] {
  return [...authoritySurfaceSeedAssets];
}
