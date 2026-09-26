import { NextResponse } from "next/server";

import { getDiagnosticSessionRepository } from "@/lib/diagnostic-funnel/repository";
import type { DiagnosticAnswers } from "@/lib/diagnostic-funnel/types";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body || !isObject(body) || typeof body.sessionId !== "string" || !body.sessionId) {
    return NextResponse.json({ error: "sessionId is required." }, { status: 400 });
  }
  if (!isObject(body.answers)) return NextResponse.json({ error: "answers is required." }, { status: 400 });

  const repo = getDiagnosticSessionRepository();
  const current = await repo.read(body.sessionId);
  if (!current) return NextResponse.json({ error: "Diagnostic session not found." }, { status: 404 });

  try {
    const answers = { ...current.answers, ...body.answers } as DiagnosticAnswers;
    const session = await repo.update(current.id, { status: "in_progress", answers });
    return NextResponse.json({ session }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save answer." }, { status: 409 });
  }
}
