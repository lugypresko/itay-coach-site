import { createHash } from "node:crypto";
import pg from "pg";
import { score } from "./scoring";

type Check = { code: string; severity: "error" | "warning"; message: string };
export type WatchdogSnapshot = {
  id: string;
  created_at: Date | string;
  record_version: number;
  current_answer_revision: number | null;
  current_analysis_version: string | null;
  current_qualification_id: string | null;
  latest_answer_revision: number | null;
  payload: Record<string, unknown>;
  answers: Record<string, unknown> | null;
  analyses: Array<{ id: string; pass: "partial" | "full"; status: string; provider: string; first_read_analysis_id: string | null }>;
  partial_selected_count: number;
  full_selected_count: number;
  pending_since: Date | string | null;
  lead: { identified_answer_revision: number; brief_answer_revision: number | null; brief_analysis_id: string | null; brief_qualification_id: string | null; has_brief: boolean } | null;
  qualification: { id: string; qualification_status: "submitted" | "skipped" | "not_provided"; role: string | null; org_size: string | null; scoring_version: string; fit_status: string; fit: number | null; pain: number; urgency: number; readiness: number; total: number | null; route: string; routing_rule: string } | null;
  timeline: Array<{ event_name: string; recorded_at: Date | string; actor_kind: string; outcome: string | null }>;
};

const allowedPayloadKeys = new Set([
  "step", "stage", "identified_at", "return_hash", "return_expires_at", "mail", "origin",
]);
const poolScope = globalThis as typeof globalThis & { __diagnosticV3WatchdogPool?: InstanceType<typeof pg.Pool> };

function previewPool() {
  if (process.env.VERCEL_ENV !== "preview") throw new Error("preview_only");
  const connectionString = process.env.DIAGNOSTIC_V3_DATABASE_URL;
  if (!connectionString) throw new Error("preview_database_unavailable");
  return (poolScope.__diagnosticV3WatchdogPool ??= new pg.Pool({
    connectionString,
    max: 2,
    connectionTimeoutMillis: 2000,
    statement_timeout: 3000,
  }));
}

function compareScore(q: WatchdogSnapshot["qualification"], answers: Record<string, unknown>) {
  if (!q) return false;
  const qualification = q.qualification_status === "submitted" && q.role && q.org_size
    ? { role: q.role, org_size: q.org_size } as NonNullable<Parameters<typeof score>[1]>
    : undefined;
  const expected = score(answers as Parameters<typeof score>[0], qualification);
  return q.scoring_version === expected.scoring_version &&
    q.fit_status === expected.fit_status && q.fit === expected.fit &&
    q.pain === expected.pain && q.urgency === expected.urgency &&
    q.readiness === expected.readiness && q.total === expected.total &&
    q.route === expected.route && q.routing_rule === expected.rule;
}

