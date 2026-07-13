# Shared Publication Projection Repair Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Restore `one normalized Payload record -> one publication decision -> all rendering and discovery surfaces` without publishing content.

**Architecture:** Payload remains the source record for governed authority assets. One in-memory publication projection normalizes each record once and applies the existing deterministic `buildPublicationDecision`; page metadata, sitemap, and `llms.txt` consume that projection. Human approval and canonical ownership are persisted source facts, while indexability and discovery eligibility remain derived decisions rather than independently mutable copies.

**Tech Stack:** Next.js 15 App Router, TypeScript 5, Payload CMS 3, Vitest.

---

## Governance checkpoint

Task 071 can complete its generic normalization work without a schema change, but the full repair requires a Payload schema migration because the current authority collections do not persist the human-approval envelope or canonical ownership. Do not run the migration, deploy, publish, commit, or push without explicit authorization.

The recommended minimal persisted source facts are:

- lifecycle `status` and `publishedAt`;
- canonical path/URL;
- human-approval timestamp, approver, approved revision hash, validation result, and publication scope.

Do not persist independently editable `indexable`, `sitemapEligible`, or `llmsTxtEligible` booleans by default. Derive them from the source facts through the shared publication decision so they cannot drift.

### Task 1: Lock the invariant with failing tests

**Files:**
- Modify: `tests/unit/publication-decision.test.ts`
- Create: `tests/unit/publication-surface-projection.test.ts`

1. Add the exact Task 070 regression: one published, human-approved Draft 05 record must produce `indexable=true`, `sitemapEligible=true`, and `llmsTxtEligible=true` from the same decision.
2. Add the inverse record in `review`: page remains accessible only according to the chosen preview policy, metadata is `noindex`, and both discovery surfaces exclude it.
3. Add Problem Page cases for `draft`, `in_review`, `approved`, `published`, and `archived` so statuses are not silently collapsed.
4. Add preservation tests for explicit `false`, `null`, approval metadata, canonical ownership, and `publishedAt`.
5. Run `npm test -- tests/unit/publication-decision.test.ts tests/unit/publication-surface-projection.test.ts` and confirm failures identify the split read paths.

### Task 2: Persist the minimum governed source facts

**Files:**
- Modify: `src/payload/collections/content.ts`
- Modify: `src/payload/collections/ProblemPages.ts`
- Generate/update: Payload types and migration files using the repository's existing Payload commands
- Test: `tests/unit/payload-collections.test.ts` or the closest existing collection-contract test

1. Add a reusable canonical/approval field group to authority content and Problem Page collections.
2. Preserve the existing agent-publication prohibition and require the approval envelope before a transition to `published`.
3. Generate the Payload migration; inspect it to ensure it adds fields only and does not mutate publication status or publish any record.
4. Run the focused collection tests and typecheck.

**Stop point:** This task requires explicit schema-migration authorization before implementation.

### Task 3: Make normalization lossless

**Files:**
- Modify: `src/lib/public-content.ts`
- Modify: `src/lib/problem-pages.ts`
- Test: `tests/unit/publication-decision.test.ts`

1. Normalize every supported lifecycle status explicitly.
2. Preserve canonical, approval, publication timestamp, and any supported explicit governance override without truthy/falsy coercion.
3. Map the normalized record once into the existing `PublicationSourceRecord`.
4. Run the focused test and confirm GREEN.

### Task 4: Add one shared in-memory projection at the loading boundary

**Files:**
- Modify: `src/lib/public-content-loader.ts`
- Modify: `src/lib/problem-pages.ts`
- Create: `src/lib/publication-surface-projection.ts`
- Test: `tests/unit/publication-surface-projection.test.ts`

1. Load governed Payload records for the configured authority collections and Problem Pages.
2. Normalize each record once and call the existing `buildPublicationDecision` once per logical asset.
3. Return pathname, page model, and the existing `PublicationDecision`; do not introduce a persisted contract.
4. Fail closed for governed production discovery when Payload is unavailable. Static repository records may support local verification but must not be presented as proof of live publication state.
5. Run the projection tests and confirm GREEN.

### Task 5: Route every publication surface through the projection

**Files:**
- Modify: `src/app/(site)/[section]/[slug]/page.tsx`
- Modify: `src/app/(site)/problems/[slug]/page.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/llms.txt/route.ts`
- Modify: `src/lib/public-authority-routes.ts`
- Test: `tests/unit/site-url-and-sitemap.test.ts`
- Test: `tests/unit/draft-05-deployment-package.test.ts`

1. Derive robots and canonical metadata from `publicationDecision`; remove hard-coded `index: true`.
2. Make sitemap generation async and include governed paths only when the shared decision says `sitemapEligible`.
3. Build governed `llms.txt` entries from the same projection and `llmsTxtEligible`; retain only genuinely fixed non-governed utility routes in a shared fixed list.
4. Assert surface equality against each decision, not merely sitemap-versus-`llms.txt` string equality.
5. Run the focused publication/SEO tests and confirm GREEN.

### Task 6: Local verification and documentation

**Files:**
- Modify: `PLANS.md`
- Modify or create the Task 071 local verification report
- Append to `decisions.md` only if implementation selects a new material governance decision

1. Run `npm test`.
2. Run `npm run typecheck`.
3. Run `npm run build` with configured local sources where available.
4. Run `git diff --check`.
5. Verify locally: Draft 05 approved projection, CTO projection, all remaining drafts, canonical metadata, robots, schema, sitemap, and `llms.txt`.
6. Record unavailable live Payload/analytics coverage explicitly.
7. Mark Task 071 complete only when all local surfaces consume the shared projection.

### Task 7: Human-authorized rollout — separate task

1. Review the exact diff and migration.
2. Commit/push/deploy only after separate authorization.
3. Run the migration without changing record publication states.
4. Verify the approved Draft 05 hash before any publication transition.
5. Publish only explicitly authorized records.
6. Run the full post-deployment Production Observation.
7. Open the measurement window only after production integrity passes.
8. Roll back if hashes, canonical ownership, publication scope, or discovery surfaces disagree.

