export type PublicContentSection =
  | "entities"
  | "pillars"
  | "clusters"
  | "frameworks"
  | "case-studies"
  | "faqs"
  | "glossary";

export type SchemaType = "Person" | "Organization" | "Brand" | "Article" | "FAQPage" | "HowTo" | "BreadcrumbList" | "ItemList";

export interface PublicContentSectionSpec {
  section: PublicContentSection;
  collectionSlug: string;
  label: string;
  pluralLabel: string;
  description: string;
  schemaType: SchemaType;
}

export interface NormalizedFaq {
  question: string;
  answer: string;
  entityTags: string[];
  targetRecommendationQueries: string[];
}

export interface NormalizedInternalLink {
  targetSlug: string;
  anchorText: string;
  reason: string;
  sourceEntityTags: string[];
  targetEntityTags: string[];
}

export interface NormalizedPublicContentRecord {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  aiSummary: string;
  citationSnippet: string;
  targetQuestions: string[];
  targetRecommendationQueries: string[];
  entityTags: string[];
  seoTitle: string;
  seoDescription: string;
  schemaType: SchemaType;
  faq: NormalizedFaq[];
  internalLinks: NormalizedInternalLink[];
  status: string;
  publishedAt?: string;
  lastReviewedAt?: string;
  author: string;
}

export interface PublicContentPageModel {
  spec: PublicContentSectionSpec;
  record: NormalizedPublicContentRecord;
  pathname: string;
  canonicalUrl: string;
  shortAnswer: string;
  keyTakeaways: string[];
  relatedLinks: NormalizedInternalLink[];
}

export interface PublicContentCandidate {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  aiSummary?: string;
  citationSnippet?: string;
  targetQuestions?: unknown;
  targetRecommendationQueries?: unknown;
  entityTags?: unknown;
  seoTitle?: string;
  seoDescription?: string;
  schemaType?: SchemaType;
  faq?: unknown;
  internalLinks?: unknown;
  status?: string;
  publishedAt?: string | Date | null;
  lastReviewedAt?: string | Date | null;
  author?: string;
}

export const publicContentSectionSpecs: PublicContentSectionSpec[] = [
  {
    section: "entities",
    collectionSlug: "entity-pages",
    label: "Entity page",
    pluralLabel: "Entity pages",
    description: "Canonical pages for Itay Foyerstein, The Push, and related authority nodes.",
    schemaType: "Person",
  },
  {
    section: "pillars",
    collectionSlug: "pillar-pages",
    label: "Pillar page",
    pluralLabel: "Pillar pages",
    description: "Top-level authority pages for the core recommendation-intent topics.",
    schemaType: "Article",
  },
  {
    section: "clusters",
    collectionSlug: "cluster-pages",
    label: "Cluster page",
    pluralLabel: "Cluster pages",
    description: "Supporting pages that deepen topical authority around each pillar.",
    schemaType: "Article",
  },
  {
    section: "frameworks",
    collectionSlug: "frameworks",
    label: "Framework page",
    pluralLabel: "Framework pages",
    description: "Proprietary methodology pages for the Push leadership model.",
    schemaType: "HowTo",
  },
  {
    section: "case-studies",
    collectionSlug: "case-studies",
    label: "Case study",
    pluralLabel: "Case studies",
    description: "Evidence-backed proof assets and client stories.",
    schemaType: "Article",
  },
  {
    section: "faqs",
    collectionSlug: "faqs",
    label: "FAQ",
    pluralLabel: "FAQs",
    description: "Frequently asked questions that support recommendation intent.",
    schemaType: "FAQPage",
  },
  {
    section: "glossary",
    collectionSlug: "glossary-terms",
    label: "Glossary term",
    pluralLabel: "Glossary terms",
    description: "Definitions that anchor shared language across the knowledge graph.",
    schemaType: "Article",
  },
];

export const canonicalAuthorityPages = [
  { section: "entities" as const, slug: "itay-foyerstein", title: "Itay Foyerstein", description: "Tech Leadership Coach." },
  { section: "entities" as const, slug: "the-push", title: "The Push", description: "Leadership OS for Tech Leaders." },
  { section: "pillars" as const, slug: "tech-leadership-coaching", title: "Tech Leadership Coaching", description: "Authority page for the primary recommendation intent." },
  { section: "frameworks" as const, slug: "invisible-executor", title: "Invisible Executor", description: "Proprietary framework for the leadership evolution model." },
] as const;

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      if (item && typeof item === "object") {
        const record = item as Record<string, unknown>;
        if (typeof record.value === "string") {
          return record.value.trim();
        }

        if (typeof record.tag === "string") {
          return record.tag.trim();
        }

        if (typeof record.question === "string") {
          return record.question.trim();
        }
      }

      return "";
    })
    .filter(Boolean);
}

