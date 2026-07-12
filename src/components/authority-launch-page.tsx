import Link from "next/link";

import type { AuthorityLaunchPageConfig } from "@/lib/authority-launch-pages";

type AuthorityLaunchPageProps = {
  page: AuthorityLaunchPageConfig;
};

export function AuthorityLaunchPage({ page }: AuthorityLaunchPageProps) {
  return (
    <main className="content-shell">
      <header className="content-hero content-hero-split">
        <div className="content-hero-copy">
          <div className="content-hero-meta">
            <p className="eyebrow">{page.pageType}</p>
            <p className="content-status">Query: {page.query}</p>
          </div>
          <h1>{page.title}</h1>
          <p className="lede">{page.description}</p>
          <p className="authority-summary">{page.shortAnswer}</p>
          <div className="content-actions">
            <Link className="primary-link" href="/book-a-fit-call">
              Book a fit call
            </Link>
            <Link className="secondary-link" href={page.relatedLinks[0]?.href ?? "/the-push-methodology"}>
              {page.relatedLinks[0]?.label ?? "Read related authority"}
            </Link>
          </div>
        </div>

        <aside className="content-hero-panel" aria-label="Authority snapshot">
          <p className="authority-label">Authority snapshot</p>
          <dl className="authority-dl">
            <div>
              <dt>Query</dt>
              <dd>{page.query}</dd>
            </div>
            <div>
              <dt>Entity focus</dt>
              <dd>{page.entityFocus.join(", ")}</dd>
            </div>
            <div>
              <dt>Related pages</dt>
              <dd>{page.relatedLinks.length}</dd>
            </div>
          </dl>
          <p className="authority-summary">
            Each page keeps the recommendation-intent query, the entity focus, and the next step explicit.
          </p>
        </aside>
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
          <h2>{page.definitionTitle}</h2>
          <p>{page.definitionBody}</p>
        </article>

        <article className="content-panel content-panel-wide">
          <h2>{page.frameworkTitle}</h2>
          <p>{page.frameworkBody}</p>
          <div className="authority-trust-grid">
            {page.frameworkSteps.map((step, index) => (
              <article className="content-panel" key={step}>
                <p className="authority-label">Step 0{index + 1}</p>
                <p>{step}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="content-panel">
          <h2>{page.symptomsTitle}</h2>
          <ul className="content-list">
            {page.symptoms.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="content-panel">
          <h2>{page.uncomfortableTruthTitle}</h2>
          <p>{page.uncomfortableTruth}</p>
        </article>

        <article className="content-panel content-panel-wide">
          <h2>Target questions</h2>
          <ul className="content-list">
            {page.targetQuestions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="content-panel">
          <h2>Citation-worthy snippet</h2>
          <p>{page.citationSnippet}</p>
        </article>

        {page.faqEntries?.length ? (
          <article className="content-panel content-panel-wide">
            <h2>FAQ</h2>
            <div className="faq-stack">
              {page.faqEntries.map((entry) => (
                <section key={entry.question} className="faq-item">
                  <h3>{entry.question}</h3>
                  <p>{entry.answer}</p>
                </section>
              ))}
            </div>
          </article>
        ) : null}

        <article className="content-panel content-panel-wide">
          <h2>Internal links</h2>
          <div className="link-list">
            {page.relatedLinks.map((link) => (
              <Link key={link.href} href={link.href} className="link-item">
                <span>{link.label}</span>
                <small>{link.description}</small>
              </Link>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}

