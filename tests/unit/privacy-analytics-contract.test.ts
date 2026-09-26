import { describe, expect, it, vi } from "vitest";
import { cookie } from "../../src/lib/push-store";
import {
  diagnosticAnalyticsEvents,
  isSafeDiagnosticAnalyticsPayload,
} from "../../src/lib/diagnostic-analytics";
import { buildTargetAnalyticsProperties } from "../../src/lib/target-page-analytics";

describe("diagnostic privacy and analytics boundary", () => {
  it("accepts coarse lifecycle fields and rejects PII, tokens, and raw answers", () => {
    expect(isSafeDiagnosticAnalyticsPayload({ step: "insight", route: "SELF_SERVICE" })).toBe(true);
    expect(isSafeDiagnosticAnalyticsPayload({ email: "qa-canary@example.test" })).toBe(false);
    expect(isSafeDiagnosticAnalyticsPayload({ answer: "QA-CANARY-RAW-ANSWER" })).toBe(false);
    expect(isSafeDiagnosticAnalyticsPayload({ sessionId: "session-canary" })).toBe(false);
  });

  it("defines the lifecycle events used by the contract", () => {
    expect(Object.values(diagnosticAnalyticsEvents)).toEqual([
      "diagnostic_started",
      "diagnostic_pain_confirmed",
      "diagnostic_micro_insight_delivered",
      "diagnostic_contact_earned",
      "diagnostic_intent_selected",
      "diagnostic_route_selected",
      "request_to_talk_submitted",
    ]);
  });

  it("removes referrer query data before building page analytics", () => {
    vi.stubGlobal("document", { referrer: "https://example.test/landing?email=qa-canary%40example.test#answer" });
    expect(buildTargetAnalyticsProperties({ path: "/x", slug: "x" }).referrer).toBe("https://example.test/landing");
  });

  it("uses the required cookie flags outside local mode", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL", "");
    expect(cookie("a".repeat(43))).toContain("HttpOnly; SameSite=Lax; Max-Age=86400; Secure");
    vi.unstubAllEnvs();
  });
});
