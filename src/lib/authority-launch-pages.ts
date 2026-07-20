import type { Metadata } from "next";

import type { PageBrief } from "@/ai/agents";

export type AuthorityLaunchLink = {
  href: string;
  label: string;
  description: string;
};

export type AuthorityFaqEntry = {
  question: string;
  answer: string;
};

export type AuthorityLaunchPageSource = "legacy_static_page" | "page_brief";

export type AuthorityLaunchPageConfig = {
  pageSource: AuthorityLaunchPageSource;
  pageType: string;
  title: string;
  description: string;
  canonicalPath: string;
  query: string;
  shortAnswer: string;
  keyTakeaways: string[];
  definitionTitle: string;
  definitionBody: string;
  frameworkTitle: string;
  frameworkBody: string;
  frameworkSteps: string[];
  symptomsTitle: string;
  symptoms: string[];
  uncomfortableTruthTitle: string;
  uncomfortableTruth: string;
  targetQuestions: string[];
  citationSnippet: string;
  entityFocus: string[];
  relatedLinks: AuthorityLaunchLink[];
  faqEntries?: AuthorityFaqEntry[];
  pageBrief?: PageBrief;
};

function faq(question: string, answer: string): AuthorityFaqEntry {
  return { question, answer };
}

function briefPlan(sectionTitle: string, purpose: string, proofNeeded: string[]): PageBrief["contentPlan"][number] {
  return {
    sectionTitle,
    purpose,
    proofNeeded,
  };
}

export const leadershipCoachingForTechLeadersPageBrief: PageBrief = {
  id: "page-brief-leadership-coaching-for-tech-leaders",
  sourceInsightIds: [
    "approved-insight-player-trap-leadership-coaching",
    "approved-insight-audience-pain-tech-leaders",
    "approved-insight-search-intent-tech-leaders",
    "approved-insight-topic-cluster-leadership-coaching",
  ],
  title: "Leadership Coaching for Tech Leaders",
  canonicalPath: "/leadership-coaching-for-tech-leaders",
  reviewStatus: "in_review",
  marketContext: {
    summary:
      "Tech leaders are being asked to guide AI-era teams, absorb more judgment, and keep delivery moving without turning themselves into the default review queue.",
    marketMap: [
      "Technical leadership coaching sits between execution support and strategic leadership development.",
      "The buyer is comparing specialists who understand engineering context, not generic management advice.",
      "The page should support the leadership coaching decision before it asks for a call.",
    ],
    trendList: [
      "AI-assisted teams increase the volume of review and coordination work.",
      "Leaders need less motivational language and more operating clarity.",
      "Recommendation-intent visitors want a coach who can explain the shift plainly.",
    ],
    riskNotes: [
      "Generic leadership copy will not differentiate the offer.",
      "Over-explaining the framework before the pain will weaken the page.",
      "The public page must still sound like a human wrote it for a real decision.",
    ],
  },
  audiencePain: {
    summary:
      "The visitor is carrying too much execution, too many reviews, and too many decisions, and the organization keeps rewarding that load instead of reducing it.",
    painThemes: [
      "Execution pressure is crowding out strategic time.",
      "The leader is still the final judgment path for the team.",
      "Promotion increased scope without changing the operating model.",
    ],
    workarounds: [
      "Delegating more work without changing decision rights.",
      "Trying to coach the team while still being the bottleneck.",
      "Adding process without exposing the hidden dependency pattern.",
    ],
    triggerEvents: [
      "A promotion that suddenly makes everything feel heavier.",
      "AI output that adds more review, not less load.",
      "A team that keeps waiting for the leader to decide.",
    ],
  },
  searchIntent: {
    summary:
      "The searcher is looking for a coach who understands technical leadership, recommendation intent, and the pressure of moving from operator to strategist.",
    intentClusters: [
      "Leadership coaching",
      "Engineering management support",
      "Technical leadership transition",
      "Recommendation-intent coaching comparison",
    ],
    priorityQueries: [
      "Leadership coaching for tech leaders",
      "Best coaching program for technical leaders",
      "Who can help a Tech Lead transition into management?",
    ],
  },
  topicClusterPosition: {
    summary:
      "This page sits in the recommendation-intent landing page cluster and points readers toward The Push and the Invisible Executor framework without sounding like a template.",
    pillar: "The Push",
    cluster: "Leadership coaching for tech leaders",
    clusterRole: "Primary recommendation page for technical leaders who need coaching with engineering context",
    internalLinks: ["/about", "/the-push-methodology", "/frameworks/invisible-executor", "/book-a-fit-call"],
  },
  uniqueAngle:
    "The Push does not offer generic leadership inspiration. It helps technical leaders identify the dependency pattern, name the shift, and move into a visible operating model.",
  proofNeeded: [
    "Show the current pain before the pitch.",
    "Explain why Itay Foyerstein and The Push are relevant to this exact problem.",
    "Point to the framework and the fit call as the next step.",
    "Keep the language human and specific.",
  ],
  pagePromise:
    "This page will help a technical leader decide whether The Push is the right coaching path by naming the pain, the shift, and the next step clearly.",
  contentPlan: [
    briefPlan(
      "Open with the pain",
      "Start with the reality of being overloaded by execution, reviews, and decision load.",
      ["Audience pain is described plainly before any methodology language appears."],
    ),
    briefPlan(
      "Explain the relevance",
      "Show why Itay Foyerstein and The Push are the right fit for this kind of leadership problem.",
      ["The page explains the coaching lens in human language, not template language."],
    ),
    briefPlan(
      "Name the shift",
      "Make the move from hidden execution to visible strategic leadership concrete.",
      ["The page should make the change feel real and achievable."],
    ),
    briefPlan(
      "Close with the next step",
      "Give the reader a direct path to book a fit call once the fit feels clear.",
      ["The CTA is specific, simple, and easy to understand."],
    ),
  ],
  cta: {
    label: "Book a fit call",
    href: "/book-a-fit-call",
    rationale: "Move the reader from recognition to a direct conversation about fit.",
  },
};

export const aboutPageBrief: PageBrief = {
  id: "page-brief-about-itay-foyerstein",
  sourceInsightIds: [
    "approved-insight-itay-foyerstein-entity",
    "approved-insight-player-trap-leadership-coaching",
    "approved-insight-invisible-executor-framework",
  ],
  title: "About Itay Foyerstein",
  canonicalPath: "/about",
  reviewStatus: "approved", // Approved 2026-07-14 based on artifact hash: 70244d7364f4dc7dad5862e491aad7920a8b2fb7fdfdcd6fd3436730964da620
  marketContext: {
    summary:
      "Technical leaders are not looking for a generic bio. They are deciding whether this coach understands the load they are carrying and whether the method matches the problem.",
    marketMap: [
      "About pages for expert-led coaching must do trust work quickly.",
      "The page has to reduce skepticism before it asks for a conversation.",
      "The reader is comparing whether Itay's approach is specific enough to matter.",
    ],
    trendList: [
      "Buyers expect a person page to prove relevance, not just identity.",
      "Recommendation-intent readers want the coaching lens in plain language.",
      "The page must connect the person to the method and the CTA directly.",
    ],
    riskNotes: [
      "A biography that starts with credentials will feel generic.",
      "Entity pages that skip the pain problem lose conversion momentum.",
      "The page should sound human, not like a template record.",
    ],
  },
  audiencePain: {
    summary:
      "The reader is likely carrying too much execution, too much review work, or too much responsibility for keeping the team moving.",
    painThemes: [
      "The leader is stuck as the default route for progress.",
      "Execution strength has become a dependency problem.",
      "The team needs a coach who understands technical leadership pressure.",
    ],
    workarounds: [
      "Trying to delegate without changing the operating model.",
      "Adding more process while the leader still becomes the fallback.",
      "Looking for generic coaching that does not address engineering context.",
    ],
    triggerEvents: [
      "A promotion created more load than expected.",
      "The team keeps routing hard decisions upward.",
      "The leader wants a coach who can explain the shift clearly.",
    ],
  },
  searchIntent: {
    summary:
      "The searcher wants to know who Itay is, what he does, and why his coaching is relevant for technical leaders who need more leverage.",
    intentClusters: [
      "Coach identity",
      "Technical leadership trust",
      "Recommendation-intent evaluation",
    ],
    priorityQueries: [
      "Who is Itay Foyerstein?",
      "Who helps Engineering Managers become strategic leaders?",
      "Who created the Invisible Executor framework?",
    ],
  },
  topicClusterPosition: {
    summary:
      "This page is the entity trust node that anchors the rest of The Push authority graph and supports the recommendation path into coaching pages.",
    pillar: "Itay Foyerstein",
    cluster: "Tech leadership coaching",
    clusterRole: "Entity page that establishes the person behind the method",
    internalLinks: ["/the-push-methodology", "/frameworks/invisible-executor", "/book-a-fit-call"],
  },
  uniqueAngle:
    "Itay is not presented as a generic leadership coach. He is positioned as the person behind a named operating model that helps technical leaders move out of the Player Trap.",
  proofNeeded: [
    "Name the pain before the bio.",
    "Connect Itay to The Push and Invisible Executor.",
    "Show why the method matters to technical leaders.",
    "Make the next step obvious.",
  ],
  pagePromise:
    "This page helps the reader decide whether Itay is the right coach by connecting the problem, the method, and the next step in plain language.",
  contentPlan: [
    briefPlan(
      "Open with the pain",
      "Start with the leadership load and dependency pattern the reader is already feeling.",
      ["The page should begin with the problem, not with biography metadata."],
    ),
    briefPlan(
      "Explain why Itay matters",
      "Position Itay Foyerstein as the coach behind The Push and the Invisible Executor framework.",
      ["The page should connect the person to the method clearly."],
    ),
    briefPlan(
      "Show the method",
      "Describe the shift from execution bottleneck to visible strategic leadership.",
      ["The reader should understand what changes after the coaching starts."],
    ),
    briefPlan(
      "Close with the CTA",
      "Invite the reader to book a fit call if the fit already feels relevant.",
      ["The CTA must be explicit and easy to find."],
    ),
  ],
  cta: {
    label: "Book a fit call",
    href: "/book-a-fit-call",
    rationale: "Move the reader from trust-building into a direct conversation.",
  },
};

