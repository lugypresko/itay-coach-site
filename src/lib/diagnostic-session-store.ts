import {
  createOpaqueDiagnosticSessionId,
  diagnosticSessionExpiresAt,
  isDiagnosticSessionExpired,
  type AnonymousDiagnosticSession,
} from "./diagnostic-session";

type PayloadSessionReader = {
  find: (args: Record<string, unknown>) => Promise<{ docs: Array<Record<string, unknown>> }>;
  create: (args: Record<string, unknown>) => Promise<Record<string, unknown>>;
  update: (args: Record<string, unknown>) => Promise<Record<string, unknown>>;
};

function fromRecord(record: Record<string, unknown>): AnonymousDiagnosticSession {
  return {
    sessionId: String(record.sessionId),
    language: record.language === "he" ? "he" : "en",
    currentState: String(record.currentState ?? "ROLE"),
    answers: (record.answers && typeof record.answers === "object" ? record.answers : {}) as Record<string, unknown>,
    signals: (record.signals && typeof record.signals === "object" ? record.signals : {}) as Record<string, unknown>,
    attribution: (record.attribution && typeof record.attribution === "object" ? record.attribution : {}) as Record<string, unknown>,
    completedTurns: Number(record.completedTurns ?? 0),
    expiresAt: new Date(String(record.expiresAt)).toISOString(),
    insight: record.insight && typeof record.insight === "object" ? record.insight as Record<string, unknown> : null,
    diagnosis: record.diagnosis && typeof record.diagnosis === "object" ? record.diagnosis as Record<string, unknown> : null,
    intent: typeof record.intent === "string" ? record.intent as AnonymousDiagnosticSession["intent"] : null,
    route: typeof record.route === "string" ? record.route as AnonymousDiagnosticSession["route"] : null,
    reasonCodes: Array.isArray(record.reasonCodes) ? record.reasonCodes.filter((item): item is string => typeof item === "string") : [],
    leadId: typeof record.leadId === "string" ? record.leadId : null,
    requestToTalkSubmissionId: typeof record.requestToTalkSubmissionId === "string" ? record.requestToTalkSubmissionId : null,
  };
}

export async function findAnonymousDiagnosticSession(payload: PayloadSessionReader, sessionId: string, now = new Date()): Promise<AnonymousDiagnosticSession | null> {
  const result = await payload.find({
    collection: "diagnostic-sessions",
    limit: 1,
    overrideAccess: true,
    where: { sessionId: { equals: sessionId } },
  });
  const record = result.docs[0];
  if (!record) return null;
  const session = fromRecord(record);
  return isDiagnosticSessionExpired(session.expiresAt, now) ? null : session;
}

export async function createAnonymousDiagnosticSession(
  payload: PayloadSessionReader,
  input: Pick<AnonymousDiagnosticSession, "language"> & Partial<Pick<AnonymousDiagnosticSession, "attribution">>,
  now = new Date(),
): Promise<AnonymousDiagnosticSession> {
  const session = {
    sessionId: createOpaqueDiagnosticSessionId(),
    language: input.language,
    currentState: "ROLE",
    answers: {},
    signals: {},
    attribution: input.attribution ?? {},
    completedTurns: 0,
    expiresAt: diagnosticSessionExpiresAt(now).toISOString(),
  } satisfies AnonymousDiagnosticSession;
  await payload.create({ collection: "diagnostic-sessions", data: session, overrideAccess: true });
  return session;
}

export async function saveAnonymousDiagnosticSession(payload: PayloadSessionReader, session: AnonymousDiagnosticSession): Promise<void> {
  const result = await payload.find({
    collection: "diagnostic-sessions",
    limit: 1,
    overrideAccess: true,
    where: { sessionId: { equals: session.sessionId } },
  });
  const id = result.docs[0]?.id;
  if (id === undefined) throw new Error("Diagnostic session not found");
  await payload.update({
    collection: "diagnostic-sessions",
    id,
    data: {
      language: session.language,
      currentState: session.currentState,
      answers: session.answers,
      signals: session.signals,
      attribution: session.attribution ?? {},
      completedTurns: session.completedTurns,
      expiresAt: session.expiresAt,
      insight: session.insight ?? null,
      diagnosis: session.diagnosis ?? null,
      intent: session.intent ?? null,
      route: session.route ?? null,
      reasonCodes: session.reasonCodes ?? [],
      leadId: session.leadId ?? null,
      requestToTalkSubmissionId: session.requestToTalkSubmissionId ?? null,
    },
    overrideAccess: true,
  });
}
