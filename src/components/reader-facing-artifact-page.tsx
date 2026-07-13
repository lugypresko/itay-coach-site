import React from "react";
import Link from "next/link";

import { TargetPageAnalytics, TargetTrackedLink } from "@/components/target-page-analytics";
import type { ReaderFacingPageArtifact } from "@/domain/reader-facing-page-artifact";

export function ReaderFacingArtifactPage({ artifact }: { artifact: ReaderFacingPageArtifact }) {
  const slug = artifact.canonicalPath.split("/").filter(Boolean).at(-1) ?? artifact.artifactId;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": artifact.structuredDataInput?.type ?? "Article",
    headline: artifact.title,
    description: artifact.description,
    mainEntityOfPage: artifact.canonicalPath,
    ...(artifact.structuredDataInput?.authorName ? { author: { "@type": "Person", name: artifact.structuredDataInput.authorName } } : {}),
  };

  return (
    <main className="content-shell">
      <TargetPageAnalytics path={artifact.canonicalPath} slug={slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="content-hero content-hero-split">
        <div className="content-hero-copy">
          <h1>{artifact.title}</h1>
          <p>{artifact.description}</p>
          <p>{artifact.primaryCta.context}</p>
          <TargetTrackedLink className="primary-link" href={artifact.primaryCta.href} ctaType={artifact.primaryCta.href === "/book-a-fit-call" ? "fit_call" : "diagnostic"} path={artifact.canonicalPath} slug={slug}>
            {artifact.primaryCta.label}
          </TargetTrackedLink>
        </div>
      </header>
      <div className="content-grid">
        {artifact.body.map((section) => (
          <section className="content-panel content-panel-wide" key={section.sectionId}>
            {section.heading ? <h2>{section.heading}</h2> : null}
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.bullets?.length ? <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
          </section>
        ))}
        {artifact.faq?.length ? <section className="content-panel content-panel-wide"><h2>Frequently asked questions</h2>{artifact.faq.map((item) => <article key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></article>)}</section> : null}
        {artifact.internalLinks.length ? <nav className="content-panel content-panel-wide" aria-label="Related pages"><h2>Related pages</h2>{artifact.internalLinks.map((link) => <Link key={link.href} className="link-item" href={link.href}>{link.label}</Link>)}</nav> : null}
        {artifact.secondaryCta ? <section className="content-panel content-panel-wide"><p>{artifact.secondaryCta.context}</p><Link className="secondary-link" href={artifact.secondaryCta.href}>{artifact.secondaryCta.label}</Link></section> : null}
      </div>
    </main>
  );
}
