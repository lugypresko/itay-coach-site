import { buildDiagnosticHref } from "@/lib/target-page-analytics";

export const homepagePatterns = [
  { value: "decision", label: "A decision that should close without me" },
  { value: "meeting", label: "A meeting I somehow still need to attend" },
  { value: "escalation", label: "An escalation that keeps climbing back up" },
  { value: "stall", label: "Work that stalls when I am unavailable" },
] as const;

export type HomepagePattern = (typeof homepagePatterns)[number]["value"];

export function buildHomepagePatternHref(search: string, pattern: HomepagePattern): string {
  return buildDiagnosticHref(search, pattern);
}
