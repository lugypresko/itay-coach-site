import Link from "next/link";
import type { Metadata } from "next";

const signals = [
  {
    title: "The pattern",
    text: "You hired managers, but the same decisions still climb to the same few people.",
  },
  {
    title: "More output",
    text: "AI and automation increase production faster than leadership capacity.",
  },
  {
    title: "Hidden dependency",
    text: "The strongest leader becomes the reviewer, resolver, and escalation path.",
  },
  {
    title: "The consequence",
    text: "Delivery may continue, but strategic leadership never gets enough space.",
  },
];

const engagements = [
  {
    eyebrow: "For one leader",
    number: "01",
    title: "Strategic Leadership Sprint",
    forWhom:
      "For an Engineering Manager, Group Lead, or Director who is still the person too much work depends on.",
    promise:
      "In 8 weeks, identify the recurring work that keeps pulling the leader back into execution and rebuild the role around strategic leadership.",
    points: [
      "Player Trap diagnostic and leadership audit",
      "Weekly workplace experiments",
      "Decision and ownership map",
      "90-day operating plan",
    ],
    duration: "8 weeks",
    actionHref: "/book-a-fit-call?engagement=leader",
    actionLabel: "Discuss one leader",
  },
  {
    eyebrow: "For one critical squad",
    number: "02",
    title: "Squad 1+3 Execution Sprint",
    forWhom:
      "For one leader and three key people who need to make decisions and own outcomes without constant rescue.",
    promise:
      "In 8 weeks, move 3-5 recurring decision areas from one overloaded leader into a working squad operating system.",
    points: [
      "One leader plus three key roles",
      "Decision rights and escalation rules",
      "Ownership agreements and execution cadence",
      "Before-and-after dependency baseline",
    ],
    duration: "8 weeks",
    actionHref: "/book-a-fit-call?engagement=squad",
    actionLabel: "Discuss one squad",
    featured: true,
  },
  {
    eyebrow: "For a leadership layer",
    number: "03",
    title: "Engineering Leadership Forum",
    forWhom:
      "For 6-8 Engineering Managers, Group Leads, or Directors who need a shared way to scale ownership.",
    promise:
      "In 12 weeks, build a common leadership operating model for decision-making, delegation, escalation, and strategic execution.",
    points: [
      "Individual and cohort baseline",
      "Facilitated leadership forums",
      "Real-work implementation sprints",
      "Executive sponsor summary and next-step plan",
    ],
    duration: "12 weeks",
    actionHref: "/book-a-fit-call?engagement=forum",
    actionLabel: "Discuss a cohort",
  },
];

const methodSteps = [
  {
    step: "01 / Diagnose",
    title: "Player Trap",
    text: "Find where decisions, approvals, and rescue work keep returning to the leader.",
  },
  {
    step: "02 / Expose",
    title: "Invisible Executor",
    text: "Make the hidden execution load visible, including the work no org chart shows.",
  },
  {
    step: "03 / Transfer",
    title: "Squad 1+3",
    text: "Move ownership into a small, accountable leadership system around real work.",
  },
  {
    step: "04 / Practice",
    title: "The Forum",
    text: "Use live cases and peer accountability to turn insight into repeated behavior.",
  },
  {
    step: "05 / Scale",
    title: "Strategic Leadership",
    text: "Protect capacity for direction, organization design, and the decisions only leaders should make.",
  },
];

const strongFit = [
  "B2B SaaS or technology company with 50-250 employees.",
  "Engineering organization with multiple teams or a growing management layer.",
  "The same senior leaders are required for too many recurring decisions.",
  "AI adoption is increasing output, reviews, and managerial load.",
  "CTO, VP R&D, or VP People is willing to sponsor the change.",
];

const notFit = [
  "You are looking for a motivational workshop or inspirational keynote.",
  "The core problem is poor technical performance or the wrong person in the role.",
  "No sponsor is willing to change decision rights or operating habits.",
  "The organization wants coaching with no connection to real work.",
  "You expect AI tools alone to solve organizational dependency.",
];

const proofSignals = [
  {
    title: "Experience base",
    text: "Built from more than 25 years across technology leadership, delivery, product, and organizational change.",
  },
  {
    title: "Operating lens",
    text: "The work tracks who decides, who owns, where work escalates, and what continues when the leader steps away.",
  },
  {
    title: "Evidence posture",
    text: "The page avoids unsupported performance promises and routes serious buyers into a fit conversation.",
  },
];

export const metadata: Metadata = {
  title: "AI-first leadership",
  description:
    "The Push helps engineering leaders scale decisions, ownership, and execution capacity as AI increases output and managerial load.",
  alternates: {
    canonical: "/ai-first-leadership",
  },
};

