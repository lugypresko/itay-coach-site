import { test, expect } from "vitest";
import { 
  MissionExecutionLoop, 
  ExecutionContext,
  ExecutionBoundary
} from "@/ai/missions/mission-execution-loop";
import { pilotMissionSpecRuntime } from "@/domain/missions/pilot-mission.spec";
import type { Capability } from "@/domain/missions/types";

test("Mission execution loop creates and initializes correctly", () => {
  const context: ExecutionContext = {
    dryRunMode: true,
    executionBoundary: ExecutionBoundary.LOCAL_INSPECTION_ONLY
  };
  
  const loop = new MissionExecutionLoop(
    pilotMissionSpecRuntime.spec,
    context
  );
  
  expect(loop).toBeDefined();
  expect(loop.missionSpec.id).toBe("pilot-mission-001");
  expect(loop.missionSpec.intent).toBe("Restore the public authority site to a trustworthy reader-facing baseline.");
  expect(loop.context.dryRunMode).toBe(true);
});

test("Mission execution loop handles execution boundaries", () => {
  const localContext: ExecutionContext = {
    dryRunMode: true,
    executionBoundary: ExecutionBoundary.LOCAL_INSPECTION_ONLY
  };
  
  const loop = new MissionExecutionLoop(
    pilotMissionSpecRuntime.spec,
    localContext
  );
  
  // Test that deployment capability is not allowed in local inspection mode
  const deployCapability = {
    id: "test-deploy",
    name: "Test Deployment",
    description: "Test deployment capability",
    type: "DEPLOYMENT" as const,
    hasSideEffects: true,
    canModifyProduction: true,
    requiresHuman: false
  };
  
  const [isAllowed, reason] = loop.capabilityRegistry.isAllowed(
    deployCapability as Capability,
    localContext
  );
  
  expect(isAllowed).toBe(false);
  expect(reason).toContain("forbidden in dry-run mode");
});

test("Mission execution loop creates initial snapshot", () => {
  const context: ExecutionContext = {
    dryRunMode: true,
    executionBoundary: ExecutionBoundary.LOCAL_INSPECTION_ONLY
  };
  
  const loop = new MissionExecutionLoop(
    pilotMissionSpecRuntime.spec,
    context
  );
  
  // Access the private method through a narrow test-only view.
  const snapshot = (loop as unknown as {
    createInitialSnapshot: () => { state: string; timestamp: unknown };
  }).createInitialSnapshot();
  
  expect(snapshot).toBeDefined();
  expect(snapshot.state).toBe("PENDING");
  expect(snapshot.timestamp).toBeDefined();
});
