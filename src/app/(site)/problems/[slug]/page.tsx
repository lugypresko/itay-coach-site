import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProblemPage } from "@/components/problem-page";
import { loadProblemPage } from "@/lib/problem-pages";
import { toReaderFacingProblemPage } from "@/lib/reader-facing-publication";
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
  const page = await loadProblemPage(slug, getOrigin(), { allowStaticFallback: true });

  if (!page) {
    return {};
  }

  return {
    title: page.record.seoTitle,
    description: page.record.seoDescription,
    alternates: { canonical: page.canonicalUrl },
    robots: page.publicationDecision.indexable ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export default async function ProblemPageRoute({ params }: ProblemPageProps) {
  const { slug } = await params;
  const page = await loadProblemPage(slug, getOrigin(), { allowStaticFallback: true });

  if (!page) {
    notFound();
  }

  return <ProblemPage page={toReaderFacingProblemPage(page)} />;
}