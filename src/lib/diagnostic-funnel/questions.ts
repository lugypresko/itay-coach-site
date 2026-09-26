import type { DiagnosticCaseType } from "./types";

export type DiagnosticQuestionId = "Q1" | "Q2" | "Q3" | "Q4" | "Q5";

export type DiagnosticQuestionOption = {
  value: string;
  label: string;
};

export type DiagnosticOptionalContext = {
  id: "context";
  copy: string;
  optional: true;
  maxLength: 240;
};

export type DiagnosticQuestion = {
  id: DiagnosticQuestionId;
  order: 1 | 2 | 3 | 4 | 5;
  copy: string;
  options: readonly DiagnosticQuestionOption[];
  optionalContext?: DiagnosticOptionalContext;
};

export const DIAGNOSTIC_QUESTION_IDS = ["Q1", "Q2", "Q3", "Q4", "Q5"] as const;

const caseTypeOptions: readonly DiagnosticQuestionOption[] = [
  { value: "decision", label: "A decision or prioritization call" },
  { value: "review", label: "A review or approval request" },
  { value: "escalation", label: "An escalation or issue that came back to me" },
  { value: "meeting", label: "A meeting or alignment situation" },
  { value: "other", label: "Something else" },
];

const q2OptionsByCaseType: Record<DiagnosticCaseType, readonly DiagnosticQuestionOption[]> = {
  decision: [
    { value: "final_call", label: "The team asked me to make the final call" },
    { value: "priority_tradeoff", label: "People needed me to resolve a priority trade-off" },
    { value: "decision_returned", label: "A decision returned to me after it had been delegated" },
  ],
  review: [
    { value: "approval_waiting", label: "Work was waiting for my review or approval" },
    { value: "quality_check", label: "I was pulled in to check the quality or direction" },
    { value: "review_returned", label: "The same review came back for another round" },
  ],
  escalation: [
    { value: "problem_raised", label: "A problem was escalated to me" },
    { value: "ownership_unclear", label: "Ownership became unclear when things got difficult" },
    { value: "risk_escalated", label: "A risk or conflict needed my intervention" },
  ],
  meeting: [
    { value: "alignment_needed", label: "A meeting was needed to create alignment" },
    { value: "discussion_stalled", label: "The discussion stalled without my direction" },
    { value: "follow_up_needed", label: "The meeting created follow-up work for me" },
  ],
  other: [
    { value: "repeated_dependency", label: "People repeatedly depended on my input" },
    { value: "ownership_gap", label: "The next owner or action was unclear" },
    { value: "other_pattern", label: "Something else kept recurring" },
  ],
};

const sharedQuestions = {
  q3: {
    id: "Q3" as const,
    order: 3 as const,
    copy: "What do you think is making this situation repeat?",
    options: [
      { value: "authority", label: "The team is not sure who has authority" },
      { value: "context", label: "The team is missing context or judgment" },
      { value: "capability", label: "The capability or confidence is not ready yet" },
      { value: "risk", label: "The risk or organizational constraint is real" },
      { value: "unclear", label: "I am not sure yet" },
    ] as const,
  },
  q4: {
    id: "Q4" as const,
    order: 4 as const,
    copy: "What happens when you are not involved?",
    options: [
      { value: "delay", label: "The work waits or slows down" },
      { value: "rework", label: "The work moves, then comes back for rework" },
      { value: "risk", label: "The risk of a bad outcome increases" },
      { value: "independent", label: "The team handles it without me" },
      { value: "unclear", label: "I am not sure yet" },
    ] as const,
  },
  q5: {
    id: "Q5" as const,
    order: 5 as const,
    copy: "How often does this pattern happen?",
    options: [
      { value: "rarely", label: "Rarely" },
      { value: "sometimes", label: "Sometimes" },
      { value: "often", label: "Often" },
      { value: "constantly", label: "Constantly" },
    ] as const,
  },
};

export function getDiagnosticQuestions(caseType: DiagnosticCaseType = "other"): readonly DiagnosticQuestion[] {
  const selectedCaseType = caseType in q2OptionsByCaseType ? caseType : "other";

  return [
    {
      id: "Q1",
      order: 1,
      copy: "What kind of situation are you trying to understand?",
      options: caseTypeOptions,
    },
    {
      id: "Q2",
      order: 2,
      copy: "Which part of that situation best describes what happened?",
      options: q2OptionsByCaseType[selectedCaseType],
    },
    sharedQuestions.q3,
    sharedQuestions.q4,
    {
      ...sharedQuestions.q5,
      optionalContext: {
        id: "context",
        copy: "Optional: add one line of context that would help us understand this situation.",
        optional: true,
        maxLength: 240,
      },
    },
  ];
}
