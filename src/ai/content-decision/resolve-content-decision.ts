import { contentDecisionSchema, type ContentDecision } from "./contracts";
import type { ContentDecisionVocabulary } from "./vocabulary";

export interface ResolvedContentDecision {
  decisionId: string;
  decisionVersion: number;
  canonicalPath: string;
  audienceEntityId: string;
  problemId: string;
  symptomIds: string[];
  frameworkEntityId: string;
  offerId: string;
  ctaId: string;
  journeyStage: ContentDecision["journeyStage"];
  claimIds: string[];
  evidenceIds: string[];
  sourceInsightIds: string[];
}

export function resolveContentDecision(
  decisions: unknown[],
  canonicalPath: string,
  vocabulary: ContentDecisionVocabulary,
): ResolvedContentDecision {
  void vocabulary;
  const matching = decisions
    .map((decision) => contentDecisionSchema.parse(decision))
    .filter((decision) => decision.canonicalPath === canonicalPath && decision.status !== "archived");

  if (matching.length === 0) {
    throw new Error(`No explicit ContentDecision for ${canonicalPath}`);
  }

  if (matching.length > 1) {
    throw new Error(`Multiple active ContentDecisions for ${canonicalPath}`);
  }

  const decision = matching[0];
  return {
    decisionId: decision.id,
    decisionVersion: decision.decisionVersion,
    canonicalPath: decision.canonicalPath,
    audienceEntityId: decision.primaryAudienceEntityId,
    problemId: decision.primaryProblemId,
    symptomIds: [...decision.symptomIds],
    frameworkEntityId: decision.primaryFrameworkEntityId,
    offerId: decision.primaryOfferId,
    ctaId: decision.primaryCtaId,
    journeyStage: decision.journeyStage,
    claimIds: [...decision.claimIds],
    evidenceIds: [...decision.evidenceIds],
    sourceInsightIds: [...decision.sourceInsightIds],
  };
}
