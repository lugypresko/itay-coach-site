import { loadPublicationSurfaceProjection } from "@/lib/publication-surface-projection";
import { getSiteUrl } from "@/lib/site-url";

export async function GET() {
  const origin = getSiteUrl();
  const projection = await loadPublicationSurfaceProjection(origin);
  const publicRoutes = projection.llmsTxtPathnames;
  const body = [
    "# The Push LLM SEO Authority Engine",
    "",
    "Primary entity: Itay Foyerstein",
    "Primary category: Tech Leadership Coach",
    "Methodology: The Push",
    "Framework: Invisible Executor -> Trusted Operator -> Strategic Leader",
    "",
    "Public routes:",
    ...publicRoutes.map((pathname) => `- ${origin}${pathname}`),
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
