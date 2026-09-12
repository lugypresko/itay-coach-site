import type { Metadata } from "next";

import { AuthorityLaunchPage } from "@/components/authority-launch-page";
import { faqPage } from "@/lib/reader-facing-static-pages";

const page = faqPage;

export const metadata: Metadata = {
  title: page.title.replace(/\s*\|\s*The Push\s*$/i, ""),
  description: page.description,
  alternates: { canonical: page.canonicalPath },
  robots: { index: true, follow: true },
};

export default function FaqHubPage() {
  return <AuthorityLaunchPage page={page} />;
}
