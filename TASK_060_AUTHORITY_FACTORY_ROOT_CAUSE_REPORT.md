# Task 060 — Authority Content Factory Root-Cause Report

Observed: `2026-07-12`
Environment: repository evidence only; no provider calls, deployment, or Payload live read.

## Executive finding

The factory did not crash after producing 10 KnowledgeAssets and 10 Problem Pages. It reached the finite end of two one-time seed/sprint executions. There is no executable continuation mapping from a Chief of Staff recommendation to a bounded factory run, no scheduler/cron implementation, and no backlog-consuming loop. The current 30-day freshness gate is a real secondary defect in the generic draft API, but it is not the primary reason the two initial batches stopped.

## 1. Exact mechanism that created the 10 KnowledgeAssets

Task 033 defined a finite conversion sprint. `src/seed/knowledge-asset-conversion-sprint.ts` reads the static `approvedInsightRepository` (50 records), applies fixed quotas of Player Trap 4, Invisible Executor 3, and The Push / Strategic Leadership 3, and converts exactly 10 selected records with `knowledgeAssetSchema.parse(...)` into `in_review` assets. `src/seed/run-knowledge-asset-conversion-sprint.ts` writes `TASK_033_CONVERSION_REPORT.md`; it does not persist a growing queue or schedule another run.

Task 037 then persisted those same ten records through `src/seed/knowledge-asset-payload-seed.ts` and `src/seed/run-factory-storage-seed.ts`. The seed upserts by `sourceInsightId` and links each asset to an `approved_insights` Payload record. `TASK_033_CONVERSION_REPORT.md` records 50 approved insights, 10 converted, and 40 remaining.

Evidence: `PLANS.md` Task 033 and Task 037; `src/seed/knowledge-asset-conversion-sprint.ts`; `src/seed/run-knowledge-asset-conversion-sprint.ts`; `src/seed/knowledge-asset-payload-seed.ts`; `TASK_033_CONVERSION_REPORT.md`.

## 2. Exact mechanism that created the 10 Problem Pages

`src/lib/problem-pages.ts` contains a static `problemPageCatalog` with ten complete records and statuses. `src/seed/problem-pages.ts` maps that catalog to Payload seed data. `src/seed/run-problem-pages-seed.ts` performs a one-time upsert by slug into the `problem-pages` collection. There is no conversion from KnowledgeAssets, no PageBrief generation, and no directive-driven selection in this path.

Task 055 later selected two of the ten as canonical published targets and added static fallback/public-surface behavior for those two. Task 059 repaired the deterministic public-state surfaces but did not create a production content producer.

Evidence: `src/lib/problem-pages.ts`; `src/seed/problem-pages.ts`; `src/seed/run-problem-pages-seed.ts`; `src/payload/collections/ProblemPages.ts`; `PLANS.md` Task 055 and Task 059.

## 3. One-time scripts or reusable workflows?

They are one-time, finite seed/sprint tasks, not reusable production workflows:

- The KnowledgeAsset conversion function is reusable as a pure computation, but its input selection is hard-coded to fixed quotas and its runner only emits a report or seed pass.
- The Problem Page runner is reusable only as an idempotent re-seed of the same ten static catalog records; it has no eligible-insight backlog or target directive.
- Task 034 explicitly allowed deterministic continuation in principle, but no runtime executor was implemented.
- The architecture plan says the agent-factory runtime was deferred; `rejectAgentFactoryRuntime()` still throws that runtime execution is deferred.

Evidence: `PLANS.md` Tasks 033–037; `docs/plans/2026-06-09-agent-factory-contracts.md`; `src/ai/agents/agentFactoryContracts.ts`.

## 4. What caused production to stop?

The concrete cause is a missing executable continuation layer: Chief of Staff artifacts record recommendations, but no component consumes a recommendation and runs a bounded ApprovedInsight → KnowledgeAsset → PageBrief/draft sequence. There is also no `vercel.json`, `.github` scheduled workflow, `/api/cron` implementation, or other scheduler connected to content production. The only production-facing generation endpoint is `POST /api/content-generate`, which requires a caller to supply the job, insights, draft, source node, and candidate nodes.

The initial batches therefore stopped normally after their fixed finite inputs were consumed. This is not evidence of a provider outage or a runtime crash.

## 5. Active blocker classification

| Candidate | Finding |
|---|---|
| Missing trigger | **Yes.** No scheduler or event trigger invokes a factory continuation. |
| Obsolete 30-day freshness gate | **Secondary defect.** `content-generation-gate.ts` defaults to 30 days and `contentDraftWorkflow.ts` blocks when no fresh insight is supplied. It is not what terminated the fixed seed batches, and the repository ApprovedInsight records carry `freshnessExpiresAt` in 2099. |
| Human-review gate | **Not the cause of non-public production stopping.** It correctly blocks approval/publication; Task 040’s three assets were `needs_edit`, and publication integrity is currently unresolved. |
| Unresolved draft WIP | **A publication constraint, not the root cause.** Existing drafts and publish-readiness edits should affect prioritization/WIP, but no current code consumes them as a hard factory stop. |
| Missing provider configuration | **No.** The finite conversions and draft contract path are deterministic and provider-free. |
| Missing executable mapping from Chief of Staff decisions | **Yes, primary.** Chief of Staff outputs constrained recommendations, but no directive-to-factory executor exists. |
| Other concrete cause | **Finite static source design.** Both initial producers were seed scripts with fixed catalogs/quotas, not continuous backlog consumers. |

## 6. Existing component reusable to continue production

The smallest reusable building blocks already exist:

1. `approvedInsightRepository` and `knowledgeAssetSchema` provide deterministic claim-backed conversion.
2. `knowledgeAssetConversionSprint.ts` provides the conversion shape, but its fixed quota selector must become directive-scoped and backlog-aware.
3. `knowledgeAssetPayloadSeed.ts` provides idempotent Payload persistence by `sourceInsightId`.
4. `PageBrief` and `ContentWriterAgent` contracts provide the bridge for review-ready drafts; PageBrief is currently an in-repo contract/static manifest, not a persisted lifecycle.
5. `contentDraftWorkflow.ts` already performs quality evaluation, internal-link suggestions, and draft/in-review save decisions without publishing.
6. `OperatingCycle` already persists the decision-loop state shape, but it currently has no production directive execution field or executor.

## 7. Smallest implementation proposal

Do not add an Action Router or general orchestration framework. Add one bounded, deterministic production-directive executor at the existing factory boundary, reusing the components above:

1. Chief of Staff emits one directive containing cluster, target count/WIP limit, eligible source IDs or query/entity filters, expiry, and stop conditions.
2. A single bounded execution function selects unconverted eligible Approved Insights for that cluster, groups them into KnowledgeAssets, creates PageBrief-backed draft inputs, and invokes the existing `contentDraftWorkflow` for review-ready drafts.
3. Persist only the directive execution state in the existing minimal `OperatingCycle` (or one minimal directive field if the current contract can hold it); do not add AgentRun/ContentJob collections or a router.
4. Enforce claim-level freshness/evidence, uniqueness, canonical ownership, WIP, and unresolved publication-integrity stop conditions deterministically.
5. Stop at draft/in-review. Human approval remains mandatory before publication, and publication remains blocked while the production publication-state defect is unresolved.

This proposal is the smallest change supported by the evidence: one bounded continuation executor plus the minimum directive data needed to select a cluster and stop safely. It is not implementation approval. No code or decision-log entry was added for the proposal in this diagnosis phase.
