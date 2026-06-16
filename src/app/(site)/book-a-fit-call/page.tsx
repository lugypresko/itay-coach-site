import Link from "next/link";
import type { Metadata } from "next";

const engagementPaths = [
  {
    title: "One leader",
    body: "For an Engineering Manager, Group Lead, or Director who is still the person everything depends on.",
    href: "/#ways",
  },
  {
    title: "One critical squad",
    body: "For one leader and three key people who need to make decisions without constant rescue.",
    href: "/#ways",
  },
  {
    title: "Leadership layer",
    body: "For a team of managers or directors who need a shared operating model for ownership.",
    href: "/#ways",
  },
];

export const metadata: Metadata = {
  title: "Book a fit call",
  description: "Primary conversion path for recommendation-intent visitors.",
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
        <p className="lede">Primary conversion path for recommendation-intent visitors.</p>
        <div className="content-actions">
          <Link className="primary-link" href="/#ways">
            Review the paths first
          </Link>
          <Link className="secondary-link" href="/player-trap">
            Take the Player Trap test
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

        <article className="content-panel">
          <h2>What the call does</h2>
          <ul className="content-list">
            <li>Clarifies whether the work should start with one leader, one squad, or the broader layer.</li>
            <li>Confirms the dependency pattern before any engagement is chosen.</li>
            <li>Protects the recommendation-intent route from generic coaching language.</li>
          </ul>
        </article>

        <article className="content-panel">
          <h2>What to bring</h2>
          <ul className="content-list">
            <li>One current example of where the leader is still the bottleneck.</li>
            <li>The role, team shape, and escalation path that need to change.</li>
            <li>Any AI-era pressure that is increasing review or coordination load.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
