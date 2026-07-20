import { z } from "zod";

// Base identifiers
export const MissionId = z.string().uuid();
export const MissionSpecId = z.string();
export const DoDConditionId = z.string();
export const EvidenceId = z.string();
export const ConstraintId = z.string();
export const CapabilityId = z.string();
export const PlanStepId = z.string();

// ISO timestamp
export const ISODate = z.string().datetime();

// Constraints are referenced by the mission specification, so define them first.
export const constraintSchema = z.object({
  id: ConstraintId,
  name: z.string().min(1),
  description: z.string().min(1),
  isAbsolute: z.boolean().default(true),
  isActive: z.boolean().optional().default(false),
  selectionReason: z.string().optional(),
});

// Mission Specification
export const missionSpecSchema = z.object({
  id: MissionSpecId,
  intent: z.string().min(1),
  definitionOfDone: z.array(z.object({
    id: DoDConditionId,
    description: z.string().min(1),
    // Verification method reference - could be a verifier ID or built-in check
    verifierReference: z.string().min(1),
    // Whether this condition is required for completion
    required: z.boolean().default(true),
  })).min(1),
  constraints: z.array(constraintSchema).min(1),
});

// Mission Runtime State
export const missionStateSchema = z.enum([
  "PENDING",        // Initial state
  "RUNNING",        // Executing plan steps
  "BLOCKED",        // Blocked by constraint or missing capability
  "COMPLETED",      // All required DoD conditions met
  "FAILED",         // Execution failed
]);

// Evidence Types
export const evidenceTypeSchema = z.enum([
  "OBSERVED",       // Directly observed fact
  "AGENT_REPORTED", // Reported by agent (requires corroboration)
  "ASSUMPTION",     // Assumed true
  "UNAVAILABLE",    // Evidence cannot be obtained
]);

// Evidence type values for runtime use
export const EvidenceType = {
  OBSERVED: "OBSERVED" as const,
  AGENT_REPORTED: "AGENT_REPORTED" as const,
  ASSUMPTION: "ASSUMPTION" as const,
  UNAVAILABLE: "UNAVAILABLE" as const,
};

export const evidenceSchema = z.object({
  id: EvidenceId,
  type: evidenceTypeSchema,
  description: z.string().min(1),
  sourceLocation: z.string().min(1), // File path, function name, etc.
  observationMethod: z.string().min(1), // How this was observed/obtained
  timestamp: ISODate,
  confidence: z.number().min(0).max(1), // 0-1 confidence score
  // Reference to actual evidence (could be file, log, metric, etc.)
  evidenceReference: z.unknown(),
  // For DoD-specific evidence
  conditionId: z.string().optional(),
  sourceType: z.string().optional(), // e.g., "FILE_INSPECTION", "CODE_INSPECTION", "HTTP_REQUEST"
});

// Gap Analysis
export const gapSeveritySchema = z.enum([
  "BLOCKING",   // Prevents completion
  "WARNING",    // Advisory only
  "INFO",       // Informational
]);

export const gapSchema = z.object({
  id: z.string(),
  conditionId: DoDConditionId,
  description: z.string().min(1),
  severity: gapSeveritySchema,
  // What evidence is missing or insufficient
  requiredEvidence: z.array(z.object({
    type: evidenceTypeSchema,
    description: z.string().min(1),
  })),
  actualEvidence: z.array(z.lazy(() => evidenceSchema)), // Circular reference
  // Gap size: 0.0 (no gap) to 1.0 (complete gap)
  size: z.number().min(0).max(1).default(0),
});

// Capabilities (with side-effect metadata)
export const capabilityTypeSchema = z.enum([
  "READ_ONLY_INSPECTION",      // Safe observation only
  "LOCAL_CODE_MODIFICATION",   // Local file changes
  "LOCAL_VALIDATION",          // Local validation (tests, build, typecheck)
  "DEPLOYMENT",                // Deploy to environments
  "MIGRATION",                 // Database/schema migrations
  "APPROVAL",                  // Human approval processes
  "PUBLICATION",               // Make content publicly available
  "INDEXING",                  // Enable search indexing
]);

