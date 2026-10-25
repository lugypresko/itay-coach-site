import { NextResponse } from "next/server";
import { requireDiagnosticAdmin } from "@/payload/access/diagnostic-admin";
import { inspectRecentSessions, inspectSession } from "@/lib/diagnostic-v3/watchdog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (process.env.VERCEL_ENV !== "preview")
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  const denied = await requireDiagnosticAdmin(request);
  if (denied) return denied;

  try {
    const sessionId = new URL(request.url).searchParams.get("session_id");
    const sessions = sessionId
      ? [await inspectSession(sessionId)].filter((session) => session !== null)
      : await inspectRecentSessions();
    return NextResponse.json({ sessions }, {
      headers: {
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch {
    return NextResponse.json({ error: "Watchdog data is temporarily unavailable." }, {
      status: 503,
      headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" },
    });
  }
}
