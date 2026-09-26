export type TargetCtaType = "diagnostic" | "fit_call";

export const targetAnalyticsEventNames = {
  pageView: "target_page_view",
  ctaClick: "target_cta_click",
  diagnosticClick: "diagnostic_click",
  fitCallClick: "fit_call_click",
  homepageCtaClick: "homepage_cta_click",
  homepageSelectorChoice: "homepage_selector_choice",
} as const;

export const campaignUtmKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

/**
 * Builds the homepage-to-diagnostic URL while carrying campaign attribution.
 * Only approved attribution keys and the diagnostic pattern are forwarded;
 * visitor-entered answers never belong in analytics or the URL.
 */
export function buildDiagnosticHref(search: string, pattern?: string): string {
  const source = new URLSearchParams(search);
  const destination = new URLSearchParams();

  for (const key of campaignUtmKeys) {
    const value = source.get(key);
    if (value) destination.set(key, value);
  }

  if (pattern) destination.set("pattern", pattern);

  const query = destination.toString();
  return query ? `/diagnostic?${query}` : "/diagnostic";
}

export interface TargetAnalyticsPropertiesInput {
  path: string;
  slug: string;
  ctaType?: TargetCtaType;
  search?: string;
}

export interface TargetAnalyticsProperties extends Record<string, string> {
  path: string;
  slug: string;
  cta_type: TargetCtaType | "";
  referrer: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
}

function getDocumentReferrer() {
  if (typeof document === "undefined") {
    return "direct";
  }

  if (!document.referrer) return "direct";

  // Referrer query strings can contain visitor-entered identifiers. Keep the
  // useful source context while excluding query and fragment values from
  // analytics payloads.
  try {
    const referrer = new URL(document.referrer);
    return `${referrer.origin}${referrer.pathname}`;
  } catch {
    return "unknown";
  }
}

export function buildTargetAnalyticsProperties(input: TargetAnalyticsPropertiesInput): TargetAnalyticsProperties {
  const searchParams = new URLSearchParams(input.search ?? "");

  return {
    path: input.path,
    slug: input.slug,
    cta_type: input.ctaType ?? "",
    referrer: getDocumentReferrer(),
    utm_source: searchParams.get("utm_source") || "",
    utm_medium: searchParams.get("utm_medium") || "",
    utm_campaign: searchParams.get("utm_campaign") || "",
    utm_content: searchParams.get("utm_content") || "",
    utm_term: searchParams.get("utm_term") || "",
  };
}
