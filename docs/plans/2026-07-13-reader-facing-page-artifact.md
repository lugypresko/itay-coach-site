# Immutable Reader-Facing Page Artifact Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development and superpowers:verification-before-completion. Do not commit, deploy, publish, or auto-approve.

**Goal:** Make one immutable `ReaderFacingPageArtifact` the exact hash-bound source for validation, review, approval, publication, and all public surfaces, while producing one non-public Draft 05 replacement for human review.

**Architecture:** Add domain contracts and canonical SHA-256 serialization under `src/domain`, persist versioned artifacts in one append-only Payload collection, and resolve public pages only through a shared artifact publication projection. Existing content collections become editorial/history sources and fail closed publicly after cutover. A non-production preview renders the same artifact through the same reader-facing renderer.

**Tech Stack:** TypeScript 5, Zod, Payload CMS 3, Next.js 15 App Router, Vitest, PostgreSQL migration generation.

---

### Task 1: Artifact contracts and canonical hash

**Files:**
- Create: `src/domain/reader-facing-page-artifact.ts`
- Modify: `src/domain/index.ts`
- Test: `tests/unit/reader-facing-page-artifact.test.ts`

**Steps:**
1. Write failing tests for the strict public allowlist, canonical serialization, stable SHA-256, and hash changes for title, description, sections, CTAs, links, FAQ, SEO, and structured-data input.
2. Run `npx vitest run tests/unit/reader-facing-page-artifact.test.ts` and confirm missing-contract failures.
3. Implement strict Zod contracts for artifact, validation result, internal-language result, semantic review, human approval, provenance, and publication record.
4. Exclude `artifactHash`, lifecycle, and timestamps from canonical serialization; normalize CRLF and recursively sort object keys while preserving array order.
5. Compute the hash server-side and reject an artifact whose stored hash differs from recomputation.
6. Re-run the focused tests.

### Task 2: Hash-bound governance and immutable lifecycle

**Files:**
- Create: `src/ai/governance/reader-facing-artifact-governance.ts`
- Modify: `src/ai/governance/index.ts`
- Test: `tests/unit/reader-facing-artifact-governance.test.ts`

**Steps:**
1. Write failing tests proving validation, language validation, semantic review, and human approval fail on any hash mismatch.
2. Add known internal-language leak codes for CMS/debug language, internal file paths, lifecycle labels, editorial prompts, and unrenderable raw internal URLs.
3. Require deterministic and language validation before semantic review can pass.
4. Require all reviews to pass before human approval is valid.
5. Require artifact lifecycle `approved`, matching approval, and matching publication record before a published decision can exist.
6. Prove drafts and incomplete linkages resolve to `not_public`.

### Task 3: Payload persistence and immutability

**Files:**
- Create: `src/payload/collections/ReaderFacingPageArtifacts.ts`
- Modify: `src/payload/collections/index.ts`
- Modify: `payload.config.ts`
- Generate: `src/migrations/<timestamp>_reader_facing_page_artifacts.ts`
- Generate: `src/migrations/<timestamp>_reader_facing_page_artifacts.json`
- Modify: `src/migrations/index.ts`
- Test: `tests/unit/reader-facing-artifact-payload.test.ts`

**Steps:**
1. Write failing collection tests for authenticated creation, server-computed hash, unique artifact/version, immutable hash, approved-artifact update/delete denial, and no automatic approval.
2. Add one `reader-facing-page-artifacts` collection with public artifact fields and logically separate provenance, validation, semantic review, human approval, and publication-record groups.
3. Keep collection reads authenticated by default; public routes use server-side Payload access only through the projection repository.
4. Enforce admin/editor/human role for human approval and publication records; agents may create drafts but cannot approve or publish.
5. Generate an additive migration and verify it contains no legacy-content DML or approval backfill.

### Task 4: Shared artifact publication projection

**Files:**
- Create: `src/lib/reader-facing-artifact-repository.ts`
- Rewrite: `src/lib/reader-facing-publication.ts`
- Modify: `src/lib/publication-surface-projection.ts`
- Modify: `src/app/(site)/[section]/[slug]/page.tsx`
- Modify: `src/app/(site)/problems/[slug]/page.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/llms.txt/route.ts`
- Test: `tests/unit/reader-facing-artifact-projection.test.ts`

**Steps:**
1. Write failing tests that a legacy record without an artifact returns no public page and appears in no discovery surface.
2. Write a positive fixture with approved artifact, matching reviews/approval/publication record, and prove page, metadata, schema, sitemap, and `llms.txt` use the same hash.
3. Implement one resolver that loads artifact versions and evaluates the exact hash-bound linkage.
4. Return no public projection unless every approved/published invariant passes.
5. Remove generic content/Problem Page catalogs and fixed legacy registries as public eligibility sources; preserve them for editorial/history tests only.
6. Make production dynamic routes return 404 for unresolved or legacy assets.

### Task 5: Exact renderer and safe preview

**Files:**
- Modify: `src/components/public-content-page.tsx`
- Modify: `src/components/problem-page.tsx` or replace both with one artifact renderer
- Create: `src/components/reader-facing-page.tsx`
- Create: `src/app/(site)/_review/artifacts/[artifactId]/page.tsx`
- Test: `tests/unit/reader-facing-artifact-renderer.test.ts`

**Steps:**
1. Write failing tests that the renderer consumes only `ReaderFacingPageArtifact` public fields and emits no audit/governance data.
2. Render section, CTA, links, FAQ, metadata input, and structured-data input deterministically from the artifact.
3. Use the same renderer for public and preview routes.
4. Make preview return 404 in production and require an explicit local/test preview mode otherwise.
5. Prove preview HTML content hashes back to the exact artifact fields used for review.

### Task 6: Draft 05 replacement artifact

**Files:**
- Create: `src/seed/draft-05-reader-facing-artifact.ts`
- Create: `docs/review/draft-05-reader-facing-page.md`
- Test: `tests/unit/draft-05-reader-facing-artifact.test.ts`

**Steps:**
1. Write failing tests for canonical ownership, required sections, diagnostic CTA, secondary fit-call CTA, internal links, no internal language, no unsupported company/outcome/metric/testimonial claims, and lifecycle `draft`.
2. Encode the reviewed diagnosis-first replacement content as one artifact version.
3. Compute its hash from the public allowlist.
4. Add deterministic and internal-language validation results bound to that hash.
5. Add a semantic-review result bound to the same hash only if every qualitative dimension has specific draft-grounded reasons.
6. Do not create human approval or a publication record.
7. Produce the human-review Markdown from the artifact, not as a second content source.

### Task 7: Verification and records

**Files:**
- Modify: `PLANS.md`
- Create: `TASK_073_READER_FACING_PAGE_ARTIFACT_BOUNDARY.md`

**Steps:**
1. Run all new focused suites and existing publication, sitemap, schema, approval, and visibility suites.
2. Run `npm test`, `npm run typecheck`, `npm run build`, and `git diff --check`.
3. Confirm migration has no `INSERT`, `UPDATE`, or `DELETE` statements.
4. Record removed/quarantined legacy surfaces, replacement artifact ID/version/hash, validation results, preview instructions, and explicit human-review stop point.
5. Mark Task 073 complete only if local code/tests pass and Draft 05 remains non-public.
6. Do not commit, push, deploy, publish, apply the migration, or create another content asset.
