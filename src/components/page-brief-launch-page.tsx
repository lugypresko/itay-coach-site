import type { PageBrief } from "@/ai/agents";

export function PageBriefLaunchPage({ brief }: { brief: PageBrief }) {
  return (
    <main className="content-shell">
      <header className="content-hero">
        <p className="eyebrow">Work in progress: {brief.id}</p>
        <h1>{brief.title}</h1>
        <p className="lede">{brief.marketContext.summary}</p>
      </header>

      <section className="content-grid">
        <article className="content-panel content-panel-wide">
          <h2>Audience Pain</h2>
          <p>{brief.audiencePain.summary}</p>
          <ul className="content-list" style={{ marginTop: "1rem" }}>
            {brief.audiencePain.painThemes.map((theme) => (
              <li key={theme}>{theme}</li>
            ))}
          </ul>
        </article>

        {brief.contentPlan.map((section) => (
          <article className="content-panel" key={section.sectionTitle}>
            <h2>{section.sectionTitle}</h2>
            <p style={{ fontStyle: "italic", color: "var(--muted)" }}>Purpose: {section.purpose}</p>
            <ul className="content-list" style={{ marginTop: "0.5rem" }}>
              {section.proofNeeded.map((proof) => (
                <li key={proof}>{proof}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <footer style={{ marginTop: "4rem", padding: "2rem", borderTop: "1px solid var(--border)", color: "var(--muted)" }}>
        <p>Review Priority: {brief.reviewStatus}</p>
        <p>Canonical Path: {brief.canonicalPath}</p>
      </footer>
    </main>
  );
}
