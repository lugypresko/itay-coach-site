import type { Metadata } from "next";

import { AuthorityLaunchPage } from "@/components/authority-launch-page";
import { thePushMethodologyPage } from "@/lib/reader-facing-static-pages";

const page = thePushMethodologyPage;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: page.canonicalPath },
  robots: { index: true, follow: true },
  openGraph: {
    title: page.title,
    description: page.description,
    url: `https://itayfoyerstein.com${page.canonicalPath}`,
    type: "website",
  },
};

export default function ThePushMethodologyPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.description,
    url: `https://itayfoyerstein.com${page.canonicalPath}`,
    isPartOf: { "@type": "WebSite", name: "The Push", url: "https://itayfoyerstein.com" },
    about: { "@type": "Thing", name: "Technical leadership decision-making" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <AuthorityLaunchPage page={page} />
    </>
  );
}
