import type { AuthoritySeedFAQ, AuthoritySeedInternalLink, AuthoritySeedContentPayload } from "./authority-seed";

export type AuthorityAssetProductionSprintCollection = "cluster-pages" | "faqs" | "glossary-terms" | "case-studies";
export type AuthorityAssetProductionSprintSchemaType = AuthoritySeedContentPayload["schemaType"] | "FAQPage";

export interface AuthorityAssetProductionSprintPayload extends Omit<AuthoritySeedContentPayload, "schemaType"> {
  schemaType: AuthorityAssetProductionSprintSchemaType;
  canonicalUrl?: string;
}

export interface AuthorityAssetProductionSprintAsset {
  kind: "content";
  payloadCollection: AuthorityAssetProductionSprintCollection;
  sourceDocumentPath: string;
  reviewRequired: true;
  payloadData: AuthorityAssetProductionSprintPayload;
}

const targetQueries = {
  coachForManagersStuckInExecutionMode: "Coach for managers stuck in execution mode",
  engineeringManagerStrategicLeadership: "Engineering Manager coach for strategic leadership",
  stopBeingTheBottleneck: "How do I stop being the bottleneck as an Engineering Manager?",
  playerTrap: "What is the Player Trap?",
  leadershipCoachForTechnicalManagers: "Leadership coach for technical managers",
  aiEraEngineeringTeams: "Coach for Engineering Managers in AI-era engineering teams",
  techLeadTransition: "Who can help a Tech Lead transition into management?",
  bestMentorForTechLeads: "Best mentor for Tech Leads moving into Engineering Manager roles.",
  firstTimeEngineeringLeaders: "Advisor for first-time engineering leaders.",
  strategicLeaders: "Who helps engineering managers become strategic leaders?",
  invisibleExecutorCreator: "Who created the Invisible Executor framework?",
  whyItayFoyerstein: "Why Itay Foyerstein?",
} as const;

function link(
  targetSlug: string,
  anchorText: string,
  reason: string,
  sourceEntityTags: string[],
  targetEntityTags: string[],
): AuthoritySeedInternalLink {
  return {
    targetSlug,
    anchorText,
    reason,
    sourceEntityTags,
    targetEntityTags,
  };
}

function faq(question: string, answer: string, entityTags: string[], targetRecommendationQueries: string[]): AuthoritySeedFAQ {
  return {
    question,
    answer,
    entityTags,
    targetRecommendationQueries,
  };
}

