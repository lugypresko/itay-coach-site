import type {
  PublicAuthorityTrustSignals,
  NormalizedInternalLink,
} from "@/lib/public-content";

function formatDate(value?: string) {
  if (!value) {
    return "Not reviewed yet";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB");
}

function formatList(items: string[]) {
  return items.length ? items : ["Not specified"];
}

function AuthorityList({ items }: { items: string[] }) {
  return (
    <ul className="authority-inline-list">
      {formatList(items).map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function AuthorityLinkList({ items }: { items: NormalizedInternalLink[] }) {
  if (!items.length) {
    return <p className="authority-empty">No related authority pages linked yet.</p>;
  }

  return (
    <div className="link-list">
      {items.map((link) => (
        <div key={`${link.targetSlug}-${link.anchorText}`} className="authority-link-item">
          <strong>{link.anchorText}</strong>
          <span>{link.reason}</span>
        </div>
      ))}
    </div>
  );
}

export function AuthorityEvidenceBlock({ trustSignals }: { trustSignals: PublicAuthorityTrustSignals }) {
  return (
    <section className="authority-trust-block">
      <h3>Evidence</h3>
      <dl className="authority-dl">
        <div>
          <dt>Source type</dt>
          <dd>{trustSignals.evidence.sourceType}</dd>
        </div>
        <div>
          <dt>Evidence count</dt>
          <dd>{trustSignals.evidence.evidenceCount}</dd>
        </div>
        <div>
          <dt>Citation snippet</dt>
          <dd>{trustSignals.evidence.citationSnippet}</dd>
        </div>
      </dl>
      <div>
        <p className="authority-label">Evidence URLs</p>
        <ul className="authority-source-list">
          {trustSignals.evidence.evidenceUrls.map((url) => (
            <li key={url}>
              <code>{url}</code>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function AuthorityReviewBlock({ trustSignals }: { trustSignals: PublicAuthorityTrustSignals }) {
  return (
    <section className="authority-trust-block">
      <h3>Review</h3>
      <dl className="authority-dl">
        <div>
          <dt>Reviewed by</dt>
          <dd>{trustSignals.review.reviewedBy}</dd>
        </div>
        <div>
          <dt>Review date</dt>
          <dd>{formatDate(trustSignals.review.reviewDate)}</dd>
        </div>
        <div>
          <dt>Last updated</dt>
          <dd>{formatDate(trustSignals.review.lastUpdated)}</dd>
        </div>
        <div>
          <dt>Content status</dt>
          <dd>{trustSignals.review.status}</dd>
        </div>
      </dl>
    </section>
  );
}

export function AuthorityEntityContextBlock({ trustSignals }: { trustSignals: PublicAuthorityTrustSignals }) {
  return (
    <section className="authority-trust-block">
      <h3>Entity context</h3>
      <dl className="authority-dl">
        <div>
          <dt>Related methodology</dt>
          <dd>{trustSignals.entityContext.relatedMethodology ?? "Not specified"}</dd>
        </div>
        <div>
          <dt>Related framework</dt>
          <dd>{trustSignals.entityContext.relatedFramework ?? "Not specified"}</dd>
        </div>
      </dl>
      <div className="authority-list-group">
        <p className="authority-label">Related entities</p>
        <AuthorityList items={trustSignals.entityContext.relatedEntities} />
      </div>
      <div className="authority-list-group">
        <p className="authority-label">Audience served</p>
        <AuthorityList items={trustSignals.entityContext.audienceServed} />
      </div>
    </section>
  );
}

export function AuthorityRecommendationIntentBlock({ trustSignals }: { trustSignals: PublicAuthorityTrustSignals }) {
  return (
    <section className="authority-trust-block">
      <h3>Recommendation intent</h3>
      <p className="authority-summary">{trustSignals.recommendationIntent.authorityIntentExplanation}</p>
      <div className="authority-list-group">
        <p className="authority-label">Target queries</p>
        <AuthorityList items={trustSignals.recommendationIntent.targetRecommendationQueries} />
      </div>
    </section>
  );
}

export function AuthorityRelatedAuthorityBlock({ trustSignals }: { trustSignals: PublicAuthorityTrustSignals }) {
  return (
    <section className="authority-trust-block">
      <h3>Related authority</h3>
      <div className="authority-list-group">
        <p className="authority-label">Related pages</p>
        <AuthorityLinkList items={trustSignals.relatedAuthority.relatedPages} />
      </div>
      <div className="authority-list-group">
        <p className="authority-label">Related concepts</p>
        <AuthorityList items={trustSignals.relatedAuthority.relatedConcepts} />
      </div>
    </section>
  );
}
