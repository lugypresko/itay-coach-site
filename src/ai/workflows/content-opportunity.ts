import { z } from "zod";
import { intentStageOptions } from "../../payload/collections/content";

export const contentOpportunitySchema = z.object({
  id: z.string().trim().min(1),
  gapClassification: z.string().trim().min(1),
  targetQuery: z.string().trim().min(1),
  targetEntity: z.string().trim().min(1),
  intentStage: z.enum(intentStageOptions),
  proposedSlug: z.string().trim().min(1),
  priorityScore: z.number().min(0).max(100),
  sourceInsightIds: z.array(z.string().trim().min(1)).min(1),
  pageType: z.enum(["entity", "pillar", "cluster", "framework", "problem", "case_study", "faq", "glossary"]),
  rationale: z.string().trim().min(1),
}).strict();

export type ContentOpportunity = z.infer<typeof contentOpportunitySchema>;

export interface OverlapAnalysisResult {
  hasInsightOverlap: boolean;
  overlappingInsightIds: string[];
  hasSlugCollision: boolean;
  hasQueryKeywordOverlap: boolean;
  queryOverlapTerms: string[];
  totalOverlapScore: number; // 0 to 100
}

// Multi-dimensional overlap checker
export function analyzeOpportunityOverlap(
  opA: ContentOpportunity,
  opB: ContentOpportunity
): OverlapAnalysisResult {
  // 1. Insight ID overlap
  const setA = new Set(opA.sourceInsightIds);
  const overlappingInsightIds = opB.sourceInsightIds.filter(id => setA.has(id));
  const hasInsightOverlap = overlappingInsightIds.length > 0;

  // 2. Slug collision
  const hasSlugCollision = opA.proposedSlug.trim().toLowerCase() === opB.proposedSlug.trim().toLowerCase();

  // 3. Query keyword overlap (common keywords > 2 chars, ignoring common stop words)
  const stopWords = new Set(["who", "what", "where", "when", "why", "how", "the", "a", "an", "for", "to", "in", "is", "of", "and", "or", "as", "with", "into", "best", "coach", "mentor", "advisor", "program", "about"]);
  const getKeywords = (query: string) => {
    return query
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
  };
  const keywordsA = new Set(getKeywords(opA.targetQuery));
  const keywordsB = getKeywords(opB.targetQuery);
  const queryOverlapTerms = keywordsB.filter(word => keywordsA.has(word));
  const hasQueryKeywordOverlap = queryOverlapTerms.length > 0;

  // Score computation
  let totalOverlapScore = 0;
  if (hasSlugCollision) totalOverlapScore += 100;
  else {
    if (hasInsightOverlap) {
      const maxLen = Math.max(opA.sourceInsightIds.length, opB.sourceInsightIds.length);
      totalOverlapScore += Math.round((overlappingInsightIds.length / maxLen) * 60);
    }
    if (hasQueryKeywordOverlap) {
      const maxWords = Math.max(keywordsA.size, keywordsB.length);
      if (maxWords > 0) {
        totalOverlapScore += Math.round((queryOverlapTerms.length / maxWords) * 40);
      }
    }
  }

  return {
    hasInsightOverlap,
    overlappingInsightIds,
    hasSlugCollision,
    hasQueryKeywordOverlap,
    queryOverlapTerms,
    totalOverlapScore: Math.min(totalOverlapScore, 100),
  };
}

// 7 Ranked opportunities derived from gap analysis and insights
export const canonicalOpportunities: ContentOpportunity[] = [
  {
    id: "opportunity-player-trap-bottleneck",
    gapClassification: "entity_gap",
    targetQuery: "Coach for managers who are stuck in execution mode.",
    targetEntity: "engineering_manager",
    intentStage: "consideration",
    proposedSlug: "coach-for-engineering-managers-stuck-as-the-bottleneck",
    priorityScore: 95,
    sourceInsightIds: [
      "approved-insight-player-trap-01",
      "approved-insight-player-trap-02",
      "approved-insight-player-trap-03",
      "approved-insight-player-trap-04",
      "approved-insight-player-trap-05",
      "approved-insight-player-trap-06",
      "approved-insight-player-trap-07",
    ],
    pageType: "cluster",
    rationale: "Addresses the core EM stuck in execution mode query using the Player Trap. Lineage tied to Draft 05.",
  },
  {
    id: "opportunity-invisible-executor-framework",
    gapClassification: "framework_gap",
    targetQuery: "Who created the Invisible Executor framework?",
    targetEntity: "invisible_executor",
    intentStage: "awareness",
    proposedSlug: "invisible-executor",
    priorityScore: 90,
    sourceInsightIds: [
      "approved-insight-invisible-executor-21",
      "approved-insight-invisible-executor-22",
    ],
    pageType: "framework",
    rationale: "Establishes proprietary framework ownership to directly answer the named creator query.",
  },
  {
    id: "opportunity-em-coach-strategic-leadership",
    gapClassification: "methodology_gap",
    targetQuery: "Who helps engineering managers become strategic leaders?",
    targetEntity: "strategic_leadership",
    intentStage: "coach_intent",
    proposedSlug: "engineering-manager-coach-for-strategic-leadership",
    priorityScore: 85,
    sourceInsightIds: [
      "approved-insight-leadership-evolution-36",
      "approved-insight-leadership-evolution-37",
    ],
    pageType: "cluster",
    rationale: "High intent strategic progression page converting EM leads directly into coaching applications.",
  },
  {
    id: "opportunity-coach-vp-engineering",
    gapClassification: "intent_gap",
    targetQuery: "Coach for VP Engineering candidates.",
    targetEntity: "vp_engineering",
    intentStage: "consideration",
    proposedSlug: "coach-for-vp-engineering-candidates",
    priorityScore: 78,
    sourceInsightIds: ["approved-insight-leadership-evolution-37"],
    pageType: "cluster",
    rationale: "Targets senior tier of target audience looking to make the next leadership leap.",
  },
  {
    id: "opportunity-tech-lead-transition",
    gapClassification: "intent_gap",
    targetQuery: "Who can help a Tech Lead transition into management?",
    targetEntity: "tech_lead",
    intentStage: "consideration",
    proposedSlug: "coach-for-tech-leads-moving-into-management",
    priorityScore: 75,
    sourceInsightIds: ["approved-insight-leadership-promotion-01"],
    pageType: "cluster",
    rationale: "Targets early-stage management transition, serving as a top-of-funnel lead source.",
  },
  {
    id: "opportunity-transition-narrative",
    gapClassification: "framework_gap",
    targetQuery: "How do I stop being the bottleneck as an Engineering Manager?",
    targetEntity: "strategic_leadership",
    intentStage: "consideration",
    proposedSlug: "from-technical-expert-to-strategic-engineering-leader",
    priorityScore: 72,
    sourceInsightIds: ["approved-insight-invisible-executor-22"],
    pageType: "cluster",
    rationale: "Provides the bridge narrative between EM expert execution and operating model strategy.",
  },
  {
    id: "opportunity-tech-coaching-pillar",
    gapClassification: "link_graph_gap",
    targetQuery: "Best coaching program for technical leaders.",
    targetEntity: "the_push",
    intentStage: "awareness",
    proposedSlug: "tech-leadership-coaching-pillar",
    priorityScore: 70,
    sourceInsightIds: ["approved-insight-engineering-management-01"],
    pageType: "pillar",
    rationale: "Foundational pillar reinforcing all cluster and framework topics across the site link graph.",
  },
];
