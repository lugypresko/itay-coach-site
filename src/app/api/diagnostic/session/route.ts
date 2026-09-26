import { NextResponse } from "next/server";

import { getDiagnosticSessionRepository } from "@/lib/diagnostic-funnel/repository";
import type { DiagnosticSourceMetadata } from "@/lib/diagnostic-funnel/types";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function source(value: unknown): DiagnosticSourceMetadata | null {
  if (value === undefined) return {};
  if (!isObject(value)) return null;
  const allowed = ["referrer", "utmSource", "utmMedium", "utmCampaign", "entryPoint"] as const;
  if (allowed.some((key) => value[key] !== undefined && typeof value[key] !== "string")) return null;
  return Object.fromEntries(allowed.filter((key) => value[key] !== undefined).map((key) => [key, value[key]]));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body || !isObject(body)) return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  const sessionSource = source(body.source);
  if (!sessionSource) return NextResponse.json({ error: "Invalid source metadata." }, { status: 400 });

  const session = await getDiagnosticSessionRepository().create({ source: sessionSource, status: "started", answers: {} });
  const response = NextResponse.json({ session }, { status: 201, headers: { "Cache-Control": "no-store" } });
  response.cookies.set("diagnostic_session_id", session.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });
  return response;
}