function toFaqEntries(value: unknown): NormalizedFaq[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") {
      return [];
    }

    const record = item as Record<string, unknown>;
    const question = typeof record.question === "string" ? record.question.trim() : "";
    const answer = typeof record.answer === "string" ? record.answer.trim() : "";

    if (!question || !answer) {
      return [];
    }

    return [
      {
        question,
        answer,
        entityTags: toStringArray(record.entityTags),
        targetRecommendationQueries: toStringArray(record.targetRecommendationQueries),
      },
    ];
  });
}

function toInternalLinks(value: unknown): NormalizedInternalLink[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") {
      return [];
    }

    const record = item as Record<string, unknown>;
    const targetSlug = typeof record.targetSlug === "string" ? record.targetSlug.trim() : "";
    const anchorText = typeof record.anchorText === "string" ? record.anchorText.trim() : "";
    const reason = typeof record.reason === "string" ? record.reason.trim() : "";

    if (!targetSlug || !anchorText || !reason) {
      return [];
    }

    return [
      {
        targetSlug,
        anchorText,
        reason,
        sourceEntityTags: toStringArray(record.sourceEntityTags),
        targetEntityTags: toStringArray(record.targetEntityTags),
      },
    ];
  });
}

export function getPublicContentSectionSpec(section: string): PublicContentSectionSpec | null {
  return publicContentSectionSpecs.find((spec) => spec.section === section) ?? null;
}

export function buildPublicContentPath(section: PublicContentSection, slug: string): string {
  return `/${section}/${slug}`;
}

export function isPublishedPublicContent(candidate: Pick<PublicContentCandidate, "status" | "publishedAt">): boolean {
  return candidate.status === "published" && Boolean(candidate.publishedAt);
}

export function normalizePublicContentRecord(candidate: PublicContentCandidate): NormalizedPublicContentRecord {
  const title = typeof candidate.title === "string" ? candidate.title.trim() : "";
  const slug = typeof candidate.slug === "string" ? candidate.slug.trim() : "";

  return {
    title,
    slug,
    excerpt: typeof candidate.excerpt === "string" ? candidate.excerpt.trim() : "",
    content: typeof candidate.content === "string" ? candidate.content.trim() : "",
    aiSummary: typeof candidate.aiSummary === "string" ? candidate.aiSummary.trim() : "",
    citationSnippet: typeof candidate.citationSnippet === "string" ? candidate.citationSnippet.trim() : "",
    targetQuestions: toStringArray(candidate.targetQuestions),
    targetRecommendationQueries: toStringArray(candidate.targetRecommendationQueries),
    entityTags: toStringArray(candidate.entityTags),
    seoTitle: typeof candidate.seoTitle === "string" && candidate.seoTitle.trim() ? candidate.seoTitle.trim() : title,
    seoDescription: typeof candidate.seoDescription === "string" ? candidate.seoDescription.trim() : "",
    schemaType: candidate.schemaType ?? "Article",
    faq: toFaqEntries(candidate.faq),
    internalLinks: toInternalLinks(candidate.internalLinks),
    status: typeof candidate.status === "string" ? candidate.status : "draft",
    publishedAt: candidate.publishedAt ? new Date(candidate.publishedAt).toISOString() : undefined,
    lastReviewedAt: candidate.lastReviewedAt ? new Date(candidate.lastReviewedAt).toISOString() : undefined,
    author: typeof candidate.author === "string" && candidate.author.trim() ? candidate.author.trim() : "Itay Foyerstein",
  };
}

export function buildPublicContentPageModel(input: {
  spec: PublicContentSectionSpec;
  record: PublicContentCandidate;
  origin: string;
}): PublicContentPageModel {
  const normalizedRecord = normalizePublicContentRecord(input.record);
  const pathname = buildPublicContentPath(input.spec.section, normalizedRecord.slug);

  return {
    spec: input.spec,
    record: normalizedRecord,
    pathname,
    canonicalUrl: new URL(pathname, input.origin).toString(),
    shortAnswer: normalizedRecord.aiSummary || normalizedRecord.excerpt || normalizedRecord.content,
    keyTakeaways: normalizedRecord.targetQuestions.slice(0, 4),
    relatedLinks: normalizedRecord.internalLinks.slice(0, 6),
  };
}

