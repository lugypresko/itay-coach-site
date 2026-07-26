import type { ReaderFacingPageArtifact } from "../../domain/reader-facing-page-artifact";
import type { ContentDecision, ContentDecisionArchetype, PagePatternId } from "./contracts";

export interface PagePattern {
  id: PagePatternId;
  contentArchetype: ContentDecisionArchetype;
  requiredSectionIds: readonly string[];
  compatibleJourneyStages: readonly ContentDecision["journeyStage"][];
  compatibleCtaIds: readonly string[];
}

const pattern = <T extends PagePattern>(value: T): T => value;

export const pagePatterns: Record<PagePatternId, PagePattern> = {
  conversion_landing_page: pattern({
    id: "conversion_landing_page",
    contentArchetype: "conversion",
    requiredSectionIds: ["answer", "role-context", "symptoms", "mechanism", "next-step", "why-help", "cta"],
    compatibleJourneyStages: ["consideration", "decision", "coach_intent"],
    compatibleCtaIds: ["book-fit-call"],
  }),
  framework_page: pattern({
    id: "framework_page",
    contentArchetype: "framework",
    requiredSectionIds: ["definition", "problem", "symptoms", "stages", "interpretation", "limits", "next-step"],
    compatibleJourneyStages: ["awareness", "consideration", "decision"],
    compatibleCtaIds: ["book-fit-call"],
  }),
  problem_page: pattern({
    id: "problem_page",
    contentArchetype: "problem",
    requiredSectionIds: ["recognition", "situations", "cost", "failed-fixes", "root-cause", "intervention", "cta"],
    compatibleJourneyStages: ["awareness", "consideration"],
    compatibleCtaIds: ["book-fit-call"],
  }),
  pillar_page: pattern({
    id: "pillar_page",
    contentArchetype: "pillar",
    requiredSectionIds: ["answer", "audience", "themes", "proof", "pathways", "next-step", "cta"],
    compatibleJourneyStages: ["awareness", "consideration"],
    compatibleCtaIds: ["book-fit-call"],
  }),
  faq_page: pattern({
    id: "faq_page",
    contentArchetype: "faq",
    requiredSectionIds: ["answer", "questions", "context", "next-step"],
    compatibleJourneyStages: ["awareness", "consideration", "decision"],
    compatibleCtaIds: ["book-fit-call"],
  }),
  about_page: pattern({
    id: "about_page",
    contentArchetype: "about",
    requiredSectionIds: ["answer", "story", "approach", "proof", "next-step", "cta"],
    compatibleJourneyStages: ["awareness", "consideration"],
    compatibleCtaIds: ["book-fit-call"],
  }),
  case_study: pattern({
    id: "case_study",
    contentArchetype: "case_study",
    requiredSectionIds: ["context", "challenge", "intervention", "outcome", "lessons", "cta"],
    compatibleJourneyStages: ["consideration", "decision"],
    compatibleCtaIds: ["book-fit-call"],
  }),
  diagnostic_page: pattern({
    id: "diagnostic_page",
    contentArchetype: "diagnostic",
    requiredSectionIds: ["answer", "symptoms", "assessment", "interpretation", "next-step", "cta"],
    compatibleJourneyStages: ["awareness", "consideration", "decision", "coach_intent"],
    compatibleCtaIds: ["book-fit-call"],
  }),
  comparison_page: pattern({
    id: "comparison_page",
    contentArchetype: "comparison",
    requiredSectionIds: ["answer", "options", "differences", "fit", "next-step", "cta"],
    compatibleJourneyStages: ["consideration", "decision"],
    compatibleCtaIds: ["book-fit-call"],
  }),
  article: pattern({
    id: "article",
    contentArchetype: "article",
    requiredSectionIds: ["answer", "context", "body", "implications", "next-step"],
    compatibleJourneyStages: ["awareness", "consideration"],
    compatibleCtaIds: ["book-fit-call"],
  }),
};

export const pagePatternIds = Object.keys(pagePatterns) as PagePatternId[];

export type PagePatternValidationFailureCode =
  | "unknown_pattern"
  | "content_archetype_mismatch"
  | "journey_stage_incompatible"
  | "cta_incompatible"
  | "missing_required_section";

export interface PagePatternValidationResult {
  valid: boolean;
  failureCodes: PagePatternValidationFailureCode[];
  details: string[];
}

export function validatePagePatternDecision(
  decision: Pick<ContentDecision, "pagePatternId" | "contentArchetype" | "journeyStage" | "primaryCtaId">,
): PagePatternValidationResult {
  const selected = pagePatterns[decision.pagePatternId];
  if (!selected) return { valid: false, failureCodes: ["unknown_pattern"], details: ["The decision references an unknown Page Pattern."] };
  const failureCodes: PagePatternValidationFailureCode[] = [];
  const details: string[] = [];
  if (selected.contentArchetype !== decision.contentArchetype) {
    failureCodes.push("content_archetype_mismatch");
    details.push("The selected Page Pattern does not match the decision content archetype.");
  }
  if (!selected.compatibleJourneyStages.includes(decision.journeyStage)) {
    failureCodes.push("journey_stage_incompatible");
    details.push("The decision journey stage is not compatible with the selected Page Pattern.");
  }
  if (!selected.compatibleCtaIds.includes(decision.primaryCtaId)) {
    failureCodes.push("cta_incompatible");
    details.push("The decision CTA is not compatible with the selected Page Pattern.");
  }
  return { valid: failureCodes.length === 0, failureCodes, details };
}

export function validateArtifactAgainstPagePattern(
  artifact: Pick<ReaderFacingPageArtifact, "body">,
  pagePatternId: PagePatternId,
): PagePatternValidationResult {
  const selected = pagePatterns[pagePatternId];
  if (!selected) return { valid: false, failureCodes: ["unknown_pattern"], details: ["The artifact references an unknown Page Pattern."] };
  const sectionIds = new Set(artifact.body.map((section) => section.sectionId));
  const missing = selected.requiredSectionIds.filter((sectionId) => !sectionIds.has(sectionId));
  return {
    valid: missing.length === 0,
    failureCodes: missing.length ? ["missing_required_section"] : [],
    details: missing.map((sectionId) => `Missing required Page Pattern section: ${sectionId}.`),
  };
}
