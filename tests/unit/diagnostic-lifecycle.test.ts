import { describe, expect, it } from "vitest";

import {
  ANONYMOUS_DIAGNOSTIC_TTL_MS,
  DIAGNOSTIC_ANALYTICS_EVENTS,
  IDENTIFIED_OR_FIT_DIAGNOSTIC_TTL_MS,
  canTransitionDiagnosticSession,
  diagnosticSessionExpiresAt,
  diagnosticSessionTtlMs,
  isDiagnosticSessionDeletionEligible,
  isDiagnosticSessionExpired,
  transitionDiagnosticSession,
  type DiagnosticLifecycleSession,
} from "@/lib/diagnostic-funnel/lifecycle";

const now = new Date("2026-09-26T12:00:00.000Z");

function session(overrides: Partial<DiagnosticLifecycleSession> = {}): DiagnosticLifecycleSession {
  return {
    status: "started",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    ...overrides,
  };
}

describe("diagnostic lifecycle", () => {
  it("allows the main funnel and optional continuation branches", () => {
    expect(canTransitionDiagnosticSession("started", "in_progress")).toBe(true);
    expect(canTransitionDiagnosticSession("in_progress", "completed")).toBe(true);
    expect(canTransitionDiagnosticSession("completed", "result_viewed")).toBe(true);
    expect(canTransitionDiagnosticSession("result_viewed", "email_captured")).toBe(true);
    expect(canTransitionDiagnosticSession("result_viewed", "fit_call_started")).toBe(true);
    expect(canTransitionDiagnosticSession("email_captured", "fit_call_started")).toBe(true);
    expect(canTransitionDiagnosticSession("fit_call_started", "fit_call_submitted")).toBe(true);
  });

  it("rejects backwards or skipped transitions", () => {
    expect(canTransitionDiagnosticSession("completed", "in_progress")).toBe(false);
    expect(canTransitionDiagnosticSession("started", "result_viewed")).toBe(false);
    expect(() => transitionDiagnosticSession(session({ status: "completed" }), "in_progress", now)).toThrow("Invalid diagnostic lifecycle transition");
  });

  it("is idempotent for the current state and refreshes activity timestamps immutably", () => {
    const original = session({ status: "result_viewed" });
    const next = transitionDiagnosticSession(original, "result_viewed", new Date("2026-09-27T12:00:00.000Z"));
    expect(next).not.toBe(original);
    expect(original.updatedAt).toBe(now.toISOString());
    expect(next.updatedAt).toBe("2026-09-27T12:00:00.000Z");
  });

  it("uses 30 days for anonymous sessions and 90 days after identification or fit starts", () => {
    const anonymous = session();
    const identified = session({ status: "email_captured", identifiedAt: now.toISOString() });
    expect(diagnosticSessionTtlMs(anonymous)).toBe(ANONYMOUS_DIAGNOSTIC_TTL_MS);
    expect(diagnosticSessionTtlMs(identified)).toBe(IDENTIFIED_OR_FIT_DIAGNOSTIC_TTL_MS);
    expect(diagnosticSessionExpiresAt(anonymous, now).toISOString()).toBe("2026-10-26T12:00:00.000Z");
    expect(diagnosticSessionExpiresAt(identified, now).toISOString()).toBe("2026-12-25T12:00:00.000Z");
  });

  it("marks expiry at the boundary and exposes deletion eligibility", () => {
    const expiresAt = diagnosticSessionExpiresAt(session(), now).toISOString();
    const valid = session({ expiresAt });
    expect(isDiagnosticSessionExpired(valid, new Date("2026-10-26T11:59:59.999Z"))).toBe(false);
    expect(isDiagnosticSessionExpired(valid, new Date("2026-10-26T12:00:00.000Z"))).toBe(true);
    expect(isDiagnosticSessionDeletionEligible(valid, new Date("2026-10-26T12:00:00.000Z"))).toBe(true);
  });

  it("records branch timestamps and extends retention on transition", () => {
    const resultViewed = session({ status: "result_viewed" });
    const identified = transitionDiagnosticSession(resultViewed, "email_captured", now);
    expect(identified.identifiedAt).toBe(now.toISOString());
    expect(identified.expiresAt).toBe("2026-12-25T12:00:00.000Z");
  });

  it("does not include the not-yet-supported booking event", () => {
    expect(DIAGNOSTIC_ANALYTICS_EVENTS).toContain("fit_form_submit");
    expect(DIAGNOSTIC_ANALYTICS_EVENTS).not.toContain("fit_call_booked");
  });
});
