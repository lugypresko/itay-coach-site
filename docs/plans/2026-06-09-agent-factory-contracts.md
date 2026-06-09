# Codex-Run Agent Contract System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Define the codex-run agent contract system for the Authority Engine without adding runtime orchestration or content generation.

**Architecture:** Build the agent factory as contracts first. Model Approved Insight, KnowledgeAsset, Claim Ledger, DistributionAsset, and PerformanceSignal as typed, validated interfaces that can map onto existing Payload storage later. Keep runtime execution deferred to Task 026 and use tests to enforce the no-runtime boundary.

**Tech Stack:** TypeScript 5, Zod, Vitest, Payload CMS 3, Next.js 15 App Router.

---

### Task 1: Add Contract Validation Tests

**Files:**
- Create: `tests/unit/agent-factory-contracts.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";

describe("agent factory contracts", () => {
  it("rejects unapproved or expired insights", () => {});
  it("accepts a valid KnowledgeAsset contract", () => {});
  it("classifies claim types and distribution assets", () => {});
});
```

**Step 2: Run the new test**

Run: `npm test -- tests/unit/agent-factory-contracts.test.ts`

Expected: FAIL because the contract module does not exist yet.

**Step 3: Expand the assertions**

- Assert that `ApprovedInsight` requires `status = "approved"` and a future `freshnessExpiresAt`.
- Assert that `KnowledgeAsset` requires `sourceInsightId`, `claimIds`, `targetQueries`, `targetEntities`, `shortAnswer`, and `reviewStatus`.
- Assert that `DistributionAsset` accepts only the approved channel set and review statuses.
- Assert that the claim taxonomy distinguishes factual, research, client outcome, framework, and opinion claims.

**Step 4: Keep the test runtime-free**

- Do not call LangGraph.
- Do not call any provider.
- Do not read or write Payload records.

**Step 5: Commit the test boundary**

The test file should fail until the schema module exists and exports the expected validators.

### Task 2: Define the Contract Layer

**Files:**
- Create: `src/ai/agents/agentFactoryContracts.ts`
- Create: `src/ai/agents/agentFactoryPromptShells.ts`
- Modify: `src/ai/agents/index.ts`

**Step 1: Implement the minimal typed contracts**

- Add `AgentName` for the 16 content-production agents.
- Add `ApprovedInsight` and `ApprovedInsightSchema`.
- Add `KnowledgeAsset` and `KnowledgeAssetSchema`.
- Add `ClaimLedgerEntry` and `ClaimLedgerSchema`.
- Add `DistributionAsset` and `DistributionAssetSchema`.
- Add `PerformanceSignal` and `PerformanceSignalSchema`.

**Step 2: Add the scope guards**

- Encode `PerformanceLearningAgent` as deferred to Task 031.
- Encode `KnowledgeAsset` as the canonical output contract.
- Encode `review-ready draft` as the maximum agent-authored output state.
- Add a helper that rejects runtime execution paths in this phase.

**Step 3: Define prompt shells**

- Add static prompt metadata only.
- Include `agentName`, `promptVersion`, `inputShape`, `outputShape`, and `failureStates`.
- Keep prompts as shells, not executable model calls.

**Step 4: Export the contracts cleanly**

- Re-export the new contract layer from `src/ai/agents/index.ts`.
- Keep the API small and explicit.

**Step 5: Re-run the contract test**

Run: `npm test -- tests/unit/agent-factory-contracts.test.ts`

Expected: PASS.

### Task 3: Write the Decision Block Documentation

**Files:**
- Create: `AGENT_FACTORY.md`
- Modify: `DATA_CONTRACTS.md`

**Step 1: Document the architecture decisions**

- Codex-run factory now; runtime factory deferred.
- 16 content-production agent contracts.
- PerformanceLearningAgent deferred to Task 031.
- Approved Insights live in Payload or the existing `InsightExtractions` storage if present.
- KnowledgeAsset is the canonical output contract.
- Claim Ledger contract lives in Task 025; storage implementation lives in Task 027.
- Recommendation pages are review-ready drafts only.
- Distribution assets are drafts only and are not auto-published.
- No runtime generation in Task 025.

**Step 2: Document the storage decisions**

- Approved insights are source-of-truth records in Payload.
- Docs may describe insights, but they cannot authorize generation.
- KnowledgeAsset may map onto existing Payload collections later.
- Distribution assets should live in Payload, not in flat files.
- Claim ledger storage is deferred until Task 027.
- Performance signals should distinguish current signals from future placeholders.

**Step 3: Keep the docs narrow**

- Do not add marketing copy.
- Do not add runtime workflow text.
- Do not describe provider execution.
- Keep the documentation useful to implementers and reviewers only.

**Step 4: Confirm the docs match the contracts**

- Verify the doc names and field names match the schema module.
- Verify the decision block does not contradict the no-runtime boundary.

### Task 4: Validate the Contract-Only Boundary

**Files:**
- Validate: `tests/unit/agent-factory-contracts.test.ts`
- Validate: `src/ai/agents/agentFactoryContracts.ts`
- Validate: `src/ai/agents/agentFactoryPromptShells.ts`

**Step 1: Run the focused contract test**

Run: `npm test -- tests/unit/agent-factory-contracts.test.ts`

Expected: PASS.

**Step 2: Run the full test suite**

Run: `npm test`

Expected: PASS.

**Step 3: Run type checking**

Run: `npm run typecheck`

Expected: PASS.

**Step 4: Verify no runtime paths were added**

- No provider calls.
- No LangGraph execution.
- No Payload writes.
- No publishing logic.

**Step 5: Stop at contracts**

This task is complete when the contract layer, prompt shells, and documentation are in place and validated without runtime generation.
