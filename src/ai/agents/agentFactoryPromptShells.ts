import { z } from "zod";

import {
  agentFactoryAgentNameOptions,
  agentFactoryPhaseOptions,
  type AgentFactoryAgentName,
  type AgentFactoryPhase,
} from "./agentFactoryContracts";

export const agentPromptVersion = "1.0.0" as const;

export const agentPromptShellSchema = z
  .object({
    agentName: z.enum(agentFactoryAgentNameOptions),
    promptVersion: z.literal(agentPromptVersion),
    inputShape: z.array(z.string().min(1)).min(1),
    outputShape: z.array(z.string().min(1)).min(1),
    failureStates: z.array(z.string().min(1)).min(1),
    shell: z.string().min(1),
  })
  .strict();

export type AgentPromptShell = z.infer<typeof agentPromptShellSchema>;

export interface AgentPhaseMetadata {
  phase: AgentFactoryPhase;
  order: number;
  description: string;
}

const commonInputShape = [
  "mission",
  "approvedInsightId",
  "targetQueries",
  "targetEntities",
  "context",
] as const;

const commonOutputShape = [
  "summary",
  "artifacts",
  "reviewStatus",
  "failureStates",
] as const;

function createPromptShell(args: {
  agentName: AgentFactoryAgentName;
  phase: AgentFactoryPhase;
  order: number;
  description: string;
  inputShape?: readonly string[];
  outputShape?: readonly string[];
  failureStates: readonly string[];
}): AgentPromptShell {
  return {
    agentName: args.agentName,
    promptVersion: agentPromptVersion,
    inputShape: [...(args.inputShape ?? commonInputShape)],
    outputShape: [...(args.outputShape ?? commonOutputShape)],
    failureStates: [...args.failureStates],
    shell: [
      `You are ${args.agentName}.`,
      `Phase: ${args.phase}.`,
      `Purpose: ${args.description}.`,
      "Work only from approved inputs.",
      "Do not generate publishable output.",
      "Return review-ready drafts, notes, and explicit failure states only.",
      "Do not call providers or runtime orchestrators.",
    ].join(" "),
  };
}

