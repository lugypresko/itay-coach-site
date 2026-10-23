import { NextResponse } from "next/server";
import { requireDiagnosticAdmin } from "@/payload/access/diagnostic-admin";
import { analyze } from "@/lib/diagnostic-v3/analysis";
import type {
  Answers,
  Analysis,
  PartialAnalysis,
  FullAnalysis,
} from "@/lib/diagnostic-v3/contracts";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;
// Fixed fictional data only. This endpoint cannot analyze arbitrary supplied text.
const fictional: Answers = {
  situation: "decision",
  absence: "wait",
  owner: "manager",
  authority: "checks",
  duration: "long",
  frequency: "several",
  attempts: ["owner", "decide"],
  impact: ["customer"],
  desired: "own",
  context:
    "Two teams are waiting for a release decision. The assigned manager asks for approval each time the trade-off changes.",
};
function summary(a: Analysis<PartialAnalysis | FullAnalysis>) {
  return {
    source: a.source,
    model: a.model,
    provider_status: a.provider_status ?? null,
    duration_ms: a.duration_ms ?? null,
    fallback_reason: a.fallback_reason ?? null,
  };
}
async function probe() {
  const partial = await analyze(
    "fictional-preview-check",
    1,
    fictional,
    "partial",
  );
  const full = await analyze(
    "fictional-preview-check",
    1,
    fictional,
    "full",
    partial.data,
  );
  return {
    groq_verified: partial.source === "groq" && full.source === "groq",
    configuration: {
      key_present: Boolean(process.env.GROQ_API_KEY),
      ai_enabled: process.env.DIAGNOSTIC_V3_AI_ENABLED === "true",
      zdr_attested: process.env.GROQ_ZDR_VERIFIED === "true",
    },
    partial: summary(partial),
    full: summary(full),
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    checked_at: new Date().toISOString(),
    note: "Synthetic provider check only; does not verify Groq account Data Controls or real-user browser flow.",
  };
}
const scope = globalThis as typeof globalThis & {
  __v3SyntheticCheck?: { until: number; pending: ReturnType<typeof probe> };
};
export async function GET(request: Request) {
  // Never enable this diagnostic route in Production, even with V3 enabled.
  if (process.env.VERCEL_ENV !== "preview")
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  const denied = await requireDiagnosticAdmin(request);
  if (denied) return denied;
  // Coalesce callers and cache for 10 minutes to bound provider spend.
  if (!scope.__v3SyntheticCheck || scope.__v3SyntheticCheck.until < Date.now())
    scope.__v3SyntheticCheck = { until: Date.now() + 600000, pending: probe() };
  const result = await scope.__v3SyntheticCheck.pending;
  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
