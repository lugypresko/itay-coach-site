import { pageBriefSchema, type PageBrief } from "../agents/agentFactoryContracts";
import { contentDecisionSchema, type ContentDecision } from "./contracts";
import { pagePatterns, type PagePattern } from "./page-patterns";
import type { ContentDecisionVocabulary, VocabularyItem } from "./vocabulary";

function label(items: VocabularyItem[], id: string) {
  return items.find((item) => item.id === id)?.label ?? id;
}

export function contentDecisionToPageBrief(
  decisionInput: ContentDecision,
  vocabulary: ContentDecisionVocabulary,
  options: { title?: string; priorityQueries?: string[]; base?: PageBrief; pattern?: PagePattern } = {},
): PageBrief {
  const decision = contentDecisionSchema.parse(decisionInput);
  const selectedPattern = options.pattern ?? pagePatterns[decision.pagePatternId];
  if (!selectedPattern) throw new Error(`Unknown Page Pattern ${decision.pagePatternId}.`);
  const audience = label(vocabulary.entities, decision.primaryAudienceEntityId);
  const problem = label(vocabulary.problems, decision.primaryProblemId);
  const framework = label(vocabulary.frameworks, decision.primaryFrameworkEntityId);
  const cta = vocabulary.ctas.find((item) => item.id === decision.primaryCtaId);
  if (!cta) throw new Error(`Unknown CTA ${decision.primaryCtaId}.`);

  const contentPlan = selectedPattern.requiredSectionIds.map((sectionId) => ({
    sectionTitle: sectionId,
    purpose: "Cover this structural section using the canonical ContentDecision meaning.",
    proofNeeded: decision.claimIds,
  }));
  const projected = {
    id: `page-brief-${decision.id}-v${decision.decisionVersion}`,
    sourceInsightIds: decision.sourceInsightIds,
    pagePatternId: selectedPattern.id,
    contentArchetype: selectedPattern.contentArchetype,
    title: options.title ?? `${audience}: ${problem}`,
    canonicalPath: decision.canonicalPath,
    reviewStatus: "draft",
    marketContext: {
      summary: `${audience} content decision for ${framework}.`,
      marketMap: [audience, framework],
      trendList: [decision.journeyStage],
      riskNotes: ["Use only claims backed by the decision evidence IDs."],
    },
    audiencePain: {
      summary: problem,
      painThemes: decision.symptomIds,
      workarounds: ["Defaulting to execution instead of changing the operating pattern."],
      triggerEvents: ["The leader becomes the default route for decisions."],
    },
    searchIntent: {
      summary: `${decision.journeyStage} intent for ${audience}.`,
      intentClusters: [decision.primaryProblemId, decision.primaryFrameworkEntityId],
      priorityQueries: options.priorityQueries ?? [decision.canonicalPath],
    },
    topicClusterPosition: {
      summary: `${framework} authority surface.`,
      pillar: "/pillars/tech-leadership-coaching",
      cluster: decision.canonicalPath,
      clusterRole: "canonical decision surface",
      internalLinks: ["/the-push-methodology", "/faq"],
    },
    uniqueAngle: framework,
    proofNeeded: options.base?.proofNeeded ?? decision.claimIds,
    pagePromise: options.base?.pagePromise ?? `Explain ${problem} for ${audience} through ${framework}.`,
    contentPlan: options.base?.contentPlan ?? contentPlan,
    cta: { label: cta.label ?? cta.id, href: cta.href, rationale: `CTA selected by ${decision.primaryCtaId}.` },
    author: "Itay Foyerstein",
  };
  return pageBriefSchema.parse(options.base ? {
    ...projected,
    title: options.title ?? options.base.title,
    author: options.base.author ?? projected.author,
    topicClusterPosition: {
      ...projected.topicClusterPosition,
      summary: options.base.topicClusterPosition.summary,
      clusterRole: options.base.topicClusterPosition.clusterRole,
      internalLinks: options.base.topicClusterPosition.internalLinks,
    },
  } : projected);
}
