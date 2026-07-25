import type { ContentDecision } from "../ai/content-decision/contracts";

export interface ContentDecisionPageMapping {
  canonicalPath: string;
  pageType: "entity" | "methodology" | "framework" | "pillar" | "problem" | "faq" | "conversion";
  decisionId?: string;
  note?: string;
}

function decision(id: string, canonicalPath: string, primaryAudienceEntityId = "engineering-manager"): ContentDecision {
  return {
    id,
    decisionVersion: 1,
    primaryAudienceEntityId,
    primaryProblemId: "execution-bottleneck",
    symptomIds: ["approval-dependency", "strategic-time-collapse"],
    primaryFrameworkEntityId: "invisible-executor-framework",
    primaryOfferId: "the-push-coaching",
    primaryCtaId: "book-fit-call",
    journeyStage: "coach_intent",
    claimIds: ["claim-leaders-become-default-route"],
    evidenceIds: ["evidence-approved-insight-player-trap"],
    canonicalPath,
    sourceInsightIds: ["approved-insight-player-trap-05"],
    status: "active",
    lastValidatedAt: null,
    validationStatus: "unvalidated",
  };
}

export const contentDecisionPageMappings: ContentDecisionPageMapping[] = [
  { canonicalPath: "/about", pageType: "entity", decisionId: "decision-about" },
  { canonicalPath: "/the-push-methodology", pageType: "methodology", decisionId: "decision-the-push" },
  { canonicalPath: "/faq", pageType: "faq", decisionId: "decision-faq" },
  { canonicalPath: "/engineering-manager-coach", pageType: "conversion", decisionId: "decision-engineering-manager-coach" },
  { canonicalPath: "/leadership-coach-for-engineering-managers", pageType: "conversion", decisionId: "decision-leadership-coach-em" },
  { canonicalPath: "/leadership-coaching-for-tech-leaders", pageType: "pillar", decisionId: "decision-tech-leaders" },
  { canonicalPath: "/strategic-leadership", pageType: "framework", decisionId: "decision-strategic-leadership" },
  { canonicalPath: "/why-engineering-managers-become-bottlenecks", pageType: "problem", decisionId: "decision-em-bottleneck" },
  { canonicalPath: "/from-star-player-to-strategic-leader", pageType: "problem", decisionId: "decision-star-player" },
  { canonicalPath: "/why-smart-managers-burn-out", pageType: "problem", decisionId: "decision-manager-burnout" },
  { canonicalPath: "/cto-coach", pageType: "conversion", note: "No explicit ContentDecision vocabulary for this surface yet." },
  { canonicalPath: "/contact", pageType: "conversion", note: "Contact is a routing surface, not yet assigned a canonical decision." },
];

export const contentDecisionPageDecisions: ContentDecision[] = [
  decision("decision-about", "/about"),
  decision("decision-the-push", "/the-push-methodology"),
  decision("decision-faq", "/faq"),
  decision("decision-engineering-manager-coach", "/engineering-manager-coach"),
  decision("decision-leadership-coach-em", "/leadership-coach-for-engineering-managers"),
  decision("decision-tech-leaders", "/leadership-coaching-for-tech-leaders"),
  decision("decision-strategic-leadership", "/strategic-leadership"),
  decision("decision-em-bottleneck", "/why-engineering-managers-become-bottlenecks"),
  decision("decision-star-player", "/from-star-player-to-strategic-leader"),
  decision("decision-manager-burnout", "/why-smart-managers-burn-out"),
];
