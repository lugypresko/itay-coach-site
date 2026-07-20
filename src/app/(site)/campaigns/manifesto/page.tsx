import type { Metadata } from "next";

import { CampaignConceptPage } from "@/components/campaign-concept-page";

export const metadata: Metadata = {
  title: "The Manifesto | The Player Trap",
  description: "A direct diagnostic for technical leaders who became the system their teams depend on.",
  alternates: { canonical: "/campaigns/manifesto" },
  robots: { index: false, follow: false },
};

export default function ManifestoCampaignPage() {
  return <CampaignConceptPage concept="manifesto" slug="manifesto" />;
}