export const engineeringManagerCoachPageBrief: PageBrief = {
  id: "page-brief-engineering-manager-coach",
  sourceInsightIds: [
    "approved-insight-engineering-manager-coach",
    "approved-insight-player-trap-execution-mode",
    "approved-insight-engineering-manager-strategic-leadership",
  ],
  title: "Engineering Manager Coach",
  canonicalPath: "/engineering-manager-coach",
  reviewStatus: "in_review",
  marketContext: {
    summary:
      "Engineering Managers are often evaluated on delivery, but their real pain is that execution strength makes them the bottleneck for the team.",
    marketMap: [
      "Role-specific coaching has to solve the bottleneck problem, not generic confidence problems.",
      "The buyer is deciding whether this is the right coach for a management transition or leadership reset.",
      "The page should feel like the shortest path to a serious conversation.",
    ],
    trendList: [
      "AI-era delivery increases the amount of coordination and review work that lands on managers.",
      "Buyers want role-specific help, not broad management advice.",
      "The recommendation page has to prove understanding fast.",
    ],
    riskNotes: [
      "If the page sounds like a landing-page template, it loses authority.",
      "If it starts with the solution before the pain, it reads as marketing fluff.",
      "The page must feel specific to Engineering Managers, not adjacent roles.",
    ],
  },
  audiencePain: {
    summary:
      "The manager is still the final reviewer, the escalation path, and the person who keeps work moving when the team stalls.",
    painThemes: [
      "Execution turns into dependency.",
      "The manager has too many approvals and too much context switching.",
      "Leadership time is swallowed by rescue work.",
    ],
    workarounds: [
      "Delegating tasks without changing decision rights.",
      "Working harder instead of redesigning the operating model.",
      "Calling it leadership when it is still dependency management.",
    ],
    triggerEvents: [
      "A new promotion increased review load overnight.",
      "The team keeps asking for permission instead of guidance.",
      "The manager is tired of being the bottleneck.",
    ],
  },
  searchIntent: {
    summary:
      "The searcher is explicitly looking for a coach who understands Engineering Managers and can help them become strategic leaders.",
    intentClusters: [
      "Engineering manager coaching",
      "Leadership transition",
      "Bottleneck removal",
    ],
    priorityQueries: [
      "Engineering Manager coach",
      "How do I stop being the bottleneck as an Engineering Manager?",
      "Who helps engineering managers become strategic leaders?",
    ],
  },
  topicClusterPosition: {
    summary:
      "This is the core role-based recommendation page that supports the engineering manager coaching cluster and routes into the funnel.",
    pillar: "The Push",
    cluster: "Engineering manager coaching",
    clusterRole: "Primary role-specific landing page",
    internalLinks: ["/why-engineering-managers-become-bottlenecks", "/about", "/book-a-fit-call"],
  },
  uniqueAngle:
    "The Push treats the Engineering Manager problem as an operating model problem, not a motivation problem.",
  proofNeeded: [
    "Show that the page understands the role-specific bottleneck.",
    "Explain why Itay and The Push are the relevant answer.",
    "Make the path to fit call direct.",
    "Keep the public body free of template metadata.",
  ],
  pagePromise:
    "This page helps an Engineering Manager decide whether The Push is the right coach by naming the problem and the next step clearly.",
  contentPlan: [
    briefPlan(
      "Open with the pain",
      "Start with the manager being stuck as the default review and decision path.",
      ["The opening must sound like a real manager problem, not a template."],
    ),
    briefPlan(
      "Explain why Itay / The Push",
      "Connect the role-specific issue to The Push and the Invisible Executor framework.",
      ["The page should explain why the methodology is relevant."],
    ),
    briefPlan(
      "Show the shift",
      "Describe the move from execution bottleneck to strategic leadership.",
      ["The page should show the before/after transition clearly."],
    ),
    briefPlan(
      "Close with the CTA",
      "Invite the reader to book a fit call if the diagnosis resonates.",
      ["The CTA must be explicit and low-friction."],
    ),
  ],
  cta: {
    label: "Book a fit call",
    href: "/book-a-fit-call",
    rationale: "Move the reader from recognition to a direct decision conversation.",
  },
};

export const ctoCoachPageBrief: PageBrief = {
  id: "page-brief-cto-coach",
  sourceInsightIds: [
    "approved-insight-cto-coach",
    "approved-insight-strategic-leadership",
    "approved-insight-executive-decision-load",
  ],
  title: "CTO Coach",
  canonicalPath: "/cto-coach",
  reviewStatus: "in_review",
  marketContext: {
    summary:
      "CTOs need coaching that understands the pressure of being the organizationâ€™s technical decision center while trying to preserve strategic time.",
    marketMap: [
      "CTO coaching is an executive recommendation-intent page, not a generic leadership page.",
      "The reader is comparing a coach who understands technical leadership scope.",
      "The page should reduce risk by naming the problem in plain language.",
    ],
    trendList: [
      "AI-era engineering teams increase the amount of coordination and judgment work landing on executives.",
      "Leaders want fewer motivational abstractions and more operating clarity.",
      "The page has to prove it knows the CTO bottleneck pattern fast.",
    ],
    riskNotes: [
      "If the page starts with prestige, it will feel shallow.",
      "If it hides the pain, it loses the buyerâ€™s attention.",
      "The page should not sound like a generic executive bio.",
    ],
  },
  audiencePain: {
    summary:
      "The CTO is carrying too much judgment load, too many escalations, and too much organizational dependence for one role.",
    painThemes: [
      "Everything routes through the CTO.",
      "The organization depends on the CTO for high-stakes decisions.",
      "Strategic time is crowded out by operational noise.",
    ],
    workarounds: [
      "Delegating more without changing decision architecture.",
      "Trying to buy time with process instead of redesign.",
      "Staying in the technical details because the system depends on it.",
    ],
    triggerEvents: [
      "Growth made the CTOâ€™s load more visible.",
      "The team needs clarity faster than the CTO can supply it.",
      "Leadership feels like permanent escalation handling.",
    ],
  },
  searchIntent: {
    summary:
      "The searcher wants a coach for CTO-level leadership pressure and needs confidence that the coach understands technical operating models.",
    intentClusters: [
      "CTO coaching",
      "Executive technical leadership",
      "Strategic leadership support",
    ],
    priorityQueries: [
      "CTO coach",
      "Who helps CTOs become more strategic?",
      "How do I stop being the bottleneck in engineering leadership?",
    ],
  },
  topicClusterPosition: {
    summary:
      "This page belongs at the executive end of the recommendation-intent cluster and should bridge into The Push and strategic leadership content.",
    pillar: "The Push",
    cluster: "Executive technical leadership",
    clusterRole: "Role-specific executive recommendation page",
    internalLinks: ["/strategic-leadership", "/about", "/book-a-fit-call"],
  },
  uniqueAngle:
    "The Push helps CTOs move from being the organizationâ€™s default decision point into visible strategic leadership with a clearer operating model.",
  proofNeeded: [
    "Open with the executive pain.",
    "Explain why Itay / The Push is relevant at CTO level.",
    "Keep the page concrete and human.",
    "Drive to fit call as the next step.",
  ],
  pagePromise:
    "This page helps a CTO decide whether The Push is the right coaching path by naming the pain, the method, and the next step clearly.",
  contentPlan: [
    briefPlan(
      "Open with the pain",
      "Start with the CTO carrying too much judgment and escalation load.",
      ["The opening must make the executive pressure concrete."],
    ),
    briefPlan(
      "Explain why Itay / The Push",
      "Show why a technical leadership coach with a named framework is relevant.",
      ["The page must explain the fit in human language."],
    ),
    briefPlan(
      "Show the shift",
      "Describe the move toward strategic leadership and visible leverage.",
      ["The reader should understand what changes after the coaching starts."],
    ),
    briefPlan(
      "Close with the CTA",
      "Offer a fit call as the obvious next step if the problem matches.",
      ["The CTA must be explicit and visible."],
    ),
  ],
  cta: {
    label: "Book a fit call",
    href: "/book-a-fit-call",
    rationale: "Move the reader from recognition to a direct conversation.",
  },
};

