import { z } from "zod";
import {
  ANALYSIS_VERSION,
  answerReferences,
  partialSchema,
  fullSchema,
  type Answers,
  type Analysis,
  type PartialAnalysis,
  type FullAnalysis,
} from "./contracts";
import { label } from "./questions";
export function sanitizeCase(
  a: Answers,
  privateTerms: string[] = [],
): { safe: boolean; answers: Answers } {
  const answers = { ...a };
  let safe = true;
  for (const key of [
    "context",
    "attempts_context",
    "impact_context",
  ] as const) {
    const value = a[key] ?? "";
    if (
      privateTerms.some(
        (term) =>
          term.length > 1 && value.toLowerCase().includes(term.toLowerCase()),
      )
    )
      safe = false;
    // Fail closed on recognizable PII, credentials, names and prompt injection.
    if (/\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/.test(value)) safe = false;
    if (
      /@|https?:|\b(?:password|secret|api.?key|token|customer name|employee name)\b|\b(?:ignore|override)\b.*\b(?:instructions|prompt)\b|\+?\d[\d\s()-]{7,}\d/i.test(
        value,
      )
    )
      safe = false;
    answers[key] = value.replace(/[\u0000-\u001f<>]/g, " ").trim();
  }
  return { safe, answers };
}
function fallbackDetails(a: Answers) {
  let pattern: "escalation_habit" | "ownership_gap" | "decision_rights_gap" | "cross_team_dependency" | "review_dependency" | "risk_boundary_ambiguity" | "unclear" = "escalation_habit";
  if (a.owner === "unclear" || a.owner === "pieces" || a.owner === "formal")
    pattern = "ownership_gap";
  else if (
    a.authority === "checks" ||
    a.authority === "limited" ||
    a.authority === "mine"
  )
    pattern = "decision_rights_gap";
  else if (a.situation === "dependency" || a.situation === "meeting")
    pattern = "cross_team_dependency";
  else if (a.situation === "review") pattern = "review_dependency";
  if (a.absence === "handles" && a.authority === "normally")
    pattern = "unclear";
  const repeated = a.duration !== "first";
  const explanations: Record<"escalation_habit" | "ownership_gap" | "decision_rights_gap" | "cross_team_dependency" | "review_dependency" | "risk_boundary_ambiguity" | "unclear", string> = {
    decision_rights_gap:
      "Ownership may be assigned while the next decision still needs your permission. Test the decision boundary before treating this as a capability issue.",
    ownership_gap:
      "Responsibility may be distributed without one person owning the next milestone. Test who takes the next step when work stalls.",
    cross_team_dependency:
      "The handoff between teams may depend on you to connect the next decision. Test a direct agreement between the people involved.",
    review_dependency:
      "Review may have become the default route for progressing work. Separate decisions that require your review from those with an agreed boundary.",
    escalation_habit:
      "Your involvement may be part of the route work normally follows. Check what triggers the handoff before assuming why it happens.",
    risk_boundary_ambiguity: "A specific risk may justify escalation. Establish which risk requires your decision and what can stay with the manager.",
    unclear:
      "Your answers suggest the manager can usually handle this. There is not enough evidence here to call it an organizational dependency.",
  };
  const moves: Record<"escalation_habit" | "ownership_gap" | "decision_rights_gap" | "cross_team_dependency" | "review_dependency" | "risk_boundary_ambiguity" | "unclear", string> = {
    decision_rights_gap:
      "Before the next decision, agree with the manager what they can decide, the constraints and the exact condition for escalation.",
    ownership_gap:
      "Agree on one named owner for the next milestone, the next action and when they will update the people waiting.",
    cross_team_dependency:
      "Ask the two sides to name the decision or deliverable each needs from the other, with an owner and date.",
    review_dependency:
      "Choose one low-risk review category the manager can complete using agreed criteria; keep material risks in the existing review path.",
    escalation_habit:
      "At the next low-risk handoff, ask for the manager’s proposed decision and what makes your involvement necessary.",
    risk_boundary_ambiguity: "Name one explicit escalation condition and keep decisions outside that condition with the accountable manager.",
    unclear:
      "Record the next comparable incident and whether it is resolved without your intervention before changing the operating system.",
  };
  const evidence = (["owner", "authority", "absence", "duration"] as const)
    .filter((k) => a[k])
    .slice(0, 3)
    .map((k) => ({
      answer_reference: ({owner: "Q3", authority: "Q4", absence: "Q2", duration: "Q5"} as const)[k],
      interpretation: `You selected: ${label(k, a[k]!)}`,
    }));
  const contradictions =
    a.absence === "handles" && a.authority !== "normally"
      ? [
          "You expect the manager to handle it without you, yet the decision boundary still appears limited. Check when each is true.",
        ]
      : [];
  const already =
    a.attempts?.includes("owner") && pattern === "ownership_gap"
      ? "You have already clarified ownership. Instead of repeating the assignment, inspect what happened immediately after the last clarification."
      : a.attempts?.includes("decide") && pattern === "decision_rights_gap"
        ? "You have already told the manager to decide. Inspect one actual decision boundary and what happened when they used it."
        : moves[pattern];
  return {
    primary_pattern: pattern,
    secondary_pattern: null,
    confidence: (
      evidence.length < 2 || !repeated || contradictions.length
        ? "low"
        : "medium") as "low" | "medium",
    evidence,
    likely_explanation: explanations[pattern],
    alternative_hypothesis: null,
    contradictions,
    missing_information: [
      "What happened immediately before the last handoff back to you?",
    ],
    desired_outcome: a.desired
      ? label("desired", a.desired)
      : "A clearer next step.",
    case_summary: `You described ${label("situation", a.situation ?? "other").toLowerCase()}. Without you: ${label("absence", a.absence ?? "unsure").toLowerCase()}. Your involvement returns at that handoff; the reported impact is ${a.impact?.length ? a.impact.map((v) => label("impact", v).toLowerCase()).join(", ") : "not yet clear"}.`,
    leadership_move: already,
    manager_question:
      "What made this feel like a decision that needed me?",
    seven_day_experiment: {
      action: already,
      trigger:
        "Use the next comparable low-risk instance during the next 7 days.",
      safety_boundary:
        "Keep legal, customer, security and irreversible commitments within existing approval requirements.",
      observation:
        "Record who decided, whether it returned to you and the stated reason for any escalation.",
      review_point: "Review after the next 2–3 occurrences or after seven days: if the handoff persists within the agreed boundary, inspect the stated blocker; if it stops, the boundary may have been the missing condition.",
    },
    success_signal:
      "The next comparable decision is made at the agreed level, within the agreed boundaries, without an unnecessary handoff.",
    unresolved_question:
      "Is the handoff caused by unclear authority, missing context or a risk that legitimately belongs with you?",
  };
}
export function fallback(a: Answers): FullAnalysis {
  const f = fallbackDetails(a);
  return fullSchema.parse(Object.fromEntries(Object.entries(f).filter(([key]) => key in fullSchema.shape)));
}
export function partialFallback(a: Answers): PartialAnalysis {
  const f = fallbackDetails(a);
  return partialSchema.parse({
    primary_pattern: f.primary_pattern,
    secondary_pattern: f.secondary_pattern,
    confidence: f.confidence,
    evidence: f.evidence,
    likely_explanation: f.likely_explanation,
    alternative_hypothesis: f.alternative_hypothesis,
    contradictions: f.contradictions,
    missing_information: f.missing_information,
    desired_outcome: f.desired_outcome,
    teaser_insight: f.likely_explanation,
    recommended_test_category: ({ownership_gap: "ownership", decision_rights_gap: "decision_rights", cross_team_dependency: "cross_team", review_dependency: "escalation", escalation_habit: "escalation", risk_boundary_ambiguity: "risk_boundary", unclear: "unclear"} as const)[f.primary_pattern],
  });
}
export function validateEvidence<T extends PartialAnalysis | FullAnalysis>(
  data: T,
  a: Answers,
): T {
  const refs = new Set<string>();
  for (const e of data.evidence) {
    const fields = answerReferences[e.answer_reference];
    if (!fields.some((key) => {
      const value = a[key];
      return Array.isArray(value) ? value.length > 0 : Boolean(value?.trim());
    })) throw new Error("Unsupported evidence reference");
    refs.add(e.answer_reference === "CASE_CONTEXT" ? "Q9" : e.answer_reference);
  }
  if ("confidence" in data && refs.size < 2) data.confidence = "low";
  return data;
}
import { FIRST_READ_SYSTEM, FULL_READ_SYSTEM, PROVIDER_GUARDRAILS } from "./prompts";
export function providerAnswers(a: Answers) {
  return Object.fromEntries(Object.entries(answerReferences).map(([id, fields]) => [id,
    fields.filter((key) => a[key] !== undefined).map((key) => ({
      field: key, value: Array.isArray(a[key]) ? a[key]!.map((v) => label(key, v)) :
        key.endsWith("context") ? a[key] : label(key, a[key] as string),
    }))
  ]));
}
export async function analyze(
  sessionId: string,
  revision: number,
  a: Answers,
  pass: "partial",
  previous?: PartialAnalysis,
  privateTerms?: string[],
): Promise<Analysis<PartialAnalysis>>;
export async function analyze(
  sessionId: string,
  revision: number,
  a: Answers,
  pass: "full",
  previous?: PartialAnalysis,
  privateTerms?: string[],
): Promise<Analysis<FullAnalysis>>;
export async function analyze(
  sessionId: string,
  revision: number,
  a: Answers,
  pass: "partial" | "full",
  previous?: PartialAnalysis,
  privateTerms: string[] = [],
): Promise<Analysis<PartialAnalysis | FullAnalysis>> {
  let data: PartialAnalysis | FullAnalysis =
    pass === "partial" ? partialFallback(a) : fallback(a);
  const base = {
    session_id: sessionId,
    answer_revision: revision,
    analysis_version: ANALYSIS_VERSION,
  };
  const sanitized = sanitizeCase(a, privateTerms);
  const started = Date.now();
  let providerStatus: number | undefined;
  let providerRequestId: string | undefined;
  let providerError: { type?: string; code?: string; message?: string } | undefined;
  let reason =
    process.env.DIAGNOSTIC_V3_AI_ENABLED !== "true"
      ? "ai_disabled"
      : process.env.GROQ_ZDR_VERIFIED !== "true"
        ? "zdr_unverified"
        : !process.env.GROQ_API_KEY
          ? "missing_key"
          : "provider_failed";
  function telemetry(source: string, model: string, failure?: string) {
    const diagnostic = {
      event: "diagnostic_v3_analysis",
      pass,
      source,
      model,
      answer_revision: revision,
      analysis_version: ANALYSIS_VERSION,
      duration_ms: Date.now() - started,
      provider_status: providerStatus ?? null,
      fallback_reason: failure ?? null,
      ...(source === "fallback" && providerStatus !== undefined
        ? {
            provider_request_id: providerRequestId ?? null,
            provider_error_type: providerError?.type ?? null,
            provider_error_code: providerError?.code ?? null,
            provider_error_message: providerError?.message ?? null,
          }
        : {}),
    };
    if (process.env.VERCEL_ENV === "preview")
      console.info(JSON.stringify(diagnostic));
    return {
      duration_ms: diagnostic.duration_ms,
      provider_status: providerStatus,
    };
  }
  if (
    process.env.DIAGNOSTIC_V3_AI_ENABLED === "true" &&
    process.env.GROQ_ZDR_VERIFIED === "true" &&
    process.env.GROQ_API_KEY &&
    sanitized.safe
  ) {
    const model = process.env.DIAGNOSTIC_V3_GROQ_MODEL ?? "openai/gpt-oss-20b";
    try {
      const schema = pass === "partial" ? partialSchema : fullSchema;
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          signal: AbortSignal.timeout(8000),
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: (pass === "partial" ? FIRST_READ_SYSTEM : FULL_READ_SYSTEM) + PROVIDER_GUARDRAILS },
              {
                role: "user",
                content: JSON.stringify({
                  answers: providerAnswers(sanitized.answers),
                  previous_analysis: pass === "full" && previous ? partialSchema.parse(previous) : null,
                  pass,
                }),
              },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: `diagnostic_${pass}`,
                strict: true,
                schema: z.toJSONSchema(schema),
              },
            },
            max_completion_tokens: 2400,
          }),
        },
      );
      providerStatus = response.status;
      const requestIdHeader =
        response.headers.get("x-request-id") ??
        response.headers.get("request-id");
      providerRequestId = requestIdHeader
        ?.replace(/[^a-zA-Z0-9_.:-]/g, "")
        .slice(0, 100) || undefined;
      if (!response.ok) {
        let errorBody: unknown;
        try {
          errorBody = JSON.parse(await response.text());
        } catch {
          errorBody = undefined;
        }
        const root =
          errorBody && typeof errorBody === "object"
            ? (errorBody as Record<string, unknown>)
            : {};
        const nested =
          root.error && typeof root.error === "object"
            ? (root.error as Record<string, unknown>)
            : {};
        const safeToken = (value: unknown) =>
          typeof value === "string"
            ? value.replace(/[^a-zA-Z0-9_.:-]/g, "").slice(0, 100) || undefined
            : undefined;
        const rawMessage =
          typeof nested.message === "string"
            ? nested.message
            : typeof root.message === "string"
              ? root.message
              : undefined;
        const normalizedMessage = rawMessage?.toLocaleLowerCase() ?? "";
        const userText = Object.values(a)
          .flatMap((value) =>
            Array.isArray(value) ? value : [value],
          )
          .filter((value): value is string => typeof value === "string")
          .map((value) => value.trim())
          .filter((value) => value.length >= 4);
        const overlapsSourceText = (text: string, width: number) => {
          const normalized = text.toLocaleLowerCase();
          if (normalized.length <= width)
            return normalizedMessage.includes(normalized);
          for (let index = 0; index <= normalized.length - width; index++) {
            if (normalizedMessage.includes(normalized.slice(index, index + width)))
              return true;
          }
          return false;
        };
        const messageEchoesUserText =
          userText.some((value) => overlapsSourceText(value, 12)) ||
          [FIRST_READ_SYSTEM, FULL_READ_SYSTEM, PROVIDER_GUARDRAILS].some(
            (prompt) => overlapsSourceText(prompt, 24),
          );
        providerError = {
          type: safeToken(nested.type ?? root.type),
          code: safeToken(nested.code ?? root.code),
          message:
            rawMessage && !messageEchoesUserText
              ? rawMessage
                  .replace(/\bBearer\s+\S+/gi, "Bearer [redacted]")
                  .replace(/\bsk-[a-zA-Z0-9_-]+\b|\bgsk_[a-zA-Z0-9_-]+\b/gi, "[redacted]")
                  .replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, "[redacted email]")
                  .replace(/https?:\/\/\S+/gi, "[redacted URL]")
                  .replace(/\s+/g, " ")
                  .slice(0, 300)
              : rawMessage
                ? "[omitted: provider message echoed user input]"
                : undefined,
        };
        throw new Error(`http_${response.status}`);
      }
      const body = await response.json();
      const parsed = schema.parse(
        JSON.parse(body.choices?.[0]?.message?.content ?? ""),
      );
      const validated = validateEvidence(parsed, sanitized.answers);
      // Validate generated text for accidental identity/secret emission too.
      if (!sanitizeCase({ context: JSON.stringify(validated) }).safe)
        throw new Error("unsafe_output");
      return {
        ...base,
        data: validated,
        source: "groq",
        model,
        returned_model: typeof body.model === "string" ? body.model : model,
        provider_request_id: providerRequestId ?? (typeof body.id === "string" ? body.id : undefined),
        ...telemetry("groq", model),
      };
    } catch (error) {
      if (error instanceof z.ZodError) reason = "invalid_schema";
      else if (error instanceof SyntaxError) reason = "invalid_json";
      else if (
        error instanceof Error &&
        ["TimeoutError", "AbortError"].includes(error.name)
      )
        reason = "timeout";
      else if (
        error instanceof Error &&
        (/^http_\d{3}$/.test(error.message) ||
          ["unsafe_output", "Unsupported evidence reference"].includes(
            error.message,
          ))
      )
        reason =
          error.message === "Unsupported evidence reference"
            ? "invalid_evidence"
            : error.message;
      else reason = "provider_unavailable";
      // Never return a rejected provider result as fallback content.
      data = pass === "partial" ? partialFallback(a) : fallback(a);
    }
  } else if (!sanitized.safe) reason = "unsafe_input";
  return {
    ...base,
    data,
    source: "fallback",
    model: "deterministic-v1",
    fallback_reason: reason,
    ...telemetry("fallback", "deterministic-v1", reason),
  };
}
