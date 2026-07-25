import { z } from "zod";

import {
  readerFacingPageArtifactSchema,
  validateReaderFacingArtifactHash,
  type ReaderFacingPageArtifact,
} from "../../domain/reader-facing-page-artifact";

const nonEmpty = z.string().trim().min(1);
const isoDate = z.string().datetime();
const hash = z.string().regex(/^[a-f0-9]{64}$/);

export const artifactBindingSchema = z.object({
  artifactId: nonEmpty,
  artifactVersion: z.number().int().positive(),
  artifactHash: hash,
}).strict();

export const artifactValidationResultSchema = artifactBindingSchema.extend({
  validationType: z.enum(["deterministic", "internal_language", "completeness", "differentiation"]),
  passed: z.boolean(),
  failureCodes: z.array(nonEmpty),
  validatedAt: isoDate,
  metadata: z.record(z.string(), z.unknown()).optional(),
}).strict().superRefine((value, context) => {
  if (value.passed && value.failureCodes.length > 0) {
    context.addIssue({ code: "custom", message: "Passed validation cannot contain failure codes." });
  }
});

export const artifactSemanticReviewSchema = artifactBindingSchema.extend({
  passed: z.boolean(),
  reviewedAt: isoDate,
  dimensions: z.array(z.object({
    dimension: nonEmpty,
    score: z.number().min(0).max(100),
    passed: z.boolean(),
    reason: nonEmpty,
    revisionRecommendation: nonEmpty.optional(),
  }).strict()).min(1),
}).strict().superRefine((value, context) => {
  if (value.passed && value.dimensions.some((dimension) => !dimension.passed)) {
    context.addIssue({ code: "custom", message: "Passed review cannot contain failed dimensions." });
  }
});

export const artifactHumanApprovalSchema = artifactBindingSchema.extend({
  decision: z.enum(["approved", "rejected"]),
  approver: nonEmpty,
  approvedAt: isoDate,
}).strict();

export const artifactProvenanceSchema = artifactBindingSchema.extend({
  pageBriefId: nonEmpty,
  generationMode: z.enum(["agentic", "deterministic", "hybrid"]),
  sourceApprovedInsightIds: z.array(nonEmpty).min(1),
  generatedAt: isoDate,
}).strict();

export const contentDecisionArtifactProvenanceSchema = artifactProvenanceSchema.extend({
  contentDecisionId: nonEmpty,
  contentDecisionVersion: z.number().int().positive(),
}).strict();

export const publicationRecordSchema = artifactBindingSchema.extend({
  publicationState: z.enum(["draft", "published", "archived"]),
  indexable: z.boolean(),
  publishedAt: isoDate.optional(),
}).strict().superRefine((value, context) => {
  if (value.publicationState === "published" && (!value.indexable || !value.publishedAt)) {
    context.addIssue({ code: "custom", message: "Published record requires indexable=true and publishedAt." });
  }
  if (value.publicationState !== "published" && value.indexable) {
    context.addIssue({ code: "custom", message: "Only published records may be indexable." });
  }
});

export type ArtifactBinding = z.infer<typeof artifactBindingSchema>;
export type ArtifactValidationResult = z.infer<typeof artifactValidationResultSchema>;
export type ArtifactSemanticReview = z.infer<typeof artifactSemanticReviewSchema>;
export type ArtifactHumanApproval = z.infer<typeof artifactHumanApprovalSchema>;
export type ArtifactProvenance = z.infer<typeof artifactProvenanceSchema>;
export type ContentDecisionArtifactProvenance = z.infer<typeof contentDecisionArtifactProvenanceSchema>;
export type PublicationRecord = z.infer<typeof publicationRecordSchema>;

export interface ArtifactPublicationEvaluation {
  public: boolean;
  indexable: boolean;
  reasonCodes: string[];
}

