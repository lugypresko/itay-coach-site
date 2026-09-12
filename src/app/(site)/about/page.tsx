import type { Metadata } from "next";

import { AuthorityLaunchPage } from "@/components/authority-launch-page";
import { aboutPage } from "@/lib/reader-facing-static-pages";

const page = aboutPage;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: page.canonicalPath },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  return <AuthorityLaunchPage page={page} />;
}
