# Authority Outcome Mapping

## Purpose

This document defines how `PerformanceSignal` records map into `AuthorityOutcome` records before the Chief of Staff Agent is formalized.

It is documentation only. It does not add runtime agents, provider calls, autonomous decision-making, or publishing changes.

## Contract Alignment

This mapping follows the existing contract shape in `DATA_CONTRACTS.md` and `src/ai/agents/agentFactoryContracts.ts`:

- `PerformanceSignal.signalState` distinguishes `observed` from `placeholder`.
- `AuthorityOutcome.focus` identifies the business outcome being optimized.
- `AuthorityOutcome.status` is one of `healthy`, `watch`, `at_risk`, or `blocked`.
- `AuthorityOutcome.nextBestAction` must stay operational and human-reviewable.

## Signal To Outcome Map

| AuthorityOutcome focus | Primary signal inputs | What it means | Human owner suggestion |
| --- | --- | --- | --- |
| `authority_visibility` | `ai_mention`, `ai_citation`, `query_visibility` | Whether the authority engine is being surfaced and cited by answer engines and search surfaces. | Visibility / SEO owner |
| `content_inventory_health` | `content_source`, `page_view`, `query_visibility` | Whether the content inventory exists, is traceable, and is showing signs of being used. | Content operations owner |
| `content_release_velocity` | `content_source`, `page_view`, `cta_click` | Whether approved content is moving from source material into public assets at a healthy pace. | Content publisher / editor |
| `lead_pipeline_quality` | `lead_source`, `diagnosis_call_request`, `booked_call`, `close_rate` | Whether the funnel is producing qualified leads and booked calls rather than weak intent. | Revenue / funnel owner |
| `player_trap_conversion` | `assessment_completion`, `diagnosis_call_request`, `booked_call`, `close_rate` | Whether the Player Trap funnel is converting diagnostic intent into downstream action. | Funnel owner |
| `search_visibility_health` | `query_visibility`, `ai_mention`, `ai_citation` | Whether the site is visible for target queries and discoverable through answer engines. | SEO / visibility owner |

## Status Rules

### `healthy`

A focus is `healthy` when:

- At least one `PerformanceSignal` is `observed`.
- No signal in the mapped set is a weak conversion or visibility signal with `value <= 0`.
- The focus has enough evidence to support a clear next move without escalating.

### `watch`

A focus is `watch` when:

- At least one mapped signal is still a `placeholder`, or
- Coverage exists but the outcome is not yet stable enough to call `healthy`.

Use `watch` when the system has a direction, but the evidence set is still incomplete.

### `at_risk`

A focus is `at_risk` when:

- A mapped observed signal shows weak performance, especially on:
  - `booked_call`
  - `close_rate`
  - `query_visibility`
- The current evidence suggests the focus is moving the wrong way or converting too slowly.

### `blocked`

A focus is `blocked` when:

- No signals are available for that outcome.

Blocked means the system cannot make a responsible operational recommendation yet. In the current contract implementation, this maps to an empty signal set.

## Valid Next Best Action Categories

`nextBestAction` must stay inside one of these operational categories:

- `publish_more_evidence`
- `stop_publishing`
- `improve_conversion_path`
- `repair_visibility_gap`
- `repair_inventory_gap`
- `refresh_authority_asset`
- `request_human_review`
- `tighten_internal_links`
- `improve_measurement`

Guidelines:

- Use action language that a human owner can execute.
- Avoid autonomous or provider-specific instructions.
- Avoid broad strategy language that cannot be acted on directly.
- Avoid publishing decisions that bypass human review.

## Human Owner Suggestions

Owner suggestions should describe the most likely human function responsible for the fix.

Recommended patterns:

- `Visibility / SEO owner` for `authority_visibility` and `search_visibility_health`
- `Content operations owner` for `content_inventory_health`
- `Content publisher / editor` for `content_release_velocity`
- `Revenue / funnel owner` for `lead_pipeline_quality`
- `Funnel owner` for `player_trap_conversion`

Owner suggestions are guidance, not runtime routing.

## Examples

- `authority_visibility`
  - Signals: `ai_mention`, `ai_citation`, `query_visibility`
  - Safe action: `repair_visibility_gap`
  - Owner: `Visibility / SEO owner`

- `content_inventory_health`
  - Signals: `content_source`, `page_view`, `query_visibility`
  - Safe action: `repair_inventory_gap`
  - Owner: `Content operations owner`

- `content_release_velocity`
  - Signals: `content_source`, `page_view`, `cta_click`
  - Safe action: `publish_more_evidence`
  - Owner: `Content publisher / editor`

- `lead_pipeline_quality`
  - Signals: `lead_source`, `diagnosis_call_request`, `booked_call`, `close_rate`
  - Safe action: `improve_conversion_path`
  - Owner: `Revenue / funnel owner`

- `player_trap_conversion`
  - Signals: `assessment_completion`, `diagnosis_call_request`, `booked_call`, `close_rate`
  - Safe action: `improve_conversion_path`
  - Owner: `Funnel owner`

- `search_visibility_health`
  - Signals: `query_visibility`, `ai_mention`, `ai_citation`
  - Safe action: `repair_visibility_gap`
  - Owner: `Visibility / SEO owner`

## Chief Of Staff Boundary

The Chief of Staff Agent remains deferred.

This mapping is the prerequisite layer that defines:

- which signals are relevant,
- what business outcome they feed,
- how status is interpreted,
- which safe next actions are allowed,
- and which human owner should review the result.

Only after this outcome layer is stable should the Chief of Staff Agent be formalized in `DATA_CONTRACTS.md`.