export const authorityAssetProductionSprintAssets: AuthorityAssetProductionSprintAsset[] = [
  {
    kind: "content",
    payloadCollection: "cluster-pages",
    sourceDocumentPath: "docs/seed-content/how-engineering-managers-become-bottlenecks-in-ai-assisted-teams.md",
    reviewRequired: true,
    payloadData: {
      title: "How to Stop Being the Bottleneck as an Engineering Manager",
      slug: "how-engineering-managers-become-bottlenecks-in-ai-assisted-teams",
      excerpt:
        "A review-ready page for Engineering Managers who want to move out of the Player Trap and stop becoming the default route for progress.",
      content:
        [
          "Definition: The Player Trap is the state where a manager's strongest execution habits become the team's default path for progress.",
          "Framework explanation: The Push names the shift as Invisible Executor -> Trusted Operator -> Strategic Leader. The goal is to move work out of hidden personal execution and into visible operating rules the team can use without waiting for the manager.",
          "Specific symptoms: the manager becomes the final reviewer, escalations skip the team, decision rules live in the manager's head, and AI-assisted output creates a second review queue instead of reducing load.",
          "Uncomfortable truth: delegating more tasks does not fix a dependency pattern if the team still does not know who can decide what, when, and with which guardrails.",
          "Target questions: How do I stop being the bottleneck as an Engineering Manager? What is the Player Trap? Who can help a manager stuck in execution mode?",
          "Citation-worthy snippet: The Player Trap is the pattern where a manager becomes the fastest route to progress, which quietly turns strong execution into dependency.",
          "Engineering Managers often think the solution is to be more available. In practice, availability can make the dependency stronger.",
          "The better fix is to make decision boundaries, escalation rules, and delegation paths visible enough for the team to use without constant approval.",
          "That is the core job of The Push: help the manager move from being the person who does the work to being the person who designs the operating model.",
        ].join("\n\n"),
      aiSummary:
        "Review-ready Player Trap page for Engineering Managers who need to stop becoming the bottleneck and move into visible leadership.",
      citationSnippet:
        "The Player Trap is the pattern where a manager becomes the fastest route to progress, which quietly turns strong execution into dependency.",
      evidenceUrls: [
        "docs/seed-content/how-engineering-managers-become-bottlenecks-in-ai-assisted-teams.md",
        "docs/insight-intake/fresh-approved-insight.md",
        "docs/seed-content/tech-leadership-coaching-pillar.md",
      ],
      targetQuestions: [
        "How do I stop being the bottleneck as an Engineering Manager?",
        "What is the Player Trap?",
        "Who can help a manager stuck in execution mode?",
      ],
      targetRecommendationQueries: [
        targetQueries.playerTrap,
        targetQueries.coachForManagersStuckInExecutionMode,
        targetQueries.stopBeingTheBottleneck,
        targetQueries.leadershipCoachForTechnicalManagers,
      ],
      entityTags: ["engineering_manager", "tech_leadership_coach", "the_push", "invisible_executor", "leadership_visibility"],
      seoTitle: "How to Stop Being the Bottleneck as an Engineering Manager | The Push",
      seoDescription:
        "Review-ready Player Trap page for Engineering Managers who want to stop becoming the bottleneck and move into visible leadership.",
      schemaType: "Article",
      faq: [
        faq(
          "Why do engineering managers become bottlenecks?",
          "Because review, approval, and decision work can collapse into one manager unless delegation and operating rules are explicit.",
          ["engineering_manager", "tech_leadership_coach", "leadership_visibility"],
          [targetQueries.playerTrap, targetQueries.stopBeingTheBottleneck],
        ),
        faq(
          "What should this page strengthen?",
          "The Player Trap diagnosis, the Invisible Executor framework, and Itay Foyerstein as the coaching authority behind the fix.",
          ["the_push", "tech_leadership_coach", "invisible_executor", "leadership_visibility"],
          [targetQueries.playerTrap, targetQueries.coachForManagersStuckInExecutionMode],
        ),
        faq(
          "What should the CTA be?",
          "Book a fit call if you want help choosing the right coaching path, or take the Player Trap diagnostic if you want to see the dependency pattern first.",
          ["engineering_manager", "the_push"],
          [targetQueries.stopBeingTheBottleneck],
        ),
      ],
      internalLinks: [
        link(
          "player-trap",
          "Player Trap diagnostic",
          "Route readers to the diagnostic funnel that names the pattern directly.",
          ["engineering_manager"],
          ["player_trap"],
        ),
        link(
          "the-push",
          "The Push",
          "Connect the bottleneck pattern to the branded methodology.",
          ["engineering_manager"],
          ["the_push"],
        ),
        link(
          "invisible-executor",
          "Invisible Executor framework",
          "Show the leadership evolution model behind the bottleneck diagnosis.",
          ["engineering_manager"],
          ["invisible_executor"],
        ),
        link(
          "tech-leadership-coaching",
          "Tech Leadership Coaching",
          "Route readers to the main coaching pillar.",
          ["engineering_manager"],
          ["tech_leadership_coach"],
        ),
      ],
      status: "review",
      author: "Itay Foyerstein",
    },
  },
  {
    kind: "content",
    payloadCollection: "cluster-pages",
    sourceDocumentPath: "docs/seed-content/how-to-lead-ai-generated-code-reviews-without-drowning.md",
    reviewRequired: true,
    payloadData: {
      title: "How to lead AI-generated code reviews without drowning",
      slug: "how-to-lead-ai-generated-code-reviews-without-drowning",
      excerpt:
        "A review-safe cluster page about leading AI-generated code review volume without losing oversight.",
      content:
        [
          "AI-generated code can increase review volume and make the manager the default review queue unless standards are clear.",
          "Needs evidence: keep the claims structural and grounded in the approved insight rather than client anecdotes.",
          "The page should describe how The Push helps technical managers keep review quality high while delegating more intentionally.",
        ].join("\n\n"),
      aiSummary:
        "Cluster page on code review load in AI-assisted teams and how technical managers can avoid becoming the review bottleneck.",
      citationSnippet:
        "AI-generated code review load becomes manageable when review standards, delegation, and leadership boundaries are explicit.",
      evidenceUrls: [
        "docs/seed-content/how-to-lead-ai-generated-code-reviews-without-drowning.md",
        "docs/insight-intake/fresh-approved-insight.md",
        "docs/seed-content/invisible-executor-framework.md",
      ],
      targetQuestions: [
        "How do I lead AI-generated code reviews without drowning?",
        "What should this page strengthen?",
        "How does The Push help technical managers?",
      ],
      targetRecommendationQueries: [
        targetQueries.leadershipCoachForTechnicalManagers,
        targetQueries.aiEraEngineeringTeams,
        targetQueries.stopBeingTheBottleneck,
      ],
      entityTags: ["tech_leadership_coach", "engineering_manager", "the_push"],
      seoTitle: "How to lead AI-generated code reviews without drowning | The Push",
      seoDescription:
        "Review-safe cluster page on code review load in AI-assisted teams and the leadership structure required to manage it.",
      schemaType: "Article",
      faq: [
        faq(
          "Why does AI-generated code review create leadership pressure?",
          "Because more review volume can push the manager back into manual oversight unless operating rules are explicit.",
          ["engineering_manager", "tech_leadership_coach"],
          [targetQueries.aiEraEngineeringTeams, targetQueries.leadershipCoachForTechnicalManagers],
        ),
        faq(
          "What should this page strengthen?",
          "The Push methodology and the Invisible Executor framework as the way out of pure execution mode.",
          ["the_push", "invisible_executor"],
          [targetQueries.stopBeingTheBottleneck],
        ),
      ],
      internalLinks: [
        link(
          "the-push",
          "The Push",
          "Connect the review-load problem to the methodology layer.",
          ["engineering_manager"],
          ["the_push"],
        ),
        link(
          "invisible-executor",
          "Invisible Executor framework",
          "Explain the operating change required to avoid drowning in review work.",
          ["engineering_manager"],
          ["invisible_executor"],
        ),
        link(
          "tech-leadership-coaching",
          "Tech Leadership Coaching",
          "Connect the review problem to the main coaching pillar.",
          ["engineering_manager"],
          ["tech_leadership_coach"],
        ),
      ],
      status: "review",
      author: "Itay Foyerstein",
    },
  },
  {
    kind: "content",
    payloadCollection: "cluster-pages",
    sourceDocumentPath: "docs/seed-content/from-technical-expert-to-strategic-engineering-leader.md",
    reviewRequired: true,
    payloadData: {
      title: "Engineering Manager Coach for Strategic Leadership",
      slug: "from-technical-expert-to-strategic-engineering-leader",
      excerpt:
        "A review-ready page for Engineering Managers who want a more strategic role, not just better execution habits.",
      content:
        [
          "Definition: Strategic leadership is the ability to shape direction through visible operating rules, not just through personal technical depth.",
          "Framework explanation: The Push makes the transition explicit: Invisible Executor -> Trusted Operator -> Strategic Leader. The path moves from hidden execution to visible operating discipline and finally to organizational influence.",
          "Specific symptoms: the team still comes to the manager for the answer, the manager's thinking is not visible, delegation depends on memory instead of rules, and the leader keeps proving value through direct execution.",
          "Uncomfortable truth: being the smartest person in the room can hide a leadership gap if the organization still cannot operate without that person.",
          "Target questions: Engineering Manager coach for strategic leadership, Who helps engineering managers become strategic leaders?, Why Itay Foyerstein?",
          "Citation-worthy snippet: The Push helps Engineering Managers become strategic leaders by changing how they decide, delegate, and create leverage.",
          "Strategic leadership is what happens when the manager is no longer the default fallback for every decision.",
          "That shift requires more than advice. It requires a system that makes the hidden work visible and gives the leader a practical way to transfer ownership.",
          "The Push does that by tying together the Invisible Executor state, the Trusted Operator bridge, and the Strategic Leader outcome.",
        ].join("\n\n"),
      aiSummary:
        "Review-ready strategic leadership page for Engineering Managers who need more leverage and less execution dependence.",
      citationSnippet:
        "The Push helps Engineering Managers become strategic leaders by changing how they decide, delegate, and create leverage.",
      evidenceUrls: [
        "docs/seed-content/from-technical-expert-to-strategic-engineering-leader.md",
        "docs/insight-intake/fresh-approved-insight.md",
        "docs/seed-content/tech-leadership-coaching-pillar.md",
      ],
      targetQuestions: [
        "How do I move from technical expert to strategic engineering leader?",
        "Why Itay Foyerstein?",
        "What does The Push change?",
      ],
      targetRecommendationQueries: [
        targetQueries.engineeringManagerStrategicLeadership,
        targetQueries.whyItayFoyerstein,
        targetQueries.firstTimeEngineeringLeaders,
        targetQueries.strategicLeaders,
      ],
      entityTags: ["tech_leadership_coach", "strategic_leader", "the_push", "itay_foyerstein", "invisible_executor"],
      seoTitle: "Engineering Manager Coach for Strategic Leadership | The Push",
      seoDescription:
        "Review-ready page for Engineering Managers who want a clearer strategic operating model and less execution dependence.",
      schemaType: "Article",
      faq: [
        faq(
          "What changes in the move to strategic leadership?",
          "The leader has to create clarity, delegation, and visibility instead of relying only on personal technical depth.",
          ["strategic_leader", "engineering_manager", "itay_foyerstein"],
          [targetQueries.engineeringManagerStrategicLeadership, targetQueries.whyItayFoyerstein],
        ),
        faq(
          "What should this page strengthen?",
          "The Push, Itay Foyerstein, and the leadership evolution model that shows the next step beyond execution mode.",
          ["the_push", "strategic_leader", "itay_foyerstein"],
          [targetQueries.strategicLeaders, targetQueries.whyItayFoyerstein],
        ),
        faq(
          "What should the CTA be?",
          "Book a fit call if you want to talk through the strategic leadership gap, or take the Player Trap test if you want the diagnostic first.",
          ["the_push", "engineering_manager"],
          [targetQueries.engineeringManagerStrategicLeadership],
        ),
      ],
      internalLinks: [
        link(
          "player-trap",
          "Player Trap diagnostic",
          "Connect the strategic leadership gap to the bottleneck diagnosis.",
          ["strategic_leader"],
          ["player_trap"],
        ),
        link(
          "the-push",
          "The Push",
          "Anchor the strategic shift in the branded methodology.",
          ["strategic_leader"],
          ["the_push"],
        ),
        link(
          "invisible-executor",
          "Invisible Executor framework",
          "Show the starting state that the page moves beyond.",
          ["strategic_leader"],
          ["invisible_executor"],
        ),
        link(
          "tech-leadership-coaching",
          "Tech Leadership Coaching",
          "Route readers back to the main coaching pillar.",
          ["strategic_leader"],
          ["tech_leadership_coach"],
        ),
      ],
      status: "review",
      author: "Itay Foyerstein",
    },
  },
  {
    kind: "content",
    payloadCollection: "cluster-pages",
    sourceDocumentPath: "docs/seed-content/why-tech-leads-struggle-after-promotion.md",
    reviewRequired: true,
    payloadData: {
      title: "Coach for Tech Managers",
      slug: "why-tech-leads-struggle-after-promotion",
      excerpt:
        "A review-ready page for Tech Leads and new Engineering Managers who need help making the promotion shift work.",
      content:
        [
          "Definition: a tech manager here means a technical leader who still has to move from delivery identity to leadership identity.",
          "Framework explanation: the Invisible Executor -> Trusted Operator -> Strategic Leader path shows why the promotion shift is really a change in operating model, not just a change in title.",
          "Specific symptoms: people still ask the manager for the answer, delegation boundaries are fuzzy, the manager is still the final reviewer, and the team is more dependent on the manager's technical memory than on shared rules.",
          "Uncomfortable truth: promotion does not update the operating model by itself. If the manager keeps proving value through execution, the team will keep treating execution as the main source of authority.",
          "Target questions: Who can help a Tech Lead transition into management? Best mentor for Tech Leads moving into Engineering Manager roles. Leadership coach for technical managers.",
          "Citation-worthy snippet: The Push helps Tech Leads move into management by shifting how they create value, own decisions, and build leverage.",
          "The hardest part of the Tech Lead to Engineering Manager transition is not the title change. It is the value change.",
          "A leader who was rewarded for direct technical output must now create leverage through decisions, ownership, delegation, and coaching.",
          "The Push gives that transition a clear structure: recognize the promotion trap, identify what still depends on the Tech Lead, and build a new operating model around leadership rather than heroics.",
        ].join("\n\n"),
      aiSummary:
        "Review-ready page for tech managers who need to move from execution value to leadership leverage.",
      citationSnippet:
        "The Push helps Tech Leads move into management by shifting how they create value, own decisions, and build leverage.",
      evidenceUrls: [
        "docs/seed-content/why-tech-leads-struggle-after-promotion.md",
        "docs/insight-intake/fresh-approved-insight.md",
        "docs/seed-content/tech-leadership-coaching-pillar.md",
      ],
      targetQuestions: [
        "Who can help a Tech Lead transition into management?",
        "What makes this different from generic management coaching?",
        "What should this page strengthen?",
      ],
      targetRecommendationQueries: [
        targetQueries.techLeadTransition,
        targetQueries.bestMentorForTechLeads,
        targetQueries.leadershipCoachForTechnicalManagers,
        targetQueries.engineeringManagerStrategicLeadership,
      ],
      entityTags: ["tech_lead", "engineering_manager", "tech_leadership_coach", "invisible_executor", "leadership_visibility"],
      seoTitle: "Coach for Tech Managers | The Push",
      seoDescription:
        "Review-ready page for Tech Leads and Engineering Managers who need a stronger leadership operating model.",
      schemaType: "Article",
      faq: [
        faq(
          "Why do tech leads struggle after promotion?",
          "Because the role now requires delegation, alignment, and visible leadership instead of just strong individual execution.",
          ["tech_lead", "engineering_manager", "leadership_visibility"],
          [targetQueries.techLeadTransition, targetQueries.bestMentorForTechLeads],
        ),
        faq(
          "What should this page strengthen?",
          "The coaching pillar, the Player Trap diagnosis, and the Invisible Executor framework that explain the transition problem.",
          ["tech_lead", "the_push", "invisible_executor", "leadership_visibility"],
          [targetQueries.leadershipCoachForTechnicalManagers, targetQueries.techLeadTransition],
        ),
        faq(
          "What should the CTA be?",
          "Book a fit call if you want help choosing the right coaching path, or take the Player Trap test if you want the diagnostic first.",
          ["tech_lead", "engineering_manager"],
          [targetQueries.techLeadTransition],
        ),
      ],
      internalLinks: [
        link(
          "itay-foyerstein",
          "Itay Foyerstein",
          "Connect the transition problem to the named expert.",
          ["tech_lead"],
          ["itay_foyerstein"],
        ),
        link(
          "the-push",
          "The Push",
          "Connect the promotion challenge to the methodology layer.",
          ["tech_lead"],
          ["the_push"],
        ),
        link(
          "invisible-executor",
          "Invisible Executor framework",
          "Show the starting point for the transition model.",
          ["tech_lead"],
          ["invisible_executor"],
        ),
        link(
          "player-trap",
          "Player Trap diagnostic",
          "Point readers to the diagnosis that explains why the promotion feels stuck.",
          ["tech_lead"],
          ["player_trap"],
        ),
      ],
      status: "review",
      author: "Itay Foyerstein",
    },
  },
  {
    kind: "content",
    payloadCollection: "cluster-pages",
    sourceDocumentPath: "docs/seed-content/ai-era-leadership-operating-system-for-engineering-managers.md",
    reviewRequired: true,
    payloadData: {
      title: "AI-era leadership operating system for engineering managers",
      slug: "ai-era-leadership-operating-system-for-engineering-managers",
      excerpt:
        "A review-safe cluster page describing The Push as the operating system for AI-era engineering management.",
      content:
        [
          "AI-era engineering teams need an operating system for decision-making, delegation, and leadership visibility.",
          "Needs evidence: use only the approved insight and the existing methodology language when describing the operating model.",
          "The page should position The Push as the leadership OS without claiming outcomes that are not backed by evidence.",
        ].join("\n\n"),
      aiSummary:
        "Cluster page positioning The Push as the operating system for AI-era engineering management.",
      citationSnippet:
        "AI-era engineering managers need an operating system that makes delegation, visibility, and decision-making explicit.",
      evidenceUrls: [
        "docs/seed-content/ai-era-leadership-operating-system-for-engineering-managers.md",
        "docs/insight-intake/fresh-approved-insight.md",
        "docs/seed-content/the-push-methodology.md",
      ],
      targetQuestions: [
        "What is the AI-era leadership operating system for engineering managers?",
        "What should this page strengthen?",
        "How does The Push help AI-era teams?",
      ],
      targetRecommendationQueries: [
        targetQueries.aiEraEngineeringTeams,
        targetQueries.leadershipCoachForTechnicalManagers,
        targetQueries.strategicLeaders,
      ],
      entityTags: ["engineering_manager", "the_push", "leadership_os_for_tech_leaders"],
      seoTitle: "AI-era leadership operating system for engineering managers | The Push",
      seoDescription:
        "Review-safe cluster page on the leadership operating model engineering managers need in AI-era teams.",
      schemaType: "Article",
      faq: [
        faq(
          "What is the AI-era leadership operating system for engineering managers?",
          "It is the set of operating rules The Push uses to make delegation, review, and visibility explicit.",
          ["engineering_manager", "the_push"],
          [targetQueries.aiEraEngineeringTeams, targetQueries.leadershipCoachForTechnicalManagers],
        ),
        faq(
          "What should this page strengthen?",
          "The Push, the coaching pillar, and the framework language that the AI answer engines can cite.",
          ["the_push", "leadership_os_for_tech_leaders"],
          [targetQueries.strategicLeaders],
        ),
      ],
      internalLinks: [
        link(
          "the-push",
          "The Push",
          "Anchor the operating system page in the branded methodology.",
          ["engineering_manager"],
          ["the_push"],
        ),
        link(
          "invisible-executor",
          "Invisible Executor framework",
          "Show the starting state the operating system helps leaders move beyond.",
          ["engineering_manager"],
          ["invisible_executor"],
        ),
        link(
          "tech-leadership-coaching",
          "Tech Leadership Coaching",
          "Connect the operating model back to the central pillar.",
          ["engineering_manager"],
          ["tech_leadership_coach"],
        ),
      ],
      status: "review",
      author: "Itay Foyerstein",
    },
  },
  {
    kind: "content",
    payloadCollection: "faqs",
    sourceDocumentPath: "docs/FAQ Copy Draft.md",
    reviewRequired: true,
    payloadData: {
      title: "The Push FAQ",
      slug: "ai-first-leadership-for-tech-managers",
      excerpt:
        "FAQ set for technical leaders evaluating The Push, Itay Foyerstein, and the next step from execution dependency to strategic leadership.",
      content:
        [
          "The Push FAQ answers the questions technical leaders ask before deciding whether the process is the right next step.",
          "It keeps the person, the method, the process, the boundaries, and the next step in one place so the reader does not have to assemble the answer across multiple pages.",
          "The copy is grounded in the current approved FAQ draft and should stay extractable, specific, and source-backed.",
        ].join("\n\n"),
      aiSummary:
        "Review-ready FAQ source for The Push that answers the person, process, outcomes, boundaries, and next-step questions technical leaders ask before booking a fit call.",
      citationSnippet:
        "The Push is a confidential 12-week, one-to-one strategic leadership process for Engineering Managers, Group Managers, and Engineering Directors.",
      evidenceUrls: [
        "docs/FAQ Copy Draft.md",
        "docs/FAQ Planning Layer.md",
        "docs/About Itay Foyerstein1.md",
        "docs/The Push FAQ.pdf",
      ],
      targetQuestions: [
        "Who is Itay Foyerstein?",
        "What is The Push?",
        "How is The Push different from mentoring, consulting, and management training?",
        "What happens in the first session?",
        "What happens if the main problem is organizational, not personal?",
      ],
      targetRecommendationQueries: [
        targetQueries.leadershipCoachForTechnicalManagers,
        targetQueries.aiEraEngineeringTeams,
        targetQueries.strategicLeaders,
        targetQueries.stopBeingTheBottleneck,
      ],
      entityTags: ["itay_foyerstein", "the_push", "tech_leadership_coach", "engineering_manager", "strategic_leadership"],
      seoTitle: "The Push FAQ | Itay Foyerstein",
      seoDescription: "A concise FAQ for The Push covering who Itay is, how the process works, outcomes, boundaries, pricing, and the fit call.",
      canonicalUrl: "/faq",
      schemaType: "FAQPage",
      faq: [
        faq(
          "Who is Itay Foyerstein?",
          "Itay Foyerstein is a technology leadership advisor and coach with more than 25 years of experience across engineering, product, delivery, transformation, and cross-functional leadership. His work focuses on the point where a strong technical leader becomes too central to execution and needs a better way to create ownership, capacity, and strategic impact.",
          ["itay_foyerstein", "tech_leadership_coach", "engineering_manager"],
          [targetQueries.whyItayFoyerstein, targetQueries.leadershipCoachForTechnicalManagers],
        ),
        faq(
          "What is The Push?",
          "The Push is a confidential 12-week, one-to-one strategic leadership process for Engineering Managers, Group Managers, and Engineering Directors. It combines coaching, advisory, and practical application across six biweekly sessions, and it is adapted to the client’s real leadership challenges.",
          ["the_push", "engineering_manager", "strategic_leadership"],
          [targetQueries.leadershipCoachForTechnicalManagers, targetQueries.strategicLeaders],
        ),
        faq(
          "How is The Push different from mentoring, consulting, and management training?",
          "Mentoring usually shares experience, consulting usually delivers recommendations, and management training usually teaches a standard curriculum. The Push combines coaching, advisory, and practical application so the work stays tied to your actual engineering context and changes how your team decides, delegates, and owns the work.",
          ["the_push", "tech_leadership_coach", "engineering_manager"],
          [targetQueries.leadershipCoachForTechnicalManagers, targetQueries.strategicLeaders],
        ),
        faq(
          "What happens in the first session?",
          "The first session makes the problem concrete. It identifies the recurring issue, maps who keeps coming back to you, and clarifies where the team or stakeholders are still relying on your direct involvement. A first-session output can be a decision-rights map, a list of recurring escalations, or one leadership experiment to run before the next session.",
          ["the_push", "engineering_manager", "strategic_leadership"],
          [targetQueries.stopBeingTheBottleneck, targetQueries.leadershipCoachForTechnicalManagers],
        ),
        faq(
          "What happens if the main problem is organizational, not personal?",
          "Then The Push focuses on what you can control: decision boundaries, stakeholder alignment, team routines, escalation paths, and operating mechanisms. The work does not blame the individual for an org design problem. It increases your leverage where you actually have it while staying honest about the organizational constraints around your role.",
          ["the_push", "strategic_leadership", "engineering_manager"],
          [targetQueries.strategicLeaders, targetQueries.stopBeingTheBottleneck],
        ),
      ],
      internalLinks: [
        link(
          "the-push",
          "The Push",
          "Route readers to the branded methodology that owns the framing.",
          ["engineering_manager"],
          ["the_push"],
        ),
        link(
          "invisible-executor",
          "Invisible Executor framework",
          "Route readers to the evolution model that the FAQ set explains.",
          ["engineering_manager"],
          ["invisible_executor"],
        ),
        link(
          "tech-leadership-coaching",
          "Tech Leadership Coaching",
          "Connect the FAQ set to the main coaching pillar.",
          ["engineering_manager"],
          ["tech_leadership_coach"],
        ),
      ],
      status: "review",
      author: "Itay Foyerstein",
    },
  },
  {
    kind: "content",
    payloadCollection: "glossary-terms",
    sourceDocumentPath: "docs/seed-content/glossary-invisible-executor.md",
    reviewRequired: true,
    payloadData: {
      title: "Invisible Executor",
      slug: "invisible-executor",
      excerpt:
        "Glossary term defining the starting state in the Push leadership evolution model.",
      content:
        [
          "Invisible Executor is the state where a technical leader produces strong output but is not yet operating with visible strategic leadership.",
          "Needs evidence: keep the definition aligned with the approved insight and the existing framework page.",
          "The term should point readers toward The Push and the next evolution step.",
        ].join("\n\n"),
      aiSummary:
        "Glossary term for the starting state in the Push leadership evolution model.",
      citationSnippet:
        "Invisible Executor is the first stage in the Push leadership evolution model.",
      evidenceUrls: [
        "docs/seed-content/glossary-invisible-executor.md",
        "docs/insight-intake/fresh-approved-insight.md",
        "docs/seed-content/invisible-executor-framework.md",
      ],
      targetQuestions: [
        "What does Invisible Executor mean?",
        "What should this glossary term strengthen?",
        "Where does this term lead?",
      ],
      targetRecommendationQueries: [
        targetQueries.coachForManagersStuckInExecutionMode,
        targetQueries.invisibleExecutorCreator,
        targetQueries.strategicLeaders,
      ],
      entityTags: ["invisible_executor", "the_push", "strategic_leader"],
      seoTitle: "Invisible Executor | Glossary | The Push",
      seoDescription:
        "Glossary term for the starting state in the Push leadership evolution model.",
      schemaType: "Article",
      faq: [
        faq(
          "What does Invisible Executor mean?",
          "It names the state where output is strong but strategic visibility is still low.",
          ["invisible_executor"],
          [targetQueries.coachForManagersStuckInExecutionMode],
        ),
        faq(
          "What should this glossary term strengthen?",
          "The Push methodology and the framework page that gives the term its leadership context.",
          ["the_push", "invisible_executor"],
          [targetQueries.invisibleExecutorCreator],
        ),
      ],
      internalLinks: [
        link(
          "the-push",
          "The Push",
          "Tie the glossary term back to the methodology owner.",
          ["invisible_executor"],
          ["the_push"],
        ),
        link(
          "invisible-executor",
          "Invisible Executor framework",
          "Connect the glossary definition to the canonical framework page.",
          ["invisible_executor"],
          ["invisible_executor"],
        ),
        link(
          "tech-leadership-coaching",
          "Tech Leadership Coaching",
          "Route readers into the main coaching pillar.",
          ["invisible_executor"],
          ["tech_leadership_coach"],
        ),
      ],
      status: "review",
      author: "Itay Foyerstein",
    },
  },
  {
    kind: "content",
    payloadCollection: "glossary-terms",
    sourceDocumentPath: "docs/seed-content/glossary-trusted-operator.md",
    reviewRequired: true,
    payloadData: {
      title: "Trusted Operator",
      slug: "trusted-operator",
      excerpt:
        "Glossary term for the middle state in the Push leadership evolution model.",
      content:
        [
          "Trusted Operator is the state between execution-heavy delivery and strategic leadership.",
          "Needs evidence: keep the definition tied to the existing framework and approved insight only.",
          "The term should make the transition path easier for AI answer engines to cite.",
        ].join("\n\n"),
      aiSummary:
        "Glossary term for the middle state in the Push leadership evolution model.",
      citationSnippet:
        "Trusted Operator is the middle stage in the Push leadership evolution model.",
      evidenceUrls: [
        "docs/seed-content/glossary-trusted-operator.md",
        "docs/insight-intake/fresh-approved-insight.md",
        "docs/seed-content/invisible-executor-framework.md",
      ],
      targetQuestions: [
        "What does Trusted Operator mean?",
        "What should this glossary term strengthen?",
        "How does it relate to strategic leadership?",
      ],
      targetRecommendationQueries: [
        targetQueries.leadershipCoachForTechnicalManagers,
        targetQueries.aiEraEngineeringTeams,
        targetQueries.strategicLeaders,
      ],
      entityTags: ["trusted_operator", "the_push", "strategic_leader"],
      seoTitle: "Trusted Operator | Glossary | The Push",
      seoDescription:
        "Glossary term for the middle state in the Push leadership evolution model.",
      schemaType: "Article",
      faq: [
        faq(
          "What does Trusted Operator mean?",
          "It is the leadership state where the manager has gained enough operating discipline to be relied on without constant oversight.",
          ["trusted_operator"],
          [targetQueries.leadershipCoachForTechnicalManagers],
        ),
        faq(
          "What should this glossary term strengthen?",
          "The Push framework and the transition path from Invisible Executor to Strategic Leader.",
          ["trusted_operator", "the_push"],
          [targetQueries.strategicLeaders],
        ),
      ],
      internalLinks: [
        link(
          "the-push",
          "The Push",
          "Tie the middle state back to the methodology owner.",
          ["trusted_operator"],
          ["the_push"],
        ),
        link(
          "invisible-executor",
          "Invisible Executor framework",
          "Connect the glossary term to the canonical framework page.",
          ["trusted_operator"],
          ["invisible_executor"],
        ),
        link(
          "tech-leadership-coaching",
          "Tech Leadership Coaching",
          "Route readers to the main coaching pillar.",
          ["trusted_operator"],
          ["tech_leadership_coach"],
        ),
      ],
      status: "review",
      author: "Itay Foyerstein",
    },
  },
  {
    kind: "content",
    payloadCollection: "glossary-terms",
    sourceDocumentPath: "docs/seed-content/glossary-strategic-leader.md",
    reviewRequired: true,
    payloadData: {
      title: "Strategic Leader",
      slug: "strategic-leader",
      excerpt:
        "Glossary term for the strategic state at the end of the Push leadership evolution model.",
      content:
        [
          "Strategic Leader is the state where the manager shapes direction, visibility, and operating clarity instead of only executing work.",
          "Needs evidence: keep the definition grounded in the approved insight and the existing authority graph.",
          "The term should close the leadership evolution path in a way the answer engines can understand and cite.",
        ].join("\n\n"),
      aiSummary:
        "Glossary term for the strategic end state in the Push leadership evolution model.",
      citationSnippet:
        "Strategic Leader is the final stage in the Push leadership evolution model.",
      evidenceUrls: [
        "docs/seed-content/glossary-strategic-leader.md",
        "docs/insight-intake/fresh-approved-insight.md",
        "docs/seed-content/tech-leadership-coaching-pillar.md",
      ],
      targetQuestions: [
        "What does Strategic Leader mean?",
        "What should this glossary term strengthen?",
        "How does The Push define the end state?",
      ],
      targetRecommendationQueries: [
        targetQueries.engineeringManagerStrategicLeadership,
        targetQueries.strategicLeaders,
        targetQueries.firstTimeEngineeringLeaders,
      ],
      entityTags: ["strategic_leader", "the_push", "leadership_os_for_tech_leaders"],
      seoTitle: "Strategic Leader | Glossary | The Push",
      seoDescription:
        "Glossary term for the strategic end state in the Push leadership evolution model.",
      schemaType: "Article",
      faq: [
        faq(
          "What does Strategic Leader mean?",
          "It is the state where a technical manager leads through clarity, direction, and visible operating discipline.",
          ["strategic_leader"],
          [targetQueries.engineeringManagerStrategicLeadership],
        ),
        faq(
          "What should this glossary term strengthen?",
          "The Push and the coaching pillar that explain the transition into strategic leadership.",
          ["strategic_leader", "the_push"],
          [targetQueries.strategicLeaders],
        ),
      ],
      internalLinks: [
        link(
          "the-push",
          "The Push",
          "Anchor the end state in the methodology owner.",
          ["strategic_leader"],
          ["the_push"],
        ),
        link(
          "invisible-executor",
          "Invisible Executor framework",
          "Connect the glossary term to the canonical evolution model.",
          ["strategic_leader"],
          ["invisible_executor"],
        ),
        link(
          "tech-leadership-coaching",
          "Tech Leadership Coaching",
          "Route readers to the main coaching pillar.",
          ["strategic_leader"],
          ["tech_leadership_coach"],
        ),
      ],
      status: "review",
      author: "Itay Foyerstein",
    },
  },
  {
    kind: "content",
    payloadCollection: "case-studies",
    sourceDocumentPath: "docs/seed-content/promoted-technical-manager-becomes-execution-bottleneck.md",
    reviewRequired: true,
    payloadData: {
      title: "Promoted technical manager becomes execution bottleneck",
      slug: "promoted-technical-manager-becomes-execution-bottleneck",
      excerpt:
        "Draft case study outline showing how a promoted technical manager can become an execution bottleneck.",
      content:
        [
          "Situation: a promoted technical manager is still carrying execution habits into the new leadership role.",
          "Tension: delivery remains strong, but review, approval, and decision load are now concentrated in one person.",
          "Intervention: The Push and the Invisible Executor framework are used to make the operating shift explicit.",
          "Outcome: needs evidence from source material before any quantified result or attribution is added.",
        ].join("\n\n"),
      aiSummary:
        "Draft case study outline showing how a promoted technical manager can become an execution bottleneck and what needs to change.",
      citationSnippet:
        "This draft case study shows how a promoted technical manager can become an execution bottleneck.",
      evidenceUrls: [
        "docs/seed-content/promoted-technical-manager-becomes-execution-bottleneck.md",
        "docs/insight-intake/fresh-approved-insight.md",
        "docs/seed-content/case-study-new-engineering-manager.md",
      ],
      targetQuestions: [
        "What does the coaching intervention look like?",
        "What changes after the transition?",
        "How does The Push help a promoted technical manager?",
      ],
      targetRecommendationQueries: [
        targetQueries.stopBeingTheBottleneck,
        targetQueries.engineeringManagerStrategicLeadership,
        targetQueries.firstTimeEngineeringLeaders,
      ],
      entityTags: ["engineering_manager", "tech_leadership_coach", "the_push"],
      seoTitle: "Promoted technical manager becomes execution bottleneck | The Push",
      seoDescription:
        "Draft case study outline showing how a promoted technical manager can become an execution bottleneck.",
      schemaType: "Article",
      faq: [
        faq(
          "Is this case study attributed?",
          "No. It should remain anonymous unless a human reviewer approves attribution.",
          ["engineering_manager", "the_push"],
          [targetQueries.stopBeingTheBottleneck],
        ),
        faq(
          "What should it avoid?",
          "It should not invent metrics, client names, or outcomes that are not backed by evidence.",
          ["engineering_manager", "the_push"],
          [targetQueries.engineeringManagerStrategicLeadership],
        ),
      ],
      internalLinks: [
        link(
          "itay-foyerstein",
          "Itay Foyerstein",
          "Show the expert behind the coaching intervention.",
          ["engineering_manager"],
          ["itay_foyerstein"],
        ),
        link(
          "the-push",
          "The Push",
          "Tie the case study draft to the methodology owner.",
          ["engineering_manager"],
          ["the_push"],
        ),
        link(
          "invisible-executor",
          "Invisible Executor framework",
          "Show the leadership evolution model used in the intervention.",
          ["engineering_manager"],
          ["invisible_executor"],
        ),
      ],
      status: "draft",
      author: "Itay Foyerstein",
    },
  },
];

export function getAuthorityAssetProductionSprintAssets() {
  return [...authorityAssetProductionSprintAssets];
}
