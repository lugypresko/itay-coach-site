# Public content publication record — 2026-09-12

## Scope

The user explicitly authorized publication (`פרסם`) of the buyer-facing drafts. The publication scope is limited to the existing reader-facing routes:

- `/pillars/tech-leadership-coaching` — commercial pillar
- `/problems/engineering-managers-stuck-in-firefighting` — Engineering Manager bottleneck problem page

The problem page uses approved framework evidence already present in the repository. No client case study, outcome, or transcript detail is presented as proof.

## Publication gates

- Both records are `published` and indexable through the shared publication decision.
- Canonical URLs are self-referential on the production domain.
- The routes are included in the production sitemap and `llms.txt` projection, including the static approved fallback used when Payload is unavailable during deploy.
- The existing noindex boundary for review/draft content remains in place.

## Approval provenance

Approval source: direct user instruction in the active session (`פרסם`).

The exact deployed revision is identified by the Git commit that contains this record and the route/content changes. Deploy verification is recorded separately in `docs/PRODUCTION_VERIFICATION_2026-09-12.md`.
