# Authority Engine Architecture Simplification Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Simplify the authority engine around four canonical domain contracts, consolidated Payload models, deterministic governance, and one canonical Itay Foyerstein Person entity.

**Architecture:** Use a compatibility-first migration. Canonical schemas and pure deterministic services are introduced before new Payload collections; legacy records are mapped and verified before any collection registration is removed.

**Tech Stack:** TypeScript 5, Zod, Payload CMS 3, PostgreSQL, Vitest, Next.js 15.

---

### Task 1: Canonical entity identity

**Files:**
- Create: `src/ai/governance/canonical-entity.ts`
- Modify: `src/ai/governance/index.ts`
- Test: `tests/unit/canonical-entity.test.ts`

1. Write failing tests proving `Itay Foyerstein` is canonical and known Feuerstein/Foyerstien spellings normalize to it.
2. Run `npm test -- tests/unit/canonical-entity.test.ts` and verify the missing-module failure.
3. Implement the canonical entity definition and normalization function.
4. Run the focused test and verify it passes.

### Task 2: Canonical domain contracts

**Files:**
- Create: `src/domain/authority-contracts.ts`
- Modify: `src/ai/agents/agentFactoryContracts.ts`
- Modify: `src/ai/agents/index.ts`
- Test: `tests/unit/authority-contracts.test.ts`

1. Write failing tests for `ApprovedInsight`, `KnowledgeAsset`, `AuthorityContent`, and `VisibilityObservation` schemas.
2. Verify failures before implementation.
3. Implement strict Zod schemas and export inferred types.
4. Re-export deprecated contract names from the canonical schemas where compatibility is required.
5. Run focused contract tests.

### Task 3: Deterministic authority decisions

**Files:**
- Create: `src/ai/governance/authority-decisions.ts`
- Modify: `src/ai/governance/index.ts`
- Modify: `src/ai/governance/content-quality-gate.ts`
- Test: `tests/unit/authority-decisions.test.ts`

1. Write failing tests for schema selection, CTA selection, freshness, content transitions, and human-only publishing.
2. Verify expected failures.
3. Implement pure decision functions.
4. Replace overlapping quality-gate rules with the shared functions.
5. Run focused tests.

### Task 4: Reduce the runtime agent registry

**Files:**
- Modify: `src/ai/agents/agentFactoryContracts.ts`
- Modify: `src/ai/agents/agentFactoryPromptShells.ts`
- Modify: `src/ai/agents/agentRegistry.ts`
- Test: `tests/unit/agent-factory-contracts.test.ts`

1. Change tests to require only `InsightExtractionAgent`, `ResearchSynthesisAgent`, and `ContentDraftingAgent` as semantic agents.
2. Verify the existing 16-agent registry fails the new expectation.
3. Replace deterministic agent entries with references to deterministic services.
4. Preserve legacy-name parsing only at compatibility boundaries.
5. Run focused registry tests.

### Task 5: Unified AuthorityContent collection

**Files:**
- Create: `src/payload/collections/AuthorityContent.ts`
- Create: `src/payload/migrations/legacy-authority-content.ts`
- Modify: `src/payload/collections/index.ts`
- Modify: `payload.config.ts`
- Test: `tests/unit/authority-content-collection.test.ts`

1. Write failing tests for the unified collection and mapping of every legacy content collection to a `contentType`.
2. Verify failures.
3. Implement the unified collection and pure legacy mapper.
4. Register the new collection while retaining legacy registrations for reads.
5. Run focused tests and typecheck.

### Task 6: Unified Insights collection

**Files:**
- Create: `src/payload/collections/Insights.ts`
- Create: `src/payload/migrations/legacy-insights.ts`
- Modify: `src/payload/collections/index.ts`
- Modify: `payload.config.ts`
- Test: `tests/unit/insights-collection.test.ts`

1. Write failing lifecycle and legacy-mapping tests.
2. Verify failures.
3. Implement candidate-to-approved lifecycle in one collection.
4. Retain old collections as compatibility read sources.
5. Run focused tests.

### Task 7: Unified VisibilityObservations collection

**Files:**
- Create: `src/payload/collections/VisibilityObservations.ts`
- Create: `src/payload/migrations/legacy-visibility.ts`
- Modify: `src/payload/collections/index.ts`
- Modify: `payload.config.ts`
- Test: `tests/unit/visibility-observations.test.ts`

1. Write failing append-only and legacy-mapping tests.
2. Verify failures.
3. Implement the canonical collection and mappers for both scorecard shapes.
4. Route competitor appearances into observation fields.
5. Retain legacy registrations until data verification.

### Task 8: Documentation and verification

**Files:**
- Modify: `ARCHITECTURE.md`
- Modify: `DATA_CONTRACTS.md`
- Modify: `AGENT_FACTORY.md`
- Modify: `docs/seed-content/README.md`
- Modify: `PLANS.md`
- Delete after verified migration: `docs/seed-content/itay-feuerstein-entity.md`

1. Update documentation to name the canonical contracts and compatibility lifecycle.
2. Remove the duplicate Feuerstein entity draft and document aliases on the canonical Foyerstein entity.
3. Run `npm test`.
4. Run `npm run typecheck`.
5. Run `npm run build`.
6. Verify no publishing or provider path was added.
7. Record results in Task 056 and move its state out of `in_progress` only after every required check passes.

