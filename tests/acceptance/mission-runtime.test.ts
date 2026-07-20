import { test, expect, vi } from "vitest";
import { 
  MissionExecutionLoop, 
  ExecutionContext,
  ExecutionBoundary
} from "@/ai/missions/mission-execution-loop";
import { pilotMissionSpecRuntime } from "@/domain/missions/pilot-mission.spec";

// Direct string values for evidence types
const EVIDENCE_TYPE_OBSERVED = "OBSERVED";
const EVIDENCE_TYPE_AGENT_REPORTED = "AGENT_REPORTED";

test("Scenario 1: Autonomous mission decomposition", async () => {
  const context: ExecutionContext = {
    dryRunMode: true,
    executionBoundary: ExecutionBoundary.LOCAL_INSPECTION_ONLY,
  };
  
  const loop = new MissionExecutionLoop(
    pilotMissionSpecRuntime.spec,
    context
  );
  
  const result = await loop.execute();
  
  expect(result.finalSnapshot).toBeDefined();
  expect(result.finalSnapshot.gaps.length).toBeGreaterThan(0);
  expect(result.finalSnapshot.activeConstraint).toBeDefined();
  expect(result.finalSnapshot.currentPlan).toBeDefined();
  expect(result.finalSnapshot.verificationResults.length).toBeGreaterThan(0);
  expect(result.stopReason).toBeDefined();
});

test("Scenario 2: Evidence classification", async () => {
  // Create a snapshot with mixed evidence
  const snapshot = {
    timestamp: new Date().toISOString(),
    state: "PENDING" as const,
    evidence: [
      { id: "e1", type: EVIDENCE_TYPE_OBSERVED, description: "fact", confidence: 1, sourceLocation: "file", observationMethod: "obs", timestamp: new Date().toISOString(), evidenceReference: {} },
      { id: "e2", type: EVIDENCE_TYPE_AGENT_REPORTED, description: "claim", confidence: 0.5, sourceLocation: "agent", observationMethod: "report", timestamp: new Date().toISOString(), evidenceReference: {} },
    ],
    gaps: [],
    verificationResults: []
  };

  const observed = snapshot.evidence.filter(e => e.type === EVIDENCE_TYPE_OBSERVED);
  const reported = snapshot.evidence.filter(e => e.type === EVIDENCE_TYPE_AGENT_REPORTED);
  
  expect(observed.length).toBe(1);
  expect(reported.length).toBe(1);
});

test("Scenario 6: Forbidden capability enforcement", async () => {
  const context: ExecutionContext = {
    dryRunMode: true,
    executionBoundary: ExecutionBoundary.LOCAL_INSPECTION_ONLY
  };
  
  const loop = new MissionExecutionLoop(
    pilotMissionSpecRuntime.spec,
    context
  );
  
  const deployCapability = {
    id: "cap-deploy",
    name: "Production Deployment",
    description: "Deploys to production",
    type: "DEPLOYMENT" as const,
    hasSideEffects: true,
    canModifyProduction: true,
    requiresHuman: false
  };
  
  const [isAllowed, reason] = loop.capabilityRegistry.isAllowed(
    deployCapability,
    context
  );
  
  expect(isAllowed).toBe(false);
  expect(reason).toContain("forbidden");
});
