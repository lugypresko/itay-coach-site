import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicContentPage } from "@/components/public-content-page";
import { loadPublishedPublicContent } from "@/lib/public-content-loader";
import { getPublicContentSectionSpec } from "@/lib/public-content";
import { toReaderFacingPublicContentPage } from "@/lib/reader-facing-publication";
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

  const page = await loadPublishedPublicContent(spec.section, slug, getOrigin(), { allowStaticFallback: true });

  if (!page) {
    return {};
  }

  const title = page.record.seoTitle.replace(/\s*\|\s*The Push\s*$/i, "");

  return {
    title,
    description: page.record.seoDescription,
    alternates: { canonical: page.canonicalUrl },
    robots: page.publicationDecision.indexable ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      title: `${title} | The Push`,
      description: page.record.seoDescription,
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

  const page = await loadPublishedPublicContent(spec.section, slug, getOrigin(), { allowStaticFallback: true });

  if (!page) {
    notFound();
  }

  return <PublicContentPage page={toReaderFacingPublicContentPage(page)} />;
}
