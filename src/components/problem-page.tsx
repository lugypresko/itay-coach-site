"use client";

import React from "react";
import Link from "next/link";

import { TargetPageAnalytics, TargetTrackedLink } from "@/components/target-page-analytics";
import type { ReaderFacingLink, ReaderFacingProblemPage } from "@/lib/reader-facing-publication";

type ProblemPageProps = {
  page: ReaderFacingProblemPage;
};

function ProblemPageLinkList({ items }: { items: ReaderFacingLink[] }) {
  if (!items.length) return null;

  return (
    <div className="link-list">
      {items.map((item) => (
        <Link className="link-item" href={item.href} key={`${item.href}-${item.label}`}>
          {item.label}
        </Link>
      ))}
    </div>
  );
}

export function ProblemPage({ page }: ProblemPageProps) {
  return (
    <main className="content-shell">
      <TargetPageAnalytics path={page.pathname} slug={page.slug} />
      {page.jsonLd.length ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(page.jsonLd, null, 2) }} />
      ) : null}
      <header className="content-hero">
        <p className="eyebrow">Problem page</p>
        <h1>{page.title}</h1>
        <p className="lede">{page.painStatement}</p>
        <div className="content-actions">
          <TargetTrackedLink
            className="primary-link"
            href={page.primaryCta.href}
            ctaType={page.primaryCta.ctaType}
            path={page.pathname}
            slug={page.slug}
          >
            {page.primaryCta.label}
          </TargetTrackedLink>
        </div>
      </header>

      <section className="content-grid">
        <article className="content-panel">
          <h2>Three daily scenes</h2>
          <ol className="content-list">
            {page.dailyScenes.map((scene) => (
              <li key={scene}>{scene}</li>
            ))}
          </ol>
        </article>

        <article className="content-panel">
          <h2>What you probably tried</h2>
          <ul className="content-list">
            {page.whatTheyTried.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="content-panel content-panel-wide">
          <h2>Why it did not solve it</h2>
          <p>{page.whyItFailed}</p>
        </article>

        <article className="content-panel content-panel-wide">
          <h2>The Push diagnosis</h2>
          <p>{page.diagnosis}</p>
        </article>

        {page.relatedFrameworks.length ? (
          <nav className="content-panel" aria-label="Related frameworks">
            <h2>Related frameworks</h2>
            <ProblemPageLinkList items={page.relatedFrameworks} />
          </nav>
        ) : null}

        {page.relatedClusters.length ? (
          <nav className="content-panel" aria-label="Related clusters">
            <h2>Related clusters</h2>
            <ProblemPageLinkList items={page.relatedClusters} />
          </nav>
        ) : null}
      </section>
    </main>
  );
}
