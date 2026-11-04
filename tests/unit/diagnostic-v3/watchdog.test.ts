import { describe, expect, it } from "vitest";
import type { Answers } from "@/lib/diagnostic-v3/contracts";
import { score } from "@/lib/diagnostic-v3/scoring";
import { evaluateWatchdogSnapshot, type WatchdogSnapshot } from "@/lib/diagnostic-v3/watchdog";

const answers: Answers = {
  absence: "wait",
  frequency: "several",
  duration: "long",
  impact: ["customer"],
  attempts: ["owner", "decide"],
  desired: "own",
};
const qualificationInput = { role: "vp" as const, org_size: "101_250" as const };
const scored = score(answers, qualificationInput);

function healthy(): WatchdogSnapshot {
  return {
    id: "bd11a612-b398-4aed-8178-3800361abb5e",
    created_at: "2026-10-25T09:00:00.000Z",
    record_version: 8,
    current_answer_revision: 2,
    current_analysis_version: "analysis-v2",
    current_qualification_id: "qual-2",
    latest_answer_revision: 2,
    payload: { step: 9, stage: "full", identified_at: "2026-10-25T09:01:00.000Z", origin: "live" },
    answers,
    analyses: [
      { id: "partial-2", pass: "partial", status: "succeeded", provider: "groq", first_read_analysis_id: null },
      { id: "full-2", pass: "full", status: "succeeded", provider: "groq", first_read_analysis_id: "partial-2" },
    ],
    partial_selected_count: 1,
    full_selected_count: 1,
    pending_since: null,
    lead: {
      identified_answer_revision: 2,
      brief_answer_revision: 2,
      brief_analysis_id: "full-2",
      brief_qualification_id: "qual-2",
      has_brief: true,
    },
    qualification: {
      id: "qual-2",
      qualification_status: "submitted",
      role: qualificationInput.role,
      org_size: qualificationInput.org_size,
      scoring_version: scored.scoring_version,
      fit_status: scored.fit_status,
      fit: scored.fit,
      pain: scored.pain,
      urgency: scored.urgency,
      readiness: scored.readiness,
      total: scored.total,
      route: scored.route,
      routing_rule: scored.rule,
    },
    timeline: [{ event_name: "diagnostic_start", recorded_at: "2026-10-25T09:00:00.000Z", actor_kind: "visitor", outcome: null }],
  };
}

const codes = (row: WatchdogSnapshot) => evaluateWatchdogSnapshot(row).checks.map((check) => check.code);

describe("Diagnostic V3 read-only watchdog", () => {
  it("accepts a healthy normalized session", () => {
    expect(evaluateWatchdogSnapshot(healthy()).status).toBe("OK");
    expect(codes(healthy())).toEqual([]);
  });

  it("fails when the stage requires a First Read but none is selected", () => {
    const row = healthy();
    row.payload.stage = "partial";
    row.analyses = [];
    row.partial_selected_count = 0;
    row.full_selected_count = 0;
    expect(codes(row)).toContain("first_read_missing");
  });

  it("fails when Full Read points to a different First Read", () => {
    const row = healthy();
    row.analyses[1].first_read_analysis_id = "another-first-read";
    expect(codes(row)).toContain("full_read_link");
  });

  it("fails when the session pointer is behind a newer answer revision", () => {
    const row = healthy();
    row.latest_answer_revision = 3;
    expect(codes(row)).toContain("revision_not_latest");
  });

  it("fails on duplicate selected analyses", () => {
    const row = healthy();
    row.partial_selected_count = 2;
    expect(codes(row)).toContain("duplicate_selected");
  });

  it("warns on a pending analysis older than two minutes", () => {
    const row = healthy();
    row.pending_since = new Date(Date.now() - 3 * 60_000);
    expect(evaluateWatchdogSnapshot(row).status).toBe("WARNING");
    expect(codes(row)).toContain("analysis_pending");
  });

  it("warns when an in-progress session has had no funnel activity for two hours", () => {
    const row = healthy();
    row.payload.stage = "answering";
    row.timeline[0].recorded_at = new Date(Date.now() - 3 * 60 * 60_000);
    expect(evaluateWatchdogSnapshot(row).status).toBe("WARNING");
    expect(codes(row)).toContain("session_inactive");
  });

  it("fails when normalized business data leaks into sessions.payload", () => {
    const row = healthy();
    row.payload.answers = answers;
    expect(codes(row)).toContain("payload_leak");
  });

  it("does not report an unstarted legacy entry session as a new payload leak", () => {
    const row = healthy();
    row.current_answer_revision = null;
    row.latest_answer_revision = null;
    row.current_analysis_version = null;
    row.current_qualification_id = null;
    row.record_version = 0;
    row.payload = { stage: "entry", answers: {}, scoring: {} };
    row.answers = null;
    row.analyses = [];
    row.partial_selected_count = 0;
    row.full_selected_count = 0;
    row.lead = null;
    row.qualification = null;
    const result = evaluateWatchdogSnapshot(row);
    expect(result.status).toBe("WARNING");
    expect(codes(row)).toContain("legacy_unstarted");
    expect(codes(row)).not.toContain("payload_leak");
    expect(codes(row)).not.toContain("revision_missing");
  });

  it("fails when stored qualification scoring or route disagrees with the scorer", () => {
    const row = healthy();
    row.qualification!.route = "self_service";
    expect(codes(row)).toContain("scoring_mismatch");
  });
});
