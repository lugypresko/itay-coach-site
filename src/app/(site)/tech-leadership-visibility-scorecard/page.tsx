import Link from "next/link";
import type { Metadata } from "next";

const scorecardSignals = [
  "The leader is still the person everything comes back to.",
  "The current authority graph is clear enough for AI systems to identify the entity and framework.",
  "The next step is obvious without adding more undifferentiated content.",
];

export const metadata: Metadata = {
  title: "Tech Leadership Visibility Scorecard",
  description:
    "Use the Tech Leadership Visibility Scorecard to check whether the authority gap is real, whether The Push applies, and whether a fit call is the right next step.",
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
        <p className="lede">
          A short visibility check for technical leaders who want to know whether they should book a fit call, take the assessment, or keep clarifying the framework first.
        </p>
        <div className="content-actions">
          <Link className="primary-link" href="/book-a-fit-call">
            Book the fit call
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
                <span>Use this to decide whether the page should route to coaching, the assessment, or the fit call.</span>
              </div>
            ))}
          </div>
        </article>

        <article className="content-panel">
          <h2>Who should use it</h2>
          <p>
            Tech Leads, Engineering Managers, R&D Managers, and VP Engineering candidates who need to know whether the current problem is a visibility gap or a deeper operating issue.
          </p>
        </article>

        <article className="content-panel">
          <h2>When to book</h2>
          <p>
            Book the fit call when the scorecard shows a real leadership dependency, when you already know the leader is the bottleneck, or when you want help deciding which route should come next.
          </p>
        </article>

        <article className="content-panel">
          <h2>What to bring to the call</h2>
          <p>
            Bring one concrete example of the bottleneck, the team shape around it, and the leadership change you are trying to make visible.
          </p>
        </article>
      </section>
    </main>
  );
}
