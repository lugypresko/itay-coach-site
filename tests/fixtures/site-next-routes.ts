import type { Action, Route } from "../../src/lib/push-conversation";

export type SiteNextRouteFixture = {
  name: string;
  actions: Action[];
  expectedRoute: Route;
  expectedReasons: string[];
  expectedTitle: string;
  expectedFinalAction: "request" | null;
};

const action = (step: Action["expected"], answer: string, n: number, category?: string): Action => ({
  expected: step,
  operation: `fixture-${String(n).padStart(2, "0")}-operation`,
  answer,
  ...(category ? { category } : {}),
});

const common = (role: string, pain: string, category: string, why: string, intent: string): Action[] => [
  action("incident", "A release decision returned to me after the team waited.", 1),
  action("reflection", "confirm", 2, category),
  action("role", role, 3),
  action("pain", pain, 4),
  action("impact", "The team delayed delivery while the decision came back to me.", 5),
  action("why", why, 6),
  action("fork", "B", 7),
  action("insight", "continue", 8),
  action("contact", "skip", 9),
  action("diagnosis", "continue", 10),
  action("intent", intent, 11),
];

export const siteNextRouteFixtures: SiteNextRouteFixture[] = [
  {
    name: "talk-now",
    actions: common("manager", "yes", "decision_escalation", "growth", "talk_now"),
    expectedRoute: "TALK_NOW",
    expectedReasons: ["relevant_role", "pain_confirmed", "talk_requested"],
    expectedTitle: "A conversation could be useful.",
    expectedFinalAction: "request",
  },
  {
    name: "nurture",
    actions: common("manager", "yes", "ownership", "later", "later"),
    expectedRoute: "NURTURE",
    expectedReasons: ["not_ready_for_conversation"],
    expectedTitle: "Keep this for when the timing is right.",
    expectedFinalAction: null,
  },
  {
    name: "no-fit",
    actions: common("other", "yes", "capacity", "growth", "talk_now"),
    expectedRoute: "NO_FIT",
    expectedReasons: ["role_or_need_not_matched"],
    expectedTitle: "A coaching conversation may not be the right next step.",
    expectedFinalAction: null,
  },
  {
    name: "insufficient-evidence",
    actions: common("manager", "unclear", "unclear", "growth", "talk_now"),
    expectedRoute: "INSUFFICIENT_EVIDENCE",
    expectedReasons: ["pattern_or_need_unresolved"],
    expectedTitle: "Continue with the experiment.",
    expectedFinalAction: null,
  },
];

