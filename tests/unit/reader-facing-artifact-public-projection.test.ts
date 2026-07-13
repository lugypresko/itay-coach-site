import { describe, expect, it } from "vitest";

import { createReaderFacingArtifactDraft } from "../../src/domain/reader-facing-page-artifact";
import { buildReaderFacingArtifactPublicProjection } from "../../src/lib/reader-facing-artifact-public-projection";

const artifact = createReaderFacingArtifactDraft({
  artifactId: "artifact-05",
  artifactVersion: 1,
  schemaVersion: "1.0.0",
  createdAt: "2026-07-13T09:00:00.000Z",
  pageType: "cluster",
  canonicalPath: "/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck",
  locale: "en",
  title: "Your team should not need you for every important decision",
  description: "Diagnose the dependency pattern that keeps returning decisions to you.",
  body: [{ sectionId: "diagnosis", paragraphs: ["This is a dependency problem."] }],
  primaryCta: { label: "Diagnose your bottleneck pattern", href: "/player-trap", context: "Start with the diagnostic." },
  internalLinks: [{ label: "Player Trap framework", href: "/frameworks/player-trap" }],
  seo: { title: "Stop being the bottleneck", description: "Diagnose the dependency pattern." },
});

function chain() {
  const binding = { artifactId: artifact.artifactId, artifactVersion: artifact.artifactVersion, artifactHash: artifact.artifactHash };
  return {
    deterministicValidation: { ...binding, validationType: "deterministic", passed: true, failureCodes: [], validatedAt: "2026-07-13T09:01:00.000Z" },
    internalLanguageValidation: { ...binding, validationType: "internal_language", passed: true, failureCodes: [], validatedAt: "2026-07-13T09:02:00.000Z" },
    semanticReview: { ...binding, passed: true, reviewedAt: "2026-07-13T09:03:00.000Z", dimensions: [{ dimension: "clarity", score: 90, passed: true, reason: "Direct diagnosis." }] },
    humanApproval: { ...binding, decision: "approved", approver: "human@example.com", approvedAt: "2026-07-13T09:04:00.000Z" },
    publicationRecord: { ...binding, publicationState: "published", indexable: true, publishedAt: "2026-07-13T09:05:00.000Z" },
  } as const;
}

describe("ReaderFacingPageArtifact shared public projection", () => {
  it("returns nothing for a draft even if governance sidecars are forged", () => {
    const projection = buildReaderFacingArtifactPublicProjection([{ artifact, ...chain() }]);
    expect(projection.pages).toEqual([]);
    expect(projection.sitemapPathnames).toEqual([]);
    expect(projection.llmsTxtPathnames).toEqual([]);
    expect(projection.exclusions[0]?.reasonCodes).toContain("artifact_not_approved");
  });

  it("projects only public fields from one fully matching approved chain", () => {
    const approved = { ...artifact, lifecycle: "approved" as const };
    const projection = buildReaderFacingArtifactPublicProjection([{ artifact: approved, ...chain() }]);
    expect(projection.sitemapPathnames).toEqual([approved.canonicalPath]);
    expect(projection.llmsTxtPathnames).toEqual([approved.canonicalPath]);
    expect(projection.pages[0]).toEqual(approved);
    expect(projection.pages[0]).not.toHaveProperty("humanApproval");
    expect(projection.pages[0]).not.toHaveProperty("publicationRecord");
  });

  it("fails closed when two records claim the same canonical path", () => {
    const approved = { ...artifact, lifecycle: "approved" as const };
    const projection = buildReaderFacingArtifactPublicProjection([
      { artifact: approved, ...chain() },
      { artifact: approved, ...chain() },
    ]);
    expect(projection.pages).toEqual([]);
    expect(projection.exclusions.every((item) => item.reasonCodes.includes("canonical_collision"))).toBe(true);
  });
});
