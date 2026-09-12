import { describe, expect, it, vi } from "vitest";
import { createContentRevisionHash } from "../../src/ai/governance/content-revision-hash";
import {
  createPublicationRevisionHash,
  serializeAuthorityPublicationRevision,
  serializeProblemPagePublicationRevision,
  serializeProblemPageRevisionContent,
  validatePublicationApproval,
} from "../../src/ai/governance/publication-approval";
import { buildPublicationDecision } from "../../src/ai/governance/publication-state";

const { findProblemPage } = vi.hoisted(() => ({
  findProblemPage: vi.fn(),
}));

vi.mock("../../src/lib/payload", () => ({
  getServerPayload: vi.fn(async () => ({ find: findProblemPage })),
}));

import { GET as getLlmsTxt } from "../../src/app/llms.txt/route";
import { getPublicAuthoritySitemapPathnames } from "../../src/lib/public-authority-routes";
import {
  buildProblemPagePublicationDecision,
  getPublishedProblemPagePathnames,
  getProblemPageCatalogEntry,
  getProblemPagePathnames,
  loadProblemPage,
} from "../../src/lib/problem-pages";
import {
  buildPublicContentPageModel,
  getPublicContentSectionSpec,
  normalizePublicContentRecord,
} from "../../src/lib/public-content";

