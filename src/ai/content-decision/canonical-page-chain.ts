import type { PageBrief } from "../agents/agentFactoryContracts";
import {
  createReaderFacingArtifactDraft,
  type ReaderFacingPageArtifact,
} from "../../domain/reader-facing-page-artifact";
import {
  contentDecisionArtifactProvenanceSchema,
  type ContentDecisionArtifactProvenance,
} from "../governance/reader-facing-artifact-governance";
import { contentDecisionSchema, type ContentDecision } from "./contracts";
import { contentDecisionToPageBrief } from "./to-page-brief";
import { validateContentDecision } from "./validate-content-decision";
import type { ContentDecisionVocabulary } from "./vocabulary";

export function revalidateContentDecision(
  input: ContentDecision,
  options: { vocabulary: ContentDecisionVocabulary; validatedAt: string },
): ContentDecision {
  const parsed = contentDecisionSchema.parse(input);
  const validation = validateContentDecision(parsed, {
    vocabulary: options.vocabulary,
    now: options.validatedAt,
  });
  if (!validation.valid) {
    throw new Error(`ContentDecision ${parsed.id} cannot be revalidated: ${validation.details.join(" ")}`);
  }

  return contentDecisionSchema.parse({
    ...parsed,
    lastValidatedAt: options.validatedAt,
    validationStatus: "valid",
  });
}

export interface CanonicalContentChain {
  decision: ContentDecision;
  pageBrief: PageBrief;
  historicalPageBrief: PageBrief;
}

export function buildCanonicalContentChain(input: {
  decision: ContentDecision;
  historicalPageBrief: PageBrief;
  vocabulary: ContentDecisionVocabulary;
}): CanonicalContentChain {
  if (input.decision.canonicalPath !== input.historicalPageBrief.canonicalPath) {
    throw new Error("Historical PageBrief and ContentDecision canonical paths must match.");
  }

  const pageBrief = contentDecisionToPageBrief(input.decision, input.vocabulary, {
    title: "Engineering Manager Coach",
    priorityQueries: [
      "Engineering Manager coach",
      "How do I stop being the bottleneck as an Engineering Manager?",
      "Who helps engineering managers become strategic leaders?",
    ],
  });

  return {
    decision: input.decision,
    pageBrief,
    historicalPageBrief: input.historicalPageBrief,
  };
}

type HistoricalAuthorityPage = {
  title: string;
  description: string;
  shortAnswer: string;
  definitionTitle: string;
  definitionBody: string;
  frameworkTitle: string;
  frameworkBody: string;
  frameworkSteps: string[];
  symptomsTitle: string;
  symptoms: string[];
  uncomfortableTruthTitle: string;
  uncomfortableTruth: string;
  citationSnippet: string;
  relatedLinks: Array<{ href: string; label: string }>;
};

export function generateEngineeringManagerCoachArtifact(input: {
  chain: CanonicalContentChain;
  historicalPage: HistoricalAuthorityPage;
  createdAt: string;
}): ReaderFacingPageArtifact {
  const { chain, historicalPage } = input;
  const links = historicalPage.relatedLinks
    .filter((link) => link.href !== chain.decision.canonicalPath)
    .map(({ href, label }) => ({ href, label }));

  return createReaderFacingArtifactDraft({
    artifactId: "artifact-engineering-manager-coach",
    artifactVersion: chain.decision.decisionVersion,
    schemaVersion: "1.0.0",
    createdAt: input.createdAt,
    pageType: "cluster",
    canonicalPath: chain.decision.canonicalPath,
    locale: "en",
    title: historicalPage.title,
    description: historicalPage.description,
    body: [
      { sectionId: "answer", heading: "Engineering Manager coaching", paragraphs: [historicalPage.shortAnswer] },
      { sectionId: "role-context", heading: historicalPage.definitionTitle, paragraphs: [historicalPage.definitionBody] },
      { sectionId: "symptoms", heading: historicalPage.symptomsTitle, bullets: historicalPage.symptoms },
      {
        sectionId: "mechanism",
        heading: historicalPage.frameworkTitle,
        paragraphs: [historicalPage.frameworkBody],
        bullets: historicalPage.frameworkSteps,
      },
      { sectionId: "next-step", heading: historicalPage.uncomfortableTruthTitle, paragraphs: [historicalPage.uncomfortableTruth] },
      { sectionId: "why-help", heading: "Why The Push", paragraphs: [historicalPage.citationSnippet] },
      {
        sectionId: "cta",
        heading: "A practical next step",
        paragraphs: ["If this pattern is familiar, a fit call can help you decide what needs to change first."],
      },
    ],
    primaryCta: {
      label: "Book a fit call",
      href: "/book-a-fit-call",
      context: "Discuss the operating change that will help you lead beyond execution bottlenecks.",
    },
    internalLinks: links,
    seo: { title: historicalPage.title, description: historicalPage.description },
    structuredDataInput: { type: "Article", authorName: "Itay Foyerstein" },
  });
}

export function buildEngineeringManagerCoachArtifactProvenance(input: {
  artifact: ReaderFacingPageArtifact;
  chain: CanonicalContentChain;
  generatedAt: string;
}): ContentDecisionArtifactProvenance {
  return contentDecisionArtifactProvenanceSchema.parse({
    artifactId: input.artifact.artifactId,
    artifactVersion: input.artifact.artifactVersion,
    artifactHash: input.artifact.artifactHash,
    pageBriefId: input.chain.pageBrief.id,
    contentDecisionId: input.chain.decision.id,
    contentDecisionVersion: input.chain.decision.decisionVersion,
    generationMode: "deterministic",
    sourceApprovedInsightIds: input.chain.decision.sourceInsightIds,
    generatedAt: input.generatedAt,
  });
}
