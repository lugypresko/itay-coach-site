import { NextResponse } from "next/server";

import { getServerPayload } from "@/lib/payload";
import type { PlayerTrapQuestionId } from "@/lib/player-trap";
import {
  buildPlayerTrapDiagnosisCallUrl,
  buildPlayerTrapRequestToTalkUrl,
  buildPlayerTrapFollowUpEmail,
  buildPlayerTrapReport,
  buildPlayerTrapReportUrl,
  buildPlayerTrapSubmissionData,
  getPlayerTrapQuestions,
  normalizeUtmAttribution,
  normalizePlayerTrapLanguage,
  isPlayerTrapReportTokenValid,
  validatePlayerTrapAnswers,
  playerTrapNurtureSequence,
  scorePlayerTrap,
} from "@/lib/player-trap";
import { sendResendEmail } from "@/lib/resend";
import { deriveDiagnosticSignals, routeDiagnostic, type DiagnosticSignals } from "@/lib/assessment-journey";
import { getDiagnosticSessionId } from "@/lib/diagnostic-session";
import { findAnonymousDiagnosticSession, saveAnonymousDiagnosticSession } from "@/lib/diagnostic-session-store";
import type { Payload } from "payload";

type LeadRequestBody = {
  email?: string;
  name?: string;
  answers?: Partial<Record<PlayerTrapQuestionId, string>>;
  reportToken?: string;
  diagnosisCallRequested?: boolean;
  pageLanguage?: string;
  contentConsentAccepted?: boolean;
  cookiesConsentAccepted?: boolean;
  utm?: Partial<Record<"utmSource" | "utmMedium" | "utmCampaign" | "utmContent" | "utmTerm", string>>;
  dql?: Partial<DiagnosticSignals>;
};

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export async function POST(request: Request) {
  try {
    const payload = await getServerPayload();
    const sessionId = getDiagnosticSessionId(request);
    const probe = await request.clone().json().catch(() => ({})) as Record<string, unknown>;
    if (sessionId && (probe.processingConsentAccepted !== undefined || probe.requestToTalk === true || probe.flow === "conversational")) {
      return await handleConversationalLead(request, payload, sessionId, probe);
    }
    return await handleLeadPost(request);
  } catch (error) {
    console.error("Player Trap lead submission failed", error);
    return NextResponse.json({ error: "Unable to create the diagnostic report." }, { status: 500 });
  }
}

async function handleLeadPost(request: Request) {
  const body = (await request.json()) as LeadRequestBody;
  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "First name is required." }, { status: 400 });
  }

  if (body.contentConsentAccepted !== true || body.cookiesConsentAccepted !== true) {
    return NextResponse.json({ error: "Content and cookies consent is required." }, { status: 400 });
  }

  const normalizedEmail = normalizeEmail(email);
  const reportToken = body.reportToken?.trim() || crypto.randomUUID();
  if (normalizedEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!isPlayerTrapReportTokenValid(reportToken)) {
    return NextResponse.json({ error: "Invalid diagnostic submission." }, { status: 400 });
  }
  if (name.length > 120) {
    return NextResponse.json({ error: "Name is too long." }, { status: 400 });
  }
  const requestUrl = new URL(request.url);
  const requestBaseUrl = requestUrl.origin;
  const reportUrl = buildPlayerTrapReportUrl(reportToken, requestBaseUrl);
  const diagnosisCallUrl = buildPlayerTrapDiagnosisCallUrl(reportToken, requestBaseUrl);
  const requestToTalkUrl = buildPlayerTrapRequestToTalkUrl(reportToken, requestBaseUrl);
  const utm = normalizeUtmAttribution(body.utm);
  const pageLanguage = normalizePlayerTrapLanguage(body.pageLanguage);
  const questions = getPlayerTrapQuestions(pageLanguage);
  const dql = deriveDiagnosticSignals(body.dql);
  const route = routeDiagnostic(dql);
  const answerErrors = validatePlayerTrapAnswers(body.answers ?? {}, questions);
  if (answerErrors.length) {
    return NextResponse.json({ error: "Please answer every diagnostic question.", fields: answerErrors }, { status: 400 });
  }
  if (typeof body.dql?.fit !== "boolean" || typeof body.dql?.pain !== "boolean" || typeof body.dql?.now !== "boolean" || !body.dql.intent) {
    return NextResponse.json({ error: "Please complete the diagnostic routing questions." }, { status: 400 });
  }
  const result = scorePlayerTrap(body.answers ?? {}, questions);
  const { totalScore: _totalScore, maxScore: _maxScore, ...publicResult } = result;
  const now = new Date().toISOString();
  const payload = await getServerPayload();

  // The browser reuses reportToken on retries. Return the original report instead of
  // creating a second Payload record and sending another Resend email.
  const existingByToken = await payload.find({
    collection: "email-subscribers",
    limit: 1,
    overrideAccess: true,
    where: { reportToken: { equals: reportToken } },
  } as never);
  const tokenRecord = existingByToken.docs[0] as unknown as { id?: string; email?: string; reportUrl?: string; diagnosisCallUrl?: string } | undefined;
  if (tokenRecord?.id) {
    if (tokenRecord.email !== normalizedEmail) {
      return NextResponse.json({ error: "Invalid diagnostic submission." }, { status: 409 });
    }
    return NextResponse.json({
      ok: true,
      reportUrl: tokenRecord.reportUrl ?? reportUrl,
      diagnosisCallUrl: tokenRecord.diagnosisCallUrl ?? diagnosisCallUrl,
      requestToTalkUrl,
      route,
      email: normalizedEmail,
      resendMode: "deduplicated",
    });
  }
  const reportSummary = buildPlayerTrapReport(result, {
    name: body.name?.trim() || undefined,
    reportUrl,
    diagnosisCallUrl,
  });

  const existing = await payload.find({
    collection: "email-subscribers",
    limit: 1,
    overrideAccess: true,
    where: {
      email: {
        equals: normalizedEmail,
      },
    },
  } as never);

  const submission = buildPlayerTrapSubmissionData({
    name,
    email: normalizedEmail,
    answers: body.answers ?? {},
    result,
    reportToken,
    reportUrl,
    diagnosisCallUrl,
    pageLanguage,
    contentConsentAccepted: body.contentConsentAccepted,
    cookiesConsentAccepted: body.cookiesConsentAccepted,
    utm,
    now,
  });

  const existingRecord = existing.docs[0] as unknown as { id: string } | undefined;

  const record =
    existingRecord?.id
      ? await payload.update({
          collection: "email-subscribers",
          id: existingRecord.id,
          data: submission as never,
          overrideAccess: true,
        })
      : await payload.create({
          collection: "email-subscribers",
          data: submission as never,
          overrideAccess: true,
        });

  const firstEmail = buildPlayerTrapFollowUpEmail(playerTrapNurtureSequence[0], {
    name: name || undefined,
    email: normalizedEmail,
    reportUrl,
    diagnosisCallUrl,
    result,
  });

  const resendResult = await sendResendEmail({
    from: process.env.RESEND_FROM_EMAIL ?? "The Push <no-reply@itayfoyerstein.com>",
    to: normalizedEmail,
    subject: firstEmail.subject,
    html: firstEmail.html,
    text: firstEmail.text,
    replyTo: process.env.RESEND_REPLY_TO ?? "hello@itayfoyerstein.com",
  });

  await payload.update({
    collection: "email-subscribers",
    id: (record as unknown as { id: string }).id,
    data: {
      lifecycleStage: "email_1_sent",
      nurtureLastEmailId: resendResult.id,
      nurtureLastEmailMode: resendResult.mode,
      nurtureLastEmailStatus: resendResult.mode,
      reportViewedAt: now,
    } as never,
    overrideAccess: true,
  });

  return NextResponse.json({
    ok: true,
    reportUrl,
    diagnosisCallUrl,
    result: publicResult,
    email: normalizedEmail,
    resendMode: resendResult.mode,
    reportSummary,
    requestToTalkUrl,
    route,
  });
}

