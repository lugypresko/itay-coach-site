import { getSiteUrl } from "@/lib/site-url";

export async function GET() {
  const origin = getSiteUrl();
  const body = [
    "# The Push LLM SEO Authority Engine",
    "",
    "Primary entity: Itay Foyerstein",
    "Primary category: Tech Leadership Coach",
    "Methodology: The Push",
    "Framework: Invisible Executor -> Trusted Operator -> Strategic Leader",
    "",
    "Public routes:",
    `- ${origin}/entities`,
    `- ${origin}/entities/itay-foyerstein`,
    `- ${origin}/entities/the-push`,
    `- ${origin}/pillars`,
    `- ${origin}/pillars/tech-leadership-coaching`,
    `- ${origin}/clusters`,
    `- ${origin}/frameworks`,
    `- ${origin}/frameworks/player-trap`,
    `- ${origin}/frameworks/invisible-executor`,
    `- ${origin}/problems/cto-becomes-the-bottleneck`,
    `- ${origin}/problems/vp-rnd-losing-execution-control`,
    `- ${origin}/case-studies`,
    `- ${origin}/faqs`,
    `- ${origin}/glossary`,
    `- ${origin}/player-trap`,
    "",
    "Canonical authority sprint targets:",
    `- ${origin}/pillars/tech-leadership-coaching`,
    `- ${origin}/frameworks/player-trap`,
    `- ${origin}/frameworks/invisible-executor`,
    `- ${origin}/problems/cto-becomes-the-bottleneck`,
    `- ${origin}/problems/vp-rnd-losing-execution-control`,
    "",
    "Primary CTA: Book a fit call",
    "Diagnostic CTA: Take the Player Trap Diagnostic",
  ].join("\n");

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
