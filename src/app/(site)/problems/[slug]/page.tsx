import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ReaderFacingArtifactPage } from "@/components/reader-facing-artifact-page";
import { loadReaderFacingArtifactPublicProjection } from "@/lib/reader-facing-artifact-public-projection";
import { getSiteUrl } from "@/lib/site-url";

type ProblemPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getOrigin(): string {
  return getSiteUrl();
}

export async function generateMetadata({ params }: ProblemPageProps): Promise<Metadata> {
  const { slug } = await params;
  const artifact = (await loadReaderFacingArtifactPublicProjection()).byPathname.get(`/problems/${slug}`);

  if (!artifact) {
    return {};
  }

  return {
    title: artifact.seo.title,
    description: artifact.seo.description,
    alternates: { canonical: new URL(artifact.canonicalPath, getOrigin()).toString() },
    robots: { index: true, follow: true },
  };
}

export default async function ProblemPageRoute({ params }: ProblemPageProps) {
  const { slug } = await params;
  const artifact = (await loadReaderFacingArtifactPublicProjection()).byPathname.get(`/problems/${slug}`);

  if (!artifact) {
    notFound();
  }

  return <ReaderFacingArtifactPage artifact={artifact} />;
}
