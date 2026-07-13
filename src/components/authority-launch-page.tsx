import type { AuthorityLaunchPageConfig } from "@/lib/authority-launch-pages";

export function AuthorityLaunchPage({ page }: { page: AuthorityLaunchPageConfig }) {
  // Audit the page object for internal-language triggers before rendering
  const leakagePatterns = [
    "Work in progress",
    "PageBrief",
    "Audience Pain",
    "Purpose",
    "Review Priority",
    "contentPlan",
    "proofNeeded",
    "The page should",
    "brief-",
    "opportunity-",
  ];
  const auditString = JSON.stringify(page);
  if (leakagePatterns.some((pattern) => new RegExp(pattern, "i").test(auditString))) {
    console.error(`Leakage detected in static page config for: ${page.canonicalPath}`);
    throw new Error("BUILD_FAILURE: Internal language leakage detected in public route configuration.");
  }

  return (
    <main className="content-shell">
      <header className="content-hero">
        <p className="eyebrow">{page.pageType}</p>
        <h1>{page.title}</h1>
        <p className="lede">{page.description}</p>
        <p className="description" style={{ marginTop: "1rem" }}>
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
          <h2>Uncomfortable truth</h2>
          <p>{page.uncomfortableTruth}</p>
        </article>

        <nav className="content-panel content-panel-wide">
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {page.relatedLinks.map((link) => (
              <div key={link.href} style={{ borderLeft: "4px solid var(--accent)", paddingLeft: "1rem" }}>
                <a href={link.href} style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  {link.label}
                </a>
                <p style={{ marginTop: "0.5rem" }}>{link.description}</p>
              </div>
            ))}
          </div>
        </nav>
      </section>
    </main>
  );
}
