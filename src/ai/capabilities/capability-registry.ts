import { Capability, CapabilityTypeValues } from "@/domain/missions/types";

// Capability type values (mirroring capabilityTypeSchema)
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

export type CapabilityType = typeof CapabilityType[keyof typeof CapabilityType];

/**
 * Registry of available capabilities with explicit side-effect metadata
 * Implements policy enforcement for what capabilities can be used
 */
export class CapabilityRegistry {
  private capabilities: Map<string, Capability> = new Map();
  
  constructor() {
    this.registerDefaultCapabilities();
  }
  
  /**
   * Register a capability with the registry
   */
  public register(capability: Capability): void {
    if (this.capabilities.has(capability.id)) {
      throw new Error(`Capability with ID ${capability.id} already registered`);
    }
    this.capabilities.set(capability.id, capability);
  }
  
  /**
   * Get a capability by ID
   */
  public get(id: string): Capability | undefined {
    return this.capabilities.get(id);
  }
  
  /**
   * Get all registered capabilities
   */
  public getAll(): Capability[] {
    return Array.from(this.capabilities.values());
  }
  
  /**
   * Get capabilities of a specific type
   */
  public getByType(type: string): Capability[] {
    const capabilityType = type as CapabilityType;
    return Array.from(this.capabilities.values()).filter(cap => cap.type === capabilityType);
  }
  
  /**
   * Check if a capability is allowed under current policy
   * 
   * @returns Tuple of [isAllowed, denialReasonIfAny]
   */
  public isAllowed(
    capability: Capability, 
    context: { 
      dryRunMode: boolean;
      executionBoundary: ExecutionBoundary;
    }
  ): [boolean, string | null] {
    // Policy 1: In dry-run mode, certain capabilities are forbidden
    if (context.dryRunMode) {
      const forbiddenInDryRun: string[] = [
        CapabilityType.DEPLOYMENT,
        CapabilityType.MIGRATION,
        CapabilityType.APPROVAL,
        CapabilityType.PUBLICATION,
        CapabilityType.INDEXING,
      ];
      
      if (forbiddenInDryRun.includes(capability.type)) {
        return [ 
          false, 
          `Capability ${capability.type} is forbidden in dry-run mode`
        ];
      }
    }
    
    // Policy 2: Respect execution boundary constraints
    if (!this.isAllowedByExecutionBoundary(capability, context.executionBoundary)) {
      return [
        false,
        `Capability ${capability.type} violates execution boundary: ${context.executionBoundary}`
      ];
    }
    
    // Policy 3: Check for inherent restrictions
    if (this.hasInherentRestrictions(capability)) {
      return [
        false,
        `Capability ${capability.type} has inherent restrictions that prevent use`
      ];
    }
    
    return [true, null];
  }
  
  /**
   * Check if capability is allowed by execution boundary rules
   */
  private isAllowedByExecutionBoundary(
    capability: Capability,
    boundary: ExecutionBoundary
  ): boolean {
    switch (boundary) {
      case ExecutionBoundary.LOCAL_INSPECTION_ONLY:
        return (
          capability.type === CapabilityType.READ_ONLY_INSPECTION ||
          capability.type === CapabilityType.LOCAL_VALIDATION
        );
      case ExecutionBoundary.LOCAL_DEVELOPMENT:
        return (
          capability.type === CapabilityType.READ_ONLY_INSPECTION ||
          capability.type === CapabilityType.LOCAL_CODE_MODIFICATION ||
          capability.type === CapabilityType.LOCAL_VALIDATION
        );
        
      case ExecutionBoundary.FULL_EXECUTION:
        // All capabilities allowed in full execution (subject to other policies)
        return true;
        
      default:
        return false;
    }
  }
  
  /**
   * Check if capability has inherent restrictions that prevent use
   */
  private hasInherentRestrictions(capability: Capability): boolean {
    // Some capabilities are inherently problematic regardless of context
    const inherentlyRestricted = [
      CapabilityType.DEPLOYMENT,
      CapabilityType.MIGRATION,
    ];
    
    return (
      capability.type === CapabilityType.DEPLOYMENT ||
      capability.type === CapabilityType.MIGRATION
    );
  }
  
  /**
   * Register the default capabilities for the mission system
   */
  private registerDefaultCapabilities(): void {
    // Read-only inspection capabilities
    this.register({
      id: "cap-http-check",
      name: "HTTP Status Check",
      description: "Check HTTP status code of a URL",
      type: CapabilityTypeValues.READ_ONLY_INSPECTION as "READ_ONLY_INSPECTION",
      hasSideEffects: false,
      canModifyProduction: false,
    });
    
    this.register({
      id: "cap-content-inspection",
      name: "Content Inspection",
      description: "Inspect page content for presence of elements/text",
      type: CapabilityTypeValues.READ_ONLY_INSPECTION as "READ_ONLY_INSPECTION",
      hasSideEffects: false,
      canModifyProduction: false,
    });
    
    this.register({
      id: "cap-internal-language-scan",
      name: "Internal Language Scan",
      description: "Scan content for internal/planning language",
      type: CapabilityTypeValues.READ_ONLY_INSPECTION as "READ_ONLY_INSPECTION",
      hasSideEffects: false,
      canModifyProduction: false,
    });
    
    // Local code modification capabilities
    this.register({
      id: "cap-edit-source-file",
      name: "Edit Source File",
      description: "Modify a source code file in the repository",
      type: CapabilityTypeValues.LOCAL_CODE_MODIFICATION as "LOCAL_CODE_MODIFICATION",
      hasSideEffects: true,
      canModifyProduction: false,
    });
    
    // Local validation capabilities
    this.register({
      id: "cap-run-typecheck",
      name: "TypeCheck",
      description: "Run TypeScript type checker",
      type: CapabilityTypeValues.LOCAL_VALIDATION as "LOCAL_VALIDATION",
      hasSideEffects: false,
      canModifyProduction: false,
    });
    
    this.register({
      id: "cap-run-tests",
      name: "Test Suite",
      description: "Run unit and integration tests",
      type: CapabilityTypeValues.LOCAL_VALIDATION as "LOCAL_VALIDATION",
      hasSideEffects: false,
      canModifyProduction: false,
    });
    
    this.register({
      id: "cap-run-build",
      name: "Build Application",
      description: "Build the application for production",
      type: CapabilityTypeValues.LOCAL_VALIDATION as "LOCAL_VALIDATION",
      hasSideEffects: false,
      canModifyProduction: false,
    });
  }
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
 * Simple factory for creating capability registry instances
 */
export const createCapabilityRegistry = () => new CapabilityRegistry();
