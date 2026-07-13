import type {
  CollectionBeforeChangeHook,
  CollectionConfig,
  Field,
} from "payload";

import {
  serializeAuthorityPublicationRevision,
  validatePublicationApproval,
} from "../../ai/governance/publication-approval";

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

export const authenticatedContentWriteAccess = ({ req }: { req: { user?: unknown } }): boolean => Boolean(req.user);

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

export const humanApprovalField: Field = {
  name: "humanApproval",
  type: "group",
  fields: [
    { name: "approvalTimestamp", type: "date" },
    { name: "approver", type: "text" },
    { name: "approverLimitation", type: "textarea" },
    { name: "contentRevisionHash", type: "text" },
    { name: "publicationRevisionHash", type: "text" },
    { name: "supportingApprovedInsightIds", type: "json" },
    {
      name: "validationResult",
      type: "group",
      fields: [
        { name: "deterministicHardGatesPassed", type: "checkbox" },
        { name: "semanticQualityPassed", type: "checkbox" },
        { name: "failureCodes", type: "json" },
      ],
    },
    {
      name: "publicationScope",
      type: "group",
      fields: [
        { name: "approvedCanonicalPaths", type: "json" },
        { name: "excludedDraftIds", type: "json" },
        { name: "deploymentAuthorized", type: "checkbox" },
        { name: "publicationAuthorized", type: "checkbox" },
      ],
    },
  ],
};

type PublicationGovernanceHookOptions = {
  approvalBoundFields: readonly string[];
  getReaderFacingContent: (record: Record<string, unknown>) => string;
  getPublicationRevision: (record: Record<string, unknown>) => string;
};

export function createPublicationGovernanceHook({
  approvalBoundFields,
  getReaderFacingContent,
  getPublicationRevision,
}: PublicationGovernanceHookOptions): CollectionBeforeChangeHook {
  return async ({ data, originalDoc, req }) => {
    const currentRecord = { ...(originalDoc ?? {}), ...(data ?? {}) } as Record<string, unknown>;
    const currentStatus = typeof currentRecord.status === "string" ? currentRecord.status : undefined;
    const previousStatus = typeof originalDoc?.status === "string" ? originalDoc.status : undefined;
    const role = typeof req.user === "object" && req.user !== null ? (req.user as { role?: string }).role : undefined;
    const isPublishing = currentStatus === "published" && previousStatus !== "published";
    const isLeavingPublished = previousStatus === "published" && currentStatus !== "published";
    const isApproving = currentStatus === "approved" && previousStatus !== "approved";
    const humanApprovalMutated = Object.prototype.hasOwnProperty.call(data, "humanApproval");
    const boundContentChanged =
      previousStatus === "published" &&
      approvalBoundFields.some(
        (field) => Object.prototype.hasOwnProperty.call(data, field) && data[field] !== originalDoc?.[field],
      );

    const isAuthenticatedHuman = role === "admin" || role === "editor" || role === "human";
    const approvalGovernedChange =
      isPublishing || isLeavingPublished || isApproving || humanApprovalMutated || boundContentChanged;

    if (role === "agent" && isPublishing) {
      throw new Error("Agent users cannot publish content.");
    }

    if (role === "agent" && boundContentChanged) {
      throw new Error("Agent users cannot publish or change approval-bound published content.");
    }

    if (approvalGovernedChange && !isAuthenticatedHuman) {
      throw new Error("An authenticated human role is required for approval-governed changes.");
    }

    if (isPublishing || boundContentChanged) {
      const approval = validatePublicationApproval({
        approval: currentRecord.humanApproval,
        title: currentRecord.title,
        content: getReaderFacingContent(currentRecord),
        canonicalUrl: currentRecord.canonicalUrl,
        slug: currentRecord.slug,
        publicationRevision: getPublicationRevision(currentRecord),
      });

      if (!approval.valid) {
        throw new Error(
          isPublishing
            ? "A valid human approval is required before publication."
            : "A valid human approval is required before changing approved published content.",
        );
      }
    }

    if (isPublishing && !currentRecord.publishedAt) {
      return {
        ...data,
        publishedAt: new Date().toISOString(),
      };
    }

    return data;
  };
}

export const enforcePublicationGovernance = createPublicationGovernanceHook({
  approvalBoundFields: [
    "slug",
    "title",
    "excerpt",
    "content",
    "aiSummary",
    "citationSnippet",
    "evidenceUrls",
    "targetQuestions",
    "targetRecommendationQueries",
    "entityTags",
    "seoTitle",
    "seoDescription",
    "schemaType",
    "faq",
    "internalLinks",
    "author",
    "canonicalUrl",
    "humanApproval",
  ],
  getReaderFacingContent: (record) => (typeof record.content === "string" ? record.content : ""),
  getPublicationRevision: serializeAuthorityPublicationRevision,
});

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
      create: authenticatedContentWriteAccess,
      read: () => true,
      update: authenticatedContentWriteAccess,
      delete: () => false,
    },
    hooks: {
      beforeChange: [enforcePublicationGovernance],
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
      { name: "canonicalUrl", type: "text" },
      humanApprovalField,
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
      { name: "leadSource", type: "text" },
      { name: "leadPath", type: "text" },
      { name: "reportToken", type: "text", unique: true, index: true },
      { name: "reportUrl", type: "text" },
      { name: "diagnosisCallUrl", type: "text" },
      { name: "assessmentScore", type: "number", index: true },
      {
        name: "assessmentTier",
        type: "select",
        options: ["trusted-operator", "invisible-executor", "execution-bottleneck"],
        index: true,
      },
      { name: "assessmentResult", type: "textarea" },
      { name: "assessmentAnswers", type: "textarea" },
      {
        name: "pageLanguage",
        type: "select",
        options: ["en", "he"],
        defaultValue: "en",
        index: true,
      },
      {
        name: "resultProfile",
        type: "select",
        options: ["trusted-operator", "invisible-executor", "execution-bottleneck"],
        index: true,
      },
      { name: "resultScore", type: "number", index: true },
      { name: "contentConsentAccepted", type: "checkbox", defaultValue: false, index: true },
      { name: "cookiesConsentAccepted", type: "checkbox", defaultValue: false, index: true },
      { name: "consentAcceptedAt", type: "date", index: true },
      {
        name: "lifecycleStage",
        type: "select",
        options: ["test_completed", "lead_captured", "email_1_sent", "diagnosis_call_requested", "nurture_active"],
        index: true,
      },
      { name: "testCompletedAt", type: "date", index: true },
      { name: "reportRequestedAt", type: "date", index: true },
      { name: "reportViewedAt", type: "date", index: true },
      { name: "diagnosisCallRequestedAt", type: "date", index: true },
      { name: "nurtureSequenceKey", type: "text" },
      { name: "nurtureStep", type: "number", index: true },
      { name: "nurtureLastEmailSlug", type: "text" },
      { name: "nurtureLastEmailId", type: "text" },
      {
        name: "nurtureLastEmailMode",
        type: "select",
        options: ["live", "dry-run"],
      },
      {
        name: "nurtureLastEmailStatus",
        type: "select",
        options: ["live", "dry-run"],
      },
      { name: "nurtureLastEmailSentAt", type: "date", index: true },
      { name: "utmSource", type: "text", index: true },
      { name: "utmMedium", type: "text", index: true },
      { name: "utmCampaign", type: "text", index: true },
      { name: "utmContent", type: "text", index: true },
      { name: "utmTerm", type: "text", index: true },
      arrayTextField("tags"),
    ],
  };
}
