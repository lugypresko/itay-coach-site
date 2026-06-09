import type { Metadata } from "next";

import {
  getPlayerTrapFunnelCopy,
  getPlayerTrapQuestions,
  playerTrapAuthorityCopyHebrew,
  playerTrapEvolutionStagesHebrew,
  playerTrapImpactChartPointsHebrew,
} from "@/lib/player-trap";

import { PlayerTrapAssessmentClient } from "../player-trap/player-trap-assessment-client";

type PlayerTrapHebrewPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: "מבחן מלכודת השחקן המצטיין",
  description: "אבחון של 3 דקות למנהלים טכנולוגיים שרוצים לראות אם הכל עדיין עובר דרכם.",
  robots: {
    index: false,
    follow: false,
  },
};

function readSearchParam(searchParams: Record<string, string | string[] | undefined> | undefined, key: string) {
  const value = searchParams?.[key];
  return typeof value === "string" ? value : "";
}

export default async function PlayerTrapHebrewPage({ searchParams }: PlayerTrapHebrewPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialUtm = {
    utmSource: readSearchParam(resolvedSearchParams, "utm_source"),
    utmMedium: readSearchParam(resolvedSearchParams, "utm_medium"),
    utmCampaign: readSearchParam(resolvedSearchParams, "utm_campaign"),
    utmContent: readSearchParam(resolvedSearchParams, "utm_content"),
    utmTerm: readSearchParam(resolvedSearchParams, "utm_term"),
  };
  const funnel = getPlayerTrapFunnelCopy("he");
  const questions = getPlayerTrapQuestions("he");

  return (
    <main className="content-shell player-trap-shell" lang={funnel.language} dir="rtl">
      <section className="player-trap-hero">
        <div className="player-trap-hero-copy">
          <p className="eyebrow">{funnel.hero.eyebrow}</p>
          <h1>{funnel.hero.headline}</h1>
          <p className="lede">{funnel.hero.subheadline}</p>
          <p className="player-trap-description">{funnel.hero.description}</p>
          <div className="content-actions">
            <a className="primary-link" href="#player-trap-self-check">
              {funnel.hero.cta}
            </a>
            <a className="secondary-link" href="#player-trap-pattern">
              {funnel.hero.secondaryCta}
            </a>
          </div>
          <p className="player-trap-microcopy">{funnel.hero.microcopy}</p>
        </div>

        <aside className="player-trap-hero-panel" aria-label="תקציר קמפיין">
          <p className="authority-label">{funnel.dailyScenes.label}</p>
          <ul className="player-trap-bullet-list">
            {funnel.dailyScenes.scenes.slice(0, 3).map((scene) => (
              <li key={scene}>{scene}</li>
            ))}
          </ul>
          <div className="player-trap-hero-panel-foot">
            <span>3 דקות</span>
            <span>בלי בולשיט</span>
            <span>למנהלים טכנולוגיים</span>
          </div>
        </aside>
      </section>

      <section className="player-trap-section">
        <div className="player-trap-section-heading">
          <p className="authority-label">{funnel.dailyScenes.label}</p>
          <h2>{funnel.dailyScenes.headline}</h2>
        </div>
        <div className="player-trap-sign-grid">
          {funnel.dailyScenes.scenes.map((scene) => (
            <article className="player-trap-sign-card" key={scene}>
              <p>{scene}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="player-trap-section player-trap-copy-block">
        <div className="player-trap-section-heading">
          <p className="authority-label">{funnel.wrongFix.label}</p>
          <h2>{funnel.wrongFix.headline}</h2>
        </div>
        <div className="player-trap-line-stack">
          {funnel.wrongFix.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </section>

      <section className="player-trap-section player-trap-copy-block">
        <div className="player-trap-section-heading">
          <p className="authority-label">{funnel.reframe.label}</p>
          <h2>{funnel.reframe.headline}</h2>
        </div>
        <div className="player-trap-line-stack player-trap-line-stack-strong">
          {funnel.reframe.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </section>

      <section className="player-trap-section" id="player-trap-pattern">
        <div className="player-trap-section-heading">
          <p className="authority-label">{funnel.pattern.label}</p>
          <h2>{funnel.pattern.headline}</h2>
          <p className="authority-summary">{funnel.pattern.body}</p>
        </div>
      </section>

      <section className="player-trap-section" id="player-trap-framework">
        <div className="player-trap-section-heading">
          <p className="authority-label">{funnel.framework.label}</p>
          <h2>{funnel.framework.headline}</h2>
          <p className="authority-summary">{funnel.framework.body}</p>
        </div>
        <div className="player-trap-framework-grid">
          {playerTrapEvolutionStagesHebrew.map((stage, index) => (
            <article className="player-trap-framework-card" key={stage.title}>
              <p className="player-trap-stage-index">0{index + 1}</p>
              <h3>{stage.title}</h3>
              <p>{stage.description}</p>
              <dl>
                <div>
                  <dt>צוואר בקבוק</dt>
                  <dd>{stage.bottleneck}</dd>
                </div>
                <div>
                  <dt>האתגר הבא</dt>
                  <dd>{stage.nextChallenge}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="player-trap-section">
        <div className="player-trap-section-heading">
          <p className="authority-label">סמכות</p>
          <h2>{playerTrapAuthorityCopyHebrew.headline}</h2>
          <p className="authority-summary">{playerTrapAuthorityCopyHebrew.body}</p>
        </div>
      </section>

      <section className="player-trap-section">
        <div className="player-trap-section-heading">
          <p className="authority-label">{funnel.chart.label}</p>
          <h2>{funnel.chart.headline}</h2>
        </div>
        <div className="player-trap-chart">
          <div className="player-trap-chart-axis player-trap-chart-axis-y">השפעה</div>
          <div className="player-trap-chart-axis player-trap-chart-axis-x">מעורבות אישית</div>
          <div className="player-trap-chart-grid">
            {playerTrapImpactChartPointsHebrew.map((point) => (
              <article className="player-trap-chart-point" key={point.stage}>
                <strong>{point.stage}</strong>
                <span>{point.x}</span>
                <span>{point.y}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="player-trap-section" id="player-trap-assessment">
        <PlayerTrapAssessmentClient questions={questions} initialUtm={initialUtm} pageLanguage="he" copy={funnel.assessment} />
      </section>
    </main>
  );
}
