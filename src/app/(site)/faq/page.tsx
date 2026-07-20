import type { Metadata } from "next";

import { AuthorityLaunchPage } from "@/components/authority-launch-page";
import { PageBriefLaunchPage } from "@/components/page-brief-launch-page";
import { buildAuthorityLaunchMetadata, getAuthorityLaunchPage } from "@/lib/authority-launch-pages";

const page = getAuthorityLaunchPage("faq");

export const metadata: Metadata = buildAuthorityLaunchMetadata(page);

 export default function FaqHubPage() {
   // RESTORED: Explicit reader-facing path only.
   return <AuthorityLaunchPage page={page} />;
 }
