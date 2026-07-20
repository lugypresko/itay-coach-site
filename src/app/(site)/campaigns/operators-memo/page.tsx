import type { Metadata } from "next";

import { CampaignConceptPage } from "@/components/campaign-concept-page";
import { campaignPageCopy } from "@/lib/campaign-page-copy";

const copy = campaignPageCopy["operators-memo"];

export const metadata: Metadata = {
  title: "The Operator's Memo | Leadership Support for Organizations",
  description: copy.lede,
  alternates: { canonical: "/campaigns/operators-memo" },
  robots: { index: false, follow: false },
};

export default function OperatorsMemoCampaignPage() {
  return <CampaignConceptPage concept="memo" slug="operators-memo" copy={copy} />;
}