export default function AiFirstLeadershipPage() {
  return (
    <main className="landing-shell">
      <section className="landing-hero" aria-labelledby="ai-first-hero-title">
        <div className="landing-hero-copy">
          <p className="eyebrow">Engineering leadership that scales</p>
          <h1 id="ai-first-hero-title">Your strongest manager should not be the system.</h1>
        </div>
        <div className="landing-hero-side">
          <p className="lede">
            The Push helps engineering leaders transfer decisions, ownership, and execution out of their own heads so teams move without constant intervention.
          </p>
          <div className="content-actions landing-actions">
            <Link className="primary-link" href="/book-a-fit-call">
              Book a fit call
            </Link>
            <Link className="secondary-link" href="/tech-leadership-visibility-scorecard">
              Take the diagnostic
            </Link>
          </div>
        </div>
      </section>

      <section className="signal-strip" aria-label="Dependency signals">
        {signals.map((signal) => (
          <article className="signal-card" key={signal.title}>
            <h2>{signal.title}</h2>
            <p>{signal.text}</p>
          </article>
        ))}
      </section>

      <section className="landing-section" aria-labelledby="ways-title">
        <div className="landing-section-heading">
          <div>
            <p className="eyebrow">Three ways to work</p>
            <h2 id="ways-title">Buy the change at the level where the dependency lives.</h2>
          </div>
          <p>
            One leader. One critical squad. Or an entire engineering leadership layer. Each engagement has a fixed scope, clear duration, and a concrete operational outcome.
          </p>
        </div>

        <div className="offer-grid">
          {engagements.map((engagement) => (
            <article
              className={engagement.featured ? "offer-card offer-card-featured" : "offer-card"}
              key={engagement.title}
            >
              <div className="offer-card-meta">
                <span>{engagement.eyebrow}</span>
                <span>{engagement.number}</span>
              </div>
              <h3>{engagement.title}</h3>
              <p className="offer-for">{engagement.forWhom}</p>
              <p className="offer-promise">{engagement.promise}</p>
              <ul className="content-list offer-list">
                {engagement.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <div className="offer-footer">
                <span>Duration</span>
                <strong>{engagement.duration}</strong>
              </div>
              <Link className="text-link" href={engagement.actionHref}>
                {engagement.actionLabel}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section method-section" aria-labelledby="method-title">
        <div className="landing-section-heading">
          <div>
            <p className="eyebrow">The Push Method</p>
            <h2 id="method-title">The IP stays inside the system. The buyer sees a clear result.</h2>
          </div>
          <p>
            Player Trap, Invisible Executor, Squad Coaching 1+3, and the Forum are not separate products. They are operating components used to create the promised change.
          </p>
        </div>
        <div className="method-flow">
          {methodSteps.map((item) => (
            <article className="method-step" key={item.step}>
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section" aria-labelledby="fit-title">
        <div className="landing-section-heading">
          <div>
            <p className="eyebrow">Qualification</p>
            <h2 id="fit-title">This is not generic leadership training.</h2>
          </div>
          <p>
            The Push works when the organization has capable people, real delivery pressure, and a sponsor willing to change how decisions and ownership operate.
          </p>
        </div>
        <div className="fit-grid">
          <article className="fit-card">
            <h3>Strong fit</h3>
            <ul className="content-list">
              {strongFit.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="fit-card">
            <h3>Not the right fit</h3>
            <ul className="content-list">
              {notFit.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="landing-section ai-callout" aria-labelledby="ai-pressure-title">
        <h2 id="ai-pressure-title">AI makes the Player Trap more expensive.</h2>
        <div>
          <p>
            When code, documents, and agent activity multiply, the bottleneck shifts to review, judgment, prioritization, and governance. AI-first leadership is embedded wherever that pressure is present.
          </p>
          <Link className="text-link" href="/player-trap">
            Explore the Player Trap
          </Link>
        </div>
      </section>

      <section className="landing-section proof-section" aria-labelledby="proof-title">
        <blockquote>
          <p>
            The goal is not to make the leader less valuable. It is to stop consuming their value on work the system should already know how to do.
          </p>
          <cite>Itay Foyerstein, founder of The Push</cite>
        </blockquote>
        <div>
          <p className="eyebrow">Built from execution, not theory</p>
          <h2 id="proof-title">Leadership development connected to measurable work.</h2>
          <p>
            The work focuses on observable patterns: who decides, who owns, where work escalates, and what continues when the leader steps away.
          </p>
          <div className="proof-grid">
            {proofSignals.map((signal) => (
              <article className="proof-card" key={signal.title}>
                <strong>{signal.title}</strong>
                <span>{signal.text}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-final-cta" aria-labelledby="final-cta-title">
        <h2 id="final-cta-title">Choose the level. Change the dependency.</h2>
        <div>
          <p>
            A 30-minute fit call will determine whether the work should start with one leader, one squad, or the engineering leadership layer.
          </p>
          <Link className="primary-link" href="/book-a-fit-call">
            Book a fit call
          </Link>
        </div>
      </section>
    </main>
  );
}
