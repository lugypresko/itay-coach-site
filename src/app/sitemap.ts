import type { MetadataRoute } from "next";

import { getPublicAuthoritySitemapPathnames } from "@/lib/public-authority-routes";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteUrl();

  return getPublicAuthoritySitemapPathnames().map((pathname) => ({
    url: new URL(pathname, origin).toString(),
    lastModified: new Date(),
  }));
}
