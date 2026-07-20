import Link from "next/link";

import { CampaignAttributionLink } from "@/components/campaign-attribution-link";
import type { CampaignPageCopy } from "@/lib/campaign-pages";

type Concept = "memo" | "field-notes" | "console" | "blueprint" | "manifesto";

type ConceptProps = {
  concept: Concept;
  slug: string;
  copy?: CampaignPageCopy;
};

const defaults: Record<Concept, CampaignPageCopy> = {
  memo: {
    audience: "CTOs and VP R&D sponsors",
    eyebrow: "The Operator's Memo / Sponsor path",
    title: "Your managers should not need you to keep the system moving.",
    lede: "When every difficult decision, escalation, and review routes through one leader, the organization is scaling dependency instead of leadership capacity.",
    primaryCta: "Discuss coaching for your managers",
    secondaryCta: "Learn how organizational sponsorship works",
    destination: "/for-organizations",
    proof: ["Decisions keep returning to you.", "Managers wait for approval instead of taking ownership.", "Strategic work loses to the next escalation."],
    nextStep: "Start with the organization-level path, then decide whether coaching, a cohort, or focused advisory work fits.",
    variant: "memo",
  },
  "field-notes": {
    audience: "Engineering managers and technical leaders",
    eyebrow: "Field Notes / Individual path",
    title: "You can be the person everyone relies on without remaining the person everything depends on.",
    lede: "A practical note for the manager whose calendar is full, whose team still waits, and whose strategic work keeps losing to the next escalation.",
    primaryCta: "Book a fit call",
    secondaryCta: "Start with a conversation",
    destination: "/book-a-fit-call",
    proof: ["Name the invisible coordination work.", "Separate dependency from a temporary delivery problem.", "Build judgment, ownership, and boundaries."],
    nextStep: "Bring one current situation where progress still comes back to you.",
    variant: "field-notes",
  },
  console: {
    audience: "Technical leaders who prefer a systems view",
    eyebrow: "Leadership OS / Diagnostic console",
    title: "Find the dependency that keeps leadership capacity trapped in one person.",
    lede: "Run a practical assessment of decisions, approvals, reviews, and rescue work that still route through you.",
    primaryCta: "Run the Leadership Dependency Assessment",
    secondaryCta: "View The Push methodology",
    destination: "/leadership-dependency-assessment",
    proof: ["Decision routing", "Review load", "Escalation dependency"],
    nextStep: "The assessment is informational, not a psychological evaluation or objective measurement.",
    variant: "diagnostic",
  },
  blueprint: {
    audience: "Sponsors and leaders redesigning an operating model",
    eyebrow: "Foyerstein / DWG-01",
    title: "Every organization runs on a design. Most never drew it.",
    lede: "Decision rights, ownership, escalation paths, and feedback loops made explicit, transferred deliberately, and built to run without one overloaded node.",
    primaryCta: "Discuss leadership support",
    secondaryCta: "View the schematic",
    destination: "/for-organizations",
    proof: ["Dependency map", "Decision-rights matrix", "Operating cadence", "Leadership OS v1"],
    nextStep: "A sponsor conversation identifies the current-state dependency before the intervention is chosen.",
    variant: "memo",
  },
  manifesto: {
    audience: "Engineering Managers, CTOs, and VP R&D leaders",
    eyebrow: "The Player Trap Test / 60 seconds",
    title: "You are the best player on the team. That's the trap.",
    lede: "You were promoted for solving hard problems fast. Now the organization needs you to build a team that decides without you.",
    primaryCta: "Take the Player Trap Diagnostic",
    secondaryCta: "Read the methodology",
    destination: "/player-trap",
    proof: ["Delegated decisions still come back.", "The team waits for approval.", "AI made your review load heavier.", "Execution stalls when you step away."],
    nextStep: "Three or more signs means the operating model needs to change, not that you are failing as a leader.",
    variant: "diagnostic",
  },
};

function TrackedCta({ copy, slug, secondary = false }: { copy: CampaignPageCopy; slug: string; secondary?: boolean }) {
  return (
    <CampaignAttributionLink
      className={secondary ? "concept-link concept-link--secondary" : "concept-link concept-link--primary"}
      href={copy.destination}
      lpConcept={slug}
      audience={copy.audience}
      ctaId={secondary ? "campaign-secondary" : "campaign-primary"}
      landingPath={`/campaigns/${slug}`}
    >
      {secondary ? copy.secondaryCta : copy.primaryCta}
    </CampaignAttributionLink>
  );
}

export function CampaignConceptPage({ concept, slug, copy = defaults[concept] }: ConceptProps) {
  if (concept === "console") return <ConsolePage copy={copy} slug={slug} />;
  if (concept === "manifesto") return <ManifestoPage copy={copy} slug={slug} />;
  return <EditorialPage copy={copy} slug={slug} concept={concept} />;
}

