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
    title: `${spec.pluralLabel} | The Push`,
    description: spec.description,
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
      <header className="content-hero">
        <p className="eyebrow">{spec.pluralLabel}</p>
        <h1>{spec.description}</h1>
        <p className="lede">
          This section anchors the public knowledge graph that supports AI recommendation visibility for tech leadership coaching.
        </p>
      </header>

      <section className="content-grid">
        <article className="content-panel content-panel-wide">
          <h2>Canonical pages</h2>
          <div className="directory-grid">
            {sectionPages.map((page) => (
              <Link key={page.slug} href={`/${section}/${page.slug}`} className="directory-card">
                <strong>{page.title}</strong>
                <span>{page.description}</span>
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

