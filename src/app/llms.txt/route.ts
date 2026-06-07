export async function GET() {
  const origin = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";
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
    `- ${origin}/frameworks/invisible-executor`,
    `- ${origin}/case-studies`,
    `- ${origin}/faqs`,
    `- ${origin}/glossary`,
    "",
    "Primary CTA: Book a fit call",
    "Secondary CTA: Invisible Executor Assessment",
  ].join("\n");

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
