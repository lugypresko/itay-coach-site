export type PublicationLifecycleStatus = "draft" | "review" | "published" | "archived";

export type PublicationReasonCode =
  | "draft_not_indexable"
  | "draft_not_in_sitemap"
  | "draft_not_in_llms_txt"
  | "published_not_human_approved"
  | "published_missing_canonical_url"
  | "published_noindex_conflict"
  | "publication_surface_conflict"
  | "schema_ineligible";

export interface PublicationSourceRecord {
  slug: string;
  status: PublicationLifecycleStatus;
  title?: string;
  seoTitle?: string;
  seoDescription?: string;
  painStatement?: string;
  diagnosis?: string;
  humanApproved?: boolean;
  canonicalUrl?: string | null;
  indexable?: boolean;
  sitemapEligible?: boolean;
  llmsTxtEligible?: boolean;
  schemaEligible?: boolean;
}

export interface PublicationDecision {
  lifecycleStatus: PublicationLifecycleStatus;
  humanApproved: boolean;
  publiclyAccessible: boolean;
  indexable: boolean;
  sitemapEligible: boolean;
  llmsTxtEligible: boolean;
  canonicalUrl: string | null;
  schemaEligible: boolean;
  reasonCodes: PublicationReasonCode[];
}

export interface PublicationDecisionContext {
  origin: string;
  pathname?: string;
  treatAsHumanApproved?: boolean;
  canonicalUrl?: string | null;
  indexable?: boolean;
  sitemapEligible?: boolean;
  llmsTxtEligible?: boolean;
  schemaEligible?: boolean;
  publiclyAccessible?: boolean;
}

function dedupe(values: PublicationReasonCode[]): PublicationReasonCode[] {
  return [...new Set(values)];
}

function hasRequiredPublicationShape(record: PublicationSourceRecord): boolean {
  return Boolean(
    record.slug.trim() &&
      (record.title?.trim() || record.seoTitle?.trim()) &&
      record.seoDescription?.trim() &&
      (record.painStatement?.trim() || record.diagnosis?.trim()),
  );
}

export function buildPublicationDecision(
  record: PublicationSourceRecord,
  context: PublicationDecisionContext,
): PublicationDecision {
  const lifecycleStatus = record.status;
  const resolvedCanonicalUrl =
    context.canonicalUrl !== undefined
      ? context.canonicalUrl
      : record.canonicalUrl !== undefined
        ? record.canonicalUrl
        : context.pathname
          ? new URL(context.pathname, context.origin).toString()
          : null;
  const humanApproved = context.treatAsHumanApproved ?? record.humanApproved ?? false;
  const publiclyAccessible = context.publiclyAccessible ?? lifecycleStatus !== "archived";
  const schemaEligible = context.schemaEligible ?? record.schemaEligible ?? hasRequiredPublicationShape(record);
  const draft = lifecycleStatus === "draft";
  const published = lifecycleStatus === "published";

  const computedSitemapEligible = published && humanApproved && Boolean(resolvedCanonicalUrl) && schemaEligible;
  const computedLlmsTxtEligible = computedSitemapEligible && publiclyAccessible;
  const computedIndexable = published && humanApproved && Boolean(resolvedCanonicalUrl) && schemaEligible;

  const sitemapEligible = computedSitemapEligible && (context.sitemapEligible ?? record.sitemapEligible ?? true);
  const llmsTxtEligible = computedLlmsTxtEligible && (context.llmsTxtEligible ?? record.llmsTxtEligible ?? true);
  const indexable = computedIndexable && (context.indexable ?? record.indexable ?? true);

  const reasonCodes: PublicationReasonCode[] = [];

  if (draft && !indexable) {
    reasonCodes.push("draft_not_indexable");
  }

  if (draft && !sitemapEligible) {
    reasonCodes.push("draft_not_in_sitemap");
  }

  if (draft && !llmsTxtEligible) {
    reasonCodes.push("draft_not_in_llms_txt");
  }

  if (published && !humanApproved) {
    reasonCodes.push("published_not_human_approved");
  }

  if (published && !resolvedCanonicalUrl) {
    reasonCodes.push("published_missing_canonical_url");
  }

  if (published && !indexable) {
    reasonCodes.push("published_noindex_conflict");
  }

  if (published && dedupe(reasonCodes).length > 0) {
    reasonCodes.push("publication_surface_conflict");
  }

  if (!schemaEligible) {
    reasonCodes.push("schema_ineligible");
  }

  return {
    lifecycleStatus,
    humanApproved,
    publiclyAccessible,
    indexable,
    sitemapEligible,
    llmsTxtEligible,
    canonicalUrl: resolvedCanonicalUrl,
    schemaEligible,
    reasonCodes: dedupe(reasonCodes),
  };
}
