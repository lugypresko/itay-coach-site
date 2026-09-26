/**
 * Storage-agnostic contracts for the diagnostic funnel.
 *
 * These types describe the product session only. Persistence adapters, API
 * routes, and provider-specific records must depend on this contract rather
 * than the other way around.
 */

export type DiagnosticLifecycleStatus =
  | "started"
  | "in_progress"
  | "completed"
  | "result_viewed"
  | "email_captured"
  | "fit_call_started"
  | "fit_call_submitted";

export type DiagnosticCaseType =
  | "decision"
  | "review"
  | "escalation"
  | "meeting"
  | "other";

export type DiagnosticFrequency = "rarely" | "sometimes" | "often" | "constantly";

export type DiagnosticAnswers = {
  caseType?: DiagnosticCaseType;
  caseEvent?: string;
  selfExplanation?: string;
  absenceOutcome?: string;
  frequency?: DiagnosticFrequency;
  /** Optional one-line context supplied by the visitor. */
  context?: string;
};

export type DiagnosticSourceMetadata = {
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  entryPoint?: string;
};

export type DiagnosticHypothesisPrimary =
  | "authority"
  | "context"
  | "capability"
  | "risk"
  | "role_design"
  | "dependency_habit"
  | "insufficient_evidence";

export type DiagnosticHypothesisConfidence = "low" | "medium" | "high";

export type DiagnosticNextStep =
  | "self_serve"
  | "coaching"
  | "organizational_change"
  | "hiring_training"
  | "more_evidence";

export type DiagnosticResult = {
  observedPattern: string;
  hypothesis: {
    primary: DiagnosticHypothesisPrimary;
    confidence: DiagnosticHypothesisConfidence;
    explanation: string;
  };
  evidenceAgainst: string[];
  experiment: {
    action: string;
    observation: string;
    duration?: string;
  };
  nextStep: DiagnosticNextStep;
};

export type DiagnosticLeadMetadata = {
  email?: string;
  firstName?: string;
  marketingConsent?: boolean;
};

export type DiagnosticFitMetadata = {
  role?: string;
  companySize?: string;
  scope?: string;
  urgency?: string;
  whyNow?: string;
};

export type DiagnosticSessionTimestamps = {
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  resultViewedAt?: string;
  emailCapturedAt?: string;
  fitCallStartedAt?: string;
  fitCallSubmittedAt?: string;
};

export type DiagnosticSession = {
  id: string;
  source: DiagnosticSourceMetadata;
  status: DiagnosticLifecycleStatus;
  answers: DiagnosticAnswers;
  result?: DiagnosticResult;
  lead?: DiagnosticLeadMetadata;
  fit?: DiagnosticFitMetadata;
  timestamps: DiagnosticSessionTimestamps;
};
