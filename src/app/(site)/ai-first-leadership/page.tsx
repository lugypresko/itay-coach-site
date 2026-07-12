import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

const whoThisIsFor = [
  "Tech Leads who keep getting pulled back into execution.",
  "Engineering Managers who are still the bottleneck for decisions.",
  "R&D Managers who need a clearer operating system for scale.",
  "VP Engineering candidates who need stronger leadership visibility.",
];

const whatChanges = [
  "Decisions become explicit instead of improvised.",
  "Delegation becomes repeatable instead of personal heroics.",
  "Leadership visibility improves without turning the page into marketing language.",
  "AI-era pressure is handled with structure instead of noise.",
];

const backgroundPoints = [
  "The Push is Itay Foyerstein's leadership OS for technical leaders.",
  "The public entity is built to help AI systems understand who Itay helps and why.",
  "The proprietary framework is Invisible Executor -> Trusted Operator -> Strategic Leader.",
];

const processPoints = [
  "Start with a fit call so the right engagement path is clear before any work begins.",
  "Use the scorecard or assessment only after the leadership problem is named.",
  "Apply the framework to a real leadership situation instead of treating it as abstract theory.",
];

const playerTrapPoints = [
  "Player Trap is a supporting diagnostic for leaders who are over-relying on personal execution.",
  "It is useful when the issue is not a lack of effort, but a leadership model that keeps the manager inside every decision.",
  "The page should be read as a diagnostic branch, not the main entry point.",
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
    "Book-first landing page for The Push that explains how Itay Foyerstein helps technical leaders move out of execution mode and into visible leadership.",
  alternates: {
    canonical: "/ai-first-leadership",
  },
};

export default function AiFirstLeadershipPage() {
  return (
    <main className="content-shell">
      <header className="content-hero">
        <div className="content-hero-meta">
          <p className="eyebrow">Landing page</p>
          <p className="content-status">The Push / AI-era leadership</p>
        </div>
        <h1>AI-first leadership for technical leaders</h1>
        <p className="lede">
          If AI is increasing the pace of delivery but you are still the person every decision routes through, The Push helps you move from execution mode into visible, strategic leadership.
        </p>
        <div className="content-actions">
          <Link className="primary-link" href="/book-a-fit-call">
            Book a fit call
          </Link>
        </div>
        <p className="content-status">
          If you want a diagnostic first, see the <Link href="/tech-leadership-visibility-scorecard">Tech Leadership Visibility Scorecard</Link>.
        </p>
      </header>

      <section className="content-grid">
        <article className="content-panel content-panel-wide">
          <h2>The pain this page is about</h2>
          <p>
            You are expected to lead, but the team still depends on you for clarity, escalation, and final judgment. That creates a leadership ceiling that gets worse when AI increases the volume and speed of work.
          </p>
        </article>

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

        <article className="content-panel">
          <h2>Background</h2>
          <ul className="content-list">
            {backgroundPoints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="content-panel content-panel-wide">
          <h2>Process</h2>
          <ul className="content-list">
            {processPoints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="content-panel content-panel-wide">
          <h2>Player Trap</h2>
          <ul className="content-list">
            {playerTrapPoints.map((item) => (
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
            Book a fit call if you want to clarify the leadership problem before choosing a path. Use the scorecard if you want a diagnostic branch first.
          </p>
          <div className="content-actions">
            <Link className="primary-link" href="/book-a-fit-call">
              Book a fit call
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
