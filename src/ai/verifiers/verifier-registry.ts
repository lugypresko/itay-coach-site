/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
  DoDConditionId, 
  VerificationResult,
  VerificationOutput,
  EvidenceType,
  Evidence
} from "@/domain/missions/types";

export interface VerificationContext {
  evidence: Evidence[];
  snapshot: unknown;
  additionalContext?: Record<string, unknown>;
}

/**
 * Registry that maps DoD conditions to specific verifiers
 * Each verifier knows how to check a specific condition
 */
export class VerifierRegistry {
  private verifiers: Map<string, (context: VerificationContext) => Promise<VerificationOutput>> = new Map();
  
  constructor() {
    this.registerDefaultVerifiers();
  }
  
  /**
   * Register a verifier for a specific DoD condition
   */
  public register(
    dodConditionId: string, 
    verifier: (context: VerificationContext) => Promise<VerificationOutput>
  ): void {
    if (this.verifiers.has(dodConditionId)) {
      throw new Error(`Verifier for DoD condition ${dodConditionId} already registered`);
    }
    this.verifiers.set(dodConditionId, verifier);
  }
  
  /**
   * Get the verifier for a specific DoD condition
   */
  public get(dodConditionId: string): 
    ((context: VerificationContext) => Promise<VerificationOutput>) | undefined {
    return this.verifiers.get(dodConditionId);
  }
  
  /**
   * Check if we have a verifier for a condition
   */
  public hasVerifierFor(dodConditionId: string): boolean {
    return this.verifiers.has(dodConditionId);
  }
  
  /**
   * Execute verification for a specific condition
   */
  public async verify(
    dodConditionId: string,
    context: VerificationContext
  ): Promise<VerificationOutput> {
    const verifier = this.verifiers.get(dodConditionId);
    
    if (!verifier) {
      // No specific verifier - return NOT_OBSERVED
      return {
        dodConditionId,
        result: "NOT_OBSERVED" as const,
        evidence: [],
        details: {
          reason: "No verifier registered for this condition"
        }
      };
    }
    
    try {
      return await verifier(context);
    } catch (error) {
      // Verifier threw an exception
      return {
        dodConditionId,
        result: "FAIL" as const,
        evidence: [],
        details: {
          error: error instanceof Error ? error.message : String(error),
          reason: "Verifier threw an exception"
        }
      };
    }
  }
  
  /**
   * Register the default verifiers for our pilot mission
   */
  private registerDefaultVerifiers(): void {
    // Default verifier that checks for evidence of a specific type
    this.register("default-http-check", this.createHttpVerifier());
  }
  
  /**
   * Create a basic HTTP verifier
   */
  private createHttpVerifier() {
    return async (context: VerificationContext): Promise<VerificationOutput> => {
      // Basic implementation - looks for OBSERVED evidence
      const hasObservedEvidence = context.evidence.some(evidence => 
        evidence && (evidence as any).type === EvidenceType.OBSERVED
      );
      
      return {
        dodConditionId: "http-response-check",
        result: hasObservedEvidence ? "PASS" : "NOT_OBSERVED",
        evidence: context.evidence,
        details: {
          foundObserved: hasObservedEvidence,
          evidenceCount: context.evidence.length
        }
      };
    };
  }
}

/**
 * Simple factory for creating verifier registry instances
 */
export const createVerifierRegistry = (): VerifierRegistry => new VerifierRegistry();
