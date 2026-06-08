import type {
  CollectionBeforeChangeHook,
  CollectionConfig,
  Field,
} from "payload";

export const contentStatusOptions = [
  "draft",
  "review",
  "in_review",
  "approved",
  "published",
  "archived",
] as const;

export const entityTagOptions = [
  "itay_foyerstein",
  "the_push",
  "tech_leadership_coach",
  "leadership_os_for_tech_leaders",
  "invisible_executor",
  "trusted_operator",
  "strategic_leader",
  "engineering_manager",
  "tech_lead",
  "rd_manager",
  "vp_engineering",
  "strategic_leadership",
  "managing_up",
  "leadership_visibility",
] as const;

export const schemaTypeOptions = [
  "Person",
  "Organization",
  "Brand",
  "Article",
  "FAQPage",
  "HowTo",
  "BreadcrumbList",
  "ItemList",
] as const;

export const intentStageOptions = ["awareness", "consideration", "decision", "coach_intent"] as const;

export const agentNameOptions = [
  "ResearchAgent",
  "IntentClusterAgent",
  "OutlineAgent",
  "ContentWriterAgent",
  "LLMSEOAgent",
  "InternalLinkingAgent",
  "QualityGateAgent",
  "PayloadPublisherAgent",
  "SocialDistributionAgent",
  "VisibilityMonitorAgent",
] as const;

export const itayInsightSourceTypeOptions = [
  "voice_memo",
  "interview",
  "review",
  "note",
  "approved_quote",
] as const;

export const itayInsightStatusOptions = ["draft", "approved", "archived"] as const;

export const contentCollectionStatusOptions = contentStatusOptions;

const arrayTextField = (name: string, required = false): Field => ({
  name,
  type: "array",
  required,
  fields: [
    {
      name: "value",
      type: "text",
      required: true,
    },
  ],
});

const entityTagArrayField = (name: string): Field => ({
  name,
  type: "array",
  fields: [
    {
      name: "tag",
      type: "select",
      required: true,
      options: [...entityTagOptions],
    },
  ],
});

const faqField: Field = {
  name: "faq",
  type: "array",
  fields: [
    { name: "question", type: "text", required: true },
    { name: "answer", type: "textarea", required: true },
    arrayTextField("entityTags", true),
    arrayTextField("targetRecommendationQueries", true),
  ],
};

const internalLinksField: Field = {
  name: "internalLinks",
  type: "array",
  fields: [
    { name: "targetSlug", type: "text", required: true },
    { name: "anchorText", type: "text", required: true },
    { name: "reason", type: "textarea", required: true },
    arrayTextField("sourceEntityTags", true),
    arrayTextField("targetEntityTags", true),
  ],
};

const preventAgentPublishing: CollectionBeforeChangeHook = async ({ data, originalDoc, req }) => {
  const currentStatus = typeof data?.status === "string" ? data.status : undefined;
  const previousStatus = typeof originalDoc?.status === "string" ? originalDoc.status : undefined;
  const role = typeof req.user === "object" && req.user !== null ? (req.user as { role?: string }).role : undefined;

  if (role === "agent" && currentStatus === "published" && previousStatus !== "published") {
    throw new Error("Agent users cannot publish content.");
  }

  if (currentStatus === "published" && !data.publishedAt) {
    return {
      ...data,
      publishedAt: new Date().toISOString(),
    };
  }

  return data;
};

type AuthorityContentCollectionArgs = {
  slug: string;
  singular: string;
  plural: string;
  description: string;
  schemaType: (typeof schemaTypeOptions)[number];
};

export function buildAuthorityContentCollection({
  slug,
  singular,
  plural,
  description,
  schemaType,
}: AuthorityContentCollectionArgs): CollectionConfig {
  return {
    slug,
    labels: {
      singular,
      plural,
    },
    admin: {
      description,
      useAsTitle: "title",
    },
    access: {
      create: () => true,
      read: () => true,
      update: () => true,
      delete: () => false,
    },
    hooks: {
      beforeChange: [preventAgentPublishing],
    },
    timestamps: true,
    fields: [
      { name: "title", type: "text", required: true, index: true },
      { name: "slug", type: "text", required: true, unique: true, index: true },
      { name: "excerpt", type: "textarea", required: true },
      { name: "content", type: "textarea", required: true },
      { name: "aiSummary", type: "textarea", required: true },
      { name: "citationSnippet", type: "textarea", required: true },
      arrayTextField("evidenceUrls", true),
      arrayTextField("targetQuestions", true),
      arrayTextField("targetRecommendationQueries", true),
      entityTagArrayField("entityTags"),
      { name: "seoTitle", type: "text", required: true },
      { name: "seoDescription", type: "textarea", required: true },
      {
        name: "schemaType",
        type: "select",
        required: true,
        defaultValue: schemaType,
        options: [...schemaTypeOptions],
      },
      faqField,
      internalLinksField,
      {
        name: "status",
        type: "select",
        required: true,
        defaultValue: "draft",
        options: [...contentCollectionStatusOptions],
        index: true,
      },
      { name: "publishedAt", type: "date", index: true },
      { name: "lastReviewedAt", type: "date", index: true },
      {
        name: "author",
        type: "text",
        required: true,
        defaultValue: "Itay Foyerstein",
      },
      {
        name: "featuredImage",
        type: "relationship",
        relationTo: "media",
      },
    ],
  };
}

