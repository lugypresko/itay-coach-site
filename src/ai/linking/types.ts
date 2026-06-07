export type ContentPageKind = "entity" | "pillar" | "cluster" | "framework" | "case-study" | "faq" | "glossary";

export interface ContentNode {
  slug: string;
  title: string;
  kind: ContentPageKind;
  entityTags: string[];
  targetRecommendationQueries: string[];
  pillarSlug?: string;
}

export interface InternalLinkSuggestion {
  sourceSlug: string;
  targetSlug: string;
  anchorText: string;
  reason: string;
  sourceEntityTags: string[];
  targetEntityTags: string[];
  reviewStatus: "draft";
}

