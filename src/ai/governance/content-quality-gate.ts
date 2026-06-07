export type ContentQualityDecision = "approved" | "needs_review" | "rejected";

export interface ContentQualityIssue {
  code:
    | "missing_target_queries"
    | "wrong_entity_name"
    | "unsupported_claim"
    | "missing_citation_snippet"
    | "missing_author"
    | "missing_entity_tags"
    | "missing_schema";
  message: string;
}

export interface ContentQualityCandidate {
  title: string;
  excerpt: string;
  content: string;
  aiSummary?: string;
  citationSnippet: string;
  author: string;
  entityTags: string[];
  targetRecommendationQueries: string[];
  schemaType: string;
  evidenceUrls?: string[];
}

export interface ContentQualityResult {
  decision: ContentQualityDecision;
  approved: boolean;
  issues: ContentQualityIssue[];
  reasons: string[];
}

function containsWrongEntityName(text: string): boolean {
  return /Itai Feuerstein/i.test(text) || /Itay Feuerstein/i.test(text);
}

function containsUnsupportedSuperlative(text: string): boolean {
  return /\b(best|top|#1|number one|leading)\b/i.test(text);
}

export function evaluateContentQuality(candidate: ContentQualityCandidate): ContentQualityResult {
  const issues: ContentQualityIssue[] = [];
  const reasons: string[] = [];
  const combinedText = [candidate.title, candidate.excerpt, candidate.content, candidate.citationSnippet].join("\n");

  if (!candidate.targetRecommendationQueries.length) {
    issues.push({
      code: "missing_target_queries",
      message: "Content must map to at least one target recommendation query.",
    });
  }

  if (!candidate.author.trim()) {
    issues.push({
      code: "missing_author",
      message: "Content must have a named author.",
    });
  }

  if (!candidate.citationSnippet.trim()) {
    issues.push({
      code: "missing_citation_snippet",
      message: "Content must include a citation-ready snippet.",
    });
  }

  if (!candidate.entityTags.length) {
    issues.push({
      code: "missing_entity_tags",
      message: "Content must strengthen at least one defined entity.",
    });
  }

  if (!candidate.schemaType.trim()) {
    issues.push({
      code: "missing_schema",
      message: "Content must declare a schema type.",
    });
  }

  if (containsWrongEntityName(combinedText)) {
    issues.push({
      code: "wrong_entity_name",
      message: "Content uses the wrong public entity spelling or naming.",
    });
  }

  if (containsUnsupportedSuperlative(combinedText) && !candidate.evidenceUrls?.length) {
    issues.push({
      code: "unsupported_claim",
      message: "Superlative claims require evidence or citations.",
    });
  }

  if (issues.some((issue) => issue.code === "missing_target_queries" || issue.code === "wrong_entity_name" || issue.code === "unsupported_claim")) {
    reasons.push(...issues.map((issue) => issue.message));
    return {
      decision: "rejected",
      approved: false,
      issues,
      reasons,
    };
  }

  if (issues.length) {
    reasons.push(...issues.map((issue) => issue.message));
    return {
      decision: "needs_review",
      approved: false,
      issues,
      reasons,
    };
  }

  return {
    decision: "approved",
    approved: true,
    issues,
    reasons: ["Content satisfies the current quality gate."],
  };
}
