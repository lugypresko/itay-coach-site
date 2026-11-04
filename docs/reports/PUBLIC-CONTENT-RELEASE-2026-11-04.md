# Public content release review

Scope: Preview only; no Production release or main merge authorized.

## Baseline and selected source

- Live Production inspected through Vercel: `dpl_EprWpS42468gF1mMXae7GDNfrTDb`, commit `6722fa3603e9292ef2b4b8275f7fae178f20b3fa`.
- Release branch: `fix/public-content-release`, created directly from that commit.
- Selected visitor copy and rendering from `f4509276509ce781e789808644aeaa41bc440286`.
- Excluded seed writes and unrelated coverage/diagnostic test changes from that commit. No seed runner was executed.

## Changes

- Three detail routes prefer reviewed repository content before reading stale CMS content: `/pillars/tech-leadership-coaching`, `/frameworks/player-trap`, `/frameworks/invisible-executor`.
- `/pillars` and `/frameworks` use visitor-facing headings, descriptions and sidebar text instead of collection/schema/authority-graph/CTA-planning labels. Existing destinations and layout classes are retained. Other section indexes retain their existing behavior.
- Framework card description now describes the leadership pattern rather than ownership of a proprietary model.
- Shared content renderer supports Markdown headings, lists, bold and links using React nodes; no raw HTML injection. This is a shared renderer and needs visual review on other public detail pages.
- Unverified `1000+ coaching hours` claim omitted. No new metric or testimonial added.
- No diagnostic, provider, delivery, booking, schema, dependency or environment changes.

## Validation

- 19 focused tests passed, including real server-rendered markup for both indexes and all three detail pages, stale published CMS fixtures, existing link targets and metadata.
- Typecheck passed.
- Full Next build passed; existing unrelated lint warnings remain.
- Deployed browser QA pending; do not infer browser PASS from the build.
- Diff checks include zero changes in diagnostic/API/migrations/dependency paths.

## Review and eventual release

Review the exact release commit, five Preview routes on desktop/mobile, internal links and shared renderer. A READY build alone is not browser acceptance. Preview authentication remains enabled.

Only after explicit approval: recheck live Production baseline; if it changed, review the new diff before release. Do not deploy main wholesale. Use a separately approved Production build of this exact release tree, retaining current Production environment configuration and diagnostic version. Verify five routes, homepage and existing diagnostic after release. No V3 enablement is included.

Rollback: restore recorded Production deployment `dpl_EprWpS42468gF1mMXae7GDNfrTDb` / `6722fa3` through Vercel. No data or environment rollback is required. Keep V3 Preview separate.

Remaining limitation: CMS still contains its historical planning records; this repair overrides only the three named visitor routes and does not mutate or reapprove CMS data. Other public surfaces are outside this bounded repair.