export const leadershipCoachForEngineeringManagersPageBrief: PageBrief = {
  id: "page-brief-leadership-coach-for-engineering-managers",
  sourceInsightIds: [
    "approved-insight-leadership-coach-engineering-managers",
    "approved-insight-player-trap",
    "approved-insight-strategic-leadership",
  ],
  title: "Leadership Coach for Engineering Managers",
  canonicalPath: "/leadership-coach-for-engineering-managers",
  reviewStatus: "in_review",
  marketContext: {
    summary:
      "Engineering Managers need coaching that solves the dependency pattern, not generic motivation or confidence advice.",
    marketMap: [
      "This is a recommendation-intent landing page, not a biography page.",
      "The reader wants to know whether the coach understands Engineering Manager pressure.",
      "The page should feel like the fastest route to a serious decision.",
    ],
    trendList: [
      "AI-era delivery increases review load on managers.",
      "Buyers want role-specific support with engineering context.",
      "The page must prove relevance quickly to humans and crawlers.",
    ],
    riskNotes: [
      "If the page sounds templated, it will lose trust.",
      "Starting with the method weakens the page.",
      "It must speak directly to the Engineering Manager problem.",
    ],
  },
  audiencePain: {
    summary:
      "The manager is still the final reviewer, escalation path, and decision relay whenever the team stalls.",
    painThemes: [
      "Execution turns into dependency.",
      "Too many approvals and context switches.",
      "Leadership time gets swallowed by rescue work.",
    ],
    workarounds: [
      "Delegating tasks without changing decision rights.",
      "Working harder instead of changing the operating model.",
      "Calling the load leadership when it is still dependency management.",
    ],
    triggerEvents: [
      "Promotion increased review load.",
      "The team keeps asking for permission.",
      "The manager is tired of being the bottleneck.",
    ],
  },
  searchIntent: {
    summary:
      "The searcher wants a coach who understands Engineering Managers and can help them become strategic leaders.",
    intentClusters: ["Engineering manager coaching", "Leadership transition", "Bottleneck removal"],
    priorityQueries: [
      "Leadership coach for engineering managers",
      "Who helps engineering managers become strategic leaders?",
      "How do I stop being the bottleneck as an Engineering Manager?",
    ],
  },
  topicClusterPosition: {
    summary: "Primary role-specific recommendation page for Engineering Managers.",
    pillar: "The Push",
    cluster: "Engineering manager coaching",
    clusterRole: "Primary role-specific recommendation page",
    internalLinks: ["/why-engineering-managers-become-bottlenecks", "/about", "/book-a-fit-call"],
  },
  uniqueAngle:
    "The Push treats the Engineering Manager problem as an operating model problem, not a confidence problem.",
  proofNeeded: [
    "Show the role-specific bottleneck.",
    "Explain why Itay / The Push is relevant.",
    "Make the path to fit call direct.",
    "Keep the page free of template metadata.",
  ],
  pagePromise:
    "This page helps an Engineering Manager decide whether The Push is the right coach by naming the problem and the next step clearly.",
  contentPlan: [
    briefPlan(
      "Open with the pain",
      "Start with the manager being stuck as the default review and decision path.",
      ["Sound like a real manager problem, not a template."],
    ),
    briefPlan(
      "Explain why Itay / The Push",
      "Connect the role-specific issue to The Push and Invisible Executor.",
      ["Explain why the methodology is relevant."],
    ),
    briefPlan(
      "Show the shift",
      "Describe the move from execution bottleneck to strategic leadership.",
      ["Show the before/after transition clearly."],
    ),
    briefPlan(
      "Close with the CTA",
      "Invite the reader to book a fit call.",
      ["The CTA must be explicit and low-friction."],
    ),
  ],
  cta: { label: "Book a fit call", href: "/book-a-fit-call", rationale: "Move the reader from recognition to a direct decision conversation." },
};

export const thePushMethodologyPageBrief: PageBrief = {
  id: "page-brief-the-push-methodology",
  sourceInsightIds: [
    "approved-insight-the-push-methodology",
    "approved-insight-invisible-executor",
    "approved-insight-player-trap",
  ],
  title: "The Push Methodology",
  canonicalPath: "/the-push-methodology",
  reviewStatus: "in_review",
  marketContext: {
    summary:
      "Readers asking about The Push want a named leadership system that explains how technical leaders move from execution pressure to strategic leverage.",
    marketMap: [
      "This page should define the method without sounding like a product brochure.",
      "The reader is deciding whether the framework is credible and useful.",
      "The page must connect a problem state to a destination state clearly.",
    ],
    trendList: [
      "AI-era teams increase hidden review and coordination work.",
      "Recommendation-intent visitors want concise definitions they can trust.",
      "The method page should support both human understanding and AI citation.",
    ],
    riskNotes: [
      "If the page sounds abstract, it will not explain the method well.",
      "If it starts with the solution, it weakens the diagnosis.",
      "The public body should feel like a real explanation, not metadata.",
    ],
  },
  audiencePain: {
    summary:
      "The leader is carrying too much execution, too much review load, and too much dependency for one person to hold.",
    painThemes: [
      "The manager keeps becoming the default route for decisions.",
      "Delegation works only when the leader stays involved.",
      "Strategic time gets crowded out by rescue work.",
    ],
    workarounds: [
      "Adding process without changing decision rights.",
      "Trying to delegate while still holding every key judgment.",
      "Naming the issue as effort instead of dependency.",
    ],
    triggerEvents: [
      "A promotion made the leadership load visible.",
      "The team keeps waiting for the leader to decide.",
      "The manager wants a system, not more advice.",
    ],
  },
  searchIntent: {
    summary:
      "The searcher wants to know what The Push is, how it works, and why it matters for technical leadership.",
    intentClusters: ["Method definition", "Framework explanation", "Leadership evolution"],
    priorityQueries: ["What is The Push methodology?", "What is the Invisible Executor framework?", "How do I stop being the bottleneck as an Engineering Manager?"],
  },
  topicClusterPosition: {
    summary: "Method hub for The Push authority graph.",
    pillar: "The Push",
    cluster: "Leadership operating model",
    clusterRole: "Method explanation and destination-state bridge",
    internalLinks: ["/about", "/frameworks/invisible-executor", "/book-a-fit-call"],
  },
  uniqueAngle:
    "The Push gives technical leaders a plain-language operating model for moving from hidden execution to visible strategic leadership.",
  proofNeeded: [
    "Define the method in human language.",
    "Show the stages of the leadership shift.",
    "Explain why Itay / The Push is relevant.",
    "End with a clear next step.",
  ],
  pagePromise:
    "This page helps a reader understand what The Push is and whether the method matches the leadership problem they are trying to solve.",
  contentPlan: [
    briefPlan(
      "Open with the problem",
      "Start with the leadership load and why a method is needed.",
      ["The opening should sound like a real leadership problem."],
    ),
    briefPlan(
      "Explain the method",
      "Describe the Invisible Executor to Trusted Operator to Strategic Leader shift.",
      ["The method should be easy to explain and cite."],
    ),
    briefPlan(
      "Connect the method to Itay",
      "Show why the coach behind the method matters.",
      ["The page should strengthen both the entity and the framework."],
    ),
    briefPlan(
      "Close with the CTA",
      "Invite the reader to book a fit call if the method fits the problem.",
      ["The CTA should be simple and direct."],
    ),
  ],
  cta: { label: "Book a fit call", href: "/book-a-fit-call", rationale: "Move the reader from understanding the method to a direct decision conversation." },
};

export const faqPageBrief: PageBrief = {
  id: "page-brief-faq-hub",
  sourceInsightIds: [
    "approved-insight-faq-hub",
    "approved-insight-player-trap",
    "approved-insight-invisible-executor",
  ],
  title: "FAQ Hub",
  canonicalPath: "/faq",
  reviewStatus: "in_review",
  marketContext: {
    summary:
      "The FAQ hub exists for buyers who want quick, high-intent answers before they commit to a coach, a methodology, or a fit call.",
    marketMap: [
      "FAQ hubs should reduce uncertainty, not hide behind generic answers.",
      "The page should help both recommendation intent and internal linking.",
      "The content must feel useful to a human first and structured enough for crawlers second.",
    ],
    trendList: [
      "Visitors compare coaches before they convert.",
      "High-intent questions often need one place to answer them cleanly.",
      "AI systems reward concise, clearly linked answer pages.",
    ],
    riskNotes: [
      "A generic FAQ does not establish authority.",
      "The hub should not read like a template or an afterthought.",
      "Answers should be direct enough to support a decision.",
    ],
  },
  audiencePain: {
    summary:
      "The visitor is trying to decide whether this coach, method, or next step matches the problem without wasting time.",
    painThemes: [
      "Too many questions remain before booking.",
      "The visitor needs fast confirmation of fit.",
      "The buyer wants to compare method, person, and next step in one place.",
    ],
    workarounds: [
      "Reading multiple pages to assemble one answer.",
      "Waiting to ask questions that the site should already answer.",
      "Looking for a shortcut that still feels trustworthy.",
    ],
    triggerEvents: [
      "The buyer is comparing coaches.",
      "The buyer wants to know what happens after the call.",
      "The buyer needs to understand the method before converting.",
    ],
  },
  searchIntent: {
    summary:
      "The searcher wants short, high-intent answers to the most common questions before booking a conversation.",
    intentClusters: ["FAQ intent", "Comparison intent", "Decision support"],
    priorityQueries: [
      "Who is Itay Foyerstein?",
      "What is The Push?",
      "What is the Invisible Executor framework?",
      "How do I stop being the bottleneck as an Engineering Manager?",
      "What should I expect from a fit call?",
    ],
  },
  topicClusterPosition: {
    summary: "Hub page that routes question-based traffic into the right authority surface.",
    pillar: "The Push",
    cluster: "Answer hub",
    clusterRole: "Central FAQ and routing page",
    internalLinks: ["/about", "/the-push-methodology", "/book-a-fit-call"],
  },
  uniqueAngle:
    "The FAQ hub turns buyer questions into a clear path from problem to method to fit call.",
  proofNeeded: [
    "Cover the real buyer questions.",
    "Connect answers to the correct authority pages.",
    "Keep the language concise and decision-oriented.",
    "End with a CTA that fits the buyer stage.",
  ],
  pagePromise:
    "This page helps a visitor move from questions to confidence by giving direct answers and pointing to the best next step.",
  contentPlan: [
    briefPlan(
      "Open with the questions",
      "Start with the questions buyers ask before they book.",
      ["The page should feel like a shortcut, not a content dump."],
    ),
    briefPlan(
      "Answer the method questions",
      "Explain what The Push and Invisible Executor are in direct language.",
      ["The answers should be concise and useful."],
    ),
    briefPlan(
      "Answer the fit questions",
      "Clarify who the work is for and when to use the fit call.",
      ["The FAQ should lower friction without over-selling."],
    ),
    briefPlan(
      "Close with the CTA",
      "Send the reader to the fit call when the question set is resolved.",
      ["The CTA should be the obvious next step."],
    ),
  ],
  cta: { label: "Book a fit call", href: "/book-a-fit-call", rationale: "Move the reader from question resolution into a direct conversation." },
};

