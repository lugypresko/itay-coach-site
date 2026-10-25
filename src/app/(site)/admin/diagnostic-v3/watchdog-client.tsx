"use client";

import { useCallback, useEffect, useState } from "react";

type SessionReport = {
  id: string;
  createdAt: string;
  recordVersion: number;
  revision: number | null;
  stage: string;
  status: "OK" | "WARNING" | "FAILED";
  checks: Array<{ code: string; severity: "error" | "warning"; message: string }>;
  timeline: Array<{ event: string; at: string; actor: string; outcome: string | null }>;
};

export default function DiagnosticV3WatchdogPage() {
  const [sessions, setSessions] = useState<SessionReport[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState("");
  const [copyError, setCopyError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/diagnostic/v3/watchdog", { cache: "no-store" });
      if (response.status === 401 || response.status === 403) throw new Error("Sign in as a Payload administrator to view Diagnostic V3 sessions.");
      if (!response.ok) throw new Error("Watchdog data is temporarily unavailable.");
      const body = await response.json() as { sessions: SessionReport[] };
      setSessions(body.sessions);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Watchdog data is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  async function copyReport(session: SessionReport) {
    const report = {
      session_id: session.id,
      status: session.status,
      stage: session.stage,
      revision: session.revision,
      record_version: session.recordVersion,
      checks: session.checks,
      timeline: session.timeline,
    };
    setCopyError("");
    try {
      await navigator.clipboard.writeText(JSON.stringify(report, null, 2));
      setCopied(session.id);
      window.setTimeout(() => setCopied(""), 1500);
    } catch {
      setCopyError("Clipboard access is unavailable in this browser.");
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-12 text-slate-900">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Internal · Preview</p>
          <h1 className="mt-2 text-3xl font-semibold">Diagnostic V3 Watchdog</h1>
          <p className="mt-2 text-sm text-slate-600">Read-only consistency checks for recent sessions.</p>
        </div>
        <button className="rounded border border-slate-300 px-4 py-2 text-sm" onClick={() => void refresh()} disabled={loading}>
          {loading ? "Loading…" : "Refresh"}
        </button>
      </div>

      {error && <p role="alert" className="mb-6 rounded bg-amber-50 p-4 text-amber-900">{error}</p>}
      {copyError && <p role="status" className="mb-6 rounded bg-amber-50 p-4 text-amber-900">{copyError}</p>}
      {!error && !loading && sessions.length === 0 && <p className="rounded border border-slate-200 p-6 text-slate-600">No active sessions found.</p>}

      <div className="space-y-4">
        {sessions.map((session) => (
          <section key={session.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`rounded px-2 py-1 text-xs font-bold ${session.status === "OK" ? "bg-emerald-100 text-emerald-800" : session.status === "WARNING" ? "bg-amber-100 text-amber-900" : "bg-red-100 text-red-800"}`}>{session.status}</span>
                  <span className="font-mono text-sm">{session.id}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{session.stage} · revision {session.revision ?? "missing"} · updated record {session.recordVersion} · {new Date(session.createdAt).toLocaleString()}</p>
              </div>
              <button className="rounded border border-slate-300 px-3 py-2 text-sm" onClick={() => void copyReport(session)}>
                {copied === session.id ? "Copied" : "Copy debug report"}
              </button>
            </div>

            {session.checks.length > 0 && (
              <div className="mt-4">
                <h2 className="text-sm font-semibold">Checks</h2>
                <ul className="mt-2 space-y-1 text-sm">
                  {session.checks.map((check, index) => <li key={`${check.code}-${index}`} className={check.severity === "error" ? "text-red-800" : "text-amber-900"}><code>{check.code}</code>: {check.message}</li>)}
                </ul>
              </div>
            )}

            <div className="mt-4 border-t border-slate-100 pt-3">
              <h2 className="text-sm font-semibold">Timeline</h2>
              {session.timeline.length ? <ol className="mt-2 space-y-1 text-sm text-slate-700">
                {session.timeline.map((event, index) => <li key={`${event.event}-${event.at}-${index}`}><time className="font-mono text-xs text-slate-500">{new Date(event.at).toLocaleString()}</time> · {event.event} · {event.actor}{event.outcome ? ` · ${event.outcome}` : ""}</li>)}
              </ol> : <p className="mt-2 text-sm text-slate-500">No events recorded.</p>}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
