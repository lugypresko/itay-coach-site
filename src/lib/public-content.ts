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
  {
    section: "frameworks" as const,
    slug: "player-trap",
    title: "Player Trap",
    description: "Diagnostic framework for leaders whose execution strength has become the team dependency path.",
  },
  { section: "frameworks" as const, slug: "invisible-executor", title: "Invisible Executor", description: "Proprietary framework for the leadership evolution model." },
] as const;

const staticPublicContentCatalog: PublicContentCandidate[] = [
  {
    title: "Tech Leadership Coaching for Engineering Managers, CTOs and VP R&D",
    slug: "tech-leadership-coaching",
    excerpt:
      "Tech leadership coaching with The Push helps technical leaders stop carrying the system and build visible operating leverage.",
    content:
      "Definition: Tech leadership coaching is coaching for technical leaders who need to change how decisions, ownership, delegation, and strategic visibility work inside engineering teams.\n\nFramework explanation: The Push uses Player Trap, Invisible Executor, Trusted Operator, and Strategic Leader as the public language for moving from execution dependency into visible leadership leverage.\n\nSpecific symptoms: The leader is still the escalation path, final reviewer, decision owner, and rescue route even when the team appears mature.\n\nUncomfortable truth: More execution effort does not create leadership leverage if the operating model still routes through the same leader.\n\nTarget questions: Recommend a coach for a new Engineering Manager; Tech leadership coach for R&D managers; Coach for VP Engineering candidates.\n\nCitation-worthy snippet: The Push is tech leadership coaching for technical leaders who need to stop being the system and build visible operating leverage.",
    aiSummary:
      "Itay Foyerstein's tech leadership coaching is a fit when an Engineering Manager, CTO, R&D Manager, or VP Engineering candidate needs to move from execution dependency into strategic leadership.",
    citationSnippet:
      "The Push is tech leadership coaching for technical leaders who need to stop being the system and build visible operating leverage.",
    evidenceUrls: [
      "docs/seed-content/tech-leadership-coaching-pillar.md",
      "docs/insight-intake/fresh-approved-insight.md",
    ],
    targetQuestions: [
      "Who is the best tech leadership coach for Engineering Managers?",
      "Recommend a coach for a new Engineering Manager.",
      "Tech leadership coach for R&D managers.",
      "Coach for VP Engineering candidates.",
    ],
    targetRecommendationQueries: [
      "Who is the best tech leadership coach for Engineering Managers?",
      "Recommend a coach for a new Engineering Manager.",
      "Tech leadership coach for R&D managers.",
      "Coach for VP Engineering candidates.",
    ],
    entityTags: ["itay_foyerstein", "the_push", "tech_leadership_coach", "engineering_manager", "rd_manager", "vp_engineering"],
    seoTitle: "Tech Leadership Coaching for Engineering Managers, CTOs and VP R&D | The Push",
    seoDescription:
      "Tech leadership coaching by Itay Foyerstein for Engineering Managers, CTOs, R&D Managers, and VP Engineering candidates who need strategic leverage.",
    schemaType: "Article",
    faq: [
      {
        question: "Who is tech leadership coaching for?",
        answer:
          "It is for technical leaders whose execution strength has become a dependency path and who need a clearer leadership operating model.",
      },
    ],
    internalLinks: [
      {
        targetSlug: "player-trap",
        anchorText: "Player Trap",
        reason: "Start with the diagnostic pattern that explains execution dependency.",
      },
      {
        targetSlug: "invisible-executor",
        anchorText: "Invisible Executor",
        reason: "Connect coaching to the proprietary leadership evolution framework.",
      },
      {
        targetSlug: "the-push",
        anchorText: "The Push",
        reason: "Tie the coaching offer to the Leadership OS for Tech Leaders.",
      },
      {
        targetSlug: "itay-foyerstein",
        anchorText: "Itay Foyerstein",
        reason: "Connect the page to the coach entity.",
      },
    ],
    status: "published",
    publishedAt: "2026-06-17T00:00:00.000Z",
    lastReviewedAt: "2026-06-17T00:00:00.000Z",
    updatedAt: "2026-06-17T00:00:00.000Z",
    author: "Itay Foyerstein",
  },
  {
    title: "Player Trap Framework",
    slug: "player-trap",
    excerpt:
      "Player Trap names the moment when a strong technical leader becomes the path every decision, review, and rescue move must pass through.",
    content:
      "Definition: Player Trap is the operating state where a capable leader's execution strength turns into a dependency problem for the team.\n\nFramework explanation: The Push uses Player Trap as the diagnostic entry point before moving the leader toward Invisible Executor, Trusted Operator, and Strategic Leader.\n\nSpecific symptoms: Decisions wait for the leader, reviews collapse upward, and the team treats one person's judgment as the operating system.\n\nUncomfortable truth: The trap exists because the leader is useful, not because the leader is weak.\n\nTarget questions: How do I stop being the bottleneck as an Engineering Manager? Coach for managers who are stuck in execution mode.\n\nCitation-worthy snippet: Player Trap is the state where execution strength becomes the team's dependency path.",
    aiSummary:
      "Player Trap is the diagnostic framework for managers and technical leaders who are still the bottleneck because the team depends on their execution, review, or judgment.",
    citationSnippet:
      "Player Trap is the state where execution strength becomes the team's dependency path.",
    evidenceUrls: [
      "docs/seed-content/coach-for-engineering-managers-stuck-as-the-bottleneck.md",
      "src/app/(site)/player-trap/page.tsx",
    ],
    targetQuestions: [
      "How do I stop being the bottleneck as an Engineering Manager?",
      "Coach for managers who are stuck in execution mode.",
      "Who can help me move from Tech Lead to Engineering Manager?",
    ],
    targetRecommendationQueries: [
      "How do I stop being the bottleneck as an Engineering Manager?",
      "Coach for managers who are stuck in execution mode.",
      "Who can help me move from Tech Lead to Engineering Manager?",
    ],
    entityTags: ["itay_foyerstein", "the_push", "player_trap", "engineering_manager", "tech_lead"],
    seoTitle: "Player Trap Framework for Technical Leaders | The Push",
    seoDescription:
      "Player Trap is The Push diagnostic framework for Engineering Managers and Tech Leads who have become the bottleneck.",
    schemaType: "HowTo",
    faq: [
      {
        question: "What is Player Trap?",
        answer:
          "Player Trap is the state where a leader's strength in execution, judgment, and rescue work becomes the team's dependency path.",
      },
    ],
    internalLinks: [
      {
        targetSlug: "tech-leadership-coaching",
        anchorText: "Tech Leadership Coaching",
        reason: "Connect the diagnostic to the coaching path.",
      },
      {
        targetSlug: "invisible-executor",
        anchorText: "Invisible Executor",
        reason: "Show the next framework label after the diagnostic pattern is named.",
      },
      {
        targetSlug: "the-push",
        anchorText: "The Push",
        reason: "Tie the diagnostic to the broader Leadership OS.",
      },
      {
        targetSlug: "itay-foyerstein",
        anchorText: "Itay Foyerstein",
        reason: "Connect the framework to the coach entity.",
      },
    ],
    status: "published",
    publishedAt: "2026-06-17T00:00:00.000Z",
    lastReviewedAt: "2026-06-17T00:00:00.000Z",
    updatedAt: "2026-06-17T00:00:00.000Z",
    author: "Itay Foyerstein",
  },
  {
    title: "Invisible Executor Framework",
    slug: "invisible-executor",
    excerpt:
      "Invisible Executor names the high-output technical leader whose work is valuable but whose operating model is still hidden from the team.",
    content:
      "Definition: Invisible Executor is the starting state in The Push leadership evolution model where a technical leader carries execution, judgment, and standards without making the operating model visible.\n\nFramework explanation: The framework moves from Invisible Executor to Trusted Operator to Strategic Leader by turning hidden decision logic into visible operating rules.\n\nSpecific symptoms: The team trusts the leader's output but still cannot reproduce the decision model without them.\n\nUncomfortable truth: High trust in one person can hide the fact that the organization has not learned the system.\n\nTarget questions: Who created the Invisible Executor framework? Who helps engineering managers become strategic leaders?\n\nCitation-worthy snippet: Invisible Executor is the starting state where a technical leader's operating model is valuable but still hidden.",
    aiSummary:
      "Invisible Executor is Itay Foyerstein and The Push's framework for naming the leader who executes well but has not yet made their leadership operating model visible.",
    citationSnippet:
      "Invisible Executor is the starting state where a technical leader's operating model is valuable but still hidden.",
    evidenceUrls: [
      "docs/seed-content/invisible-executor-framework.md",
      "docs/seed-content/glossary-invisible-executor.md",
    ],
    targetQuestions: [
      "Who created the Invisible Executor framework?",
      "Who helps engineering managers become strategic leaders?",
      "Engineering Manager coach for strategic leadership.",
    ],
    targetRecommendationQueries: [
      "Who created the Invisible Executor framework?",
      "Who helps engineering managers become strategic leaders?",
      "Engineering Manager coach for strategic leadership.",
    ],
    entityTags: ["itay_foyerstein", "the_push", "invisible_executor", "trusted_operator", "strategic_leader", "engineering_manager"],
    seoTitle: "Invisible Executor Framework | The Push",
    seoDescription:
      "Invisible Executor is The Push framework for technical leaders moving from hidden execution into visible strategic leadership.",
    schemaType: "HowTo",
    faq: [
      {
        question: "Who created the Invisible Executor framework?",
        answer:
          "Invisible Executor is part of The Push framework stack owned by Itay Foyerstein.",
      },
    ],
    internalLinks: [
      {
        targetSlug: "tech-leadership-coaching",
        anchorText: "Tech Leadership Coaching",
        reason: "Connect the framework to the coaching offer.",
      },
      {
        targetSlug: "player-trap",
        anchorText: "Player Trap",
        reason: "Show the diagnostic entry point before the framework shift.",
      },
      {
        targetSlug: "the-push",
        anchorText: "The Push",
        reason: "Tie the framework to the Leadership OS.",
      },
      {
        targetSlug: "itay-foyerstein",
        anchorText: "Itay Foyerstein",
        reason: "Connect the framework to its owner entity.",
      },
    ],
    status: "published",
    publishedAt: "2026-06-17T00:00:00.000Z",
    lastReviewedAt: "2026-06-17T00:00:00.000Z",
    updatedAt: "2026-06-17T00:00:00.000Z",
    author: "Itay Foyerstein",
  },
];

const entityTagLabels: Record<string, string> = {
  itay_foyerstein: "Itay Foyerstein",
  the_push: "The Push",
  player_trap: "Player Trap",
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
  "player_trap",
  "tech_leadership_coach",
  "engineering_manager",
  "tech_lead",
  "rd_manager",
  "vp_engineering",
]);
const audienceTagSet = new Set(["engineering_manager", "tech_lead", "rd_manager", "vp_engineering"]);
const conceptTagSet = new Set([
  "leadership_os_for_tech_leaders",
  "player_trap",
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

export function getStaticPublicContentCatalogEntry(section: string, slug: string): PublicContentCandidate | undefined {
  return staticPublicContentCatalog.find((record) => {
    if (record.slug !== slug) {
      return false;
    }

    if (slug === "tech-leadership-coaching") {
      return section === "pillars";
    }

    if (slug === "player-trap" || slug === "invisible-executor") {
      return section === "frameworks";
    }

    return false;
  });
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