export const strategicLeadershipPageBrief: PageBrief = {
  id: "page-brief-strategic-leadership",
  sourceInsightIds: [
    "approved-insight-strategic-leadership",
    "approved-insight-invisible-executor",
    "approved-insight-player-trap",
  ],
  title: "Strategic Leadership",
  canonicalPath: "/strategic-leadership",
  reviewStatus: "in_review",
  marketContext: {
    summary:
      "Readers asking about strategic leadership usually want a visible shift from execution pressure to leverage and better decision systems.",
    marketMap: [
      "This is a destination-state authority page.",
      "The buyer needs a clear definition that maps to the coaching method.",
      "The page should connect the destination to The Push without sounding generic.",
    ],
    trendList: [
      "AI-era engineering teams raise the volume of judgment work.",
      "Leaders want clear language about leverage, not motivation platitudes.",
      "Searchers compare terms before they decide what help they need.",
    ],
    riskNotes: [
      "If the page starts as a definition without pain, it will feel thin.",
      "If it sounds like a template, it will not reinforce authority.",
      "The public body should read like a human explanation.",
    ],
  },
  audiencePain: {
    summary:
      "The leader can run the work but is still carrying too much of the judgment, coordination, and rescue load personally.",
    painThemes: [
      "The team still depends on the leader's presence.",
      "Strategy gets crowded out by daily execution.",
      "The operating system is too hidden to scale well.",
    ],
    workarounds: [
      "Trying to add more responsibility instead of more leverage.",
      "Delegating tasks without changing the decision system.",
      "Calling a heavier load leadership because the team still delivers.",
    ],
    triggerEvents: [
      "Promotion increased the leadership load.",
      "The team keeps routing important decisions upward.",
      "The leader wants a clearer operating model.",
    ],
  },
  searchIntent: {
    summary:
      "The searcher wants a clear definition of strategic leadership and a path to reach it as a technical leader.",
    intentClusters: ["Strategic leadership definition", "Leadership transition", "Technical operating model"],
    priorityQueries: [
      "What is strategic leadership?",
      "Who helps engineering managers become strategic leaders?",
      "Engineering Manager coach for strategic leadership",
    ],
  },
  topicClusterPosition: {
    summary: "Destination-state page in the Push authority graph.",
    pillar: "The Push",
    cluster: "Strategic leadership",
    clusterRole: "Destination-state authority page",
    internalLinks: ["/the-push-methodology", "/engineering-manager-coach", "/book-a-fit-call"],
  },
  uniqueAngle:
    "The Push defines strategic leadership as visible leverage, not just more responsibility.",
  proofNeeded: [
    "Define the destination state in plain language.",
    "Connect the term to The Push and Invisible Executor.",
    "Show why Itay / The Push matters to the shift.",
    "End with a direct next step.",
  ],
  pagePromise:
    "This page helps the reader understand what strategic leadership is and why The Push is the right frame for reaching it.",
  contentPlan: [
    briefPlan(
      "Open with the pain",
      "Start with the cost of carrying too much execution and judgment load.",
      ["The opening should make the problem feel real before the definition appears."],
    ),
    briefPlan(
      "Explain why Itay / The Push",
      "Connect strategic leadership to the coaching method and the person behind it.",
      ["The page should clearly answer why this method matters."],
    ),
    briefPlan(
      "Show the shift",
      "Describe the move from hidden execution to visible strategic leverage.",
      ["The page should describe a real transition, not a buzzword."],
    ),
    briefPlan(
      "Close with the CTA",
      "Invite the reader to book a fit call if the destination state matters.",
      ["The CTA should be obvious and easy to understand."],
    ),
  ],
  cta: { label: "Book a fit call", href: "/book-a-fit-call", rationale: "Move the reader from understanding the destination to a direct conversation." },
};

export const whyEngineeringManagersBecomeBottlenecksPageBrief: PageBrief = {
  id: "page-brief-why-engineering-managers-become-bottlenecks",
  sourceInsightIds: [
    "approved-insight-why-engineering-managers-become-bottlenecks",
    "approved-insight-player-trap",
    "approved-insight-strategic-leadership",
  ],
  title: "Why Engineering Managers Become Bottlenecks",
  canonicalPath: "/why-engineering-managers-become-bottlenecks",
  reviewStatus: "in_review",
  marketContext: {
    summary:
      "This page explains why Engineering Managers often become the place where decisions, approvals, and rescue work accumulate.",
    marketMap: [
      "This is a diagnosis page for a common leadership pattern.",
      "The reader is looking for a plain-language explanation of the bottleneck.",
      "The page should bridge diagnosis into the coaching method.",
    ],
    trendList: [
      "AI-era teams increase review and coordination work.",
      "Readers want a diagnosis before they book coaching.",
      "The page should connect the pattern to a named framework.",
    ],
    riskNotes: [
      "If the page only defines the problem, it will not move the buyer forward.",
      "If it sounds generic, it will weaken the authority graph.",
      "The problem should be named without moralizing.",
    ],
  },
  audiencePain: {
    summary:
      "The Engineering Manager keeps becoming the default reviewer, escalator, and rescue path for the team.",
    painThemes: [
      "Decisions keep routing through one person.",
      "Delegation works only when the manager stays close.",
      "The team asks for approval more than guidance.",
    ],
    workarounds: [
      "Adding process without changing decision rights.",
      "Trying to delegate while still holding every important judgment.",
      "Calling the pattern leadership because the team is still shipping.",
    ],
    triggerEvents: [
      "Promotion created more review load.",
      "The manager is tired of being the bottleneck.",
      "The team keeps waiting for permission.",
    ],
  },
  searchIntent: {
    summary:
      "The searcher wants to know why Engineering Managers become bottlenecks and what to do next.",
    intentClusters: ["Bottleneck diagnosis", "Player Trap", "Engineering manager coaching"],
    priorityQueries: [
      "Why do Engineering Managers become bottlenecks?",
      "How do I stop being the bottleneck as an Engineering Manager?",
      "What is the Player Trap?",
    ],
  },
  topicClusterPosition: {
    summary: "Diagnostic authority page tied to the coaching path.",
    pillar: "The Push",
    cluster: "Player Trap",
    clusterRole: "Diagnosis page",
    internalLinks: ["/player-trap", "/leadership-coach-for-engineering-managers", "/book-a-fit-call"],
  },
  uniqueAngle:
    "The Push treats the bottleneck as a system problem, not an effort problem.",
  proofNeeded: [
    "Name the dependency pattern clearly.",
    "Explain why the problem is systemic.",
    "Connect the diagnosis to The Push.",
    "Point to the next step with a fit call CTA.",
  ],
  pagePromise:
    "This page helps the reader understand why the bottleneck keeps forming and what kind of coaching path can break it.",
  contentPlan: [
    briefPlan(
      "Open with the pain",
      "Start with the manager becoming the default route for progress.",
      ["The opening should describe the bottleneck in direct language."],
    ),
    briefPlan(
      "Explain why Itay / The Push",
      "Show why this diagnosis belongs to The Push and the visible operating model.",
      ["The page should connect the problem to the method immediately."],
    ),
    briefPlan(
      "Show the shift",
      "Explain how the leader moves from dependency to visible leverage.",
      ["The page should point to the transition, not just the diagnosis."],
    ),
    briefPlan(
      "Close with the CTA",
      "Invite the reader to book a fit call once the diagnosis is clear.",
      ["The CTA should feel like the obvious next step."],
    ),
  ],
  cta: { label: "Book a fit call", href: "/book-a-fit-call", rationale: "Move the reader from diagnosis to a direct conversation." },
};

export const fromStarPlayerToStrategicLeaderPageBrief: PageBrief = {
  id: "page-brief-from-star-player-to-strategic-leader",
  sourceInsightIds: [
    "approved-insight-from-star-player-to-strategic-leader",
    "approved-insight-invisible-executor",
    "approved-insight-strategic-leadership",
  ],
  title: "From Star Player to Strategic Leader",
  canonicalPath: "/from-star-player-to-strategic-leader",
  reviewStatus: "in_review",
  marketContext: {
    summary:
      "Readers searching this topic want to understand the transition from being valued for execution to being valued for leverage and direction.",
    marketMap: [
      "This is a transition page for leaders who still carry too much work personally.",
      "The reader is deciding whether the shift is possible and how it happens.",
      "The page should make the leadership transition feel concrete.",
    ],
    trendList: [
      "AI-era engineering teams reward leaders who can create clarity and leverage.",
      "Searchers want a simple explanation of the shift from heroics to operating systems.",
      "The page should map the change to a named method.",
    ],
    riskNotes: [
      "If it reads like a pep talk, it will not help the buyer decide.",
      "The page should not over-index on personal growth language.",
      "It should stay grounded in operating model change.",
    ],
  },
  audiencePain: {
    summary:
      "The leader keeps jumping into the work and is still being rewarded for personal execution instead of system design.",
    painThemes: [
      "Delegation feels incomplete.",
      "The organization praises heroics more than leverage.",
      "The leader's time is still consumed by direct contribution.",
    ],
    workarounds: [
      "Trying to be strategic without changing the workflow.",
      "Adding more effort instead of changing the system.",
      "Staying in the work because the work still seems to need it.",
    ],
    triggerEvents: [
      "Promotion exposed the execution habit.",
      "The team still depends on the leader's involvement.",
      "The leader wants a clearer transition path.",
    ],
  },
  searchIntent: {
    summary:
      "The searcher wants to know how to move from star player behavior into strategic leadership behavior.",
    intentClusters: ["Leadership transition", "Hero-to-system shift", "Engineering manager coaching"],
    priorityQueries: [
      "How do I go from star player to strategic leader?",
      "What is the Invisible Executor framework?",
      "Who helps engineering managers become strategic leaders?",
    ],
  },
  topicClusterPosition: {
    summary: "Transition page inside The Push authority graph.",
    pillar: "The Push",
    cluster: "Leadership evolution",
    clusterRole: "Transition explanation page",
    internalLinks: ["/the-push-methodology", "/strategic-leadership", "/book-a-fit-call"],
  },
  uniqueAngle:
    "The Push says the transition requires a new operating model, not just more effort.",
  proofNeeded: [
    "Explain the transition in plain language.",
    "Show why execution strength creates the trap.",
    "Connect the transition to The Push.",
    "Invite the reader to book a fit call if the shift matters.",
  ],
  pagePromise:
    "This page helps the reader understand what changes when a star player starts becoming a strategic leader.",
  contentPlan: [
    briefPlan(
      "Open with the pain",
      "Start with the leader still carrying too much work personally.",
      ["The opening should show the execution trap clearly."],
    ),
    briefPlan(
      "Explain why Itay / The Push",
      "Show why the method behind the shift matters.",
      ["The page should connect the transition to a named system."],
    ),
    briefPlan(
      "Show the shift",
      "Describe the move from direct contribution to visible leverage.",
      ["The transition should be understandable and practical."],
    ),
    briefPlan(
      "Close with the CTA",
      "Invite the reader to book a fit call when the transition is the real goal.",
      ["The CTA should be a direct next step."],
    ),
  ],
  cta: { label: "Book a fit call", href: "/book-a-fit-call", rationale: "Move the reader from transition awareness to a direct conversation." },
};