function EditorialPage({ copy, slug, concept }: { copy: CampaignPageCopy; slug: string; concept: "memo" | "field-notes" | "blueprint" }) {
  const blueprint = concept === "blueprint";
  return (
    <main className={`concept-page concept-page--${concept}`}>
      <header className="concept-header">
        <Link className="concept-brand" href="/">{blueprint ? "FOYERSTEIN/DWG-01" : "ITAY FOYERSTEIN"}</Link>
        <nav><Link href={copy.destination}>{copy.primaryCta}</Link></nav>
      </header>
      <section className="concept-hero">
        <p className="concept-kicker">{copy.eyebrow}</p>
        <h1>{blueprint ? <>Every organization runs on a design. <mark>Most never drew it.</mark></> : copy.title}</h1>
        <p className="concept-lede">{copy.lede}</p>
        <div className="concept-actions"><TrackedCta copy={copy} slug={slug} /><TrackedCta copy={copy} slug={slug} secondary /></div>
        <span className="concept-index">{blueprint ? "PROJECT / LEADERSHIP OPERATING MODEL" : "FIELD NOTE / 001"}</span>
      </section>
      <div className="concept-strip">{blueprint ? "CURRENT STATE  /  DECISION RIGHTS  /  OWNERSHIP  /  FEEDBACK LOOPS" : "HARD WORK DOES NOT SCALE  /  STOP BEING THE SYSTEM  /  BUILD CAPACITY"}</div>
      <section className="concept-section">
        <p className="concept-label">01 / DIAGNOSIS</p>
        <h2>{blueprint ? "The dependency diagram no one asked for" : "Does this sound familiar?"}</h2>
        <div className="concept-list">{copy.proof.map((item, index) => <div className="concept-list-row" key={item}><span>0{index + 1}</span><strong>{item}</strong><p>{blueprint ? "A visible operating-model signal that can be traced, discussed, and redesigned." : "The work is real. The route through one person is the constraint."}</p></div>)}</div>
      </section>
      <section className="concept-section concept-section--dark">
        <p className="concept-label">02 / METHOD</p>
        <h2>Transfer judgment, not tasks.</h2>
        <div className="concept-method">{["Diagnose the dependency", "Expose invisible execution", "Clarify decision rights", "Build strategic capacity"].map((step, index) => <div key={step}><span>STAGE 0{index + 1}</span><h3>{step}</h3><p>{copy.nextStep}</p></div>)}</div>
      </section>
      <section className="concept-section concept-section--final"><p className="concept-label">03 / NEXT MOVE</p><h2>Make the dependency discussable.</h2><p className="concept-lede">{copy.nextStep}</p><TrackedCta copy={copy} slug={slug} /></section>
    </main>
  );
}

function ConsolePage({ copy, slug }: { copy: CampaignPageCopy; slug: string }) {
  return (
    <main className="concept-page concept-page--console">
      <header className="console-top"><Link className="concept-brand" href="/">THE PUSH / LEADERSHIP OS</Link><span>DIAGNOSTIC CONSOLE / v1.0</span></header>
      <section className="console-hero"><div><p className="console-status">SYSTEM CHECK / READY</p><h1>Leadership dependency is a system signal.</h1><p>{copy.lede}</p><TrackedCta copy={copy} slug={slug} /></div><div className="console-readout"><span>ROUTING LOAD</span><strong>01</strong><small>leader as default node</small><div className="console-bars"><i /><i /><i /><i /><i /></div></div></section>
      <section className="console-grid"><div className="console-panel console-panel--wide"><p className="console-label">LIVE MODEL</p><h2>Where does progress still route through you?</h2><div className="console-nodes"><span>TEAM</span><b>YOU</b><span>STAKEHOLDERS</span><span>ROADMAP</span></div></div>{copy.proof.map((item, index) => <div className="console-panel" key={item}><p className="console-label">SIGNAL 0{index + 1}</p><h3>{item}</h3><p>Make the dependency visible before choosing the intervention.</p></div>)}</section>
      <section className="console-footer"><p>{copy.nextStep}</p><TrackedCta copy={copy} slug={slug} /></section>
    </main>
  );
}

function ManifestoPage({ copy, slug }: { copy: CampaignPageCopy; slug: string }) {
  return (
    <main className="concept-page concept-page--manifesto">
      <header className="manifesto-header"><Link className="concept-brand" href="/">THE<span>PUSH</span></Link><TrackedCta copy={copy} slug={slug} /></header>
      <section className="manifesto-hero"><span className="manifesto-sticker">{copy.eyebrow}</span><h1>You are the best <em>player</em> on the team. <b>That&apos;s the trap.</b></h1><p>{copy.lede}</p><TrackedCta copy={copy} slug={slug} /></section>
      <section className="manifesto-dark"><span className="manifesto-sticker manifesto-sticker--lime">PLAYER TRAP TEST</span><h2>Five signs <em>you became the system</em></h2><div className="manifesto-checks">{copy.proof.map((item, index) => <div key={item}><span>0{index + 1}</span>{item}</div>)}</div></section>
      <section className="manifesto-posters"><p>HARD WORK <em>DOES NOT SCALE.</em></p><p>SPEED IS CHEAP. <em>DIRECTION IS EVERYTHING.</em></p><p>STOP RESCUING. <em>START BUILDING CAPACITY.</em></p></section>
      <section className="manifesto-final"><h2>The operating model has to <b>change.</b></h2><p>{copy.nextStep}</p><TrackedCta copy={copy} slug={slug} /></section>
      <div className="manifesto-sticky"><span>Still the default route for progress?</span><TrackedCta copy={copy} slug={slug} /></div>
    </main>
  );
}
