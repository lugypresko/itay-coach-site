import React from "react";
import Link from "next/link";

import { TargetPageAnalytics, TargetTrackedLink } from "@/components/target-page-analytics";
import type { ReaderFacingPublicContentPage } from "@/lib/reader-facing-publication";

type PublicContentPageProps = {
  page: ReaderFacingPublicContentPage;
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

    structuredBlocks.push({ title, body: match[2] });
  }

  return { structuredBlocks, narrativeBlocks };
}

export function PublicContentPage({ page }: PublicContentPageProps) {
  const { structuredBlocks, narrativeBlocks } = splitContentBlocks(page.content);

  return (
    <main className="content-shell">
      <TargetPageAnalytics path={page.pathname} slug={page.slug} />
      {page.jsonLd.length ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(page.jsonLd, null, 2) }} />
      ) : null}

      <header className="content-hero content-hero-split">
        <div className="content-hero-copy">
          <h1>{page.title}</h1>
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
        </div>
      </header>

      <section className="content-grid">
        {structuredBlocks.map((block) => (
          <article className="content-panel content-panel-wide" key={`${page.pathname}-${block.title}`}>
            <h2>{block.title}</h2>
            <p>{block.body}</p>
          </article>
        ))}

        {narrativeBlocks.length ? (
          <article className="content-panel content-panel-wide">
            {narrativeBlocks.map((paragraph, index) => (
              <p key={`${paragraph.slice(0, 32)}-${index}`}>{paragraph}</p>
            ))}
          </article>
        ) : null}

        {page.relatedLinks.length ? (
          <nav className="content-panel content-panel-wide" aria-label="Related pages">
            <h2>Related pages</h2>
            <div className="link-list">
              {page.relatedLinks.map((link) => (
                <Link key={`${link.href}-${link.label}`} className="link-item" href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        ) : null}
      </section>
    </main>
  );
}
