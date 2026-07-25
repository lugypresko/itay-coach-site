import { pageBriefSchema, type PageBrief } from "../agents/agentFactoryContracts";
import { contentDecisionSchema, type ContentDecision } from "./contracts";
import type { ContentDecisionVocabulary, VocabularyItem } from "./vocabulary";

function label(items: VocabularyItem[], id: string) {
  return items.find((item) => item.id === id)?.label ?? id;
}

export function contentDecisionToPageBrief(
  decisionInput: ContentDecision,
  vocabulary: ContentDecisionVocabulary,
  options: { title?: string; priorityQueries?: string[] } = {},
): PageBrief {
  const decision = contentDecisionSchema.parse(decisionInput);
  const audience = label(vocabulary.entities, decision.primaryAudienceEntityId);
  const problem = label(vocabulary.problems, decision.primaryProblemId);
  const framework = label(vocabulary.frameworks, decision.primaryFrameworkEntityId);
  const cta = vocabulary.ctas.find((item) => item.id === decision.primaryCtaId);
  if (!cta) throw new Error(`Unknown CTA ${decision.primaryCtaId}.`);

  return pageBriefSchema.parse({
    id: `page-brief-${decision.id}-v${decision.decisionVersion}`,
    sourceInsightIds: decision.sourceInsightIds,
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
    proofNeeded: decision.claimIds,
    pagePromise: `Explain ${problem} for ${audience} through ${framework}.`,
    contentPlan: [{ sectionTitle: "Diagnosis", purpose: problem, proofNeeded: decision.claimIds }],
    cta: { label: cta.label ?? cta.id, href: cta.href, rationale: `CTA selected by ${decision.primaryCtaId}.` },
    author: "Itay Foyerstein",
  });
}
