import Link from "next/link";

import { CampaignAttributionLink } from "@/components/campaign-attribution-link";

import type { CampaignPageCopy } from "@/lib/campaign-pages";

export function CampaignLandingPage({ copy }: { copy: CampaignPageCopy }) {
  return (
    <main className={`content-shell campaign-page campaign-page--${copy.variant}`}>
      <header className="content-hero">
        <div className="content-hero-meta">
          <p className="eyebrow">{copy.eyebrow}</p>
          <p className="content-status">Acquisition page</p>
        </div>
        <h1>{copy.title}</h1>
        <p className="lede">{copy.lede}</p>
        <div className="content-actions">
          <CampaignAttributionLink className="primary-link" href={copy.destination} lpConcept={copy.variant === "memo" ? "operators-memo" : copy.variant === "field-notes" ? "field-notes" : "leadership-os"} audience={copy.audience} ctaId="campaign-primary" landingPath={copy.variant === "memo" ? "/campaigns/operators-memo" : copy.variant === "field-notes" ? "/campaigns/field-notes" : "/campaigns/leadership-os"}>{copy.primaryCta}</CampaignAttributionLink>
          {copy.secondaryCta ? <Link className="secondary-link" href={copy.variant === "diagnostic" ? "/the-push-methodology" : copy.variant === "memo" ? "/for-organizations" : "/book-a-fit-call"}>{copy.secondaryCta}</Link> : null}
        </div>
      </header>
      <section className="content-grid">
        <article className="content-panel content-panel-wide">
          <p className="eyebrow">What this path is for</p>
          <h2>{copy.audience}</h2>
          <div className="offer-grid">
            {copy.proof.map((item, index) => <article className={`offer${index === 1 ? " offer--featured" : ""}`} key={item}>
              <div className="offer-number"><span>Signal</span><span>0{index + 1}</span></div>
              <p className="for">{item}</p>
            </article>)}
          </div>
        </article>
        <article className="content-panel">
          <p className="eyebrow">The next move</p>
          <h2>Make the dependency discussable.</h2>
          <p>{copy.nextStep}</p>
          <CampaignAttributionLink className="text-link" href={copy.destination} lpConcept={copy.variant === "memo" ? "operators-memo" : copy.variant === "field-notes" ? "field-notes" : "leadership-os"} audience={copy.audience} ctaId="campaign-next-step" landingPath={copy.variant === "memo" ? "/campaigns/operators-memo" : copy.variant === "field-notes" ? "/campaigns/field-notes" : "/campaigns/leadership-os"}>{copy.primaryCta}</CampaignAttributionLink>
        </article>
        <article className="content-panel">
          <p className="eyebrow">Canonical context</p>
          <h2>Start with the real operating pattern.</h2>
          <p>The campaign is a focused entry point, not a separate coaching product. The canonical routes explain the broader service and organizational model.</p>
          <Link className="text-link" href="/technical-leadership-coaching">Explore technical leadership coaching</Link>
        </article>
      </section>
    </main>
  );
}
