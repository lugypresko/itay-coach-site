import { NextResponse } from "next/server";

import {
  buildLeadQualification,
  validateLeadQualification,
  type LeadQualificationInput,
} from "@/lib/lead-qualification";
import { sendResendEmail } from "@/lib/resend";

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

    const result = await sendResendEmail({
      from: process.env.RESEND_FROM_EMAIL ?? "The Push <no-reply@itayfoyerstein.com>",
      to: recipient,
      subject: `Fit call request: ${lead.persona} / ${lead.company}`,
      text,
      html: `<pre>${text.replaceAll("&", "&amp;").replaceAll("<", "&lt;")}</pre>`,
      replyTo: lead.workEmail,
    });

    return NextResponse.json({ ok: true, persona: lead.persona, deliveryMode: result.mode });
  } catch (error) {
    console.error("Fit call lead submission failed", error);
    return NextResponse.json({ error: "Unable to send the fit call request." }, { status: 500 });
  }
}