describe("publication decision", () => {
  const draft05Title = "Coach for Engineering Managers Stuck as the Bottleneck";
  const draft05Content = "Reader-facing diagnosis and operating-model guidance.";
  const draft05CanonicalUrl = "https://itayfoyerstein.com/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck";
  const draft05Approval = {
    approvalTimestamp: "2026-07-12T22:50:58.0453369+03:00",
    approver: "human_user_via_codex_session",
    contentRevisionHash: createContentRevisionHash({
      title: draft05Title,
      canonicalPath: "/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck",
      content: draft05Content,
    }),
    supportingApprovedInsightIds: ["approved-insight-player-trap-05"],
    validationResult: {
      deterministicHardGatesPassed: true,
      semanticQualityPassed: true,
      failureCodes: [],
    },
    publicationScope: {
      approvedCanonicalPaths: ["/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck"],
      excludedDraftIds: [
        "authority-draft-approved-insight-player-trap-06",
        "authority-draft-approved-insight-player-trap-07",
      ],
      deploymentAuthorized: true,
      publicationAuthorized: true,
    },
  } as const;
  const draft05Record = {
    title: draft05Title,
    slug: "coach-for-engineering-managers-stuck-as-the-bottleneck",
    excerpt: "A diagnosis for engineering managers stuck as the bottleneck.",
    content: draft05Content,
    seoDescription: "Diagnose and change the Player Trap dependency pattern.",
    status: "published",
    humanApproval: draft05Approval,
    canonicalUrl: draft05CanonicalUrl,
    publishedAt: "2026-07-12T20:15:00.000Z",
  } as const;

  it("does not infer human approval from published lifecycle alone", () => {
    const decision = buildPublicationDecision(
      {
        slug: "unapproved-published-record",
        status: "published",
        title: "Unapproved published record",
        seoDescription: "A complete record without human approval.",
        painStatement: "The record lacks approval evidence.",
        canonicalUrl: "https://itayfoyerstein.com/clusters/unapproved-published-record",
      },
      { origin: "https://itayfoyerstein.com" },
    );

    expect(decision).toMatchObject({
      humanApproved: false,
      indexable: false,
      sitemapEligible: false,
      llmsTxtEligible: false,
    });
  });

  it("lets lifecycle exclusion dominate explicit discovery-surface true flags", () => {
    const decision = buildPublicationDecision(
      {
        slug: "review-record",
        status: "review",
        title: "Review record",
        seoDescription: "A complete record still in review.",
        painStatement: "The record has not been published.",
        humanApproved: true,
        canonicalUrl: "https://itayfoyerstein.com/clusters/review-record",
        indexable: true,
        sitemapEligible: true,
        llmsTxtEligible: true,
      },
      { origin: "https://itayfoyerstein.com", indexable: true, sitemapEligible: true, llmsTxtEligible: true },
    );

    expect(decision).toMatchObject({ indexable: false, sitemapEligible: false, llmsTxtEligible: false });
  });

  it("keeps the legacy Draft 05 approval fail-closed until a publication fingerprint is approved", () => {
    const page = buildPublicContentPageModel({
      spec: getPublicContentSectionSpec("clusters")!,
      record: draft05Record,
      origin: "https://itayfoyerstein.com",
    });

    expect(page.publicationDecision).toMatchObject({
      lifecycleStatus: "published",
      humanApproved: false,
      indexable: false,
      sitemapEligible: false,
      llmsTxtEligible: false,
      canonicalUrl: draft05Record.canonicalUrl,
    });
  });

  it("projects the same Draft 05 record in review as excluded from every discovery surface", () => {
    const page = buildPublicContentPageModel({
      spec: getPublicContentSectionSpec("clusters")!,
      record: { ...draft05Record, status: "review" },
      origin: "https://itayfoyerstein.com",
    });

    expect(page.publicationDecision).toMatchObject({
      lifecycleStatus: "review",
      publiclyAccessible: true,
      indexable: false,
      sitemapEligible: false,
      llmsTxtEligible: false,
    });
  });

  it("preserves the Task 070 governed source facts without deriving mutable surface flags", () => {
    const normalized = normalizePublicContentRecord({
      ...draft05Record,
      humanApproval: draft05Approval,
    });

    expect(normalized).toMatchObject({
      humanApproved: false,
      humanApproval: draft05Approval,
      canonicalUrl: draft05Record.canonicalUrl,
      publishedAt: draft05Record.publishedAt,
    });
  });

  it("preserves governance fields and makes review content non-indexable", () => {
    const record = {
      title: "Player Trap diagnosis",
      slug: "player-trap-diagnosis",
      excerpt: "A diagnosis for engineering managers.",
      content: "Reader-facing diagnosis.",
      seoDescription: "A diagnosis for engineering managers.",
      status: "review",
      humanApproved: false,
      canonicalUrl: "https://itayfoyerstein.com/clusters/player-trap-diagnosis",
      indexable: false,
      sitemapEligible: false,
      llmsTxtEligible: false,
      schemaEligible: true,
    } as const;

    expect(normalizePublicContentRecord(record)).toMatchObject({
      humanApproved: false,
      canonicalUrl: record.canonicalUrl,
      indexable: false,
      sitemapEligible: false,
      llmsTxtEligible: false,
      schemaEligible: true,
    });

    const page = buildPublicContentPageModel({
      spec: getPublicContentSectionSpec("clusters")!,
      record,
      origin: "https://itayfoyerstein.com",
    });

    expect(page.publicationDecision).toMatchObject({
      lifecycleStatus: "review",
      indexable: false,
      sitemapEligible: false,
      llmsTxtEligible: false,
      canonicalUrl: record.canonicalUrl,
    });
  });

  it("preserves explicit false and null governance values without truthy coercion", () => {
    const normalized = normalizePublicContentRecord({
      title: "Governed draft",
      slug: "governed-draft",
      excerpt: "A governed draft.",
      content: "Reader-facing content.",
      seoDescription: "A governed draft.",
      status: "draft",
      publishedAt: "2026-07-12T20:15:00.000Z",
      humanApproved: false,
      canonicalUrl: null,
      indexable: false,
      sitemapEligible: false,
      llmsTxtEligible: false,
      schemaEligible: false,
    });

    expect(normalized).toMatchObject({
      publishedAt: "2026-07-12T20:15:00.000Z",
      humanApproved: false,
      canonicalUrl: null,
      indexable: false,
      sitemapEligible: false,
      llmsTxtEligible: false,
      schemaEligible: false,
    });
  });

  it("does not let raw humanApproved true bypass a missing approval envelope", () => {
    const normalized = normalizePublicContentRecord({
      ...draft05Record,
      humanApproved: true,
      humanApproval: undefined,
    });

    expect(normalized.humanApproved).toBe(false);
  });

  it("normalizes Payload approval array rows and preserves supporting Approved Insight IDs", () => {
    const normalized = normalizePublicContentRecord({
      ...draft05Record,
      humanApproval: {
        approvalTimestamp: "2026-07-12T22:50:58.0453369+03:00",
        approver: "human_user_via_codex_session",
        contentRevisionHash: createContentRevisionHash({
          title: draft05Record.title,
          canonicalPath: "/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck",
          content: draft05Record.content,
        }),
        supportingApprovedInsightIds: [
          { value: "approved-insight-player-trap-05" },
          { value: "approved-insight-player-trap-06" },
        ],
        validationResult: {
          deterministicHardGatesPassed: true,
          semanticQualityPassed: true,
          failureCodes: [],
        },
        publicationScope: {
          approvedCanonicalPaths: [{ value: draft05Record.canonicalUrl.replace("https://itayfoyerstein.com", "") }],
          excludedDraftIds: [{ value: "authority-draft-approved-insight-player-trap-06" }],
          deploymentAuthorized: true,
          publicationAuthorized: true,
        },
      },
    });

    expect(normalized.humanApproval).toMatchObject({
      supportingApprovedInsightIds: ["approved-insight-player-trap-05", "approved-insight-player-trap-06"],
      publicationScope: {
        approvedCanonicalPaths: ["/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck"],
        excludedDraftIds: ["authority-draft-approved-insight-player-trap-06"],
      },
    });
    expect(normalized.humanApproved).toBe(false);
  });

  it("validates approval against the page-model origin instead of a hard-coded production origin", () => {
    const canonicalUrl = "https://preview.example.test/clusters/preview-record";
    const content = "Preview reader-facing content.";
    const previewRecord = {
      title: "Preview record",
      slug: "preview-record",
      content,
      excerpt: "Preview diagnosis.",
      seoDescription: "Preview diagnosis.",
      status: "published",
      canonicalUrl,
    } as const;
    const page = buildPublicContentPageModel({
      spec: getPublicContentSectionSpec("clusters")!,
      origin: "https://preview.example.test",
      record: {
        ...previewRecord,
        humanApproval: {
          approvalTimestamp: "2026-07-13T10:00:00.000+03:00",
          approver: "human-reviewer",
          contentRevisionHash: createContentRevisionHash({
            title: "Preview record",
            canonicalPath: "/clusters/preview-record",
            content,
          }),
          publicationRevisionHash: createPublicationRevisionHash(
            serializeAuthorityPublicationRevision(previewRecord),
          ),
          supportingApprovedInsightIds: ["approved-insight-preview"],
          validationResult: {
            deterministicHardGatesPassed: true,
            semanticQualityPassed: true,
            failureCodes: [],
          },
          publicationScope: {
            approvedCanonicalPaths: ["/clusters/preview-record"],
            excludedDraftIds: [],
            deploymentAuthorized: true,
            publicationAuthorized: true,
          },
        },
      },
    });

    expect(page.publicationDecision).toMatchObject({ humanApproved: true, indexable: true, canonicalUrl });
  });
  it("marks a published problem page as indexable and eligible for sitemap and llms.txt", () => {
    const page = getProblemPageCatalogEntry("cto-becomes-the-bottleneck");

    expect(page).toBeTruthy();

    const decision = buildProblemPagePublicationDecision(page!, {
      origin: "https://itayfoyerstein.com",
    });

    expect(decision).toMatchObject({
      lifecycleStatus: "published",
      humanApproved: true,
      publiclyAccessible: true,
      indexable: true,
      sitemapEligible: true,
      llmsTxtEligible: true,
      canonicalUrl: "https://itayfoyerstein.com/problems/cto-becomes-the-bottleneck",
      schemaEligible: true,
      reasonCodes: [],
    });
  });

  it("keeps draft problem pages out of sitemap and llms.txt", () => {
    const page = getProblemPageCatalogEntry("good-managers-burning-out-quietly");

    expect(page).toBeTruthy();

    const decision = buildProblemPagePublicationDecision(page!, {
      origin: "https://itayfoyerstein.com",
    });

    expect(decision.lifecycleStatus).toBe("draft");
    expect(decision.indexable).toBe(false);
    expect(decision.sitemapEligible).toBe(false);
    expect(decision.llmsTxtEligible).toBe(false);
    expect(decision.reasonCodes).toEqual(
      expect.arrayContaining([
        "draft_not_indexable",
        "draft_not_in_sitemap",
        "draft_not_in_llms_txt",
      ]),
    );
  });

  it("surfaces explicit integrity violations for contradictory publication state", () => {
    const page = getProblemPageCatalogEntry("vp-rnd-losing-execution-control");

    expect(page).toBeTruthy();

    const decision = buildProblemPagePublicationDecision(
      {
        ...page!,
        humanApproved: false,
        canonicalUrl: null,
      },
      {
        origin: "https://itayfoyerstein.com",
        treatAsHumanApproved: false,
        canonicalUrl: null,
      },
    );

    expect(decision.lifecycleStatus).toBe("published");
    expect(decision.indexable).toBe(false);
    expect(decision.reasonCodes).toEqual(
      expect.arrayContaining([
        "published_not_human_approved",
        "published_missing_canonical_url",
        "published_noindex_conflict",
        "publication_surface_conflict",
      ]),
    );
  });

  it("keeps the sitemap aligned to the shared publication helper", () => {
    expect(getPublicAuthoritySitemapPathnames()).toEqual(
      expect.arrayContaining([
        "/problems/cto-becomes-the-bottleneck",
        "/problems/vp-rnd-losing-execution-control",
      ]),
    );

    expect(getPublicAuthoritySitemapPathnames()).not.toContain("/problems/good-managers-burning-out-quietly");
    expect(getPublishedProblemPagePathnames()).toEqual([
      "/problems/cto-becomes-the-bottleneck",
      "/problems/vp-rnd-losing-execution-control",
      "/problems/engineering-managers-stuck-in-firefighting",
    ]);
    expect(getProblemPagePathnames()).toHaveLength(10);
  });

  it("keeps llms.txt aligned to the shared publication helper", async () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("SITE_URL", "https://itayfoyerstein.com");

    const response = await getLlmsTxt();
    const body = await response.text();

    expect(body).toContain("https://itayfoyerstein.com/problems/cto-becomes-the-bottleneck");
    expect(body).toContain("https://itayfoyerstein.com/problems/vp-rnd-losing-execution-control");
    expect(body).not.toContain("https://itayfoyerstein.com/problems/good-managers-burning-out-quietly");
  });

  describe("Problem Page lifecycle normalization", () => {
    const problemPageRecord = {
      title: "Governed problem page",
      slug: "governed-problem-page",
      painStatement: "A leader remains the default route for execution.",
      dailyScenes: [{ value: "Decisions wait for the leader." }],
      whatTheyTried: [{ value: "Working longer hours." }],
      whyItFailed: "The operating model still centralizes decisions.",
      diagnosis: "Decision rights and ownership remain implicit.",
      evidenceBlock: {
        claim: "Repeated dependency is an operating-model signal.",
        source: "approved-insight-player-trap-05",
        relatedEntity: "The Push",
        confidence: "high",
        approvalStatus: "approved",
      },
      primaryCTA: {
        label: "Book a fit call",
        href: "/book-a-fit-call",
        rationale: "For leaders ready to change the dependency pattern.",
      },
      relatedFrameworks: [],
      relatedClusters: [],
      seoTitle: "Governed problem page",
      seoDescription: "Diagnose a centralized engineering leadership operating model.",
    };

    it.each(["draft", "review", "in_review", "approved", "published", "archived"])(
      "preserves the %s lifecycle instead of silently collapsing it",
      async (status) => {
        findProblemPage.mockResolvedValueOnce({ docs: [{ ...problemPageRecord, status }] });

        const page = await loadProblemPage(problemPageRecord.slug, "https://itayfoyerstein.com");

        expect(page?.record.status).toBe(status);
        expect(page?.publicationDecision.lifecycleStatus).toBe(
          status === "in_review" || status === "approved" ? "review" : status,
        );
      },
    );

    it("preserves explicit false and null Problem Page governance facts", async () => {
      findProblemPage.mockResolvedValueOnce({
        docs: [
          {
            ...problemPageRecord,
            status: "published",
            humanApproved: false,
            canonicalUrl: null,
            indexable: false,
            sitemapEligible: false,
            llmsTxtEligible: false,
            schemaEligible: false,
          },
        ],
      });

      const page = await loadProblemPage(problemPageRecord.slug, "https://itayfoyerstein.com");

      expect(page?.record).toMatchObject({
        humanApproved: false,
        canonicalUrl: null,
        indexable: false,
        sitemapEligible: false,
        llmsTxtEligible: false,
        schemaEligible: false,
      });
      expect(page?.publicationDecision).toMatchObject({
        canonicalUrl: null,
        indexable: false,
        sitemapEligible: false,
        llmsTxtEligible: false,
        schemaEligible: false,
      });
    });

    it("rejects a published Problem Page when raw humanApproved true has no approval envelope", async () => {
      findProblemPage.mockResolvedValueOnce({
        docs: [{ ...problemPageRecord, status: "published", humanApproved: true, canonicalUrl: "https://itayfoyerstein.com/problems/governed-problem-page" }],
      });

      const page = await loadProblemPage(problemPageRecord.slug, "https://itayfoyerstein.com");

      expect(page?.record.humanApproved).toBe(false);
      expect(page?.publicationDecision).toMatchObject({
        humanApproved: false,
        indexable: false,
        sitemapEligible: false,
        llmsTxtEligible: false,
      });
    });

    it("accepts a published Problem Page only when approval scope and revision hash match", async () => {
      const canonicalUrl = "https://itayfoyerstein.com/problems/governed-problem-page";
      const governedRecord = { ...problemPageRecord, status: "published", canonicalUrl };
      const humanApproval = {
        approvalTimestamp: "2026-07-13T10:00:00.000+03:00",
        approver: "human-reviewer",
        contentRevisionHash: createContentRevisionHash({
          title: governedRecord.title,
          canonicalPath: "/problems/governed-problem-page",
          content: serializeProblemPageRevisionContent(governedRecord),
        }),
        publicationRevisionHash: createPublicationRevisionHash(
          serializeProblemPagePublicationRevision(governedRecord),
        ),
        supportingApprovedInsightIds: [{ value: "approved-insight-player-trap-05" }],
        validationResult: {
          deterministicHardGatesPassed: true,
          semanticQualityPassed: true,
          failureCodes: [],
        },
        publicationScope: {
          approvedCanonicalPaths: [{ value: "/problems/governed-problem-page" }],
          excludedDraftIds: [],
          deploymentAuthorized: true,
          publicationAuthorized: true,
        },
      };
      findProblemPage.mockResolvedValueOnce({ docs: [{ ...governedRecord, humanApproval }] });

      const page = await loadProblemPage(problemPageRecord.slug, "https://itayfoyerstein.com");

      expect(serializeProblemPageRevisionContent(page!.record as unknown as Record<string, unknown>)).toBe(
        serializeProblemPageRevisionContent(governedRecord),
      );
      expect(serializeProblemPagePublicationRevision(page!.record as unknown as Record<string, unknown>)).toBe(
        serializeProblemPagePublicationRevision(governedRecord),
      );
      expect(
        validatePublicationApproval({
          approval: page!.record.humanApproval,
          title: page!.record.title,
          slug: page!.record.slug,
          content: serializeProblemPageRevisionContent(page!.record as unknown as Record<string, unknown>),
          canonicalUrl: page!.record.canonicalUrl,
          canonicalOrigin: "https://itayfoyerstein.com",
          publicationRevision: serializeProblemPagePublicationRevision(page!.record as unknown as Record<string, unknown>),
        }),
      ).toEqual({ valid: true, failureCodes: [] });
      expect(page?.record.humanApproved).toBe(true);
      expect(page?.publicationDecision).toMatchObject({
        humanApproved: true,
        indexable: true,
        sitemapEligible: true,
        llmsTxtEligible: true,
        canonicalUrl,
      });
    });

    it("rejects a Problem Page approval after reader-facing content changes", async () => {
      const canonicalUrl = "https://itayfoyerstein.com/problems/governed-problem-page";
      const approvedRecord = { ...problemPageRecord, status: "published", canonicalUrl };
      const humanApproval = {
        approvalTimestamp: "2026-07-13T10:00:00.000+03:00",
        approver: "human-reviewer",
        contentRevisionHash: createContentRevisionHash({
          title: approvedRecord.title,
          canonicalPath: "/problems/governed-problem-page",
          content: serializeProblemPageRevisionContent(approvedRecord),
        }),
        supportingApprovedInsightIds: ["approved-insight-player-trap-05"],
        validationResult: {
          deterministicHardGatesPassed: true,
          semanticQualityPassed: true,
          failureCodes: [],
        },
        publicationScope: {
          approvedCanonicalPaths: ["/problems/governed-problem-page"],
          excludedDraftIds: [],
          deploymentAuthorized: true,
          publicationAuthorized: true,
        },
      };
      findProblemPage.mockResolvedValueOnce({
        docs: [{ ...approvedRecord, diagnosis: "Unapproved changed diagnosis.", humanApproval }],
      });

      const page = await loadProblemPage(problemPageRecord.slug, "https://itayfoyerstein.com");

      expect(page?.record.humanApproved).toBe(false);
      expect(page?.publicationDecision.indexable).toBe(false);
    });
  });
});