export function evaluateWatchdogSnapshot(row: WatchdogSnapshot) {
  const checks: Check[] = [];
  const add = (code: string, severity: Check["severity"], message: string) => checks.push({ code, severity, message });
  const revision = row.current_answer_revision;
  const stage = String(row.payload?.stage ?? "entry");
  const legacyUnstarted = revision === null && stage === "entry" && row.record_version === 0;
  const selected = row.analyses ?? [];
  const partial = selected.find((item) => item.pass === "partial");
  const full = selected.find((item) => item.pass === "full");

  if (legacyUnstarted) add("legacy_unstarted", "warning", "Unstarted legacy session is unsupported by normalized storage; resuming it requires explicit snapshot import.");
  else if (revision === null || !row.answers) add("revision_missing", "error", "Current answer revision is missing.");
  else if (revision !== row.latest_answer_revision) add("revision_not_latest", "error", "Session does not point to its latest answer revision.");

  if (["partial", "full"].includes(stage) && !partial) add("first_read_missing", "error", "Stage requires a selected First Read.");
  if (stage === "full" && !full) add("full_read_missing", "error", "Full stage requires a selected Full Read.");
  if (full && (!partial || full.first_read_analysis_id !== partial.id)) add("full_read_link", "error", "Full Read does not link to the selected First Read.");

  if (row.partial_selected_count > 1 || row.full_selected_count > 1) add("duplicate_selected", "error", "More than one analysis is selected for a pass.");
  for (const analysis of selected) {
    if (analysis.status === "fallback" || analysis.provider === "deterministic")
      add(`fallback_${analysis.pass}`, "warning", `${analysis.pass === "partial" ? "First" : "Full"} Read used deterministic fallback.`);
    else if (analysis.status !== "succeeded" || analysis.provider !== "groq")
      add(`analysis_state_${analysis.pass}`, "error", `Selected ${analysis.pass} analysis has an unexpected status/provider.`);
  }

  const identified = Boolean(row.payload?.identified_at) || stage === "full" || Boolean(row.current_qualification_id);
  if (identified && !row.lead) add("lead_missing", "error", "Identified session has no normalized lead.");
  if (row.lead) {
    const selectedBrief = full?.id ?? partial?.id ?? null;
    if (!row.lead.has_brief || row.lead.brief_answer_revision !== revision || row.lead.brief_analysis_id !== selectedBrief || row.lead.brief_qualification_id !== row.current_qualification_id)
      add("sales_brief_link", "error", "Sales Brief is missing or points to a different revision or selected record.");
  }

  if (row.current_qualification_id && !row.qualification) add("qualification_missing", "error", "Session references a missing qualification snapshot.");
  if (row.qualification && row.qualification.id !== row.current_qualification_id) add("qualification_link", "error", "Qualification snapshot does not match the session pointer.");
  if (row.qualification && row.answers && !compareScore(row.qualification, row.answers)) add("scoring_mismatch", "error", "Persisted scoring or route differs from the deterministic score.");

  if (!legacyUnstarted) {
    const unexpectedKeys = Object.keys(row.payload ?? {}).filter((key) => !allowedPayloadKeys.has(key));
    if (unexpectedKeys.length) add("payload_leak", "error", `sessions.payload contains non-metadata fields: ${unexpectedKeys.join(", ")}.`);
  }

  if (row.pending_since && Date.now() - new Date(row.pending_since).getTime() > 2 * 60_000)
    add("analysis_pending", "warning", "An analysis attempt has remained pending for over two minutes.");

  const lastActivity = row.timeline.at(-1)?.recorded_at;
  if (["answering", "partial"].includes(stage) && lastActivity && Date.now() - new Date(lastActivity).getTime() > 2 * 60 * 60_000)
    add("session_inactive", "warning", "The session has remained in progress with no funnel event for over two hours.");

  const errors = checks.filter((item) => item.severity === "error");
  const warnings = checks.filter((item) => item.severity === "warning");
  return {
    id: row.id,
    createdAt: new Date(row.created_at).toISOString(),
    recordVersion: row.record_version,
    revision,
    stage,
    status: errors.length ? "FAILED" as const : warnings.length ? "WARNING" as const : "OK" as const,
    checks,
    timeline: row.timeline.map((event) => ({
      event: event.event_name,
      at: new Date(event.recorded_at).toISOString(),
      actor: event.actor_kind,
      outcome: event.outcome,
    })),
  };
}

