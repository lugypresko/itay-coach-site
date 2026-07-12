# Task 058 - Chief of Staff Decision

## Decision identity

- Decision ID: `task-058-chief-of-staff-decision-2026-07-12`
- Date: `2026-07-12`
- Source observation: `TASK_058_PRODUCTION_OBSERVATION.md`
- Decision status: review-ready

## current_state

- Google impressions: 147.
- Google clicks: 1.
- Dominant page: `/pillars/tech-leadership-coaching`.
- Dominant query: `technical leadership coaching`.
- Problem Pages visible in GSC: 0.
- Customer conversion measurement: unavailable.
- AI recommendation visibility: unmeasured.
- Production deployment: `Ready`.
- Sitemap URLs returning 200: 50 of 50.

The public release state remains inconsistent. Ten Problem Pages are in the sitemap, nine are `noindex`, and `CTO Becomes the Bottleneck` is simultaneously marked published in the repository, promoted in `llms.txt`, included in the sitemap, and noindexed in production.

## current_bottleneck

- Classification: `publication_state_integrity`.
- Evidence:
  - `10_problem_pages_in_sitemap`
  - `9_problem_pages_noindexed`
  - `0_problem_pages_visible_in_gsc`
  - `published_page_noindexed`

The system cannot interpret later visibility measurements responsibly while sitemap inclusion, repository status, Payload state, and live indexability disagree. The 40-insight conversion backlog remains secondary until release-state integrity is restored.

## next_best_action

- Type: `repair_visibility_gap`.
- Scope:
  - `align_payload_status`
  - `align_robots_meta`
  - `align_sitemap`
  - `align_llms_txt`
  - `resolve_draft_backlog`
  - `verify_internal_links_from_pillar`
- Action: run a human-reviewed publication-state reconciliation for all 10 Problem Pages, then open a clean measurement window.
- Sequence:
  1. Resolve the `CTO Becomes the Bottleneck` published/noindex conflict.
  2. Confirm that the eight draft pages should remain non-indexable and remove them from discovery surfaces until approved.
  3. Recheck live metadata, sitemap, and `llms.txt` after the approved correction.
  4. Run a separately authorized answer-engine baseline and record recommendation position, citations, competitors, and score delta for future comparisons.

## recommended_owner

Engineering, with human publication approval and Visibility / SEO verification.

## evidence_required

- Human approval record for every Problem Page allowed to become indexable.
- Payload and repository status comparison for all 10 Problem Pages.
- Post-change HTTP evidence showing sitemap membership and robots metadata agree.
- Vercel Analytics event totals or an explicit statement that no events were observed.
- Query-level observations from each separately authorized answer-engine platform before claiming visibility improvement.

## human_approval_required

Yes. Changing indexability or sitemap membership changes the public publication surface. The Chief of Staff may recommend the reconciliation but may not approve or publish the pages.

## stop_point

- `publication_states_are_consistent`
- `approved_pages_are_indexable`
- `drafts_are_excluded`
- `production_validation_passes`
- `measurement_window_is_opened`

Stop at the human publication-state decision. Do not generate new content, index drafts, or claim improved AI recommendation visibility before these conditions are satisfied.

## why_this_is_next

The production surface is technically healthy enough to observe, but contradictory discovery signals make visibility outcomes difficult to interpret. Fixing this bounded release-state gap creates a trustworthy measurement baseline without requiring new content or a fresh insight.

## what_not_to_build_yet

- No new authority pages.
- No conversion of the remaining 40 insights.
- No runtime agents or LangGraph workflow.
- No automated publishing.
- No broad distribution automation.
- No claimed AI visibility improvement without query-level observations.