export function validateReaderFacingArtifactDeterministically(
  artifact: unknown,
  validatedAt: string,
): ArtifactValidationResult {
  const parsed = readerFacingPageArtifactSchema.safeParse(artifact);
  if (!parsed.success) {
    const source = artifact && typeof artifact === "object" ? artifact as Record<string, unknown> : {};
    const errorArtifactId = typeof source.artifactId === "string" && source.artifactId ? source.artifactId : "invalid-artifact";
    const errorArtifactVersion = typeof source.artifactVersion === "number" && source.artifactVersion > 0 ? source.artifactVersion : 1;
    const errorArtifactHash = typeof source.artifactHash === "string" && /^[a-f0-9]{64}$/.test(source.artifactHash) ? source.artifactHash : "0".repeat(64);
    
    return {
      artifactId: errorArtifactId,
      artifactVersion: errorArtifactVersion,
      artifactHash: errorArtifactHash,
      validationType: "deterministic",
      passed: false,
      failureCodes: ["artifact_contract_invalid"],
      validatedAt,
    };
  }
  const value = parsed.data;
  const failureCodes: string[] = [];
  if (!validateReaderFacingArtifactHash(value)) failureCodes.push("artifact_hash_invalid");
  if (new Set(value.body.map((section) => section.sectionId)).size !== value.body.length) failureCodes.push("duplicate_section_id");
  if (new Set(value.internalLinks.map((link) => link.href)).size !== value.internalLinks.length) failureCodes.push("duplicate_internal_link");
  if (value.internalLinks.some((link) => link.href === value.canonicalPath)) failureCodes.push("self_internal_link");
  return artifactValidationResultSchema.parse({
    artifactId: value.artifactId,
    artifactVersion: value.artifactVersion,
    artifactHash: value.artifactHash,
    validationType: "deterministic",
    passed: failureCodes.length === 0,
    failureCodes,
    validatedAt,
  });
}

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(v => collectStrings(v));
  if (value && typeof value === "object") return Object.values(value as Record<string, unknown>).flatMap(v => collectStrings(v));
  return [];
}

