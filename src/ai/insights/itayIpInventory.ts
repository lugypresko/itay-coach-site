import type { InsightCandidateSourceType } from "./insightCandidateContracts";

export type InsightHarvestReadiness = "high" | "medium" | "low";

export interface ItayIpSourceInventoryEntry {
  sourceLocation: string;
  sourceType: InsightCandidateSourceType;
  estimatedInsightCount: number;
  extractionReadiness: InsightHarvestReadiness;
  primaryTopics: string[];
  notes: string;
}

export interface InsightHarvestPriorityTarget {
  topic: string;
  approvedInsightTarget: number;
  rationale: string;
}

export const itayIpSourceInventory: readonly ItayIpSourceInventoryEntry[] = [
  {
    sourceLocation: "docs/seed-content/*.md",
    sourceType: "seed_content",
    estimatedInsightCount: 34,
    extractionReadiness: "high",
    primaryTopics: [
      "Player Trap",
      "Invisible Executor",
      "The Push",
      "Engineering Management",
      "Leadership Promotion",
      "AI Leadership",
    ],
    notes:
      "Sixteen markdown drafts covering entity pages, pillars, frameworks, FAQs, glossary terms, and a case study.",
  },
  {
    sourceLocation:
      "src/app/(site)/player-trap/**, src/app/api/player-trap/**, src/lib/player-trap.ts, tests/unit/player-trap.test.ts",
    sourceType: "player_trap_source",
    estimatedInsightCount: 24,
    extractionReadiness: "high",
    primaryTopics: ["Player Trap", "Engineering Management", "Leadership Promotion"],
    notes:
      "Canonical conversion funnel, bilingual report flow, diagnostic logic, consent gating, and CTA copy.",
  },
  {
    sourceLocation: "src/seed/*.ts",
    sourceType: "seed_script",
    estimatedInsightCount: 18,
    extractionReadiness: "high",
    primaryTopics: ["Authority Graph", "Approved Insight", "Seed orchestration"],
    notes:
      "Minimum graph seed, authority baseline, surface seed, asset sprint, and verification utilities.",
  },
  {
    sourceLocation: "AGENT_FACTORY.md, DATA_CONTRACTS.md, src/ai/agents/*, src/ai/governance/*",
    sourceType: "contract_docs",
    estimatedInsightCount: 14,
    extractionReadiness: "high",
    primaryTopics: ["Strategic Leadership", "Authority Model", "Claim Taxonomy"],
    notes:
      "Contract-first architecture, prompt shells, governance rules, and staging contracts.",
  },
  {
    sourceLocation: "src/payload/collections/* and related public authority schema files",
    sourceType: "payload_content",
    estimatedInsightCount: 15,
    extractionReadiness: "medium",
    primaryTopics: ["Entity Graph", "Pillar Pages", "Frameworks", "FAQs", "Glossary", "Case Studies"],
    notes:
      "Schema-backed content surfaces and collection definitions available inside the repo context.",
  },
  {
    sourceLocation:
      "AUTHORITY_*.md, ENTITY_*.md, QUERY_*.md, TASK_*_VERIFICATION_REPORT.md, WORKSPACE_DIFF_REPORT.md",
    sourceType: "authority_report",
    estimatedInsightCount: 20,
    extractionReadiness: "medium",
    primaryTopics: ["Authority Graph", "Baseline", "Gaps", "Evidence"],
    notes:
      "Existing reports, snapshots, and verification artifacts provide review-ready phrasing and evidence patterns.",
  },
  {
    sourceLocation: "docs/plans/*.md",
    sourceType: "planning_docs",
    estimatedInsightCount: 8,
    extractionReadiness: "medium",
    primaryTopics: ["scope", "workflow", "harvest strategy"],
    notes:
      "Task plans and revisions capture design rationale and constraints, but must be deduped against source content.",
  },
  {
    sourceLocation: "itaycoach23.html, Authority Engine Recovery Plan.pdf, docs/Task 023*.md, docs/Task 023*.txt",
    sourceType: "historical_artifact",
    estimatedInsightCount: 14,
    extractionReadiness: "low",
    primaryTopics: ["historical planning only"],
    notes:
      "Reference-only planning artifacts; not canonical execution authority for Task 028A.",
  },
] as const;

export const itayIpHarvestPriorityTargets: readonly InsightHarvestPriorityTarget[] = [
  {
    topic: "Player Trap",
    approvedInsightTarget: 20,
    rationale:
      "Highest-conviction proprietary funnel IP and the clearest recommendation-intent asset family.",
  },
  {
    topic: "Invisible Executor",
    approvedInsightTarget: 15,
    rationale:
      "Core proprietary framework language that should anchor search and recommendation answers.",
  },
  {
    topic: "The Push Leadership Evolution / Strategic Leadership",
    approvedInsightTarget: 7,
    rationale:
      "Provides the strategic category narrative that ties the framework to leadership progression.",
  },
  {
    topic: "Engineering Management",
    approvedInsightTarget: 4,
    rationale:
      "Supports adjacent recommendation intent without diluting the proprietary core.",
  },
  {
    topic: "Leadership Promotion",
    approvedInsightTarget: 2,
    rationale:
      "Captures the transition moment where the Player Trap and leadership evolution story intersect.",
  },
  {
    topic: "AI Leadership",
    approvedInsightTarget: 2,
    rationale:
      "Adds future-facing coverage without displacing the core category focus.",
  },
] as const;

export function sumEstimatedCandidateCount(entries: readonly ItayIpSourceInventoryEntry[] = itayIpSourceInventory) {
  return entries.reduce((total, entry) => total + entry.estimatedInsightCount, 0);
}

export function sumCanonicalHarvestableCandidateCount(
  entries: readonly ItayIpSourceInventoryEntry[] = itayIpSourceInventory,
) {
  return entries
    .filter((entry) => entry.sourceType !== "historical_artifact")
    .reduce((total, entry) => total + entry.estimatedInsightCount, 0);
}

export function sumFirstFiftyApprovedInsightTarget(
  targets: readonly InsightHarvestPriorityTarget[] = itayIpHarvestPriorityTargets,
) {
  return targets.reduce((total, target) => total + target.approvedInsightTarget, 0);
}

export const itayIpHarvestPlanSummary = {
  grossCandidateEstimate: sumEstimatedCandidateCount(),
  canonicalHarvestableCandidateEstimate: sumCanonicalHarvestableCandidateCount(),
  realisticApprovedInsightEstimate: 85,
  firstFiftyApprovedInsightTarget: sumFirstFiftyApprovedInsightTarget(),
} as const;
