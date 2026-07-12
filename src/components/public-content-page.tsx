import React from "react";
import Link from "next/link";

import {
  AuthorityEvidenceBlock,
  AuthorityEntityContextBlock,
  AuthorityProofTrustBlock,
  AuthorityRecommendationIntentBlock,
  AuthorityRelatedAuthorityBlock,
  AuthorityReviewBlock,
} from "@/components/authority-trust-blocks";
import { TargetPageAnalytics, TargetTrackedLink } from "@/components/target-page-analytics";
import { getAuthorityProofBlocks } from "@/lib/evidence-mapping";
import { getProblemPagesForSurface } from "@/lib/problem-pages";
import type { PublicContentPageModel } from "@/lib/public-content";
import { buildPageJsonLd } from "@/lib/public-schema";

type PublicContentPageProps = {
  page: PublicContentPageModel;
};

function toParagraphs(content: string): string[] {
  return content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function splitContentBlocks(content: string) {
  const paragraphs = toParagraphs(content);
  const structuredBlocks: Array<{ title: string; body: string }> = [];
  const narrativeBlocks: string[] = [];

  for (const paragraph of paragraphs) {
    const match = paragraph.match(
      /^(Definition|Framework explanation|Specific symptoms|Uncomfortable truth|Target questions|Citation-worthy snippet):\s*(.+)$/i,
    );

    if (!match) {
      narrativeBlocks.push(paragraph);
      continue;
    }

    const rawTitle = match[1].toLowerCase();
    const title =
      rawTitle === "citation-worthy snippet"
        ? "Citation-worthy snippet"
        : rawTitle.replace(/^\w/, (char) => char.toUpperCase());

    structuredBlocks.push({
      title,
      body: match[2],
    });
  }

  return { structuredBlocks, narrativeBlocks };
}

function getPrimaryCta(page: PublicContentPageModel) {
  if (page.pathname === "/frameworks/player-trap") {
    return {
      href: "/player-trap",
      label: "Take the Player Trap Diagnostic",
      ctaType: "diagnostic" as const,
    };
  }

  return {
    href: "/book-a-fit-call",
    label: "Book a Fit Call",
    ctaType: "fit_call" as const,
  };
}

function hrefForInternalLink(targetSlug: string): string {
  if (targetSlug === "tech-leadership-coaching") {
    return "/pillars/tech-leadership-coaching";
  }

  if (targetSlug === "player-trap" || targetSlug === "invisible-executor") {
    return `/frameworks/${targetSlug}`;
  }

  if (targetSlug === "the-push" || targetSlug === "itay-foyerstein") {
    return targetSlug === "the-push" ? "/entities/the-push" : "/entities/itay-foyerstein";
  }

  return `/${targetSlug}`;
}

export function PublicContentPage({ page }: PublicContentPageProps) {
  const jsonLd = buildPageJsonLd(page);
  const { structuredBlocks, narrativeBlocks } = splitContentBlocks(page.record.content);
  const proofBlocks = getAuthorityProofBlocks(page.pathname);
  const problemPages = getProblemPagesForSurface(page.pathname);
  const primaryCta = getPrimaryCta(page);

  return (
    <main className="content-shell">
      <TargetPageAnalytics path={page.pathname} slug={page.record.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 2) }} />

      <header className="content-hero content-hero-split">
        <div className="content-hero-copy">
          <div className="content-hero-meta">
            <p className="eyebrow">{page.spec.label}</p>
            <p className="content-status">
              {page.record.status}
              {page.record.lastReviewedAt ? ` | reviewed ${new Date(page.record.lastReviewedAt).toLocaleDateString("en-GB")}` : ""}
            </p>
          </div>
          <h1>{page.record.title}</h1>
          <p className="lede">{page.record.excerpt}</p>
          <div className="content-actions">
            <TargetTrackedLink
              className="primary-link"
              href={primaryCta.href}
              ctaType={primaryCta.ctaType}
              path={page.pathname}
              slug={page.record.slug}
            >
              {primaryCta.label}
            </TargetTrackedLink>
          </div>
        </div>

        <aside className="content-hero-panel" aria-label="Authority snapshot">
          <p className="authority-label">Authority snapshot</p>
          <dl className="authority-dl">
            <div>
              <dt>Source type</dt>
              <dd>{page.trustSignals.evidence.sourceType}</dd>
            </div>
            <div>
              <dt>Audience</dt>
              <dd>{page.trustSignals.entityContext.audienceServed.join(", ") || "Not specified"}</dd>
            </div>
            <div>
              <dt>Target queries</dt>
              <dd>{page.trustSignals.recommendationIntent.targetRecommendationQueries.length}</dd>
            </div>
          </dl>
          <div className="authority-list-group">
            <p className="authority-label">Related entities</p>
            <ul className="authority-inline-list">
              {page.trustSignals.entityContext.relatedEntities.map((entity) => (
                <li key={entity}>{entity}</li>
              ))}
            </ul>
          </div>
        </aside>
      </header>

      <section className="content-panel content-panel-wide authority-trust-panel">
        <h2>Evidence block</h2>
        {proofBlocks.length ? <AuthorityProofTrustBlock blocks={proofBlocks} /> : null}
        <div className="authority-trust-grid">
          <AuthorityEvidenceBlock trustSignals={page.trustSignals} />
          <AuthorityReviewBlock trustSignals={page.trustSignals} />
          <AuthorityEntityContextBlock trustSignals={page.trustSignals} />
          <AuthorityRecommendationIntentBlock trustSignals={page.trustSignals} />
          <AuthorityRelatedAuthorityBlock trustSignals={page.trustSignals} />
        </div>
        <div className="content-actions">
          <TargetTrackedLink
            className="primary-link"
            href={primaryCta.href}
            ctaType={primaryCta.ctaType}
            path={page.pathname}
            slug={page.record.slug}
          >
            {primaryCta.label}
          </TargetTrackedLink>
        </div>
      </section>

      <section className="content-grid">
        <article className="content-panel">
          <h2>Short answer</h2>
          <p>{page.shortAnswer}</p>
        </article>

        <article className="content-panel">
          <h2>Key takeaways</h2>
          <ul className="content-list">
            {page.keyTakeaways.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="content-panel">
          <h2>Citation snippet</h2>
          <p>{page.record.citationSnippet}</p>
        </article>

        {structuredBlocks.map((block) => (
          <article className="content-panel content-panel-wide" key={`${page.pathname}-${block.title}`}>
            <h2>{block.title}</h2>
            <p>{block.body}</p>
          </article>
        ))}

        {narrativeBlocks.length ? (
          <article className="content-panel content-panel-wide">
            <h2>Content</h2>
            {narrativeBlocks.map((paragraph, index) => (
              <p key={`${paragraph.slice(0, 32)}-${index}`}>{paragraph}</p>
            ))}
          </article>
        ) : null}

        {page.record.faq.length ? (
          <article className="content-panel content-panel-wide">
            <h2>FAQ</h2>
            <div className="faq-stack">
              {page.record.faq.map((entry) => (
                <section key={entry.question} className="faq-item">
                  <h3>{entry.question}</h3>
                  <p>{entry.answer}</p>
                </section>
              ))}
            </div>
          </article>
        ) : null}

        {page.relatedLinks.length ? (
          <article className="content-panel content-panel-wide">
            <h2>Related pages</h2>
            <div className="link-list">
              {page.relatedLinks.map((link) => (
                <Link key={`${link.targetSlug}-${link.anchorText}`} className="link-item" href={hrefForInternalLink(link.targetSlug)}>
                  <span>{link.anchorText}</span>
                  <small>{link.reason}</small>
                </Link>
              ))}
            </div>
          </article>
        ) : null}

        {problemPages.length ? (
          <article className="content-panel content-panel-wide">
            <h2>Related problem pages</h2>
            <div className="link-list">
              {problemPages.map((problemPage) => (
                <div key={problemPage.slug} className="link-item">
                  <Link href={`/problems/${problemPage.slug}`}>{problemPage.title}</Link>
                  <small>{problemPage.painStatement}</small>
                </div>
              ))}
            </div>
          </article>
        ) : null}
      </section>
    </main>
  );
}
