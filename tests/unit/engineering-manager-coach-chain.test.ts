import { describe, expect, it } from "vitest";

import { contentDecisionPageDecisions } from "../../src/seed/content-decision-page-mapping";
import { contentDecisionVocabulary } from "../../src/ai/content-decision/vocabulary";
import { authorityLaunchPages } from "../../src/lib/authority-launch-pages";
import {
  buildCanonicalContentChain,
  buildEngineeringManagerCoachArtifactProvenance,
  generateEngineeringManagerCoachArtifact,
  revalidateContentDecision,
} from "../../src/ai/content-decision/canonical-page-chain";
import {
  validateArtifactCompleteness,
  validateArtifactInternalLanguage,
  validateReaderFacingArtifactDeterministically,
} from "../../src/ai/governance/reader-facing-artifact-governance";
import { validatePublishingProvenance } from "../../src/ai/content-decision/integration-gates";

describe("Engineering Manager Coach canonical content chain", () => {
  it("revalidates the decision and makes its projection the only PageBrief source", () => {
    const decision = contentDecisionPageDecisions.find((item) => item.canonicalPath === "/engineering-manager-coach");
    const historicalPageBrief = authorityLaunchPages.engineeringManagerCoach.pageBrief;
    if (!decision || !historicalPageBrief) throw new Error("Engineering Manager Coach fixtures are required.");

    const validated = revalidateContentDecision(decision, {
      vocabulary: contentDecisionVocabulary,
      validatedAt: "2026-07-26T00:00:00.000Z",
    });
    const chain = buildCanonicalContentChain({
      decision: validated,
      historicalPageBrief,
      vocabulary: contentDecisionVocabulary,
    });

    expect(validated.validationStatus).toBe("valid");
    expect(validated.lastValidatedAt).toBe("2026-07-26T00:00:00.000Z");
    expect(chain.pageBrief.canonicalPath).toBe("/engineering-manager-coach");
    expect(chain.pageBrief.sourceInsightIds).toEqual(validated.sourceInsightIds);
    expect(chain.historicalPageBrief).toBe(historicalPageBrief);
    expect(chain.pageBrief).not.toBe(historicalPageBrief);
  });

  it("generates a new hash-bound artifact draft from the canonical chain", () => {
    const decision = contentDecisionPageDecisions.find((item) => item.canonicalPath === "/engineering-manager-coach");
    const historicalPage = authorityLaunchPages.engineeringManagerCoach;
    const historicalPageBrief = historicalPage.pageBrief;
    if (!decision || !historicalPageBrief) throw new Error("Engineering Manager Coach fixtures are required.");

    const validated = revalidateContentDecision(decision, {
      vocabulary: contentDecisionVocabulary,
      validatedAt: "2026-07-26T00:00:00.000Z",
    });
    const chain = buildCanonicalContentChain({ decision: validated, historicalPageBrief, vocabulary: contentDecisionVocabulary });
    const artifact = generateEngineeringManagerCoachArtifact({ chain, historicalPage, createdAt: "2026-07-26T00:01:00.000Z" });

    expect(artifact.lifecycle).toBe("draft");
    expect(artifact.artifactHash).toMatch(/^[a-f0-9]{64}$/);
    expect(validateReaderFacingArtifactDeterministically(artifact, "2026-07-26T00:02:00.000Z").passed).toBe(true);
    expect(validateArtifactInternalLanguage(artifact, "2026-07-26T00:02:00.000Z").passed).toBe(true);
    expect(validateArtifactCompleteness(artifact, "2026-07-26T00:02:00.000Z").passed).toBe(true);

    const provenance = buildEngineeringManagerCoachArtifactProvenance({
      artifact,
      chain,
      generatedAt: "2026-07-26T00:03:00.000Z",
    });
    expect(provenance.pageBriefId).toBe(chain.pageBrief.id);
    expect(provenance.contentDecisionId).toBe(chain.decision.id);
    expect(provenance.contentDecisionVersion).toBe(chain.decision.decisionVersion);
    expect(provenance.sourceApprovedInsightIds).toEqual(chain.decision.sourceInsightIds);
    expect(provenance.artifactHash).toBe(artifact.artifactHash);

    expect(validatePublishingProvenance({
      decision: chain.decision,
      artifactDecisionId: provenance.contentDecisionId,
      artifactDecisionVersion: provenance.contentDecisionVersion,
      vocabulary: contentDecisionVocabulary,
      now: "2026-07-26T00:04:00.000Z",
    }).allowed).toBe(true);
    expect(validatePublishingProvenance({
      decision: chain.decision,
      artifactDecisionId: provenance.contentDecisionId,
      artifactDecisionVersion: provenance.contentDecisionVersion + 1,
      vocabulary: contentDecisionVocabulary,
      now: "2026-07-26T00:04:00.000Z",
    }).failureCodes).toContain("provenance_version_mismatch");
  });
});
