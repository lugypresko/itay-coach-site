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
  evidenceUrls: string[];
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
  updatedAt?: string;
  author: string;
}

export interface PublicAuthorityEvidenceSignals {
  sourceType: string;
  evidenceUrls: string[];
  evidenceCount: number;
  citationSnippet: string;
}

export interface PublicAuthorityReviewSignals {
  reviewedBy: string;
  reviewDate?: string;
  lastUpdated?: string;
  status: string;
}

export interface PublicAuthorityEntityContextSignals {
  relatedEntities: string[];
  relatedMethodology?: string;
  relatedFramework?: string;
  audienceServed: string[];
}

export interface PublicAuthorityRecommendationIntentSignals {
  targetRecommendationQueries: string[];
  authorityIntentExplanation: string;
}

export interface PublicAuthorityRelatedAuthoritySignals {
  relatedPages: NormalizedInternalLink[];
  relatedEntities: string[];
  relatedConcepts: string[];
}

export interface PublicAuthorityTrustSignals {
  evidence: PublicAuthorityEvidenceSignals;
  review: PublicAuthorityReviewSignals;
  entityContext: PublicAuthorityEntityContextSignals;
  recommendationIntent: PublicAuthorityRecommendationIntentSignals;
  relatedAuthority: PublicAuthorityRelatedAuthoritySignals;
}

export interface PublicContentPageModel {
  spec: PublicContentSectionSpec;
  record: NormalizedPublicContentRecord;
  pathname: string;
  canonicalUrl: string;
  shortAnswer: string;
  keyTakeaways: string[];
  relatedLinks: NormalizedInternalLink[];
  trustSignals: PublicAuthorityTrustSignals;
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
  evidenceUrls?: unknown;
  seoTitle?: string;
  seoDescription?: string;
  schemaType?: SchemaType;
  faq?: unknown;
  internalLinks?: unknown;
  status?: string;
  publishedAt?: string | Date | null;
  lastReviewedAt?: string | Date | null;
  updatedAt?: string | Date | null;
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
  {
    section: "pillars" as const,
    slug: "tech-leadership-coaching",
    title: "Tech Leadership Coaching for Engineering Managers, CTOs and VP R&D",
    description: "Authority page for recommendation-intent queries across technical leadership roles.",
  },
  { section: "frameworks" as const, slug: "invisible-executor", title: "Invisible Executor", description: "Proprietary framework for the leadership evolution model." },
] as const;

const entityTagLabels: Record<string, string> = {
  itay_foyerstein: "Itay Foyerstein",
  the_push: "The Push",
  tech_leadership_coach: "Tech Leadership Coach",
  leadership_os_for_tech_leaders: "Leadership OS for Tech Leaders",
  invisible_executor: "Invisible Executor",
  trusted_operator: "Trusted Operator",
  strategic_leader: "Strategic Leader",
  engineering_manager: "Engineering Manager",
  tech_lead: "Tech Lead",
  rd_manager: "R&D Manager",
  vp_engineering: "VP Engineering",
  strategic_leadership: "Strategic Leadership",
  managing_up: "Managing Up",
  leadership_visibility: "Leadership Visibility",
};

const concreteEntityTagSet = new Set([
  "itay_foyerstein",
  "the_push",
  "tech_leadership_coach",
  "engineering_manager",
  "tech_lead",
  "rd_manager",
  "vp_engineering",
]);
const audienceTagSet = new Set(["engineering_manager", "tech_lead", "rd_manager", "vp_engineering"]);
const conceptTagSet = new Set([
  "leadership_os_for_tech_leaders",
  "invisible_executor",
  "trusted_operator",
  "strategic_leader",
  "strategic_leadership",
  "managing_up",
  "leadership_visibility",
]);

function labelForEntityTag(tag: string): string {
  return entityTagLabels[tag] ?? tag.replace(/_/g, " ");
}

function classifyEvidenceSourceType(evidenceUrls: string[]): string {
  if (evidenceUrls.some((url) => url.includes("fresh-approved-insight.md"))) {
    return "approved Itay insight";
  }

  if (evidenceUrls.some((url) => url.includes("/seed-content/"))) {
    return "manual source document";
  }

  if (evidenceUrls.some((url) => url.includes("cto_seo_llm_insights.md"))) {
    return "research source";
  }

  return "reference source";
}

function getRelatedAuthorityPageTitle(slug: string): string | undefined {
  return canonicalAuthorityPages.find((page) => page.slug === slug)?.title;
}

function getRelatedAuthorityPageReason(slug: string): string {
  return canonicalAuthorityPages.find((page) => page.slug === slug)?.description ?? "";
}

function deriveRelatedEntities(values: string[]): string[] {
  return values.filter((value) => concreteEntityTagSet.has(value)).map(labelForEntityTag);
}

function deriveAudienceServed(values: string[]): string[] {
  return values.filter((value) => audienceTagSet.has(value)).map(labelForEntityTag);
}

function deriveConcepts(values: string[]): string[] {
  return values.filter((value) => conceptTagSet.has(value)).map(labelForEntityTag);
}

function deriveRelatedLinks(internalLinks: NormalizedInternalLink[]): NormalizedInternalLink[] {
  return internalLinks.filter((link) => getRelatedAuthorityPageTitle(link.targetSlug) !== undefined);
}

function buildAuthorityTrustSignals(record: NormalizedPublicContentRecord): PublicAuthorityTrustSignals {
  const relatedLinks = deriveRelatedLinks(record.internalLinks);
  const relatedPages = relatedLinks.map((link) => ({
    ...link,
    anchorText: getRelatedAuthorityPageTitle(link.targetSlug) ?? link.anchorText,
    reason: link.reason || getRelatedAuthorityPageReason(link.targetSlug),
  }));
  const relatedEntities = deriveRelatedEntities(record.entityTags);
  const relatedConcepts = deriveConcepts(record.entityTags);
  const relatedMethodology = relatedPages.find((link) => link.targetSlug === "the-push")?.anchorText;
  const relatedFramework = relatedPages.find((link) => link.targetSlug === "invisible-executor")?.anchorText;

  return {
    evidence: {
      sourceType: classifyEvidenceSourceType(record.evidenceUrls),
      evidenceUrls: [...record.evidenceUrls],
      evidenceCount: record.evidenceUrls.length,
      citationSnippet: record.citationSnippet,
    },
    review: {
      reviewedBy: record.author,
      reviewDate: record.lastReviewedAt,
      lastUpdated: record.updatedAt ?? record.lastReviewedAt ?? record.publishedAt,
      status: record.status,
    },
    entityContext: {
      relatedEntities,
      relatedMethodology,
      relatedFramework,
      audienceServed: deriveAudienceServed(record.entityTags),
    },
    recommendationIntent: {
      targetRecommendationQueries: [...record.targetRecommendationQueries],
      authorityIntentExplanation:
        record.aiSummary || record.excerpt || `This page supports ${record.targetRecommendationQueries.length} recommendation-intent query target(s).`,
    },
    relatedAuthority: {
      relatedPages,
      relatedEntities,
      relatedConcepts,
    },
  };
}

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

export function isRenderablePublicContent(candidate: Pick<PublicContentCandidate, "status" | "publishedAt">): boolean {
  return candidate.status === "published" || candidate.status === "review";
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
    evidenceUrls: toStringArray(candidate.evidenceUrls),
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
    updatedAt: candidate.updatedAt ? new Date(candidate.updatedAt).toISOString() : undefined,
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
    trustSignals: buildAuthorityTrustSignals(normalizedRecord),
  };
}
