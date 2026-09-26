import { NextResponse } from "next/server";
import { getServerPayload } from "@/lib/payload";
import { buildDiagnosticSessionCookie, getDiagnosticSessionId } from "@/lib/diagnostic-session";
import { createAnonymousDiagnosticSession, findAnonymousDiagnosticSession } from "@/lib/diagnostic-session-store";

export async function GET(request: Request) {
  try {
    const payload = await getServerPayload();
    const id = getDiagnosticSessionId(request);
    const session = id ? await findAnonymousDiagnosticSession(payload as never, id) : null;
    if (session) return NextResponse.json({ session: { currentState: session.currentState, answers: session.answers, signals: session.signals, completedTurns: session.completedTurns } });
    const created = await createAnonymousDiagnosticSession(payload as never, { language: "en" });
    return NextResponse.json({ session: { currentState: created.currentState, answers: {}, signals: {}, completedTurns: 0 } }, { headers: { "Set-Cookie": buildDiagnosticSessionCookie(created.sessionId) } });
  } catch {
    return NextResponse.json({ session: null }, { status: 503 });
  }
}

export async function POST(request: Request) {
  // This route was the writable predecessor of the conversational API. Keep the
  // path recognizable for old clients, but make it impossible to bypass the
  // state machine by submitting arbitrary state, answers, or routing fields.
  void request;
  return NextResponse.json(
    { error: "This endpoint is retired. Use /api/player-trap/conversation." },
    { status: 410, headers: { "Cache-Control": "private, no-store" } },
  );
}
