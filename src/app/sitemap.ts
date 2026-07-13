import type { MetadataRoute } from "next";

import { loadReaderFacingArtifactPublicProjection } from "@/lib/reader-facing-artifact-public-projection";
import { getSiteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getSiteUrl();
  const projection = await loadReaderFacingArtifactPublicProjection();

  return projection.sitemapPathnames.map((pathname) => ({
    url: new URL(pathname, origin).toString(),
    lastModified: new Date(),
  }));
}
