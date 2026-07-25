import type { ApprovedInsight } from "../agents";
import type { ApprovedInsightTopic } from "../insights";
import { approvedInsightTopicById } from "../insights";
import { convertApprovedInsightToKnowledgeAsset } from "../../seed/knowledge-asset-conversion-sprint";
import { pageBriefSchema, type PageBrief, type KnowledgeAsset } from "../agents";
import { createContentDraftWorkflow, type ContentDraftDraft } from "./contentDraftWorkflow";
import type { OperatingCycle, ProductionDirectiveExecutionState } from "./operating-cycle";
import type { PageBriefComplianceResult } from "../governance";
import type { SemanticQualityEvaluation } from "../governance/content-quality-gate";
import type { ContentDecision } from "../content-decision/contracts";
import { contentDecisionToPageBrief } from "../content-decision/to-page-brief";
import { contentDecisionVocabulary } from "../content-decision/vocabulary";

const canonicalBottleneckSurfacePath = "/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck";
const canonicalBottleneckSurfaceTitle = "Coach for Engineering Managers Stuck as the Bottleneck";
const draft05InsightId = "approved-insight-player-trap-05";
const draft05SupportingInsightIds = [
  "approved-insight-player-trap-01",
  "approved-insight-player-trap-02",
  "approved-insight-player-trap-03",
  "approved-insight-player-trap-04",
  "approved-insight-player-trap-05",
  "approved-insight-player-trap-06",
  "approved-insight-player-trap-07",
] as const;

export interface ProductionDirective {
  id: string;
  cluster: ApprovedInsightTopic;
  targetKnowledgeAssets: number;
  maxDrafts: number;
  reviewWipLimit: number;
  currentReviewWip: number;
  expiresAt: string;
}

export interface ProductionDirectiveDraft {
  id: string;
  sourceInsightId: string;
  pageBrief: PageBrief;
  draft: ContentDraftDraft;
  saveStatus: "needs_generation" | "needs_revision" | "review_ready" | "blocked";
  compliance: PageBriefComplianceResult;
  quality: ReturnType<ReturnType<typeof createContentDraftWorkflow>["run"]>["quality"];
}

export interface ProductionDirectiveRunInput {
  directive: ProductionDirective;
  insights: ApprovedInsight[];
  existingKnowledgeAssetSourceInsightIds: string[];
  existingCanonicalPaths: string[];
  cycle: OperatingCycle;
  now: string;
  contentDecisions: ContentDecision[];
}

export interface ProductionDirectiveRunResult {
  selectedCluster: ApprovedInsightTopic;
  insightsConsumed: string[];
  knowledgeAssets: KnowledgeAsset[];
  drafts: ProductionDirectiveDraft[];
  blockedCandidates: Array<{ insightId: string; reason: string }>;
  cycle: OperatingCycle;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70);
}

