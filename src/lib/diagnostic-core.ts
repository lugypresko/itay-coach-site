import type { DiagnosticRoute, DiagnosticSignals, DiagnosticState } from "./assessment-journey";

export type EvidenceStatus = "UNKNOWN" | "SIGNAL" | "USER_CONFIRMED" | "VALIDATED";
export type MeddpiccDimension =
  | "metrics" | "economicBuyer" | "decisionCriteria" | "decisionProcess"
  | "paperProcess" | "identifiedPain" | "champion" | "competition";

export type EvidenceField = {
  status: EvidenceStatus;
  value: unknown;
  sourceTurnIds: string[];
  confidence: number | null;
  notes?: string;
};

export type MeddpiccEvidence = Record<MeddpiccDimension, EvidenceField>;

export type DiagnosticTurn = {
  id: string;
  state: DiagnosticState;
  rawAnswer: string;
  answer: string;
};

export type DiagnosticSession = {
  id: string;
  state: DiagnosticState;
  turns: DiagnosticTurn[];
  evidence: MeddpiccEvidence;
  signals: DiagnosticSignals;
};

export type DiagnosticAnswerInput = {
  turnId: string;
  state: DiagnosticState;
  answer: string;
  confirmation?: boolean;
  signal?: Partial<DiagnosticSignals>;
};

export type DiagnosticAnswerResult = {
  session: DiagnosticSession;
  reflection: string;
  nextQuestion: string | null;
};

const dimensions: MeddpiccDimension[] = [
  "metrics", "economicBuyer", "decisionCriteria", "decisionProcess", "paperProcess",
  "identifiedPain", "champion", "competition",
];

function unknownEvidence(): MeddpiccEvidence {
  return Object.fromEntries(dimensions.map((dimension) => [dimension, {
    status: "UNKNOWN", value: null, sourceTurnIds: [], confidence: null,
  }])) as unknown as MeddpiccEvidence;
}

function normalizedAnswer(answer: string) {
  return answer.trim().replace(/\s+/g, " ");
}

function fieldWithTurn(field: EvidenceField, turnId: string, value: unknown, status: EvidenceStatus): EvidenceField {
  return { ...field, status, value, sourceTurnIds: [...new Set([...field.sourceTurnIds, turnId])], confidence: status === "USER_CONFIRMED" ? 1 : 0.6 };
}

export function createDiagnosticSession(id: string): DiagnosticSession {
  return { id, state: "ROLE", turns: [], evidence: unknownEvidence(), signals: { fit: false, pain: false, now: false, intent: "none" } };
}

function questionFor(state: DiagnosticState): string | null {
  const questions: Partial<Record<DiagnosticState, string>> = {
    ROLE: "What is your role, and what kind of team or organization are you leading?",
    PAIN_RAW: "What happened in the latest situation that keeps coming back to you?",
    PATTERN_HYPOTHESES: "Does that sound like the team depends on your judgment or approval to move?",
    PAIN_CONFIRMED: "What changes for the team or business when this keeps happening?",
    WHY_NOW: "Why does this situation matter now?",
    MICRO_INSIGHT: "Does this hypothesis fit what you are seeing?",
    INTENT: "What would be most useful next: talk through it now, revisit it later, or keep working without a conversation?",
  };
  return questions[state] ?? null;
}

/** Generate a bounded reflection from the visitor's words; no LLM or free-form inference is required. */
export function buildReflection(answer: string, state: DiagnosticState): string {
  const text = normalizedAnswer(answer);
  if (!text) return "There is not enough detail yet to form a useful hypothesis.";
  if (state === "PAIN_RAW") return `You are describing a situation where ${text} That gives us a concrete incident to examine. We will look at the decisions and judgment route behind it.`;
  if (state === "PATTERN_HYPOTHESES") return `Your response helps test the hypothesis against what you actually see: ${text}`;
  if (state === "WHY_NOW") return `The timing matters here: ${text}`;
  return `I heard: ${text}`;
}

