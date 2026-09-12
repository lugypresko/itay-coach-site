import type { Metadata } from "next";

import { buildAuthorityLaunchMetadata, getAuthorityLaunchPage } from "@/lib/authority-launch-pages";
import Link from "next/link";

const page = getAuthorityLaunchPage("contact");

export const metadata: Metadata = buildAuthorityLaunchMetadata(page);

export default function ContactPage() {
  return (
    <main className="content-shell">
      <header className="content-hero">
        <p className="eyebrow">Talk through the problem</p>
        <h1>Still the person every important decision comes back to?</h1>
        <p className="lede">
          Bring one current leadership situation. We will look at where ownership, judgment, or escalation still depends on you and decide whether The Push is a useful next step.
        </p>
        <div className="content-actions">
          <Link className="primary-link" href="/book-a-fit-call">Book a fit call</Link>
        </div>
      </header>

      <section className="content-grid">
        <article className="content-panel">
          <h2>What we will cover</h2>
          <ul className="content-list">
            <li>The decision or escalation that keeps returning to you.</li>
            <li>What your team can own today, and where the handoff breaks down.</li>
            <li>Whether coaching is the right next step for the situation.</li>
          </ul>
        </article>

        <article className="content-panel">
          <h2>Who this is for</h2>
          <p>
            Engineering Managers, Group Managers, Directors, and technical leaders whose scope has grown while the way work moves around them has not.
          </p>
        </article>

        <article className="content-panel content-panel-wide">
          <h2>Come with one real example</h2>
          <p>
            A recent review, approval, incident, or decision is enough. You do not need a polished diagnosis before the conversation.
          </p>
        </article>
      </section>
    </main>
  );
}

