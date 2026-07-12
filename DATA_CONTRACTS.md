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

`Itay Foyerstein` is the canonical Person entity for all authority contracts. Any spelling variants are alias data, not separate entities.

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

## Player Trap Lead Contract

```ts
export type PlayerTrapLanguage = "en" | "he";

export type PlayerTrapTier =
  | "trusted-operator"
  | "invisible-executor"
  | "execution-bottleneck";

export interface PlayerTrapLead {
  email: string;
  name: string;
  status: "subscribed" | "unsubscribed" | "pending";
  source: "player-trap" | "player-trap-he";
  leadSource: "player-trap" | "player-trap-he";
  pageLanguage: PlayerTrapLanguage;
  reportToken: string;
  reportUrl: string;
  diagnosisCallUrl: string;
  assessmentScore: number;
  assessmentTier: PlayerTrapTier;
  assessmentResult: string;
  assessmentAnswers: string;
  resultProfile: PlayerTrapTier;
  resultScore: number;
  contentConsentAccepted: boolean;
  cookiesConsentAccepted: boolean;
  consentAcceptedAt: string;
  lifecycleStage:
    | "test_completed"
    | "lead_captured"
    | "email_1_sent"
    | "diagnosis_call_requested"
    | "nurture_active";
  testCompletedAt: string;
  reportRequestedAt: string;
  reportViewedAt?: string;
  diagnosisCallRequestedAt?: string;
  nurtureSequenceKey: string;
  nurtureStep: number;
  nurtureLastEmailSlug: string;
  nurtureLastEmailId?: string;
  nurtureLastEmailMode?: "live" | "dry-run";
  nurtureLastEmailStatus?: "live" | "dry-run";
  nurtureLastEmailSentAt: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  tags: string[];
}
```

Player Trap leads must not receive a result report until the visitor has completed the scoring diagnostic, provided first name and email, and explicitly accepted both content and cookie consent. Hebrew campaign leads must store `pageLanguage = "he"` and use Hebrew diagnostic questions, answer labels, report labels, and CTA copy.

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

Rule-based content decisions such as schema selection, CTA selection, freshness checks, transition permission, and visibility routing should be handled by deterministic services rather than agent output.

## Agent Factory Contracts

Task 025 defines the contract-only codex-run agent factory. The runtime orchestrator is deferred.

### Approved Insight Contract

```ts
export interface ApprovedInsightClaim {
  text: string;
  evidenceUrls: string[];
  targetQueries: string[];
  targetEntities: string[];
}

export interface ApprovedInsight {
  id: string;
  sourceTitle: string;
  sourceType: ItayInsightSourceType;
  status: "approved";
  capturedAt: string;
  approvedAt: string;
  approvedBy: string;
  freshnessExpiresAt: string;
  summary: string;
  rawText?: string;
  claims: ApprovedInsightClaim[];
  evidenceUrls: string[];
  entityTags: string[];
  targetQueries: string[];
  targetRecommendationQueries?: string[];
  sourceUrls: string[];
  authorityPurpose?: string;
  linkedContentJobId?: string;
  reviewerNotes?: string;
}
```

Approved Insight records must always be approved, must always include an approver and approval timestamp, and must include at least one `targetQuery`. `freshnessExpiresAt` is required so downstream generation can reject stale approval windows.

### KnowledgeAsset Contract

```ts
export interface KnowledgeAsset {
  id: string;
  sourceInsightId: string;
  claimIds: string[];
  targetQueries: string[];
  targetEntities: string[];
  shortAnswer: string;
  reviewStatus: "draft" | "in_review" | "approved" | "rejected";
  title?: string;
  summary?: string;
  evidenceUrls: string[];
  sourceUrls: string[];
  reviewerNotes?: string;
}
```

`KnowledgeAsset` is the canonical output contract for the factory. Agent-authored assets must never enter `published` state. The maximum contract state is `approved`. Human publishing remains a Payload action outside this contract.

### Claim Ledger Contract

```ts
export type ClaimType = "factual" | "research" | "client_outcome" | "framework" | "opinion";

export interface ClaimLedgerEntry {
  id: string;
  claimType: ClaimType;
  claimText: string;
  sourceInsightId: string;
  evidenceUrls: string[];
  targetQueries: string[];
  targetEntities: string[];
  reviewStatus: "draft" | "in_review" | "approved" | "rejected";
  notes?: string;
}

export interface ClaimLedger {
  id: string;
  sourceInsightId: string;
  reviewStatus: "draft" | "in_review" | "approved" | "rejected";
  entries: ClaimLedgerEntry[];
}
```

Claim taxonomy must distinguish factual, research, client outcome, framework, and opinion claims.

### DistributionAsset Contract

