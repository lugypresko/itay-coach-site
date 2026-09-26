import { describe, expect, it } from "vitest";

import {
  DIAGNOSTIC_QUESTION_IDS,
  getDiagnosticQuestions,
  type DiagnosticQuestionId,
} from "../../src/lib/diagnostic-funnel/questions";

describe("diagnostic funnel questions", () => {
  it("returns five deterministic questions with stable order, ids, and copy", () => {
    const first = getDiagnosticQuestions("decision");
    const second = getDiagnosticQuestions("decision");

    expect(first).toEqual(second);
    expect(first).toHaveLength(5);
    expect(first.map(({ order }) => order)).toEqual([1, 2, 3, 4, 5]);
    expect(first.map(({ id }) => id)).toEqual([...DIAGNOSTIC_QUESTION_IDS]);
    expect(first.every(({ copy }) => copy.trim().length > 0)).toBe(true);
    expect(first.map(({ id }) => id satisfies DiagnosticQuestionId)).toEqual([
      "Q1",
      "Q2",
      "Q3",
      "Q4",
      "Q5",
    ]);
  });

  it("changes only Q2 options for the selected case type", () => {
    const decision = getDiagnosticQuestions("decision");
    const review = getDiagnosticQuestions("review");

    expect(decision[0]).toEqual(review[0]);
    expect(decision.slice(2)).toEqual(review.slice(2));
    expect(decision[1].options).not.toEqual(review[1].options);
    expect(decision[1].options?.length).toBeGreaterThan(0);
    expect(review[1].options?.length).toBeGreaterThan(0);
  });

  it("keeps one-line context optional and outside the five required questions", () => {
    const questions = getDiagnosticQuestions("other");
    const context = questions[4].optionalContext;

    expect(context).toMatchObject({
      id: "context",
      optional: true,
      maxLength: 240,
    });
    expect(context?.copy.trim().length).toBeGreaterThan(0);
    expect((questions as readonly { id: string }[]).some(({ id }) => id === "context")).toBe(false);
  });
});
