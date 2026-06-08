# Authority Engine Alpha Release

Release date: 2026-06-08

## Graph status

- Canonical entities: 9
- Canonical relationships: 8
- Approved insights: 1
- Idempotent graph seeding: verified
- Orphan relationships: none

## Entity and authority counts

- Authority surface assets: 3
- Authority asset production sprint assets: 10
- Expanded review-ready authority assets: 10
- Review status assets: 9
- Draft status assets: 1

## Landing pages and public routes

- `/`
- `/ai-first-leadership`
- `/book-a-fit-call`
- `/invisible-executor-assessment`
- `/tech-leadership-visibility-scorecard`
- `/[section]`
- `/[section]/[slug]`

The build currently emits 14 routes total, including the public authority pages above.

## Design system

- Minimal, authority-focused, mobile-first styling
- Strong readable typography and stable content width
- No animations, transitions, shadows, gradients, transforms, filters, or blend modes in public styles
- Long-form content layout optimized for scanability and AI extraction

## Validation

- `npm run typecheck`: pass
- `npm test`: pass
- `npm run build`: pass
- Build warnings: 4 pre-existing migration warnings in `src/migrations/20260607_205054.ts`

## Known limitations

- The content layer still uses draft/review gating; no automatic publishing is enabled.
- Some content assets remain review-safe rather than published.
- The migration file still emits the same unused-parameter warnings during build.
- Local-only editor and tooling artifacts were present during the audit but are excluded from the release history.

## Release intent

This snapshot is the GitHub source of truth for the current Authority Engine alpha state before additional growth, SEO, or integration work.
