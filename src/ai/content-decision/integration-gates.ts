import type { PageBrief } from "../agents/agentFactoryContracts";
import type { ContentDecision } from "./contracts";
import { contentDecisionToPageBrief } from "./to-page-brief";
import { validateContentDecision } from "./validate-content-decision";
import type { ContentDecisionVocabulary } from "./vocabulary";

export type ContentDecisionGateFailure = "decision_missing" | "decision_invalid" | "page_brief_conflict" | "revalidation_required" | "provenance_missing" | "provenance_stale" | "provenance_version_mismatch";

export interface ContentDecisionGateResult {
  allowed: boolean;
  failureCodes: ContentDecisionGateFailure[];
  details: string[];
}

export function evaluateContentDecisionGeneration({
  decision,
  pageBrief,
  vocabulary,
  previouslyValidatedDecisionVersion,
  now,
}: {
  decision?: ContentDecision;
  pageBrief?: PageBrief;
  vocabulary: ContentDecisionVocabulary;
  previouslyValidatedDecisionVersion?: number;
  now?: string;
}): ContentDecisionGateResult {
  if (!decision) return { allowed: false, failureCodes: ["decision_missing"], details: ["ContentDecision is required before generation."] };
  const validation = validateContentDecision(decision, { vocabulary, now, previouslyValidatedDecisionVersion });
  const failureCodes: ContentDecisionGateFailure[] = [];
  const details = [...validation.details];
  if (!validation.valid) {
    if (validation.failureCodes.includes("revalidation_required")) failureCodes.push("revalidation_required");
    failureCodes.push("decision_invalid");
  }
  if (decision.validationStatus !== "valid" || !decision.lastValidatedAt) {
    failureCodes.push("revalidation_required");
    details.push("Decision must have a current valid validation status before generation.");
  }
  if (pageBrief) {
    const projected = contentDecisionToPageBrief(decision, vocabulary);
    if (pageBrief.canonicalPath !== projected.canonicalPath || pageBrief.cta.href !== projected.cta.href || pageBrief.audiencePain.summary !== projected.audiencePain.summary) {
      failureCodes.push("page_brief_conflict");
      details.push("PageBrief does not match the explicit ContentDecision projection.");
    }
  }
  return { allowed: failureCodes.length === 0, failureCodes: [...new Set(failureCodes)], details };
}

export function validatePublishingProvenance({
  decision,
  artifactDecisionId,
  artifactDecisionVersion,
  vocabulary,
  now,
}: {
  decision?: ContentDecision;
  artifactDecisionId?: string;
  artifactDecisionVersion?: number;
  vocabulary: ContentDecisionVocabulary;
  now?: string;
}): ContentDecisionGateResult {
  if (!decision) return { allowed: false, failureCodes: ["provenance_missing"], details: ["Publishing provenance must identify a ContentDecision."] };
  const validation = validateContentDecision(decision, { vocabulary, now });
  const failureCodes: ContentDecisionGateFailure[] = [];
  const details = [...validation.details];
  if (!validation.valid || decision.validationStatus !== "valid" || !decision.lastValidatedAt) {
    failureCodes.push("provenance_stale");
    details.push("Publishing requires a current valid ContentDecision.");
  }
  if (artifactDecisionId !== decision.id) failureCodes.push("provenance_version_mismatch");
  if (artifactDecisionVersion !== decision.decisionVersion) failureCodes.push("provenance_version_mismatch");
  return { allowed: failureCodes.length === 0, failureCodes: [...new Set(failureCodes)], details };
}
