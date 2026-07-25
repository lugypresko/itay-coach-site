import { describe, expect, it } from "vitest";

import { contentDecisionVocabulary } from "../../src/ai/content-decision/vocabulary";
import { contentDecisionToPageBrief } from "../../src/ai/content-decision/to-page-brief";
import { evaluateContentDecisionGeneration, validatePublishingProvenance } from "../../src/ai/content-decision/integration-gates";
import { validateContentDecision } from "../../src/ai/content-decision/validate-content-decision";

const validDecision = {
  id: "decision-phase1",
  decisionVersion: 1,
  pagePatternId: "conversion_landing_page" as const,
  contentArchetype: "conversion" as const,
  primaryAudienceEntityId: "engineering-manager",
  primaryProblemId: "execution-bottleneck",
  symptomIds: ["approval-dependency"],
  primaryFrameworkEntityId: "invisible-executor-framework",
  primaryOfferId: "the-push-coaching",
  primaryCtaId: "book-fit-call",
  journeyStage: "coach_intent" as const,
  claimIds: ["claim-leaders-become-default-route"],
  evidenceIds: ["evidence-approved-insight-player-trap"],
  canonicalPath: "/phase1",
  sourceInsightIds: ["approved-insight-player-trap-05"],
  status: "active" as const,
  lastValidatedAt: "2026-07-25T00:00:00.000Z",
  validationStatus: "valid" as const,
};

describe("ContentDecision Phase 1 integration gates", () => {
  it("blocks an incompatible CTA deterministically", () => {
    const result = validateContentDecision({ ...validDecision, journeyStage: "awareness" }, { vocabulary: contentDecisionVocabulary });
    expect(result.valid).toBe(false);
    expect(result.failureCodes).toContain("cta_conflict");
  });

  it("projects PageBrief from IDs and changes projection when the problem changes", () => {
    const first = contentDecisionToPageBrief(validDecision, contentDecisionVocabulary);
    const second = contentDecisionToPageBrief({ ...validDecision, primaryProblemId: "execution-bottleneck", symptomIds: ["strategic-time-collapse"] }, contentDecisionVocabulary);
    expect(first.canonicalPath).toBe(validDecision.canonicalPath);
    expect(first.sourceInsightIds).toEqual(validDecision.sourceInsightIds);
    expect(first.audiencePain.painThemes).not.toEqual(second.audiencePain.painThemes);
  });

  it("blocks missing, invalid, conflicting, and stale generation inputs", () => {
    const pageBrief = contentDecisionToPageBrief(validDecision, contentDecisionVocabulary);
    expect(evaluateContentDecisionGeneration({ vocabulary: contentDecisionVocabulary, pageBrief }).failureCodes).toContain("decision_missing");
    expect(evaluateContentDecisionGeneration({ vocabulary: contentDecisionVocabulary, decision: { ...validDecision, evidenceIds: [] }, pageBrief }).failureCodes).toContain("decision_invalid");
    expect(evaluateContentDecisionGeneration({ vocabulary: contentDecisionVocabulary, decision: validDecision, pageBrief, previouslyValidatedDecisionVersion: 0 }).failureCodes).toContain("revalidation_required");
    expect(evaluateContentDecisionGeneration({ vocabulary: contentDecisionVocabulary, decision: { ...validDecision, lastValidatedAt: "2020-01-01T00:00:00.000Z" }, pageBrief, now: "2026-07-25T00:00:00.000Z" }).allowed).toBe(false);
  });

  it("blocks publishing when provenance is missing, stale, or version-mismatched", () => {
    expect(validatePublishingProvenance({ vocabulary: contentDecisionVocabulary }).failureCodes).toContain("provenance_missing");
    expect(validatePublishingProvenance({ vocabulary: contentDecisionVocabulary, decision: validDecision, artifactDecisionId: validDecision.id, artifactDecisionVersion: 2 }).failureCodes).toContain("provenance_version_mismatch");
    expect(validatePublishingProvenance({ vocabulary: contentDecisionVocabulary, decision: { ...validDecision, validationStatus: "stale" }, artifactDecisionId: validDecision.id, artifactDecisionVersion: 1 }).failureCodes).toContain("provenance_stale");
  });
});
