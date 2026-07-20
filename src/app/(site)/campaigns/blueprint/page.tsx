import type { Metadata } from "next";

import { CampaignConceptPage } from "@/components/campaign-concept-page";

export const metadata: Metadata = {
  title: "The Blueprint | Leadership Operating Model",
  description: "A blueprint for making decision rights, ownership, escalation paths, and feedback loops explicit.",
  alternates: { canonical: "/campaigns/blueprint" },
  robots: { index: false, follow: false },
};

export default function BlueprintCampaignPage() {
  return <CampaignConceptPage concept="blueprint" slug="blueprint" />;
}
