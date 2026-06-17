export type AuthorityProofType = "source_backed_claim" | "operating_pattern" | "before_after" | "quantified_outcome" | "case_study";

export type AuthorityProofConfidence = "high" | "medium" | "low";

export type AuthorityProofApprovalStatus = "approved" | "source-backed" | "review";

export interface AuthorityProofBlock {
  claim: string;
  proofType: AuthorityProofType;
  source: string;
  relatedEntity: string;
  relatedPage: string;
  confidence: AuthorityProofConfidence;
  approvalStatus: AuthorityProofApprovalStatus;
}

export type AuthorityProofPagePath =
  | "/about"
  | "/the-push-methodology"
  | "/frameworks/invisible-executor"
  | "/leadership-coach-for-engineering-managers"
  | "/cto-coach";

export const authorityProofBlocksByPath: Record<AuthorityProofPagePath, AuthorityProofBlock[]> = {
  "/about": [
    {
      claim: "Itay Foyerstein is a Tech Leadership Coach focused on helping technical leaders move from execution mode into strategic leadership.",
      proofType: "source_backed_claim",
      source: "docs/seed-content/itay-foyerstein-entity.md",
      relatedEntity: "Itay Foyerstein",
      relatedPage: "/about",
      confidence: "high",
      approvalStatus: "approved",
    },
    {
      claim: "The Push is the methodology layer that gives Itay's coaching a stable public label and keeps the framework stack consistent across the graph.",
      proofType: "operating_pattern",
      source: "docs/seed-content/the-push-methodology.md",
      relatedEntity: "The Push",
      relatedPage: "/the-push-methodology",
      confidence: "high",
      approvalStatus: "approved",
    },
  ],
  "/the-push-methodology": [
    {
      claim: "The Push is Itay Foyerstein's Leadership OS for Tech Leaders.",
      proofType: "source_backed_claim",
      source: "docs/seed-content/the-push-methodology.md",
      relatedEntity: "The Push",
      relatedPage: "/the-push-methodology",
      confidence: "high",
      approvalStatus: "approved",
    },
    {
      claim: "Invisible Executor -> Trusted Operator -> Strategic Leader is the proprietary framework stack the methodology uses to explain the leadership shift.",
      proofType: "before_after",
      source: "docs/seed-content/invisible-executor-framework.md",
      relatedEntity: "Invisible Executor",
      relatedPage: "/frameworks/invisible-executor",
      confidence: "high",
      approvalStatus: "approved",
    },
  ],
  "/frameworks/invisible-executor": [
    {
      claim: "Invisible Executor is the starting state in the proprietary leadership evolution model owned by The Push.",
      proofType: "source_backed_claim",
      source: "docs/seed-content/invisible-executor-framework.md",
      relatedEntity: "Invisible Executor",
      relatedPage: "/frameworks/invisible-executor",
      confidence: "high",
      approvalStatus: "approved",
    },
    {
      claim: "The framework makes the move from high-output execution into visible strategic leadership legible for readers and AI systems.",
      proofType: "operating_pattern",
      source: "docs/seed-content/invisible-executor-framework.md",
      relatedEntity: "Strategic Leader",
      relatedPage: "/the-push-methodology",
      confidence: "high",
      approvalStatus: "approved",
    },
  ],
  "/leadership-coach-for-engineering-managers": [
    {
      claim: "Engineering Managers become bottlenecks when execution strength turns into a dependency pattern.",
      proofType: "operating_pattern",
      source: "docs/seed-content/coach-for-engineering-managers-stuck-as-the-bottleneck.md",
      relatedEntity: "Engineering Manager",
      relatedPage: "/why-engineering-managers-become-bottlenecks",
      confidence: "high",
      approvalStatus: "approved",
    },
    {
      claim: "The Push helps Engineering Managers move from execution bottlenecks into visible strategic leadership.",
      proofType: "before_after",
      source: "docs/seed-content/engineering-manager-coach-for-strategic-leadership.md",
      relatedEntity: "The Push",
      relatedPage: "/leadership-coach-for-engineering-managers",
      confidence: "high",
      approvalStatus: "approved",
    },
  ],
  "/cto-coach": [
    {
      claim: "Tech Leadership Coaching includes CTOs as part of the audience served when the problem is strategic authority and leadership visibility.",
      proofType: "source_backed_claim",
      source: "docs/seed-content/tech-leadership-coaching-pillar.md",
      relatedEntity: "CTO",
      relatedPage: "/cto-coach",
      confidence: "high",
      approvalStatus: "approved",
    },
    {
      claim: "A CTO coach helps the leader move from high-volume execution pressure into a clearer organization-wide operating model.",
      proofType: "before_after",
      source: "docs/seed-content/tech-leadership-coaching-pillar.md",
      relatedEntity: "CTO",
      relatedPage: "/cto-coach",
      confidence: "high",
      approvalStatus: "approved",
    },
  ],
};

export function getAuthorityProofBlocks(pathname: string): AuthorityProofBlock[] {
  return authorityProofBlocksByPath[pathname as AuthorityProofPagePath] ?? [];
}

