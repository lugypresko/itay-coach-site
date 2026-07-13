import { describe, expect, it } from "vitest";

import {
  createReaderFacingArtifactDraft,
  type ReaderFacingPageArtifact,
} from "../../src/domain/reader-facing-page-artifact";
import {
  evaluateArtifactPublication,
  validateArtifactInternalLanguage,
  validateArtifactCompleteness,
  validateArtifactUrls,
  type ArtifactHumanApproval,
  type ArtifactSemanticReview,
  type ArtifactValidationResult,
  type PublicationRecord,
} from "../../src/ai/governance/reader-facing-artifact-governance";

const now = "2026-07-13T12:00:00.000Z";

function artifact(overrides: Record<string, unknown> = {}): ReaderFacingPageArtifact {
  return createReaderFacingArtifactDraft({
    artifactId: "draft-05-player-trap",
    artifactVersion: 1,
    schemaVersion: "1.0.0",
    pageType: "framework",
    canonicalPath: "/frameworks/invisible-executor",
    locale: "en",
    title: "Leadership Operating Systems",
    description: "Move beyond hidden execution toward strategic authority.",
    body: [
      { sectionId: "definition", heading: "What is an Invisible Executor?", paragraphs: ["The leadership stage marked by hidden execution."] },
      { sectionId: "problem", heading: "The leverage gap", paragraphs: ["Execution prevents strategy."] },
      { sectionId: "symptoms", heading: "Symptoms", bullets: ["Isolated decision logic."] },
      { sectionId: "stages", heading: "Stages", paragraphs: ["Invisible, Trusted, Strategic."] },
      { sectionId: "interpretation", heading: "Interpretation", paragraphs: ["Doing different work."] },
      { sectionId: "limits", heading: "Limits", paragraphs: ["Not a management replacement."] },
      { sectionId: "next-step", heading: "Practical next step", paragraphs: ["Review your week."] },
    ],
    primaryCta: { label: "Schedule a diagnostic", href: "/book-a-fit-call", context: "Map team dependencies." },
    internalLinks: [],
    seo: { title: "Leadership Operating Systems | The Push", description: "Move beyond execution." },
    structuredDataInput: { type: "Article", authorName: "Itay Foyerstein" },
    createdAt: now,
    ...overrides,
  });
}

const activePaths = new Set(["/", "/book-a-fit-call", "/frameworks/invisible-executor"]);

function matchingChain(draft: ReaderFacingPageArtifact) {
  const binding = { artifactId: draft.artifactId, artifactVersion: draft.artifactVersion, artifactHash: draft.artifactHash };
  const deterministicValidation: ArtifactValidationResult = { ...binding, validationType: "deterministic", passed: true, failureCodes: [], validatedAt: now };
  const internalLanguageValidation: ArtifactValidationResult = { ...binding, validationType: "internal_language", passed: true, failureCodes: [], validatedAt: now };
  const semanticReview: ArtifactSemanticReview = {
    ...binding,
    passed: true,
    reviewedAt: now,
    dimensions: [{ dimension: "clarity", score: 5, passed: true, reason: "The diagnosis is direct and reader-facing." }],
  };
  const humanApproval: ArtifactHumanApproval = { ...binding, decision: "approved", approver: "human-reviewer", approvedAt: now };
  const publicationRecord: PublicationRecord = { ...binding, publicationState: "published", indexable: true, publishedAt: now };
  return { deterministicValidation, internalLanguageValidation, semanticReview, humanApproval, publicationRecord };
}

