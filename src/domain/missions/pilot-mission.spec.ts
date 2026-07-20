import { 
  missionSpecSchema, 
  MissionSpec,
  MissionSpecId,
  DoDConditionId,
  ConstraintId
} from "./types";

// Pilot Mission Specification: Restore public authority site to trustworthy reader-facing baseline
export const pilotMissionSpec: MissionSpec = {
  id: "pilot-mission-001",
  intent: "Restore the public authority site to a trustworthy reader-facing baseline.",
  definitionOfDone: [
    {
      id: "dod-about-page",
      description: "/about returns 200 in production",
      verifierReference: "http-status-checker",
      required: true,
    },
    {
      id: "dod-about-content", 
      description: "/about contains complete reader-facing content",
      verifierReference: "content-validator",
      required: true,
    },
    {
      id: "dod-methodology-page",
      description: "/the-push-methodology returns 200 in production",
      verifierReference: "http-status-checker",
      required: true,
    },
    {
      id: "dod-methodology-content",
      description: "/the-push-methodology contains complete reader-facing content",
      verifierReference: "content-validator",
      required: true,
    },
    {
      id: "dod-faq-page",
      description: "/faq returns 200 in production",
      verifierReference: "http-status-checker",
      required: true,
    },
    {
      id: "dod-faq-content",
      description: "/faq contains complete reader-facing content",
      verifierReference: "content-validator",
      required: true,
    },
    {
      id: "dod-contact-page",
      description: "/contact returns 200 in production",
      verifierReference: "http-status-checker",
      required: true,
    },
    {
      id: "dod-contact-content",
      description: "/contact contains complete reader-facing content",
      verifierReference: "content-validator",
      required: true,
    },
    {
      id: "dod-h1-present",
      description: "Every page contains an H1",
      verifierReference: "heading-validator",
      required: true,
    },
    {
      id: "dod-cta-present",
      description: "Every page contains a relevant CTA",
      verifierReference: "cta-validator",
      required: true,
    },
    {
      id: "dod-no-internal-language",
      description: "No PageBrief or internal planning language is exposed",
      verifierReference: "internal-language-scanner",
      required: true,
    },
    {
      id: "dod-governed-routes-fail-closed",
      description: "Governed routes remain fail-closed",
      verifierReference: "governed-route-tester",
      required: true,
    },
    {
      id: "dod-robots-noindex",
      description: "Robots remain noindex",
      verifierReference: "robots-checker",
      required: true,
    },
    {
      id: "dod-typescript-passes",
      description: "Typecheck passes",
      verifierReference: "typescript-checker",
      required: true,
    },
    {
      id: "dod-tests-pass",
      description: "Tests pass",
      verifierReference: "test-runner",
      required: true,
    },
    {
      id: "dod-build-passes",
      description: "Build passes",
      verifierReference: "build-checker",
      required: true,
    },
    {
      id: "dod-deploy-commit-match",
      description: "Production deployment commit matches repository commit",
      verifierReference: "commit-verifier",
      required: true,
      // Note: This will be BLOCKED under current execution boundary
    },
    {
      id: "dod-live-verification-passes",
      description: "Live production verification passes",
      verifierReference: "production-verifier",
      required: true,
      // Note: This will be BLOCKED under current execution boundary (no deploy)
    },
  ],
  constraints: [
    {
      id: "constraint-no-prod-migration",
      name: "No Production Database Migration",
      description: "No production DB migration",
      isAbsolute: true,
      isActive: false,
    },
    {
      id: "constraint-no-artifact-approval",
      name: "No Artifact Approval", 
      description: "No artifact approval",
      isAbsolute: true,
      isActive: false,
    },
    {
      id: "constraint-no-publication-record",
      name: "No Publication Record",
      description: "No PublicationRecord creation",
      isAbsolute: true,
      isActive: false,
    },
    {
      id: "constraint-no-governed-publication",
      name: "No Governed Artifact Publication",
      description: "No governed artifact publication",
      isAbsolute: true,
      isActive: false,
    },
    {
      id: "constraint-no-indexing",
      name: "No Indexing",
      description: "No indexing enablement",
      isAbsolute: true,
      isActive: false,
    },
    {
      id: "constraint-no-invented-claims",
      name: "No Invented Claims or Taxonomy",
      description: "No invented claims or taxonomy",
      isAbsolute: true,
      isActive: false,
    },
    {
      id: "constraint-no-human-approval-bypass",
      name: "No Human Approval Bypass",
      description: "No human approval bypass",
      isAbsolute: true,
      isActive: false,
    },
  ],
};

// Helper to derive typed IDs
export const getRequiredDoDConditionIds = (spec: MissionSpec): DoDConditionId[] => 
  spec.definitionOfDone
    .filter(condition => condition.required)
    .map(condition => condition.id);

export const getOptionalDoDConditionIds = (spec: MissionSpec): DoDConditionId[] => 
  spec.definitionOfDone
    .filter(condition => !condition.required)
    .map(condition => condition.id);

export const getAbsoluteConstraintIds = (spec: MissionSpec): ConstraintId[] => 
  spec.constraints
    .filter(constraint => constraint.isAbsolute)
    .map(constraint => constraint.id);

export const getAdvisoryConstraintIds = (spec: MissionSpec): ConstraintId[] => 
  spec.constraints
    .filter(constraint => !constraint.isAbsolute)
    .map(constraint => constraint.id);

// Create runtime wrapper
export const pilotMissionSpecRuntime = {
  id: pilotMissionSpec.id,
  spec: pilotMissionSpec,
  // Derived properties
  requiredDoDConditions: getRequiredDoDConditionIds(pilotMissionSpec),
  optionalDoDConditionIds: getOptionalDoDConditionIds(pilotMissionSpec),
  absoluteConstraintIds: getAbsoluteConstraintIds(pilotMissionSpec),
  advisoryConstraintIds: getAdvisoryConstraintIds(pilotMissionSpec),
};
