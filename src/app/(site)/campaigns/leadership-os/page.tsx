import type { Metadata } from "next";

import { CampaignConceptPage } from "@/components/campaign-concept-page";
import { campaignPageCopy } from "@/lib/campaign-page-copy";

const copy = campaignPageCopy["leadership-os"];

export const metadata: Metadata = {
  title: "Leadership OS Diagnostic | Leadership Dependency Assessment",
  description: copy.lede,
  alternates: { canonical: "/campaigns/leadership-os" },
  robots: { index: false, follow: false },
};

export default function LeadershipOsCampaignPage() {
  return <CampaignConceptPage concept="console" slug="leadership-os" copy={copy} />;
}
