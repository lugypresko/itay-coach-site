import Link from "next/link";

import { canonicalAuthorityPages, publicContentSectionSpecs } from "@/lib/public-content";

const primaryCallsToAction = [
  {
    href: "/book-a-fit-call",
    label: "Book a fit call",
    description: "Primary route for recommendation-intent visitors.",
  },
  {
    href: "/invisible-executor-assessment",
    label: "Invisible Executor Assessment",
    description: "Secondary lead magnet for self-assessment.",
  },
  {
    href: "/tech-leadership-visibility-scorecard",
    label: "Tech Leadership Visibility Scorecard",
    description: "Lead magnet for authority evaluation and gap discovery.",
  },
];

export default function HomePage() {
  return (
    <main className="home-shell">
      <section className="home-hero">
        <p className="eyebrow">The Push Authority Engine</p>
        <h1>Tech Leadership Coach visibility system</h1>
        <p className="lede">
          English-first public knowledge graph for Itay Foyerstein, The Push, and the leadership framework that AI answer engines can cite.
        </p>
        <div className="content-actions">
          <Link className="primary-link" href="/entities/itay-foyerstein">
            View entity page
          </Link>
          <Link className="secondary-link" href="/admin">
            Open admin
          </Link>
        </div>
      </section>

      <section className="home-grid">
        <article className="home-panel">
          <h2>Public knowledge graph</h2>
          <div className="directory-grid">
            {publicContentSectionSpecs.map((spec) => (
              <Link key={spec.section} href={`/${spec.section}`} className="directory-card">
                <strong>{spec.pluralLabel}</strong>
                <span>{spec.description}</span>
              </Link>
            ))}
          </div>
        </article>

        <article className="home-panel">
          <h2>Canonical entities</h2>
          <div className="cta-stack">
            {canonicalAuthorityPages.map((page) => (
              <Link key={page.slug} href={`/${page.section}/${page.slug}`} className="cta-row">
                <strong>{page.title}</strong>
                <span>{page.description}</span>
              </Link>
            ))}
          </div>
        </article>

        <article className="home-panel">
          <h2>Primary CTA paths</h2>
          <div className="cta-stack">
            {primaryCallsToAction.map((item) => (
              <Link key={item.href} href={item.href} className="cta-row">
                <strong>{item.label}</strong>
                <span>{item.description}</span>
              </Link>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
