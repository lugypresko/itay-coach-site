import type {
  DiagnosticAnswers,
  DiagnosticHypothesisPrimary,
  DiagnosticResult,
} from "./types";

function text(value?: string): string {
  return value?.trim().replace(/\s+/g, " ") ?? "";
}

function insufficientEvidence(): DiagnosticResult {
  return {
    observedPattern: "There is not enough evidence yet to name a reliable pattern.",
    hypothesis: {
      primary: "insufficient_evidence",
      confidence: "low",
      explanation: "Add one concrete incident, its frequency, and what changed when it happened.",
    },
    evidenceAgainst: ["The current answers do not establish a repeated cause or ownership pattern."],
    experiment: {
      action: "Capture one recent incident with the decision, participants, and outcome.",
      observation: "Note whether the same situation repeats and what evidence supports the explanation.",
      duration: "before the next result review",
    },
    nextStep: "more_evidence",
  };
}

function primaryFor(answers: DiagnosticAnswers, selfExplanation: string): DiagnosticHypothesisPrimary {
  if (answers.caseType === "meeting") return "role_design";
  if (answers.caseType === "escalation") return "risk";
  if (answers.caseType === "review") return "capability";
  if (/authority|approval|approve|final decision|judgment/i.test(selfExplanation)) return "authority";
  if (answers.caseType === "decision") return "dependency_habit";
  return "context";
}

export function buildDeterministicDiagnosticResult(answers: DiagnosticAnswers): DiagnosticResult {
  const caseEvent = text(answers.caseEvent);
  const selfExplanation = text(answers.selfExplanation);
  const absenceOutcome = text(answers.absenceOutcome);

  if (!caseEvent || !answers.frequency || (!selfExplanation && !absenceOutcome && !text(answers.context))) {
    return insufficientEvidence();
  }

  const primary = primaryFor(answers, selfExplanation);
  const confidence = answers.frequency === "constantly" || answers.frequency === "often" ? "high" : "medium";
  const patterns: Record<DiagnosticHypothesisPrimary, string> = {
    authority: "Important decisions appear to return to one authority holder.",
    context: "The situation appears to depend on context that is not yet consistently shared.",
    capability: "The situation may reflect a capability or decision-quality gap.",
    risk: "The situation may be shaped by risk or escalation conditions.",
    role_design: "The situation appears to be shaped by unclear ownership or handoffs.",
    dependency_habit: "The team may have developed a repeated habit of sending decisions upward.",
    insufficient_evidence: "There is not enough evidence yet to name a reliable pattern.",
  };
  const nextSteps: Record<DiagnosticHypothesisPrimary, DiagnosticResult["nextStep"]> = {
    authority: "coaching",
    context: "coaching",
    capability: "hiring_training",
    risk: "organizational_change",
    role_design: "organizational_change",
    dependency_habit: "coaching",
    insufficient_evidence: "more_evidence",
  };

  return {
    observedPattern: patterns[primary],
    hypothesis: {
      primary,
      confidence,
      explanation: selfExplanation || absenceOutcome,
    },
    evidenceAgainst: [
      "The situation may have a legitimate case-specific cause rather than a recurring operating pattern.",
    ],
    experiment: {
      action: "Name the owner, the relevant constraints, and the condition for escalation before the next occurrence.",
      observation: "Watch whether the next instance is resolved at the intended level without the same handoff repeating.",
      duration: answers.frequency === "constantly" || answers.frequency === "often" ? "one week" : "two weeks",
    },
    nextStep: nextSteps[primary],
  };
}
