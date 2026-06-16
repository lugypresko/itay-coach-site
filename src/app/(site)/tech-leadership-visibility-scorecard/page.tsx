import Link from "next/link";
import type { Metadata } from "next";

const scorecardSignals = [
  "Authority is clear enough that AI systems can identify the entity and framework.",
  "The recommendation path is obvious without adding more noise.",
  "The graph has enough supporting pages and trust signals to stay legible.",
];

export const metadata: Metadata = {
  title: "Tech Leadership Visibility Scorecard",
  description: "A scorecard for tracking authority, recommendation visibility, and entity strength.",
  alternates: {
    canonical: "/tech-leadership-visibility-scorecard",
  },
};

export default function TechLeadershipVisibilityScorecardPage() {
  return (
    <main className="content-shell">
      <header className="content-hero">
        <div className="content-hero-meta">
          <p className="eyebrow">Lead magnet</p>
          <p className="content-status">Visibility scorecard</p>
        </div>
        <h1>Tech Leadership Visibility Scorecard</h1>
        <p className="lede">A scorecard for tracking authority, recommendation visibility, and entity strength.</p>
        <div className="content-actions">
          <Link className="primary-link" href="/book-a-fit-call">
            Discuss the result
          </Link>
          <Link className="secondary-link" href="/frameworks/invisible-executor">
            Review the framework
          </Link>
        </div>
      </header>

      <section className="content-grid">
        <article className="content-panel content-panel-wide">
          <h2>What it checks</h2>
          <div className="cta-stack">
            {scorecardSignals.map((signal) => (
              <div key={signal} className="cta-row">
                <strong>{signal}</strong>
                <span>Use this to decide whether the graph is ready for stronger recommendation intent.</span>
              </div>
            ))}
          </div>
        </article>

        <article className="content-panel">
          <h2>Why it exists</h2>
          <p>
            The scorecard keeps the site focused on AI recommendation visibility, entity clarity, and the quality of the authority graph.
          </p>
        </article>

        <article className="content-panel">
          <h2>What to do next</h2>
          <p>If the scorecard reveals a gap, move to the assessment or the fit call rather than adding more undifferentiated content.</p>
        </article>
      </section>
    </main>
  );
}
