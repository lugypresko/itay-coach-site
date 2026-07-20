const attributionKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export interface CampaignAttributionInput {
  search?: string;
  landingPath: string;
  lpConcept: string;
  audience: string;
  ctaId: string;
}

export interface CampaignAttribution extends Record<string, string> {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  lp_concept: string;
  audience: string;
  cta_id: string;
  landing_path: string;
}

export function buildCampaignAttribution(input: CampaignAttributionInput): CampaignAttribution {
  const searchParams = new URLSearchParams(input.search ?? "");
  const attribution = Object.fromEntries(
    attributionKeys.map((key) => [key, searchParams.get(key) ?? ""]),
  ) as Pick<CampaignAttribution, (typeof attributionKeys)[number]>;

  return {
    ...attribution,
    lp_concept: input.lpConcept,
    audience: input.audience,
    cta_id: input.ctaId,
    landing_path: input.landingPath,
  };
}

export function buildCampaignDestination(destination: string, input: CampaignAttributionInput): string {
  const params = new URLSearchParams(buildCampaignAttribution(input));
  return `${destination}${destination.includes("?") ? "&" : "?"}${params.toString()}`;
}
