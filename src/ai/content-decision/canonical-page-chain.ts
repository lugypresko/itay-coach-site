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
import { pagePatterns, validateArtifactAgainstPagePattern, validatePagePatternDecision, type PagePattern } from "./page-patterns";
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
  pagePattern: PagePattern;
}

export function buildCanonicalContentChain(input: {
  decision: ContentDecision;
  historicalPageBrief: PageBrief;
  vocabulary: ContentDecisionVocabulary;
}): CanonicalContentChain {
  if (input.decision.canonicalPath !== input.historicalPageBrief.canonicalPath) {
    throw new Error("Historical PageBrief and ContentDecision canonical paths must match.");
  }
  const patternValidation = validatePagePatternDecision(input.decision);
  if (!patternValidation.valid) {
    throw new Error(`ContentDecision ${input.decision.id} has an invalid Page Pattern: ${patternValidation.details.join(" ")}`);
  }
  const pagePattern = pagePatterns[input.decision.pagePatternId];

  const pageBrief = contentDecisionToPageBrief(input.decision, input.vocabulary, {
    pattern: pagePattern,
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
    pagePattern,
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

  const artifact = createReaderFacingArtifactDraft({
    artifactId: "artifact-engineering-manager-coach",
    artifactVersion: 3,
    schemaVersion: "1.0.0",
    createdAt: input.createdAt,
    pageType: "cluster",
    canonicalPath: chain.decision.canonicalPath,
    locale: "en",
    title: "Stop Being the Bottleneck as an Engineering Manager",
    description: "Build a team that can make progress without waiting for you to approve every important decision.",
    body: [
      {
        sectionId: "answer",
        heading: "Lead beyond execution bottlenecks",
        paragraphs: ["Engineering Manager coaching helps you move from being the final reviewer and escalation path to leading a team that can make sound decisions without waiting for you."],
      },
      {
        sectionId: "role-context",
        heading: "The problem is not that you care too much",
        paragraphs: ["You were promoted because you could solve hard technical problems. The same habit becomes a constraint when every review, exception, and stalled decision still comes back to you."],
      },
      {
        sectionId: "symptoms",
        heading: "When execution becomes dependency",
        bullets: [
          "You are pulled into every review because nobody knows where your judgment should stop.",
          "A developer waits for permission instead of making a reversible decision.",
          "Planning time disappears into rescue work, escalations, and context switching.",
        ],
      },
      {
        sectionId: "mechanism",
        heading: "The Invisible Executor pattern",
        paragraphs: ["The Invisible Executor is the leader who looks effective because work keeps moving, while the team quietly depends on that leader for judgment, permission, and exception handling. The shift is to make decision ownership visible and reusable."],
        bullets: ["Find the decisions that keep returning to you.", "Name the hidden load and clarify decision rights.", "Build an operating model that lets the team progress with appropriate autonomy."],
      },
      { sectionId: "next-step", heading: "What changes", paragraphs: ["The goal is not to become less technical or less available. It is to stop being the only reliable route for progress, so your leadership time can move toward direction, leverage, and strategic work."] },
      {
        sectionId: "outcomes",
        heading: "What you can change",
        paragraphs: ["The work is practical: turn the bottleneck into an operating problem you can see, discuss, and change."],
        bullets: [
          "Your team knows which decisions it owns and when to bring you in.",
          "You spend more leadership time on direction and leverage, not repeated rescue work.",
          "Escalations become clearer because the team has a shared way to handle judgment and exceptions.",
        ],
      },
      { sectionId: "why-help", heading: "Why The Push", paragraphs: ["The Push is a Leadership OS for technical leaders who need operating clarity, not generic management advice. It turns recurring decisions, escalation patterns, and hidden dependencies into a system you and your team can work with."] },
      { sectionId: "why-itay", heading: "Why Itay", paragraphs: ["Itay Foyerstein coaches from inside the technical leadership context: the pressure to stay close to delivery, the instinct to solve the hard problem yourself, and the need to create leverage without losing credibility with the team. The Invisible Executor framework gives that coaching a shared language and a practical path forward."] },
      { sectionId: "fit", heading: "Is this a fit?", paragraphs: ["This is for Engineering Managers who are carrying too many decisions, reviews, or escalations and want to build a team that can move with more ownership. It is a better fit when you are ready to examine the operating pattern behind the workload, not just add another productivity tactic."] },
      {
        sectionId: "cta",
        heading: "Book your Engineering Manager fit call",
        paragraphs: ["Bring one recurring bottleneck, review queue, or escalation pattern. We will identify what is keeping progress dependent on you and decide whether coaching is the right next step."],
      },
    ],
    primaryCta: {
      label: "Book your Engineering Manager fit call",
      href: "/book-a-fit-call",
      context: "Identify the operating change that will help you lead beyond execution bottlenecks.",
    },
    internalLinks: links,
    seo: { title: "Stop Being the Bottleneck as an Engineering Manager | The Push", description: "Clarify decision ownership, reduce repeated escalations, and build a team that can make progress without waiting for you." },
    structuredDataInput: { type: "Article", authorName: "Itay Foyerstein" },
  });
  const patternValidation = validateArtifactAgainstPagePattern(artifact, chain.pagePattern.id);
  if (!patternValidation.valid) {
    throw new Error(`Artifact does not satisfy ${chain.pagePattern.id}: ${patternValidation.details.join(" ")}`);
  }
  return artifact;
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
