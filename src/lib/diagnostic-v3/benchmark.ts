import { z } from "zod";
import { answerSchema, type Answers } from "./contracts";

export const benchmarkScenarios = {
  decision_rights: {
    expected: "Escalation habit despite stated manager ownership and authority",
    answers: {
      situation: "decision",
      absence: "escalate",
      owner: "manager",
      authority: "checks",
      duration: "long",
      frequency: "weekly",
      attempts: ["owner", "decide"],
      impact: ["delivery", "time"],
      desired: "escalations",
      context: "One manager clearly owns the work and has authority to decide. They still check with me or escalate when the trade-off changes, even after I asked them to decide independently. The work waits for my response.",
    },
  },
  vp_owned: {
    expected: "Legitimate executive-owned decision or structural dependency",
    answers: {
      situation: "decision",
      absence: "wait",
      owner: "me",
      authority: "mine",
      duration: "months",
      frequency: "weekly",
      attempts: ["conversation", "process"],
      impact: ["delivery", "customer"],
      desired: "faster",
      context: "The manager owns execution, but this specific decision is reserved to the VP because it commits the organization. The work waits for that required VP decision; the manager cannot authorize it.",
    },
  },
  trust_capability: {
    expected: "Explicit quality-confidence or capability concern; not a default decision-rights gap",
    answers: {
      situation: "review",
      absence: "distrust",
      owner: "manager",
      authority: "normally",
      duration: "long",
      frequency: "weekly",
      attempts: ["reviews", "conversation"],
      impact: ["confidence", "development"],
      desired: "trust",
      context: "The manager owns the work and can normally make the decision. I still step into reviews because I am unsure the outcome will meet quality expectations. No additional approval is formally required for these routine decisions.",
    },
  },
  cross_team: {
    expected: "Cross-team coordination or shared end-to-end ownership dependency",
    answers: {
      situation: "dependency",
      absence: "discuss",
      owner: "pieces",
      authority: "normally",
      duration: "system",
      frequency: "weekly",
      attempts: ["owner", "process"],
      impact: ["cross", "delivery"],
      desired: "cross",
      context: "Team A owns integration and Team B owns the API contract. Each team handles its own work, but nobody owns end-to-end readiness. They keep discussing and waiting because the dependency crosses team boundaries.",
    },
  },
} as const satisfies Record<string, { expected: string; answers: Answers }>;

export type BenchmarkScenarioId = keyof typeof benchmarkScenarios;
export const benchmarkScenarioIds = Object.keys(benchmarkScenarios) as BenchmarkScenarioId[];

export function benchmarkEnvironmentAllowed(vercelEnv?: string, branch?: string) {
  return vercelEnv === "preview" && branch === "feature/diagnostic-v3";
}

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object")
    return `{${Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${canonical(item)}`).join(",")}}`;
  return JSON.stringify(value);
}

const benchmarkRunSchema = z.object({
  scenario_id: z.enum(["decision_rights", "vp_owned", "trust_capability", "cross_team"]),
  answers: answerSchema,
  model: z.string().min(1).max(120),
  repetition: z.union([z.literal(1), z.literal(2)]),
}).strict();

export function parseBenchmarkRun(input: unknown, availableModels: string[]) {
  const run = benchmarkRunSchema.parse(input);
  if (!availableModels.includes(run.model)) throw new Error("Model is not verified for this Preview runtime.");
  const expected = benchmarkScenarios[run.scenario_id].answers;
  if (canonical(run.answers) !== canonical(expected)) throw new Error("Answers do not match the selected gold-standard scenario.");
  return run;
}
