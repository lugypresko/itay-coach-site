import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";

import { getPublicAuthorityAssetPathnames } from "../../src/lib/public-authority-routes";
import { reviewReadyPublicSurfaceBatchAssets } from "../../src/seed/review-ready-public-surface-batch";

describe("review-ready public surface batch", () => {
  it("contains the three create-next public surfaces", () => {
    expect(reviewReadyPublicSurfaceBatchAssets).toHaveLength(3);

    const slugs = reviewReadyPublicSurfaceBatchAssets.map((asset) => asset.payloadData.slug);

    expect(slugs).toContain("coach-for-engineering-managers-stuck-as-the-bottleneck");
    expect(slugs).toContain("invisible-executor");
    expect(slugs).toContain("engineering-manager-coach-for-strategic-leadership");
  });

  it("keeps all assets in review status", () => {
    expect(reviewReadyPublicSurfaceBatchAssets.every((asset) => asset.payloadData.status === "review")).toBe(true);
  });

  it("keeps the bottleneck cluster diagnosis-first and CTA-ready", () => {
    const asset = reviewReadyPublicSurfaceBatchAssets.find(
      (entry) => entry.payloadData.slug === "coach-for-engineering-managers-stuck-as-the-bottleneck",
    );

    expect(asset?.payloadData.content).toContain("## Diagnosis first");
    expect(asset?.payloadData.content).not.toMatch(/\bthe page (?:starts|explains)\b/i);
    expect(asset?.payloadData.content).toContain("[Tech Leadership Coaching](/pillars/tech-leadership-coaching)");
    expect(asset?.payloadData.content).toContain("[Player Trap framework](/frameworks/player-trap)");
    expect(asset?.payloadData.content).toContain("[Invisible Executor framework](/frameworks/invisible-executor)");
    expect(asset?.payloadData.content).toContain("## CTA");
    expect(asset?.payloadData.content).toContain("[Book a fit call](/book-a-fit-call)");
  });

  it("binds human approval only to the reviewed Draft 05 revision", () => {
    const approvedAsset = reviewReadyPublicSurfaceBatchAssets.find(
      (entry) => entry.payloadData.slug === "coach-for-engineering-managers-stuck-as-the-bottleneck",
    );
    const approval = approvedAsset?.humanApproval;
    const canonicalPath = "/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck";
    const revision = JSON.stringify({
      title: approvedAsset?.payloadData.title,
      canonicalPath,
      content: approvedAsset?.payloadData.content.replace(/\r\n/g, "\n").trim(),
    });
    const revisionHash = createHash("sha256").update(revision, "utf8").digest("hex");

    expect(approval).toMatchObject({
      draftId: "authority-draft-approved-insight-player-trap-05",
      maturity: "human_approved",
      approver: "human_user_via_codex_session",
      canonicalPath,
      contentRevisionHash: revisionHash,
      supportingApprovedInsightIds: [
        "approved-insight-player-trap-01",
        "approved-insight-player-trap-02",
        "approved-insight-player-trap-03",
        "approved-insight-player-trap-04",
        "approved-insight-player-trap-05",
        "approved-insight-player-trap-06",
        "approved-insight-player-trap-07",
      ],
      validationResult: {
        deterministicHardGatesPassed: true,
        semanticQualityPassed: true,
        failureCodes: [],
      },
      publicationScope: {
        approvedCanonicalPaths: [canonicalPath],
        excludedDraftIds: [
          "authority-draft-approved-insight-player-trap-06",
          "authority-draft-approved-insight-player-trap-07",
        ],
        deploymentAuthorized: false,
        publicationAuthorized: false,
      },
    });
    expect(approval?.approvalTimestamp).toBe("2026-07-12T22:50:58.0453369+03:00");
    expect(approval?.contentRevisionHash).toBe("f95ab45388c077de87efc8228e9788bf4fa9cca1a146a7ec02233e5c1b818211");
    expect(approvedAsset?.payloadData.status).toBe("review");
    expect(reviewReadyPublicSurfaceBatchAssets.filter((asset) => asset.humanApproval)).toHaveLength(1);
  });

  it("exposes the routes for sitemap and build discovery", () => {
    const pathnames = getPublicAuthorityAssetPathnames({ includeDrafts: true });

    expect(pathnames).toContain("/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck");
    expect(pathnames).toContain("/frameworks/invisible-executor");
    expect(pathnames).toContain("/clusters/engineering-manager-coach-for-strategic-leadership");
  });
});
