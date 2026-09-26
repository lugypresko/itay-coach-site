/**
 * Privacy boundary for diagnostic lifecycle telemetry.
 *
 * This module intentionally accepts only coarse state. Raw answers, contact
 * fields, cookies, operation IDs and session IDs must remain server-side.
 */
export const diagnosticAnalyticsEvents = {
  started: "diagnostic_started",
  painConfirmed: "diagnostic_pain_confirmed",
  insightDelivered: "diagnostic_micro_insight_delivered",
  contactEarned: "diagnostic_contact_earned",
  intentSelected: "diagnostic_intent_selected",
  routeSelected: "diagnostic_route_selected",
  requestSubmitted: "request_to_talk_submitted",
} as const;

export const diagnosticAnalyticsPayloadKeys = ["step", "route", "intent", "result"] as const;
export type DiagnosticAnalyticsPayload = Partial<Record<(typeof diagnosticAnalyticsPayloadKeys)[number], string>>;

export function isSafeDiagnosticAnalyticsPayload(payload: Record<string, unknown>): payload is DiagnosticAnalyticsPayload {
  return Object.keys(payload).every((key) =>
    (diagnosticAnalyticsPayloadKeys as readonly string[]).includes(key) &&
    typeof payload[key] === "string" &&
    (payload[key] as string).length <= 80,
  );
}
