import { createHmac } from "node:crypto";
import {
  answerSchema,
  identitySchema,
  qualificationSchema,
  complete,
  type Session,
} from "./contracts";
import { analyze } from "./analysis";
import { score } from "./scoring";
import { hash, save, Conflict, type Store } from "./store";
export function brief(s: Session): string {
  return JSON.stringify(
    {
      diagnostic_version: s.diagnostic_version,
      lead: s.identity ?? null,
      qualification: s.qualification ?? null,
      answers: s.answers,
      analysis: s.full?.data ?? s.partial?.data ?? null,
      analysis_source: s.full?.source ?? s.partial?.source,
      scoring: s.scoring,
      opening_question: s.full?.data.unresolved_question,
      do_not_ask_again: Object.keys(s.answers),
    },
    null,
    2,
  );
}
export function event(s: Session, name: string) {
  const key = `${s.answer_revision}:${name}`;
  if (!s.events.includes(key)) s.events.push(key);
}
export function publicSession(s: Session) {
  return {
    diagnostic_version: s.diagnostic_version,
    record_version: s.record_version,
    answer_revision: s.answer_revision,
    answers: s.answers,
    step: s.step,
    stage: s.stage,
    identified: Boolean(s.identity),
    qualification: s.qualification ?? null,
    qualification_skipped: Boolean(s.qualification_skipped),
    partial: s.partial?.data ?? null,
    full: s.identity ? (s.full?.data ?? null) : null,
    route: s.identity ? s.scoring.route : null,
    mail: s.mail ?? null,
    booking_url:
      s.identity &&
      ["conversation", "conversation_override"].includes(s.scoring.route)
        ? bookingUrl()
        : null,
    storage: process.env.DIAGNOSTIC_V3_DATABASE_URL
      ? "persistent"
      : "disposable_preview",
  };
}
export function bookingUrl() {
  try {
    const url = new URL(process.env.DIAGNOSTIC_V3_BOOKING_URL ?? "");
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}
export async function act(
  store: Store,
  s: Session,
  input: Record<string, unknown>,
): Promise<Session> {
  if (input.expected_version !== s.record_version)
    throw new Conflict("Your case has changed. Reload to continue.");
  let expected = s.record_version;
  if (input.action === "answers") {
    const answers = answerSchema.parse(input.answers);
    if (
      !Number.isInteger(input.step) ||
      Number(input.step) < 0 ||
      Number(input.step) > 8
    )
      throw new Error("Invalid step");
    if (JSON.stringify(answers) !== JSON.stringify(s.answers) || (Number.isInteger(input.completed_step) && !s.events.some(e => e.split(":")[1] === `q${input.completed_step}_complete`))) {
      s.answers = answers;
      s.answer_revision++;
      delete s.partial;
      delete s.full;
      s.stage = "answering";
      s.scoring = score(answers, s.qualification);
      delete s.mail;
    }
    s.step = Number(input.step);
    if (
      Number.isInteger(input.completed_step) &&
      Number(input.completed_step) >= 1 &&
      Number(input.completed_step) <= 9
    )
      event(s, `q${input.completed_step}_complete`);
  } else if (input.action === "partial") {
    if (!complete(s.answers))
      throw new Error("Please finish the questions first.");
    if (s.partial?.answer_revision === s.answer_revision) return s;
    event(s, "analysis_started");
    const attempt = await store.beginAnalysis?.(s, "partial");
    s.partial = await analyze(s.id, s.answer_revision, s.answers, "partial");
    if (attempt) s.partial.id = await store.finishAnalysis!(s, attempt, s.partial);
    s.stage = "partial";

  } else if (input.action === "identify") {
    if (!s.partial || s.partial.answer_revision !== s.answer_revision)
      throw new Error("Read your first analysis before continuing.");
    if (!s.identity) {
      s.identity = identitySchema.parse(input.identity);
      s.identified_at = new Date().toISOString();
      const expiry = new Date(s.identified_at);
      expiry.setUTCFullYear(expiry.getUTCFullYear() + 1);
      s.expires_at = expiry.toISOString();
      event(s, "identity_submit");
      s.sales_brief = brief(s);
      await save(store, s, expected);
      expected = s.record_version;
    }
    if (s.full?.answer_revision !== s.answer_revision) {
      const attempt = await store.beginAnalysis?.(s, "full");
      s.full = await analyze(
        s.id,
        s.answer_revision,
        s.answers,
        "full",
        s.partial.data,
        [s.identity.first_name, s.identity.email, s.identity.company],
      );
      if (attempt) s.full.id = await store.finishAnalysis!(s, attempt, s.full);
    }
    s.stage = "full";
    s.scoring = score(s.answers, s.qualification);

  } else if (input.action === "qualification") {
    if (!s.identity || !s.full) throw new Error("Open your full read first.");
    s.qualification =
      input.skip === true
        ? undefined
        : qualificationSchema.parse(input.qualification);
    s.qualification_skipped = input.skip === true;
    s.scoring = score(s.answers, s.qualification);
    event(s, input.skip === true ? "qualification_skipped" : "qualification_submit");
    // Include the decision snapshot to distinguish repeated qualification changes.
    event(s, `route_${s.scoring.route}`);
  } else if (input.action === "booking_click") {
    if (
      !s.identity ||
      !["conversation", "conversation_override"].includes(s.scoring.route) ||
      !bookingUrl()
    )
      throw new Error("Booking is not available for this case.");
    event(s, "book_call_click");
  } else if (input.action === "summary") {
    if (!s.identity || !s.full) throw new Error("Open your full read first.");
    if (s.mail === "sent" || s.mail === "simulated" || s.mail === "queued")
      return s;
    // Reserve delivery before the side effect. Retries use the same provider idempotency key.
    s.mail = "queued";
  } else throw new Error("Unknown diagnostic action");
  if (s.identity) s.sales_brief = brief(s);
  return save(store, s, expected);
}
export async function deliverSummary(
  store: Store,
  s: Session,
  origin: string,
  auth: string,
): Promise<Session> {
  if (!s.identity || !s.full || s.mail !== "queued") return s;
  const expected = s.record_version;
  const returnToken = createHmac("sha256", auth)
    .update(`${s.id}:${s.answer_revision}:return`)
    .digest("base64url");
  s.return_hash = hash(returnToken);
  s.return_expires_at = new Date(Date.now() + 7 * 86400000).toISOString();
  await save(store, s, expected);
  const returnUrl = `${origin}/api/diagnostic/v3?return=${returnToken}`;
  const text = renderSummaryEmail(s.full.data, returnUrl);
  const mailEnabled = process.env.DIAGNOSTIC_V3_MAIL_ENABLED === "true";
  const previewMailEnabled =
    process.env.VERCEL_ENV !== "preview" ||
    process.env.DIAGNOSTIC_V3_PREVIEW_MAIL_ENABLED === "true";
  const live =
    mailEnabled &&
    previewMailEnabled &&
    process.env.RESEND_API_KEY &&
    process.env.DIAGNOSTIC_V3_MAIL_FROM;
  if (!live) s.mail = "simulated";
  else {
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        signal: AbortSignal.timeout(8000),
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `diagnostic-v3-${s.id}-${s.answer_revision}`,
        },
        body: JSON.stringify({
          from: process.env.DIAGNOSTIC_V3_MAIL_FROM,
          to: [s.identity.email],
          subject: "Your case: one experiment for the next 7 days",
          text,
        }),
      });
      if (!r.ok) {
        if (process.env.VERCEL_ENV === "preview") {
          const requestId =
            r.headers.get("resend-id") ??
            r.headers.get("x-resend-id") ??
            r.headers.get("x-request-id");
          let safeError: Record<string, string> = {};
          try {
            const body: unknown = await r.json();
            if (body && typeof body === "object") {
              const root = body as Record<string, unknown>;
              const candidate =
                root.error && typeof root.error === "object"
                  ? (root.error as Record<string, unknown>)
                  : root;
              for (const key of ["name", "type", "code", "message"]) {
                const value = candidate[key];
                if (typeof value !== "string") continue;
                const sanitized = value
                  .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email]")
                  .replace(/\bBearer\s+\S+/gi, "Bearer [redacted]")
                  .replace(/\bre_[A-Za-z0-9_-]+\b/g, "[redacted]")
                  .replace(/https?:\/\/\S+/gi, "[url]")
                  .replace(/[\r\n\t]+/g, " ")
                  .slice(0, 240);
                safeError[key] = sanitized;
              }
            }
          } catch {
            safeError = { message: "Response body was not valid JSON." };
          }
          console.error("diagnostic-v3-resend-non-2xx", {
            status: r.status,
            requestId,
            error: safeError,
          });
        }
        throw new Error("delivery_failed");
      }
      s.mail = "sent";
    } catch {
      s.mail = "failed";
    }
  }
  // A concurrent edit wins. Do not overwrite its answers or result.
  await save(store, s, s.record_version);
  return s;
}

function limitWords(value: string, maxWords: number) {
  const words = value.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  if (words.length <= maxWords) return words.join(" ");
  return `${words.slice(0, maxWords).join(" ").replace(/[,;:]$/, "")}…`;
}

function firstSentence(value: string) {
  const normalized = value.replace(/\s+/g, " ").trim();
  const end = normalized.search(/[.!?](?=\s|$)/);
  return limitWords(end === -1 ? normalized : normalized.slice(0, end + 1), 22);
}

export function renderSummaryEmail(
  full: NonNullable<Session["full"]>["data"],
  returnUrl: string,
) {
  return [
    "What I noticed",
    firstSentence(full.likely_explanation),
    "",
    "Your next move",
    limitWords(full.leadership_move, 22),
    "",
    "One question to ask",
    limitWords(full.manager_question, 20),
    "",
    "7-day success signal",
    limitWords(full.success_signal, 20),
    "",
    "CTA",
    "Open your full read",
    returnUrl,
  ].join("\n");
}
