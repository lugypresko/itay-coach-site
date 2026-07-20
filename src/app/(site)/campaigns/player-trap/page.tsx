import type { Metadata } from "next";

import { CampaignConceptPage } from "@/components/campaign-concept-page";

export const metadata: Metadata = {
  title: "The Player Trap Diagnostic | Technical Leadership",
  description: "A campaign entry point for the Player Trap diagnostic and the leadership dependency it reveals.",
  alternates: { canonical: "/campaigns/player-trap" },
  robots: { index: false, follow: false },
};

export default function PlayerTrapCampaignPage() {
  return <CampaignConceptPage concept="manifesto" slug="player-trap" />;
}
