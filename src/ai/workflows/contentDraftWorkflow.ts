import { evaluateContentGenerationReadiness, validatePageBriefCompliance, type ItayInsight, type PageBriefComplianceResult, type ContentMaturity } from "../governance";
import { evaluateContentQuality, type ContentQualityCandidate, type SemanticQualityEvaluation } from "../governance/content-quality-gate";
import { suggestInternalLinks, type ContentNode, type InternalLinkSuggestion } from "../linking";
import type { ContentGenerationReadiness } from "../governance";
import type { PageBrief } from "../agents";
import type { ContentDecision } from "../content-decision/contracts";
import { contentDecisionVocabulary } from "../content-decision/vocabulary";
import { evaluateContentDecisionGeneration } from "../content-decision/integration-gates";

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
  maturity: ContentMaturity;
}

export interface ContentDraftWorkflowInput {
  job: ContentDraftJob;
  insights: ItayInsight[];
  draft: ContentDraftDraft;
  sourceNode: ContentNode;
  candidateNodes: ContentNode[];
  pageBrief: PageBrief;
  now?: string;
  requiredFreshnessDays?: number;
  semanticQualityEvaluation?: SemanticQualityEvaluation;
  canonicalOwnerPath?: string;
  knownCollidingIntentKeys?: string[];
  contentDecision?: ContentDecision;
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
  compliance: PageBriefComplianceResult | null;
  quality: ReturnType<typeof evaluateContentQuality>;
  linkSuggestions: InternalLinkSuggestion[];
  agentRuns: AgentRunLog[];
  contentMaturity: ContentMaturity;
  saveStatus: "needs_generation" | "needs_revision" | "review_ready" | "blocked";
  draft: ContentDraftDraft | null;
}

export function createContentDraftWorkflow(config?: {
  requiredFreshnessDays?: number;
  requireContentDecision?: boolean;
}) {
  const requiredFreshnessDays = config?.requiredFreshnessDays ?? 30;
  const requireContentDecision = config?.requireContentDecision ?? false;

  return {
    run(input: ContentDraftWorkflowInput): ContentDraftWorkflowResult {
      const readiness = evaluateContentGenerationReadiness({
        insights: input.insights,
        now: input.now,
        requiredFreshnessDays,
      });
      const decisionGate = requireContentDecision
        ? evaluateContentDecisionGeneration({ decision: input.contentDecision, pageBrief: input.pageBrief, vocabulary: contentDecisionVocabulary, now: input.now })
        : null;
      if (decisionGate && !decisionGate.allowed) {
        readiness.canGenerate = false;
        readiness.reason = decisionGate.details.join(" ");
      }

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
          compliance: null,
          quality: {
            decision: "rejected",
            approved: false,
            issues: [],
            reasons: [readiness.reason],
            dimensions: [],
          },
          linkSuggestions: [],
          agentRuns: [
            ...agentRuns,
            {
              agentName: "QualityGateAgent",
              status: "skipped",
              notes: "Content generation blocked by claim-level evidence validation.",
            },
            {
              agentName: "PayloadPublisherAgent",
              status: "skipped",
              notes: "No draft was produced.",
            },
          ],
          contentMaturity: "scaffold",
          saveStatus: "blocked",
          draft: null,
        };
      }

      const compliance = validatePageBriefCompliance(input.pageBrief, input.draft, {
        canonicalOwnerPath: input.canonicalOwnerPath,
        knownCollidingIntentKeys: input.knownCollidingIntentKeys,
      });
      const linkSuggestions = suggestInternalLinks(input.sourceNode, input.candidateNodes);
      const isScaffold = input.draft.maturity === "scaffold";

      if (!compliance.passed || isScaffold) {
        const reasons = compliance.failures.map((failure) => `${failure.code}: ${failure.detail}`);

        return {
          readiness,
          compliance,
          quality: {
            decision: "rejected",
            approved: false,
            issues: [],
            reasons: reasons.length ? reasons : ["Draft remains scaffold-level and is not review-ready."],
            dimensions: [],
          },
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
              status: "skipped",
              notes: "Quality scoring was skipped because hard-gate compliance did not pass.",
            },
            {
              agentName: "PayloadPublisherAgent",
              status: "skipped",
              notes: "No automatic publish is allowed; save status remains needs_generation or needs_revision only.",
            },
          ],
          contentMaturity: input.draft.maturity,
          saveStatus: isScaffold ? "needs_generation" : "needs_revision",
          draft: input.draft,
        };
      }

      const quality = evaluateContentQuality(input.draft, input.semanticQualityEvaluation);
      const saveStatus = quality.approved ? "review_ready" : "needs_revision";
      const reviewedDraft = quality.approved ? { ...input.draft, maturity: "review_ready" as ContentMaturity } : input.draft;

      return {
        readiness,
        compliance,
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
            notes: "No automatic publish is allowed; save status remains review-ready or needs-revision only.",
          },
        ],
        contentMaturity: quality.approved ? "review_ready" : input.draft.maturity,
        saveStatus,
        draft: reviewedDraft,
      };
    },
  };
}
