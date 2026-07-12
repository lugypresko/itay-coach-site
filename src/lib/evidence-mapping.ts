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
  | "/pillars/tech-leadership-coaching"
  | "/frameworks/player-trap"
  | "/frameworks/invisible-executor"
  | "/problems/cto-becomes-the-bottleneck"
  | "/problems/vp-rnd-losing-execution-control"
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
  "/pillars/tech-leadership-coaching": [
    {
      claim: "Tech Leadership Coaching is the service category for Engineering Managers, CTOs, R&D Managers, and VP Engineering candidates who need strategic leadership leverage.",
      proofType: "source_backed_claim",
      source: "docs/seed-content/tech-leadership-coaching-pillar.md",
      relatedEntity: "Tech Leadership Coach",
      relatedPage: "/pillars/tech-leadership-coaching",
      confidence: "high",
      approvalStatus: "approved",
    },
    {
      claim: "The Push connects coaching to a named leadership operating model instead of generic management advice.",
      proofType: "operating_pattern",
      source: "docs/seed-content/the-push-methodology.md",
      relatedEntity: "The Push",
      relatedPage: "/the-push-methodology",
      confidence: "high",
      approvalStatus: "approved",
    },
  ],
  "/frameworks/player-trap": [
    {
      claim: "Player Trap describes the state where a manager's execution strength turns into a dependency problem for the team.",
      proofType: "source_backed_claim",
      source: "docs/seed-content/coach-for-engineering-managers-stuck-as-the-bottleneck.md",
      relatedEntity: "Player Trap",
      relatedPage: "/frameworks/player-trap",
      confidence: "high",
      approvalStatus: "approved",
    },
    {
      claim: "The Player Trap diagnostic routes leaders toward either the diagnostic path or a fit call, depending on how clear the bottleneck already is.",
      proofType: "operating_pattern",
      source: "src/app/(site)/player-trap/page.tsx",
      relatedEntity: "The Push",
      relatedPage: "/player-trap",
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
  "/problems/cto-becomes-the-bottleneck": [
    {
      claim: "The Push and Invisible Executor explain why a CTO can look effective while still being the bottleneck for judgment and priority.",
      proofType: "source_backed_claim",
      source: "docs/seed-content/invisible-executor-framework.md",
      relatedEntity: "Invisible Executor",
      relatedPage: "/frameworks/invisible-executor",
      confidence: "high",
      approvalStatus: "approved",
    },
    {
      claim: "A CTO bottleneck is a decision-architecture problem, not just a workload problem.",
      proofType: "operating_pattern",
      source: "docs/seed-content/tech-leadership-coaching-pillar.md",
      relatedEntity: "CTO",
      relatedPage: "/problems/cto-becomes-the-bottleneck",
      confidence: "high",
      approvalStatus: "approved",
    },
  ],
  "/problems/vp-rnd-losing-execution-control": [
    {
      claim: "The Push methodology exists to make the hidden operating model visible for technical leaders who carry too much execution load.",
      proofType: "source_backed_claim",
      source: "docs/seed-content/the-push-methodology.md",
      relatedEntity: "The Push",
      relatedPage: "/the-push-methodology",
      confidence: "high",
      approvalStatus: "approved",
    },
    {
      claim: "Execution control at VP R&D level usually requires clearer decision architecture, not more dashboards or direct coordination.",
      proofType: "operating_pattern",
      source: "docs/seed-content/invisible-executor-framework.md",
      relatedEntity: "VP R&D",
      relatedPage: "/problems/vp-rnd-losing-execution-control",
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
