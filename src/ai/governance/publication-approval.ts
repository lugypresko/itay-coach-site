import { createHash } from "node:crypto";

import { getSiteUrl } from "../../lib/site-url";
import { createContentRevisionHash } from "./content-revision-hash";
import { validatePublishingProvenance } from "../content-decision/integration-gates";
import type { ContentDecision } from "../content-decision/contracts";
import type { ContentDecisionVocabulary } from "../content-decision/vocabulary";

export interface PublicationApprovalValidationInput {
  approval: unknown;
  title: unknown;
  content: unknown;
  canonicalUrl: unknown;
  slug?: unknown;
  publicationRevision?: string;
  canonicalOrigin?: string;
  contentDecisionProvenance?: {
    decision?: ContentDecision;
    artifactDecisionId?: string;
    artifactDecisionVersion?: number;
    vocabulary: ContentDecisionVocabulary;
    now?: string;
  };
}

export type PublicationApprovalFailureCode =
  | "approval_missing"
  | "approval_timestamp_invalid"
  | "approver_missing"
  | "supporting_insight_ids_missing"
  | "validation_not_passed"
  | "deployment_not_authorized"
  | "publication_not_authorized"
  | "canonical_url_invalid"
  | "canonical_origin_mismatch"
  | "canonical_path_not_approved"
  | "canonical_slug_mismatch"
  | "revision_hash_mismatch"
  | "publication_revision_hash_mismatch"
  | "content_decision_provenance_invalid";

export interface PublicationApprovalValidationResult {
  valid: boolean;
  failureCodes: PublicationApprovalFailureCode[];
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (typeof item === "string" && item.trim()) return [item.trim()];
    if (item && typeof item === "object" && typeof (item as { value?: unknown }).value === "string") {
      const normalized = ((item as { value: string }).value).trim();
      return normalized ? [normalized] : [];
    }
    return [];
  });
}

export function validatePublicationApproval({
  approval,
  title,
  content,
  canonicalUrl,
  slug,
  publicationRevision,
  canonicalOrigin = getSiteUrl(),
  contentDecisionProvenance,
}: PublicationApprovalValidationInput): PublicationApprovalValidationResult {
  const failureCodes: PublicationApprovalFailureCode[] = [];
  if (contentDecisionProvenance) {
    const provenance = validatePublishingProvenance(contentDecisionProvenance);
    if (!provenance.allowed) failureCodes.push("content_decision_provenance_invalid");
  }
  if (!approval || typeof approval !== "object") {
    return { valid: false, failureCodes: ["approval_missing"] };
  }

  const source = approval as Record<string, unknown>;
  const validation =
    source.validationResult && typeof source.validationResult === "object"
      ? (source.validationResult as Record<string, unknown>)
      : undefined;
  const scope =
    source.publicationScope && typeof source.publicationScope === "object"
      ? (source.publicationScope as Record<string, unknown>)
      : undefined;
  const timestamp = typeof source.approvalTimestamp === "string" ? source.approvalTimestamp : "";

  if (!timestamp || Number.isNaN(Date.parse(timestamp))) failureCodes.push("approval_timestamp_invalid");
  if (typeof source.approver !== "string" || !source.approver.trim()) failureCodes.push("approver_missing");
  if (stringArray(source.supportingApprovedInsightIds).length === 0) failureCodes.push("supporting_insight_ids_missing");
  if (
    validation?.deterministicHardGatesPassed !== true ||
    validation?.semanticQualityPassed !== true ||
    stringArray(validation?.failureCodes).length > 0
  ) {
    failureCodes.push("validation_not_passed");
  }
  if (scope?.deploymentAuthorized !== true) failureCodes.push("deployment_not_authorized");
  if (scope?.publicationAuthorized !== true) failureCodes.push("publication_not_authorized");

  let canonical: URL | undefined;
  let configuredOrigin: URL | undefined;
  try {
    canonical = new URL(typeof canonicalUrl === "string" ? canonicalUrl : "");
    configuredOrigin = new URL(canonicalOrigin);
  } catch {
    failureCodes.push("canonical_url_invalid");
  }

  if (canonical && configuredOrigin) {
    if (canonical.origin !== configuredOrigin.origin) failureCodes.push("canonical_origin_mismatch");
    if (canonical.search || canonical.hash) failureCodes.push("canonical_url_invalid");
    if (!stringArray(scope?.approvedCanonicalPaths).includes(canonical.pathname)) {
      failureCodes.push("canonical_path_not_approved");
    }
    if (typeof slug !== "string" || canonical.pathname.split("/").filter(Boolean).at(-1) !== slug) {
      failureCodes.push("canonical_slug_mismatch");
    }

    if (typeof title !== "string" || typeof content !== "string") {
      failureCodes.push("revision_hash_mismatch");
    } else {
      const expectedHash = createContentRevisionHash({ title, canonicalPath: canonical.pathname, content });
      if (source.contentRevisionHash !== expectedHash) failureCodes.push("revision_hash_mismatch");
    }

    if (
      typeof publicationRevision !== "string" ||
      source.publicationRevisionHash !== createPublicationRevisionHash(publicationRevision)
    ) {
      failureCodes.push("publication_revision_hash_mismatch");
    }
  }

  return { valid: failureCodes.length === 0, failureCodes };
}

