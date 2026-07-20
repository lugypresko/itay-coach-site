export interface ResendEmailInput {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export interface ResendEmailResult {
  id: string;
  mode: "live" | "dry-run";
}

function normalizeRecipients(to: string | string[]): string[] {
  return Array.isArray(to) ? to : [to];
}

export async function sendResendEmail(input: ResendEmailInput): Promise<ResendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey && process.env.NODE_ENV === "production") {
    throw new Error("RESEND_API_KEY is required in production.");
  }

  const dryRun = !apiKey || process.env.RESEND_DRY_RUN === "true";

  if (dryRun) {
    return {
      id: `dry-${crypto.randomUUID()}`,
      mode: "dry-run",
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: input.from,
      to: normalizeRecipients(input.to),
      subject: input.subject,
      html: input.html,
      text: input.text,
      reply_to: input.replyTo,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend request failed (${response.status}): ${body}`);
  }

  const payload = (await response.json()) as { id?: string };

  return {
    id: payload.id ?? `resend-${crypto.randomUUID()}`,
    mode: "live",
  };
}
