import { 
  MissionSnapshot, 
  Constraint, 
  DoDConditionId,
  Evidence
} from "./types";

/**
 * Analyzes public site and repository to determine launch content readiness
 */
export class LaunchAnalyzer {
  /**
   * Determine minimum launch inventory from current site and repository state
   */
  public analyze(snapshot: MissionSnapshot): {
    requiredContent: string[];
    presentContent: string[];
    missingContent: string[];
    contentStatus: Record<string, "PRESENT" | "MISSING" | "INCOMPLETE">;
  } {
    const required = this.getRequiredLaunchContent();
    const present = this.inspectCurrentContent(snapshot);
    
    const contentStatus: Record<string, "PRESENT" | "MISSING" | "INCOMPLETE"> = {};
    
    for (const item of required) {
      if (present.has(item)) {
        contentStatus[item] = "PRESENT";
      } else {
        contentStatus[item] = "MISSING";
      }
    }
    
    for (const item of present) {
      if (!contentStatus[item]) {
        contentStatus[item] = "INCOMPLETE";
      }
    }
    
    return {
      requiredContent: required,
      presentContent: Array.from(present),
      missingContent: Object.entries(contentStatus)
        .filter(([_, status]) => status === "MISSING")
        .map(([key]) => key),
      contentStatus
    };
  }
  
  /**
   * Get the minimum required launch content inventory
   */
  private getRequiredLaunchContent(): string[] {
    return [
      // Positioning and core promise
      "positioning-core-promise",
      "target-audience-primary-pain",
      "value-proposition",
      
      // Methodology and framework
      "methodology-distinctive",
      "framework-diagnostic-model",
      
      // Service and engagement
      "service-offering",
      "engagement-process",
      
      // Proof and credibility
      "proof-outcomes-evidence",
      "client-results",
      "case-studies",
      
      // Objections and Q&A
      "common-objections",
      "questions-prospects-ask",
      "objection-handling",
      
      // Conversion path
      "conversion-path-clear",
      "next-steps-cta",
      "qualifying-process",
      
      // Authority reinforcement
      "authority-reinforcement",
      "expertise-demonstration",
      "trust-signals"
    ]
  }
  
  /**
   * Inspect current public site and repository for existing content
   */
  private inspectCurrentContent(snapshot: MissionSnapshot): Set<string> {
    const present = new Set<string>();
    
    // Check repository for content files
    // This would inspect actual content files in the repo
    // For the pilot mission, we check what's been prepared
    
    // Based on the pilot mission spec, check for prepared content
    const hasPositioning = this.hasContent(snapshot, "positioning");
    const hasAudience = this.hasContent(snapshot, "audience");
    const hasMethodology = this.hasContent(snapshot, "methodology");
    const hasFramework = this.hasContent(snapshot, "framework");
    const hasService = this.hasContent(snapshot, "service");
    const hasProof = this.hasContent(snapshot, "proof");
    const hasObjections = this.hasContent(snapshot, "objections");
    const hasConversion = this.hasContent(snapshot, "conversion");
    
    if (hasPositioning) present.add("positioning-core-promise");
    if (hasAudience) present.add("target-audience-primary-pain");
    if (hasMethodology) present.add("methodology-distinctive");
    if (hasFramework) present.add("framework-diagnostic-model");
    if (hasService) present.add("service-offering");
    if (hasProof) present.add("proof-outcomes-evidence");
    if (hasObjections) present.add("common-objections");
    if (hasConversion) present.add("conversion-path-clear");
    
    return present;
  }
  
  /**
   * Check if content exists in the current state
   */
  private hasContent(snapshot: MissionSnapshot, contentType: string): boolean {
    // Check evidence for content verification
    const contentEvidence = snapshot.evidence.filter(ev => {
      if (typeof ev === 'object' && ev !== null && 'metadata' in ev && typeof ev.metadata === 'object' && ev.metadata !== null) {
        return (ev.metadata as Record<string, unknown>).contentType === contentType;
      }
      return false;
    });
    
    return contentEvidence.length > 0;
  }
  
  /**
   * Determine launch readiness status
   */
  public determineLaunchStatus(
    snapshot: MissionSnapshot,
    analysis: ReturnType<LaunchAnalyzer['analyze']>
  ): {
    isLaunchReady: boolean;
    status: "LAUNCH_READY" | "NEEDS_CONTENT" | "INCOMPLETE";
    missingCritical: string[];
    missingRecommended: string[];
  } {
    const criticalContent = [
      "positioning-core-promise",
      "target-audience-primary-pain", 
      "methodology-distinctive",
      "conversion-path-clear"
    ];
    
    const missingCritical = criticalContent.filter(c => 
      analysis.contentStatus[c] !== "PRESENT"
    );
    
    const missingRecommended = analysis.missingContent.filter(c => 
      !criticalContent.includes(c)
    );
    
    const isLaunchReady = missingCritical.length === 0;
    
    let status: "LAUNCH_READY" | "NEEDS_CONTENT" | "INCOMPLETE";
    if (isLaunchReady && missingRecommended.length === 0) {
      status = "LAUNCH_READY";
    } else if (isLaunchReady) {
      status = "NEEDS_CONTENT";
    } else {
      status = "INCOMPLETE";
    }
    
    return {
      isLaunchReady,
      status,
      missingCritical,
      missingRecommended
    };
  }
}

/**
 * Factory for creating launch analyzer instances
 */
export const createLaunchAnalyzer = () => new LaunchAnalyzer();