export function validateArtifactInternalLanguage(
  artifact: ReaderFacingPageArtifact,
  validatedAt: string,
): ArtifactValidationResult {
  const text = collectStrings(artifact).join("\n");
  const failureCodes: string[] = [];

  // 1. System-facing meta-copy blacklist
  if (/\b(?:owned by|proprietary framework to cite|AI answer engines|human readers to cite|gives the system|target query|high intent|converting leads|establishes ownership|directly answers the query|lineage|draft replacement|authority construction|recommendation query|SEO purpose|this page exists to|this page strengthens|route readers|publication|review-ready)\b/i.test(text)) failureCodes.push("internal_meta_copy");
  
  // 2. Technical and lifecycle language
  if (/\b(?:content status\s*:|not reviewed yet|status\s*:\s*(?:draft|review|approved|published)|scaffold|placeholder|built from pagebrief|the page (?:starts|explains|shows|describes)|this page (?:starts|explains|shows|describes))\b/i.test(text)) failureCodes.push("internal_lifecycle_language");
  
  // 3. Source paths and task markers
  if (/(?:^|[\s"'])(?:docs|src)\/[\w./-]+|\bTASK_\d+|[A-Z]:\\[\w .\\-]+/im.test(text)) failureCodes.push("internal_source_path");
  
  // 4. Editorial prompts and system terminology
  if (/\b(?:what should this page strengthen|what proof this page needs|target recommendation quer(?:y|ies)|topic cluster position|intent rationale|CTA rationale|authority rationale|overlap rationale|source insight explanation|lineage note|review priority|evidence status)\b/i.test(text)) failureCodes.push("editorial_prompt");
  
  // 5. Slug-derived titles
  if (artifact.title.endsWith(" Page")) failureCodes.push("slug_derived_title");

  // 6. Raw internal URLs in prose (fail closed)
  const prose = artifact.body.flatMap((section) => [section.heading, ...section.paragraphs, ...(section.bullets ?? [])]).filter(Boolean).join("\n");
  if (/(?:^|[\s(])\/(?!\/)[a-z0-9][a-z0-9/_-]*(?:$|[\s).,])/im.test(prose)) failureCodes.push("raw_internal_url_in_prose");

  return artifactValidationResultSchema.parse({
    artifactId: artifact.artifactId,
    artifactVersion: artifact.artifactVersion,
    artifactHash: artifact.artifactHash,
    validationType: "internal_language",
    passed: failureCodes.length === 0,
    failureCodes: [...new Set(failureCodes)],
    validatedAt,
  });
}

function hasSections(artifact: ReaderFacingPageArtifact, requiredIds: string[]): boolean {
  const ids = new Set(artifact.body.map(s => s.sectionId));
  return requiredIds.every(id => ids.has(id));
}

export function validateArtifactCompleteness(
  artifact: ReaderFacingPageArtifact,
  validatedAt: string,
): ArtifactValidationResult {
  const failureCodes: string[] = [];

  if (artifact.pageType === "framework") {
    if (!hasSections(artifact, ["definition", "problem", "symptoms", "stages", "interpretation", "limits", "next-step"])) {
      failureCodes.push("framework_incomplete");
    }
  } else if (artifact.pageType === "problem") {
    if (!hasSections(artifact, ["recognition", "situations", "cost", "failed-fixes", "root-cause", "intervention", "cta"])) {
      failureCodes.push("problem_incomplete");
    }
  } else if (artifact.pageType === "cluster") {
    if (!hasSections(artifact, ["answer", "role-context", "symptoms", "mechanism", "next-step", "why-help", "cta"])) {
      failureCodes.push("cluster_incomplete");
    }
  }

  return artifactValidationResultSchema.parse({
    artifactId: artifact.artifactId,
    artifactVersion: artifact.artifactVersion,
    artifactHash: artifact.artifactHash,
    validationType: "completeness",
    passed: failureCodes.length === 0,
    failureCodes,
    validatedAt,
  });
}

export function validateArtifactUrls(
  artifact: ReaderFacingPageArtifact,
  activePaths: Set<string>,
  validatedAt: string,
): ArtifactValidationResult {
  const failureCodes: string[] = [];
  const urls: string[] = [
    artifact.canonicalPath,
    artifact.primaryCta.href,
    ...(artifact.secondaryCta ? [artifact.secondaryCta.href] : []),
    ...artifact.internalLinks.map(l => l.href),
  ];

  for (const url of urls) {
    if (!activePaths.has(url)) {
      failureCodes.push(`inactive_url_${url}`);
    }
  }

  return artifactValidationResultSchema.parse({
    artifactId: artifact.artifactId,
    artifactVersion: artifact.artifactVersion,
    artifactHash: artifact.artifactHash,
    validationType: "deterministic",
    passed: failureCodes.length === 0,
    failureCodes,
    validatedAt,
  });
}

function bindingMatches(artifact: ReaderFacingPageArtifact, value: ArtifactBinding): boolean {
  return artifact.artifactId === value.artifactId && artifact.artifactVersion === value.artifactVersion && artifact.artifactHash === value.artifactHash;
}

export interface DifferentiationAnalysis {
  artifactId: string;
  comparedWith: string;
  titleSimilarity: number;
  headingSimilarity: number;
  paragraphSimilarity: number;
  ctaOverlap: boolean;
  sharedClaims: string[];
  status: "pass" | "warning" | "merge_required" | "revise_required";
}

export interface SemanticReviewOptions {
  model: string;
  provider: string;
  promptVersion: string;
  rubricVersion: string;
}

/**
 * Performs semantic review using the AI agent, bound to a specific artifact version and hash.
 */
export async function performSemanticReview(
  artifact: ReaderFacingPageArtifact,
  briefSummary: string,
  _options: SemanticReviewOptions,
): Promise<ArtifactSemanticReview> {
  const reviewedAt = new Date().toISOString();
  const prompt = `Evaluate this [ARTIFACT] against its [BRIEF].
  - Reject system-facing language: "This page exists to...", "Our framework shows", "Target query".
  - Ensure it answers the reader's question: ${briefSummary}.
  - Check for situational specificity: Must contain recognizable leadership/bottleneck scenarios.
  - Transformation check: Does it lead to a clear decision or diagnostic move?

  ARTIFACT TITLE: ${artifact.title}
  ARTIFACT CONTENT: ${JSON.stringify(artifact.body)}
  BRIEF SUMMARY: ${briefSummary}

  Return a JSON response matching the artifactSemanticReviewSchema.`;

  try {
    // @ts-expect-error - completion is provided by the execution environment (Oh My Pi / Agent Context)
    const review = await completion(prompt, {
      schema: artifactSemanticReviewSchema.omit({
        artifactId: true,
        artifactVersion: true,
        artifactHash: true,
        reviewedAt: true,
      }),
    });

    // Fail-closed hash binding
    return artifactSemanticReviewSchema.parse({
      ...review,
      artifactId: artifact.artifactId,
      artifactVersion: artifact.artifactVersion,
      artifactHash: artifact.artifactHash,
      reviewedAt,
    });
  } catch (error) {
    console.error("Semantic review failed. Failing closed.", error);
    return {
      artifactId: artifact.artifactId,
      artifactVersion: artifact.artifactVersion,
      artifactHash: artifact.artifactHash,
      reviewedAt,
      passed: false,
      dimensions: [
        {
          dimension: "review_engine",
          score: 0,
          passed: false,
          reason: "Review engine error or malformed response.",
        },
      ],
    };
  }
}

export function analyzeArtifactDifferentiation(
  artifact: ReaderFacingPageArtifact,
  others: ReaderFacingPageArtifact[],
  validatedAt: string,
): ArtifactValidationResult {
  const analysis: DifferentiationAnalysis[] = [];
  const failureCodes: string[] = [];

  for (const other of others) {
    if (artifact.artifactId === other.artifactId) continue;

    const titleSim = artifact.title.toLowerCase() === other.title.toLowerCase() ? 100 : 0;
    const ctaOverlap = artifact.primaryCta.href === other.primaryCta.href;
    
    let status: DifferentiationAnalysis["status"] = "pass";
    if (titleSim > 95 || ctaOverlap) status = "revise_required";
    else if (titleSim > 80) status = "warning";
    
    if (status === "revise_required") failureCodes.push(`differentiation_failure_${other.artifactId}`);
    else if (status === "warning") failureCodes.push(`differentiation_warning_${other.artifactId}`);

    analysis.push({
      artifactId: artifact.artifactId,
      comparedWith: other.artifactId,
      titleSimilarity: titleSim,
      headingSimilarity: 0,
      paragraphSimilarity: 0,
      ctaOverlap,
      sharedClaims: [],
      status,
    });
  }

  return artifactValidationResultSchema.parse({
    artifactId: artifact.artifactId,
    artifactVersion: artifact.artifactVersion,
    artifactHash: artifact.artifactHash,
    validationType: "differentiation",
    passed: failureCodes.length === 0,
    failureCodes,
    validatedAt,
    metadata: { analysis },
  });
}

export function evaluateArtifactPublication(input: {
  artifact: unknown;
  deterministicValidation: unknown;
  internalLanguageValidation: unknown;
  semanticReview: unknown;
  humanApproval: unknown;
  publicationRecord: unknown;
}): ArtifactPublicationEvaluation {
  const reasonCodes: string[] = [];
  const artifactResult = readerFacingPageArtifactSchema.safeParse(input.artifact);
  if (!artifactResult.success) return { public: false, indexable: false, reasonCodes: ["artifact_contract_invalid"] };
  const artifact = artifactResult.data;
  if (!validateReaderFacingArtifactHash(artifact)) reasonCodes.push("artifact_hash_invalid");
  if (artifact.lifecycle !== "approved") reasonCodes.push("artifact_not_approved");

  const parsed = {
    deterministicValidation: artifactValidationResultSchema.safeParse(input.deterministicValidation),
    internalLanguageValidation: artifactValidationResultSchema.safeParse(input.internalLanguageValidation),
    semanticReview: artifactSemanticReviewSchema.safeParse(input.semanticReview),
    humanApproval: artifactHumanApprovalSchema.safeParse(input.humanApproval),
    publicationRecord: publicationRecordSchema.safeParse(input.publicationRecord),
  };
  for (const [key, result] of Object.entries(parsed)) if (!result.success) reasonCodes.push(`${key}_contract_invalid`);
  if (reasonCodes.some((code) => code.endsWith("_contract_invalid"))) return { public: false, indexable: false, reasonCodes };

  const chain = {
    deterministicValidation: parsed.deterministicValidation.data!,
    internalLanguageValidation: parsed.internalLanguageValidation.data!,
    semanticReview: parsed.semanticReview.data!,
    humanApproval: parsed.humanApproval.data!,
    publicationRecord: parsed.publicationRecord.data!,
  };
  for (const key of Object.keys(chain) as Array<keyof typeof chain>) if (!bindingMatches(artifact, chain[key])) reasonCodes.push(`${key}_hash_mismatch`);
  if (chain.deterministicValidation.validationType !== "deterministic" || !chain.deterministicValidation.passed) reasonCodes.push("deterministic_validation_failed");
  if (chain.internalLanguageValidation.validationType !== "internal_language" || !chain.internalLanguageValidation.passed) reasonCodes.push("internal_language_validation_failed");
  if (!chain.semanticReview.passed) reasonCodes.push("semantic_review_failed");
  if (chain.humanApproval.decision !== "approved") reasonCodes.push("human_approval_missing");
  if (chain.publicationRecord.publicationState !== "published" || !chain.publicationRecord.indexable) reasonCodes.push("publication_record_not_published");

  const times = [chain.deterministicValidation.validatedAt, chain.internalLanguageValidation.validatedAt].map((t) => Date.parse(t));
  const reviewTime = Date.parse(chain.semanticReview.reviewedAt);
  const approvalTime = Date.parse(chain.humanApproval.approvedAt);
  const publicationTime = Date.parse(chain.publicationRecord.publishedAt ?? "");
  if (reviewTime < Math.max(...times)) reasonCodes.push("semantic_review_predates_validation");
  if (approvalTime < reviewTime) reasonCodes.push("human_approval_predates_review");
  if (publicationTime < approvalTime) reasonCodes.push("publication_predates_approval");

  const publicArtifact = reasonCodes.length === 0;
  return { public: publicArtifact, indexable: publicArtifact, reasonCodes: [...new Set(reasonCodes)] };
}