// Capability type values for runtime use
export const CapabilityType = {
  READ_ONLY_INSPECTION: "READ_ONLY_INSPECTION" as const,
  LOCAL_CODE_MODIFICATION: "LOCAL_CODE_MODIFICATION" as const,
  LOCAL_VALIDATION: "LOCAL_VALIDATION" as const,
  DEPLOYMENT: "DEPLOYMENT" as const,
  MIGRATION: "MIGRATION" as const,
  APPROVAL: "APPROVAL" as const,
  PUBLICATION: "PUBLICATION" as const,
  INDEXING: "INDEXING" as const,
};

export const capabilitySchema = z.object({
  id: CapabilityId,
  name: z.string().min(1),
  description: z.string().min(1),
  type: capabilityTypeSchema,
  // Whether this capability has side effects that persist beyond the session
  hasSideEffects: z.boolean(),
  // Whether this capability can modify production state
  canModifyProduction: z.boolean(),
  // Whether this capability requires human intervention
});

// Plan Steps
export const planStepSchema = z.object({
  id: PlanStepId,
  description: z.string().min(1),
  // Which capability is required to execute this step
  requiredCapabilityId: CapabilityId,
  // Estimated effort (in abstract units)
  estimatedEffort: z.number().int().positive().optional(),
  // Dependencies on other steps
  dependencies: z.array(PlanStepId).default([]),
  // Status of this step
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED", "BLOCKED"]),
});

// Verification Results
export const verificationResultSchema = z.enum([
  "PASS",           // Verification succeeded
  "FAIL",           // Verification failed
  "BLOCKED",        // Cannot verify due to blocking issue
  "NOT_OBSERVED",   // Evidence not available/observable
  "NOT_APPLICABLE", // Does not apply in current context
]);

export const verificationOutputSchema = z.object({
  dodConditionId: DoDConditionId,
  result: verificationResultSchema,
  evidence: z.array(z.lazy(() => evidenceSchema)).optional(), // Circular reference
  // Additional context/output from verification
  details: z.unknown().optional(),
});

// Formal stop reasons
export const formalStopReasonSchema = z.enum([
  "COMPLETED",                    // All required DoD conditions satisfied
  "BLOCKED_HUMAN_APPROVAL",       // Waiting for human approval
  "BLOCKED_MISSING_CAPABILITY",   // Required capability not available
  "BLOCKED_MISSING_EVIDENCE",     // Critical evidence cannot be obtained
  "FAILED_CONSTRAINT_CONFLICT",   // Violated an absolute constraint
  "FAILED_VERIFICATION",          // Verification failed and cannot proceed
  "TIMED_OUT",                    // Exceeded time limit
]);

// Complete Mission Snapshot
export const missionSnapshotSchema = z.object({
  // Point-in-time snapshot
  timestamp: ISODate,
  // Current mission state
  state: missionStateSchema,
  // Collected evidence so far
  evidence: z.array(z.lazy(() => evidenceSchema)),
  // Identified gaps
  gaps: z.array(z.lazy(() => gapSchema)),
  // Currently active constraint
  activeConstraint: z.optional(z.lazy(() => constraintSchema)),
  // Current execution plan
  currentPlan: z.array(z.object({
    id: PlanStepId,
    description: z.string().min(1),
    requiredCapabilityId: CapabilityId,
    estimatedEffort: z.number().int().positive().optional(),
    dependencies: z.array(PlanStepId).default([]),
    status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED", "BLOCKED"]),
  })).default([]),
  // Verification results from last check
  verificationResults: z.array(z.lazy(() => verificationOutputSchema)).default([]),
});

