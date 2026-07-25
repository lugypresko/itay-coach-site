export type VocabularyStatus = "approved" | "proposed" | "archived";

export interface VocabularyItem {
  id: string;
  status: VocabularyStatus;
  label?: string;
}

export interface EntityVocabularyItem extends VocabularyItem {
  type: "expert" | "methodology" | "framework" | "audience" | "concept";
}

export interface ContentDecisionVocabulary {
  entities: EntityVocabularyItem[];
  problems: VocabularyItem[];
  symptoms: VocabularyItem[];
  frameworks: VocabularyItem[];
  offers: VocabularyItem[];
  ctas: CtaVocabularyItem[];
  claims: VocabularyItem[];
  evidence: VocabularyItem[];
  sourceInsights: VocabularyItem[];
}

export interface CtaVocabularyItem extends VocabularyItem {
  href: string;
  compatibleJourneyStages: Array<"awareness" | "consideration" | "decision" | "coach_intent">;
}

export const contentDecisionVocabulary: ContentDecisionVocabulary = {
  entities: [
    { id: "itay-foyerstein", type: "expert", status: "approved" },
    { id: "the-push", type: "methodology", status: "approved" },
    { id: "invisible-executor-framework", type: "framework", status: "approved" },
    { id: "engineering-manager", type: "audience", status: "approved" },
    { id: "tech-lead", type: "audience", status: "approved" },
    { id: "r-and-d-manager", type: "audience", status: "approved" },
    { id: "vp-engineering", type: "audience", status: "approved" },
    { id: "strategic-leader", type: "concept", status: "approved" },
    { id: "trusted-operator", type: "concept", status: "approved" },
  ],
  problems: [{ id: "execution-bottleneck", status: "approved" }],
  symptoms: [
    { id: "approval-dependency", status: "approved" },
    { id: "strategic-time-collapse", status: "approved" },
  ],
  frameworks: [{ id: "invisible-executor-framework", status: "approved" }],
  offers: [{ id: "the-push-coaching", status: "approved" }],
  ctas: [{ id: "book-fit-call", label: "Book a fit call", href: "/book-a-fit-call", compatibleJourneyStages: ["consideration", "decision", "coach_intent"], status: "approved" }],
  claims: [{ id: "claim-leaders-become-default-route", status: "approved" }],
  evidence: [{ id: "evidence-approved-insight-player-trap", status: "approved" }],
  sourceInsights: [
    { id: "approved-insight-player-trap-01", status: "approved" },
    { id: "approved-insight-player-trap-02", status: "approved" },
    { id: "approved-insight-player-trap-03", status: "approved" },
    { id: "approved-insight-player-trap-04", status: "approved" },
    { id: "approved-insight-player-trap-05", status: "approved" },
    { id: "approved-insight-player-trap-06", status: "approved" },
    { id: "approved-insight-player-trap-07", status: "approved" },
  ],
};
