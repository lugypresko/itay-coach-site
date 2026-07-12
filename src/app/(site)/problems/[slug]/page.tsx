import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProblemPage } from "@/components/problem-page";
import { loadProblemPage } from "@/lib/problem-pages";
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
  const page = await loadProblemPage(slug, getOrigin());

  if (!page) {
    return {};
  }

  return {
    title: page.record.seoTitle || page.record.title,
    description: page.record.seoDescription || page.record.painStatement,
    alternates: {
      canonical: page.canonicalUrl,
    },
    robots: page.record.status === "published" ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export default async function ProblemPageRoute({ params }: ProblemPageProps) {
  const { slug } = await params;
  const page = await loadProblemPage(slug, getOrigin());

  if (!page) {
    notFound();
  }

  return <ProblemPage page={page} />;
}

