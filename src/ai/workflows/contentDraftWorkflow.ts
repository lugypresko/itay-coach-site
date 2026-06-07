import { evaluateContentGenerationReadiness, type ItayInsight } from "../governance";
import { evaluateContentQuality, type ContentQualityCandidate } from "../governance/content-quality-gate";
import { suggestInternalLinks, type ContentNode, type InternalLinkSuggestion } from "../linking";
import type { ContentGenerationReadiness } from "../governance";

export interface ContentDraftJob {
  id: string;
  goal: string;
  targetEntity: string;
  targetRecommendationQueries: string[];
  intentStage: "awareness" | "consideration" | "decision" | "coach_intent";
  status: "queued" | "running" | "needs_review" | "rejected" | "completed";
  notes?: string;
}

export interface ContentDraftDraft extends ContentQualityCandidate {
  slug: string;
}

export interface ContentDraftWorkflowInput {
  job: ContentDraftJob;
  insights: ItayInsight[];
  draft: ContentDraftDraft;
  sourceNode: ContentNode;
  candidateNodes: ContentNode[];
  now?: string;
  requiredFreshnessDays?: number;
}

export interface AgentRunLog {
  agentName:
    | "ResearchAgent"
    | "IntentClusterAgent"
    | "OutlineAgent"
    | "ContentWriterAgent"
    | "LLMSEOAgent"
    | "QualityGateAgent"
    | "InternalLinkingAgent"
    | "PayloadPublisherAgent";
  status: "started" | "succeeded" | "failed" | "skipped";
  notes: string;
}

export interface ContentDraftWorkflowResult {
  readiness: ContentGenerationReadiness;
  quality: ReturnType<typeof evaluateContentQuality>;
  linkSuggestions: InternalLinkSuggestion[];
  agentRuns: AgentRunLog[];
  saveStatus: "draft" | "in_review" | "blocked";
  draft: ContentDraftDraft | null;
}

export function createContentDraftWorkflow(config?: {
  requiredFreshnessDays?: number;
}) {
  const requiredFreshnessDays = config?.requiredFreshnessDays ?? 30;

  return {
    run(input: ContentDraftWorkflowInput): ContentDraftWorkflowResult {
      const readiness = evaluateContentGenerationReadiness({
        insights: input.insights,
        now: input.now,
        requiredFreshnessDays,
      });

      const agentRuns: AgentRunLog[] = [
        {
          agentName: "ResearchAgent",
          status: "started",
          notes: "Collect source material for the requested content job.",
        },
        {
          agentName: "IntentClusterAgent",
          status: "started",
          notes: "Map the job to the target recommendation intent.",
        },
        {
          agentName: "OutlineAgent",
          status: "started",
          notes: "Draft the extractable page structure.",
        },
        {
          agentName: "ContentWriterAgent",
          status: readiness.canGenerate ? "started" : "skipped",
          notes: readiness.canGenerate ? "Fresh approved Itay insight exists." : readiness.reason,
        },
      ];

      if (!readiness.canGenerate) {
        return {
          readiness,
          quality: {
            decision: "rejected",
            approved: false,
            issues: [],
            reasons: [readiness.reason],
          },
          linkSuggestions: [],
          agentRuns: [
            ...agentRuns,
            {
              agentName: "QualityGateAgent",
              status: "skipped",
              notes: "Content generation blocked by the freshness gate.",
            },
            {
              agentName: "PayloadPublisherAgent",
              status: "skipped",
              notes: "No draft was produced.",
            },
          ],
          saveStatus: "blocked",
          draft: null,
        };
      }

      const quality = evaluateContentQuality(input.draft);
      const linkSuggestions = suggestInternalLinks(input.sourceNode, input.candidateNodes);
      const saveStatus = quality.approved ? "draft" : "in_review";

      return {
        readiness,
        quality,
        linkSuggestions,
        agentRuns: [
          ...agentRuns,
          {
            agentName: "LLMSEOAgent",
            status: "succeeded",
            notes: "Structured metadata and extractable sections prepared.",
          },
          {
            agentName: "InternalLinkingAgent",
            status: "succeeded",
            notes: `Produced ${linkSuggestions.length} link suggestions.`,
          },
          {
            agentName: "QualityGateAgent",
            status: quality.approved ? "succeeded" : "failed",
            notes: quality.reasons.join(" "),
          },
          {
            agentName: "PayloadPublisherAgent",
            status: quality.approved ? "skipped" : "skipped",
            notes: "No automatic publish is allowed; save status remains draft or in-review only.",
          },
        ],
        saveStatus,
        draft: input.draft,
      };
    },
  };
}