function normalizeLineEndings(value: unknown): unknown {
  if (typeof value === "string") return value.replace(/\r\n/g, "\n").trim();
  if (Array.isArray(value)) return value.map(normalizeLineEndings);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, normalizeLineEndings(item)]),
    );
  }
  return value;
}

function values(value: unknown, key = "value"): string[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (typeof item === "string") return [item];
    if (item && typeof item === "object" && typeof (item as Record<string, unknown>)[key] === "string") {
      return [(item as Record<string, string>)[key]];
    }
    return [];
  });
}

export function createPublicationRevisionHash(publicationRevision: string): string {
  return createHash("sha256").update(publicationRevision, "utf8").digest("hex");
}

export function serializeAuthorityPublicationRevision(record: Record<string, unknown>): string {
  const text = (value: unknown, fallback = "") => (typeof value === "string" ? value : fallback);
  const faq = Array.isArray(record.faq)
    ? record.faq.map((item) => {
        const entry = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
        return {
          question: entry.question,
          answer: entry.answer,
          entityTags: values(entry.entityTags),
          targetRecommendationQueries: values(entry.targetRecommendationQueries),
        };
      })
    : [];
  const internalLinks = Array.isArray(record.internalLinks)
    ? record.internalLinks.map((item) => {
        const link = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
        return {
          targetSlug: link.targetSlug,
          anchorText: link.anchorText,
          reason: link.reason,
          sourceEntityTags: values(link.sourceEntityTags),
          targetEntityTags: values(link.targetEntityTags),
        };
      })
    : [];

  return JSON.stringify(normalizeLineEndings({
    slug: text(record.slug),
    title: text(record.title),
    excerpt: text(record.excerpt),
    content: text(record.content),
    aiSummary: text(record.aiSummary),
    citationSnippet: text(record.citationSnippet),
    evidenceUrls: values(record.evidenceUrls),
    targetQuestions: values(record.targetQuestions),
    targetRecommendationQueries: values(record.targetRecommendationQueries),
    entityTags: values(record.entityTags, "tag"),
    seoTitle: text(record.seoTitle, text(record.title)),
    seoDescription: text(record.seoDescription),
    schemaType: text(record.schemaType, "Article"),
    faq,
    internalLinks,
    author: text(record.author, "Itay Foyerstein"),
    canonicalUrl: record.canonicalUrl,
  }));
}

export function serializeProblemPageRevisionContent(record: Record<string, unknown>): string {
  const textList = (value: unknown): string[] =>
    Array.isArray(value)
      ? value.flatMap((item) => {
          if (typeof item === "string") return [item];
          if (item && typeof item === "object" && typeof (item as { value?: unknown }).value === "string") {
            return [(item as { value: string }).value];
          }
          return [];
        })
      : [];
  const links = (value: unknown) =>
    Array.isArray(value)
      ? value.map((item) => {
          const link = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
          return { label: link.label, href: link.href, reason: link.reason };
        })
      : [];
  const evidence =
    record.evidenceBlock && typeof record.evidenceBlock === "object"
      ? (record.evidenceBlock as Record<string, unknown>)
      : {};
  const cta =
    record.primaryCTA && typeof record.primaryCTA === "object"
      ? (record.primaryCTA as Record<string, unknown>)
      : {};

  return JSON.stringify(normalizeLineEndings({
    painStatement: record.painStatement,
    dailyScenes: textList(record.dailyScenes),
    whatTheyTried: textList(record.whatTheyTried),
    whyItFailed: record.whyItFailed,
    diagnosis: record.diagnosis,
    evidenceBlock: {
      claim: evidence.claim,
      source: evidence.source,
      relatedEntity: evidence.relatedEntity,
      confidence: evidence.confidence,
      approvalStatus: evidence.approvalStatus,
    },
    primaryCTA: { label: cta.label, href: cta.href, rationale: cta.rationale ?? cta.reason },
    relatedFrameworks: links(record.relatedFrameworks),
    relatedClusters: links(record.relatedClusters),
  }));
}

export function serializeProblemPagePublicationRevision(record: Record<string, unknown>): string {
  return JSON.stringify(normalizeLineEndings({
    slug: record.slug,
    title: record.title,
    readerFacingContent: JSON.parse(serializeProblemPageRevisionContent(record)) as unknown,
    seoTitle: record.seoTitle,
    seoDescription: record.seoDescription,
    canonicalUrl: record.canonicalUrl,
  }));
}
