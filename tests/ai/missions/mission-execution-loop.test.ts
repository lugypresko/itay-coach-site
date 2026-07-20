import { test, expect } from "vitest";
import { 
  MissionExecutionLoop, 
  ExecutionContext,
  ExecutionBoundary
} from "@/ai/missions/mission-execution-loop";
import { pilotMissionSpecRuntime } from "@/domain/missions/pilot-mission.spec";

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
    deployCapability as any,
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
  
  // Access private method for testing - in real code we'd test through public interface
  // @ts-ignore
  const snapshot = (loop as any).createInitialSnapshot();
  
  expect(snapshot).toBeDefined();
  expect(snapshot.state).toBe("PENDING");
  expect(snapshot.timestamp).toBeDefined();
});
