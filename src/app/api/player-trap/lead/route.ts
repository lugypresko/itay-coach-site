import { NextResponse } from "next/server";

import { getServerPayload } from "@/lib/payload";
import type { PlayerTrapQuestionId } from "@/lib/player-trap";
import {
  buildPlayerTrapDiagnosisCallUrl,
  buildPlayerTrapFollowUpEmail,
  buildPlayerTrapReport,
  buildPlayerTrapReportUrl,
  normalizeUtmAttribution,
  playerTrapNurtureSequence,
  scorePlayerTrap,
  serializeAnswers,
} from "@/lib/player-trap";
import { sendResendEmail } from "@/lib/resend";

type LeadRequestBody = {
  email?: string;
  name?: string;
  answers?: Partial<Record<PlayerTrapQuestionId, string>>;
  reportToken?: string;
  diagnosisCallRequested?: boolean;
  utm?: Partial<Record<"utmSource" | "utmMedium" | "utmCampaign" | "utmContent" | "utmTerm", string>>;
};

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export async function POST(request: Request) {
  const body = (await request.json()) as LeadRequestBody;
  const email = body.email?.trim();

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const normalizedEmail = normalizeEmail(email);
  const result = scorePlayerTrap(body.answers ?? {});
  const reportToken = body.reportToken?.trim() || crypto.randomUUID();
  const reportUrl = buildPlayerTrapReportUrl(reportToken);
  const diagnosisCallUrl = buildPlayerTrapDiagnosisCallUrl(reportToken);
  const utm = normalizeUtmAttribution(body.utm);
  const payload = await getServerPayload();
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

  const submission = {
    name: body.name?.trim() || undefined,
    email: normalizedEmail,
    reportToken,
    reportUrl,
    diagnosisCallUrl,
    assessmentScore: result.totalScore,
    assessmentTier: result.tier,
    assessmentResult: JSON.stringify(result),
    assessmentAnswers: serializeAnswers(body.answers ?? {}),
    lifecycleStage: "lead_captured",
    leadSource: "player-trap",
    source: "player-trap",
    tags: [{ value: "player-trap" }, { value: "diagnostic" }, { value: result.tier }],
    status: "subscribed" as const,
    reportRequestedAt: new Date().toISOString(),
    nurtureSequenceKey: "player-trap-2026",
    nurtureStep: 1,
    nurtureLastEmailSlug: playerTrapNurtureSequence[0].slug,
    nurtureLastEmailSentAt: new Date().toISOString(),
    utmSource: utm.utmSource || undefined,
    utmMedium: utm.utmMedium || undefined,
    utmCampaign: utm.utmCampaign || undefined,
    utmContent: utm.utmContent || undefined,
    utmTerm: utm.utmTerm || undefined,
  };

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
    name: body.name?.trim() || undefined,
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
      reportViewedAt: new Date().toISOString(),
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