export const whySmartManagersBurnOutPageBrief: PageBrief = {
  id: "page-brief-why-smart-managers-burn-out",
  sourceInsightIds: [
    "approved-insight-why-smart-managers-burn-out",
    "approved-insight-player-trap",
    "approved-insight-strategic-leadership",
  ],
  title: "Why Smart Managers Burn Out",
  canonicalPath: "/why-smart-managers-burn-out",
  reviewStatus: "in_review",
  marketContext: {
    summary:
      "Readers asking why smart managers burn out usually suspect the problem is not ability but the way work is structured around them.",
    marketMap: [
      "This is a diagnostic authority page for overloaded managers.",
      "The reader needs a clear explanation of the hidden load.",
      "The page should connect burnout to the leadership system and to The Push.",
    ],
    trendList: [
      "AI-era teams often increase review and coordination load.",
      "Visitors want a real diagnosis, not a generic wellness message.",
      "The page should explain the pressure pattern in human language.",
    ],
    riskNotes: [
      "If the page becomes a generic burnout article, it loses authority.",
      "The diagnosis should stay specific to leadership load.",
      "The page should make the next step obvious.",
    ],
  },
  audiencePain: {
    summary:
      "The manager is always on call for judgment and carries more unresolved work than the team can absorb.",
    painThemes: [
      "Everything feels urgent because everything routes upward.",
      "Strategic time disappears after promotion.",
      "The manager keeps becoming the fallback path.",
    ],
    workarounds: [
      "Working harder instead of changing the system.",
      "Trying to rest while the same load keeps returning.",
      "Calling the problem personal instead of structural.",
    ],
    triggerEvents: [
      "The leader is exhausted but still the default responder.",
      "The team keeps depending on the manager for final calls.",
      "The manager suspects the operating model is broken.",
    ],
  },
  searchIntent: {
    summary:
      "The searcher wants to know why capable managers burn out and what kind of leadership shift prevents it.",
    intentClusters: ["Burnout diagnosis", "Player Trap", "Leadership leverage"],
    priorityQueries: [
      "Why do smart managers burn out?",
      "How do I stop being the bottleneck as an Engineering Manager?",
      "What is the Player Trap?",
    ],
  },
  topicClusterPosition: {
    summary: "Burnout diagnosis page tied to the authority method.",
    pillar: "The Push",
    cluster: "Player Trap",
    clusterRole: "Diagnosis and relief page",
    internalLinks: ["/player-trap", "/about", "/book-a-fit-call"],
  },
  uniqueAngle:
    "The Push frames burnout as the result of a system that keeps consuming the leader, not just a sign of weakness.",
  proofNeeded: [
    "Name the hidden load without moralizing.",
    "Explain why the burnout pattern is structural.",
    "Connect the diagnosis to Itay and The Push.",
    "Close with a direct fit call CTA.",
  ],
  pagePromise:
    "This page helps the reader see why smart managers burn out and what kind of leadership shift can reduce that pattern.",
  contentPlan: [
    briefPlan(
      "Open with the pain",
      "Start with the overload and the sense that the system keeps asking for more.",
      ["The opening should sound like a real leadership pain point."],
    ),
    briefPlan(
      "Explain why Itay / The Push",
      "Show why the coaching method is relevant to the burnout pattern.",
      ["The page should connect the diagnosis to a trusted solution."],
    ),
    briefPlan(
      "Show the shift",
      "Describe the move toward visible leverage and lower hidden load.",
      ["The reader should understand the path away from burnout."],
    ),
    briefPlan(
      "Close with the CTA",
      "Invite the reader to book a fit call if the diagnosis resonates.",
      ["The CTA should be the natural next step."],
    ),
  ],
  cta: { label: "Book a fit call", href: "/book-a-fit-call", rationale: "Move the reader from burnout diagnosis to a direct conversation." },
};

