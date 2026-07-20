import { 
  MissionSnapshot, 
  Evidence, 
  EvidenceType,
  Gap, 
  GapSeverity,
  Constraint,
  Capability,
  PlanStep,
  VerificationResult,
  VerificationOutput
} from "./types";
import { pilotMissionSpecRuntime } from "./pilot-mission.spec";

/**
 * Create an evidence-based mission snapshot for pilot mission
 * This represents our starting point based on observed facts from the repository
 */
export const createInitialMissionSnapshot = (): MissionSnapshot => {
  const now = new Date().toISOString();
  
  // Gather observed facts from our repository inspection
  const observedEvidence: Evidence[] = [
    // Evidence about page configuration
    {
      id: "ev-about-page-config",
      type: EvidenceType.OBSERVED,
      description: "/about page configured with pageSource: legacy_static_page",
      confidence: 0.95,
      timestamp: now,
      sourceLocation: "src/lib/authority-launch-pages.ts",
      observationMethod: "FILE_INSPECTION",
      evidenceReference: { pageSource: "legacy_static_page", pagePath: "/about" },
      conditionId: "dod-about-page"
    },
    {
      id: "ev-contact-page-config",
      type: EvidenceType.OBSERVED,
      description: "/contact page configured with pageSource: legacy_static_page",
      confidence: 0.95,
      timestamp: now,
      sourceLocation: "src/lib/authority-launch-pages.ts",
      observationMethod: "FILE_INSPECTION",
      evidenceReference: { pageSource: "legacy_static_page", pagePath: "/contact" },
      conditionId: "dod-contact-page"
    },
    {
      id: "ev-faq-page-config",
      type: EvidenceType.OBSERVED,
      description: "/faq page configured with pageSource: legacy_static_page",
      confidence: 0.95,
      timestamp: now,
      sourceLocation: "src/lib/authority-launch-pages.ts",
      observationMethod: "FILE_INSPECTION",
      evidenceReference: { pageSource: "legacy_static_page", pagePath: "/faq" },
      conditionId: "dod-faq-page"
    },
    {
      id: "ev-methodology-page-config",
      type: EvidenceType.OBSERVED,
      description: "/the-push-methodology page configured with pageSource: legacy_static_page",
      confidence: 0.95,
      timestamp: now,
      sourceLocation: "src/lib/authority-launch-pages.ts",
      observationMethod: "FILE_INSPECTION",
      evidenceReference: { pageSource: "legacy_static_page", pagePath: "/the-push-methodology" },
      conditionId: "dod-methodology-page"
    },
    
    // Evidence about page component implementation
    {
      id: "ev-authority-launch-page-component",
      type: EvidenceType.OBSERVED,
      description: "AuthorityLaunchPage component renders content from config and performs validation",
      confidence: 0.9,
      timestamp: now,
      sourceLocation: "src/components/authority-launch-page.tsx",
      observationMethod: "CODE_INSPECTION",
      evidenceReference: {
        component: "AuthorityLaunchPage",
        validation: "Performs content completeness and internal language checks",
        renders: ["title", "description", "definitionBody", "frameworkBody", "relatedLinks"]
      },
      conditionId: "dod-about-content"
    },
    
    // Evidence about static routing
    {
      id: "ev-static-routes-exist",
      type: EvidenceType.OBSERVED,
      description: "Static route files exist for /about, /contact, /faq, /the-push-methodology",
      confidence: 1.0,
      timestamp: now,
      sourceLocation: "src/app/(site)/",
      observationMethod: "FILE_SYSTEM_INSPECTION",
      evidenceReference: {
        routes: [
          "src/app/(site)/about/page.tsx",
          "src/app/(site)/contact/page.tsx", 
          "src/app/(site)/faq/page.tsx",
          "src/app/(site)/the-push-methodology/page.tsx"
        ],
        allUseAuthorityLaunchPage: true
      },
      conditionId: "dod-about-page" // represents all static pages
    },
    
    // Evidence about testing framework
    {
      id: "ev-test-framework-exists",
      type: EvidenceType.OBSERVED,
      description: "Vitest testing framework configured in package.json",
      confidence: 1.0,
      timestamp: now,
      sourceLocation: "package.json",
      observationMethod: "FILE_INSPECTION",
      evidenceReference: {
        testRunner: "vitest",
        testCommand: "vitest run",
        testFilesLocation: "tests/unit/",
        testFileCount: "40+ unit tests observed"
      },
      conditionId: "dod-tests-pass"
    },
    
    // Evidence about TypeScript setup
    {
      id: "ev-typescript-setup",
      type: EvidenceType.OBSERVED,
      description: "TypeScript configured with tsconfig.json",
      confidence: 1.0,
      timestamp: now,
      sourceLocation: "tsconfig.json",
      observationMethod: "FILE_INSPECTION",
      evidenceReference: {
        hasTsconfig: true,
        extends: "@tsconfig/recommended",
        includes: ["src/**/*"]
      },
      conditionId: "dod-typescript-passes"
    },
    
    // Evidence about build system
    {
      id: "ev-build-system-nextjs",
      type: EvidenceType.OBSERVED,
      description: "Next.js build system configured with Payload CMS",
      confidence: 0.95,
      timestamp: now,
      sourceLocation: "next.config.mjs",
      observationMethod: "FILE_INSPECTION",
      evidenceReference: {
        usesNextJS: true,
        usesPayload: true,
        webpackConfig: "Custom alias for @payload-config"
      },
      conditionId: "dod-build-passes"
    },
    
    // Evidence about no notFound() calls in AuthorityLaunchPage
    {
      id: "ev-no-notfound-in-authority-page",
      type: EvidenceType.OBSERVED,
      description: "AuthorityLaunchPage component contains no notFound() calls",
      confidence: 0.9,
      timestamp: now,
      sourceLocation: "src/components/authority-launch-page.tsx",
      observationMethod: "CODE_INSPECTION",
      evidenceReference: {
        hasNotFoundCalls: false,
        throwsErrorsInstead: true,
        errorTypes: ["BUILD_FAILURE"],
        validationChecks: [
          "internal language leakage detection",
          "about page completeness",
          "methodology page completeness", 
          "faq page completeness"
        ]
      },
      conditionId: "dod-no-internal-language"
    },
    
    // Evidence about page structure
    {
      id: "ev-page-h1-structure",
      type: EvidenceType.OBSERVED,
      description: "AuthorityLayoutPage component renders h1 with page.title",
      confidence: 0.95,
      timestamp: now,
      sourceLocation: "src/components/authority-launch-page.tsx",
      observationMethod: "CODE_INSPECTION",
      evidenceReference: "<h1>{page.title}</h1>",
      conditionId: "dod-h1-present"
    },
    
    // Evidence about CTA presence in page structure
    {
      id: "ev-page-cta-structure",
      type: EvidenceType.OBSERVED,
      description: "AuthorityLayoutPage component renders navigation with related links as CTAs",
      confidence: 0.85,
      timestamp: now,
      sourceLocation: "src/components/authority-launch-page.tsx",
      observationMethod: "CODE_INSPECTION",
      evidenceReference: "<nav className=\"content-panel content-panel-wide\">...</nav>",
      conditionId: "dod-cta-present"
    }
  ];
  
  // Identify gaps based on missing evidence
  const gaps: Gap[] = [];
  
  // Gap: Cannot observe actual HTTP status without deployment
  gaps.push({
    id: "gap-http-status-observation",
    conditionId: "dod-about-page",
    description: "Cannot observe actual HTTP 200 status without making network requests or deploying",
    severity: GapSeverity.BLOCKING,
    requiredEvidence: [{ type: EvidenceType.OBSERVED, description: "Actual HTTP 200 response from /about" }],
    actualEvidence: [],
    size: 1.0 // Complete gap - no evidence possible in current boundary
  });
  
  gaps.push({
    id: "gap-content-verification",
    conditionId: "dod-about-content",
    description: "Cannot verify actual content rendering without accessing live page",
    severity: GapSeverity.BLOCKING,
    requiredEvidence: [{ type: EvidenceType.OBSERVED, description: "Actual rendered content contains expected text" }],
    actualEvidence: [],
    size: 1.0
  });
  
  // Gap: Cannot verify H1 without DOM access
  gaps.push({
    id: "gap-h1-verification",
    conditionId: "dod-h1-present",
    description: "Cannot verify actual H1 element in rendered DOM without browser access",
    severity: GapSeverity.BLOCKING,
    requiredEvidence: [{ type: EvidenceType.OBSERVED, description: "Actual DOM contains h1 element with expected text" }],
    actualEvidence: [],
    size: 1.0
  });
  
  // Gap: Cannot verify CTA without DOM access
  gaps.push({
    id: "gap-cta-verification",
    conditionId: "dod-cta-present",
    description: "Cannot verify actual CTA elements in rendered DOM without browser access",
    severity: GapSeverity.BLOCKING,
    requiredEvidence: [{ type: EvidenceType.OBSERVED, description: "Actual DOM contains clickable CTA elements" }],
    actualEvidence: [],
    size: 1.0
  });
  
  // Create initial state
  const initialState: "PENDING" | "IN_PROGRESS" | "BLOCKED" | "READY_FOR_HUMAN_EXECUTION" | "COMPLETED" | "FAILED" = 
    "BLOCKED"; // Start as blocked due to missing verifiable evidence
  
  // Determine initial active constraint
  const activeConstraint = {
    id: "constraint-no-prod-migration",
    name: "No Production Database Migration", 
    description: "Prevents deployment which is needed for live verification",
    isAbsolute: true,
    isActive: true // This is the currently active blocking constraint
  };
  
  // Initial plan - steps we would take if not constrained
  const initialPlan: PlanStep[] = [
    {
      id: "step-gather-evidence",
      description: "Gather initial evidence about system state",
      requiredCapabilityId: "cap-evidence-gathering",
      status: "COMPLETED" as const, // We've done this
      dependencies: []
    },
    {
      id: "step-verify-pages-configured",
      description: "Verify core pages are configured to use legacy_static_page",
      requiredCapabilityId: "cap-file-inspection",
      status: "COMPLETED" as const, // We've done this
      dependencies: ["step-gather-evidence"]
    },
    {
      id: "step-run-local-validation",
      description: "Run typecheck, tests, and build locally",
      requiredCapabilityId: "cap-run-validation-suite",
      status: "PENDING" as const,
      dependencies: ["step-verify-pages-configured"]
    },
    {
      id: "step-deploy-to-test",
      description: "Deploy to test environment for verification",
      requiredCapabilityId: "cap-deploy-to-staging",
      status: "BLOCKED" as const,
      dependencies: ["step-run-local-validation"],
      // This step is blocked by our execution boundary
    },
    {
      id: "step-verify-live-content",
      description: "Verify actual content and HTTP status in deployed environment",
      requiredCapabilityId: "cap-http-check",
      status: "BLOCKED" as const,
      dependencies: ["step-deploy-to-test"],
      // This step is blocked by deployment requirement
    }
  ];
  
  return {
    timestamp: now,
    state: initialState,
    evidence: [...observedEvidence],
    gaps,
    activeConstraint,
    currentPlan: initialPlan,
    verificationResults: []
  };
};
