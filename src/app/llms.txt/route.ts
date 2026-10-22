import { loadPublicationSurfaceProjection } from "@/lib/publication-surface-projection";
import { getSiteUrl } from "@/lib/site-url";

const PRIMARY_CTA = { label: "Book a fit call", path: "/book-a-fit-call" };
const DIAGNOSTIC_CTA = { label: "Take the diagnostic", path: "/player-trap" };

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
    `Primary CTA: ${PRIMARY_CTA.label} - ${origin}${PRIMARY_CTA.path}`,
    `Diagnostic CTA: ${DIAGNOSTIC_CTA.label} - ${origin}${DIAGNOSTIC_CTA.path}`,
  ].join("\n");

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