export function buildInsightCollection(slug: string, singular: string, plural: string, description: string): CollectionConfig {
  return {
    slug,
    labels: {
      singular,
      plural,
    },
    admin: {
      description,
      useAsTitle: "title",
    },
    access: {
      create: () => true,
      read: () => true,
      update: () => true,
      delete: () => false,
    },
    timestamps: true,
    fields: [
      { name: "title", type: "text", required: true, index: true },
      {
        name: "sourceType",
        type: "select",
        required: true,
        options: [...itayInsightSourceTypeOptions],
      },
      {
        name: "status",
        type: "select",
        required: true,
        defaultValue: "draft",
        options: [...itayInsightStatusOptions],
      },
      { name: "capturedAt", type: "date", required: true, index: true },
      { name: "approvedAt", type: "date", index: true },
      { name: "summary", type: "textarea", required: true },
      { name: "rawText", type: "textarea" },
      arrayTextField("evidenceUrls", true),
      entityTagArrayField("entityTags"),
      arrayTextField("targetRecommendationQueries", true),
    ],
  };
}

export function buildResearchSourceCollection(
  slug: string,
  singular: string,
  plural: string,
  description: string,
): CollectionConfig {
  return {
    slug,
    labels: {
      singular,
      plural,
    },
    admin: {
      description,
      useAsTitle: "title",
    },
    access: {
      create: () => true,
      read: () => true,
      update: () => true,
      delete: () => false,
    },
    timestamps: true,
    fields: [
      { name: "title", type: "text", required: true, index: true },
      { name: "url", type: "text", required: true, unique: true, index: true },
      { name: "publisher", type: "text" },
      { name: "author", type: "text" },
      { name: "publishedAt", type: "date", index: true },
      { name: "accessedAt", type: "date", required: true, index: true },
      { name: "summary", type: "textarea", required: true },
      arrayTextField("supportedClaims", true),
      {
        name: "trustLevel",
        type: "select",
        required: true,
        options: ["primary", "high", "medium", "low"],
        defaultValue: "high",
      },
    ],
  };
}

export function buildContentJobCollection(
  slug: string,
  singular: string,
  plural: string,
  description: string,
): CollectionConfig {
  return {
    slug,
    labels: {
      singular,
      plural,
    },
    admin: {
      description,
      useAsTitle: "goal",
    },
    access: {
      create: () => true,
      read: () => true,
      update: () => true,
      delete: () => false,
    },
    timestamps: true,
    fields: [
      { name: "goal", type: "textarea", required: true },
      {
        name: "targetEntity",
        type: "select",
        required: true,
        options: [...entityTagOptions],
      },
      arrayTextField("targetRecommendationQueries", true),
      arrayTextField("sourceInsightIds", true),
      {
        name: "intentStage",
        type: "select",
        required: true,
        options: [...intentStageOptions],
      },
      {
        name: "status",
        type: "select",
        required: true,
        defaultValue: "queued",
        options: ["queued", "running", "needs_review", "rejected", "completed"],
      },
      { name: "notes", type: "textarea" },
    ],
  };
}

export function buildAgentRunCollection(
  slug: string,
  singular: string,
  plural: string,
  description: string,
): CollectionConfig {
  return {
    slug,
    labels: {
      singular,
      plural,
    },
    admin: {
      description,
      useAsTitle: "agentName",
    },
    access: {
      create: () => true,
      read: () => true,
      update: () => true,
      delete: () => false,
    },
    timestamps: true,
    fields: [
      { name: "contentJobId", type: "text", required: true, index: true },
      {
        name: "agentName",
        type: "select",
        required: true,
        options: [...agentNameOptions],
      },
      { name: "input", type: "textarea", required: true },
      { name: "output", type: "textarea", required: true },
      {
        name: "status",
        type: "select",
        required: true,
        options: ["started", "succeeded", "failed"],
      },
      arrayTextField("errors"),
      { name: "startedAt", type: "date", required: true, index: true },
      { name: "completedAt", type: "date", index: true },
    ],
  };
}

export function buildEmailSubscriberCollection(
  slug: string,
  singular: string,
  plural: string,
  description: string,
): CollectionConfig {
  return {
    slug,
    labels: {
      singular,
      plural,
    },
    admin: {
      description,
      useAsTitle: "email",
    },
    access: {
      create: () => true,
      read: () => true,
      update: () => true,
      delete: () => false,
    },
    timestamps: true,
    fields: [
      { name: "email", type: "email", required: true, unique: true, index: true },
      { name: "name", type: "text" },
      {
        name: "status",
        type: "select",
        required: true,
        defaultValue: "subscribed",
        options: ["subscribed", "unsubscribed", "pending"],
      },
      { name: "source", type: "text" },
      arrayTextField("tags"),
    ],
  };
}
