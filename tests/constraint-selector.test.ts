import { test, expect } from "vitest";
import { ConstraintSelector, createConstraintSelector } from "@/domain/missions/constraint-selector";
import { Constraint } from "@/domain/missions/types";

test("ConstraintSelector returns constraint with id", () => {
  const selector = createConstraintSelector();
  
  const constraints: Constraint[] = [
    {
      id: "test-constraint",
      name: "Test Constraint",
      description: "Test",
      isAbsolute: true,
      isActive: false,
    }
  ];
  
  const snapshot = {
    timestamp: new Date().toISOString(),
    state: "PENDING" as const,
    evidence: [],
    gaps: [],
    activeConstraint: undefined,
    currentPlan: [],
    verificationResults: []
  };
  
  const result = selector.select(constraints, snapshot);
  
  expect(result.constraint).toBeDefined();
  expect(result.constraint.id).toBe("test-constraint");
  expect(result.constraint.isActive).toBe(true);
});
