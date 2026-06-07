import Link from "next/link";

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

export function PublicContentPage({ page }: PublicContentPageProps) {
  const jsonLd = buildPageJsonLd(page);

  return (
    <main className="content-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 2) }}
      />
      <header className="content-hero">
        <div className="content-hero-meta">
          <p className="eyebrow">{page.spec.label}</p>
          <p className="content-status">
            {page.record.status}
            {page.record.lastReviewedAt ? ` · reviewed ${new Date(page.record.lastReviewedAt).toLocaleDateString("en-GB")}` : ""}
          </p>
        </div>
        <h1>{page.record.title}</h1>
        <p className="lede">{page.record.excerpt}</p>
        <div className="content-actions">
          <Link className="primary-link" href="/book-a-fit-call">
            Book a fit call
          </Link>
          <Link className="secondary-link" href="/invisible-executor-assessment">
            Invisible Executor Assessment
          </Link>
        </div>
      </header>

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

        <article className="content-panel content-panel-wide">
          <h2>Content</h2>
          {toParagraphs(page.record.content).map((paragraph, index) => (
            <p key={`${paragraph.slice(0, 32)}-${index}`}>{paragraph}</p>
          ))}
        </article>

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
            <h2>Internal links</h2>
            <div className="link-list">
              {page.relatedLinks.map((link) => (
                <div key={`${link.targetSlug}-${link.anchorText}`} className="link-item">
                  <span>{link.anchorText}</span>
                  <small>{link.reason}</small>
                </div>
              ))}
            </div>
          </article>
        ) : null}
      </section>
    </main>
  );
}

