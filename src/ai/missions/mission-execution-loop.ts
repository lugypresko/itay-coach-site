import { 
  MissionSpec, 
  MissionSnapshot,
  MissionState,
  FormalStopReason,
  PlanStep,
  Capability,
  VerificationOutput,
  Constraint,
  DoDConditionId,
  ConstraintSelectorOutput
} from "@/domain/missions/types";
import { GapAnalyzer } from "@/domain/missions/gap-analyzer";
import { ConstraintSelector } from "@/domain/missions/constraint-selector";
import { CapabilityRegistry } from "@/ai/capabilities/capability-registry";
import { VerifierRegistry } from "@/ai/verifiers/verifier-registry";

/**
 * Execution context for the mission
 */
export interface ExecutionContext {
  /** Whether we're in dry-run mode (no actual side effects) */
  dryRunMode: boolean;
  /** Current execution boundary constraints */
  executionBoundary: ExecutionBoundary;
}

/**
 * Execution boundaries define what capabilities are allowed
 */
export enum ExecutionBoundary {
  /** Only local inspection and read-only operations */
  LOCAL_INSPECTION_ONLY = "LOCAL_INSPECTION_ONLY",
  /** Local code changes and validation allowed */
  LOCAL_DEVELOPMENT = "LOCAL_DEVELOPMENT", 
  /** Full execution including deployment, etc. */
  FULL_EXECUTION = "FULL_EXECUTION"
}

/**
 * Mock verification result for demonstration
 */
const createMockVerificationResult = (dodConditionId: string, result: "PASS" | "FAIL" | "BLOCKED" | "NOT_OBSERVED" | "NOT_APPLICABLE"): VerificationOutput => ({
  dodConditionId,
  result,
  evidence: [],
  details: { reason: "Mock verification for demonstration" }
});

/**
 * Main mission execution loop
 * Implements the observe-orient-decide-act (OODA) loop for missions
 */
export class MissionExecutionLoop {
  constructor(
    public missionSpec: MissionSpec,
    public context: ExecutionContext,
    public gapAnalyzer: GapAnalyzer = new GapAnalyzer(),
    public constraintSelector: ConstraintSelector = new ConstraintSelector(),
    public capabilityRegistry: CapabilityRegistry = new CapabilityRegistry(),
    public verifierRegistry: VerifierRegistry = new VerifierRegistry()
  ) {}
  
  /**
   * Execute the mission until completion or stopping condition
   */
  public async execute(): Promise<{
    finalState: MissionState;
    finalSnapshot: MissionSnapshot;
    stopReason: FormalStopReason;
    iterations: number;
  }> {
    let snapshot: MissionSnapshot = this.createInitialSnapshot();
    let iteration = 0;
    const maxIterations = 100; // Prevent infinite loops
    
    console.log("=== MISSION EXECUTION STARTED ===");
    console.log("Dry run mode:", this.context.dryRunMode);
    console.log("Execution boundary:", this.context.executionBoundary);
    console.log("Mission spec ID:", this.missionSpec.id);
    console.log("Definition of Done conditions:", 
      this.missionSpec.definitionOfDone?.map(d => d.id) || []);
    console.log("Constraints:", 
      this.missionSpec.constraints?.map(c => c.id) || []);
    
    while (iteration < maxIterations) {
      iteration++;
      console.log(`\n--- Iteration ${iteration} ---`);
      
      // 1. OBSERVE: Create/update snapshot with current state
      snapshot = await this.updateSnapshot(snapshot);
      
      console.log("Snapshot evidence count:", snapshot.evidence.length);
      console.log("Snapshot gaps count:", snapshot.gaps.length);
      console.log("Snapshot verification results count:", snapshot.verificationResults.length);
      console.log("Snapshot active constraint:", snapshot.activeConstraint?.id);
      
      // 2. ORIENT: Analyze situation and identify gaps/constraints
      const gaps = this.gapAnalyzer.analyze(this.missionSpec, snapshot);
      console.log("Gaps identified:", gaps.length);
      gaps.forEach((gap, i) => {
        console.log(`  Gap ${i}: ${gap.conditionId} - ${gap.description} (severity: ${gap.severity})`);
      });
      
      const activeConstraintResult = this.constraintSelector.select(
        this.missionSpec.constraints || [],
        snapshot
      );
      console.log("Active constraint result:", JSON.stringify(activeConstraintResult, null, 2));
      
      const activeConstraint = activeConstraintResult.selected;
      console.log("Active constraint ID:", activeConstraint?.id);
      
      // Update snapshot with gaps and constraint before decision
      snapshot = {
        ...snapshot,
        gaps: gaps,
        activeConstraint: activeConstraintResult.selected
      };
      
      // 3. DECIDE: Determine what to do next
      const decision = await this.makeDecision(snapshot, gaps, activeConstraintResult);
      
      console.log("Decision:", decision.shouldStop ? "STOP" : "CONTINUE");
      if (decision.action) {
        console.log("  Action type:", decision.action.type);
      }
      
      // 4. ACT: Execute the decided action
      await this.act(decision);
      
      console.log("After act - evidence:", snapshot.evidence.length, "gaps:", snapshot.gaps.length, "verification results:", snapshot.verificationResults.length);
      
      // Check if we should stop
      if (decision.shouldStop) {
        console.log("=== MISSION STOPPED ===");
        console.log("Reason:", decision.stopReason);
        return {
          finalState: snapshot.state,
          finalSnapshot: snapshot,
          stopReason: decision.stopReason ?? "FAILED_VERIFICATION",
          iterations: iteration
        };
      }
    }
    
    // Timeout
    console.log("=== MISSION TIMED OUT ===");
    return {
      finalState: snapshot.state,
      finalSnapshot: snapshot,
      stopReason: "TIMED_OUT" as const,
      iterations: iteration
    };
  }
  
