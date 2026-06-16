import Link from "next/link";
import type { Metadata } from "next";

const steps = [
  "Spot where execution still comes back to you.",
  "See which decisions are still invisible in the operating system.",
  "Use the result to decide whether the next step is coaching, the scorecard, or a fit call.",
];

export const metadata: Metadata = {
  title: "Invisible Executor Assessment",
  description: "A short diagnostic for managers stuck in execution mode.",
  alternates: {
    canonical: "/invisible-executor-assessment",
  },
};

export default function InvisibleExecutorAssessmentPage() {
  return (
    <main className="content-shell">
      <header className="content-hero">
        <div className="content-hero-meta">
          <p className="eyebrow">Secondary CTA</p>
          <p className="content-status">Assessment</p>
        </div>
        <h1>Invisible Executor Assessment</h1>
        <p className="lede">A short diagnostic for managers stuck in execution mode.</p>
        <div className="content-actions">
          <Link className="primary-link" href="/player-trap">
            Start with Player Trap
          </Link>
          <Link className="secondary-link" href="/tech-leadership-visibility-scorecard">
            Open the scorecard
          </Link>
        </div>
      </header>

      <section className="content-grid">
        <article className="content-panel content-panel-wide">
          <h2>What this check is for</h2>
          <div className="offer-grid">
            {steps.map((step, index) => (
              <article className={`offer${index === 1 ? " offer--featured" : ""}`} key={step}>
                <div className="offer-number">
                  <span>Step</span>
                  <span>0{index + 1}</span>
                </div>
                <h3>0{index + 1}</h3>
                <p className="for">{step}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="content-panel">
          <h2>What it reveals</h2>
          <ul className="content-list">
            <li>Whether execution pressure is still concentrated in the leader.</li>
            <li>Whether strategic leadership is visible enough to explain clearly.</li>
            <li>Whether the problem should be solved through The Push or a broader operating change.</li>
          </ul>
        </article>

        <article className="content-panel">
          <h2>Next step</h2>
          <p>Use the assessment as the fastest route into the framework, then move to the fit call if the dependency is clear.</p>
        </article>
      </section>
    </main>
  );
}
