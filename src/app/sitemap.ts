import type { MetadataRoute } from "next";

import { loadPublicationSurfaceProjection } from "@/lib/publication-surface-projection";
import { getSiteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getSiteUrl();
  const projection = await loadPublicationSurfaceProjection(origin);

  return projection.sitemapPathnames.map((pathname) => ({
    url: new URL(pathname, origin).toString(),
    lastModified: new Date(),
  }));
}
