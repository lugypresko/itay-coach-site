import type { CollectionBeforeChangeHook, CollectionConfig } from "payload";

import {
  createReaderFacingArtifactHash,
  readerFacingPageArtifactSchema,
  readerFacingPublicFieldsSchema,
} from "../../domain/reader-facing-page-artifact";
import {
  artifactHumanApprovalSchema,
  artifactProvenanceSchema,
  artifactSemanticReviewSchema,
  artifactValidationResultSchema,
  evaluateArtifactPublication,
  publicationRecordSchema,
} from "../../ai/governance/reader-facing-artifact-governance";

const humanRoles = new Set(["admin", "editor", "human"]);

function roleOf(req: unknown): string | undefined {
  return (req as { user?: { role?: string } | null } | undefined)?.user?.role;
}

function isBoundTo(value: unknown, artifactId: unknown, artifactVersion: unknown, artifactHash: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    record.artifactId === artifactId &&
    record.artifactVersion === artifactVersion &&
    record.artifactHash === artifactHash
  );
}

const enforceArtifactBoundary: CollectionBeforeChangeHook = async ({ data, originalDoc, operation, req }) => {
  const next = { ...(data as Record<string, unknown>) };
  const previous = (originalDoc ?? {}) as Record<string, unknown>;

  if (operation === "create") {
    const publicFields = readerFacingPublicFieldsSchema.parse(next.publicFields);
    next.publicFields = publicFields;
    next.artifactHash = createReaderFacingArtifactHash(publicFields);
    next.artifactKey = `${String(next.artifactId)}:v${String(next.artifactVersion)}`;
    next.lifecycle = "draft";
    const provenance = next.provenance && typeof next.provenance === "object" ? next.provenance as Record<string, unknown> : {};
    next.provenance = artifactProvenanceSchema.parse({
      ...provenance,
      artifactId: next.artifactId,
      artifactVersion: next.artifactVersion,
      artifactHash: next.artifactHash,
    });
    delete next.deterministicValidation;
    delete next.internalLanguageValidation;
    delete next.semanticReview;
    delete next.humanApproval;
    delete next.publicationRecord;
    return next;
  }

  const publicFieldsChanged = Object.prototype.hasOwnProperty.call(next, "publicFields");
  if (previous.lifecycle === "approved" && publicFieldsChanged) {
    throw new Error("Approved reader-facing artifact public fields are immutable.");
  }

  const merged = { ...previous, ...next };
  if (publicFieldsChanged) {
    const publicFields = readerFacingPublicFieldsSchema.parse(next.publicFields);
    next.publicFields = publicFields;
    next.artifactHash = createReaderFacingArtifactHash(publicFields);
    next.lifecycle = "draft";
    delete next.deterministicValidation;
    delete next.internalLanguageValidation;
    delete next.semanticReview;
    delete next.humanApproval;
    delete next.publicationRecord;
    return next;
  }

  const binding = { artifactId: merged.artifactId, artifactVersion: merged.artifactVersion, artifactHash: merged.artifactHash };
  for (const [key, schema] of [
    ["deterministicValidation", artifactValidationResultSchema],
    ["internalLanguageValidation", artifactValidationResultSchema],
    ["semanticReview", artifactSemanticReviewSchema],
    ["humanApproval", artifactHumanApprovalSchema],
    ["publicationRecord", publicationRecordSchema],
  ] as const) {
    if (!Object.prototype.hasOwnProperty.call(next, key)) continue;
    if (previous[key] !== undefined) throw new Error(`${key} is append-once for an artifact version.`);
    const parsed = schema.parse(next[key]);
    if (!isBoundTo(parsed, binding.artifactId, binding.artifactVersion, binding.artifactHash)) {
      throw new Error(`${key} must match the artifact id, version, and hash.`);
    }
    next[key] = parsed;
    merged[key] = parsed;
  }

  const asksForApproval = next.lifecycle === "approved" || Object.prototype.hasOwnProperty.call(next, "humanApproval");
  const asksForPublication = Object.prototype.hasOwnProperty.call(next, "publicationRecord");
  if ((asksForApproval || asksForPublication) && !humanRoles.has(roleOf(req) ?? "")) {
    throw new Error("An authenticated human role is required for artifact approval or publication.");
  }

  if (asksForApproval) {
    const approval = merged.humanApproval as Record<string, unknown> | undefined;
    const chain = [merged.deterministicValidation, merged.internalLanguageValidation, merged.semanticReview, approval];
    if (
      !approval ||
      approval.decision !== "approved" ||
      chain.some((item) => !isBoundTo(item, merged.artifactId, merged.artifactVersion, merged.artifactHash)) ||
      chain.slice(0, 3).some((item) => (item as Record<string, unknown> | undefined)?.passed !== true)
    ) {
      throw new Error("Artifact approval requires a matching passed validation and review chain.");
    }
  }

  if (asksForPublication && previous.lifecycle !== "approved" && merged.lifecycle !== "approved") {
    throw new Error("Only an approved artifact can receive a publication record.");
  }

  if (asksForPublication) {
    const publicFields = readerFacingPublicFieldsSchema.parse(merged.publicFields);
    const artifact = readerFacingPageArtifactSchema.parse({
      ...publicFields,
      artifactId: merged.artifactId,
      artifactVersion: merged.artifactVersion,
      schemaVersion: merged.schemaVersion,
      artifactHash: merged.artifactHash,
      lifecycle: merged.lifecycle,
      createdAt: merged.createdAt,
    });
    const evaluation = evaluateArtifactPublication({
      artifact,
      deterministicValidation: merged.deterministicValidation,
      internalLanguageValidation: merged.internalLanguageValidation,
      semanticReview: merged.semanticReview,
      humanApproval: merged.humanApproval,
      publicationRecord: merged.publicationRecord,
    });
    if (!evaluation.public) throw new Error(`Publication record rejected: ${evaluation.reasonCodes.join(", ")}`);
  }

  return next;
};

const authenticatedWrite = ({ req }: { req: unknown }) => Boolean(roleOf(req));

export const ReaderFacingPageArtifacts: CollectionConfig = {
  slug: "reader-facing-page-artifacts",
  labels: { singular: "Reader-Facing Page Artifact", plural: "Reader-Facing Page Artifacts" },
  admin: {
    description: "Immutable, public-only artifacts and their hash-bound governance sidecars.",
    useAsTitle: "artifactId",
  },
  access: {
    create: authenticatedWrite,
    read: authenticatedWrite,
    update: authenticatedWrite,
    delete: () => false,
  },
  hooks: { beforeChange: [enforceArtifactBoundary] },
  timestamps: true,
  fields: [
    { name: "artifactId", type: "text", required: true, index: true },
    { name: "artifactVersion", type: "number", required: true, min: 1, index: true },
    { name: "schemaVersion", type: "text", required: true },
    { name: "artifactKey", type: "text", required: true, unique: true, index: true },
    { name: "artifactHash", type: "text", required: true, index: true, admin: { readOnly: true } },
    { name: "lifecycle", type: "select", required: true, defaultValue: "draft", options: ["draft", "approved"], index: true },
    { name: "publicFields", type: "json", required: true },
    { name: "deterministicValidation", type: "json" },
    { name: "internalLanguageValidation", type: "json" },
    { name: "semanticReview", type: "json" },
    { name: "humanApproval", type: "json" },
    { name: "provenance", type: "json", required: true },
    { name: "publicationRecord", type: "json" },
  ],
};
