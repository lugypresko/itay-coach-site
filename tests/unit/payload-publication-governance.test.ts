import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createContentRevisionHash } from "../../src/ai/governance/content-revision-hash";
import {
  createPublicationRevisionHash,
  serializeAuthorityPublicationRevision,
  serializeProblemPagePublicationRevision,
  serializeProblemPageRevisionContent,
  validatePublicationApproval,
} from "../../src/ai/governance/publication-approval";
import { ClusterPages } from "../../src/payload/collections/ClusterPages";
import { ProblemPages } from "../../src/payload/collections/ProblemPages";
import { normalizePublicContentRecord } from "../../src/lib/public-content";

const canonicalUrl = "https://itayfoyerstein.com/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck";
const canonicalPath = "/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck";
const approvedTitle = "Coach for Engineering Managers Stuck as the Bottleneck";
const approvedContent = "Complete approved reader-facing content.";
const approvedGenericRecord = {
  slug: "coach-for-engineering-managers-stuck-as-the-bottleneck",
  title: approvedTitle,
  excerpt: "A direct diagnosis for managers who became the bottleneck.",
  content: approvedContent,
  aiSummary: "Diagnoses the Player Trap dependency pattern.",
  citationSnippet: "The Player Trap centralizes execution around the manager.",
  evidenceUrls: [{ value: "https://itayfoyerstein.com/evidence/player-trap" }],
  targetQuestions: [{ value: "How do I stop being the bottleneck?" }],
  targetRecommendationQueries: [{ value: "Coach for managers stuck in execution mode" }],
  entityTags: [{ tag: "itay_foyerstein" }],
  seoTitle: "Coach for Engineering Managers Stuck as the Bottleneck",
  seoDescription: "Diagnose and change the dependency pattern around an Engineering Manager.",
  schemaType: "Article",
  faq: [{ question: "What is the Player Trap?", answer: "A dependency pattern.", entityTags: [], targetRecommendationQueries: [] }],
  internalLinks: [
    {
      targetSlug: "player-trap",
      anchorText: "Player Trap framework",
      reason: "Defines the pattern.",
      sourceEntityTags: [],
      targetEntityTags: [],
    },
  ],
  author: "Itay Foyerstein",
  canonicalUrl,
};
const problemCanonicalUrl = "https://itayfoyerstein.com/problems/cto-becomes-the-bottleneck";
const problemCanonicalPath = "/problems/cto-becomes-the-bottleneck";
const approvedProblemPage = {
  slug: "cto-becomes-the-bottleneck",
  title: "CTO Becomes the Bottleneck",
  painStatement: "Every decision routes back to the CTO.",
  dailyScenes: [{ value: "The team waits for technical approval." }],
  whatTheyTried: [{ value: "Working longer hours." }],
  whyItFailed: "The operating model still centralizes judgment.",
  diagnosis: "Decision rights and ownership remain implicit.",
  evidenceBlock: {
    claim: "Centralized judgment creates dependency.",
    source: "approved-insight-cto-bottleneck-01",
    relatedEntity: "Itay Foyerstein",
    confidence: "high",
    approvalStatus: "approved",
  },
  primaryCTA: { label: "Book a fit call", href: "/book-a-fit-call", rationale: "Diagnose the operating model." },
  relatedFrameworks: [],
  relatedClusters: [],
};
const originalSiteUrl = process.env.SITE_URL;

beforeAll(() => {
  process.env.SITE_URL = "https://itayfoyerstein.com";
});

afterAll(() => {
  if (originalSiteUrl === undefined) delete process.env.SITE_URL;
  else process.env.SITE_URL = originalSiteUrl;
});

function fieldNames(collection: typeof ClusterPages): string[] {
  return collection.fields.map((field) => ("name" in field ? field.name : ""));
}

