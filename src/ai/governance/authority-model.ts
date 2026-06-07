export const authorityEntityTypeOptions = ["expert", "methodology", "framework", "audience", "concept"] as const;

export type AuthorityEntityType = (typeof authorityEntityTypeOptions)[number];

export const authorityEntityStatusOptions = ["draft", "active", "archived"] as const;

export type AuthorityEntityStatus = (typeof authorityEntityStatusOptions)[number];

export const authorityTierOptions = ["foundational", "emerging", "strong", "dominant"] as const;

export type AuthorityTier = (typeof authorityTierOptions)[number];

export const authorityRelationshipTypeOptions = [
  "owns",
  "explains",
  "supports",
  "serves",
  "reinforces",
  "derived_from",
  "mentions",
  "recommended_for",
  "contrasts_with",
] as const;

export type AuthorityRelationshipType = (typeof authorityRelationshipTypeOptions)[number];

export const authorityRelationshipStatusOptions = ["proposed", "approved", "archived"] as const;

export type AuthorityRelationshipStatus = (typeof authorityRelationshipStatusOptions)[number];

export const authorityGapLifecycleOptions = [
  "open",
  "triaged",
  "assigned",
  "in_progress",
  "resolved",
  "dismissed",
] as const;

export type AuthorityGapLifecycle = (typeof authorityGapLifecycleOptions)[number];

export const authorityGapTypeOptions = [
  "entity_gap",
  "methodology_gap",
  "framework_gap",
  "evidence_gap",
  "schema_gap",
  "link_graph_gap",
  "freshness_gap",
  "third_party_gap",
  "intent_gap",
  "competitor_gap",
  "unknown",
] as const;

export type AuthorityGapType = (typeof authorityGapTypeOptions)[number];

export const authorityRecordStatusOptions = ["draft", "review", "approved", "archived"] as const;

export type AuthorityRecordStatus = (typeof authorityRecordStatusOptions)[number];

export interface EntityAuthoritySignalInput {
  entityType: AuthorityEntityType;
  status: AuthorityEntityStatus;
  canonicalRole: string;
  description: string;
  sameAsCount: number;
  evidenceCount: number;
  targetQueryCount: number;
  relationshipCount: number;
}

export interface EntityAuthorityScoreResult {
  currentScore: number;
  authorityTier: AuthorityTier;
}

function clampScore(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function classifyAuthorityTier(score: number): AuthorityTier {
  if (score >= 90) {
    return "dominant";
  }

  if (score >= 75) {
    return "strong";
  }

  if (score >= 50) {
    return "emerging";
  }

  return "foundational";
}

export function calculateEntityAuthorityScore(input: EntityAuthoritySignalInput): EntityAuthorityScoreResult {
  let score = 0;

  if (input.status === "active") {
    score += 15;
  }

  if (input.canonicalRole.trim()) {
    score += 15;
  }

  if (input.entityType === "expert") {
    score += 15;
  } else if (input.entityType === "methodology" || input.entityType === "framework") {
    score += 12;
  } else {
    score += 8;
  }

  if (input.description.trim().length >= 80) {
    score += 10;
  }

  if (input.sameAsCount > 0) {
    score += 15;
  }

  if (input.evidenceCount > 0) {
    score += 15;
  }

  if (input.targetQueryCount > 0) {
    score += 15;
  }

  if (input.relationshipCount > 0) {
    score += Math.min(10, input.relationshipCount * 2);
  }

  const currentScore = clampScore(score);

  return {
    currentScore,
    authorityTier: classifyAuthorityTier(currentScore),
  };
}