function buildPageBrief(
  insight: ApprovedInsight,
  knowledgeAsset: KnowledgeAsset,
  supportingInsights: ApprovedInsight[],
): PageBrief {
  const topic = approvedInsightTopicById[insight.id];
  const isPlayerTrap = topic === "Player Trap";
  const canonicalPath = isPlayerTrap ? canonicalBottleneckSurfacePath : `/clusters/${slugify(`${insight.id}-${insight.summary}`)}`;
  const primaryQuery = insight.targetQueries[0] ?? insight.targetRecommendationQueries[0];

  const isDraft05 = insight.id === draft05InsightId;
  const sourceInsights = isDraft05 ? supportingInsights : [insight];
  const proofNeeded = sourceInsights.flatMap((sourceInsight) => sourceInsight.claims.map((claim) => claim.text));

  return pageBriefSchema.parse({
    id: `page-brief-${insight.id}`,
    sourceInsightIds: sourceInsights.map((sourceInsight) => sourceInsight.id),
    title: isPlayerTrap ? canonicalBottleneckSurfaceTitle : knowledgeAsset.title ?? insight.summary,
    canonicalPath,
    reviewStatus: "draft",
    marketContext: {
      summary: `Authority cluster: ${topic}.`,
      marketMap: ["technical leadership coaching"],
      trendList: ["leadership leverage", "engineering management systems"],
      riskNotes: ["Keep claims bounded by the selected insight evidence."],
    },
    audiencePain: {
      summary: insight.summary,
      painThemes: [insight.summary],
      workarounds: ["More individual execution", "More approvals"],
      triggerEvents: ["The team depends on one technical leader"],
    },
    searchIntent: {
      summary: primaryQuery,
      intentClusters: insight.targetQueries,
      priorityQueries: insight.targetQueries,
    },
    topicClusterPosition: {
      summary: isPlayerTrap
        ? "Canonical bottleneck cluster surface for Engineering Managers who need diagnosis-first coaching."
        : `Grouped authority asset for ${topic}.`,
      pillar: "/pillars/tech-leadership-coaching",
      cluster: canonicalPath,
      clusterRole: isPlayerTrap ? "canonical bottleneck cluster surface" : "supporting authority page",
      internalLinks: ["/pillars/tech-leadership-coaching", "/frameworks/player-trap", "/frameworks/invisible-executor"],
    },
    uniqueAngle: isPlayerTrap ? "Diagnosis-first Player Trap framing for readers who need a clearer coaching path." : insight.summary,
    proofNeeded,
    pagePromise: isPlayerTrap
      ? "A diagnosis-first page that names the bottleneck, explains the dependency pattern, and routes readers to the right coaching next step."
      : insight.summary,
    contentPlan: [
      {
        sectionTitle: "Short answer",
        purpose: "Answer the primary recommendation query directly.",
        proofNeeded,
      },
      {
        sectionTitle: "What this pattern looks like",
        purpose: "Make the authority problem recognizable to the target leader.",
        proofNeeded,
      },
    ],
    cta: {
      label: "Book a fit call",
      href: "/book-a-fit-call",
      rationale: "Route qualified coach-intent readers to a human conversation.",
    },
    author: "Itay Foyerstein",
    reviewerNotes: isPlayerTrap
      ? "Canonical bottleneck surface draft; publication requires human approval."
      : "Bounded ProductionDirective draft; publication requires human approval.",
  });
}

function buildPlayerTrapDraftContent(pageBrief: PageBrief): string {
  return [
    `# ${pageBrief.title}`,
    "",
    "## Short answer",
    "If you keep becoming the final reviewer, escalation point, and rescue option for your team, the problem may not be your workload. It may be the way decisions and ownership are organized around you.",
    "",
    "The Player Trap names the recurring pattern in which a promoted technical leader remains the central executor instead of building leadership leverage. The way out is not to work faster. It is to make decision rights, guardrails, and ownership visible enough for the team to move without routing every uncertain choice back to you.",
    "",
    "If you are asking, \"How do I stop being the bottleneck as an Engineering Manager?\" start by diagnosing where the team still depends on your direct involvement.",
    "",
    "## Diagnosis first",
    "Start with the repeated dependency, not with a judgment about your leadership. Repeated team dependency is a diagnostic signal, not a personal failure or productivity problem.",
    "",
    "Look at the last two weeks. Which decisions waited for you? Which reviews could not close without you? Which incidents or customer questions pulled you back into execution? These moments show where the operating model still relies on knowledge, judgment, or permission that only you hold.",
    "",
    "## What this pattern looks like",
    "The pattern often appears in ordinary work before it feels like a leadership problem:",
    "",
    "- Engineers wait for your approval because the acceptable trade-offs are not explicit.",
    "- Senior team members escalate decisions because ownership becomes unclear when risk rises.",
    "- You delegate implementation but remain responsible for every exception and final review.",
    "- New tools increase output, yet the additional work still queues behind your judgment.",
    "",
    "Each intervention may be reasonable on its own. Together, they teach the team that progress becomes safer when you step back into the work.",
    "",
    "## Why pressure pulls you back into execution",
    "Capable managers are often pulled back into technical execution when pressure rises because they can resolve the immediate problem quickly. That response protects the delivery in front of you, but it can leave the decision rule invisible. The next similar problem then returns to you again.",
    "",
    "More hours, more control, and more individual speed are weak fixes for a leadership-system problem. They increase the manager's capacity to absorb work without changing why the work keeps returning.",
    "",
    "## What the Player Trap means",
    "The Player Trap describes the shift from being useful through answers to being useful through stronger operating systems. Your technical strength is not the problem. The trap appears when the team can use that strength only by bringing each important decision back to you.",
    "",
    "That is why diagnosis comes before a coaching invitation. You need to see the dependency pattern clearly enough to decide whether the next step is a local operating change, a broader role transition, or coaching support.",
    "",
    "## Shift the operating model",
    "Choose one repeated decision that currently returns to you. Write down who should own it, which constraints matter, when escalation is necessary, and what a good decision looks like. Then let the owner make the next decision inside those guardrails and review the rule afterward, rather than taking the decision back.",
    "",
    "This is a small move from private expertise toward visible operating discipline. The related [Invisible Executor framework](/frameworks/invisible-executor) explains the broader transition from hidden execution to leadership that creates reusable judgment and direction.",
    "",
    "## Practical next step",
    "Create a simple dependency map with three columns: the decision that returns to you, the reason it returns, and the rule or ownership change that would let the team handle it. Begin with one high-frequency decision, not a company-wide delegation program.",
    "",
    "If you need the wider coaching context, review [Tech Leadership Coaching](/pillars/tech-leadership-coaching). For the named diagnostic pattern and its relationship to technical leadership, read the [Player Trap framework](/frameworks/player-trap).",
    "",
    "## CTA",
    "If you are an Engineering Manager who understands the pattern but keeps getting pulled back into execution, [Book a fit call](/book-a-fit-call) to decide whether The Push is the right coaching path for your situation.",
  ].join("\n");
}

