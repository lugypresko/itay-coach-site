import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ReaderFacingArtifactPage } from "@/components/reader-facing-artifact-page";
import { getPublicContentSectionSpec } from "@/lib/public-content";
import { loadReaderFacingArtifactPublicProjection } from "@/lib/reader-facing-artifact-public-projection";
import { getSiteUrl } from "@/lib/site-url";

type ContentPageProps = {
  params: Promise<{
    section: string;
    slug: string;
  }>;
};

function getOrigin(): string {
  return getSiteUrl();
}

export async function generateMetadata({ params }: ContentPageProps): Promise<Metadata> {
  const { section, slug } = await params;
  const spec = getPublicContentSectionSpec(section);

  if (!spec) {
    return {};
  }

  const pathname = `/${spec.section}/${slug}`;
  const artifact = (await loadReaderFacingArtifactPublicProjection()).byPathname.get(pathname);
  if (!artifact) {
    return {};
  }

  return {
    title: artifact.seo.title,
    description: artifact.seo.description,
    alternates: { canonical: new URL(artifact.canonicalPath, getOrigin()).toString() },
    robots: { index: true, follow: true },
    openGraph: {
      title: artifact.seo.title,
      description: artifact.seo.description,
      url: new URL(artifact.canonicalPath, getOrigin()).toString(),
      type: "article",
    },
  };
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { section, slug } = await params;
  const spec = getPublicContentSectionSpec(section);

  if (!spec) {
    notFound();
  }

  const artifact = (await loadReaderFacingArtifactPublicProjection()).byPathname.get(`/${spec.section}/${slug}`);

  if (!artifact) {
    notFound();
  }

  return <ReaderFacingArtifactPage artifact={artifact} />;
}
