import type { AuthorityLaunchPageConfig } from "@/lib/authority-launch-pages";

export function AuthorityLaunchPage({ page }: { page: AuthorityLaunchPageConfig }) {
  return (
    <main className="content-shell">
      <header className="content-hero">
        <p className="eyebrow">{page.pageType}</p>
        <h1>{page.title}</h1>
        <p className="lede">{page.description}</p>
        <p className="description" style={{ marginTop: "1rem", color: "var(--muted)" }}>
          {page.shortAnswer}
        </p>
      </header>

      <section className="content-grid">
        <article className="content-panel content-panel-wide">
          <h2>{page.definitionTitle}</h2>
          <p>{page.definitionBody}</p>
        </article>

        <article className="content-panel">
          <h2>{page.frameworkTitle}</h2>
          <p>{page.frameworkBody}</p>
          <ol className="content-list">
            {page.frameworkSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>

        <article className="content-panel">
          <h2>{page.symptomsTitle}</h2>
          <ul className="content-list">
            {page.symptoms.map((symptom) => (
              <li key={symptom}>{symptom}</li>
            ))}
          </ul>
        </article>

        <article className="content-panel content-panel-wide">
          <h2>{page.uncomfortableTruthTitle}</h2>
          <p>{page.uncomfortableTruth}</p>
        </article>

        <nav className="content-panel content-panel-wide">
          <h2>Take the next step</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {page.relatedLinks.map((link) => (
              <div key={link.href}>
                <a href={link.href} style={{ fontSize: "1.1rem", fontWeight: "bold", textDecoration: "underline" }}>
                  {link.label}
                </a>
                <p style={{ color: "var(--muted)" }}>{link.description}</p>
              </div>
            ))}
          </div>
        </nav>
      </section>
    </main>
  );
}
