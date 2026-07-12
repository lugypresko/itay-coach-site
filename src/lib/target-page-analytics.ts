export type TargetCtaType = "diagnostic" | "fit_call";

export const targetAnalyticsEventNames = {
  pageView: "target_page_view",
  ctaClick: "target_cta_click",
  diagnosticClick: "diagnostic_click",
  fitCallClick: "fit_call_click",
} as const;

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

  return document.referrer || "direct";
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