```ts
export type DistributionChannel =
  | "linkedin_post"
  | "linkedin_carousel_outline"
  | "email_teaser"
  | "whatsapp_post"
  | "short_video_script"
  | "cta_variant"
  | "retargeting_angle";

export interface DistributionAsset {
  id: string;
  knowledgeAssetId: string;
  channel: DistributionChannel;
  reviewStatus: "draft";
  title: string;
  body: string;
  targetQueries: string[];
  targetEntities: string[];
  promptVersion: string;
  phase: "discovery" | "analysis" | "authoring" | "governance" | "release" | "distribution";
  reviewerNotes?: string;
}
```

Distribution assets are drafts only. They are not auto-published.

### PerformanceSignal Contract

```ts
export type PerformanceSignalType =
  | "ai_mention"
  | "ai_citation"
  | "query_visibility"
  | "page_view"
  | "cta_click"
  | "lead_source"
  | "content_source"
  | "assessment_completion"
  | "diagnosis_call_request"
  | "booked_call"
  | "close_rate";

export interface PerformanceSignal {
  id: string;
  assetId: string;
  signalType: PerformanceSignalType;
  signalState: "observed" | "placeholder";
  observedAt: string;
  source: string;
  value: number;
  unit?: string;
  platform?: string;
  query?: string;
  notes?: string;
}
```

Performance signals must distinguish observed signals from placeholders so future learning work can stay explicit about what is real versus planned.

### AuthorityOutcome Contract

```ts
export type AuthorityOutcomeFocus =
  | "authority_visibility"
  | "content_inventory_health"
  | "content_release_velocity"
  | "lead_pipeline_quality"
  | "player_trap_conversion"
  | "search_visibility_health";

export type AuthorityOutcomeStatus = "healthy" | "watch" | "at_risk" | "blocked";

export interface AuthorityOutcome {
  id: string;
  focus: AuthorityOutcomeFocus;
  title: string;
  status: AuthorityOutcomeStatus;
  summary: string;
  signalIds: string[];
  signals: PerformanceSignal[];
  observedAt: string;
  nextBestAction: string;
  ownerSuggestion?: string;
  reviewerNotes?: string;
}
```

Authority outcomes are the business-level decision layer produced from performance signals. They describe what the system is trying to improve, not which content asset exists. The Chief of Staff Agent must reason over `AuthorityOutcome`, not raw content assets. The Chief of Staff contract is now formalized, but runtime orchestration remains deferred.

### Chief of Staff Agent Contract

```ts
export type ChiefOfStaffActionCategory =
  | "publish_more_evidence"
  | "stop_publishing"
  | "improve_conversion_path"
  | "repair_visibility_gap"
  | "repair_inventory_gap"
  | "refresh_authority_asset"
  | "request_human_review"
  | "tighten_internal_links"
  | "improve_measurement";

export interface ChiefOfStaffTrafficSnapshot {
  sessions?: number;
  users?: number;
  topSource?: string;
  notes?: string;
}

export interface ChiefOfStaffLeadSnapshot {
  totalLeads?: number;
  qualifiedLeads?: number;
  bookedCalls?: number;
  notes?: string;
}

export interface ChiefOfStaffContentInventorySnapshot {
  totalAssets?: number;
  reviewReadyAssets?: number;
  publishedAssets?: number;
  notes?: string;
}

export interface ChiefOfStaffPublishedAssetsSnapshot {
  slugs: string[];
  notes?: string;
}

export interface ChiefOfStaffGscSnapshot {
  queriesTracked?: number;
  impressions?: number;
  clicks?: number;
  notes?: string;
}

export interface ChiefOfStaffPlayerTrapFunnelSnapshot {
  visits?: number;
  completions?: number;
  diagnosisCallRequests?: number;
  bookedCalls?: number;
  notes?: string;
}

export interface ChiefOfStaffInput {
  traffic: ChiefOfStaffTrafficSnapshot;
  leads: ChiefOfStaffLeadSnapshot;
  contentInventory: ChiefOfStaffContentInventorySnapshot;
  publishedAssets: ChiefOfStaffPublishedAssetsSnapshot;
  gsc: ChiefOfStaffGscSnapshot;
  playerTrapFunnel: ChiefOfStaffPlayerTrapFunnelSnapshot;
  authorityOutcomes: AuthorityOutcome[];
  supportingSignals: PerformanceSignal[];
}

export interface ChiefOfStaffRecommendation {
  id: string;
  generatedAt: string;
  primaryOutcomeId: string;
  supportingOutcomeIds: string[];
  nextBestActionCategory: ChiefOfStaffActionCategory;
  nextBestAction: string;
  rationale: string;
  humanOwnerSuggestion?: string;
  supportingSignalIds: string[];
}
```

The Chief of Staff Agent contract is outcome-driven. It receives business snapshots plus `AuthorityOutcome` records and returns a constrained next-best-action recommendation. Runtime orchestration remains deferred until the agent is explicitly implemented.

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
