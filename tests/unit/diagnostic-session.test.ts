import { describe, expect, it } from "vitest";

import {
  buildDiagnosticSessionCookie,
  createOpaqueDiagnosticSessionId,
  diagnosticSessionExpiresAt,
  getDiagnosticSessionId,
  isDiagnosticSessionExpired,
  isValidDiagnosticSessionId,
  omitDiagnosticSessionIdentity,
} from "@/lib/diagnostic-session";

describe("anonymous diagnostic sessions", () => {
  it("creates an opaque random identifier and a hardened 24-hour cookie", () => {
    const first = createOpaqueDiagnosticSessionId();
    const second = createOpaqueDiagnosticSessionId();
    expect(isValidDiagnosticSessionId(first)).toBe(true);
    expect(first).not.toBe(second);
    const cookie = buildDiagnosticSessionCookie(first);
    expect(cookie).toContain("Max-Age=86400");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("Secure");
    expect(cookie).toContain("SameSite=Lax");
  });

  it("reads only a valid cookie value and never accepts a URL identity", () => {
    const id = createOpaqueDiagnosticSessionId();
    expect(getDiagnosticSessionId(new Request("https://example.com", { headers: { cookie: `foo=1; diagnostic_session=${id}` } }))).toBe(id);
    expect(getDiagnosticSessionId(new Request(`https://example.com?session=${id}`))).toBeNull();
    expect(getDiagnosticSessionId(new Request("https://example.com", { headers: { cookie: "diagnostic_session=bad" } }))).toBeNull();
  });

  it("enforces the 24-hour expiry boundary server-side", () => {
    const now = new Date("2026-09-13T12:00:00.000Z");
    const expires = diagnosticSessionExpiresAt(now);
    expect(isDiagnosticSessionExpired(expires, new Date("2026-09-14T11:59:59.999Z"))).toBe(false);
    expect(isDiagnosticSessionExpired(expires, new Date("2026-09-14T12:00:00.000Z"))).toBe(true);
  });

  it("can safely return session state without its identifier", () => {
    const safe = omitDiagnosticSessionIdentity({
      sessionId: createOpaqueDiagnosticSessionId(), language: "en", currentState: "PAIN_RAW",
      answers: { incident: "x" }, signals: {}, completedTurns: 1, expiresAt: new Date().toISOString(),
    });
    expect(safe).not.toHaveProperty("sessionId");
    expect(safe.answers).toEqual({ incident: "x" });
  });
});