const snapshotSql = `
  SELECT s.id, s.created_at, s.record_version, s.current_answer_revision,
    s.current_analysis_version, s.current_qualification_id, s.payload,
    (SELECT max(rv.answer_revision) FROM diagnostic_v3_revisions rv WHERE rv.session_id=s.id) AS latest_answer_revision,
    r.answers,
    COALESCE(a.selected, '[]'::jsonb) AS analyses,
    COALESCE(a.partial_selected_count, 0)::int AS partial_selected_count,
    COALESCE(a.full_selected_count, 0)::int AS full_selected_count,
    a.pending_since,
    CASE WHEN l.session_id IS NULL THEN NULL ELSE jsonb_build_object(
      'identified_answer_revision', l.identified_answer_revision,
      'brief_answer_revision', l.brief_answer_revision,
      'brief_analysis_id', l.brief_analysis_id,
      'brief_qualification_id', l.brief_qualification_id,
      'has_brief', l.sales_brief IS NOT NULL
    ) END AS lead,
    CASE WHEN q.id IS NULL THEN NULL ELSE jsonb_build_object(
      'id', q.id, 'qualification_status', q.qualification_status, 'role', q.role,
      'org_size', q.org_size, 'scoring_version', q.scoring_version, 'fit_status', q.fit_status,
      'fit', q.fit, 'pain', q.pain, 'urgency', q.urgency, 'readiness', q.readiness,
      'total', q.total, 'route', q.route, 'routing_rule', q.routing_rule
    ) END AS qualification,
    COALESCE(ev.timeline, '[]'::jsonb) AS timeline
  FROM diagnostic_v3_sessions s
  LEFT JOIN diagnostic_v3_revisions r
    ON r.session_id=s.id AND r.answer_revision=s.current_answer_revision
  LEFT JOIN diagnostic_v3_leads l ON l.session_id=s.id
  LEFT JOIN diagnostic_v3_qualifications q
    ON q.session_id=s.id AND q.answer_revision=s.current_answer_revision AND q.id=s.current_qualification_id
  LEFT JOIN LATERAL (
    SELECT jsonb_agg(jsonb_build_object('id', x.id, 'pass', x.pass, 'status', x.status,
      'provider', x.provider, 'first_read_analysis_id', x.first_read_analysis_id))
      FILTER (WHERE x.is_selected) AS selected,
      count(*) FILTER (WHERE x.pass='partial' AND x.is_selected) AS partial_selected_count,
      count(*) FILTER (WHERE x.pass='full' AND x.is_selected) AS full_selected_count,
      min(x.started_at) FILTER (WHERE x.status='pending') AS pending_since
    FROM diagnostic_v3_analyses x
    WHERE x.session_id=s.id AND x.answer_revision=s.current_answer_revision
      AND x.analysis_version=s.current_analysis_version
  ) a ON true
  LEFT JOIN LATERAL (
    SELECT jsonb_agg(jsonb_build_object('event_name', t.event_name, 'recorded_at', t.recorded_at,
      'actor_kind', t.actor_kind, 'outcome', t.outcome) ORDER BY t.recorded_at, t.id) AS timeline
    FROM (SELECT id, event_name, COALESCE(occurred_at,recorded_at) AS recorded_at, actor_kind, outcome
      FROM diagnostic_v3_events WHERE session_id=s.id ORDER BY COALESCE(occurred_at,recorded_at) DESC, id DESC LIMIT 20) t
  ) ev ON true
`;

export async function inspectRecentSessions(limit = 25) {
  const pool = previewPool();
  const result = await pool.query(`${snapshotSql} WHERE s.expires_at > now() ORDER BY s.created_at DESC LIMIT $1`, [limit]);
  return result.rows.map((row) => evaluateWatchdogSnapshot(row as unknown as WatchdogSnapshot));
}

export async function inspectSession(sessionId: string) {
  const pool = previewPool();
  const result = await pool.query(`${snapshotSql} WHERE s.id=$1 AND s.expires_at > now() LIMIT 1`, [sessionId]);
  return result.rows[0] ? evaluateWatchdogSnapshot(result.rows[0] as unknown as WatchdogSnapshot) : null;
}

export async function runTransitionCheck(sessionId: string) {
  if (process.env.VERCEL_ENV !== "preview") return;
  try {
    const result = await inspectSession(sessionId);
    if (!result) return;
    if (result.status !== "OK") {
      const digest = createHash("sha256").update(sessionId).digest("hex").slice(0, 10);
      console.warn("diagnostic-v3-watchdog", { session: digest, status: result.status, checks: result.checks.map(({ code }) => code) });
    }
  } catch {
    console.warn("diagnostic-v3-watchdog-unavailable");
  }
}
