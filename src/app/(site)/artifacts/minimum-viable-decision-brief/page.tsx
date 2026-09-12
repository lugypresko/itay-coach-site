import type { Metadata } from "next";
import Link from "next/link";

import { getSiteUrl } from "@/lib/site-url";

const canonical = `${getSiteUrl()}/artifacts/minimum-viable-decision-brief`;

export const metadata: Metadata = {
  title: "Minimum Viable Decision Brief",
  description: "A one-page decision brief for aligning Product and Engineering without slowing learning.",
  alternates: { canonical },
  openGraph: { title: "Minimum Viable Decision Brief | The Push", description: "A small artifact for clearer Product and Engineering decisions.", url: canonical, type: "article" },
  robots: { index: true, follow: true },
};

export default function MinimumViableDecisionBriefPage() {
  return (
    <main className="content-shell">
      <header className="content-hero">
        <p className="eyebrow">Practical artifact</p>
        <h1>Minimum Viable Decision Brief</h1>
        <p className="lede">The smallest useful document for making one product or engineering decision visible, owned and testable.</p>
        <div className="content-actions"><Link className="primary-link" href="/player-trap">Bring the recurring decision to the diagnostic</Link></div>
      </header>
      <section className="content-grid">
        <article className="content-panel content-panel-wide"><h2>Use it for one decision</h2><p>Do not turn this into a full requirements document. Use one page to make the decision, context, trade-offs and next test explicit enough for the people who must act on it.</p></article>
        <article className="content-panel"><h2>Fill in the brief</h2><ol className="content-list"><li><strong>Decision:</strong> what must be decided now?</li><li><strong>Context:</strong> what evidence and constraint matter?</li><li><strong>Options:</strong> what are the real alternatives?</li><li><strong>Risks:</strong> what could make the choice wrong?</li><li><strong>Owner:</strong> who makes the call?</li><li><strong>Test:</strong> what reversible step creates evidence?</li><li><strong>Review date:</strong> when will you inspect what changed?</li></ol></article>
        <article className="content-panel"><h2>Counter-example</h2><p>This artifact is the wrong tool when the real constraint is missing authority, staffing, specialist technical capability or unresolved organizational conflict. Naming that constraint is the decision.</p></article>
        <article className="content-panel content-panel-wide"><h2>How it connects to The Push</h2><p>The brief is useful when a live decision keeps returning to one leader. The Push uses artifacts like this to test whether decision rights and operating habits are changing in real work.</p></article>
      </section>
    </main>
  );
}
