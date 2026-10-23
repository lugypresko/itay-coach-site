import { z } from "zod";
import { questions } from "./questions";
export const VERSION = "v3" as const;
export const ANALYSIS_VERSION = "analysis-v2" as const;
export const SCORING_VERSION = "scoring-v1" as const;
const single = (id: string) =>
  z.enum(
    questions.find((q) => q.id === id)!.options.map((o) => o[0]) as [
      string,
      ...string[],
    ],
  );
export const answerSchema = z
  .object({
    situation: single("situation").optional(),
    absence: single("absence").optional(),
    owner: single("owner").optional(),
    authority: single("authority").optional(),
    duration: single("duration").optional(),
    frequency: z
      .enum(["several", "weekly", "monthly", "occasionally"])
      .optional(),
    attempts: z.array(single("attempts")).min(1).max(8).optional(),
    impact: z.array(single("impact")).min(1).max(9).optional(),
    desired: single("desired").optional(),
    attempts_context: z.string().max(600).optional(),
    impact_context: z.string().max(600).optional(),
    context: z.string().max(1200).optional(),
  })
  .strict()
  .superRefine((a, ctx) => {
    for (const [key, exclusive] of [
      ["attempts", "nothing"],
      ["impact", "little"],
    ] as const) {
      const v = a[key];
      if (
        v &&
        (new Set(v).size !== v.length ||
          (v.includes(exclusive) && v.length > 1))
      )
        ctx.addIssue({
          code: "custom",
          path: [key],
          message: "Choose either none or specific options.",
        });
    }
  });
export type Answers = z.infer<typeof answerSchema>;
export const qualificationSchema = z
  .object({
    role: z.enum(["cto", "vp", "head_director", "group", "em", "other"]),
    org_size: z.enum(["under20", "20_50", "51_100", "101_250", "251plus"]),
  })
  .strict();
export type Qualification = z.infer<typeof qualificationSchema>;
export const identitySchema = z
  .object({
    first_name: z.string().trim().min(1).max(80),
    email: z.email().max(254),
    company: z.string().trim().min(1).max(160),
  })
  .strict();
export type Identity = z.infer<typeof identitySchema>;
export const patterns = [
  "ownership_gap", "decision_rights_gap", "cross_team_dependency",
  "review_dependency", "escalation_habit", "risk_boundary_ambiguity",
  "capability_gap", "system_process_problem", "mixed", "unclear",
] as const;
export const answerReferences = {
  Q1: ["situation"], Q2: ["absence"], Q3: ["owner"], Q4: ["authority"],
  Q5: ["duration", "frequency"], Q6: ["attempts", "attempts_context"],
  Q7: ["impact", "impact_context"], Q8: ["desired"], Q9: ["context"],
  CASE_CONTEXT: ["context"],
} as const;
const text = z.string().min(1).max(700);
const evidenceSchema = z
  .object({
    answer_reference: z.enum(["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9"]),
    interpretation: text,
  })
  .strict();
const common = {
  primary_pattern: z.enum(patterns),
  secondary_pattern: z.enum(patterns).nullable(),
  confidence: z.enum(["low", "medium", "high"]),
  evidence: z.array(evidenceSchema).max(5),
  likely_explanation: text,
  alternative_hypothesis: text.nullable(),
  contradictions: z.array(text).max(3),
  missing_information: z.array(text).max(3),
  desired_outcome: text,
};
export const partialSchema = z
  .object({
    ...common,
    teaser_insight: text,
    recommended_test_category: z.enum(["ownership", "decision_rights", "escalation", "risk_boundary", "cross_team", "capability", "system", "unclear"]),
  })
  .strict();
export const fullSchema = z
  .object({
    primary_pattern: z.enum(patterns),
    likely_explanation: text,
    alternative_hypothesis: text.nullable(),
    evidence: z.array(evidenceSchema.extend({answer_reference: z.enum(["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9", "CASE_CONTEXT"])})).max(5),
    case_summary: text,
    leadership_move: text,
    manager_question: text,
    seven_day_experiment: z
      .object({
        action: text,
        trigger: text,
        safety_boundary: text,
        observation: text,
        review_point: text,
      })
      .strict(),
    success_signal: text,
    unresolved_question: text,
  })
  .strict();
export type PartialAnalysis = z.infer<typeof partialSchema>;
export type FullAnalysis = z.infer<typeof fullSchema>;
export type Analysis<T> = {
  session_id: string;
  answer_revision: number;
  analysis_version: typeof ANALYSIS_VERSION;
  data: T;
  source: "groq" | "fallback";
  model: string;
  fallback_reason?: string;
  provider_status?: number;
  duration_ms?: number;
};
export type Route =
  | "unqualified_nurture"
  | "self_service"
  | "conversation"
  | "conversation_override"
  | "nurture";
export type Scoring = {
  scoring_version: typeof SCORING_VERSION;
  fit_status: "unknown" | "known";
  fit: number | null;
  pain: number;
  urgency: number;
  readiness: number;
  total: number | null;
  route: Route;
  rule: string;
};
export type Session = {
  id: string;
  diagnostic_version: typeof VERSION;
  record_version: number;
  answer_revision: number;
  answers: Answers;
  step: number;
  stage: "entry" | "answering" | "partial" | "full";
  identity?: Identity;
  qualification?: Qualification;
  qualification_skipped?: boolean;
  partial?: Analysis<PartialAnalysis>;
  full?: Analysis<FullAnalysis>;
  scoring: Scoring;
  sales_brief?: string;
  events: string[];
  created_at: string;
  identified_at?: string;
  expires_at: string;
  return_hash?: string;
  return_expires_at?: string;
  mail?: "queued" | "sent" | "simulated" | "failed";
};
export function complete(a: Answers) {
  return [
    "situation",
    "absence",
    "owner",
    "authority",
    "duration",
    "frequency",
    "attempts",
    "impact",
    "desired",
  ].every((k) => Boolean(a[k as keyof Answers]));
}
