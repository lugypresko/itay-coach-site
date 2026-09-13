export type AssessmentAudience = "individual" | "sponsor";

export const assessmentJourneyEvents = [
  "assessment_start",
  "diagnostic_micro_insight",
  "diagnostic_contact_earned",
  "request_to_talk",
  "assessment_complete",
] as const;

export type DiagnosticState =
  | "ROLE"
  | "PAIN_RAW"
  | "PATTERN_HYPOTHESES"
  | "PAIN_CONFIRMED"
  | "WHY_NOW"
  | "MICRO_INSIGHT"
  | "CONTACT_EARNED"
  | "DIAGNOSIS"
  | "INTENT"
  | "ROUTE";

export type DiagnosticRoute = "TALK_NOW" | "NURTURE" | "NO_FIT" | "INSUFFICIENT_EVIDENCE";

export type DiagnosticSignals = {
  fit: boolean;
  pain: boolean;
  now: boolean;
  intent: "talk_now" | "later" | "none";
};

export type DiagnosticAnswers = DiagnosticSignals;

export function deriveDiagnosticSignals(input: Partial<DiagnosticAnswers> = {}): DiagnosticSignals {
  return {
    fit: input.fit === true,
    pain: input.pain === true,
    now: input.now === true,
    intent: input.intent === "talk_now" || input.intent === "later" ? input.intent : "none",
  };
}

const stateTransitions: Record<DiagnosticState, DiagnosticState | null> = {
  ROLE: "PAIN_RAW",
  PAIN_RAW: "PATTERN_HYPOTHESES",
  PATTERN_HYPOTHESES: "PAIN_CONFIRMED",
  PAIN_CONFIRMED: "WHY_NOW",
  WHY_NOW: "MICRO_INSIGHT",
  MICRO_INSIGHT: "CONTACT_EARNED",
  CONTACT_EARNED: "DIAGNOSIS",
  DIAGNOSIS: "INTENT",
  INTENT: "ROUTE",
  ROUTE: null,
};

/** Advance one state only after the evidence required by that state is present. */
export function advanceDiagnosticState(state: DiagnosticState, evidence: Record<string, unknown>): DiagnosticState {
  if (state === "MICRO_INSIGHT" && evidence.accepted !== true) return state;
  if (state === "CONTACT_EARNED" && evidence.consented !== true) return state;
  if (state === "PAIN_CONFIRMED" && evidence.confirmed !== true) return state;
  if (state === "WHY_NOW" && evidence.trigger !== true) return state;
  return stateTransitions[state] ?? state;
}

/** Route using independent DQL dimensions; contact capture alone never qualifies a lead. */
export function routeDiagnostic(signals: DiagnosticSignals): DiagnosticRoute {
  if (!signals.fit || !signals.pain) return "NO_FIT";
  if (signals.intent === "talk_now" && signals.now) return "TALK_NOW";
  if (signals.intent === "later" || !signals.now) return "NURTURE";
  return "INSUFFICIENT_EVIDENCE";
}

export function getAssessmentNextStep(audience: AssessmentAudience) {
  return audience === "sponsor"
    ? {
        label: "Discuss the findings",
        href: "/for-organizations?source=assessment",
      }
    : {
        label: "Request to talk with Itay",
        href: "/contact?source=diagnostic&intent=request_to_talk",
      };
}
