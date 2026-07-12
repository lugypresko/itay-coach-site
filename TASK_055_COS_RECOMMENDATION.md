# Task 055 - Chief of Staff Recommendation

## recommendation_id

task-055-canonical-authority-sprint

## date

2026-06-17

## current_state

- Task 053 identified weak proof / trust as the primary customer-path bottleneck.
- Task 054 attached the first proof-backed trust layer to the highest-intent pages.
- The next customer-path risk is that authority is spread across too many surfaces while five customer-intent pages need to carry discovery, trust, and CTA movement.
- The requested sprint is constrained to five pages and explicitly avoids broad content expansion, new architecture, new governance, and new analytics systems.

## current_customer_path_stage

Discovery -> Trust -> CTA.

## bottleneck

The five highest-intent canonical pages are not yet concentrated enough as the primary crawlable and internally linked authority path into a diagnostic or fit call.

## highest_leverage_move

Execute the Canonical Authority Sprint for the five target pages only:

- `/pillars/tech-leadership-coaching`
- `/frameworks/player-trap`
- `/frameworks/invisible-executor`
- `/problems/cto-becomes-the-bottleneck`
- `/problems/vp-rnd-losing-execution-control`

This directly compounds the proof layer from Task 054 by making the pages easier to discover, easier to trust, and clearer to act on.

## what_not_to_do

- Do not create a broad content batch.
- Do not create ten new pages.
- Do not add new architecture, governance, or analytics systems.
- Do not publish content automatically.
- Do not weaken the single-CTA path with competing offers.

## recommended_next_action

Assign Task 055 back to Codex for implementation under the existing sprint constraints.

## expected_customer_path_stage_after_execution

Target visitors and AI crawlers should find a clearer path from canonical discovery pages into trust evidence and one CTA:

Discovery -> Trust -> CTA -> Qualified Conversation.

## observable_customer_impact

- Five target pages become indexable and sitemap-backed.
- Each target page receives at least five meaningful internal links.
- Evidence and related-page blocks make trust evaluation easier.
- CTA analytics can distinguish diagnostic clicks from fit-call clicks.

## recommendation_level

executive

## owner

Codex implementation, delegated by Chief of Staff.

## execution_summary

- Added `/frameworks/player-trap` as a canonical, published framework fallback.
- Confirmed the canonical target set:
  - `/pillars/tech-leadership-coaching`
  - `/frameworks/player-trap`
  - `/frameworks/invisible-executor`
  - `/problems/cto-becomes-the-bottleneck`
  - `/problems/vp-rnd-losing-execution-control`
- Added deterministic inbound-link coverage with at least five meaningful internal links per target.
- Added evidence/proof blocks, breadcrumb schema, related-page blocks, and one primary CTA per target page.
- Added target analytics events:
  - `target_page_view`
  - `target_cta_click`
  - `diagnostic_click`
  - `fit_call_click`
- Updated `llms.txt` so AI readers see the canonical sprint targets directly.

## verification_summary

- `npm test` passed: 29 test files, 105 tests.
- `npm run typecheck` passed.
- `npm run build` passed with pre-existing lint warnings in migrations and seed files.
- Local smoke check passed for all five target routes.
