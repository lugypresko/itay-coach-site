import type { AuthorityContent } from "../../domain/authority-contracts";

type ContentType = AuthorityContent["contentType"];
type ContentStatus = AuthorityContent["status"];
type Actor = "human" | "agent" | "system";
type IntentStage = "awareness" | "consideration" | "decision" | "coach_intent";

export function selectSchemaType(contentType: ContentType): "Person" | "FAQPage" | "HowTo" | "Article" {
  if (contentType === "entity") return "Person";
  if (contentType === "faq") return "FAQPage";
  if (contentType === "framework") return "HowTo";
  return "Article";
}

export function selectAuthorityCta(input: {
  intentStage: IntentStage;
  contentType: ContentType;
}): "fit_call" | "player_trap_diagnostic" | "related_authority_page" {
  if (input.intentStage === "coach_intent" || input.intentStage === "decision") {
    return "fit_call";
  }

  if (input.intentStage === "awareness") {
    return "player_trap_diagnostic";
  }

  return "related_authority_page";
}

export function isInsightFresh(freshnessExpiresAt: string, now = new Date()): boolean {
  const expiry = new Date(freshnessExpiresAt);
  return !Number.isNaN(expiry.getTime()) && expiry.getTime() > now.getTime();
}

const allowedTransitions: Record<ContentStatus, ContentStatus[]> = {
  draft: ["in_review", "archived"],
  in_review: ["draft", "approved", "archived"],
  approved: ["in_review", "published", "archived"],
  published: ["archived"],
  archived: ["draft"],
};

export function canTransitionContent(
  from: ContentStatus,
  to: ContentStatus,
  actor: Actor,
): boolean {
  if (!allowedTransitions[from].includes(to)) return false;
  if (to === "published") return actor === "human";
  if (to === "approved") return actor === "human";
  return true;
}
