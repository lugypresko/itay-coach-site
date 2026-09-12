import type { Metadata } from "next";

import { AuthorityLaunchPage } from "@/components/authority-launch-page";
import { thePushMethodologyPage } from "@/lib/reader-facing-static-pages";

const page = thePushMethodologyPage;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: page.canonicalPath },
  robots: { index: true, follow: true },
};

export default function ThePushMethodologyPage() {
  return <AuthorityLaunchPage page={page} />;
}
