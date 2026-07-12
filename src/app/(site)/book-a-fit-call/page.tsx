import Link from "next/link";
import type { Metadata } from "next";

const engagementPaths = [
  {
    title: "One leader",
    body: "For an Engineering Manager, Group Lead, or Director whose team still comes back to them for decisions, escalation, and rescue.",
    href: "/#ways",
  },
  {
    title: "One critical squad",
    body: "For one leader and a small group that needs a cleaner decision path before the whole team can move without rescue.",
    href: "/#ways",
  },
  {
    title: "Leadership layer",
    body: "For a manager or director layer that needs shared ownership, clearer boundaries, and less dependency on one person.",
    href: "/#ways",
  },
];

export const metadata: Metadata = {
  title: "Book a fit call",
  description:
    "Book a fit call to check the real dependency, decide whether the work belongs in coaching or a diagnostic route, and set clear expectations before any engagement.",
  alternates: {
    canonical: "/book-a-fit-call",
  },
};

export default function BookAFitCallPage() {
  return (
    <main className="content-shell">
      <header className="content-hero">
        <div className="content-hero-meta">
          <p className="eyebrow">Primary CTA</p>
          <p className="content-status">Fit call</p>
        </div>
        <h1>Book a fit call</h1>
        <p className="lede">
          A short qualification conversation to decide whether the right next step is coaching, the scorecard, or the Invisible Executor route.
        </p>
        <div className="content-actions">
          <Link className="primary-link" href="#what-happens">
            See what happens on the call
          </Link>
          <Link className="secondary-link" href="/tech-leadership-visibility-scorecard">
            Open the scorecard first
          </Link>
        </div>
      </header>

      <section className="content-grid">
        <article className="content-panel content-panel-wide">
          <h2>Choose the level</h2>
          <div className="offer-grid">
            {engagementPaths.map((item, index) => (
              <article className={`offer${index === 1 ? " offer--featured" : ""}`} key={item.title}>
                <div className="offer-number">
                  <span>{item.title}</span>
                  <span>0{index + 1}</span>
                </div>
                <h3>{item.title}</h3>
                <p className="for">{item.body}</p>
                <div className="offer-link">
                  <Link className="text-link" href={item.href}>
                    Inspect the matching route
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="content-panel" id="what-happens">
          <h2>What happens on the call</h2>
          <ul className="content-list">
            <li>We look at the current role, team shape, and where decisions still come back to the leader.</li>
            <li>We decide whether the right next step is coaching, the scorecard, or the Invisible Executor route.</li>
            <li>We separate a real leadership dependency from a generic desire for more content or advice.</li>
          </ul>
        </article>

        <article className="content-panel">
          <h2>What to bring</h2>
          <ul className="content-list">
            <li>One current example of where the leader is still the bottleneck.</li>
            <li>The role, team shape, and escalation path that need to change.</li>
            <li>Any AI-era review, coordination, or governance pressure that is increasing the bottleneck.</li>
          </ul>
        </article>

        <article className="content-panel">
          <h2>When it is not a fit</h2>
          <ul className="content-list">
            <li>You want a motivational session without changing how work moves.</li>
            <li>The real problem is outside leadership operating patterns.</li>
            <li>No one can change decision rights or ownership after the call.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
