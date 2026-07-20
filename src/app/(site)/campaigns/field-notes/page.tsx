import type { Metadata } from "next";

import { CampaignConceptPage } from "@/components/campaign-concept-page";
import { campaignPageCopy } from "@/lib/campaign-page-copy";

const copy = campaignPageCopy["field-notes"];

export const metadata: Metadata = {
  title: "Field Notes | Technical Leadership Coaching",
  description: copy.lede,
  alternates: { canonical: "/campaigns/field-notes" },
  robots: { index: false, follow: false },
};

export default function FieldNotesCampaignPage() {
  return <CampaignConceptPage concept="field-notes" slug="field-notes" copy={copy} />;
}