function validApproval(
  overrides: {
    title?: string;
    content?: string;
    canonicalPath?: string;
    publicationRecord?: Record<string, unknown>;
    problemPage?: boolean;
  } = {},
) {
  const title = overrides.title ?? approvedTitle;
  const content = overrides.content ?? approvedContent;
  const approvedPath = overrides.canonicalPath ?? canonicalPath;
  const publicationRecord = overrides.publicationRecord ?? {
    slug: approvedPath.split("/").filter(Boolean).at(-1),
    title,
    content,
    canonicalUrl: `https://itayfoyerstein.com${approvedPath}`,
  };
  const publicationRevision = overrides.problemPage
    ? serializeProblemPagePublicationRevision(publicationRecord)
    : serializeAuthorityPublicationRevision(publicationRecord);

  return {
    approvalTimestamp: "2026-07-12T22:50:58.045Z",
    approver: "human_user_via_codex_session",
    contentRevisionHash: createContentRevisionHash({ title, content, canonicalPath: approvedPath }),
    publicationRevisionHash: createPublicationRevisionHash(publicationRevision),
    supportingApprovedInsightIds: [{ value: "approved-insight-player-trap-05" }],
    validationResult: {
      deterministicHardGatesPassed: true,
      semanticQualityPassed: true,
      failureCodes: [],
    },
    publicationScope: {
      approvedCanonicalPaths: [{ value: approvedPath }],
      excludedDraftIds: [],
      deploymentAuthorized: true,
      publicationAuthorized: true,
    },
  };
}

async function runBeforeChange(
  collection: typeof ClusterPages,
  data: Record<string, unknown>,
  role: string | null = "human",
  originalDoc: Record<string, unknown> = { status: "review", slug: approvedGenericRecord.slug },
) {
  const hook = collection.hooks?.beforeChange?.[0];
  if (!hook) throw new Error(`Missing beforeChange hook for ${collection.slug}`);

  return hook({
    data,
    originalDoc,
    req: { user: role === null ? null : { role } },
  } as never);
}

async function runWriteAccess(collection: typeof ClusterPages, operation: "create" | "update", role?: string) {
  const access = collection.access?.[operation];
  if (typeof access !== "function") throw new Error(`Missing ${operation} access for ${collection.slug}`);
  return access({ req: { user: role === undefined ? null : { role } } } as never);
}

