import { buildQueryAuthorityScorecard } from "./scoring";
import type { Competitor, QueryAuthorityReviewInput, QueryAuthorityScorecard } from "./types";

export type MonitoringCaptureMode = "manual" | "semi_manual" | "automated";

export type MonitoringReviewStatus = "draft" | "needs_review" | "ready_for_review" | "approved";

export type MonitoringCollectionKey = "query_authority_scorecards" | "competitor_contracts";

export interface MonitoringRecordMetadata {
  captureMode?: MonitoringCaptureMode;
  recordedAt?: string;
  recordedBy?: string;
  reviewStatus?: MonitoringReviewStatus;
  sourceUrls?: string[];
  reviewerNotes?: string;
}

export interface PayloadQueryAuthorityScorecardContract extends QueryAuthorityScorecard {
  collectionKey: "query_authority_scorecards";
  recordType: "query_authority_scorecard";
  captureMode: MonitoringCaptureMode;
  reviewStatus: MonitoringReviewStatus;
  recordedAt: string;
  recordedBy?: string;
  sourceUrls: string[];
  sourceCount: number;
  reviewerNotes?: string;
}

export interface PayloadCompetitorContract extends Competitor {
  collectionKey: "competitor_contracts";
  recordType: "competitor_contract";
  captureMode: MonitoringCaptureMode;
  reviewStatus: MonitoringReviewStatus;
  recordedAt: string;
  recordedBy?: string;
  sourceUrls: string[];
  sourceCount: number;
  reviewerNotes?: string;
  lastReviewedAt?: string;
}

export interface MonitoringLogBundle {
  scorecard: PayloadQueryAuthorityScorecardContract;
  competitors: PayloadCompetitorContract[];
}

interface ResolvedMonitoringMetadata {
  captureMode: MonitoringCaptureMode;
  recordedAt: string;
  recordedBy?: string;
  reviewStatus: MonitoringReviewStatus;
  sourceUrls: string[];
  reviewerNotes?: string;
}

function normalizeStringList(values: readonly string[] = []): string[] {
  const normalized: string[] = [];
  const seen = new Set<string>();

  for (const value of values) {
    const candidate = value.trim();
    if (!candidate) {
      continue;
    }

    const key = candidate.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    normalized.push(candidate);
  }

  return normalized;
}

function normalizeHostname(value: string): string | null {
  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function matchesOwnedDomain(hostname: string, ownedDomains: readonly string[]): boolean {
  return ownedDomains.some((ownedDomain) => {
    const normalizedOwnedDomain = ownedDomain.toLowerCase();
    return hostname === normalizedOwnedDomain || hostname.endsWith(`.${normalizedOwnedDomain}`);
  });
}

function detectOwnedUrlCitation(citedUrls: readonly string[], ownedDomains: readonly string[]): boolean {
  return citedUrls.some((url) => {
    const hostname = normalizeHostname(url);
    return hostname ? matchesOwnedDomain(hostname, ownedDomains) : false;
  });
}

function resolveMetadata(metadata: MonitoringRecordMetadata = {}): ResolvedMonitoringMetadata {
  return {
    captureMode: metadata.captureMode ?? "manual",
    recordedAt: metadata.recordedAt ?? new Date().toISOString(),
    recordedBy: metadata.recordedBy,
    reviewStatus: metadata.reviewStatus ?? "draft",
    sourceUrls: normalizeStringList(metadata.sourceUrls),
    reviewerNotes: metadata.reviewerNotes,
  };
}

export function buildPayloadQueryAuthorityScorecardContract(
  scorecard: QueryAuthorityScorecard,
  metadata: MonitoringRecordMetadata = {},
): PayloadQueryAuthorityScorecardContract {
  const resolved = resolveMetadata(metadata);
  const optionalFields = {
    ...(resolved.recordedBy !== undefined ? { recordedBy: resolved.recordedBy } : {}),
    ...(resolved.reviewerNotes !== undefined ? { reviewerNotes: resolved.reviewerNotes } : {}),
  };

  return {
    ...scorecard,
    collectionKey: "query_authority_scorecards",
    recordType: "query_authority_scorecard",
    captureMode: resolved.captureMode,
    reviewStatus: resolved.reviewStatus,
    recordedAt: resolved.recordedAt,
    sourceUrls: resolved.sourceUrls,
    sourceCount: resolved.sourceUrls.length,
    mentionedEntities: normalizeStringList(scorecard.mentionedEntities),
    citedUrls: normalizeStringList(scorecard.citedUrls),
    citations: normalizeStringList(scorecard.citations),
    competitorsRecommended: normalizeStringList(scorecard.competitorsRecommended),
    ...optionalFields,
  };
}

export function buildPayloadCompetitorContract(
  competitor: Competitor,
  metadata: MonitoringRecordMetadata = {},
): PayloadCompetitorContract {
  const resolved = resolveMetadata(metadata);
  const optionalFields = {
    ...(resolved.recordedBy !== undefined ? { recordedBy: resolved.recordedBy } : {}),
    ...(resolved.reviewerNotes !== undefined ? { reviewerNotes: resolved.reviewerNotes } : {}),
  };

  return {
    ...competitor,
    collectionKey: "competitor_contracts",
    recordType: "competitor_contract",
    captureMode: resolved.captureMode,
    reviewStatus: resolved.reviewStatus,
    recordedAt: resolved.recordedAt,
    sourceUrls: resolved.sourceUrls,
    sourceCount: resolved.sourceUrls.length,
    lastReviewedAt: resolved.recordedAt,
    knownStrengths: normalizeStringList(competitor.knownStrengths),
    targetQueriesWhereTheyAppear: normalizeStringList(competitor.targetQueriesWhereTheyAppear),
    ...optionalFields,
  };
}

export function buildMonitoringLogBundle(input: {
  scorecard: QueryAuthorityScorecard;
  competitors?: Competitor[];
  metadata?: MonitoringRecordMetadata;
}): MonitoringLogBundle {
  return {
    scorecard: buildPayloadQueryAuthorityScorecardContract(input.scorecard, input.metadata),
    competitors: (input.competitors ?? []).map((competitor) =>
      buildPayloadCompetitorContract(competitor, input.metadata),
    ),
  };
}

export function createMonitoringLogBundleFromReview(input: {
  review: QueryAuthorityReviewInput;
  ownedDomains: string[];
  competitors?: Competitor[];
  metadata?: MonitoringRecordMetadata;
}): MonitoringLogBundle {
  return buildMonitoringLogBundle({
    scorecard: buildQueryAuthorityScorecard({
      ...input.review,
      ownedUrlCited: detectOwnedUrlCitation(input.review.citedUrls, input.ownedDomains),
    }),
    competitors: input.competitors,
    metadata: input.metadata,
  });
}
