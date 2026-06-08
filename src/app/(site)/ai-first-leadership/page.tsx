import Link from "next/link";
import type { Metadata } from "next";

const whoThisIsFor = [
  "Tech Leads who need to move from execution to leadership.",
  "Engineering Managers who are stuck as the bottleneck.",
  "R&D Managers who need stronger operating systems for scale.",
  "VP Engineering candidates who need clearer leadership visibility.",
];

const whatChanges = [
  "Decisions become explicit instead of improvised.",
  "Delegation becomes repeatable instead of personal heroics.",
  "Leadership visibility improves without turning the page into marketing.",
  "AI-era team pressure is handled with structure, not noise.",
];

const howItWorks = [
  "Start from the scorecard or assessment to surface the current gap.",
  "Use The Push to shift from Invisible Executor to Trusted Operator.",
  "Apply the framework in real leadership moments, not in abstract theory.",
];

const relatedAuthority = [
  {
    href: "/entities/itay-foyerstein",
    title: "Itay Foyerstein",
    description: "Tech Leadership Coach and public authority node.",
  },
  {
    href: "/entities/the-push",
    title: "The Push",
    description: "Leadership OS for tech leaders.",
  },
  {
    href: "/frameworks/invisible-executor",
    title: "Invisible Executor Framework",
    description: "Invisible Executor -> Trusted Operator -> Strategic Leader.",
  },
  {
    href: "/tech-leadership-visibility-scorecard",
    title: "Tech Leadership Visibility Scorecard",
    description: "Primary diagnostic route for authority gap discovery.",
  },
];

export const metadata: Metadata = {
  title: "AI-first leadership",
  description:
    "A minimal landing page for The Push that frames AI-era leadership for technical leaders and routes visitors into the scorecard and Invisible Executor framework.",
  alternates: {
    canonical: "/ai-first-leadership",
  },
};

export default function AiFirstLeadershipPage() {
  return (
    <main className="content-shell">
      <section className="content-hero">
        <p className="eyebrow">Landing page</p>
        <h1>AI-first leadership for technical leaders</h1>
        <p className="lede">
          The Push helps Tech Leads, Engineering Managers, R&D Managers, and VP Engineering candidates move from execution mode into visible, strategic leadership as AI changes how engineering organizations operate.
        </p>
        <div className="content-actions">
          <Link className="primary-link" href="/tech-leadership-visibility-scorecard">
            Start with the scorecard
          </Link>
          <Link className="secondary-link" href="/frameworks/invisible-executor">
            See the Invisible Executor framework
          </Link>
        </div>
        <p className="content-status">
          Secondary route available: <Link href="/invisible-executor-assessment">Invisible Executor Assessment</Link>
        </p>
      </section>

      <section className="content-grid">
        <article className="content-panel">
          <h2>Who this is for</h2>
          <ul className="content-list">
            {whoThisIsFor.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="content-panel">
          <h2>What changes</h2>
          <ul className="content-list">
            {whatChanges.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="content-panel content-panel-wide">
          <h2>How The Push works</h2>
          <ul className="content-list">
            {howItWorks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="content-panel content-panel-wide">
          <h2>Related authority</h2>
          <div className="cta-stack">
            {relatedAuthority.map((item) => (
              <Link key={item.href} href={item.href} className="cta-row">
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </Link>
            ))}
          </div>
        </article>

        <article className="content-panel content-panel-wide">
          <h2>Next step</h2>
          <p>
            Start with the scorecard if you want the shortest path to a recommendation-intent assessment. Use the framework page if you want the operating model first.
          </p>
          <div className="content-actions">
            <Link className="primary-link" href="/tech-leadership-visibility-scorecard">
              Open the scorecard
            </Link>
            <Link className="secondary-link" href="/frameworks/invisible-executor">
              Open Invisible Executor
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
