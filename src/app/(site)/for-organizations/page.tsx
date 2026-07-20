import Link from "next/link";
import type { Metadata } from "next";

import { LeadQualificationForm } from "@/components/lead-qualification-form";

export const metadata: Metadata = {
  title: "Leadership Support for Organizations",
  description:
    "Leadership coaching support for organizations developing Engineering Managers, R&D Managers, and technical leadership layers.",
  alternates: {
    canonical: "/for-organizations",
  },
};

const supportOptions = [
  {
    title: "Coaching for managers",
    body: "Work 1:1 with a manager on real decisions, ownership, delegation, escalation paths, and the leadership situations that keep returning to them.",
  },
  {
    title: "Cohorts and leadership programs",
    body: "Create a shared language for a developing management layer without turning the work into a generic leadership curriculum.",
  },
  {
    title: "Focused operating-model support",
    body: "Use targeted advisory input around decision rights, working agreements, team interfaces, or the boundaries between human judgment and AI-enabled execution.",
  },
];

export default function ForOrganizationsPage() {
  return (
    <main className="content-shell">
      <header className="content-hero">
        <div className="content-hero-meta">
          <p className="eyebrow">For organizations</p>
          <p className="content-status">Sponsor path</p>
        </div>
        <h1>Leadership support for managers who are carrying too much of the system.</h1>
        <p className="lede">
          For CTOs, VP R&amp;D leaders, and People or HR sponsors who want technical managers to build stronger ownership,
          decision-making, and leadership capacity inside real work.
        </p>
        <div className="content-actions">
          <Link className="primary-link" href="/book-a-fit-call?audience=sponsor">
            Discuss coaching for your managers
          </Link>
          <Link className="secondary-link" href="/the-push-methodology">
            View the methodology
          </Link>
        </div>
      </header>

      <LeadQualificationForm defaultIntent="managers" />

      <section className="content-grid">
        <article className="content-panel content-panel-wide">
          <h2>What organizational sponsorship makes possible</h2>
          <div className="offer-grid">
            {supportOptions.map((option, index) => (
              <article className={`offer${index === 1 ? " offer--featured" : ""}`} key={option.title}>
                <div className="offer-number">
                  <span>Support</span>
                  <span>0{index + 1}</span>
                </div>
                <h3>{option.title}</h3>
                <p className="for">{option.body}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="content-panel">
          <h2>The sponsorÃ¢â‚¬â„¢s role</h2>
          <ul className="content-list">
            <li>Make room for the manager to change how decisions and ownership move.</li>
            <li>Support clearer working agreements instead of routing every issue upward.</li>
            <li>Stay involved enough to reinforce the change without taking the work back.</li>
          </ul>
        </article>

        <article className="content-panel">
          <h2>What this is not</h2>
          <ul className="content-list">
            <li>It is not a motivational workshop or a generic management course.</li>
            <li>It is not an organizational audit or a promise of a fixed business outcome.</li>
            <li>The manager remains the primary unit of change and owns implementation.</li>
          </ul>
        </article>

        <article className="content-panel content-panel-wide">
          <h2>Start with the current leadership problem</h2>
          <p className="lede">
            A sponsor conversation clarifies whether the need is individual coaching, support for a management layer, or
            a narrower intervention around a decision or ownership pattern.
          </p>
          <Link className="primary-link" href="/book-a-fit-call?audience=sponsor">
            Discuss leadership support
          </Link>
        </article>
      </section>
    </main>
  );
}