export function recordDiagnosticAnswer(session: DiagnosticSession, input: DiagnosticAnswerInput): DiagnosticAnswerResult {
  const answer = normalizedAnswer(input.answer);
  const turn: DiagnosticTurn = { id: input.turnId, state: input.state, rawAnswer: input.answer, answer };
  const turns = session.turns.some((existing) => existing.id === turn.id)
    ? session.turns.map((existing) => existing.id === turn.id ? turn : existing)
    : [...session.turns, turn];
  const evidence = { ...session.evidence };
  const signals = { ...session.signals, ...input.signal };
  if (input.state === "ROLE") {
    evidence.champion = fieldWithTurn(evidence.champion, turn.id, answer, "SIGNAL");
    signals.fit = input.signal?.fit === true || /engineer|technical|cto|vp|manager|lead/i.test(answer);
  }
  if (input.state === "PAIN_RAW") {
    evidence.identifiedPain = fieldWithTurn(evidence.identifiedPain, turn.id, answer, "SIGNAL");
    signals.pain = true;
  }
  if (input.state === "PATTERN_HYPOTHESES" && input.confirmation === true) {
    evidence.identifiedPain = fieldWithTurn(evidence.identifiedPain, turn.id, evidence.identifiedPain.value, "USER_CONFIRMED");
    signals.pain = true;
  }
  if (input.state === "WHY_NOW") {
    evidence.metrics = fieldWithTurn(evidence.metrics, turn.id, answer, "SIGNAL");
    signals.now = input.signal?.now === true || answer.length > 0;
  }
  if (input.state === "INTENT" && input.signal?.intent) signals.intent = input.signal.intent;
  const nextState = input.state === "PATTERN_HYPOTHESES" && input.confirmation !== true
    ? "PATTERN_HYPOTHESES"
    : input.state === "MICRO_INSIGHT" && input.confirmation !== true
      ? "MICRO_INSIGHT"
      : input.state === "CONTACT_OFFERED" && input.confirmation !== true
        ? "CONTACT_OFFERED"
        : ({ ROLE: "PAIN_RAW", PAIN_RAW: "PATTERN_HYPOTHESES", PATTERN_HYPOTHESES: "PAIN_CONFIRMED", PAIN_CONFIRMED: "WHY_NOW", WHY_NOW: "MICRO_INSIGHT", MICRO_INSIGHT: "CONTACT_OFFERED", CONTACT_OFFERED: "CONTACT_SUBMITTED", CONTACT_SUBMITTED: "DIAGNOSIS", CONTACT_SKIPPED: "DIAGNOSIS", DIAGNOSIS: "INTENT", INTENT: "ROUTE", ROUTE: "ROUTE" } as Record<DiagnosticState, DiagnosticState>)[input.state];
  const nextSession = { ...session, turns, evidence, signals, state: nextState };
  return { session: nextSession, reflection: buildReflection(answer, input.state), nextQuestion: questionFor(nextState) };
}

export function buildMicroInsight(session: DiagnosticSession): { text: string; hypothesis: string; evidenceTurnIds: string[] } {
  const pain = session.evidence.identifiedPain;
  const text = pain.value
    ? "When decisions repeatedly return to one leader, the constraint may be the route of judgment rather than individual effort."
    : "A useful hypothesis needs one concrete incident before it can be tested.";
  return { text, hypothesis: "The current operating route may be concentrating judgment at the leader.", evidenceTurnIds: pain.sourceTurnIds };
}

export function buildDiagnosis(session: DiagnosticSession) {
  const insight = buildMicroInsight(session);
  return {
    observedPattern: insight.hypothesis,
    likelyCause: "authority or decision context may still be concentrated upward",
    evidenceFor: insight.evidenceTurnIds,
    evidenceAgainst: [] as string[],
    reversibleExperiment: "For one week, define one decision category the team can own and review the boundary once, asynchronously.",
    whatToWatchNext: "Notice whether the same decision returns with a clearer question or with a request for approval.",
    whenCoachingIsNotTheAnswer: "If the constraint is a formal authority, safety, or staffing limit, change the operating conditions first.",
  };
}

export function routeDiagnosticWithReasons(signals: DiagnosticSignals): { route: DiagnosticRoute; reasons: string[] } {
  if (!signals.fit || !signals.pain) return { route: "NO_FIT", reasons: ["fit_or_pain_not_confirmed"] };
  if (signals.intent === "talk_now" && signals.now) return { route: "TALK_NOW", reasons: ["fit_confirmed", "pain_confirmed", "why_now_present", "talk_requested"] };
  if (signals.intent === "later" || !signals.now) return { route: "NURTURE", reasons: ["fit_and_pain_present", "conversation_not_requested_now"] };
  return { route: "INSUFFICIENT_EVIDENCE", reasons: ["intent_or_timing_missing"] };
}
