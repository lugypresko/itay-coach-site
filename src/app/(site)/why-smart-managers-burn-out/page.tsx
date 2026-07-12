import type { Metadata } from "next";

import { AuthorityLaunchPage } from "@/components/authority-launch-page";
import { PageBriefLaunchPage } from "@/components/page-brief-launch-page";
import { buildAuthorityLaunchMetadata, getAuthorityLaunchPage } from "@/lib/authority-launch-pages";

const page = getAuthorityLaunchPage("whySmartManagersBurnOut");

export const metadata: Metadata = buildAuthorityLaunchMetadata(page);

export default function WhySmartManagersBurnOutPage() {
  if (page.pageSource === "page_brief" && page.pageBrief) {
    return <PageBriefLaunchPage brief={page.pageBrief} />;
  }

  return <AuthorityLaunchPage page={page} />;
}