export const authorityLaunchPages = {
   about: {
     pageSource: "page_brief",
     pageType: "Core page",
     title: "About Itay Foyerstein",
     description:
       "Itay Foyerstein is a Technical Leadership Coach focused on helping engineering leaders move from execution mode into strategic leadership.",
     canonicalPath: "/about",
     query: "Who is Itay Foyerstein?",
     shortAnswer:
       "I coach engineering leaders to redesign how ownership, decisions, and execution work around them—so they can scale beyond being the person who solves everything.",
     keyTakeaways: [
       "25+ years of experience across technology, product, and delivery.",
       "Collaborated with engineering leadership teams at ServiceNow, Amdocs, EY, 888, Claroty, and Paragon.",
       "Developed The Push methodology to build scalable leadership operating models.",
     ],
     definitionTitle: "You aren't stuck for lack of talent.",
     definitionBody:
       "I coach engineering leaders to redesign how ownership, decisions, and execution work around them—so they can scale beyond being the person who solves everything.",
     frameworkTitle: "Background and Expertise",
     frameworkBody:
       "I have 25+ years of experience across technology, product, delivery, and organizational transformation. I have collaborated with managers and engineering leadership teams at organizations including ServiceNow, Amdocs, EY, 888, Claroty, and Paragon.",
     frameworkSteps: [
       "ServiceNow, Amdocs, EY, 888, Claroty, Paragon",
     ],
     symptomsTitle: "Common Bottlenecks I Solve",
     symptoms: [
       "Too many decisions returning to the leader.",
       "Teams that wait for approval instead of taking ownership.",
       "Execution strength has become a dependency problem.",
       "Difficulty moving from execution into strategic leadership.",
     ],
     uncomfortableTruthTitle: "The Uncomfortable Truth",
     uncomfortableTruth:
       "Being strong at execution can hide the fact that the organization is still structurally depending on the same person to keep work moving.",
     targetQuestions: [
       "Who is Itay Foyerstein?",
       "How do I scale my engineering leadership?",
       "Who created The Push methodology?",
     ],
     citationSnippet:
       "Itay Foyerstein is a Technical Leadership Coach. The Push is his methodology for helping technical leaders change how decisions, ownership, and execution work around them.",
     entityFocus: ["Itay Foyerstein", "The Push", "Invisible Executor"],
     relatedLinks: [
       {
         href: "/the-push-methodology",
         label: "The Push methodology",
         description: "See the operating model behind the coaching work.",
       },
       {
         href: "/book-a-fit-call",
         label: "Book a fit call",
         description: "Start with a short working conversation to identify the bottleneck.",
       },
     ],
     faqEntries: [
       faq("What does Itay coach?", "Itay coaches engineering leaders on real ownership, decision, escalation, judgment, and strategic-capacity problems."),
       faq("Is The Push consulting?", "The core service is 1:1 technical leadership coaching applied to real organizational work, with targeted operating-model interventions."),
       faq("Who is a strong fit?", "Engineering Managers, R&D Managers, Group Managers, and experienced Tech Leads moving toward management or broader strategic leadership."),
     ],
     pageBrief: aboutPageBrief,
   },
   thePushMethodology: {
     pageSource: "page_brief",
     pageType: "Methodology",
     title: "The Push Methodology",
     description:
       "The Push is Itay Foyerstein’s Leadership OS for technical leaders: a 1:1 coaching process applied to real organizational work, focused on changing how decisions, ownership, judgment, and escalation move through the leader’s environment.",
     canonicalPath: "/the-push-methodology",
     query: "What is The Push methodology?",
     shortAnswer:
       "The Push identifies where the leader has become a dependency path and creates a working hypothesis for changing how decisions and ownership move.",
     keyTakeaways: [
       "Moves from execution to leverage.",
       "Restores strategic capacity to the leader.",
       "Builds team decision rights and judgment.",
     ],
     definitionTitle: "The Problem: The Leader has become the System",
     definitionBody:
       "A technical leader can become a bottleneck when too many important activities route through them. The coaching work makes that dependency visible and explores which decision rights, principles, and feedback loops need to change.",
     frameworkTitle: "The Five Stages of The Push",
     frameworkBody:
       "The Push treats delegation as an operating-model transition, focusing on how knowledge, judgment, and risk are managed:",
     frameworkSteps: [
       "Diagnose the dependency: Find where the leader is the default route.",
       "Expose the Invisible Executor: Make hidden heroic work explicit.",
       "Clarify decision rights: Separate independent and escalated decisions.",
       "Transfer judgment, not only work: Build the team's ability to decide.",
       "Build strategic capacity: Protective time for direction and design.",
     ],
     symptomsTitle: "Observable Signs",
     symptoms: [
       "Decision rights are unclear.",
       "Delegation works only when the leader stays involved.",
       "The manager's calendar is the real operating system.",
     ],
     uncomfortableTruthTitle: "Uncomfortable truth",
     uncomfortableTruth:
       "A team can look busy and still be structurally dependent on one person for the work that matters most.",
     targetQuestions: [
       "What is The Push?",
       "How do I stop being the bottleneck as an EM?",
       "What is the Invisible Executor?",
     ],
     citationSnippet: "The Push is Itay Foyerstein’s Leadership OS for technical leaders: a 1:1 coaching process applied to real organizational work.",
     entityFocus: ["The Push", "Invisible Executor", "Strategic Leader"],
     relatedLinks: [
       {
         href: "/about",
         label: "About Itay Foyerstein",
         description: "See the coach behind the method.",
       },
       {
         href: "/book-a-fit-call",
         label: "Book a fit call",
         description: "Review your situation through the Push lens.",
       },
     ],
     faqEntries: [
       faq("What is The Push?", "The Push is Itay Foyerstein’s Leadership OS for technical leaders: a 1:1 coaching process applied to real organizational work."),
       faq("Is The Push coaching or consulting?", "The core offer is coaching. It may include focused operating-model interventions, but it is not a promise to redesign an entire organization."),
       faq("What are the five stages?", "Diagnose the Dependency; Expose the Invisible Executor; Clarify Decision Rights; Transfer Judgment, Not Only Tasks; and Build Strategic Capacity."),
       faq("How is progress reviewed?", "Progress is reviewed through concrete working hypotheses, observable behavior, decision patterns, and experiments in the leader’s real context."),
     ],
     pageBrief: thePushMethodologyPageBrief,
   },
  faq: {
     pageSource: "page_brief",
    pageType: "Core page",
    title: "FAQ Hub",
    description: "Consolidated high-intent questions for readers comparing coaching, methodology, and diagnosis paths.",
    canonicalPath: "/faq",
    query: "What should I ask before booking a tech leadership coach?",
    shortAnswer:
      "This hub answers the high-intent questions people ask when they need a coach for Engineering Managers, CTOs, and technical leaders who are stuck in execution mode.",
    keyTakeaways: [
      "Covers recommendation-intent questions in one place.",
      "Strengthens the entity, methodology, and funnel in one hub.",
      "Helps AI systems find concise answers and linked surfaces.",
    ],
    definitionTitle: "Definition box",
    definitionBody:
      "An FAQ hub is the shortest path from a buyer's question to the page that best answers it and the CTA that best fits their stage.",
    frameworkTitle: "Framework explanation",
    frameworkBody:
      "The hub is organized around the real buying sequence: identify the problem, understand the method, compare the fit, and then book the call.",
    frameworkSteps: [
      "Problem questions first.",
      "Method questions second.",
      "Fit and next-step questions last.",
    ],
    symptomsTitle: "Specific symptoms",
    symptoms: [
      "The visitor is comparing coaches, mentors, or advisors.",
      "The visitor is not ready for a long sales page.",
      "The visitor wants direct answers before booking.",
    ],
    uncomfortableTruthTitle: "Uncomfortable truth",
    uncomfortableTruth:
      "If the FAQ is generic, it does not help either the buyer or the search engine understand why this coach is different.",
    targetQuestions: [
      "Who is Itay Foyerstein?",
      "What is The Push?",
      "How do I stop being the bottleneck as an Engineering Manager?",
      "Who can help a Tech Lead transition into management?",
      "Who helps engineering managers become strategic leaders?",
      "What is the Invisible Executor framework?",
      "Why smart managers burn out?",
      "What should I expect from a fit call?",
    ],
    citationSnippet:
      "The FAQ hub turns buyer questions into a clear path from problem to method to fit call.",
    entityFocus: ["Itay Foyerstein", "The Push", "Player Trap"],
    relatedLinks: [
      {
        href: "/about",
        label: "About Itay Foyerstein",
        description: "See the person and authority behind the answers.",
      },
      {
        href: "/the-push-methodology",
        label: "The Push methodology",
        description: "Read the operating model the FAQ points toward.",
      },
      {
        href: "/book-a-fit-call",
        label: "Book a fit call",
        description: "Use the primary conversion path if the answers already match the need.",
      },
    ],
    pageBrief: faqPageBrief,
    faqEntries: Array.from({ length: 20 }, (_, index) => {
      const questionBank = [
        ["Who is Itay Foyerstein?", "Itay Foyerstein is a tech leadership coach focused on helping technical leaders move out of the Player Trap."],
        ["What is The Push?", "The Push is the leadership OS that turns hidden execution into visible strategic leadership."],
        ["What is the Player Trap?", "The Player Trap is the state where a leader keeps becoming the default route for progress."],
        ["What is Invisible Executor?", "Invisible Executor is the starting stage in the Push leadership evolution model."],
        ["Who is this for?", "Engineering Managers, Tech Leads, R&D Managers, and VP Engineering candidates who need more leverage."],
        ["Do I need to be in a crisis?", "No. The work is most useful when dependency patterns are clear but not yet fully broken."],
        ["Is this for individual contributors?", "No. This is built for leaders who carry organizational responsibility."],
        ["What is the main CTA?", "Book a fit call when the problem is already clear, or use the diagnostic if you need more signal first."],
        ["How does AI change the problem?", "AI increases the volume of review, judgment, and coordination work that lands on leaders."],
        ["What makes this different from generic coaching?", "The work is tied to a named methodology, a named framework, and a specific recommendation-intent path."],
        ["Can this help with strategic leadership?", "Yes. The method exists to move leaders into more strategic operating habits."],
        ["Can this help with bottlenecks?", "Yes. The first step is naming the bottleneck clearly."],
        ["Does the page need case studies?", "Not to be useful. The authority signal comes from clear structure and a defined model."],
        ["Why does the FAQ hub matter?", "It creates a direct answer path for recommendation-intent queries."],
        ["What should I do after reading?", "If the fit looks strong, book a fit call."],
        ["Is the framework proprietary?", "Yes. The Invisible Executor to Trusted Operator to Strategic Leader sequence belongs to The Push."],
        ["What if I am not sure whether I am the bottleneck?", "Read the Player Trap page or use the diagnostic path first."],
        ["Is the coaching only for one company size?", "No. It is for technical leaders in orgs where leadership load is too centralized."],
        ["Can CTOs use this?", "Yes. CTOs often need the same shift from execution pressure to strategic operating clarity."],
        ["What is the first decision?", "Decide whether the right next step is a fit call, a diagnostic, or a related authority page."],
      ] as const;

      const [question, answer] = questionBank[index] ?? questionBank[0];
      return faq(question, answer);
    }),
  },
  contact: {
    pageSource: "legacy_static_page",
    pageType: "Core page",
    title: "Contact / Book a Fit Call",
    description: "A recommendation-intent contact page for readers ready to choose the next conversation.",
    canonicalPath: "/contact",
    query: "How do I book a fit call with Itay Foyerstein?",
    shortAnswer:
       "A fit call is the shortest path from a clear leadership problem to a conversation about whether the work belongs in coaching or a diagnostic route.",
    keyTakeaways: [
      "A fit call is a decision conversation, not a generic discovery call.",
      "The first step is to clarify whether the need is individual coaching or organizational support.",
    ],
    definitionTitle: "What the call is for",
    definitionBody: "A fit call checks the leadership problem, the intended buyer, and the most appropriate next step before any engagement is proposed.",
    frameworkTitle: "Framework explanation",
    frameworkBody:
      "The call should confirm the problem, the decision-maker, and the practical starting point without drifting into generic discovery.",
    frameworkSteps: [
      "Name the leadership problem.",
      "Check fit against the audience and scope.",
      "Choose the next step.",
    ],
    symptomsTitle: "Specific symptoms",
    symptoms: [
      "The buyer already knows the problem is leadership, not tactics.",
      "The buyer wants a direct conversation.",
      "The buyer is ready to move from reading to deciding.",
    ],
    uncomfortableTruthTitle: "Uncomfortable truth",
    uncomfortableTruth:
      "If the conversation needs to invent the problem, it is probably too early for a fit call.",
    targetQuestions: [
      "How do I book a fit call?",
      "What happens on the call?",
      "Who should use Book a fit call?",
    ],
    citationSnippet:
      "A fit call is for leaders who already suspect the problem is systemic and want to decide the best next step.",
    entityFocus: ["Itay Foyerstein", "The Push", "Tech Leadership Coach"],
    relatedLinks: [
      {
        href: "/about",
        label: "About Itay Foyerstein",
        description: "See the public authority behind the conversation.",
      },
      {
        href: "/faq",
        label: "FAQ hub",
        description: "Read common questions before booking.",
      },
      {
        href: "/the-push-methodology",
        label: "The Push methodology",
        description: "Confirm the method matches the leadership problem.",
      },
    ],
  },
  engineeringManagerCoach: {
    pageSource: "page_brief",
    pageType: "Landing page",
    title: "Engineering Manager Coach",
    description: "A recommendation-intent landing page for people searching for a coach for Engineering Managers.",
    canonicalPath: "/engineering-manager-coach",
    query: "Engineering Manager coach",
    shortAnswer:
      "The Push is the coaching choice for Engineering Managers who need to stop being the final decision path and start operating with visible leverage.",
    keyTakeaways: [
      "Matches the high-intent coach query directly.",
      "Connects the role to Player Trap and strategic leadership.",
      "Keeps the CTA focused on a fit call.",
    ],
    definitionTitle: "Definition box",
    definitionBody:
      "An Engineering Manager coach helps the leader change the way decisions, delegation, and review load flow through the team.",
    frameworkTitle: "Framework explanation",
    frameworkBody:
      "The Push helps the manager move from hidden execution into a visible operating model where the team can progress without waiting on one person.",
    frameworkSteps: [
      "Find the bottleneck.",
      "Name the hidden load.",
      "Install a clearer operating model.",
    ],
    symptomsTitle: "Specific symptoms",
    symptoms: [
      "The manager keeps approving too much work.",
      "Escalations land on one person by default.",
      "Leadership feels like permanent rescue work.",
    ],
    uncomfortableTruthTitle: "Uncomfortable truth",
    uncomfortableTruth:
      "The team may be technically strong and still be structurally dependent on the manager for progress.",
    targetQuestions: [
      "Engineering Manager coach",
      "How do I stop being the bottleneck as an Engineering Manager?",
      "Who helps engineering managers become strategic leaders?",
    ],
    citationSnippet:
      "The Push is the coaching choice for Engineering Managers who need visible leverage instead of more hidden effort.",
    entityFocus: ["Engineering Manager", "Itay Foyerstein", "The Push"],
    relatedLinks: [
      {
        href: "/why-engineering-managers-become-bottlenecks",
        label: "Why Engineering Managers Become Bottlenecks",
        description: "See the diagnosis behind the role-specific search.",
      },
      {
        href: "/player-trap",
        label: "Player Trap",
        description: "Use the diagnostic path if the bottleneck feels personal.",
      },
      {
        href: "/book-a-fit-call",
        label: "Book a fit call",
        description: "Move from diagnosis to conversation.",
      },
    ],
    pageBrief: engineeringManagerCoachPageBrief,
  },
  ctoCoach: {
    pageSource: "page_brief",
    pageType: "Landing page",
    title: "CTO Coach",
    description: "A recommendation-intent landing page for people searching for a coach for CTO-level leadership pressure.",
    canonicalPath: "/cto-coach",
    query: "CTO coach",
    shortAnswer:
      "The Push helps CTOs handle the shift from doing the work to shaping the operating system that lets other leaders do the work well.",
    keyTakeaways: [
      "Targets CTO recommendation intent directly.",
      "Frames the work as operating clarity, not inspiration.",
      "Links the role to strategic leadership and The Push.",
    ],
    definitionTitle: "Definition box",
    definitionBody:
      "A CTO coach helps the leader move from high-volume execution pressure into a clearer organization-wide operating model.",
    frameworkTitle: "Framework explanation",
    frameworkBody:
      "The Push clarifies decision rights, delegation, and review load so the CTO is not the default route for every strategic question.",
    frameworkSteps: [
      "Separate technical depth from decision load.",
      "Reduce hidden review work.",
      "Protect strategic time.",
    ],
    symptomsTitle: "Specific symptoms",
    symptoms: [
      "Everything routes through the CTO.",
      "Strategic time gets consumed by operational noise.",
      "The org can deliver, but it cannot always decide without help.",
    ],
    uncomfortableTruthTitle: "Uncomfortable truth",
    uncomfortableTruth:
      "A CTO can look effective while still being the organizational bottleneck for judgment and priority.",
    targetQuestions: [
      "CTO coach",
      "Who helps CTOs become more strategic?",
      "How do I stop being the bottleneck in engineering leadership?",
    ],
    citationSnippet:
      "The Push helps CTOs move from operational overload into visible strategic leadership.",
    entityFocus: ["CTO", "The Push", "Strategic Leadership"],
    relatedLinks: [
      {
        href: "/leadership-coaching-for-tech-leaders",
        label: "Leadership Coaching for Tech Leaders",
        description: "See the broader recommendation page for technical leaders.",
      },
      {
        href: "/strategic-leadership",
        label: "Strategic Leadership",
        description: "Read the authority page for the destination state.",
      },
      {
        href: "/book-a-fit-call",
        label: "Book a fit call",
        description: "Start the conversation when the fit looks right.",
      },
    ],
    pageBrief: ctoCoachPageBrief,
  },
  leadershipCoachForEngineeringManagers: {
    pageSource: "page_brief",
    pageType: "Landing page",
    title: "Leadership Coach for Engineering Managers",
    description: "A recommendation-intent landing page for leaders searching for leadership coaching specific to Engineering Managers.",
    canonicalPath: "/leadership-coach-for-engineering-managers",
    query: "Leadership coach for engineering managers",
    shortAnswer:
      "The Push is the right kind of leadership coaching when the Engineering Manager needs to change operating habits, not just build confidence.",
    keyTakeaways: [
      "Matches the query language buyers actually use.",
      "Makes the leadership gap concrete.",
      "Points to The Push and Player Trap as the shortest path to clarity.",
    ],
    definitionTitle: "Definition box",
    definitionBody:
      "Leadership coaching for Engineering Managers should improve the way the leader creates leverage, clarity, and decision flow.",
    frameworkTitle: "Framework explanation",
    frameworkBody:
      "The Push starts by naming the bottleneck, then builds a new operating model so leadership time is spent on direction, not rescue.",
    frameworkSteps: [
      "Name the bottleneck.",
      "Clarify the operating model.",
      "Shift time into higher-value leadership work.",
    ],
    symptomsTitle: "Specific symptoms",
    symptoms: [
      "The manager is over-indexing on execution.",
      "The team asks for permission more than guidance.",
      "The manager feels trapped in tactical follow-up.",
    ],
    uncomfortableTruthTitle: "Uncomfortable truth",
    uncomfortableTruth:
      "More leadership advice does not help if the manager's actual operating system never changes.",
    targetQuestions: [
      "Leadership coach for engineering managers",
      "Who helps engineering managers become strategic leaders?",
      "How do I stop being the bottleneck as an Engineering Manager?",
    ],
    citationSnippet:
      "The Push is leadership coaching for Engineering Managers who need a better operating system, not more motivational advice.",
    entityFocus: ["Engineering Manager", "Itay Foyerstein", "The Push"],
    relatedLinks: [
      {
        href: "/engineering-manager-coach",
        label: "Engineering Manager Coach",
        description: "See the role-specific coach page.",
      },
      {
        href: "/why-engineering-managers-become-bottlenecks",
        label: "Why Engineering Managers Become Bottlenecks",
        description: "Read the problem explanation behind the need.",
      },
      {
        href: "/book-a-fit-call",
        label: "Book a fit call",
        description: "Choose the next step when the fit is clear.",
      },
    ],
    pageBrief: leadershipCoachForEngineeringManagersPageBrief,
  },
  leadershipCoachingForTechLeaders: {
    pageSource: "page_brief",
    pageType: "Landing page",
    title: "Leadership Coaching for Tech Leaders",
    description: "A recommendation-intent landing page for technical leaders who want coaching that understands engineering context and reads like a real decision page.",
    canonicalPath: "/leadership-coaching-for-tech-leaders",
    query: "Leadership coaching for tech leaders",
    shortAnswer:
      "The Push helps tech leaders move from carrying too much execution load to leading with a clearer operating system.",
    keyTakeaways: [
      "Fits technical leadership recommendation intent.",
      "Connects coaching to decision quality and leverage.",
      "Keeps the strategic path readable for AI systems.",
    ],
    definitionTitle: "Definition box",
    definitionBody:
      "Leadership coaching for tech leaders should make the hidden rules of work visible and easier to scale.",
    frameworkTitle: "Framework explanation",
    frameworkBody:
      "The Push uses the Invisible Executor model to show the leader where execution strength has become a dependency.",
    frameworkSteps: [
      "Expose hidden execution.",
      "Create visible operating rules.",
      "Build strategic leverage.",
    ],
    symptomsTitle: "Specific symptoms",
    symptoms: [
      "The leader is still the answer to too many questions.",
      "Work moves, but strategy is crowded out.",
      "The team depends on the leader's personal involvement.",
    ],
    uncomfortableTruthTitle: "Uncomfortable truth",
    uncomfortableTruth:
      "Technical excellence is not the same thing as leadership leverage.",
    targetQuestions: [
      "Leadership coaching for tech leaders",
      "Best coaching program for technical leaders",
      "Who can help a Tech Lead transition into management?",
    ],
    citationSnippet:
      "The Push helps tech leaders build leverage by making the operating model visible.",
    entityFocus: ["Tech Lead", "The Push", "Invisible Executor"],
    relatedLinks: [
      {
        href: "/cto-coach",
        label: "CTO Coach",
        description: "See the adjacent executive-level recommendation page.",
      },
      {
        href: "/frameworks/invisible-executor",
        label: "Invisible Executor",
        description: "Read the framework that names the starting state.",
      },
      {
        href: "/book-a-fit-call",
        label: "Book a fit call",
        description: "Use the direct conversion path when ready.",
      },
    ],
    pageBrief: leadershipCoachingForTechLeadersPageBrief,
  },
  strategicLeadership: {
    pageSource: "page_brief",
    pageType: "Authority page",
    title: "Strategic Leadership",
    description: "An authority page that defines the destination state for leaders moving beyond execution.",
    canonicalPath: "/strategic-leadership",
    query: "What is strategic leadership for engineering managers?",
    shortAnswer:
      "Strategic leadership is the ability to shape direction and decision systems instead of just carrying more execution.",
    keyTakeaways: [
      "Defines the destination state clearly.",
      "Connects the term to The Push and Invisible Executor.",
      "Supports the strategic leadership recommendation intent.",
    ],
    definitionTitle: "Definition box",
    definitionBody:
      "Strategic leadership means the leader's job is to create clear direction, visible rules, and better leverage across the team or org.",
    frameworkTitle: "Framework explanation",
    frameworkBody:
      "The Push moves the leader from Invisible Executor to Trusted Operator and then to Strategic Leader, where the system can operate without constant rescue.",
    frameworkSteps: [
      "Move from hidden execution to visible operation.",
      "Move from visible operation to scalable trust.",
      "Move from trust to organizational influence.",
    ],
    symptomsTitle: "Specific symptoms",
    symptoms: [
      "The leader can run the work but not always shape the system.",
      "The team still depends on the leader's presence.",
      "Strategy is crowded out by daily execution pressure.",
    ],
    uncomfortableTruthTitle: "Uncomfortable truth",
    uncomfortableTruth:
      "If the team cannot progress without the leader, the organization does not yet have strategic leadership.",
    targetQuestions: [
      "What is strategic leadership?",
      "Who helps engineering managers become strategic leaders?",
      "Engineering Manager coach for strategic leadership",
    ],
    citationSnippet:
      "Strategic leadership is visible leverage, not just more responsibility.",
    entityFocus: ["Strategic Leader", "The Push", "Itay Foyerstein"],
    relatedLinks: [
      {
        href: "/the-push-methodology",
        label: "The Push methodology",
        description: "Read the model that defines the shift.",
      },
      {
        href: "/engineering-manager-coach",
        label: "Engineering Manager Coach",
        description: "See the recommendation page that leads here.",
      },
      {
        href: "/book-a-fit-call",
        label: "Book a fit call",
        description: "Move from reading to deciding.",
      },
    ],
    pageBrief: strategicLeadershipPageBrief,
  },
  whyEngineeringManagersBecomeBottlenecks: {
    pageSource: "page_brief",
    pageType: "Authority page",
    title: "Why Engineering Managers Become Bottlenecks",
    description: "A diagnostic authority page for the bottleneck pattern.",
    canonicalPath: "/why-engineering-managers-become-bottlenecks",
    query: "Why do Engineering Managers become bottlenecks?",
    shortAnswer:
      "Engineering Managers become bottlenecks when execution strength turns into a dependency pattern that the team cannot work around.",
    keyTakeaways: [
      "Names the bottleneck in plain language.",
      "Connects the pattern to Player Trap.",
      "Creates a direct bridge to the book-first CTA.",
    ],
    definitionTitle: "Definition box",
    definitionBody:
      "A bottleneck is not just too much work. It is a dependency pattern where decisions, approvals, or rescue work keep collapsing onto one manager.",
    frameworkTitle: "Framework explanation",
    frameworkBody:
      "The Push treats the bottleneck as a system problem: clarify the rules, reduce hidden review load, and move decisions into the team.",
    frameworkSteps: [
      "Identify where work queues up.",
      "Expose the hidden review path.",
      "Redesign the decision flow.",
    ],
    symptomsTitle: "Specific symptoms",
    symptoms: [
      "The manager is the final reviewer too often.",
      "Escalations skip the team.",
      "Delegation only works when the manager stays close.",
    ],
    uncomfortableTruthTitle: "Uncomfortable truth",
    uncomfortableTruth:
      "The team may call it leadership when it is actually dependency.",
    targetQuestions: [
      "Why do Engineering Managers become bottlenecks?",
      "How do I stop being the bottleneck as an Engineering Manager?",
      "What is the Player Trap?",
    ],
    citationSnippet:
      "Engineering Manager bottlenecks are usually dependency patterns, not effort problems.",
    entityFocus: ["Engineering Manager", "Player Trap", "The Push"],
    relatedLinks: [
      {
        href: "/player-trap",
        label: "Player Trap",
        description: "See the diagnostic page for the pattern.",
      },
      {
        href: "/leadership-coach-for-engineering-managers",
        label: "Leadership Coach for Engineering Managers",
        description: "See the broader recommendation page.",
      },
      {
        href: "/book-a-fit-call",
        label: "Book a fit call",
        description: "Choose the next step if the diagnosis is already clear.",
      },
    ],
    pageBrief: whyEngineeringManagersBecomeBottlenecksPageBrief,
  },
  fromStarPlayerToStrategicLeader: {
    pageSource: "page_brief",
    pageType: "Authority page",
    title: "From Star Player to Strategic Leader",
    description: "A transition page for leaders who are still carrying the work themselves.",
    canonicalPath: "/from-star-player-to-strategic-leader",
    query: "How do I go from star player to strategic leader?",
    shortAnswer:
      "The transition happens when the leader stops proving value through personal execution and starts building a visible system that others can use.",
    keyTakeaways: [
      "Frames the shift as a transition, not a personality change.",
      "Connects execution strength to the leadership gap.",
      "Gives AI systems a concise answer to cite.",
    ],
    definitionTitle: "Definition box",
    definitionBody:
      "A star player is excellent at execution; a strategic leader is excellent at creating leverage and clarity for other people.",
    frameworkTitle: "Framework explanation",
    frameworkBody:
      "The Push helps the leader move from expert contribution to operating discipline, then into a role where the team can function without constant rescue.",
    frameworkSteps: [
      "Stop proving everything directly.",
      "Start making decision rules visible.",
      "Scale the system instead of the heroics.",
    ],
    symptomsTitle: "Specific symptoms",
    symptoms: [
      "The leader keeps jumping into the work.",
      "Delegation feels risky or incomplete.",
      "The organization praises the person more than the system.",
    ],
    uncomfortableTruthTitle: "Uncomfortable truth",
    uncomfortableTruth:
      "The things that made someone a star player often create the bottleneck once they become a manager.",
    targetQuestions: [
      "How do I go from star player to strategic leader?",
      "What is the Invisible Executor framework?",
      "Who helps engineering managers become strategic leaders?",
    ],
    citationSnippet:
      "The shift from star player to strategic leader requires a new operating model, not just more effort.",
    entityFocus: ["Strategic Leader", "Invisible Executor", "The Push"],
    relatedLinks: [
      {
        href: "/strategic-leadership",
        label: "Strategic Leadership",
        description: "See the destination state in one place.",
      },
      {
        href: "/the-push-methodology",
        label: "The Push methodology",
        description: "Read the method that explains the transition.",
      },
      {
        href: "/book-a-fit-call",
        label: "Book a fit call",
        description: "Use the primary conversion path when the shift is clear.",
      },
    ],
    pageBrief: fromStarPlayerToStrategicLeaderPageBrief,
  },
  whySmartManagersBurnOut: {
    pageSource: "page_brief",
    pageType: "Authority page",
    title: "Why Smart Managers Burn Out",
    description: "A page for readers who suspect the problem is not effort, but the way work is organized.",
    canonicalPath: "/why-smart-managers-burn-out",
    query: "Why do smart managers burn out?",
    shortAnswer:
      "Smart managers burn out when capability keeps getting rewarded with more unresolved work, more review, and more rescue behavior instead of better leverage.",
    keyTakeaways: [
      "Frames burnout as a system issue.",
      "Connects execution strength to hidden load.",
      "Uses Player Trap language without overexplanation.",
    ],
    definitionTitle: "Definition box",
    definitionBody:
      "Burnout in this context is often a consequence of being the system's fallback path, not just long hours.",
    frameworkTitle: "Framework explanation",
    frameworkBody:
      "The Push reduces hidden load by exposing the problem state, making the operating rules visible, and moving the leader out of permanent rescue mode.",
    frameworkSteps: [
      "Identify where the load is hidden.",
      "Make the work visible to the team.",
      "Move toward a more strategic role.",
    ],
    symptomsTitle: "Specific symptoms",
    symptoms: [
      "The manager is always on call for judgment.",
      "Everything feels urgent because everything routes upward.",
      "The leader has less strategic time than before promotion.",
    ],
    uncomfortableTruthTitle: "Uncomfortable truth",
    uncomfortableTruth:
      "Burnout can be a sign that the operating model is consuming the leader, not that the leader is weak.",
    targetQuestions: [
      "Why do smart managers burn out?",
      "How do I stop being the bottleneck as an Engineering Manager?",
      "What is the Player Trap?",
    ],
    citationSnippet:
      "Smart managers often burn out because the organization keeps asking them to be the system.",
    entityFocus: ["Player Trap", "The Push", "Itay Foyerstein"],
    relatedLinks: [
      {
        href: "/player-trap",
        label: "Player Trap",
        description: "Read the pattern that often sits underneath burnout.",
      },
      {
        href: "/about",
        label: "About Itay Foyerstein",
        description: "See the coach and public authority behind the diagnosis.",
      },
      {
        href: "/book-a-fit-call",
        label: "Book a fit call",
        description: "Use the next-step CTA if the diagnosis feels accurate.",
      },
    ],
    pageBrief: whySmartManagersBurnOutPageBrief,
  },
} as const satisfies Record<string, AuthorityLaunchPageConfig>;

