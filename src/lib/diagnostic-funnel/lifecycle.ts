export const ANONYMOUS_DIAGNOSTIC_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const IDENTIFIED_OR_FIT_DIAGNOSTIC_TTL_MS = 90 * 24 * 60 * 60 * 1000;

export const DIAGNOSTIC_LIFECYCLE_STATUSES = [
  "started",
  "in_progress",
  "completed",
  "result_viewed",
  "email_captured",
  "fit_call_started",
  "fit_call_submitted",
] as const;

export type DiagnosticLifecycleStatus = (typeof DIAGNOSTIC_LIFECYCLE_STATUSES)[number];

/** The events currently approved for the diagnostic funnel. Booking is not implemented yet. */
export const DIAGNOSTIC_ANALYTICS_EVENTS = [
  "homepage_view",
  "diagnostic_start",
  "diagnostic_q1_complete",
  "diagnostic_q2_complete",
  "diagnostic_q3_complete",
  "diagnostic_q4_complete",
  "diagnostic_complete",
  "diagnostic_result_view",
  "diagnostic_email_click",
  "diagnostic_email_submit",
  "diagnostic_fit_click",
  "fit_form_start",
  "fit_form_submit",
] as const;

export type DiagnosticAnalyticsEvent = (typeof DIAGNOSTIC_ANALYTICS_EVENTS)[number];

export type DiagnosticLifecycleSession = {
  status: DiagnosticLifecycleStatus;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  identifiedAt?: string | null;
  fitCallStartedAt?: string | null;
};

const NEXT_STATUSES: Record<DiagnosticLifecycleStatus, readonly DiagnosticLifecycleStatus[]> = {
  started: ["in_progress"],
  in_progress: ["completed"],
  completed: ["result_viewed"],
  result_viewed: ["email_captured", "fit_call_started"],
  email_captured: ["fit_call_started"],
  fit_call_started: ["fit_call_submitted"],
  fit_call_submitted: [],
};

function asTimestamp(value: string, field: string): number {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) throw new Error(`Invalid ${field}`);
  return timestamp;
}

function isIdentifiedOrFit(session: Pick<DiagnosticLifecycleSession, "status" | "identifiedAt" | "fitCallStartedAt">): boolean {
  return Boolean(
    session.identifiedAt
    || session.fitCallStartedAt
    || session.status === "email_captured"
    || session.status === "fit_call_started"
    || session.status === "fit_call_submitted",
  );
}

export function canTransitionDiagnosticSession(
  from: DiagnosticLifecycleStatus,
  to: DiagnosticLifecycleStatus,
): boolean {
  return from === to || NEXT_STATUSES[from].includes(to);
}

export function transitionDiagnosticSession(
  session: DiagnosticLifecycleSession,
  nextStatus: DiagnosticLifecycleStatus,
  now = new Date(),
): DiagnosticLifecycleSession {
  if (!canTransitionDiagnosticSession(session.status, nextStatus)) {
    throw new Error(`Invalid diagnostic lifecycle transition: ${session.status} -> ${nextStatus}`);
  }

  const nowIso = now.toISOString();
  const nextSession: DiagnosticLifecycleSession = {
    ...session,
    status: nextStatus,
    updatedAt: nowIso,
  };

  if (nextStatus === "email_captured" && !nextSession.identifiedAt) nextSession.identifiedAt = nowIso;
  if (nextStatus === "fit_call_started" && !nextSession.fitCallStartedAt) nextSession.fitCallStartedAt = nowIso;
  nextSession.expiresAt = diagnosticSessionExpiresAt(nextSession, now).toISOString();
  return nextSession;
}

export function diagnosticSessionTtlMs(
  session: Pick<DiagnosticLifecycleSession, "status" | "identifiedAt" | "fitCallStartedAt">,
): number {
  return isIdentifiedOrFit(session)
    ? IDENTIFIED_OR_FIT_DIAGNOSTIC_TTL_MS
    : ANONYMOUS_DIAGNOSTIC_TTL_MS;
}

export function diagnosticSessionExpiresAt(
  session: Pick<DiagnosticLifecycleSession, "status" | "updatedAt" | "identifiedAt" | "fitCallStartedAt">,
  now = new Date(),
): Date {
  const activityAt = session.updatedAt || now.toISOString();
  return new Date(asTimestamp(activityAt, "updatedAt") + diagnosticSessionTtlMs(session));
}

export function isDiagnosticSessionExpired(session: DiagnosticLifecycleSession, now = new Date()): boolean {
  const expiresAt = session.expiresAt
    ? asTimestamp(session.expiresAt, "expiresAt")
    : diagnosticSessionExpiresAt(session, now).getTime();
  return expiresAt <= now.getTime();
}

export function isDiagnosticSessionDeletionEligible(session: DiagnosticLifecycleSession, now = new Date()): boolean {
  return isDiagnosticSessionExpired(session, now);
}
