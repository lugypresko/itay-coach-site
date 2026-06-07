import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicContentPage } from "@/components/public-content-page";
import { loadPublishedPublicContent } from "@/lib/public-content-loader";
import { getPublicContentSectionSpec } from "@/lib/public-content";

type ContentPageProps = {
  params: Promise<{
    section: string;
    slug: string;
  }>;
};

function getOrigin(): string {
  return process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";
}

export async function generateMetadata({ params }: ContentPageProps): Promise<Metadata> {
  const { section, slug } = await params;
  const spec = getPublicContentSectionSpec(section);

  if (!spec) {
    return {};
  }

  const page = await loadPublishedPublicContent(spec.section, slug, getOrigin());
  if (!page) {
    return {};
  }

  return {
    title: page.record.seoTitle || page.record.title,
    description: page.record.seoDescription || page.record.excerpt,
    alternates: {
      canonical: page.canonicalUrl,
    },
    openGraph: {
      title: page.record.seoTitle || page.record.title,
      description: page.record.seoDescription || page.record.excerpt,
      url: page.canonicalUrl,
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

  const page = await loadPublishedPublicContent(spec.section, slug, getOrigin());

  if (!page) {
    notFound();
  }

  return <PublicContentPage page={page} />;
}

