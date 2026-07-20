import {
  Constraint,
  ConstraintSelectorOutput,
  MissionSnapshot,
  MissionSpec,
  DoDConditionId,
  Gap,
  GapSeverity,
  ConstraintSelectionReason,

} from "./types";

/**
 * Selects exactly one active constraint based on priority and current state
 */
export class ConstraintSelector {
  private readonly constraintPriority: string[] = [
    // Higher priority constraints are evaluated first
    "constraint-no-prod-migration",       // Database changes are critical
    "constraint-no-artifact-approval",    // Approval bypass is serious
    "constraint-no-publication-record",   // Publication without record
    "constraint-no-governed-publication", // Publishing governed content
    "constraint-no-indexing",             // SEO changes
    "constraint-no-invented-claims",      // Factual integrity
    "constraint-no-human-approval-bypass", // Process integrity
  ];

  /**
   * Select the currently dominant constraint
   * 
   * @param constraints All defined constraints from mission spec
   * @param snapshot Current mission state snapshot
   * @returns Selected constraint and reasoning
   */
  public select(
    constraints: Constraint[],
    snapshot: MissionSnapshot
  ): ConstraintSelectorOutput {
    // Filter to only constraints that are currently relevant/violated
    const relevantConstraints = this.filterRelevantConstraints(
      constraints, 
      snapshot
    );
    
    if (relevantConstraints.length === 0) {
      // No active constraints - return highest priority as inactive
      const highestPriority = constraints.length > 0 
        ? this.getHighestPriorityConstraint(constraints)
        : this.createEmptyConstraint();
      return {
        constraint: { ...highestPriority, isActive: false },
        selected: { ...highestPriority, isActive: false },
        reason: ConstraintSelectionReason.NO_ACTIVE_CONSTRAINTS,
        selectionTimestamp: new Date().toISOString(),
      };
    }
    
    // Sort by priority (lower index = higher priority)
    const sortedByPriority = [...relevantConstraints].sort((a, b) => {
      const indexA = this.constraintPriority.indexOf(a.id);
      const indexB = this.constraintPriority.indexOf(b.id);
      // If not found in priority list, put at end
      const scoreA = indexA === -1 ? 999 : indexA;
      const scoreB = indexB === -1 ? 999 : indexB;
      return scoreA - scoreB;
    });
    
    // Select the highest priority constraint
    const selected = sortedByPriority[0];
    
    return {
      // Mark as active since we selected it due to relevance
      constraint: { ...selected, isActive: true },
      selected: { ...selected, isActive: true },
      reason: this.determineSelectionReason(selected, relevantConstraints, snapshot),
      selectionTimestamp: new Date().toISOString(),
    };
  }
  
  /**
   * Filter constraints to only those that are currently relevant/violated
   * 
   * For the pilot mission, we consider constraints relevant if there's
   * no evidence for the corresponding DoD conditions
   */
  private filterRelevantConstraints(
    constraints: Constraint[],
    snapshot: MissionSnapshot
  ): Constraint[] {
    // For now, all constraints are considered potentially relevant
    // In a fuller implementation, we would check violation status
    return [...constraints];
  }
  
  /**
   * Determine why a particular constraint was selected
   */
  private determineSelectionReason(
    selected: Constraint,
    allRelevant: Constraint[],
    snapshot: MissionSnapshot
  ): string {
    // If it's the only relevant constraint
    if (allRelevant.length === 1) {
      return ConstraintSelectionReason.ONLY_RELEVANT_CONSTRAINT;
    }
    
    // Check if it's related to blocking issues in the snapshot
    const hasBlockingEvidence = snapshot.evidence.some(ev => {
      if (typeof ev === 'object' && ev !== null && 'metadata' in ev && typeof ev.metadata === 'object' && ev.metadata !== null) {
        const m = ev.metadata as Record<string, unknown>;
        return m.blocking === true && m.relatedConstraintId === selected.id;
      }
      return false;
    });
    
    if (hasBlockingEvidence) {
      return ConstraintSelectionReason.BLOCKING_ISSUE_DETECTED;
    }
    
    // Default to priority-based selection
    return ConstraintSelectionReason.HIGHEST_PRIORITY_AVAILABLE;
  }
  
  /**
   * Get the highest priority constraint from a list
   */
  private getHighestPriorityConstraint(constraints: Constraint[]): Constraint {
    const sorted = [...constraints].sort((a, b) => {
      const indexA = this.constraintPriority.indexOf(a.id);
      const indexB = this.constraintPriority.indexOf(b.id);
      const scoreA = indexA === -1 ? 999 : indexA;
      const scoreB = indexB === -1 ? 999 : indexB;
      return scoreA - scoreB;
    });
    
    return sorted[0] || this.createEmptyConstraint();
  }
  
  /**
   * Create an empty constraint for fallback
   */
  private createEmptyConstraint(): Constraint {
    return {
      id: "fallback-constraint",
      name: "Fallback Constraint",
      description: "No constraint selected",
      isAbsolute: true,
      isActive: false,
      selectionReason: undefined
    };
  }
}

/**
 * Simple factory for creating constraint selector instances
 */
export const createConstraintSelector = () => new ConstraintSelector();