// Complete Mission Specification (runtime wrapper)
export const missionSpecRuntimeSchema = z.object({
  id: MissionSpecId,
  spec: z.lazy(() => z.object({
    id: MissionSpecId,
    intent: z.string().min(1),
    definitionOfDone: z.array(z.object({
      id: DoDConditionId,
      description: z.string().min(1),
      verifierReference: z.string().min(1),
      required: z.boolean().default(true),
    })).min(1),
    constraints: z.array(z.object({
      id: ConstraintId,
      name: z.string().min(1),
      description: z.string().min(1),
      isAbsolute: z.boolean().default(true),
    })).min(1),
  })),
  // Derived/computed properties
  requiredDoDConditions: z.array(DoDConditionId),
  optionalDoDConditions: z.array(DoDConditionId),
  absoluteConstraints: z.array(ConstraintId),
  advisoryConstraints: z.array(ConstraintId),
});

// Type exports
export type MissionId = z.infer<typeof MissionId>;
export type MissionSpecId = z.infer<typeof MissionSpecId>;
export type DoDConditionId = z.infer<typeof DoDConditionId>;
export type EvidenceId = z.infer<typeof EvidenceId>;
export type ConstraintId = z.infer<typeof ConstraintId>;
export type CapabilityId = z.infer<typeof CapabilityId>;
export type PlanStepId = z.infer<typeof PlanStepId>;
export type ISODate = z.infer<typeof ISODate>;

export type MissionSpec = z.infer<typeof missionSpecSchema>;
export type MissionSpecRuntime = z.infer<typeof missionSpecRuntimeSchema>;
export type MissionState = z.infer<typeof missionStateSchema>;
export type Evidence = z.infer<typeof evidenceSchema>;
export type EvidenceType = z.infer<typeof evidenceTypeSchema>;
export type Gap = z.infer<typeof gapSchema>;
export type GapSeverity = z.infer<typeof gapSeveritySchema>;
export type Constraint = z.infer<typeof constraintSchema>;
export type Capability = z.infer<typeof capabilitySchema>;
export type PlanStep = z.infer<typeof planStepSchema>;
export type VerificationResult = z.infer<typeof verificationResultSchema>;
export type VerificationOutput = z.infer<typeof verificationOutputSchema>;
export type FormalStopReason = z.infer<typeof formalStopReasonSchema>;
export type MissionSnapshot = z.infer<typeof missionSnapshotSchema>;
export const GapSeverity = {
  BLOCKING: "BLOCKING" as const,
  WARNING: "WARNING" as const,
  INFO: "INFO" as const,
};

export const ConstraintSelectionReason = {
  NO_ACTIVE_CONSTRAINTS: "No active constraints",
  ONLY_RELEVANT_CONSTRAINT: "Only relevant constraint",
  HIGHEST_PRIORITY_AVAILABLE: "Highest priority available constraint",
  BLOCKING_ISSUE_DETECTED: "Blocking issue detected",
} as const;

export interface ConstraintSelectorOutput {
  constraint: Constraint;
  selected: Constraint;
  reason: string;
  selectionTimestamp: string;
}

export interface ActiveConstraintResult {
  constraint: Constraint;
  isActive: boolean;
}
export const EvidenceTypeValues = {
  OBSERVED: "OBSERVED",
  AGENT_REPORTED: "AGENT_REPORTED",
  ASSUMPTION: "ASSUMPTION",
  UNAVAILABLE: "UNAVAILABLE",
} as const;

export const CapabilityTypeValues = {
  READ_ONLY_INSPECTION: "READ_ONLY_INSPECTION",
  LOCAL_CODE_MODIFICATION: "LOCAL_CODE_MODIFICATION",
  LOCAL_VALIDATION: "LOCAL_VALIDATION",
  DEPLOYMENT: "DEPLOYMENT",
  MIGRATION: "MIGRATION",
  APPROVAL: "APPROVAL",
  PUBLICATION: "PUBLICATION",
  INDEXING: "INDEXING",
} as const;

export type CapabilityType = typeof CapabilityTypeValues[keyof typeof CapabilityTypeValues];
