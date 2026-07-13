import { readerFacingPageArtifactSchema, type ReaderFacingPageArtifact } from "../domain/reader-facing-page-artifact";
import { evaluateArtifactPublication } from "../ai/governance/reader-facing-artifact-governance";
import { getServerPayload } from "./payload";

export interface ReaderFacingArtifactRecord {
  artifact: unknown;
  deterministicValidation: unknown;
  internalLanguageValidation: unknown;
  semanticReview: unknown;
  humanApproval: unknown;
  publicationRecord: unknown;
}

export interface ReaderFacingArtifactPublicProjection {
  pages: ReaderFacingPageArtifact[];
  byPathname: Map<string, ReaderFacingPageArtifact>;
  sitemapPathnames: string[];
  llmsTxtPathnames: string[];
  exclusions: Array<{ artifactId?: string; canonicalPath?: string; reasonCodes: string[] }>;
}

export function buildReaderFacingArtifactPublicProjection(
  records: ReaderFacingArtifactRecord[],
): ReaderFacingArtifactPublicProjection {
  const candidates = records.map((record) => {
    const parsed = readerFacingPageArtifactSchema.safeParse(record.artifact);
    return { record, parsed, evaluation: evaluateArtifactPublication(record) };
  });
  const pathCounts = new Map<string, number>();
  for (const candidate of candidates) {
    if (candidate.parsed.success && candidate.evaluation.public) {
      const path = candidate.parsed.data.canonicalPath;
      pathCounts.set(path, (pathCounts.get(path) ?? 0) + 1);
    }
  }

  const pages: ReaderFacingPageArtifact[] = [];
  const exclusions: ReaderFacingArtifactPublicProjection["exclusions"] = [];
  for (const candidate of candidates) {
    const artifact = candidate.parsed.success ? candidate.parsed.data : undefined;
    const collision = artifact && candidate.evaluation.public && (pathCounts.get(artifact.canonicalPath) ?? 0) > 1;
    const reasonCodes = collision ? [...candidate.evaluation.reasonCodes, "canonical_collision"] : candidate.evaluation.reasonCodes;
    if (!artifact || !candidate.evaluation.public || collision) {
      exclusions.push({ artifactId: artifact?.artifactId, canonicalPath: artifact?.canonicalPath, reasonCodes });
      continue;
    }
    pages.push(artifact);
  }

  pages.sort((left, right) => (left.canonicalPath < right.canonicalPath ? -1 : 1));
  const byPathname = new Map(pages.map((page) => [page.canonicalPath, page]));
  const pathnames = pages.map((page) => page.canonicalPath);
  return { pages, byPathname, sitemapPathnames: pathnames, llmsTxtPathnames: pathnames, exclusions };
}

function toArtifactRecord(raw: Record<string, unknown>): ReaderFacingArtifactRecord {
  const publicFields = raw.publicFields && typeof raw.publicFields === "object" ? raw.publicFields as Record<string, unknown> : {};
  return {
    artifact: {
      ...publicFields,
      artifactId: raw.artifactId,
      artifactVersion: raw.artifactVersion,
      schemaVersion: raw.schemaVersion,
      artifactHash: raw.artifactHash,
      lifecycle: raw.lifecycle,
      createdAt: raw.createdAt,
    },
    deterministicValidation: raw.deterministicValidation,
    internalLanguageValidation: raw.internalLanguageValidation,
    semanticReview: raw.semanticReview,
    humanApproval: raw.humanApproval,
    publicationRecord: raw.publicationRecord,
  };
}

export async function loadReaderFacingArtifactPublicProjection(options: { payload?: unknown } = {}) {
  try {
    const payload = (options.payload ?? await getServerPayload()) as {
      find(args: Record<string, unknown>): Promise<{ docs: unknown[]; hasNextPage?: boolean }>;
    };
    const docs: unknown[] = [];
    for (let page = 1; page <= 100; page += 1) {
      const result = await payload.find({ collection: "reader-facing-page-artifacts", overrideAccess: true, limit: 100, page });
      docs.push(...result.docs);
      if (!result.hasNextPage) break;
    }
    return buildReaderFacingArtifactPublicProjection(docs.filter((doc): doc is Record<string, unknown> => Boolean(doc && typeof doc === "object")).map(toArtifactRecord));
  } catch {
    return buildReaderFacingArtifactPublicProjection([]);
  }
}
