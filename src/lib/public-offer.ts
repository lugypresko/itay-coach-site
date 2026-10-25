export const HOME_TITLE = "Technical Leadership Coaching for Engineering Managers & Directors | Itay Foyerstein";
export const CASE_CTA = { label: "Bring one current case", href: "/diagnostic" } as const;
export const PUBLIC_DESCRIPTION_OVERRIDES: Record<string, string> = {
  "/pillars/tech-leadership-coaching": "12-week 1:1 coaching for engineering managers and directors who are still the path for every decision. Move judgment back into the team.",
  "/problems/cto-becomes-the-bottleneck": "When every judgment, escalation and decision still routes through the CTO: the pattern, what it costs, and one way out.",
};
export function publicDescription(path: string, original: string): string {
  return PUBLIC_DESCRIPTION_OVERRIDES[path] ?? original;
}
export const languageAlternates = {
  en: "/problems/product-engineering-misalignment",
  he: "/he/problems/product-engineering-misalignment",
};
