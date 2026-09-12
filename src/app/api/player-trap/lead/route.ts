import { NextResponse } from "next/server";

import { getServerPayload } from "@/lib/payload";
import type { PlayerTrapQuestionId } from "@/lib/player-trap";
import {
  buildPlayerTrapDiagnosisCallUrl,
  buildPlayerTrapFollowUpEmail,
  buildPlayerTrapReport,
  buildPlayerTrapReportUrl,
  buildPlayerTrapSubmissionData,
  getPlayerTrapQuestions,
  normalizeUtmAttribution,
  normalizePlayerTrapLanguage,
  validatePlayerTrapAnswers,
  playerTrapNurtureSequence,
  scorePlayerTrap,
} from "@/lib/player-trap";
import { sendResendEmail } from "@/lib/resend";

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
};

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export async function POST(request: Request) {
  try {
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
  if (reportToken.length > 128) {
    return NextResponse.json({ error: "Invalid diagnostic submission." }, { status: 400 });
  }
  if (name.length > 120) {
    return NextResponse.json({ error: "Name is too long." }, { status: 400 });
  }
  const requestUrl = new URL(request.url);
  const requestBaseUrl = requestUrl.origin;
  const reportUrl = buildPlayerTrapReportUrl(reportToken, requestBaseUrl);
  const diagnosisCallUrl = buildPlayerTrapDiagnosisCallUrl(reportToken, requestBaseUrl);
  const utm = normalizeUtmAttribution(body.utm);
  const pageLanguage = normalizePlayerTrapLanguage(body.pageLanguage);
  const questions = getPlayerTrapQuestions(pageLanguage);
  const answerErrors = validatePlayerTrapAnswers(body.answers ?? {}, questions);
  if (answerErrors.length) {
    return NextResponse.json({ error: "Please answer every diagnostic question.", fields: answerErrors }, { status: 400 });
  }
  const result = scorePlayerTrap(body.answers ?? {}, questions);
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
    result,
    email: normalizedEmail,
    resendMode: resendResult.mode,
    reportSummary,
  });
}
