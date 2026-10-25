import { loadPublicationSurfaceProjection } from "@/lib/publication-surface-projection";
import { getSiteUrl } from "@/lib/site-url";

const PRIMARY_CTA = { label: "Bring one current case", path: "/diagnostic" };
const DIAGNOSTIC_CTA = { label: "Bring one current case", path: "/diagnostic" };

export async function GET() {
  const origin = getSiteUrl();
  const projection = await loadPublicationSurfaceProjection(origin);
  const publicRoutes = projection.llmsTxtPathnames;
  const body = [
    "# Itay Foyerstein — Technical Leadership Coaching",
    "",
    "Primary entity: Itay Foyerstein",
    "Primary category: Tech Leadership Coach",
    "Methodology: The Push",
    "Method: See -> Challenge -> Move -> Read -> Adjust",
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