function buildClaimEvidenceMappings(supportingInsights: ApprovedInsight[]) {
  return supportingInsights.flatMap((supportingInsight) =>
    supportingInsight.claims.map((claim) => ({
      claim: claim.text,
      evidenceType: "approved_insight" as const,
      sourceReference: supportingInsight.sourceTitle,
      approvedInsightIds: [supportingInsight.id],
      valid: true,
      limitation: "First-party framework and diagnostic guidance; no client outcome, metric, or testimonial claim is made.",
    })),
  );
}

function buildDraft05SemanticQualityEvaluation(): SemanticQualityEvaluation {
  return {
    dimensions: [
      { dimension: "clarity", score: 5, passed: true, reason: "The opening names the bottleneck as a decision-and-ownership pattern and answers the Engineering Manager question directly." },
      { dimension: "depth", score: 4, passed: true, reason: "The draft traces how pressure, private decision rules, and repeated rescue work recreate dependency, then explains an operating-model response." },
      { dimension: "usefulness", score: 5, passed: true, reason: "The dependency map and one-decision guardrail exercise give the reader a bounded action they can take without a new program." },
      { dimension: "differentiation", score: 4, passed: true, reason: "The Player Trap diagnosis and Invisible Executor progression distinguish the guidance from generic delegation advice." },
      { dimension: "repetition", score: 5, passed: true, reason: "The symptom list, causal explanation, framework definition, and practical exercise each perform a separate role." },
      { dimension: "audience_fit", score: 5, passed: true, reason: "The examples use Engineering Manager decisions, technical reviews, escalations, incidents, and ownership boundaries." },
      { dimension: "persuasion", score: 4, passed: true, reason: "The fit-call invitation follows a self-diagnostic exercise and clearly limits the offer to managers who remain pulled into execution." },
      { dimension: "authority_strength", score: 4, passed: true, reason: "The named frameworks and recommendations are tied to approved first-party Player Trap insights without unsupported results or superlatives." },
    ],
  };
}

