import type { PageBrief } from "@/ai/agents";

export function PageBriefLaunchPage({ brief }: { brief: PageBrief }) {
  // AUTHENTICATED INTERNAL PREVIEW ONLY: Blocked for all regular routes by the calling page guard.
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <main className="content-shell" style={{ border: "2px solid red", padding: "1rem" }}>
      <div style={{ background: "red", color: "white", padding: "0.5rem", marginBottom: "2rem" }}>
        INTERNAL BRIEF PREVIEW - DO NOT PUBLISH
      </div>
      <header className="content-hero">
        <p className="eyebrow">Brief ID: {brief.id}</p>
        <h1>{brief.title}</h1>
        <p className="lede">{brief.marketContext.summary}</p>
      </header>

      <section className="content-grid">
        <article className="content-panel content-panel-wide">
          <h2>Audience Pain</h2>
          <p>{brief.audiencePain.summary}</p>
        </article>

        {brief.contentPlan.map((section) => (
          <article className="content-panel" key={section.sectionTitle}>
            <h2>Sub-section: {section.sectionTitle}</h2>
            <p>Goal: {section.purpose}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
