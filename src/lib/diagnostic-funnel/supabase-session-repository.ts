import { randomUUID } from "node:crypto";

import {
  diagnosticSessionExpiresAt,
  isDiagnosticSessionDeletionEligible,
  transitionDiagnosticSession,
  type DiagnosticLifecycleSession,
} from "./lifecycle";
import type {
  DiagnosticSessionCreateInput,
  DiagnosticSessionRepository,
  DiagnosticSessionUpdateInput,
} from "./session-repository";
import type { DiagnosticSession } from "./types";

type StoredRow = { funnel_session: DiagnosticSession; expires_at: string };

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

function config() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY are required in production.");
  return { url: url.replace(/\/$/, ""), key };
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { url, key } = config();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase diagnostic session request failed (${response.status}): ${detail.slice(0, 300)}`);
  }
  return response.json() as Promise<T>;
}

function toRow(session: DiagnosticSession, now: Date): Record<string, unknown> {
  const expiresAt = diagnosticSessionExpiresAt(lifecycleSession(session, now), now).toISOString();
  return {
    session_id: session.id,
    language: "en",
    current_state: session.status,
    answers: session.answers,
    signals: {},
    attribution: session.source,
    completed_turns: Object.keys(session.answers).length,
    expires_at: expiresAt,
    funnel_session: session,
  };
}

function rowSession(rows: StoredRow[]): DiagnosticSession | null {
  const session = rows[0]?.funnel_session;
  return session && typeof session.id === "string" ? clone(session) : null;
}

export function createSupabaseDiagnosticSessionRepository(): DiagnosticSessionRepository {
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
      await request<StoredRow[]>("diagnostic_sessions", { method: "POST", body: JSON.stringify(toRow(session, now)) });
      return clone(session);
    },

    async read(id, now = new Date()) {
      const rows = await request<StoredRow[]>(
        `diagnostic_sessions?session_id=eq.${encodeURIComponent(id)}&select=funnel_session,expires_at&limit=1`,
        { method: "GET" },
      );
      const session = rowSession(rows);
      if (!session || isDiagnosticSessionDeletionEligible(lifecycleSession(session, now), now)) return null;
      return session;
    },

    async update(id, input: DiagnosticSessionUpdateInput, now = new Date()) {
      const current = await this.read(id, now);
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
      await request<StoredRow[]>(
        `diagnostic_sessions?session_id=eq.${encodeURIComponent(id)}`,
        { method: "PATCH", body: JSON.stringify(toRow(next, now)) },
      );
      return clone(next);
    },

    async isDeletionEligible(id, now = new Date()) {
      const rows = await request<StoredRow[]>(
        `diagnostic_sessions?session_id=eq.${encodeURIComponent(id)}&select=funnel_session,expires_at&limit=1`,
        { method: "GET" },
      );
      const session = rowSession(rows);
      return session ? isDiagnosticSessionDeletionEligible(lifecycleSession(session, now), now) : false;
    },

    async delete(id, now = new Date()) {
      if (!await this.isDeletionEligible(id, now)) return false;
      const { url, key } = config();
      const response = await fetch(`${url}/rest/v1/diagnostic_sessions?session_id=eq.${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`Supabase diagnostic session delete failed (${response.status})`);
      return response.status === 204 || response.status === 200;
    },
  };
}
