import { describe, expect, it } from "vitest";

import { createReaderFacingArtifactDraft } from "../../src/domain/reader-facing-page-artifact";
import {
  pagePatternIds,
  pagePatterns,
  validateArtifactAgainstPagePattern,
  validatePagePatternDecision,
} from "../../src/ai/content-decision/page-patterns";
import { validateArtifactInternalLanguage } from "../../src/ai/governance/reader-facing-artifact-governance";

const baseDecision = {
  id: "decision-pattern-test",
  decisionVersion: 1,
  primaryAudienceEntityId: "engineering-manager",
  primaryProblemId: "execution-bottleneck",
  symptomIds: ["approval-dependency"],
  primaryFrameworkEntityId: "invisible-executor-framework",
  primaryOfferId: "the-push-coaching",
  primaryCtaId: "book-fit-call",
  journeyStage: "coach_intent" as const,
  claimIds: ["claim-leaders-become-default-route"],
  evidenceIds: ["evidence-approved-insight-player-trap"],
  canonicalPath: "/pattern-test",
  sourceInsightIds: ["approved-insight-player-trap-05"],
  status: "active" as const,
  lastValidatedAt: "2026-07-26T00:00:00.000Z",
  validationStatus: "valid" as const,
};

function artifactFor(patternId: (typeof pagePatternIds)[number]) {
  const pattern = pagePatterns[patternId];
  return createReaderFacingArtifactDraft({
    artifactId: `artifact-${patternId}`,
    artifactVersion: 1,
    schemaVersion: "1.0.0",
    createdAt: "2026-07-26T00:01:00.000Z",
    pageType: "cluster",
    canonicalPath: "/pattern-test",
    locale: "en",
    title: "A reader-facing page",
    description: "A useful reader-facing description.",
    body: pattern.requiredSectionIds.map((sectionId) => ({
      sectionId,
      heading: "A useful section",
      paragraphs: ["Reader-facing content explains the decision in plain language."],
    })),
    primaryCta: { label: "Book a fit call", href: "/book-a-fit-call", context: "Discuss the next step." },
    internalLinks: [],
    seo: { title: "A reader-facing page", description: "A useful reader-facing description." },
  });
}

describe("canonical Page Pattern layer", () => {
  it.each(pagePatternIds)("accepts a decision and artifact for %s", (patternId) => {
    const pattern = pagePatterns[patternId];
    const decision = { ...baseDecision, pagePatternId: patternId, contentArchetype: pattern.contentArchetype, journeyStage: pattern.compatibleJourneyStages[0] };
    expect(validatePagePatternDecision(decision).valid).toBe(true);
    expect(validateArtifactAgainstPagePattern(artifactFor(patternId), patternId).valid).toBe(true);
  });

  it("rejects a cross-pattern decision and artifact", () => {
    const decision = { ...baseDecision, pagePatternId: "framework_page" as const, contentArchetype: "conversion" as const };
    expect(validatePagePatternDecision(decision).failureCodes).toContain("content_archetype_mismatch");
    expect(validateArtifactAgainstPagePattern(artifactFor("conversion_landing_page"), "framework_page").failureCodes).toContain("missing_required_section");
  });

  it("rejects incompatible journey stage and CTA", () => {
    const result = validatePagePatternDecision({
      ...baseDecision,
      pagePatternId: "problem_page",
      contentArchetype: "problem",
      journeyStage: "coach_intent",
      primaryCtaId: "wrong-cta",
    });
    expect(result.failureCodes).toEqual(["journey_stage_incompatible", "cta_incompatible"]);
  });

  it("rejects internal vocabulary IDs in reader-facing prose", () => {
    const artifact = artifactFor("article");
    const contaminated = {
      ...artifact,
      body: [{ ...artifact.body[0], paragraphs: ["The execution-bottleneck is an internal planning label."] }, ...artifact.body.slice(1)],
    };
    expect(validateArtifactInternalLanguage(contaminated, "2026-07-26T00:02:00.000Z").failureCodes).toContain("internal_identifier_in_prose");
  });
});
