const PRODUCTION_SITE_URL = "https://itayfoyerstein.com";
const LOCAL_SITE_URL = "http://localhost:3000";

function normalizeUrl(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

function isProductionRuntime(): boolean {
  return process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
}

export function getSiteUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL;
  const normalizedConfiguredUrl = configuredUrl ? normalizeUrl(configuredUrl) : "";

  if (normalizedConfiguredUrl) {
    if (isProductionRuntime() && /^https?:\/\/localhost(?::\d+)?$/i.test(normalizedConfiguredUrl)) {
      return PRODUCTION_SITE_URL;
    }

    return normalizedConfiguredUrl;
  }

  return isProductionRuntime() ? PRODUCTION_SITE_URL : LOCAL_SITE_URL;
}