export const agentPromptShells: Record<AgentFactoryAgentName, AgentPromptShell> = {
  MarketIntelligenceAgent: createPromptShell({
    agentName: "MarketIntelligenceAgent",
    phase: "discovery",
    order: 1,
    description: "Map market structure, competitors, trends, and emerging questions",
    inputShape: ["mission", "approvedInsightId", "targetQueries", "context"],
    outputShape: ["summary", "marketMap", "trendList", "riskNotes", "reviewStatus"],
    failureStates: ["missing market scope", "unsupported trend claim", "no evidence sources"],
  }),
  AudiencePainAgent: createPromptShell({
    agentName: "AudiencePainAgent",
    phase: "discovery",
    order: 2,
    description: "Translate topics into recurring pain, desired state, and emotional triggers",
    inputShape: ["mission", "approvedInsightId", "targetQueries", "targetEntities", "context"],
    outputShape: ["summary", "painThemes", "workarounds", "triggerEvents", "reviewStatus"],
    failureStates: ["one-off anecdote", "no workaround behavior", "pain not recurring"],
  }),
  SearchIntentAgent: createPromptShell({
    agentName: "SearchIntentAgent",
    phase: "analysis",
    order: 3,
    description: "Classify search intent and recommendation readiness",
    inputShape: ["mission", "approvedInsightId", "targetQueries", "context"],
    outputShape: ["summary", "intentClusters", "priorityQueries", "reviewStatus"],
    failureStates: ["intent not classifiable", "query set too broad", "no recommendation angle"],
  }),
  TopicClusterAgent: createPromptShell({
    agentName: "TopicClusterAgent",
    phase: "analysis",
    order: 4,
    description: "Build pillar and cluster architecture with internal linking paths",
    inputShape: ["mission", "approvedInsightId", "targetQueries", "targetEntities", "context"],
    outputShape: ["summary", "clusterMap", "linkPaths", "reviewStatus"],
    failureStates: ["cluster overlap too high", "no pillar structure", "insufficient entity coverage"],
  }),
  ResearchSourceAgent: createPromptShell({
    agentName: "ResearchSourceAgent",
    phase: "discovery",
    order: 5,
    description: "Find sources, claims, statistics, and evidence",
    inputShape: ["mission", "approvedInsightId", "targetQueries", "context"],
    outputShape: ["summary", "sourceList", "claimList", "reviewStatus"],
    failureStates: ["source not current", "claim unsupported", "source quality too weak"],
  }),
  SourceVerificationAgent: createPromptShell({
    agentName: "SourceVerificationAgent",
    phase: "governance",
    order: 6,
    description: "Verify that sources are real, current, relevant, and support the claims",
    inputShape: ["mission", "approvedInsightId", "sourceInsightIds", "context"],
    outputShape: ["summary", "verifiedClaims", "rejectedClaims", "reviewStatus"],
    failureStates: ["source unverifiable", "citation mismatch", "evidence freshness expired"],
  }),
  FrameworkBuilderAgent: createPromptShell({
    agentName: "FrameworkBuilderAgent",
    phase: "authoring",
    order: 7,
    description: "Turn evidence into proprietary frameworks and named models",
    inputShape: ["mission", "approvedInsightId", "sourceInsightIds", "targetEntities", "context"],
    outputShape: ["summary", "frameworkDraft", "namingNotes", "reviewStatus"],
    failureStates: ["framework too generic", "novelty unsupported", "brand language too soft"],
  }),
  OutlineAgent: createPromptShell({
    agentName: "OutlineAgent",
    phase: "authoring",
    order: 8,
    description: "Create structured outlines for article and page drafts",
    inputShape: ["mission", "approvedInsightId", "targetQueries", "context"],
    outputShape: ["summary", "outline", "sectionMap", "reviewStatus"],
    failureStates: ["outline too broad", "section order unclear", "missing target question coverage"],
  }),
  ContentWriterAgent: createPromptShell({
    agentName: "ContentWriterAgent",
    phase: "authoring",
    order: 9,
    description: "Write draft content in the house voice",
    inputShape: ["mission", "approvedInsightId", "outlineId", "context"],
    outputShape: ["summary", "draft", "rewriteNotes", "reviewStatus"],
    failureStates: ["voice drift", "unsupported claim", "draft too promotional"],
  }),
  LLMCitationAgent: createPromptShell({
    agentName: "LLMCitationAgent",
    phase: "governance",
    order: 10,
    description: "Add short answers, definition blocks, citation snippets, FAQs, and quotable blocks",
    inputShape: ["mission", "approvedInsightId", "draftId", "context"],
    outputShape: ["summary", "citationBlocks", "faqBlocks", "reviewStatus"],
    failureStates: ["citation unsupported", "snippet too long", "FAQ not answer-intent aligned"],
  }),
  InternalLinkingAgent: createPromptShell({
    agentName: "InternalLinkingAgent",
    phase: "governance",
    order: 11,
    description: "Suggest internal links, anchor text, and entity connections",
    inputShape: ["mission", "approvedInsightId", "draftId", "context"],
    outputShape: ["summary", "linkSuggestions", "entityConnections", "reviewStatus"],
    failureStates: ["link target irrelevant", "anchor text weak", "entity mismatch"],
  }),
  SchemaAgent: createPromptShell({
    agentName: "SchemaAgent",
    phase: "governance",
    order: 12,
    description: "Generate schema recommendations for the draft",
    inputShape: ["mission", "approvedInsightId", "draftId", "context"],
    outputShape: ["summary", "schemaRecommendations", "reviewStatus"],
    failureStates: ["schema not supported", "schema duplicates content", "schema type unclear"],
  }),
  BrandVoiceAgent: createPromptShell({
    agentName: "BrandVoiceAgent",
    phase: "governance",
    order: 13,
    description: "Reject generic language and enforce sharp brand positioning",
    inputShape: ["mission", "approvedInsightId", "draftId", "context"],
    outputShape: ["summary", "voiceEdits", "rejectedPhrases", "reviewStatus"],
    failureStates: ["brand voice too generic", "positioning too soft", "category language drift"],
  }),
  QualityGateAgent: createPromptShell({
    agentName: "QualityGateAgent",
    phase: "governance",
    order: 14,
    description: "Score usefulness, originality, support, structure, citation-worthiness, and conversion relevance",
    inputShape: ["mission", "approvedInsightId", "draftId", "context"],
    outputShape: ["summary", "qualityScorecard", "requiredFixes", "reviewStatus"],
    failureStates: ["quality threshold missed", "unsupported facts", "conversion relevance weak"],
  }),
  PayloadPublisherAgent: createPromptShell({
    agentName: "PayloadPublisherAgent",
    phase: "release",
    order: 15,
    description: "Save only draft and review-ready content into Payload",
    inputShape: ["mission", "approvedInsightId", "draftId", "context"],
    outputShape: ["summary", "payloadDraftPlan", "publishBlockers", "reviewStatus"],
    failureStates: ["published state requested", "payload write not review-ready", "human approval missing"],
  }),
  DistributionAgent: createPromptShell({
    agentName: "DistributionAgent",
    phase: "distribution",
    order: 16,
    description: "Create distribution assets such as social posts, emails, and short-form scripts",
    inputShape: ["mission", "approvedInsightId", "draftId", "context"],
    outputShape: ["summary", "distributionAssets", "ctaVariants", "reviewStatus"],
    failureStates: ["distribution asset not traceable", "channel mismatch", "asset looks publish-ready without review"],
  }),
};

export const agentPhaseMetadata: Record<AgentFactoryAgentName, AgentPhaseMetadata> = {
  MarketIntelligenceAgent: { phase: "discovery", order: 1, description: "Market structure and trend discovery" },
  AudiencePainAgent: { phase: "discovery", order: 2, description: "Audience pain and trigger discovery" },
  SearchIntentAgent: { phase: "analysis", order: 3, description: "Intent classification and query framing" },
  TopicClusterAgent: { phase: "analysis", order: 4, description: "Pillar and cluster architecture" },
  ResearchSourceAgent: { phase: "discovery", order: 5, description: "Source and evidence discovery" },
  SourceVerificationAgent: { phase: "governance", order: 6, description: "Claim and source verification" },
  FrameworkBuilderAgent: { phase: "authoring", order: 7, description: "Framework and model creation" },
  OutlineAgent: { phase: "authoring", order: 8, description: "Content structure and section planning" },
  ContentWriterAgent: { phase: "authoring", order: 9, description: "Draft writing" },
  LLMCitationAgent: { phase: "governance", order: 10, description: "Citation and answer block generation" },
  InternalLinkingAgent: { phase: "governance", order: 11, description: "Internal linking and entity graph wiring" },
  SchemaAgent: { phase: "governance", order: 12, description: "Schema recommendation" },
  BrandVoiceAgent: { phase: "governance", order: 13, description: "Brand voice enforcement" },
  QualityGateAgent: { phase: "governance", order: 14, description: "Quality scoring and blocking" },
  PayloadPublisherAgent: { phase: "release", order: 15, description: "Draft persistence only" },
  DistributionAgent: { phase: "distribution", order: 16, description: "Distribution asset creation" },
};

export function getAgentPromptShell(agentName: AgentFactoryAgentName): AgentPromptShell {
  return agentPromptShells[agentName];
}
