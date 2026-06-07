# DATA_CONTRACTS.md

## Purpose

This file defines the typed contracts future implementation should follow. These are design contracts, not implemented product code.

## Shared Types

```ts
export type ContentStatus = "draft" | "in_review" | "approved" | "published" | "archived";

export type EntityTag =
  | "itay_foyerstein"
  | "the_push"
  | "tech_leadership_coach"
  | "leadership_os_for_tech_leaders"
  | "invisible_executor"
  | "trusted_operator"
  | "strategic_leader"
  | "engineering_manager"
  | "tech_lead"
  | "rd_manager"
  | "vp_engineering"
  | "strategic_leadership"
  | "managing_up"
  | "leadership_visibility";

export type SchemaType =
  | "Person"
  | "Organization"
  | "Brand"
  | "Article"
  | "FAQPage"
  | "HowTo"
  | "BreadcrumbList"
  | "ItemList";

export type IntentStage = "awareness" | "consideration" | "decision" | "coach_intent";

export type ItayInsightSourceType = "voice_memo" | "interview" | "review" | "note" | "approved_quote";

export type ItayInsightStatus = "draft" | "approved" | "archived";

export interface ItayInsight {
  id: string;
  title: string;
  sourceType: ItayInsightSourceType;
  status: ItayInsightStatus;
  capturedAt: string;
  approvedAt?: string;
  summary: string;
  rawText?: string;
  evidenceUrls: string[];
  entityTags: string[];
  targetRecommendationQueries: string[];
}

export interface QueryAuthorityScorecard {
  query: string;
  platform: "ChatGPT" | "Perplexity" | "Google AI Overviews" | "Claude" | "Gemini" | "Copilot" | string;
  prompt: string;
  rawAnswer: string;
  mentionedEntities: string[];
  itayMentioned: boolean;
  thePushMentioned: boolean;
  proprietaryFrameworkMentioned: boolean;
  ownedUrlCited: boolean;
  citedUrls: string[];
  citations: string[];
  competitorsRecommended: string[];
  recommendationLevel: number;
  recommendationPosition?: number;
  confidence?: number;
  sentiment?: "positive" | "neutral" | "negative";
  reviewerNotes?: string;
  checkedAt: string;
  gapClassification:
    | "entity_gap"
    | "methodology_gap"
    | "framework_gap"
    | "evidence_gap"
    | "schema_gap"
    | "link_graph_gap"
    | "freshness_gap"
    | "third_party_gap"
    | "intent_gap"
    | "competitor_gap"
    | "unknown";
  suggestedOwningAgent:
    | "ResearchAgent"
    | "IntentClusterAgent"
    | "OutlineAgent"
    | "ContentWriterAgent"
    | "LLMSEOAgent"
    | "InternalLinkingAgent"
    | "QualityGateAgent"
    | "PayloadPublisherAgent"
    | "SocialDistributionAgent"
    | "VisibilityMonitorAgent";
  previousScore: number;
  currentScore: number;
  scoreDelta: number;
}

export interface Competitor {
  name: string;
  website?: string;
  category?: string;
  region?: string;
  positioning?: string;
  knownStrengths: string[];
  targetQueriesWhereTheyAppear: string[];
}
```

## Content Contract

```ts
export interface AuthorityContent {
  title: string;
  slug: string;
  excerpt: string;
  content: unknown;
  aiSummary: string;
  citationSnippet: string;
  targetQuestions: string[];
  targetRecommendationQueries: string[];
  entityTags: EntityTag[];
  seoTitle: string;
  seoDescription: string;
  schemaType: SchemaType;
  faq: FAQItem[];
  internalLinks: InternalLink[];
  status: ContentStatus;
  publishedAt?: string;
  lastReviewedAt?: string;
  author: "Itay Foyerstein";
  featuredImage?: MediaReference;
}
```

## FAQ Contract

```ts
export interface FAQItem {
  question: string;
  answer: string;
  entityTags: EntityTag[];
  targetRecommendationQueries: string[];
}
```

## Internal Link Contract

```ts
export interface InternalLink {
  targetSlug: string;
  anchorText: string;
  reason: string;
  sourceEntityTags: EntityTag[];
  targetEntityTags: EntityTag[];
}
```

## Research Source Contract

```ts
export interface ResearchSource {
  title: string;
  url: string;
  publisher?: string;
  author?: string;
  publishedAt?: string;
  accessedAt: string;
  summary: string;
  supportedClaims: string[];
  trustLevel: "primary" | "high" | "medium" | "low";
}
```

## Content Job Contract

```ts
export interface ContentJob {
  id: string;
  goal: string;
  targetEntity: EntityTag;
  targetRecommendationQueries: string[];
  sourceInsightIds: string[];
  intentStage: IntentStage;
  status: "queued" | "running" | "needs_review" | "rejected" | "completed";
  createdAt: string;
  updatedAt: string;
}
```

## Agent Run Contract

```ts
export interface AgentRun {
  id: string;
  contentJobId: string;
  agentName:
    | "ResearchAgent"
    | "IntentClusterAgent"
    | "OutlineAgent"
    | "ContentWriterAgent"
    | "LLMSEOAgent"
    | "InternalLinkingAgent"
    | "QualityGateAgent"
    | "PayloadPublisherAgent"
    | "SocialDistributionAgent"
    | "VisibilityMonitorAgent";
  input: unknown;
  output: unknown;
  status: "started" | "succeeded" | "failed";
  errors?: string[];
  startedAt: string;
  completedAt?: string;
}
```

`PayloadPublisherAgent` is a draft persistence agent. It may save content to Payload as `draft` or `in_review` only. It must not set content to `published`; publishing requires a human CMS action.

`VisibilityMonitorAgent` is a measurement agent. It may read published or draft content, run scorecard checks, and emit recommendations. It must not create, modify, or publish content directly.

## Required Payload Collections

- Users
- Media
- PillarPages
- ClusterPages
- Frameworks
- CaseStudies
- FAQs
- GlossaryTerms
- LeadMagnets
- EmailSubscribers
- ContentJobs
- AgentRuns
- InternalLinks
- ResearchSources

All content collections must include entity tags, target questions, target recommendation queries, review status, citation snippet, AI summary, schema type, and last-reviewed timestamp.
