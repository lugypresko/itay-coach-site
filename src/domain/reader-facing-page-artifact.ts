import { createHash } from "node:crypto";

import { z } from "zod";

const nonEmptyString = z.string().trim().min(1);
const internalHref = z
  .string()
  .trim()
  .regex(/^\/(?!\/)/, "Public paths require exactly one leading slash.")
  .refine((value) => !value.includes("\\") && !value.split("/").includes(".."), "Unsafe public path.")
  .refine((value) => !value.includes("#") && !value.includes("?"));

export const readerFacingSectionSchema = z
  .object({
    sectionId: nonEmptyString,
    heading: nonEmptyString.optional(),
    paragraphs: z.array(nonEmptyString).default([]),
    bullets: z.array(nonEmptyString).optional(),
  })
  .strict()
  .refine((section) => section.paragraphs.length > 0 || Boolean(section.bullets?.length), {
    message: "A reader-facing section requires prose or bullets.",
  });

export const publicCtaSchema = z
  .object({
    label: nonEmptyString,
    href: internalHref,
    context: nonEmptyString,
  })
  .strict();

export const publicLinkSchema = z
  .object({
    label: nonEmptyString,
    href: internalHref,
  })
  .strict();

export const publicFaqSchema = z
  .object({
    question: nonEmptyString,
    answer: nonEmptyString,
  })
  .strict();

export const publicSeoInputSchema = z
  .object({
    title: nonEmptyString,
    description: nonEmptyString,
  })
  .strict();

export const publicStructuredDataInputSchema = z
  .object({
    type: z.enum(["Article", "FAQPage", "HowTo", "Person", "Organization"]),
    authorName: nonEmptyString.optional(),
  })
  .strict();

export const readerFacingPublicFieldsSchema = z
  .object({
    pageType: z.enum(["entity", "pillar", "cluster", "framework", "problem", "case_study", "faq", "glossary"]),
    canonicalPath: internalHref,
    locale: nonEmptyString,
    title: nonEmptyString,
    description: nonEmptyString,
    body: z.array(readerFacingSectionSchema).min(1),
    primaryCta: publicCtaSchema,
    secondaryCta: publicCtaSchema.optional(),
    internalLinks: z.array(publicLinkSchema),
    faq: z.array(publicFaqSchema).optional(),
    seo: publicSeoInputSchema,
    structuredDataInput: publicStructuredDataInputSchema.optional(),
  })
  .strict();

export const readerFacingPageArtifactSchema = readerFacingPublicFieldsSchema
  .extend({
    artifactId: nonEmptyString,
    artifactVersion: z.number().int().positive(),
    schemaVersion: nonEmptyString,
    artifactHash: z.string().regex(/^[a-f0-9]{64}$/),
    lifecycle: z.enum(["draft", "approved"]),
    createdAt: z.string().datetime(),
  })
  .strict();

export type ReaderFacingPublicFields = z.infer<typeof readerFacingPublicFieldsSchema>;
export type ReaderFacingPageArtifact = z.infer<typeof readerFacingPageArtifactSchema>;
export type ReaderFacingSection = z.infer<typeof readerFacingSectionSchema>;
export type PublicCta = z.infer<typeof publicCtaSchema>;
export type PublicLink = z.infer<typeof publicLinkSchema>;
export type PublicFaq = z.infer<typeof publicFaqSchema>;

function canonicalize(value: unknown): unknown {
  if (typeof value === "string") return value.replace(/\r\n/g, "\n").trim();
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, item]) => item !== undefined)
        .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
        .map(([key, item]) => [key, canonicalize(item)]),
    );
  }
  return value;
}

export function serializeReaderFacingPublicFields(input: unknown): string {
  const source = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const fields = readerFacingPublicFieldsSchema.parse({
    pageType: source.pageType,
    canonicalPath: source.canonicalPath,
    locale: source.locale,
    title: source.title,
    description: source.description,
    body: source.body,
    primaryCta: source.primaryCta,
    secondaryCta: source.secondaryCta,
    internalLinks: source.internalLinks,
    faq: source.faq,
    seo: source.seo,
    structuredDataInput: source.structuredDataInput,
  });
  return JSON.stringify(canonicalize(fields));
}

export function createReaderFacingArtifactHash(input: unknown): string {
  return createHash("sha256").update(serializeReaderFacingPublicFields(input), "utf8").digest("hex");
}

const artifactDraftInputSchema = readerFacingPublicFieldsSchema
  .extend({
    artifactId: nonEmptyString,
    artifactVersion: z.number().int().positive(),
    schemaVersion: nonEmptyString,
    createdAt: z.string().datetime(),
  })
  .strict();

export function createReaderFacingArtifactDraft(input: z.input<typeof artifactDraftInputSchema>): ReaderFacingPageArtifact {
  const parsed = artifactDraftInputSchema.parse(input);
  const artifact = {
    ...parsed,
    artifactHash: createReaderFacingArtifactHash(parsed),
    lifecycle: "draft" as const,
  };
  return readerFacingPageArtifactSchema.parse(artifact);
}

export function validateReaderFacingArtifactHash(artifact: unknown): artifact is ReaderFacingPageArtifact {
  const parsed = readerFacingPageArtifactSchema.safeParse(artifact);
  return parsed.success && parsed.data.artifactHash === createReaderFacingArtifactHash(parsed.data);
}
