import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { contentDecisionPageDecisions } from "../../src/seed/content-decision-page-mapping";
import { contentDecisionVocabulary } from "../../src/ai/content-decision/vocabulary";
import {
  authorityLaunchPages,
  engineeringManagerCoachReaderFacingArtifact,
} from "../../src/lib/authority-launch-pages";
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
import EngineeringManagerCoachPage from "../../src/app/(site)/engineering-manager-coach/page";
import EngineeringManagerCoachPreview from "../../src/app/(site)/preview/artifacts/[artifactId]/page";

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
    expect(chain.pageBrief.pagePatternId).toBe("conversion_landing_page");
    expect(chain.pageBrief.contentArchetype).toBe("conversion");
    expect(chain.pageBrief.contentPlan.map((item) => item.sectionTitle)).toEqual([
      "answer",
      "role-context",
      "symptoms",
      "mechanism",
      "next-step",
      "why-help",
      "cta",
    ]);
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
    expect(artifact.artifactHash).toBe("9080366c4cfaeac6b2f8e575c1770e885ce7cdaccd510bf16f152f31a6f0c5c9");
    expect(artifact.artifactVersion).toBe(2);
    expect(artifact.title).toBe("Stop Being the Bottleneck as an Engineering Manager");
    expect(artifact.description).toContain("Build a team that can make progress without waiting for you");
    expect(artifact.body.find((section) => section.sectionId === "symptoms")?.bullets).toContain("You are pulled into every review because nobody knows where your judgment should stop.");
    expect(artifact.body.find((section) => section.sectionId === "mechanism")?.paragraphs[0]).toContain("Invisible Executor");
    expect(artifact.body.find((section) => section.sectionId === "cta")?.paragraphs[0]).toContain("Book a fit call");
    expect(artifact.artifactHash).toMatch(/^[a-f0-9]{64}$/);
    expect(validateReaderFacingArtifactDeterministically(artifact, "2026-07-26T00:02:00.000Z").passed).toBe(true);
    expect(validateArtifactInternalLanguage(artifact, "2026-07-26T00:02:00.000Z").passed).toBe(true);
    expect(validateArtifactCompleteness(artifact, "2026-07-26T00:02:00.000Z", chain.pagePattern.id).passed).toBe(true);

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

  it("renders the reader-facing artifact in the protected preview without internal PageBrief metadata", async () => {
    const html = renderToStaticMarkup(
      await EngineeringManagerCoachPreview({
        params: Promise.resolve({ artifactId: "artifact-engineering-manager-coach" }),
      }),
    );

    expect(engineeringManagerCoachReaderFacingArtifact.artifactVersion).toBe(2);
    expect(engineeringManagerCoachReaderFacingArtifact.artifactHash).not.toBe(
      "b051e2c3c11fc716628c024e184854b3abfe4a9817df5b8af17a3c7075d44063",
    );
    expect(engineeringManagerCoachReaderFacingArtifact.artifactHash).toBe(
      "9080366c4cfaeac6b2f8e575c1770e885ce7cdaccd510bf16f152f31a6f0c5c9",
    );
    expect(html).toContain("Stop Being the Bottleneck as an Engineering Manager");
    expect(html).toContain("Engineering Manager coaching");
    expect(html).toContain("When execution becomes dependency");
    expect(html).toContain("The Invisible Executor pattern");
    expect(html).toContain("Book a fit call");
    expect(html).toContain("Why Engineering Managers Become Bottlenecks");
    expect(html).not.toContain("INTERNAL BRIEF PREVIEW");
    expect(html).not.toContain("PAGE-BRIEF-DECISION-ENGINEERING-MANAGER-COACH");
    expect(html).not.toContain("execution-bottleneck");
    expect(html).not.toContain("invisible-executor-framework");
    expect(html).not.toContain("ContentDecision");
  });

  it("uses the same artifact renderer on the local Engineering Manager Coach route", () => {
    const html = renderToStaticMarkup(EngineeringManagerCoachPage());
    expect(html).toContain("Engineering Manager coaching");
    expect(html).not.toContain("INTERNAL BRIEF PREVIEW");
  });
});
