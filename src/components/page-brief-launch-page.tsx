import Link from "next/link";

import type { PageBrief } from "@/ai/agents";
import { AuthorityProofTrustBlock } from "@/components/authority-trust-blocks";
import { getAuthorityProofBlocks } from "@/lib/evidence-mapping";

type PageBriefLaunchPageProps = {
  brief: PageBrief;
};

export function PageBriefLaunchPage({ brief }: PageBriefLaunchPageProps) {
  const proofBlocks = getAuthorityProofBlocks(brief.canonicalPath);
  const relatedPages = Array.from(
    new Set([
      ...brief.topicClusterPosition.internalLinks,
      "/pillars/tech-leadership-coaching",
      "/frameworks/player-trap",
      "/frameworks/invisible-executor",
      "/problems/cto-becomes-the-bottleneck",
      "/problems/vp-rnd-losing-execution-control",
    ]),
  );

  return (
    <main className="content-shell">
      <header className="content-hero content-hero-split">
        <div className="content-hero-copy">
          <div className="content-hero-meta">
            <p className="eyebrow">Recommendation-intent page</p>
            <p className="content-status">Built from PageBrief</p>
          </div>
          <h1>{brief.title}</h1>
          <p className="lede">{brief.audiencePain.summary}</p>
          <p className="authority-summary">{brief.pagePromise}</p>
          <div className="content-actions">
            <Link className="primary-link" href={brief.cta.href}>
              {brief.cta.label}
            </Link>
            <Link className="secondary-link" href="/the-push-methodology">
              Read The Push methodology
            </Link>
          </div>
        </div>

        <aside className="content-hero-panel" aria-label="Page brief snapshot">
          <p className="authority-label">Page brief snapshot</p>
          <dl className="authority-dl">
            <div>
              <dt>Market context</dt>
              <dd>{brief.marketContext.summary}</dd>
            </div>
            <div>
              <dt>Unique angle</dt>
              <dd>{brief.uniqueAngle}</dd>
            </div>
            <div>
              <dt>CTA</dt>
              <dd>{brief.cta.label}</dd>
            </div>
          </dl>
          <p className="authority-summary">{brief.cta.rationale}</p>
        </aside>
      </header>

      {proofBlocks.length ? (
        <section className="content-panel content-panel-wide authority-trust-panel">
          <h2>Proof-backed trust</h2>
          <AuthorityProofTrustBlock blocks={proofBlocks} />
        </section>
      ) : null}

      <section className="content-grid">
        <article className="content-panel content-panel-wide">
          <h2>Audience pain</h2>
          <p>{brief.audiencePain.summary}</p>
          <ul className="content-list">
            {brief.audiencePain.painThemes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="content-panel">
          <h2>Why Itay / The Push</h2>
          <p>{brief.uniqueAngle}</p>
        </article>

        <article className="content-panel">
          <h2>Search intent</h2>
          <p>{brief.searchIntent.summary}</p>
        </article>

        <article className="content-panel">
          <h2>Topic cluster position</h2>
          <p>{brief.topicClusterPosition.summary}</p>
        </article>

        <article className="content-panel content-panel-wide">
          <h2>What proof this page needs</h2>
          <ul className="content-list">
            {brief.proofNeeded.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="content-panel content-panel-wide">
          <h2>Content plan</h2>
          <div className="authority-trust-grid">
            {brief.contentPlan.map((step) => (
              <article className="content-panel" key={step.sectionTitle}>
                <p className="authority-label">{step.sectionTitle}</p>
                <p>{step.purpose}</p>
                <ul className="content-list">
                  {step.proofNeeded.map((proof) => (
                    <li key={proof}>{proof}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </article>

        <article className="content-panel content-panel-wide">
          <h2>Related pages</h2>
          <div className="link-list">
            {relatedPages.map((href) => (
              <Link key={href} className="link-item" href={href}>
                <span>{href.replace(/^\//, "").replace(/-/g, " ")}</span>
                <small>Supports the path from recommendation intent to trust and next step.</small>
              </Link>
            ))}
          </div>
        </article>

        <article className="content-panel content-panel-wide">
          <h2>Next step</h2>
          <p>{brief.pagePromise}</p>
          <div className="content-actions">
            <Link className="primary-link" href={brief.cta.href}>
              {brief.cta.label}
            </Link>
            <Link className="secondary-link" href="/about">
              About Itay Foyerstein
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