describe("reader-facing artifact governance", () => {
  it.each([
    ["review-ready recommendation page", "internal_meta_copy"],
    ["Content status: review", "internal_lifecycle_language"],
    ["Not reviewed yet", "internal_lifecycle_language"],
    ["docs/seed-content/player-trap.md", "internal_source_path"],
    ["C:\\workspace\\source.md", "internal_source_path"],
    ["What should this page strengthen?", "editorial_prompt"],
    ["AI answer engines", "internal_meta_copy"],
    ["proprietary framework to cite", "internal_meta_copy"],
    ["This page exists to strengthen authority", "internal_meta_copy"],
    ["target query", "internal_meta_copy"],
    ["SEO purpose", "internal_meta_copy"],
    ["converting leads", "internal_meta_copy"],
    ["Invisible Executor Page", "slug_derived_title"],
    ["intent rationale", "editorial_prompt"],
  ])("rejects system-facing language %s", (leak, expectedCode) => {
    const overrides = expectedCode === "slug_derived_title" ? { title: leak } : { description: leak };
    const result = validateArtifactInternalLanguage(artifact(overrides), now);
    expect(result.passed).toBe(false);
    expect(result.failureCodes).toContain(expectedCode);
  });

  it("rejects a raw internal URL embedded in reader prose", () => {
    const result = validateArtifactInternalLanguage(artifact({
      body: [{ sectionId: "definition", heading: "...", paragraphs: ["Read /frameworks/player-trap before continuing."] }],
    }), now);
    expect(result.failureCodes).toContain("raw_internal_url_in_prose");
  });

  it("rejects incomplete frameworks", () => {
    const incomplete = artifact({ body: [{ sectionId: "definition", paragraphs: ["..."] }] });
    const result = validateArtifactCompleteness(incomplete, now);
    expect(result.passed).toBe(false);
    expect(result.failureCodes).toContain("framework_incomplete");
  });

  it("rejects inactive URLs", () => {
    const badUrl = artifact({ primaryCta: { label: "Go", href: "/non-existent", context: "..." } });
    const result = validateArtifactUrls(badUrl, activePaths, now);
    expect(result.passed).toBe(false);
    expect(result.failureCodes).toContain("inactive_url_/non-existent");
  });

  it("fails closed without throwing for a malformed persisted artifact", () => {
    expect(evaluateArtifactPublication({
      artifact: { artifactId: "malformed" },
      deterministicValidation: {}, internalLanguageValidation: {}, semanticReview: {}, humanApproval: {}, publicationRecord: {},
    })).toEqual({ public: false, indexable: false, reasonCodes: ["artifact_contract_invalid"] });
  });

  it("publishes only an approved artifact with a complete matching chain", () => {
    const draft = artifact();
    const approved = { ...draft, lifecycle: "approved" as const };
    const result = evaluateArtifactPublication({ artifact: approved, ...matchingChain(approved) });
    expect(result).toEqual({ public: true, indexable: true, reasonCodes: [] });
  });

  it.each(["deterministicValidation", "internalLanguageValidation", "semanticReview", "humanApproval", "publicationRecord"] as const)(
    "fails closed when %s references another hash",
    (key) => {
      const draft = artifact();
      const approved = { ...draft, lifecycle: "approved" as const };
      const chain = matchingChain(approved);
      chain[key] = { ...chain[key], artifactHash: "0".repeat(64) } as never;
      const result = evaluateArtifactPublication({ artifact: approved, ...chain });
      expect(result.public).toBe(false);
      expect(result.indexable).toBe(false);
      expect(result.reasonCodes).toContain(`${key}_hash_mismatch`);
    },
  );

  it("fails closed for a draft even when forged matching approval and publication records exist", () => {
    const draft = artifact();
    const result = evaluateArtifactPublication({ artifact: draft, ...matchingChain(draft) });
    expect(result.public).toBe(false);
    expect(result.reasonCodes).toContain("artifact_not_approved");
  });

  it("fails closed when any review failed or the publication record is not published/indexable", () => {
    const draft = artifact();
    const approved = { ...draft, lifecycle: "approved" as const };
    const chain = matchingChain(approved);
    const result = evaluateArtifactPublication({
      artifact: approved,
      ...chain,
      semanticReview: { ...chain.semanticReview, passed: false },
      publicationRecord: { ...chain.publicationRecord, publicationState: "draft", indexable: false },
    });
    expect(result.public).toBe(false);
    expect(result.reasonCodes).toEqual(expect.arrayContaining(["semantic_review_failed", "publication_record_not_published"]));
  });
});