  /**
   * Create initial snapshot from available evidence
   */
  private createInitialSnapshot(): MissionSnapshot {
    // In a real implementation, this would gather initial evidence
    // For now, return empty snapshot with mock verification results
    return {
      timestamp: new Date().toISOString(),
      state: "PENDING" as const,
      evidence: [],
      gaps: [],
      activeConstraint: undefined,
      currentPlan: [],
      verificationResults: this.missionSpec.definitionOfDone
        ?.map(dod => createMockVerificationResult(dod.id, "NOT_OBSERVED"))
        .filter((v): v is VerificationOutput => v !== undefined) || []
    };
  }
  
  /**
   * Update the snapshot with latest observations
   */
  private async updateSnapshot(
    currentSnapshot: MissionSnapshot
  ): Promise<MissionSnapshot> {
    // In a real implementation, this would:
    // 1. Run observation capabilities to gather new evidence
    // 2. Update the snapshot with new information
    
    // For this implementation, we'll simulate by returning the current snapshot
    return {
      ...currentSnapshot,
      timestamp: new Date().toISOString()
    };
  }
  
  /**
   * Make a decision about what action to take next
   */
  private async makeDecision(
    snapshot: MissionSnapshot,
    gaps: ReturnType<typeof this.gapAnalyzer.analyze>,
    activeConstraint: ReturnType<typeof this.constraintSelector.select>
  ): Promise<{
    shouldStop: boolean;
    stopReason?: FormalStopReason;
    action?: {
      type: "EXECUTE_PLAN" | "GATHER_EVIDENCE" | "RESOLVE_CONFLICT";
      planStep?: PlanStep;
      capabilityId?: string;
    };
  }> {
    // Check if we've completed all required DoD conditions
    const verificationPassed = this.areRequiredConditionsMet(snapshot);
    
    if (verificationPassed) {
      return {
        shouldStop: true,
        stopReason: "COMPLETED" as const
      };
    }
    
    // Check for blocking constraints first (in LOCAL_INSPECTION_ONLY mode, 
    
    // Check if we need to gather more evidence before constraint checks
    if (this.needsMoreEvidence(snapshot, gaps)) {
      return {
        shouldStop: false,
        action: {
          type: "GATHER_EVIDENCE",
          capabilityId: "cap-http-check"
        }
      };
    }
    
    // any active constraint should stop execution to respect the execution boundary)
    if (this.context.executionBoundary === ExecutionBoundary.LOCAL_INSPECTION_ONLY &&
         activeConstraint.constraint.isActive === true) {
      return {
        shouldStop: true,
        stopReason: "BLOCKED_MISSING_CAPABILITY" as const
      };
    }
    
    // Check if we're blocked by an absolute constraint in other modes
    if (this.context.executionBoundary !== ExecutionBoundary.LOCAL_INSPECTION_ONLY &&
        this.isBlockedByAbsoluteConstraint(activeConstraint)) {
      return {
        shouldStop: true,
        stopReason: "FAILED_CONSTRAINT_CONFLICT" as const
      };
    }
    
    // Check if we need to gather more evidence
    if (this.needsMoreEvidence(snapshot, gaps)) {
      return {
        shouldStop: false,
        action: {
          type: "GATHER_EVIDENCE",
          // In reality, we'd pick the best evidence-gathering capability
          capabilityId: "cap-http-check" // placeholder
        }
      };
    }
    
    // Check if we can execute the next plan step
    const nextStep = this.getNextExecutableStep(snapshot);
    if (nextStep) {
      // Check if we have the required capability
      const capability = this.capabilityRegistry.get(nextStep.requiredCapabilityId);
      if (capability) {
        // Check if this capability is allowed under current constraints
        const [isAllowed, denialReason] = this.capabilityRegistry.isAllowed(
          capability,
          {
            dryRunMode: this.context.dryRunMode,
            executionBoundary: this.context.executionBoundary
          }
        );
        
        if (isAllowed) {
          return {
            shouldStop: false,
            action: {
              type: "EXECUTE_PLAN",
              planStep: nextStep,
              capabilityId: capability.id
            }
          };
        } else {
          // Capability is forbidden - we're blocked
          return {
            shouldStop: true,
            stopReason: "BLOCKED_MISSING_CAPABILITY" as const
          };
        }
      }
    }
    
    // Default: gather more information
    return {
      shouldStop: false,
      action: {
        type: "GATHER_EVIDENCE",
        capabilityId: "cap-http-check"
      }
    };
  }
  
