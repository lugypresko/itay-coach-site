import { contentDecisionSchema, type ContentDecision } from "./contracts";
import type { ContentDecisionVocabulary, VocabularyItem } from "./vocabulary";

export type ContentDecisionFailureCode =
  | "invalid_contract"
  | "orphan_reference"
  | "missing_evidence"
  | "duplicate_canonical_path"
  | "conflicting_active_version"
  | "stale_validation"
  | "cta_conflict"
  | "revalidation_required";

export interface ContentDecisionValidationResult {
  valid: boolean;
  failureCodes: ContentDecisionFailureCode[];
  details: string[];
}

export interface ContentDecisionValidationOptions {
  vocabulary: ContentDecisionVocabulary;
  now?: string;
  maxAgeDays?: number;
  previouslyValidatedDecisionVersion?: number;
}

function hasItem(items: VocabularyItem[], id: string) {
  return items.some((item) => item.id === id && item.status !== "archived");
}

function isStale(lastValidatedAt: string, now: string, maxAgeDays: number) {
  const validated = Date.parse(lastValidatedAt);
  const current = Date.parse(now);
  return !Number.isFinite(validated) || !Number.isFinite(current) || current - validated > maxAgeDays * 24 * 60 * 60 * 1000;
}

export function validateContentDecision(
  input: unknown,
  options: ContentDecisionValidationOptions,
): ContentDecisionValidationResult {
  const parsed = contentDecisionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      valid: false,
      failureCodes: ["invalid_contract"],
      details: parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
    };
  }

  const decision: ContentDecision = parsed.data;
  const { vocabulary } = options;
  const references = [
    [decision.primaryAudienceEntityId, vocabulary.entities],
    [decision.primaryProblemId, vocabulary.problems],
    ...decision.symptomIds.map((id) => [id, vocabulary.symptoms] as const),
    [decision.primaryFrameworkEntityId, vocabulary.frameworks],
    [decision.primaryOfferId, vocabulary.offers],
    [decision.primaryCtaId, vocabulary.ctas],
    ...decision.claimIds.map((id) => [id, vocabulary.claims] as const),
    ...decision.evidenceIds.map((id) => [id, vocabulary.evidence] as const),
    ...decision.sourceInsightIds.map((id) => [id, vocabulary.sourceInsights] as const),
  ] as const;

  const failureCodes: ContentDecisionFailureCode[] = [];
  const details: string[] = [];
  const orphanReferences = references.filter(([id, items]) => !hasItem(items, id));
  if (orphanReferences.length > 0) {
    failureCodes.push("orphan_reference");
    details.push(`Unknown canonical IDs: ${orphanReferences.map(([id]) => id).join(", ")}`);
  }

  if (decision.claimIds.length > 0 && decision.evidenceIds.length === 0) {
    failureCodes.push("missing_evidence");
    details.push("Every active claim requires at least one evidence ID.");
  }

  if (decision.lastValidatedAt && isStale(decision.lastValidatedAt, options.now ?? new Date().toISOString(), options.maxAgeDays ?? 30)) {
    failureCodes.push("stale_validation");
    details.push("lastValidatedAt is outside the allowed validation window.");
  }

  const cta = vocabulary.ctas.find((item) => item.id === decision.primaryCtaId);
  if (cta && !cta.compatibleJourneyStages.includes(decision.journeyStage)) {
    failureCodes.push("cta_conflict");
    details.push(`CTA ${decision.primaryCtaId} is not compatible with journey stage ${decision.journeyStage}.`);
  }

  if (
    options.previouslyValidatedDecisionVersion !== undefined &&
    options.previouslyValidatedDecisionVersion !== decision.decisionVersion
  ) {
    failureCodes.push("revalidation_required");
    details.push(`Decision version ${decision.decisionVersion} differs from previously validated version ${options.previouslyValidatedDecisionVersion}.`);
  }

  return { valid: failureCodes.length === 0, failureCodes, details };
}

export function validateContentDecisions(
  inputs: unknown[],
  options: ContentDecisionValidationOptions,
): ContentDecisionValidationResult {
  const parsed = inputs.map((input) => contentDecisionSchema.safeParse(input));
  const validDecisions = parsed.flatMap((result) => (result.success ? [result.data] : []));
  const results = inputs.map((input) => validateContentDecision(input, options));
  const failureCodes = results.flatMap((result) => result.failureCodes);
  const details = results.flatMap((result) => result.details);
  const activeByPath = new Map<string, ContentDecision[]>();

  for (const decision of validDecisions.filter((item) => item.status === "active")) {
    const existing = activeByPath.get(decision.canonicalPath) ?? [];
    activeByPath.set(decision.canonicalPath, [...existing, decision]);
  }

  for (const [path, decisions] of activeByPath) {
    if (decisions.length > 1) {
      if (!failureCodes.includes("duplicate_canonical_path")) failureCodes.push("duplicate_canonical_path");
      details.push(`Multiple active decisions own ${path}.`);
      if (new Set(decisions.map((decision) => decision.decisionVersion)).size > 1) {
        if (!failureCodes.includes("conflicting_active_version")) failureCodes.push("conflicting_active_version");
        details.push(`Active decisions for ${path} have conflicting versions.`);
      }
    }
  }

  return { valid: failureCodes.length === 0, failureCodes, details };
}
