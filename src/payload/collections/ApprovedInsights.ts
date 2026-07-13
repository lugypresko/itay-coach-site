import type { CollectionBeforeChangeHook, CollectionConfig, Field } from "payload";

const humanRoles = new Set(["admin", "editor", "human"]);

function roleOf(req: unknown): string | undefined {
  return (req as { user?: { role?: string } | null } | undefined)?.user?.role;
}

function userIdOf(req: unknown): string | undefined {
  return (req as { user?: { id?: string | number } | null } | undefined)?.user?.id?.toString();
}

const enforceApprovedInsightBoundary: CollectionBeforeChangeHook = async ({ data, originalDoc, req }) => {
  const next = { ...(data as Record<string, unknown>) };
  const previous = (originalDoc ?? {}) as Record<string, unknown>;
  const userRole = roleOf(req);
  const isHuman = humanRoles.has(userRole ?? "");

  // Only humans may set or maintain status=approved
  if (next.status === "approved") {
    if (!isHuman) {
      throw new Error("Only an authenticated human role can approve an insight.");
    }

    // Content modification check
    const approvalBoundFields = [
      "sourceTitle",
      "sourceType",
      "summary",
      "claims",
      "evidenceUrls",
      "entityTags",
      "targetQueries",
      "targetRecommendationQueries",
      "sourceUrls",
    ];
    const anyContentChanged = approvalBoundFields.some(
      (field) => JSON.stringify(next[field]) !== JSON.stringify(previous[field]),
    );

    if (anyContentChanged && previous.status === "approved") {
      // Invalidate approval if content is tampered with
      next.status = "needs_review";
      delete next.approvedBy;
      delete next.approvedAt;
    } else {
      // Enforce human identity and system-controlled timing
      next.approvedBy = userIdOf(req) || "human-editor";
      next.approvedAt = new Date().toISOString();
    }
  } else {
    // Agents or unauthenticated callers: Strip any forged approval metadata
    if (!isHuman) {
      delete next.approvedBy;
      delete next.approvedAt;
    }
  }

  return next;
};

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

const claimField: Field = {
  name: "claims",
  type: "array",
  fields: [
    { name: "text", type: "textarea", required: true },
    arrayTextField("evidenceUrls"),
    arrayTextField("targetQueries", true),
    arrayTextField("targetEntities", true),
  ],
};

export const ApprovedInsights: CollectionConfig = {
  slug: "approved_insights",
  labels: {
    singular: "Approved Insight",
    plural: "Approved Insights",
  },
  admin: {
    description: "Payload-managed approved Itay insights that authorize future factory output.",
    useAsTitle: "sourceTitle",
  },
  access: {
    create: () => true, // Hook blocks status=approved
    read: () => true,
    update: () => true, // Hook blocks status=approved
    delete: () => false,
  },
  hooks: {
    beforeChange: [enforceApprovedInsightBoundary],
  },
  timestamps: true,
  fields: [
    { name: "sourceInsightId", type: "text", required: true, unique: true, index: true },
    { name: "sourceTitle", type: "text", required: true, index: true },
    {
      name: "sourceType",
      type: "select",
      required: true,
      options: ["voice_memo", "interview", "review", "note", "approved_quote"],
      index: true,
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "needs_review",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Needs Review", value: "needs_review" },
        { label: "Approved", value: "approved" },
        { label: "Archived", value: "archived" },
      ],
      index: true,
    },
    { name: "capturedAt", type: "date", required: true, index: true },
    { name: "approvedAt", type: "date", required: true, index: true },
    { name: "approvedBy", type: "text", required: true, index: true },
    { name: "freshnessExpiresAt", type: "date", required: true, index: true },
    { name: "summary", type: "textarea", required: true },
    { name: "rawText", type: "textarea" },
    claimField,
    arrayTextField("evidenceUrls"),
    arrayTextField("entityTags", true),
    arrayTextField("targetQueries", true),
    arrayTextField("targetRecommendationQueries"),
    arrayTextField("sourceUrls"),
    { name: "authorityPurpose", type: "textarea" },
    { name: "linkedContentJobId", type: "text", index: true },
    { name: "reviewerNotes", type: "textarea" },
  ],
};
