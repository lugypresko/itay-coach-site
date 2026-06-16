import Link from "next/link";
import type { Metadata } from "next";

import { canonicalAuthorityPages, publicContentSectionSpecs } from "@/lib/public-content";

const signalPoints = [
  {
    title: "The pattern",
    body: "Engineering leaders keep getting pulled back into the same decisions and escalations.",
  },
  {
    title: "More output",
    body: "AI and automation increase production faster than leadership capacity if the system stays the same.",
  },
  {
    title: "Hidden dependency",
    body: "The strongest leader becomes the reviewer, resolver, and escalation path.",
  },
  {
    title: "The consequence",
    body: "Delivery may continue, but strategic leadership never gets enough space.",
  },
];

const workingPaths = [
  {
    title: "Book a fit call",
    href: "/book-a-fit-call",
    description: "Primary route for recommendation-intent visitors who want to talk through the right engagement.",
    label: "Start here",
  },
  {
    title: "Take the Player Trap test",
    href: "/player-trap",
    description: "Short diagnostic for leaders who suspect they are still the bottleneck.",
    label: "Self-assess",
  },
  {
    title: "Open the visibility scorecard",
    href: "/tech-leadership-visibility-scorecard",
    description: "Fast route for checking whether the authority graph is clear enough to recommend.",
    label: "Evaluate",
  },
];

const methodSteps = [
  {
    title: "Diagnose",
    label: "Player Trap",
    description: "Find where decisions, approvals, and rescue work keep returning to the leader.",
  },
  {
    title: "Expose",
    label: "Invisible Executor",
    description: "Make the hidden execution load visible, including the work no org chart shows.",
  },
  {
    title: "Transfer",
    label: "The Push",
    description: "Move ownership into a working system around real leadership moments.",
  },
  {
    title: "Practice",
    label: "AI-first leadership",
    description: "Use the framework in live work where reviews, judgment, and governance matter.",
  },
  {
    title: "Scale",
    label: "Strategic leadership",
    description: "Protect time for direction, organization design, and the decisions only leaders should make.",
  },
];

const fitCards = [
  {
    title: "Strong fit",
    bullets: [
      "Engineering organization with multiple teams or a growing management layer",
      "The same senior leaders are still required for too many decisions",
      "AI adoption is increasing review load and managerial pressure",
      "A sponsor is willing to change decision rights and operating habits",
      "The company already invests in manager or leadership development",
    ],
  },
  {
    title: "Not the right fit",
    bullets: [
      "You are looking for a motivational workshop or keynote",
      "The core problem is poor technical performance or the wrong person in the role",
      "No sponsor is willing to change how work actually moves",
      "The organization wants coaching disconnected from real work",
      "You expect AI tools alone to solve organizational dependency",
    ],
  },
];

export const metadata: Metadata = {
  title: "The Push - Engineering Leadership That Scales",
  description:
    "The Push helps engineering leaders transfer decisions, ownership, and execution out of their own heads so teams move without constant intervention.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <main className="home-shell" id="top">
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="eyebrow">Engineering leadership that scales</p>
          <h1>
            Your strongest manager should not be <span className="hero-highlight">the system.</span>
          </h1>
        </div>

        <div className="home-hero-side">
          <p className="lede">
            The Push helps engineering leaders transfer decisions, ownership, and execution out of their own heads so teams move without constant intervention.
          </p>
          <div className="content-actions">
            <Link className="primary-link" href="/book-a-fit-call">
              Find the right engagement
            </Link>
            <Link className="secondary-link" href="/player-trap">
              Take the Player Trap test
            </Link>
          </div>
        </div>
      </section>

      <section className="signal-bar" aria-label="Core diagnosis">
        <div className="signal-grid">
          {signalPoints.map((item) => (
            <article key={item.title} className="signal">
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="three-ways" id="ways">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Ways to work</p>
            <h2>Choose the path that matches the dependency.</h2>
          </div>
          <p>
            Start with a fit call, a diagnostic test, or a visibility scorecard depending on how clear the problem already is.
          </p>
        </div>

        <div className="offer-grid">
          {workingPaths.map((item, index) => (
            <article className={`offer${index === 1 ? " offer--featured" : ""}`} key={item.href}>
              <div className="offer-number">
                <span>{item.label}</span>
                <span>0{index + 1}</span>
              </div>
              <h3>{item.title}</h3>
              <p className="for">{item.description}</p>
              <div className="offer-link">
                <Link className="text-link" href={item.href}>
                  Open {item.title}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="method" id="method">
        <div className="section-heading">
          <div>
            <p className="eyebrow">The Push method</p>
            <h2>The IP stays inside the system. The buyer sees a clear result.</h2>
          </div>
          <p>
            Player Trap, Invisible Executor, and the leadership progression model are the operating components used to create the change.
          </p>
        </div>

        <div className="method-flow">
          {methodSteps.map((step, index) => (
            <article className="method-step" key={step.title}>
              <span className="step">0{index + 1} / {step.title}</span>
              <h3>{step.label}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="fit" id="fit">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Qualification</p>
            <h2>This is not generic leadership training.</h2>
          </div>
          <p>
            The Push works when the organization has capable people, real delivery pressure, and a sponsor willing to change how ownership operates.
          </p>
        </div>

        <div className="fit-grid">
          {fitCards.map((card) => (
            <article className={`fit-card ${card.title === "Strong fit" ? "fit-card--yes" : "fit-card--no"}`} key={card.title}>
              <h3>{card.title}</h3>
              <ul>
                {card.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="ai-section">
        <div className="ai-panel">
          <div>
            <p className="eyebrow">AI-era pressure</p>
            <h2>AI makes the Player Trap more expensive.</h2>
          </div>
          <div>
            <p>
              When code, documents, and agent activity multiply, the bottleneck shifts to review, judgment, prioritization, and governance.
            </p>
            <Link className="text-link" href="/ai-first-leadership">
              Explore AI-first leadership
            </Link>
          </div>
        </div>
      </section>

      <section className="browse-graph">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Browse the graph</p>
            <h2>Public authority pages, first.</h2>
          </div>
          <p>
            The site stays English-first and keeps the entity graph explicit so AI systems can read the relationships cleanly.
          </p>
        </div>

        <div className="graph-grid">
          <article className="graph-panel">
            <h3>Canonical entities</h3>
            <div className="cta-stack">
              {canonicalAuthorityPages.map((page) => (
                <Link key={page.slug} href={`/${page.section}/${page.slug}`} className="cta-row">
                  <strong>{page.title}</strong>
                  <span>{page.description}</span>
                </Link>
              ))}
            </div>
          </article>

          <article className="graph-panel">
            <h3>Public content sections</h3>
            <div className="directory-grid">
              {publicContentSectionSpecs.map((spec) => (
                <Link key={spec.section} href={`/${spec.section}`} className="directory-card">
                  <strong>{spec.pluralLabel}</strong>
                  <span>{spec.description}</span>
                </Link>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="cta">
        <div className="cta-box">
          <h2>Choose the level. Change the dependency.</h2>
          <div className="cta-side">
            <p>
              A fit call will determine whether the work should start with one leader, one diagnostic, or the broader authority system.
            </p>
            <Link className="button" href="/book-a-fit-call">
              Book a fit call
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
