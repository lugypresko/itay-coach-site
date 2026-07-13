import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ReaderFacingArtifactPage } from "../../src/components/reader-facing-artifact-page";
import { buildReaderFacingArtifactPublicProjection } from "../../src/lib/reader-facing-artifact-public-projection";
import {
  draft05ArtifactProvenance,
  draft05DeterministicValidation,
  draft05InternalLanguageValidation,
  draft05ReaderFacingArtifact,
  draft05SemanticReview,
} from "../../src/seed/draft-05-reader-facing-page-artifact";

describe("Draft 05 replacement ReaderFacingPageArtifact", () => {
  it("is a new non-public artifact version bound to the existing canonical path and PageBrief", () => {
    expect(draft05ReaderFacingArtifact).toMatchObject({
      artifactId: "authority-draft-approved-insight-player-trap-05",
      artifactVersion: 2,
      lifecycle: "draft",
      canonicalPath: "/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck",
    });
    expect(draft05ArtifactProvenance).toMatchObject({
      artifactHash: draft05ReaderFacingArtifact.artifactHash,
      pageBriefId: "page-brief-approved-insight-player-trap-05",
    });
    expect(buildReaderFacingArtifactPublicProjection([{ artifact: draft05ReaderFacingArtifact } as never]).pages).toEqual([]);
  });

  it("contains only reader-facing copy and passes internal-language leak validation", () => {
    expect(draft05InternalLanguageValidation).toMatchObject({ passed: true, failureCodes: [] });
    expect(draft05DeterministicValidation).toMatchObject({ passed: true, failureCodes: [] });
    expect(draft05SemanticReview).toMatchObject({ passed: true, artifactHash: draft05ReaderFacingArtifact.artifactHash });
    const html = renderToStaticMarkup(React.createElement(ReaderFacingArtifactPage, { artifact: draft05ReaderFacingArtifact }));
    expect(html).toContain("Your team should not need you for every important decision");
    expect(html).toContain("Diagnose your bottleneck pattern");
    expect(html).not.toMatch(/review-ready|not reviewed|content status|docs\/|TASK_\d+/i);
  });

  it("does not contain approval or publication sidecars", () => {
    expect(draft05ReaderFacingArtifact).not.toHaveProperty("humanApproval");
    expect(draft05ReaderFacingArtifact).not.toHaveProperty("publicationRecord");
  });
});
