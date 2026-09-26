import { randomBytes } from "node:crypto";

export const DIAGNOSTIC_SESSION_COOKIE = "diagnostic_session";
export const DIAGNOSTIC_SESSION_TTL_MS = 24 * 60 * 60 * 1000;
const SESSION_ID_PATTERN = /^[A-Za-z0-9_-]{43}$/;

export type AnonymousDiagnosticSession = {
  sessionId: string;
  language: "en" | "he";
  currentState: string;
  answers: Record<string, unknown>;
  signals: Record<string, unknown>;
  attribution?: Record<string, unknown>;
  completedTurns: number;
  expiresAt: string;
  insight?: Record<string, unknown> | null;
  diagnosis?: Record<string, unknown> | null;
  intent?: "talk_now" | "later" | "self_serve" | null;
  route?: "TALK_NOW" | "NURTURE" | "NO_FIT" | "INSUFFICIENT_EVIDENCE" | null;
  reasonCodes?: string[];
  leadId?: string | null;
  requestToTalkSubmissionId?: string | null;
};

export function createOpaqueDiagnosticSessionId(): string {
  return randomBytes(32).toString("base64url");
}

export function isValidDiagnosticSessionId(value: unknown): value is string {
  return typeof value === "string" && SESSION_ID_PATTERN.test(value);
}

export function getDiagnosticSessionId(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie") ?? "";
  for (const part of cookieHeader.split(";")) {
    const [name, ...valueParts] = part.trim().split("=");
    if (name === DIAGNOSTIC_SESSION_COOKIE) {
      const value = valueParts.join("=");
      return isValidDiagnosticSessionId(value) ? value : null;
    }
  }
  return null;
}

export function buildDiagnosticSessionCookie(sessionId: string, now = new Date()): string {
  if (!isValidDiagnosticSessionId(sessionId)) throw new Error("Invalid diagnostic session id");
  const maxAge = Math.floor(DIAGNOSTIC_SESSION_TTL_MS / 1000);
  void now;
  return `${DIAGNOSTIC_SESSION_COOKIE}=${sessionId}; Max-Age=${maxAge}; Path=/; HttpOnly; Secure; SameSite=Lax`;
}

export function diagnosticSessionExpiresAt(now = new Date()): Date {
  return new Date(now.getTime() + DIAGNOSTIC_SESSION_TTL_MS);
}

export function isDiagnosticSessionExpired(expiresAt: Date | string, now = new Date()): boolean {
  return new Date(expiresAt).getTime() <= now.getTime();
}

export function omitDiagnosticSessionIdentity(session: AnonymousDiagnosticSession): Omit<AnonymousDiagnosticSession, "sessionId"> {
  const { sessionId: _sessionId, ...safe } = session;
  return safe;
}
