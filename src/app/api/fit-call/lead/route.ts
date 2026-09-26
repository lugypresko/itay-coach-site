import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import {
  buildLeadQualification,
  validateLeadQualification,
  type LeadQualificationInput,
} from "@/lib/lead-qualification";
import { sendResendEmail } from "@/lib/resend";
import { getDiagnosticSessionRepository } from "@/lib/diagnostic-funnel/repository";

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as LeadQualificationInput & { website?: string };
    if (input.website?.trim()) {
      return NextResponse.json({ ok: true });
    }
    const errors = validateLeadQualification(input);
    if (errors.length) {
      return NextResponse.json({ error: "Please complete the required fields.", fields: errors }, { status: 400 });
    }

    const lead = buildLeadQualification(input);
    const recipient = process.env.FIT_CALL_LEADS_TO ?? process.env.RESEND_REPLY_TO ?? "hello@itayfoyerstein.com";
    const lines = [
      `Name: ${lead.name}`,
      `Work email: ${lead.workEmail}`,
      `Role: ${lead.role}`,
      `Company: ${lead.company}`,
      `Persona: ${lead.persona}`,
      `Support intent: ${lead.supportIntent}`,
      `Challenge: ${lead.challenge}`,
      `Timing: ${lead.timing}`,
      `Manager count: ${lead.managerCount ?? "not provided"}`,
      `Team count: ${lead.teamCount ?? "not provided"}`,
      `Sponsor role: ${lead.sponsorRole ?? "not provided"}`,
      `Initiative status: ${lead.initiativeStatus ?? "not provided"}`,
      `Attribution: ${JSON.stringify(lead.attribution ?? {})}`,
    ];
    const text = lines.join("\n");

    const sessionId = (await cookies()).get("diagnostic_session_id")?.value;
    const repository = getDiagnosticSessionRepository();
    let diagnosticSession = sessionId ? await repository.read(sessionId) : null;
    if (diagnosticSession) {
      if (diagnosticSession.status === "completed") {
        diagnosticSession = await repository.update(diagnosticSession.id, { status: "result_viewed" });
      }
      if (diagnosticSession.status === "result_viewed" || diagnosticSession.status === "email_captured") {
        diagnosticSession = await repository.update(diagnosticSession.id, {
          status: "fit_call_started",
          lead: { email: lead.workEmail, firstName: lead.name.split(/\s+/)[0] },
          fit: { role: lead.role, companySize: lead.company, scope: lead.teamCount, urgency: lead.timing, whyNow: lead.challenge },
        });
      }
    }

    if (process.env.VERCEL_ENV === "preview" || process.env.NODE_ENV !== "production") {
      const submissionId = crypto.randomUUID();
      console.info("fit_call_submission_preview", {
        submissionId,
        persona: lead.persona,
        supportIntent: lead.supportIntent,
        company: lead.company,
      });
      return NextResponse.json({ ok: true, persona: lead.persona, deliveryMode: "preview-log", submissionId });
    }

    try {
      const result = await sendResendEmail({
        from: process.env.RESEND_FROM_EMAIL ?? "The Push <no-reply@itayfoyerstein.com>",
        to: recipient,
        subject: `Fit call request: ${lead.persona} / ${lead.company}`,
        text,
        html: `<pre>${text.replaceAll("&", "&amp;").replaceAll("<", "&lt;")}</pre>`,
        replyTo: lead.workEmail,
      });
      if (diagnosticSession) await repository.update(diagnosticSession.id, { status: "fit_call_submitted" });
      return NextResponse.json({ ok: true, persona: lead.persona, deliveryMode: result.mode });
    } catch (error) {
      // The lead is already durable in the Production repository. Do not turn
      // a missing/broken notification provider into a lost conversion.
      console.error("Fit call notification failed after durable save", error);
      if (diagnosticSession) await repository.update(diagnosticSession.id, { status: "fit_call_submitted" });
      return NextResponse.json({ ok: true, persona: lead.persona, deliveryMode: "stored", notification: "pending" }, { status: 202 });
    }
  } catch (error) {
    console.error("Fit call lead submission failed", error);
    return NextResponse.json({ error: "Unable to send the fit call request." }, { status: 500 });
  }
}
