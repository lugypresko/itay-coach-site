import { NextResponse } from "next/server";
import { getServerPayload } from "@/lib/payload";
import { getDiagnosticSessionId } from "@/lib/diagnostic-session";
import { findAnonymousDiagnosticSession, saveAnonymousDiagnosticSession } from "@/lib/diagnostic-session-store";
import type { AnonymousDiagnosticSession } from "@/lib/diagnostic-session";
import { buildDiagnosis, buildMicroInsight, routeDiagnosticWithReasons } from "@/lib/diagnostic-core";

const TURN_STATES = ["ROLE", "PAIN_RAW", "PATTERN_HYPOTHESES", "PAIN_CONFIRMED", "WHY_NOW"] as const;
const ACTIONS = ["submit_turn", "accept_insight", "reject_insight", "skip_contact", "view_diagnosis", "select_intent"] as const;
type Action = typeof ACTIONS[number];

function view(session: AnonymousDiagnosticSession) {
  const state = session.currentState;
  const permittedActions = state === "MICRO_INSIGHT" ? ["accept_insight", "reject_insight"] : state === "CONTACT_OFFERED" ? ["skip_contact"] : state === "DIAGNOSIS" ? ["select_intent"] : state === "ROUTE" ? [] : ["submit_turn"];
  return { state, completedTurns: session.completedTurns, answers: session.answers, insight: session.insight ?? null, diagnosis: session.diagnosis ?? null, intent: session.intent ?? null, route: session.route ?? null, reasonCodes: session.reasonCodes ?? [], permittedActions };
}

export async function GET(request: Request) {
  const id = getDiagnosticSessionId(request);
  if (!id) return NextResponse.json({ error: "Session required." }, { status: 400 });
  try { const payload = await getServerPayload(); const session = await findAnonymousDiagnosticSession(payload as never, id); if (!session) return NextResponse.json({ error: "Session expired." }, { status: 404 }); return NextResponse.json(view(session)); }
  catch { return NextResponse.json({ error: "Unable to restore diagnostic." }, { status: 503 }); }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { action?: Action; answer?: unknown; intent?: unknown };
  const action = body.action ?? "submit_turn";
  if (!ACTIONS.includes(action as Action)) return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  const id = getDiagnosticSessionId(request); if (!id) return NextResponse.json({ error: "Session required." }, { status: 400 });
  try {
    const payload = await getServerPayload(); const session = await findAnonymousDiagnosticSession(payload as never, id); if (!session) return NextResponse.json({ error: "Session expired." }, { status: 404 });
    const state = session.currentState; const answers = { ...session.answers }; let next = state; let insight = session.insight ?? null; let diagnosis = session.diagnosis ?? null; let intent = session.intent ?? null; let route = session.route ?? null; let reasonCodes = session.reasonCodes ?? [];
    if (action === "submit_turn") {
      if (!TURN_STATES.includes(state as never)) return NextResponse.json({ error: "Turn is not expected." }, { status: 409 });
      if (typeof body.answer !== "string" || !body.answer.trim()) return NextResponse.json({ error: "Answer required." }, { status: 400 });
      const answer = body.answer.trim(); if (state === "PATTERN_HYPOTHESES" && !/^(yes|no)$/i.test(answer)) return NextResponse.json({ error: "Please confirm or correct the reflection." }, { status: 400 });
      answers[state] = answer; if (state === "PATTERN_HYPOTHESES") answers.painConfirmation = /^yes$/i.test(answer) ? "confirmed" : "rejected";
      next = ({ ROLE: "PAIN_RAW", PAIN_RAW: "PATTERN_HYPOTHESES", PATTERN_HYPOTHESES: "PAIN_CONFIRMED", PAIN_CONFIRMED: "WHY_NOW", WHY_NOW: "MICRO_INSIGHT" } as Record<string, string>)[state];
      if (next === "MICRO_INSIGHT") {
        const evidence = { identifiedPain: { value: answers.PAIN_RAW ?? null, sourceTurnIds: ["PAIN_RAW"] } };
        insight = buildMicroInsight({ ...session, answers, evidence } as never);
      }
    } else if (action === "accept_insight" || action === "reject_insight") {
      if (state !== "MICRO_INSIGHT") return NextResponse.json({ error: "Insight is not available." }, { status: 409 });
      answers.insightConfirmation = action === "accept_insight" ? "accepted" : "rejected"; next = action === "accept_insight" ? "CONTACT_OFFERED" : "PAIN_RAW";
    } else if (action === "skip_contact") {
      if (state !== "CONTACT_OFFERED") return NextResponse.json({ error: "Contact is not being offered." }, { status: 409 });
      answers.contact = "skipped"; const evidence = { identifiedPain: { value: answers.PAIN_RAW ?? null, sourceTurnIds: ["PAIN_RAW"] } }; diagnosis = buildDiagnosis({ ...session, answers, insight, evidence } as never); next = "DIAGNOSIS";
    } else if (action === "view_diagnosis") {
      if (!["CONTACT_SUBMITTED", "CONTACT_SKIPPED", "DIAGNOSIS"].includes(state)) return NextResponse.json({ error: "Diagnosis is not available." }, { status: 409 });
      const evidence = { identifiedPain: { value: answers.PAIN_RAW ?? null, sourceTurnIds: ["PAIN_RAW"] } }; diagnosis = diagnosis ?? buildDiagnosis({ ...session, answers, insight, evidence } as never); next = "DIAGNOSIS";
    } else if (action === "select_intent") {
      if (state !== "DIAGNOSIS") return NextResponse.json({ error: "Intent is not expected." }, { status: 409 });
      if (!["talk_now", "later", "self_serve"].includes(String(body.intent))) return NextResponse.json({ error: "Invalid intent." }, { status: 400 });
      intent = String(body.intent) as typeof intent; const routed = routeDiagnosticWithReasons({ fit: /engineer|technical|cto|vp|manager|lead/i.test(String(answers.ROLE ?? "")), pain: answers.painConfirmation === "confirmed", now: String(answers.WHY_NOW ?? "").length > 0, intent } as never); route = routed.route; reasonCodes = routed.reasons; next = "ROUTE";
    }
    const updated = { ...session, currentState: next, answers, insight, diagnosis, intent, route, reasonCodes, completedTurns: session.completedTurns + (action === "submit_turn" ? 1 : 0) };
    await saveAnonymousDiagnosticSession(payload as never, updated); return NextResponse.json(view(updated));
  } catch { return NextResponse.json({ error: "Unable to save diagnostic action." }, { status: 503 }); }
}
