import type { Metadata } from "next";

import { AuthorityLaunchPage } from "@/components/authority-launch-page";
import { buildAuthorityLaunchMetadata, getAuthorityLaunchPage } from "@/lib/authority-launch-pages";

const page = getAuthorityLaunchPage("contact");

export const metadata: Metadata = buildAuthorityLaunchMetadata(page);

export default function ContactPage() {
  return <AuthorityLaunchPage page={page} />;
}

