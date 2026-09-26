import { NextResponse } from "next/server";

import { getDiagnosticSessionRepository } from "@/lib/diagnostic-funnel/repository";
import type { DiagnosticResult } from "@/lib/diagnostic-funnel/types";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("sessionId");
  if (!sessionId) return NextResponse.json({ error: "sessionId is required." }, { status: 400 });
  const session = await getDiagnosticSessionRepository().read(sessionId);
  if (!session) return NextResponse.json({ error: "Diagnostic session not found." }, { status: 404 });
  if (!session.result) return NextResponse.json({ error: "Diagnostic result not found." }, { status: 404 });
  return NextResponse.json({ sessionId: session.id, result: session.result }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body || !isObject(body) || typeof body.sessionId !== "string" || !body.sessionId) {
    return NextResponse.json({ error: "sessionId is required." }, { status: 400 });
  }
  if (!isObject(body.result)) return NextResponse.json({ error: "result is required." }, { status: 400 });

  const repo = getDiagnosticSessionRepository();
  const current = await repo.read(body.sessionId);
  if (!current) return NextResponse.json({ error: "Diagnostic session not found." }, { status: 404 });

  try {
    let session = current;
    if (session.status === "started") session = await repo.update(session.id, { status: "in_progress" });
    session = await repo.update(session.id, { status: "completed", result: body.result as unknown as DiagnosticResult });
    return NextResponse.json({ session }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save result." }, { status: 409 });
  }
}