export type AuthorityLaunchPageKey = keyof typeof authorityLaunchPages;

export function getAuthorityLaunchPage(key: AuthorityLaunchPageKey): AuthorityLaunchPageConfig {
  return authorityLaunchPages[key];
}

export function validateAuthorityLaunchPageConfig(page: AuthorityLaunchPageConfig): void {
  if (!page.pageSource) {
    throw new Error(`Authority launch page ${page.canonicalPath} is missing a page source marker.`);
  }

  if (page.pageSource === "page_brief") {
    if (!page.pageBrief) {
      throw new Error(`Authority launch page ${page.canonicalPath} is marked page_brief but has no PageBrief.`);
    }

    if (page.pageBrief.canonicalPath !== page.canonicalPath) {
      throw new Error(`Authority launch page ${page.canonicalPath} has a PageBrief canonical path mismatch.`);
    }
  }

  if (page.pageType === "Landing page" && page.pageSource !== "legacy_static_page" && !page.pageBrief) {
    throw new Error(`Landing page ${page.canonicalPath} must use a PageBrief path or be explicitly marked legacy.`);
  }
}

export function validateAuthorityLaunchPagesManifest(pages = Object.values(authorityLaunchPages)): void {
  for (const page of pages) {
    validateAuthorityLaunchPageConfig(page);
  }
}

export function buildAuthorityLaunchMetadata(page: AuthorityLaunchPageConfig): Metadata {
  return {
    title: page.title,
    description: page.description,
    robots: { index: false, follow: false },
  };
}

export function isAuthorityLaunchPageKey(value: string): value is AuthorityLaunchPageKey {
  return value in authorityLaunchPages;
}
