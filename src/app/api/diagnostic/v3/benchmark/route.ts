import { NextResponse } from "next/server";
import { z } from "zod";
import { analyze, partialFallback } from "@/lib/diagnostic-v3/analysis";
import {
  benchmarkEnvironmentAllowed,
  benchmarkScenarios,
  parseBenchmarkRun,
  type BenchmarkScenarioId,
} from "@/lib/diagnostic-v3/benchmark";
import { ANALYSIS_VERSION, answerSchema, fullSchema, type Analysis, type PartialAnalysis, type Session } from "@/lib/diagnostic-v3/contracts";
import { score } from "@/lib/diagnostic-v3/scoring";
import { getStore, newSession, save, token } from "@/lib/diagnostic-v3/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type ModelProbe = { model_id: string; listed: boolean; structured_output: boolean; http_status?: number };
type GroqModel = { id?: unknown; active?: unknown };
const PRIMARY_MODELS = ["openai/gpt-oss-20b", "openai/gpt-oss-120b"] as const;
const runtimeScope = globalThis as typeof globalThis & { __diagnosticV3BenchmarkModels?: { until: number; values: ModelProbe[]; challenger?: string } };

async function probeModel(modelId: string, apiKey: string): Promise<ModelProbe> {
  let response: Response;
  try {
    response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      signal: AbortSignal.timeout(5000),
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: "user", content: "Return a concise synthetic leadership diagnostic result that conforms to the supplied JSON schema." }],
        response_format: { type: "json_schema", json_schema: { name: "diagnostic_full", strict: true, schema: z.toJSONSchema(fullSchema) } },
        max_completion_tokens: 512,
      }),
    });
  } catch {
    return { model_id: modelId, listed: true, structured_output: false };
  }
  if (!response.ok) return { model_id: modelId, listed: true, structured_output: false, http_status: response.status };
  try {
    const body = await response.json();
    const content = JSON.parse(body.choices?.[0]?.message?.content ?? "null");
    return { model_id: modelId, listed: true, structured_output: fullSchema.safeParse(content).success, http_status: response.status };
  } catch {
    return { model_id: modelId, listed: true, structured_output: false, http_status: response.status };
  }
}

