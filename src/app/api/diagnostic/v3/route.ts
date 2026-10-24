import { NextResponse, type NextRequest } from "next/server";
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
  publicSession,
  deliverSummary,
} from "@/lib/diagnostic-v3/service";
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
export async function GET(req: NextRequest) {
  if (!enabled()) return json({ error: "Diagnostic V3 is not enabled." }, 404);
  try {
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
  try {
    const raw = await req.text();
    if (raw.length > 16000) return json({ error: "Request too large." }, 413);
    const input = JSON.parse(raw) as Record<string, unknown>;
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
        return json({ session: publicSession(s) });
      }
      const newAuth = token();
      s = newSession();
      s.stage = "answering";
      event(s, "view");
      event(s, "start");
      await store.create(s, newAuth);
      const r = json({ session: publicSession(s) });
      r.cookies.set(COOKIE, newAuth, options);
      return r;
    }
    if (!s)
      return json(
        { error: "This private session expired. Start a new case." },
        401,
      );
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
