import type { Session } from "./contracts";

export const BOOKING_DELIVERABLES = [
  "A decision map: what stays with you, what moves to your team",
  "One 7-day experiment, designed for this case",
  "The question to bring to your manager",
] as const;

const PATTERN_LABELS: Record<string, string> = {
  ownership_gap: "Ownership gap",
  decision_rights_gap: "Decision-rights gap",
  cross_team_dependency: "Cross-team dependency",
  review_dependency: "Review dependency",
  escalation_habit: "Escalation habit",
  risk_boundary_ambiguity: "Risk-boundary ambiguity",
  capability_gap: "Capability gap",
  system_process_problem: "System or process problem",
  mixed: "Mixed pattern",
  unclear: "Unclear pattern",
};

export type BookingOffer = {
  durationMin: number;
  meta: string;
  cta: string;
  microcopy: string;
  deliverables: readonly string[];
};

function disabled(value: string | undefined): boolean {
  if (value === undefined) return false;
  const trimmed = value.trim().toLowerCase();
  return trimmed === "" || trimmed === "off";
}

/** Duration-only public offer. The diagnostic card does not display a price. */
export function bookingOffer(
  env: NodeJS.ProcessEnv = process.env,
): BookingOffer | null {
  const raw = env.DIAGNOSTIC_V3_BOOKING_DURATION_MIN;
  if (disabled(raw)) return null;
  const durationMin = Number(raw === undefined ? "75" : raw.trim());
  if (!Number.isInteger(durationMin) || durationMin < 1 || durationMin > 240) return null;
  return {
    durationMin,
    meta: `${durationMin} min · online`,
    cta: `Book the ${durationMin}-min session`,
    microcopy: "Your name and email carry over.",
    deliverables: BOOKING_DELIVERABLES,
  };
}

export function patternLabel(pattern: string): string | null {
  return PATTERN_LABELS[pattern] ?? null;
}

export function bookingNotes(pattern: string): string {
  const label = patternLabel(pattern);
  return label ? `Pattern to test: ${label}` : "Pattern to test: from your diagnostic";
}

export function withBookingPrefill(
  href: string,
  input: { name: string; email: string; pattern: string },
): string {
  const url = new URL(href);
  url.searchParams.set("name", input.name);
  url.searchParams.set("email", input.email);
  url.searchParams.set("notes", bookingNotes(input.pattern));
  return url.toString();
}

export function visitorBookingUrl(
  base: string | null,
  session: Pick<Session, "identity" | "full" | "partial" | "scoring">,
): string | null {
  if (!base || !session.identity || !bookingOffer()) return null;
  if (!["conversation", "conversation_override"].includes(session.scoring.route)) return null;
  const pattern =
    session.full?.data.primary_pattern ??
    session.partial?.data.primary_pattern ??
    "unclear";
  return withBookingPrefill(base, {
    name: session.identity.first_name,
    email: session.identity.email,
    pattern,
  });
}
