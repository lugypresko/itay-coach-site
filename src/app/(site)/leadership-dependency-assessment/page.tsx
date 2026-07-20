import type { Metadata } from "next";

import {
  getPlayerTrapFunnelCopy,
  getPlayerTrapQuestions,
} from "@/lib/player-trap";

import { PlayerTrapAssessmentClient } from "../player-trap/player-trap-assessment-client";

type AssessmentPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: "Leadership Dependency Assessment",
  description: "A short assessment for technical leaders who want to identify where leadership work still depends on them.",
  alternates: {
    canonical: "/leadership-dependency-assessment",
  },
  robots: {
    index: false,
    follow: false,
  },
};

function readSearchParam(searchParams: Record<string, string | string[] | undefined> | undefined, key: string) {
  const value = searchParams?.[key];
  return typeof value === "string" ? value : "";
}

export default async function LeadershipDependencyAssessmentPage({ searchParams }: AssessmentPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const funnel = getPlayerTrapFunnelCopy("en");
  const questions = getPlayerTrapQuestions("en");
  const initialUtm = {
    utmSource: readSearchParam(resolvedSearchParams, "utm_source"),
    utmMedium: readSearchParam(resolvedSearchParams, "utm_medium"),
    utmCampaign: readSearchParam(resolvedSearchParams, "utm_campaign"),
    utmContent: readSearchParam(resolvedSearchParams, "utm_content"),
    utmTerm: readSearchParam(resolvedSearchParams, "utm_term"),
  };

  return (
    <main className="content-shell player-trap-shell" lang="en">
      <section className="player-trap-hero">
        <div className="player-trap-hero-copy">
          <p className="eyebrow">Leadership OS diagnostic</p>
          <h1>Run the Leadership Dependency Assessment.</h1>
          <p className="lede">
            Identify where decisions, reviews, approvals, and rescue work still route through you before choosing the next
            leadership intervention.
          </p>
          <p className="player-trap-description">
            This assessment uses the Player Trap model as a practical diagnostic. It is an informational tool, not an
            objective measurement or psychological evaluation.
          </p>
        </div>
      </section>

      <section className="player-trap-section" id="leadership-dependency-assessment">
        <PlayerTrapAssessmentClient
          questions={questions}
          initialUtm={initialUtm}
          pageLanguage="en"
          copy={funnel.assessment}
        />
      </section>
    </main>
  );
}
