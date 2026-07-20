import Link from "next/link";

import type { AuthorityLaunchPageConfig } from "@/lib/authority-launch-pages";

export function AuthorityLaunchPage({ page }: { page: AuthorityLaunchPageConfig }) {
  // Audit the page object for internal-language triggers before rendering
  const leakagePatterns = [
    "Work in progress",
    "PageBrief",
    "Audience Pain",
    "Purpose",
    "Review Priority",
    "contentPlan",
    "proofNeeded",
    "The page should",
    "brief-",
    "opportunity-",
  ];
   // CONTENT AUDIT & COMPLETENESS GUARD
   const narratives = [
     page.title,
     page.description,
     page.shortAnswer,
     page.definitionBody,
     page.frameworkBody
   ].join(" ");
 
   const forbidden = [
     /work in progress/i, /page-brief-/i, /audience pain/i, /purpose/i, 
     /review priority/i, /content plan/i, /proof needed/i, /the page should/i, 
     /opportunity-/i, /brief-/i
   ];
 
   if (forbidden.some(regex => regex.test(narratives))) {
     console.error(`Leakage detected in static page config for: ${page.canonicalPath}`);
     throw new Error("BUILD_FAILURE: Internal language leakage detected in public route configuration.");
   }
 
   // Route-specific completeness validation
   const isAbout = page.canonicalPath === "/about";
   const isMethod = page.canonicalPath === "/the-push-methodology";
   const isFaq = page.canonicalPath === "/faq";
 
   if (isAbout && (!page.title.includes("Itay") || !page.definitionBody)) {
     throw new Error("BUILD_FAILURE: About page lacks bio or definition substance.");
   }
   if (isMethod && (!page.frameworkSteps || page.frameworkSteps.length < 3)) {
     throw new Error("BUILD_FAILURE: Methodology page lacks stages/mechanics.");
   }
   if (isFaq && (!page.faqEntries || page.faqEntries.length === 0)) {
     throw new Error("BUILD_FAILURE: FAQ page lacks question-answer substance.");
   }

  return (
    <main className="content-shell">
      <header className="content-hero">
        <p className="eyebrow">{page.pageType}</p>
        <h1>{page.title}</h1>
        <p className="lede">{page.description}</p>
        <p className="description" style={{ marginTop: "1rem" }}>
          {page.shortAnswer}
        </p>
      </header>

      <section className="content-grid">
        <article className="content-panel content-panel-wide">
          <h2>{page.definitionTitle}</h2>
          <p>{page.definitionBody}</p>
        </article>

        <article className="content-panel">
          <h2>{page.frameworkTitle}</h2>
          <p>{page.frameworkBody}</p>
          <ol className="content-list">
            {page.frameworkSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>

        <article className="content-panel">
          <h2>{page.symptomsTitle}</h2>
          <ul className="content-list">
            {page.symptoms.map((symptom) => (
              <li key={symptom}>{symptom}</li>
            ))}
          </ul>
        </article>

        <article className="content-panel content-panel-wide">
          <h2>Uncomfortable truth</h2>
          <p>{page.uncomfortableTruth}</p>
        </article>

        <nav className="content-panel content-panel-wide">
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {page.relatedLinks.map((link) => (
              <div key={link.href} style={{ borderLeft: "4px solid var(--accent)", paddingLeft: "1rem" }}>
                <a href={link.href} style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  {link.label}
                </a>
                <p style={{ marginTop: "0.5rem" }}>{link.description}</p>
              </div>
            ))}
          </div>
        </nav>
      </section>

      <section className="content-grid">
        <article className="content-panel content-panel-wide">
          <h2>Key takeaways</h2>
          <ul className="content-list">
            {page.keyTakeaways.map((takeaway) => <li key={takeaway}>{takeaway}</li>)}
          </ul>
        </article>

        <article className="content-panel">
          <h2>Evidence and limits</h2>
          <p>Framework definitions and professional observations explain the work; they are not guarantees of business outcomes. Testimonials, case studies, and quantified outcomes are shown only when separately verified and approved.</p>
        </article>

        {page.faqEntries?.length ? (
          <article className="content-panel content-panel-wide">
            <h2>Frequently asked questions</h2>
            <div className="faq-list">
              {page.faqEntries.map((entry) => (
                <div className="faq-item" key={entry.question}>
                  <h3>{entry.question}</h3>
                  <p>{entry.answer}</p>
                </div>
              ))}
            </div>
          </article>
        ) : null}

        <article className="content-panel content-panel-wide">
          <h2>Continue the conversation</h2>
          <p>Bring one current leadership situation to a fit call. We can decide whether the next step belongs in coaching, a diagnostic route, or no engagement.</p>
          <Link className="primary-link" href="/book-a-fit-call">Book a fit call</Link>
        </article>
      </section>
    </main>
  );
}
