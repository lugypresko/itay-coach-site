import { NextResponse } from "next/server";

export function isPayloadAdministrator(user: unknown): boolean {
  if (!user || typeof user !== "object") return false;
  const candidate = user as { id?: unknown; collection?: unknown; role?: unknown };
  return Boolean(candidate.id) && candidate.collection === "users" && candidate.role === "admin";
}

function denied(status: number) {
  return NextResponse.json({ error: status === 401 ? "Authentication required" : status === 403 ? "Forbidden" : "Admin authentication unavailable" }, {
    status,
    headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}

/** Authorization must precede cache reads, provider calls and session access. */
export async function requireDiagnosticAdmin(request: Request): Promise<NextResponse | null> {
  // An arbitrary cookie/header never authenticates: Payload verifies the session below.
  if (!request.headers.has("cookie") && !request.headers.has("authorization")) return denied(401);
  // Never authenticate Preview against an unverified/Production Payload database.
  if (process.env.VERCEL_ENV === "preview" && !process.env.DIAGNOSTIC_V3_DATABASE_URL) return denied(503);
  if (!process.env.PAYLOAD_SECRET || process.env.PAYLOAD_SECRET === "replace-me-in-production") return denied(503);
  try {
    const [{ getPayload }, { default: config }] = await Promise.all([import("payload"), import("../../../payload.config")]);
    const payload = await getPayload({ config });
    const { user } = await payload.auth({ headers: request.headers });
    if (!user) return denied(401);
    return isPayloadAdministrator(user) ? null : denied(403);
  } catch {
    // No identity, token, DB error or internal verification metadata in responses/logs.
    return denied(503);
  }
}
