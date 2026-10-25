import { after, NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import {
  getStore,
  newSession,
  token,
  Conflict,
  save,
} from "@/lib/diagnostic-v3/store";
import {
  act,
  event,
  bookingUrl,
  publicSession,
  deliverSummary,
} from "@/lib/diagnostic-v3/service";
import { runTransitionCheck } from "@/lib/diagnostic-v3/watchdog";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const COOKIE = "diagnostic_v3_session";
const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 30 * 86400,
};
function json(value: unknown, status = 200) {
  return NextResponse.json(value, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
function enabled() {
  return (
    process.env.VERCEL_ENV !== "production" ||
    process.env.DIAGNOSTIC_V3_PRODUCTION_ENABLED === "true"
  );
}
function scheduleWatchdog(sessionId: string) {
  if (process.env.VERCEL_ENV !== "preview") return;
  try {
    after(() => runTransitionCheck(sessionId));
  } catch {
    // Scheduling failure must never change a successfully persisted user action.
    console.warn("diagnostic-v3-watchdog-schedule-unavailable");
  }
}

const healthCache = globalThis as typeof globalThis & {
  __v3Health?: { until: number; result: Promise<unknown> };
};
async function syntheticHealth() {
  const parsed = new URL(process.env.DIAGNOSTIC_V3_DATABASE_URL ?? "");
  if (!/^ep-icy-fire-b9b5tsic(?:-pooler)?\./.test(parsed.hostname) || parsed.pathname !== "/neondb")
    throw new Error("Preview database configuration mismatch");
  const store = getStore();
  const auth = token();
  const s = newSession();
  await store.create(s, auth);
  let read = false;
  try { read = (await store.read(auth))?.id === s.id; }
  finally { await store.remove(auth); }
  const removed = (await store.read(auth)) === null;
  if (!read || !removed) throw new Error("Synthetic application persistence check failed");
  return { database_variable_present: true, hostname: parsed.hostname,
    database: "neondb", synthetic_session_id: s.id, write: true, read, delete: removed };
}

export async function GET(req: NextRequest) {
  if (!enabled()) return json({ error: "Diagnostic V3 is not enabled." }, 404);
  try {
    if (process.env.VERCEL_ENV === "preview" && req.nextUrl.searchParams.get("health") === "synthetic") {
      if (!healthCache.__v3Health || healthCache.__v3Health.until < Date.now())
        healthCache.__v3Health = { until: Date.now() + 600000, result: syntheticHealth() };
      return json(await healthCache.__v3Health.result);
    }
    const store = getStore();
    const returnToken = req.nextUrl.searchParams.get("return");
    if (returnToken) {
      const auth = token();
      const ok = await store.consumeReturn(returnToken, auth);
      const response = NextResponse.redirect(
        new URL(ok ? "/diagnostic" : "/diagnostic?return_expired=1", req.url),
        303,
      );
      response.headers.set("Cache-Control", "no-store");
      response.headers.set("Referrer-Policy", "no-referrer");
      if (ok) response.cookies.set(COOKIE, auth, options);
      return response;
    }
    const auth = req.cookies.get(COOKIE)?.value;
    const s = auth ? await store.read(auth) : null;
    if (s) return json({ session: publicSession(s) });
    const newAuth = token();
    const fresh = newSession();
    event(fresh, "view");
    await store.create(fresh, newAuth);
    const response = json({ session: publicSession(fresh) });
    response.cookies.set(COOKIE, newAuth, options);
    return response;
  } catch {
    return json(
      { error: "Your saved case is temporarily unavailable. Please retry." },
      503,
    );
  }
}
export async function POST(req: NextRequest) {
  if (!enabled()) return json({ error: "Diagnostic V3 is not enabled." }, 404);
  // Cookie-authenticated mutations accept same-origin browser requests only.
  if (req.headers.get("origin") !== req.nextUrl.origin)
    return json({ error: "Invalid request origin." }, 403);
  if (Number(req.headers.get("content-length") ?? 0) > 16000)
    return json({ error: "Request too large." }, 413);
  let actionName = "unknown";
  let requestEventId = "";
  try {
    const raw = await req.text();
    if (raw.length > 16000) return json({ error: "Request too large." }, 413);
    const input = JSON.parse(raw) as Record<string, unknown>;
    const actionAllowlist = ["start", "answers", "partial", "identify", "qualification", "booking_click", "summary"];
    actionName = typeof input.action === "string" && actionAllowlist.includes(input.action) ? input.action : "unknown";
    requestEventId = typeof input.event_id === "string" && /^[0-9a-f-]{36}$/i.test(input.event_id) ? input.event_id : "";
    const store = getStore();
    const auth = req.cookies.get(COOKIE)?.value;
    let s = auth ? await store.read(auth) : null;
    if (input.action === "start") {
      if (s) {
        if (s.stage === "entry") {
          const expected = s.record_version;
          s.stage = "answering";
          event(s, "start");
          await save(store, s, expected);
        }
        scheduleWatchdog(s.id);
        return json({ session: publicSession(s) });
      }
      const newAuth = token();
      s = newSession();
      s.stage = "answering";
      event(s, "view");
      event(s, "start");
      await store.create(s, newAuth);
      scheduleWatchdog(s.id);
      const r = json({ session: publicSession(s) });
      r.cookies.set(COOKIE, newAuth, options);
      return r;
    }
    if (!s)
      return json(
        { error: "This private session expired. Start a new case." },
        401,
      );
    if (input.action === "view") {
      if (input.stage !== s.stage || input.answer_revision !== s.answer_revision) return json({ ok: false });
      const names = s.stage === "full"
        ? ["full_result_view", ...(!s.qualification && !s.qualification_skipped ? ["qualification_shown"] : []), ...(bookingUrl() && ["conversation", "conversation_override"].includes(s.scoring.route) ? ["booking_cta_shown"] : []), ...(s.events.some((key) => key.includes(":return_link_opened")) ? ["restored_result_shown"] : [])]
        : s.stage === "partial"
          ? ["partial_result_view", "identity_gate_view"]
          : s.stage === "answering" && Number.isInteger(input.step) && Number(input.step) >= 0 && Number(input.step) <= 8
            ? [`question_shown:q${Number(input.step) + 1}`]
            : [];
      await store.recordViews?.(s, names);
      return json({ ok: true });
    }
    if (input.action === "telemetry") {
      const type = z.enum(["role_selected", "org_size_selected", "interaction_error"]).parse(input.event_type);
      const id = z.uuid().parse(input.event_id);
      const detail = type === "interaction_error"
        ? z.enum(["start", "answers", "partial", "identify", "qualification", "booking_click", "summary", "network"]).parse(input.action_code)
        : id;
      event(s, type, type === "interaction_error" ? `${detail}:${id}` : id);
      await store.recordViews?.(s, [`${s.answer_revision}:${type}:${type === "interaction_error" ? `${detail}:${id}` : id}`]);
      return json({ ok: true });
    }
    if (input.action === "delete") {
      await store.remove(auth!);
      const r = json({ session: null });
      r.cookies.delete(COOKIE);
      return r;
    }
    s = await act(store, s, input);
    if (
      input.action === "qualification" &&
      !["conversation", "conversation_override"].includes(s.scoring.route) &&
      !s.mail
    ) {
      s = await act(store, s, {
        action: "summary",
        expected_version: s.record_version,
      });
      s = await deliverSummary(store, s, req.nextUrl.origin, auth!);
    }
    if (input.action === "summary")
      s = await deliverSummary(store, s, req.nextUrl.origin, auth!);
    scheduleWatchdog(s.id);
    const r = json({ session: publicSession(s) });
    if (s.identity)
      r.cookies.set(COOKIE, auth!, {
        ...options,
        maxAge: Math.max(
          0,
          Math.floor((Date.parse(s.expires_at) - Date.now()) / 1000),
        ),
      });
    return r;
  } catch (e) {
    const authForError = req.cookies.get(COOKIE)?.value;
    if (authForError && actionName !== "unknown") {
      try {
        const latest = await getStore().read(authForError);
        if (latest) {
          const id = requestEventId || crypto.randomUUID();
          event(latest, "interaction_error", `${actionName}:request_failed:${id}`);
          await getStore().recordViews?.(latest, [`${latest.answer_revision}:interaction_error:${actionName}:request_failed:${id}`]);
        }
      } catch {
        // Audit persistence is best-effort when the primary store is unavailable.
      }
    }
    if (e instanceof Conflict) return json({ error: e.message }, 409);
    if (e instanceof z.ZodError || e instanceof SyntaxError)
      return json({ error: "Please check your answers and try again." }, 400);
    return json(
      {
        error:
          "We could not save this step. Your previous answers are safe; please retry.",
      },
      503,
    );
  }
}