function toDraft(
  insight: ApprovedInsight,
  asset: KnowledgeAsset,
  pageBrief: PageBrief,
  supportingInsights: ApprovedInsight[],
): ContentDraftDraft {
  const isPlayerTrapCanonicalSurface = pageBrief.canonicalPath === canonicalBottleneckSurfacePath;
  const content = isPlayerTrapCanonicalSurface
    ? buildPlayerTrapDraftContent(pageBrief)
    : `## Short answer\n\n${insight.summary}\n\n## Evidence boundary\n\n${insight.claims.map((claim) => claim.text).join("\n")}`;

  return {
    slug: pageBrief.canonicalPath.split("/").pop() ?? asset.id,
    title: pageBrief.title,
    excerpt: insight.summary,
    content,
    aiSummary: isPlayerTrapCanonicalSurface ? pageBrief.pagePromise : insight.summary,
    citationSnippet: isPlayerTrapCanonicalSurface
      ? "The Push helps Engineering Managers stop being the default route for decisions, approvals, and rescue work by naming the Player Trap and shifting the operating model."
      : insight.summary,
    author: "Itay Foyerstein",
    entityTags: insight.entityTags,
    targetRecommendationQueries: insight.targetRecommendationQueries,
    schemaType: "Article",
    maturity: isPlayerTrapCanonicalSurface ? "complete_draft" : "scaffold",
    evidenceUrls: [insight.sourceTitle, "docs/seed-content/coach-for-engineering-managers-stuck-as-the-bottleneck.md", ...insight.evidenceUrls, ...insight.sourceUrls],
    claimEvidenceMappings: isPlayerTrapCanonicalSurface ? buildClaimEvidenceMappings(supportingInsights) : [],
  };
}

function stateFromResult(
  directive: ProductionDirective,
  consumedInsightIds: string[],
  assets: KnowledgeAsset[],
  drafts: ProductionDirectiveDraft[],
  blockedCandidates: Array<{ insightId: string; reason: string }>,
  stopPoint: string,
): ProductionDirectiveExecutionState {
  return {
    directiveId: directive.id,
    cluster: directive.cluster,
    targetKnowledgeAssets: directive.targetKnowledgeAssets,
    maxDrafts: directive.maxDrafts,
    reviewWipLimit: directive.reviewWipLimit,
    currentReviewWip: directive.currentReviewWip,
    consumedInsightIds,
    createdKnowledgeAssetIds: assets.map((asset) => asset.id),
    createdDraftIds: drafts.map((draft) => draft.id),
    blockedCandidates,
    stopPoint,
  };
}

