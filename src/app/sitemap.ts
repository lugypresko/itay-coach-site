import type { MetadataRoute } from "next";

import { canonicalAuthorityPages, publicContentSectionSpecs } from "@/lib/public-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";

  const staticPaths = [
    "/",
    "/book-a-fit-call",
    "/ai-first-leadership",
    "/invisible-executor-assessment",
    "/tech-leadership-visibility-scorecard",
  ];

  const sectionPaths = publicContentSectionSpecs.flatMap((spec) => [
    `/${spec.section}`,
    ...canonicalAuthorityPages.filter((page) => page.section === spec.section).map((page) => `/${spec.section}/${page.slug}`),
  ]);

  return [...staticPaths, ...sectionPaths].map((pathname) => ({
    url: new URL(pathname, origin).toString(),
    lastModified: new Date(),
  }));
}