describe("Payload publication governance source facts", () => {
  it.each([ClusterPages, ProblemPages])("denies anonymous writes to $slug while keeping public reads", async (collection) => {
    await expect(runWriteAccess(collection, "create")).resolves.toBe(false);
    await expect(runWriteAccess(collection, "update")).resolves.toBe(false);
    expect(collection.access?.read).toBeTypeOf("function");
    await expect(
      Promise.resolve((collection.access?.read as (args: never) => unknown)({ req: { user: null } } as never)),
    ).resolves.toBe(true);
  });

  it.each([ClusterPages, ProblemPages])("allows authenticated agents to write non-public $slug drafts", async (collection) => {
    await expect(runWriteAccess(collection, "create", "agent")).resolves.toBe(true);
    await expect(runWriteAccess(collection, "update", "agent")).resolves.toBe(true);
    await expect(runBeforeChange(collection, { status: "in_review" }, "agent", { status: "draft" })).resolves.toMatchObject({
      status: "in_review",
    });
  });

  it.each([ClusterPages, ProblemPages])("blocks anonymous and agent approval attachment on a $slug draft", async (collection) => {
    for (const role of [null, "agent"]) {
      await expect(
        runBeforeChange(collection, { status: "review", humanApproval: validApproval() }, role, { status: "review" }),
      ).rejects.toThrow("An authenticated human role is required for approval-governed changes.");
    }
  });

  it.each([ClusterPages, ProblemPages])("blocks missing, unknown, and agent roles from approving $slug", async (collection) => {
    for (const role of [null, "unknown", "agent"]) {
      await expect(runBeforeChange(collection, { status: "approved" }, role, { status: "review" })).rejects.toThrow(
        "An authenticated human role is required for approval-governed changes.",
      );
    }
  });

  it.each([ClusterPages, ProblemPages])("blocks anonymous publication of $slug even with a forged approval", async (collection) => {
    await expect(
      runBeforeChange(collection, { status: "published", humanApproval: validApproval() }, null, { status: "review" }),
    ).rejects.toThrow("An authenticated human role is required for approval-governed changes.");
  });

  it.each(["admin", "editor", "human"])("allows authenticated %s approval-governed draft changes", async (role) => {
    await expect(
      runBeforeChange(ClusterPages, { status: "approved", humanApproval: validApproval() }, role, { status: "review" }),
    ).resolves.toMatchObject({ status: "approved" });
  });

  it.each([ClusterPages, ProblemPages])(
    "blocks non-human status-only transitions out of published for $slug",
    async (collection) => {
      for (const status of ["review", "draft", "archived"]) {
        for (const role of [null, "unknown", "agent"]) {
          await expect(
            runBeforeChange(collection, { status }, role, { status: "published" }),
          ).rejects.toThrow("An authenticated human role is required for approval-governed changes.");
        }
      }
    },
  );

  it.each([ClusterPages, ProblemPages])("allows authenticated humans to demote $slug from published", async (collection) => {
    for (const status of ["review", "draft", "archived"]) {
      await expect(runBeforeChange(collection, { status }, "human", { status: "published" })).resolves.toMatchObject({
        status,
      });
    }
  });

  it.each([ClusterPages, ProblemPages])("adds canonical and human-approval source fields to $slug", (collection) => {
    expect(fieldNames(collection)).toEqual(expect.arrayContaining(["canonicalUrl", "humanApproval"]));
  });

  it("adds publishedAt to Problem Pages", () => {
    expect(fieldNames(ProblemPages)).toContain("publishedAt");
  });

  it("stores optional approval list facts as JSON without required child columns", () => {
    const approval = ClusterPages.fields.find((field) => "name" in field && field.name === "humanApproval");
    expect(approval).toMatchObject({ type: "group" });
    if (!approval || !("fields" in approval)) throw new Error("Missing humanApproval group");

    expect(approval.fields.every((field) => !("required" in field) || field.required !== true)).toBe(true);
    expect(approval.fields.find((field) => "name" in field && field.name === "supportingApprovedInsightIds")).toMatchObject({
      type: "json",
    });
  });

  it.each([ClusterPages, ProblemPages])("rejects a $slug transition to published without human approval", async (collection) => {
    await expect(
      runBeforeChange(collection, {
        status: "published",
        canonicalUrl,
        title: approvedTitle,
        content: approvedContent,
      }),
    ).rejects.toThrow("A valid human approval is required before publication.");
  });

  it("accepts an authority-content transition with valid approval source facts", async () => {
    const collection = ClusterPages;
    const result = await runBeforeChange(collection, {
      status: "published",
      slug: approvedGenericRecord.slug,
      canonicalUrl,
      title: approvedTitle,
      content: approvedContent,
      humanApproval: validApproval(),
    });

    expect(result).toMatchObject({ status: "published", humanApproval: validApproval() });
  });

  it("keeps an approval accepted on write valid after read normalization trims title and content", async () => {
    const title = `  ${approvedTitle}  `;
    const content = `  Complete approved reader-facing content.\r\n  `;
    const approval = validApproval({ title, content });
    const written = await runBeforeChange(ClusterPages, {
      status: "published",
      slug: approvedGenericRecord.slug,
      canonicalUrl,
      title,
      content,
      humanApproval: approval,
    });

    const normalized = normalizePublicContentRecord(written, "https://itayfoyerstein.com");

    expect(normalized).toMatchObject({
      title: approvedTitle,
      content: approvedContent,
      humanApproved: true,
    });
  });

  it("accepts a Problem Page transition only when approval binds all reader-facing fields", async () => {
    const content = serializeProblemPageRevisionContent(approvedProblemPage);
    const approval = validApproval({
      title: approvedProblemPage.title,
      content,
      canonicalPath: problemCanonicalPath,
      publicationRecord: { ...approvedProblemPage, canonicalUrl: problemCanonicalUrl },
      problemPage: true,
    });
    const result = await runBeforeChange(ProblemPages, {
      ...approvedProblemPage,
      status: "published",
      canonicalUrl: problemCanonicalUrl,
      humanApproval: approval,
    });

    expect(result).toMatchObject({ status: "published", humanApproval: approval });
  });

  it("excludes Payload storage IDs from the Problem Page reader-facing revision", () => {
    const withStorageIds = {
      ...approvedProblemPage,
      dailyScenes: [{ id: "payload-row-1", value: "The team waits for technical approval." }],
      relatedFrameworks: [
        { id: "payload-row-2", label: "Player Trap", href: "/frameworks/player-trap", reason: "Defines the pattern." },
      ],
    };
    const withoutStorageIds = {
      ...approvedProblemPage,
      relatedFrameworks: [
        { label: "Player Trap", href: "/frameworks/player-trap", reason: "Defines the pattern." },
      ],
    };

    expect(serializeProblemPageRevisionContent(withStorageIds)).toBe(
      serializeProblemPageRevisionContent(withoutStorageIds),
    );
  });

  it("normalizes CRLF recursively across Problem Page reader-facing fields", () => {
    const withCrLf = {
      ...approvedProblemPage,
      painStatement: "Every decision\r\nroutes back.",
      dailyScenes: [{ value: "The team waits\r\nfor approval." }],
      evidenceBlock: { ...approvedProblemPage.evidenceBlock, claim: "Centralized\r\njudgment creates dependency." },
      primaryCTA: { ...approvedProblemPage.primaryCTA, rationale: "Diagnose\r\nthe operating model." },
    };
    const withLf = {
      ...approvedProblemPage,
      painStatement: "Every decision\nroutes back.",
      dailyScenes: [{ value: "The team waits\nfor approval." }],
      evidenceBlock: { ...approvedProblemPage.evidenceBlock, claim: "Centralized\njudgment creates dependency." },
      primaryCTA: { ...approvedProblemPage.primaryCTA, rationale: "Diagnose\nthe operating model." },
    };

    expect(serializeProblemPageRevisionContent(withCrLf)).toBe(serializeProblemPageRevisionContent(withLf));
  });

  it("normalizes generic string arrays, Payload row IDs, and CRLF in the publication fingerprint", () => {
    const payloadShape = {
      ...approvedGenericRecord,
      excerpt: "A direct\r\ndiagnosis.",
      evidenceUrls: [{ id: "row-1", value: "https://itayfoyerstein.com/evidence/player-trap" }],
      entityTags: [{ id: "row-2", tag: "itay_foyerstein" }],
    };
    const plainShape = {
      ...approvedGenericRecord,
      excerpt: "A direct\ndiagnosis.",
      evidenceUrls: ["https://itayfoyerstein.com/evidence/player-trap"],
      entityTags: ["itay_foyerstein"],
    };

    expect(serializeAuthorityPublicationRevision(payloadShape)).toBe(
      serializeAuthorityPublicationRevision(plainShape),
    );
  });

  it("rejects a changed Problem Page diagnosis with the previous approval hash", async () => {
    const content = serializeProblemPageRevisionContent(approvedProblemPage);
    await expect(
      runBeforeChange(ProblemPages, {
        ...approvedProblemPage,
        diagnosis: "Changed after approval.",
        status: "published",
        canonicalUrl: problemCanonicalUrl,
        humanApproval: validApproval({
          title: approvedProblemPage.title,
          content,
          canonicalPath: problemCanonicalPath,
          publicationRecord: { ...approvedProblemPage, canonicalUrl: problemCanonicalUrl },
          problemPage: true,
        }),
      }),
    ).rejects.toThrow("A valid human approval is required before publication.");
  });

  it.each([ClusterPages, ProblemPages])("preserves the agent publication prohibition for $slug", async (collection) => {
    await expect(
      runBeforeChange(
        collection,
        {
          status: "published",
          canonicalUrl,
          title: approvedTitle,
          content: approvedContent,
          humanApproval: validApproval(),
        },
        "agent",
      ),
    ).rejects.toThrow("Agent users cannot publish content.");
  });

  it("rejects an approval whose validation did not pass", async () => {
    await expect(
      runBeforeChange(ClusterPages, {
        status: "published",
        canonicalUrl,
        title: approvedTitle,
        content: approvedContent,
        humanApproval: {
          ...validApproval(),
          validationResult: {
            deterministicHardGatesPassed: true,
            semanticQualityPassed: false,
            failureCodes: [{ value: "semantic_quality_failed" }],
          },
        },
      }),
    ).rejects.toThrow("A valid human approval is required before publication.");
  });

  it("rejects a revision hash that does not bind the current content", async () => {
    await expect(
      runBeforeChange(ClusterPages, {
        status: "published",
        canonicalUrl,
        title: approvedTitle,
        content: "Content changed after approval.",
        humanApproval: validApproval(),
      }),
    ).rejects.toThrow("A valid human approval is required before publication.");
  });

  it("rejects a canonical URL on the wrong origin even when its path is approved", async () => {
    await expect(
      runBeforeChange(ClusterPages, {
        status: "published",
        canonicalUrl: `https://example.com${canonicalPath}`,
        title: approvedTitle,
        content: approvedContent,
        humanApproval: validApproval(),
      }),
    ).rejects.toThrow("A valid human approval is required before publication.");
  });

  it.each(["deploymentAuthorized", "publicationAuthorized"] as const)(
    "rejects publication when %s is false",
    async (authorization) => {
      const approval = validApproval();
      approval.publicationScope[authorization] = false;

      await expect(
        runBeforeChange(ClusterPages, {
          status: "published",
          canonicalUrl,
          title: approvedTitle,
          content: approvedContent,
          humanApproval: approval,
        }),
      ).rejects.toThrow("A valid human approval is required before publication.");
    },
  );

  it.each([
    ["title", "Changed title"],
    ["content", "Changed after publication."],
    ["canonicalUrl", "https://itayfoyerstein.com/clusters/changed-canonical"],
  ])("requires a new matching approval when published %s changes", async (field, value) => {
      await expect(
        runBeforeChange(
          ClusterPages,
          { status: "published", [field]: value },
          "human",
          {
            status: "published",
            canonicalUrl,
            title: approvedTitle,
            content: approvedContent,
            humanApproval: validApproval(),
          },
        ),
      ).rejects.toThrow("A valid human approval is required before changing approved published content.");
    },
  );

  it.each(
    Object.entries({
      slug: "changed-slug",
      title: "Changed title",
      excerpt: "Changed excerpt",
      content: "Changed content",
      aiSummary: "Changed AI summary",
      citationSnippet: "Changed citation",
      evidenceUrls: [{ value: "https://itayfoyerstein.com/evidence/changed" }],
      targetQuestions: [{ value: "Changed question?" }],
      targetRecommendationQueries: [{ value: "Changed recommendation query" }],
      entityTags: [{ tag: "the_push" }],
      seoTitle: "Changed SEO title",
      seoDescription: "Changed SEO description",
      schemaType: "HowTo",
      faq: [],
      internalLinks: [],
      author: "Changed author",
      canonicalUrl: "https://itayfoyerstein.com/clusters/changed-canonical",
    }),
  )("invalidates the publication approval when bound field %s changes", async (field, value) => {
    const approval = validApproval({ publicationRecord: approvedGenericRecord });
    await expect(
      runBeforeChange(
        ClusterPages,
        { status: "published", [field]: value },
        "human",
        { ...approvedGenericRecord, status: "published", humanApproval: approval },
      ),
    ).rejects.toThrow("A valid human approval is required before changing approved published content.");
  });

  it("keeps the existing Task 069 approval non-publishable until a publication fingerprint is approved", async () => {
    const approval = validApproval({ publicationRecord: approvedGenericRecord });
    delete (approval as { publicationRevisionHash?: string }).publicationRevisionHash;

    expect(
      validatePublicationApproval({
        approval,
        title: approvedGenericRecord.title,
        slug: approvedGenericRecord.slug,
        content: approvedGenericRecord.content,
        canonicalUrl: approvedGenericRecord.canonicalUrl,
        canonicalOrigin: "https://itayfoyerstein.com",
        publicationRevision: serializeAuthorityPublicationRevision(approvedGenericRecord),
      }),
    ).toEqual({ valid: false, failureCodes: ["publication_revision_hash_mismatch"] });

    await expect(
      runBeforeChange(
        ClusterPages,
        { ...approvedGenericRecord, status: "published", humanApproval: approval },
        "human",
        { status: "review" },
      ),
    ).rejects.toThrow("A valid human approval is required before publication.");
  });

  it("rejects a canonical whose final path segment does not match the slug", async () => {
    const record = { ...approvedGenericRecord, slug: "different-slug" };
    const approval = validApproval({ publicationRecord: record });
    await expect(
      runBeforeChange(
        ClusterPages,
        { ...record, status: "published", humanApproval: approval },
        "human",
        { status: "review" },
      ),
    ).rejects.toThrow("A valid human approval is required before publication.");
  });

  it("accepts approval-bound published edits when a new approval matches the revision", async () => {
    const content = "Changed after publication with explicit approval.";
    const approval = validApproval({ content });
    const result = await runBeforeChange(
      ClusterPages,
      { status: "published", content, humanApproval: approval },
      "human",
      {
        status: "published",
        slug: approvedGenericRecord.slug,
        canonicalUrl,
        title: approvedTitle,
        content: approvedContent,
        humanApproval: validApproval(),
      },
    );

    expect(result).toMatchObject({ content, humanApproval: approval });
  });

  it("allows non-approval-bound metadata edits on already-published content", async () => {
    const result = await runBeforeChange(
      ClusterPages,
      { status: "published", lastReviewedAt: "2026-07-13T07:00:00.000Z" },
      "human",
      {
        status: "published",
        canonicalUrl,
        title: approvedTitle,
        content: approvedContent,
        humanApproval: validApproval(),
      },
    );

    expect(result).toMatchObject({ status: "published", lastReviewedAt: "2026-07-13T07:00:00.000Z" });
  });

  it.each([null, { approver: "replacement-without-valid-binding" }])(
    "rejects an explicit humanApproval mutation on published content: %j",
    async (humanApproval) => {
      await expect(
        runBeforeChange(
          ClusterPages,
          { status: "published", humanApproval },
          "human",
          {
            status: "published",
            canonicalUrl,
            title: approvedTitle,
            content: approvedContent,
            humanApproval: validApproval(),
          },
        ),
      ).rejects.toThrow("A valid human approval is required before changing approved published content.");
    },
  );

  it("blocks an agent from changing approval-bound generic published content even with a matching approval", async () => {
    const content = "Agent-authored published mutation.";
    await expect(
      runBeforeChange(
        ClusterPages,
        { status: "published", content, humanApproval: validApproval({ content }) },
        "agent",
        {
          status: "published",
          canonicalUrl,
          title: approvedTitle,
          content: approvedContent,
          humanApproval: validApproval(),
        },
      ),
    ).rejects.toThrow("Agent users cannot publish or change approval-bound published content.");
  });

  it("blocks an agent from changing approval-bound Problem Page content even with a matching approval", async () => {
    const changedProblem = { ...approvedProblemPage, diagnosis: "Agent-authored diagnosis." };
    const approval = validApproval({
      title: changedProblem.title,
      canonicalPath: problemCanonicalPath,
      content: serializeProblemPageRevisionContent(changedProblem),
      publicationRecord: { ...changedProblem, canonicalUrl: problemCanonicalUrl },
      problemPage: true,
    });

    await expect(
      runBeforeChange(
        ProblemPages,
        { status: "published", diagnosis: changedProblem.diagnosis, humanApproval: approval },
        "agent",
        {
          ...approvedProblemPage,
          status: "published",
          canonicalUrl: problemCanonicalUrl,
          humanApproval: validApproval({
            title: approvedProblemPage.title,
            canonicalPath: problemCanonicalPath,
            content: serializeProblemPageRevisionContent(approvedProblemPage),
            publicationRecord: { ...approvedProblemPage, canonicalUrl: problemCanonicalUrl },
            problemPage: true,
          }),
        },
      ),
    ).rejects.toThrow("Agent users cannot publish or change approval-bound published content.");
  });
});
