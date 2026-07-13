import { describe, expect, it } from "vitest";

import { ReaderFacingPageArtifacts } from "../../src/payload/collections/ReaderFacingPageArtifacts";

function field(name: string) {
  return ReaderFacingPageArtifacts.fields.find((candidate) => "name" in candidate && candidate.name === name);
}

describe("ReaderFacingPageArtifacts Payload boundary", () => {
  it("uses one private collection for the public artifact and logically separate governance entities", () => {
    expect(ReaderFacingPageArtifacts.slug).toBe("reader-facing-page-artifacts");
    expect(ReaderFacingPageArtifacts.access?.read).toBeTypeOf("function");
    expect(field("artifactId")).toMatchObject({ type: "text", required: true, index: true });
    expect(field("artifactVersion")).toMatchObject({ type: "number", required: true, index: true });
    expect(field("artifactHash")).toMatchObject({ type: "text", required: true, index: true });
    expect(field("publicFields")).toMatchObject({ type: "json", required: true });
    expect(field("deterministicValidation")).toMatchObject({ type: "json" });
    expect(field("internalLanguageValidation")).toMatchObject({ type: "json" });
    expect(field("semanticReview")).toMatchObject({ type: "json" });
    expect(field("humanApproval")).toMatchObject({ type: "json" });
    expect(field("provenance")).toMatchObject({ type: "json", required: true });
    expect(field("publicationRecord")).toMatchObject({ type: "json" });
  });

  it("denies anonymous writes and all public reads", async () => {
    for (const operation of ["create", "update"] as const) {
      const access = ReaderFacingPageArtifacts.access?.[operation];
      if (typeof access !== "function") throw new Error(`Missing ${operation} access`);
      await expect(Promise.resolve(access({ req: { user: null } } as never))).resolves.toBe(false);
    }
    const read = ReaderFacingPageArtifacts.access?.read;
    if (typeof read !== "function") throw new Error("Missing read access");
    await expect(Promise.resolve(read({ req: { user: null } } as never))).resolves.toBe(false);
  });

  it("computes the hash server-side and refuses caller-supplied approval or publication state", async () => {
    const hook = ReaderFacingPageArtifacts.hooks?.beforeChange?.[0];
    if (!hook) throw new Error("Missing artifact governance hook");
    const publicFields = {
      pageType: "cluster",
      canonicalPath: "/clusters/example",
      locale: "en",
      title: "Example",
      description: "Example description",
      body: [{ sectionId: "diagnosis", paragraphs: ["Reader-facing prose."] }],
      primaryCta: { label: "Diagnose the pattern", href: "/player-trap", context: "Start here." },
      internalLinks: [],
      seo: { title: "Example", description: "Example description" },
    };

    const result = await hook({
      operation: "create",
      data: {
        artifactId: "artifact-example",
        artifactVersion: 1,
        schemaVersion: "1.0.0",
        publicFields,
        artifactHash: "forged",
        lifecycle: "approved",
        humanApproval: { decision: "approved" },
        publicationRecord: { publicationState: "published", indexable: true },
        provenance: {
          pageBriefId: "brief-example",
          generationMode: "hybrid",
          sourceApprovedInsightIds: ["approved-insight-example"],
          generatedAt: "2026-07-13T12:00:00.000Z",
        },
      },
      req: { user: { role: "agent" } },
    } as never);

    expect(result).toMatchObject({ lifecycle: "draft" });
    expect(result.artifactHash).toMatch(/^[a-f0-9]{64}$/);
    expect(result).not.toHaveProperty("humanApproval");
    expect(result).not.toHaveProperty("publicationRecord");
  });

  it("keeps approved artifact public fields immutable", async () => {
    const hook = ReaderFacingPageArtifacts.hooks?.beforeChange?.[0];
    if (!hook) throw new Error("Missing artifact governance hook");
    await expect(
      hook({
        operation: "update",
        data: { publicFields: { title: "Changed" } },
        originalDoc: { lifecycle: "approved", publicFields: { title: "Original" } },
        req: { user: { role: "human" } },
      } as never),
    ).rejects.toThrow("Approved reader-facing artifact public fields are immutable");
  });
});