async function verifyModels(force = false) {
  const key = process.env.GROQ_API_KEY;
  if (!key || process.env.DIAGNOSTIC_V3_AI_ENABLED !== "true" || process.env.GROQ_ZDR_VERIFIED !== "true")
    throw new Error("Preview Groq runtime is not enabled for benchmark calls.");
  const cached = runtimeScope.__diagnosticV3BenchmarkModels;
  if (!force && cached && cached.until > Date.now()) return cached;
  const listing = await fetch("https://api.groq.com/openai/v1/models", {
    headers: { Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(8000),
  });
  if (!listing.ok) throw new Error(`Groq model catalog returned HTTP ${listing.status}.`);
  const body = await listing.json() as { data?: GroqModel[] };
  const ids = [...new Set((body.data ?? []).filter((item) => item.active !== false && typeof item.id === "string").map((item) => item.id as string))];
  const probes: ModelProbe[] = PRIMARY_MODELS.map((model_id) => ({ model_id, listed: ids.includes(model_id), structured_output: false }));
  for (const modelId of PRIMARY_MODELS) {
    if (ids.includes(modelId)) Object.assign(probes.find((p) => p.model_id === modelId)!, await probeModel(modelId, key));
  }
  let challenger: string | undefined;
  const independent = ids.filter((id) => !/^openai\//i.test(id));
  const groups = [
    independent.filter((id) => /qwen/i.test(id)),
    independent.filter((id) => /minimax/i.test(id)),
    independent.filter((id) => !/qwen|minimax/i.test(id)),
  ];
  for (const group of groups) {
    const groupProbes = await Promise.all(group.slice(0, 3).map((modelId) => probeModel(modelId, key)));
    probes.push(...groupProbes);
    challenger = groupProbes.find((probe) => probe.structured_output)?.model_id;
    if (challenger) break;
  }
  const result = { until: Date.now() + 5 * 60_000, values: probes, challenger };
  runtimeScope.__diagnosticV3BenchmarkModels = result;
  return result;
}

function sessionFor(answers: Session["answers"], scenario: BenchmarkScenarioId, model: string, repetition: 1 | 2): Session {
  const s = newSession();
  s.origin = "synthetic";
  s.answers = structuredClone(answers);
  s.answer_revision = 1;
  s.stage = "answering";
  s.step = 8;
  s.scoring = score(s.answers);
  s.events = [
    "1:diagnostic_start",
    ...Array.from({ length: 9 }, (_, i) => `1:q${i + 1}_complete`),
    `1:benchmark_run:${scenario}:${model}:rep_${repetition}`,
    `1:benchmark_score:scoring-v1:fit_unknown:pain_${s.scoring.pain}:urgency_${s.scoring.urgency}:readiness_${s.scoring.readiness}:route_${s.scoring.route}:rule_${s.scoring.rule}`,
  ];
  return s;
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" } });
}

export async function POST(request: Request) {
  // This route remains inert in Production and outside the target Preview branch.
  if (!benchmarkEnvironmentAllowed(process.env.VERCEL_ENV, process.env.VERCEL_GIT_COMMIT_REF)) return json({ error: "Not found" }, 404);
  // Vercel Deployment Protection authenticates this temporary internal endpoint.
  // It deliberately has no alternate cookie, token, or public-auth path.
  if (Number(request.headers.get("content-length") ?? 0) > 16000) return json({ error: "Request too large." }, 413);
  try {
    const raw = await request.text();
    if (raw.length > 16000) return json({ error: "Request too large." }, 413);
    const input = JSON.parse(raw) as Record<string, unknown>;
    if (input.action === "models") {
      const result = await verifyModels(true);
      const baseline = result.values.find((p) => p.model_id === PRIMARY_MODELS[0]);
      const larger = result.values.find((p) => p.model_id === PRIMARY_MODELS[1]);
      return json({
        models: result.values,
        ready_to_run: Boolean(baseline?.listed && larger?.listed && result.challenger),
        selected: {
          baseline,
          larger,
          independent_challenger: result.challenger ?? null,
        },
      });
    }
    if (input.action !== "run") return json({ error: "Unknown benchmark action." }, 400);
    const available = await verifyModels();
    const baseline = available.values.find((p) => p.model_id === PRIMARY_MODELS[0]);
    const larger = available.values.find((p) => p.model_id === PRIMARY_MODELS[1]);
    if (!baseline?.listed || !larger?.listed || !available.challenger)
      return json({ error: "The two requested openai model IDs and one independent structured-output challenger are not all available.", models: available.values, independent_challenger: available.challenger ?? null }, 409);
    const eligible = [...PRIMARY_MODELS, available.challenger!];
    delete input.action;
    const run = parseBenchmarkRun(input, [...new Set(eligible)]);
    if (!(await answerSchema.safeParseAsync(run.answers)).success) return json({ error: "Invalid scenario answers." }, 400);
    const scenario = benchmarkScenarios[run.scenario_id];
    const store = getStore();
    const s = sessionFor(run.answers, run.scenario_id, run.model, run.repetition);
    await store.create(s, token());

    // A fixed deterministic First Read gives every Full Read for this case the same prior-analysis input.
    const partialAttempt = await store.beginAnalysis!(s, "partial", "deterministic-v1");
    const partial: Analysis<PartialAnalysis> = {
      session_id: s.id,
      answer_revision: s.answer_revision,
      analysis_version: ANALYSIS_VERSION,
      data: partialFallback(s.answers),
      source: "fallback",
      model: "deterministic-v1",
      fallback_reason: "benchmark_reference_context",
    };
    partial.id = await store.finishAnalysis!(s, partialAttempt, partial);
    s.partial = partial;
    s.stage = "partial";
    await save(store, s, s.record_version);

    const requestedAttemptId = await store.beginAnalysis!(s, "full", run.model);
    const started = Date.now();
    const read = await analyze(s.id, s.answer_revision, s.answers, "full", partial.data, [], {
      modelOverride: run.model,
      suppressTelemetry: true,
    });
    const durationMs = Date.now() - started;
    read.id = await store.finishAnalysis!(s, requestedAttemptId, read);
    s.full = read as typeof s.full;
    s.stage = "full";
    await save(store, s, s.record_version);
    await store.recordViews?.(s, [`${s.answer_revision}:benchmark_run_completed:${run.scenario_id}:${run.model}:rep_${run.repetition}`]);
    return json({
      scenario_id: run.scenario_id,
      expected_diagnosis: scenario.expected,
      model: run.model,
      repetition: run.repetition,
      session_id: s.id,
      answer_revision: s.answer_revision,
      scoring: s.scoring,
      full_read_attempt_analysis_id: requestedAttemptId,
      selected_analysis_id: read.id,
      provider: read.source === "groq" ? "groq" : "deterministic",
      provider_status: read.provider_status ?? null,
      provider_attempts: read.provider_attempts ?? [],
      duration_ms: durationMs,
      selected: read.source === "groq",
      output: read.data,
    });
  } catch (error) {
    if (error instanceof SyntaxError) return json({ error: "Invalid JSON." }, 400);
    const safeValidationMessages = new Set([
      "Model is not verified for this Preview runtime.",
      "Answers do not match the selected gold-standard scenario.",
    ]);
    if (error instanceof Error && safeValidationMessages.has(error.message)) return json({ error: error.message }, 400);
    if (error instanceof Error && error.message === "Preview Groq runtime is not enabled for benchmark calls.")
      return json({ error: error.message }, 503);
    const catalogStatus = error instanceof Error ? error.message.match(/^Groq model catalog returned HTTP (\d+)\.$/) : null;
    if (catalogStatus) return json({ error: "Groq model catalog request failed.", provider_status: Number(catalogStatus[1]) }, 502);
    return json({ error: "Benchmark request or persistence failed." }, 502);
  }
}
