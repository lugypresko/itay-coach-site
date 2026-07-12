"use client";

import Link from "next/link";

import { TargetPageAnalytics, TargetTrackedLink } from "@/components/target-page-analytics";
import { buildProblemPageJsonLd } from "@/lib/problem-page-schema";
import type { ProblemPageModel } from "@/lib/problem-pages";

type ProblemPageProps = {
  page: ProblemPageModel;
};

function ProblemPageLinkList({ items }: { items: ProblemPageModel["record"]["relatedFrameworks"] | ProblemPageModel["record"]["relatedClusters"] }) {
  if (!items.length) {
    return <p className="authority-empty">No related links yet.</p>;
  }

  return (
    <div className="link-list">
      {items.map((item) => (
        <div className="link-item" key={`${item.href}-${item.label}`}>
          <Link href={item.href}>{item.label}</Link>
          <small>{item.reason}</small>
        </div>
      ))}
    </div>
  );
}

export function ProblemPage({ page }: ProblemPageProps) {
  const jsonLd = buildProblemPageJsonLd(page);

  return (
    <main className="content-shell">
      <TargetPageAnalytics path={page.pathname} slug={page.record.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 2) }} />
      <header className="content-hero">
        <div className="content-hero-meta">
          <p className="eyebrow">Problem page</p>
          <p className="content-status">{page.record.status}</p>
        </div>
        <h1>{page.record.title}</h1>
        <p className="lede">{page.record.painStatement}</p>
        <div className="content-actions">
          <TargetTrackedLink className="primary-link" href={page.record.primaryCTA.href} ctaType="fit_call" path={page.pathname} slug={page.record.slug}>
            {page.record.primaryCTA.label}
          </TargetTrackedLink>
        </div>
      </header>

      <section className="content-grid">
        <article className="content-panel content-panel-wide">
          <h2>Pain statement</h2>
          <p>{page.record.painStatement}</p>
        </article>

        <article className="content-panel">
          <h2>Three daily scenes</h2>
          <ol className="content-list">
            {page.record.dailyScenes.map((scene) => (
              <li key={scene}>{scene}</li>
            ))}
          </ol>
        </article>

        <article className="content-panel">
          <h2>What you probably tried</h2>
          <ul className="content-list">
            {page.record.whatTheyTried.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="content-panel content-panel-wide">
          <h2>Why it did not solve it</h2>
          <p>{page.record.whyItFailed}</p>
        </article>

        <article className="content-panel content-panel-wide">
          <h2>The Push diagnosis</h2>
          <p>{page.record.diagnosis}</p>
        </article>

        <article className="content-panel content-panel-wide">
          <h2>Evidence block</h2>
          <dl className="authority-dl">
            <div>
              <dt>Claim</dt>
              <dd>{page.record.evidenceBlock.claim}</dd>
            </div>
            <div>
              <dt>Source</dt>
              <dd>
                <code>{page.record.evidenceBlock.source}</code>
              </dd>
            </div>
            <div>
              <dt>Related entity</dt>
              <dd>{page.record.evidenceBlock.relatedEntity}</dd>
            </div>
            <div>
              <dt>Confidence</dt>
              <dd>{page.record.evidenceBlock.confidence}</dd>
            </div>
            <div>
              <dt>Approval status</dt>
              <dd>{page.record.evidenceBlock.approvalStatus}</dd>
            </div>
          </dl>
        </article>

        <article className="content-panel content-panel-wide">
          <h2>Single CTA</h2>
          <p>{page.record.primaryCTA.reason}</p>
          <div className="content-actions">
            <TargetTrackedLink className="primary-link" href={page.record.primaryCTA.href} ctaType="fit_call" path={page.pathname} slug={page.record.slug}>
              {page.record.primaryCTA.label}
            </TargetTrackedLink>
          </div>
        </article>

        <article className="content-panel">
          <h2>Related frameworks</h2>
          <ProblemPageLinkList items={page.record.relatedFrameworks} />
        </article>

        <article className="content-panel">
          <h2>Related clusters</h2>
          <ProblemPageLinkList items={page.record.relatedClusters} />
        </article>
      </section>
    </main>
  );
}
