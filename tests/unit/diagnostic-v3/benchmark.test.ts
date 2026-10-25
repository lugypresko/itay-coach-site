import { describe, expect, it } from "vitest";
import {
  benchmarkEnvironmentAllowed,
  benchmarkScenarios,
  parseBenchmarkRun,
} from "@/lib/diagnostic-v3/benchmark";

describe("temporary Diagnostic V3 benchmark guard", () => {
  it("allows only the feature branch in Preview", () => {
    expect(benchmarkEnvironmentAllowed("preview", "feature/diagnostic-v3")).toBe(true);
    expect(benchmarkEnvironmentAllowed("production", "feature/diagnostic-v3")).toBe(false);
    expect(benchmarkEnvironmentAllowed("preview", "main")).toBe(false);
  });

  it("accepts only the exact answers assigned to a known scenario and verified model", () => {
    const scenario = benchmarkScenarios.decision_rights;
    expect(parseBenchmarkRun({
      scenario_id: "decision_rights",
      answers: scenario.answers,
      model: "openai/gpt-oss-120b",
      repetition: 2,
    }, ["openai/gpt-oss-120b"])).toMatchObject({ scenario_id: "decision_rights", repetition: 2 });
    expect(() => parseBenchmarkRun({
      scenario_id: "decision_rights",
      answers: { ...scenario.answers, context: "different input" },
      model: "openai/gpt-oss-120b",
      repetition: 2,
    }, ["openai/gpt-oss-120b"])).toThrow();
    expect(() => parseBenchmarkRun({
      scenario_id: "decision_rights",
      answers: scenario.answers,
      model: "unverified/model",
      repetition: 2,
    }, ["openai/gpt-oss-120b"])).toThrow();
  });

  it("rejects an unknown scenario and repetition outside the two-run matrix", () => {
    const scenario = benchmarkScenarios.decision_rights;
    expect(() => parseBenchmarkRun({
      scenario_id: "unknown",
      answers: scenario.answers,
      model: "openai/gpt-oss-20b",
      repetition: 1,
    }, ["openai/gpt-oss-20b"])).toThrow();
    expect(() => parseBenchmarkRun({
      scenario_id: "decision_rights",
      answers: scenario.answers,
      model: "openai/gpt-oss-20b",
      repetition: 3,
    }, ["openai/gpt-oss-20b"])).toThrow();
  });
});