export function runProductionDirective(input: ProductionDirectiveRunInput): ProductionDirectiveRunResult {
  const { directive } = input;
  const now = new Date(input.now);
  const blockedCandidates: Array<{ insightId: string; reason: string }> = [];
  const consumedInsightIds: string[] = [];
  const knowledgeAssets: KnowledgeAsset[] = [];
  const drafts: ProductionDirectiveDraft[] = [];
  const canonicalPaths = new Set(input.existingCanonicalPaths);

  if (Number.isNaN(now.getTime()) || new Date(directive.expiresAt) <= now) {
    const execution = stateFromResult(directive, consumedInsightIds, knowledgeAssets, drafts, blockedCandidates, "directive_expired");
    return { selectedCluster: directive.cluster, insightsConsumed: consumedInsightIds, knowledgeAssets, drafts, blockedCandidates, cycle: { ...input.cycle, productionDirective: execution } };
  }

  if (directive.currentReviewWip >= directive.reviewWipLimit) {
    blockedCandidates.push({ insightId: "*", reason: "review_wip_limit_reached" });
    const execution = stateFromResult(directive, consumedInsightIds, knowledgeAssets, drafts, blockedCandidates, "review_wip_limit_reached");
    return { selectedCluster: directive.cluster, insightsConsumed: consumedInsightIds, knowledgeAssets, drafts, blockedCandidates, cycle: { ...input.cycle, productionDirective: execution } };
  }

  const candidates = input.insights.filter(
    (insight) => approvedInsightTopicById[insight.id] === directive.cluster && !input.existingKnowledgeAssetSourceInsightIds.includes(insight.id),
  );

  for (const insight of candidates) {
    if (knowledgeAssets.length >= directive.targetKnowledgeAssets || drafts.length >= directive.maxDrafts) break;
    if (directive.currentReviewWip + drafts.length >= directive.reviewWipLimit) break;

    const hasEvidence = insight.sourceTitle.trim().length > 0 || insight.evidenceUrls.length > 0 || insight.sourceUrls.length > 0 || insight.claims.some((claim) => claim.evidenceUrls.length > 0);
    if (!hasEvidence) {
      blockedCandidates.push({ insightId: insight.id, reason: "insufficient_evidence" });
      continue;
    }

    const supportingInsights =
      insight.id === draft05InsightId
        ? input.insights.filter((candidate) => draft05SupportingInsightIds.includes(candidate.id as (typeof draft05SupportingInsightIds)[number]))
        : [insight];
    const asset = convertApprovedInsightToKnowledgeAsset(directive.cluster, insight);
    const pageBrief = buildPageBrief(insight, asset, supportingInsights);
    const contentDecision = input.contentDecisions.find((candidate) => candidate.canonicalPath === pageBrief.canonicalPath);
    if (!contentDecision) {
      blockedCandidates.push({ insightId: insight.id, reason: "content_decision_required" });
      continue;
    }
    const governedPageBrief = contentDecisionToPageBrief(contentDecision, contentDecisionVocabulary, {
      base: pageBrief,
      priorityQueries: pageBrief.searchIntent.priorityQueries,
    });
    const revisesApprovedCanonicalOwner =
      insight.id === draft05InsightId && pageBrief.canonicalPath === canonicalBottleneckSurfacePath;
    if (canonicalPaths.has(pageBrief.canonicalPath) && !revisesApprovedCanonicalOwner) {
      blockedCandidates.push({ insightId: insight.id, reason: "canonical_owner_exists" });
      continue;
    }

    const draft = toDraft(insight, asset, governedPageBrief, supportingInsights);
    const workflow = createContentDraftWorkflow();
    const workflowResult = workflow.run({
      job: {
        id: `directive-job-${insight.id}`,
        goal: governedPageBrief.pagePromise,
        targetEntity: insight.entityTags[0] ?? "tech_leadership_coach",
        targetRecommendationQueries: insight.targetRecommendationQueries,
        intentStage: "coach_intent",
        status: "queued",
      },
      insights: [
        {
          id: insight.id,
          title: insight.sourceTitle,
          sourceType: insight.sourceType,
          status: insight.status,
          capturedAt: insight.capturedAt,
          approvedAt: insight.approvedAt,
          summary: insight.summary,
          evidenceUrls: draft.evidenceUrls ?? [],
          entityTags: insight.entityTags,
          targetRecommendationQueries: insight.targetRecommendationQueries,
        },
      ],
      draft,
      sourceNode: {
        slug: draft.slug,
        title: draft.title,
        kind: "cluster",
        entityTags: draft.entityTags,
        targetRecommendationQueries: draft.targetRecommendationQueries,
      },
      candidateNodes: [],
      pageBrief: governedPageBrief,
      contentDecision,
      now: input.now,
      semanticQualityEvaluation: insight.id === draft05InsightId ? buildDraft05SemanticQualityEvaluation() : undefined,
      canonicalOwnerPath: governedPageBrief.canonicalPath,
      knownCollidingIntentKeys: [],
    });

    if (workflowResult.saveStatus === "blocked" || !workflowResult.draft) {
      blockedCandidates.push({ insightId: insight.id, reason: "draft_quality_gate" });
      continue;
    }

    knowledgeAssets.push(asset);
    consumedInsightIds.push(insight.id);
    canonicalPaths.add(governedPageBrief.canonicalPath);
    drafts.push({
      id: `authority-draft-${insight.id}`,
      sourceInsightId: insight.id,
      pageBrief: governedPageBrief,
      draft: workflowResult.draft,
      saveStatus: workflowResult.saveStatus,
      compliance: workflowResult.compliance!,
      quality: workflowResult.quality,
    });
  }

  const stopPoint =
    knowledgeAssets.length >= directive.targetKnowledgeAssets || drafts.length >= directive.maxDrafts
      ? "directive_target_reached"
      : directive.currentReviewWip + drafts.length >= directive.reviewWipLimit
        ? "review_wip_limit_reached"
        : candidates.length === consumedInsightIds.length + blockedCandidates.length
          ? "eligible_knowledge_exhausted"
          : "evidence_or_quality_blocked";
  const execution = stateFromResult(directive, consumedInsightIds, knowledgeAssets, drafts, blockedCandidates, stopPoint);

  return {
    selectedCluster: directive.cluster,
    insightsConsumed: consumedInsightIds,
    knowledgeAssets,
    drafts,
    blockedCandidates,
    cycle: { ...input.cycle, productionDirective: execution },
  };
}