  // Helper methods
  
  private areRequiredConditionsMet(snapshot: MissionSnapshot): boolean {
    // In a real implementation, this would check verification results
    // For now, return false to keep the loop going in demo
    return false;
  }
  
  private isBlockingConstraint(
    activeConstraint: ReturnType<typeof this.constraintSelector.select>
  ): boolean {
    // In LOCAL_INSPECTION_ONLY mode, any active constraint is blocking
    return activeConstraint.constraint.isActive === true;
  }
  
  private isBlockedByAbsoluteConstraint(
    activeConstraint: ReturnType<typeof this.constraintSelector.select>
  ): boolean {
    return activeConstraint.constraint.isActive === true;
  }
  
  private needsMoreEvidence(
    snapshot: MissionSnapshot,
    gaps: ReturnType<typeof this.gapAnalyzer.analyze>
  ): boolean {
    // We need more evidence if we have significant gaps
    return gaps.length > 0;
  }
  
  private getNextExecutableStep(
    snapshot: MissionSnapshot
  ): PlanStep | undefined {
    // In a real implementation, this would:
    // 1. Look at the current plan
    // 2. Find the first PENDING step whose dependencies are met
    // 3. Return it
    
    // For now, return undefined to trigger evidence gathering
    return undefined;
  }
  
  /**
   * Execute the decided action
   */
  private async act(decision: {
    shouldStop: boolean;
    stopReason?: FormalStopReason;
    action?: {
      type: "EXECUTE_PLAN" | "GATHER_EVIDENCE" | "RESOLVE_CONFLICT";
      planStep?: PlanStep;
      capabilityId?: string;
    };
  }): Promise<void> {
    if (decision.shouldStop) {
      // No action needed - we're stopping
      return;
    }
    
    if (!decision.action) {
      // No action to take
      return;
    }
    
    switch (decision.action.type) {
      case "EXECUTE_PLAN": {
        // Execute the plan step using the required capability
        const capability = this.capabilityRegistry.get(
          decision.action.capabilityId!
        );
        
        if (!capability) {
          throw new Error(`Capability ${decision.action.capabilityId} not found`);
        }
        
        // In a real implementation, we would:
        // 1. Mark the plan step as IN_PROGRESS
        // 2. Execute the capability
        // 3. Collect evidence from the execution
        // 4. Update the plan step status
        // 5. Update the snapshot with new evidence
        
        // For this implementation, we'll simulate by doing nothing
        // The actual evidence gathering would happen in the next updateSnapshot call
        break;
      }
      
      case "GATHER_EVIDENCE": {
        // Use the capability to gather evidence
        const capability = this.capabilityRegistry.get(
          decision.action.capabilityId!
        );
        
        if (!capability) {
          throw new Error(`Capability ${decision.action.capabilityId} not found`);
        }
        
        // In reality, we would execute the capability here
        // For simulation, we'll just note that we attempted it
        break;
      }
      
      case "RESOLVE_CONFLICT": {
        // Handle constraint conflicts or other issues
        break;
      }
    }
  }
}

/**
 * Simple factory for creating mission execution loop instances
 */
export const createMissionExecutionLoop = (
  missionSpec: MissionSpec,
  context: ExecutionContext
) => new MissionExecutionLoop(missionSpec, context);
