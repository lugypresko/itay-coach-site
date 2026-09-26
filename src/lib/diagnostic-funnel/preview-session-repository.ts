import { randomUUID } from "node:crypto";

import {
  diagnosticSessionExpiresAt,
  isDiagnosticSessionDeletionEligible,
  transitionDiagnosticSession,
  type DiagnosticLifecycleSession,
} from "./lifecycle";
import type { DiagnosticSession } from "./types";
import type {
  DiagnosticSessionCreateInput,
  DiagnosticSessionRepository,
  DiagnosticSessionUpdateInput,
} from "./session-repository";

export type PreviewSessionLogger = (event: string, metadata: {
  sessionId: string;
  status?: DiagnosticSession["status"];
}) => void;

export type PreviewSessionRepositoryOptions = {
  logger?: PreviewSessionLogger;
};

function clone<T>(value: T): T {
  return structuredClone(value);
}

function lifecycleSession(session: DiagnosticSession, now: Date): DiagnosticLifecycleSession {
  const lifecycle: DiagnosticLifecycleSession = {
    status: session.status,
    createdAt: session.timestamps.createdAt,
    updatedAt: session.timestamps.updatedAt,
    identifiedAt: session.timestamps.emailCapturedAt ?? null,
    fitCallStartedAt: session.timestamps.fitCallStartedAt ?? null,
  };
  lifecycle.expiresAt = diagnosticSessionExpiresAt(lifecycle, now).toISOString();
  return lifecycle;
}

function branchTimestamp(status: DiagnosticSession["status"], now: string): Partial<DiagnosticSession["timestamps"]> {
  if (status === "completed") return { completedAt: now };
  if (status === "result_viewed") return { resultViewedAt: now };
  if (status === "email_captured") return { emailCapturedAt: now };
  if (status === "fit_call_started") return { fitCallStartedAt: now };
  if (status === "fit_call_submitted") return { fitCallSubmittedAt: now };
  return {};
}

export function createPreviewSessionRepository(options: PreviewSessionRepositoryOptions = {}): DiagnosticSessionRepository {
  const sessions = new Map<string, DiagnosticSession>();
  const logger = options.logger ?? (() => undefined);

  return {
    async create(input: DiagnosticSessionCreateInput, now = new Date()) {
      const timestamp = now.toISOString();
      const session: DiagnosticSession = {
        id: randomUUID(),
        source: clone(input.source),
        status: input.status,
        answers: clone(input.answers),
        result: input.result && clone(input.result),
        lead: input.lead && clone(input.lead),
        fit: input.fit && clone(input.fit),
        timestamps: { createdAt: timestamp, updatedAt: timestamp, ...branchTimestamp(input.status, timestamp) },
      };
      sessions.set(session.id, clone(session));
      logger("diagnostic_session_created", { sessionId: session.id, status: session.status });
      return clone(session);
    },

    async read(id) {
      const session = sessions.get(id);
      return session ? clone(session) : null;
    },

    async update(id, input: DiagnosticSessionUpdateInput, now = new Date()) {
      const current = sessions.get(id);
      if (!current) throw new Error("Diagnostic session not found");
      const timestamp = now.toISOString();
      let nextTimestamps = { ...current.timestamps, updatedAt: timestamp };
      if (input.status && input.status !== current.status) {
        const transitioned = transitionDiagnosticSession(lifecycleSession(current, now), input.status, now);
        nextTimestamps = { ...nextTimestamps, ...branchTimestamp(input.status, transitioned.updatedAt) };
      }
      const next: DiagnosticSession = {
        ...current,
        ...clone(input),
        id: current.id,
        timestamps: nextTimestamps,
        source: input.source ? clone(input.source) : current.source,
        answers: input.answers ? clone(input.answers) : current.answers,
      };
      sessions.set(id, clone(next));
      logger("diagnostic_session_updated", { sessionId: id, status: next.status });
      return clone(next);
    },

    async isDeletionEligible(id, now = new Date()) {
      const session = sessions.get(id);
      return session ? isDiagnosticSessionDeletionEligible(lifecycleSession(session, now), now) : false;
    },

    async delete(id, now = new Date()) {
      if (!await this.isDeletionEligible(id, now)) return false;
      const deleted = sessions.delete(id);
      if (deleted) logger("diagnostic_session_deleted", { sessionId: id });
      return deleted;
    },
  };
}
