# Workspace Diff Report

Snapshot date: 2026-06-08

## Overview

This report captures the current local workspace before the alpha snapshot commits are split and pushed.

## Modified tracked files

- `.gitignore`
- `PLANS.md`
- `docs/seed-content/case-study-new-engineering-manager.md`
- `docs/seed-content/invisible-executor-framework.md`
- `docs/seed-content/itay-foyerstein-entity.md`
- `docs/seed-content/tech-leadership-coaching-pillar.md`
- `docs/seed-content/the-push-methodology.md`
- `package-lock.json`
- `src/app/(site)/layout.tsx`
- `src/app/globals.css`
- `src/components/public-content-page.tsx`
- `src/lib/public-content-loader.ts`
- `src/lib/public-content.ts`
- `src/payload/collections/content.ts`
- `src/seed/authority-seed.ts`
- `tests/unit/authority-seed.test.ts`
- `tests/unit/payload-visibility-monitoring.test.ts`
- `tests/unit/public-content.test.ts`

## Deleted files

- `.eslintignore`

## Untracked files

### Authority graph and verification

- `AUTHORITY_GRAPH_MODEL.md`
- `ENTITY_AUTHORITY_BASELINE_SNAPSHOT.md`
- `EVIDENCE_COLLECTION.md`
- `QUERY_AUTHORITY_BASELINE_SNAPSHOT.md`
- `RELEASE_READINESS_CHECKLIST.md`
- `TASK_012_VERIFICATION_REPORT.md`
- `TASK_013_VERIFICATION_REPORT.md`
- `TASK_018_VERIFICATION_REPORT.md`
- `docs/Task 012 - Minimum Authority Graph Seed.MD`

### Authority seed and rendering

- `docs/seed-content/itay-foyerstein-entity.md`
- `eslint.config.mjs`
- `prisma.config.ts`
- `prisma/schema.prisma`
- `src/components/authority-trust-blocks.tsx`
- `src/seed/authority-surface-seed.ts`
- `src/seed/load-env.ts`
- `src/seed/minimum-authority-graph.ts`
- `src/seed/run-authority-surface-seed.ts`
- `src/seed/run-minimum-authority-graph-seed.ts`
- `src/seed/verify-authority-surface-seed.ts`
- `src/seed/verify-minimum-authority-graph.ts`
- `src/styles/base.css`
- `src/styles/components.css`
- `src/styles/layout.css`
- `src/styles/tokens.css`
- `src/styles/typography.css`
- `tests/unit/authority-design-system.test.ts`
- `tests/unit/authority-surface-seed.test.ts`
- `tests/unit/minimum-authority-graph-seed.test.ts`

### Local-only tooling artifacts

- `.agents/`
- `.vscode/`
- `output/`
- `skills-lock.json`
- `docs/Create Task 015 - Authority Evidenc.md`
- `docs/Itay Feuerstein.MD`

## Estimated task ownership

| Task | Local work visible in this snapshot |
|---|---|
| Task 012 | Minimum graph seed, verification reports, graph model docs, Prisma scaffolding, seed loader, and verification tests |
| Task 013 | Authority surface seed, public content rendering, canonical authority seed updates, and surface verification tests |
| Task 014 | Minimal authority design system, authority trust blocks, and style contract test |
| Task 017 | Already present in branch history as `a07f9c9`; not part of the current local diff |
| Task 018 | Expanded authority content docs and `TASK_018_VERIFICATION_REPORT.md` |

## Notes

- The working tree also includes local-only environment artifacts and editor folders. These are not intended for source control and were added to `.gitignore` during release prep.
- The alpha snapshot should leave the repository clean after the grouped commits are applied and pushed.
