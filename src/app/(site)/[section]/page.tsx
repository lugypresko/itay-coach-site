import Link from "next/link";
import { notFound } from "next/navigation";

import { canonicalAuthorityPages, getPublicContentSectionSpec } from "@/lib/public-content";

type SectionPageProps = {
  params: Promise<{
    section: string;
  }>;
};

const primaryCallsToAction = [
  {
    href: "/book-a-fit-call",
    label: "Book a fit call",
    description: "Primary conversion path for recommendation-intent visitors.",
  },
  {
    href: "/invisible-executor-assessment",
    label: "Invisible Executor Assessment",
    description: "Secondary lead magnet for self-diagnosis and positioning.",
  },
];

export async function generateMetadata({ params }: SectionPageProps) {
  const { section } = await params;
  const spec = getPublicContentSectionSpec(section);

  if (!spec) {
    return {};
  }

  return {
    title: spec.pluralLabel,
    description: spec.description,
    alternates: {
      canonical: `/${section}`,
    },
  };
}

export default async function SectionLandingPage({ params }: SectionPageProps) {
  const { section } = await params;
  const spec = getPublicContentSectionSpec(section);

  if (!spec) {
    notFound();
  }

  const sectionPages = canonicalAuthorityPages.filter((page) => page.section === section);

  return (
    <main className="content-shell">
      <header className="content-hero content-hero-split">
        <div className="content-hero-copy">
          <div className="content-hero-meta">
            <p className="eyebrow">{spec.pluralLabel}</p>
            <p className="content-status">Public knowledge graph</p>
          </div>
          <h1>{spec.description}</h1>
          <p className="lede">
            This section anchors the public knowledge graph that supports AI recommendation visibility for tech leadership coaching.
          </p>
          <div className="content-actions">
            <Link className="primary-link" href="/book-a-fit-call">
              Book a fit call
            </Link>
            <Link className="secondary-link" href="/invisible-executor-assessment">
              Open the assessment
            </Link>
          </div>
        </div>

        <aside className="content-hero-panel">
          <p className="authority-label">Section snapshot</p>
          <dl className="authority-dl">
            <div>
              <dt>Collection</dt>
              <dd>{spec.collectionSlug}</dd>
            </div>
            <div>
              <dt>Schema</dt>
              <dd>{spec.schemaType}</dd>
            </div>
            <div>
              <dt>Canonical pages</dt>
              <dd>{sectionPages.length}</dd>
            </div>
          </dl>
          <p className="authority-summary">
            Use this page to move from a section-level view into the canonical authority pages.
          </p>
        </aside>
      </header>

      <section className="content-grid">
        <article className="content-panel content-panel-wide">
          <h2>Canonical pages</h2>
          <div className="offer-grid">
            {sectionPages.map((page, index) => (
              <Link key={page.slug} href={`/${section}/${page.slug}`} className={`offer${index === 1 ? " offer--featured" : ""}`}>
                <div className="offer-number">
                  <span>{page.title}</span>
                  <span>0{index + 1}</span>
                </div>
                <h3>{page.title}</h3>
                <p className="for">{page.description}</p>
              </Link>
            ))}
          </div>
        </article>

        <article className="content-panel">
          <h2>Primary CTA</h2>
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