async function handleConversationalLead(request: Request, payload: Payload, sessionId: string, probe: Record<string, unknown>) {
  const session = await findAnonymousDiagnosticSession(payload as never, sessionId);
  if (!session) return NextResponse.json({ error: "Diagnostic session expired." }, { status: 404 });
  const requestToTalk = probe.requestToTalk === true;
  if (requestToTalk && session.route !== "TALK_NOW") return NextResponse.json({ error: "A conversation can only be requested from a talk-now route." }, { status: 409 });
  if (probe.processingConsentAccepted !== true) return NextResponse.json({ error: "Privacy processing acknowledgement is required." }, { status: 400 });
  const email = typeof probe.email === "string" ? probe.email.trim().toLowerCase() : "";
  const name = typeof probe.name === "string" ? probe.name.trim() : "";
  if (!name || !email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Name and a valid email are required." }, { status: 400 });
  const submissionId = typeof probe.submissionId === "string" && /^[A-Za-z0-9_-]{16,100}$/.test(probe.submissionId) ? probe.submissionId : crypto.randomUUID();
  const existing = await payload.find({ collection: "email-subscribers", limit: 1, overrideAccess: true, where: { submissionId: { equals: submissionId } } });
  if (existing.docs[0]) return NextResponse.json({ ok: true, deduplicated: true, route: session.route, requestToTalk: requestToTalk });
  const now = new Date().toISOString();
  const explicitIntent: "TALK_NOW" | "LATER" | "SELF_SERVE" | null = session.intent === "talk_now" ? "TALK_NOW" : session.intent === "later" ? "LATER" : session.intent === "self_serve" ? "SELF_SERVE" : null;
  const requestToTalkStatus: "requested" | null = requestToTalk ? "requested" : null;
  const data = {
    email, name, status: "pending" as const, source: "player-trap-diagnostic", leadSource: "player-trap", leadPath: "/player-trap",
    pageLanguage: session.language, diagnosticSession: sessionId, diagnosticSnapshot: { answers: session.answers, insight: session.insight ?? null, diagnosis: session.diagnosis ?? null, route: session.route ?? null, reasonCodes: session.reasonCodes ?? [], intent: session.intent ?? null },
    processingConsentAccepted: true, processingConsentAcceptedAt: now, marketingConsentAccepted: probe.marketingConsentAccepted === true, marketingConsentAcceptedAt: probe.marketingConsentAccepted === true ? now : null,
    submissionId, explicitIntent, dqlRoute: session.route ?? null, routeReasonCodes: session.reasonCodes ?? [], requestToTalkAt: requestToTalk ? now : null, requestToTalkStatus,
    utmSource: typeof session.attribution?.utmSource === "string" ? session.attribution.utmSource : undefined,
  };
  const record = await payload.create({ collection: "email-subscribers", data, overrideAccess: true });
  await saveAnonymousDiagnosticSession(payload as never, { ...session, currentState: "CONTACT_SUBMITTED", leadId: String((record as { id: string | number }).id), requestToTalkSubmissionId: requestToTalk ? submissionId : null });
  return NextResponse.json({ ok: true, route: session.route, requestToTalk, submissionId });
}
