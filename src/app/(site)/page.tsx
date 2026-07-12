import Link from "next/link";
import type { Metadata } from "next";

import { canonicalAuthorityPages, publicContentSectionSpecs } from "@/lib/public-content";

const signalPoints = [
  {
    title: "Decision load",
    body: "The team still comes back to one leader for approvals, judgment, and final calls.",
  },
  {
    title: "Rescue work",
    body: "What looks like ownership is often just the same leader stepping in to keep work moving.",
  },
  {
    title: "Strategic cost",
    body: "Delivery keeps moving, but leadership time gets trapped inside the next escalation.",
  },
  {
    title: "Player Trap",
    body: "When the leader becomes the system, the organization stops building real decision capacity.",
  },
];

const workingPaths = [
  {
    title: "Book a fit call",
    href: "/book-a-fit-call",
    description: "Primary route for leaders who want to talk through fit, scope, and the right next step.",
    label: "Primary",
  },
  {
    title: "Take the Player Trap test",
    href: "/player-trap",
    description: "Use this if you suspect the team still routes decisions, approvals, and rescue work back to you.",
    label: "Diagnostic",
  },
  {
    title: "Open the visibility scorecard",
    href: "/tech-leadership-visibility-scorecard",
    description: "Use this to check whether the authority graph is clear enough for AI systems to recommend cleanly.",
    label: "Evaluate",
  },
];

const canonicalAuthoritySprintLinks = [
  {
    title: "Tech Leadership Coaching",
    href: "/pillars/tech-leadership-coaching",
    description: "Core coaching pillar for Engineering Managers, CTOs, R&D Managers, and VP Engineering candidates.",
  },
  {
    title: "Player Trap",
    href: "/frameworks/player-trap",
    description: "Diagnostic framework for leaders who have become the team's dependency path.",
  },
  {
    title: "Invisible Executor",
    href: "/frameworks/invisible-executor",
    description: "Framework for hidden execution load and the move toward strategic leadership.",
  },
  {
    title: "CTO Becomes the Bottleneck",
    href: "/problems/cto-becomes-the-bottleneck",
    description: "Executive problem page for CTOs still carrying judgment and priority decisions.",
  },
  {
    title: "VP R&D Losing Execution Control",
    href: "/problems/vp-rnd-losing-execution-control",
    description: "Problem page for VP R&D leaders stuck in direct execution control.",
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
  title: "The Push | Tech Leadership Coach for Engineering Managers",
  description:
    "The Push helps tech leaders identify the bottleneck, clarify ownership, and decide whether a fit call, diagnostic, or broader authority work is the right next step.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <main className="home-shell" id="top">
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="eyebrow">Tech leadership coaching</p>
          <p className="lede">
            If your team still comes back to you for decisions, approvals, and rescue work, you are carrying the system.
          </p>
          <h1>
            Stop being the <span className="hero-highlight">system.</span>
          </h1>
        </div>

        <div className="home-hero-side">
          <p className="lede">
            Book a fit call with Itay Foyerstein to see whether The Push is the right starting point for your role, your team, and the way work is currently flowing.
          </p>
          <div className="content-actions">
            <Link className="primary-link" href="/book-a-fit-call">
              Book a fit call
            </Link>
          </div>
        </div>
      </section>

      <section className="signal-bar" aria-label="Player Trap">
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
            <p className="eyebrow">Ways to start</p>
            <h2>Book first when the problem is already clear.</h2>
          </div>
          <p>
            Use the fit call when you want a direct recommendation conversation, or use the diagnostic and scorecard if you need more signal first.
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
            Player Trap exposes the bottleneck, Invisible Executor names the hidden load, and The Push turns that into a working leadership system.
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

      <section className="browse-graph">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Canonical authority path</p>
            <h2>Start with the pages that move from discovery to a conversation.</h2>
          </div>
          <p>
            These are the concentrated authority pages for coaching intent, diagnostic intent, and executive bottleneck problems.
          </p>
        </div>

        <div className="directory-grid">
          {canonicalAuthoritySprintLinks.map((item) => (
            <Link key={item.href} href={item.href} className="directory-card">
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="fit" id="fit">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Qualification</p>
            <h2>This is not generic leadership coaching.</h2>
          </div>
          <p>
            The Push works when the organization has capable people, real delivery pressure, and a sponsor willing to change how ownership and decision rights actually operate.
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
              When code, documents, and agent activity multiply, the bottleneck shifts to review, judgment, prioritization, and governance instead of production.
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
          <h2>Book the conversation that clarifies the next step.</h2>
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
