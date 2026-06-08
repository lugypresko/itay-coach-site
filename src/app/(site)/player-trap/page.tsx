import type { Metadata } from "next";

import { playerTrapQuestions } from "@/lib/player-trap";

import { PlayerTrapAssessmentClient } from "./player-trap-assessment-client";

type PlayerTrapPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: "Player Trap diagnostic",
  description:
    "A minimal diagnostic for engineering managers and tech leads who want to see whether execution is turning into a bottleneck.",
  robots: {
    index: false,
    follow: false,
  },
};

function readSearchParam(searchParams: Record<string, string | string[] | undefined> | undefined, key: string) {
  const value = searchParams?.[key];
  return typeof value === "string" ? value : "";
}

export default async function PlayerTrapPage({ searchParams }: PlayerTrapPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialUtm = {
    utmSource: readSearchParam(resolvedSearchParams, "utm_source"),
    utmMedium: readSearchParam(resolvedSearchParams, "utm_medium"),
    utmCampaign: readSearchParam(resolvedSearchParams, "utm_campaign"),
    utmContent: readSearchParam(resolvedSearchParams, "utm_content"),
    utmTerm: readSearchParam(resolvedSearchParams, "utm_term"),
  };

  return (
    <main className="content-shell">
      <section className="content-hero">
        <p className="eyebrow">Conversion infrastructure</p>
        <h1>Player Trap diagnostic</h1>
        <p className="lede">
          A short diagnostic that shows whether strong execution has started to turn into a hidden review queue or
          escalation path.
        </p>
      </section>

      <section className="content-grid">
        <div className="content-panel-wide">
          <PlayerTrapAssessmentClient questions={playerTrapQuestions} initialUtm={initialUtm} />
        </div>
      </section>
    </main>
  );
}
