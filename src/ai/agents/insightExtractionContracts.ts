export const insightExtractionSourceTypeOptions = [
  "voice_memo",
  "interview",
  "review",
  "note",
  "approved_quote",
] as const;

export type InsightExtractionSourceType = (typeof insightExtractionSourceTypeOptions)[number];

export const insightExtractionStatusOptions = ["draft", "needs_review", "approved", "archived"] as const;

export type InsightExtractionStatus = (typeof insightExtractionStatusOptions)[number];

export interface InsightExtractionClaim {
  text: string;
  evidenceUrls: string[];
  targetRecommendationQueries: string[];
  entityTags: string[];
}

export interface InsightExtractionContract {
  sourceTitle: string;
  sourceType: InsightExtractionSourceType;
  status: InsightExtractionStatus;
  capturedAt: string;
  approvedAt?: string;
  summary: string;
  rawText?: string;
  claims: InsightExtractionClaim[];
  evidenceUrls: string[];
  entityTags: string[];
  targetRecommendationQueries: string[];
  sourceUrls: string[];
  approvedBy?: string;
  authorityPurpose?: string;
  linkedContentJobId?: string;
  reviewerNotes?: string;
}

export interface InsightExtractionInput {
  sourceTitle: string;
  sourceType: InsightExtractionSourceType;
  capturedAt: string;
  summary: string;
  rawText?: string;
  claims?: InsightExtractionClaim[];
  evidenceUrls?: string[];
  entityTags?: string[];
  targetRecommendationQueries?: string[];
  sourceUrls?: string[];
  approvedAt?: string;
  approvedBy?: string;
  authorityPurpose?: string;
  linkedContentJobId?: string;
  reviewerNotes?: string;
  status?: InsightExtractionStatus;
}

function normalizeStringList(values: readonly string[] = []): string[] {
  const seen = new Set<string>();
  const output: string[] = [];

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
    output.push(candidate);
  }

  return output;
}

function normalizeClaims(claims: readonly InsightExtractionClaim[] = []): InsightExtractionClaim[] {
  return claims.flatMap((claim) => {
    const text = claim.text.trim();
    if (!text) {
      return [];
    }

    return [
      {
        text,
        evidenceUrls: normalizeStringList(claim.evidenceUrls),
        targetRecommendationQueries: normalizeStringList(claim.targetRecommendationQueries),
        entityTags: normalizeStringList(claim.entityTags),
      },
    ];
  });
}

export function buildInsightExtractionContract(input: InsightExtractionInput): InsightExtractionContract {
  return {
    sourceTitle: input.sourceTitle.trim(),
    sourceType: input.sourceType,
    status: input.status ?? "draft",
    capturedAt: input.capturedAt,
    approvedAt: input.approvedAt,
    summary: input.summary.trim(),
    rawText: typeof input.rawText === "string" ? input.rawText.trim() : undefined,
    claims: normalizeClaims(input.claims),
    evidenceUrls: normalizeStringList(input.evidenceUrls),
    entityTags: normalizeStringList(input.entityTags),
    targetRecommendationQueries: normalizeStringList(input.targetRecommendationQueries),
    sourceUrls: normalizeStringList(input.sourceUrls),
    approvedBy: typeof input.approvedBy === "string" ? input.approvedBy.trim() : undefined,
    authorityPurpose: typeof input.authorityPurpose === "string" ? input.authorityPurpose.trim() : undefined,
    linkedContentJobId: typeof input.linkedContentJobId === "string" ? input.linkedContentJobId.trim() : undefined,
    reviewerNotes: typeof input.reviewerNotes === "string" ? input.reviewerNotes.trim() : undefined,
  };
}

