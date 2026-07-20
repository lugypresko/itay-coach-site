import { MissionSpec, MissionSnapshot, Gap, DoDConditionId, Evidence } from "./types";

/**
 * Analyzes the current mission state to identify gaps between
 * current evidence and the Definition of Done
 */
export class GapAnalyzer {
  /**
   * Analyze mission spec and snapshot to identify gaps
   * 
   * @param spec - The mission specification with DoD conditions
   * @param snapshot - Current mission state snapshot
   * @returns Array of identified gaps with severity assessment
   */
  public analyze(spec: MissionSpec, snapshot: MissionSnapshot): Gap[] {
    const gaps: Gap[] = [];
    
    // Collect all condition IDs from the DoD
    const allConditionIds = new Set<string>();
    
    // Add conditions from definition of done
    spec.definitionOfDone?.forEach(dod => {
      allConditionIds.add(dod.id);
    });
    
    // Add conditions from constraints  
    spec.constraints?.forEach(constraint => {
      allConditionIds.add(constraint.id);
    });
    
    // For each condition, check if there's evidence
    for (const conditionId of allConditionIds) {
      const conditionEvidence = this.findEvidenceForCondition(snapshot, conditionId);
      
      if (!conditionEvidence || conditionEvidence.length === 0) {
        // No evidence found - this is a gap
        gaps.push({
          id: `gap-${conditionId}-${Date.now()}`,
          conditionId,
          description: `Missing evidence for DoD condition: ${conditionId}`,
          severity: "BLOCKING",
          requiredEvidence: [{ type: "UNAVAILABLE", description: spec.definitionOfDone?.find(dod => dod.id === conditionId)?.verifierReference || "unknown" }],
          actualEvidence: [],
          size: 1.0
        });
      } else {
        // Evaluate evidence completeness
        const gapSize = this.evaluateEvidenceCompleteness(conditionEvidence);
        if (gapSize > 0) {
          gaps.push({
            id: `gap-${conditionId}-${Date.now()}`,
            conditionId,
            description: `Insufficient or invalid evidence for condition: ${conditionId}`,
            severity: gapSize > 0.5 ? "BLOCKING" : "WARNING",
            requiredEvidence: [{ type: "UNAVAILABLE", description: spec.definitionOfDone?.find(dod => dod.id === conditionId)?.verifierReference || "unknown" }],
            actualEvidence: conditionEvidence,
            size: gapSize
          });
        }
      }
    }
    
    return gaps;
  }
  
  /**
   * Find all evidence items related to a specific condition
   */
  private findEvidenceForCondition(snapshot: MissionSnapshot, conditionId: DoDConditionId): Evidence[] {
    return snapshot.evidence.filter(ev => 
      ev && ev.conditionId === conditionId
    ) as Evidence[];
  }
  
  /**
   * Evaluate evidence completeness for a condition
   * Returns 0.0 (complete) to 1.0 (completely missing/incomplete)
   */
  private evaluateEvidenceCompleteness(evidence: Evidence[]): number {
    if (!evidence || evidence.length === 0) {
      return 1.0;
    }
    
    // Check for invalid/placeholder evidence
    const invalidEvidence = evidence.filter(ev => 
      !ev || !ev.description || ev.description.trim() === ''
    );
    
    if (invalidEvidence.length === evidence.length) {
      return 1.0; // All evidence is invalid
    }
    
    // Some heuristic based on evidence quality
    const validEvidence = evidence.filter(ev => ev && ev.description && ev.description.trim() !== '');
    const coverage = validEvidence.length / evidence.length;
    
    // If we have some valid evidence but not enough, there's still a gap
    return Math.max(0, 1 - coverage);
  }
}

/**
 * Simple factory for creating gap analyzer instances
 */
export const createGapAnalyzer = () => new GapAnalyzer();
