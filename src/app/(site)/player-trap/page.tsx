import type { Metadata } from "next";
import { PushConversation } from "@/components/push-conversation";
import { getSiteUrl } from "@/lib/site-url";

const title = "Leadership Diagnostic";
const description = "Bring one real leadership situation. Examine the pattern and choose one small move to try.";
const canonical = "/player-trap";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical },
  robots: { index: true, follow: true },
  openGraph: {
    title,
    description,
    url: canonical,
    type: "website",
    siteName: "The Push",
    images: [{ url: "/itay-home-photo.jpg", width: 896, height: 1195, alt: "Itay Foyerstein" }],
  },
};

export default function Page() {
  const url = new URL(canonical, getSiteUrl()).toString();
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url,
    isPartOf: { "@type": "WebSite", name: "The Push", url: getSiteUrl() },
  };

  return <main id="main-content"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><PushConversation /></main>;
}
