# Public content publication record — 2026-09-12

## Scope

The user explicitly authorized publication (`פרסם`) of the buyer-facing drafts. The publication scope covers the existing reader-facing routes and the LinkedIn-derived assets released today:

- `/pillars/tech-leadership-coaching` — commercial pillar
- `/problems/engineering-managers-stuck-in-firefighting` — Engineering Manager bottleneck problem page
- `/problems/product-engineering-misalignment` — English problem page derived from the approved LinkedIn source
- `/he/problems/product-engineering-misalignment` — Hebrew editorial equivalent
- `/artifacts/minimum-viable-decision-brief` — supporting decision artifact

The problem page uses approved framework evidence already present in the repository. No client case study, outcome, or transcript detail is presented as proof.

## Publication gates

- Both records are `published` and indexable through the shared publication decision.
- Canonical URLs are self-referential on the production domain.
- The routes are included in the production sitemap and `llms.txt` projection, including the static approved fallback used when Payload is unavailable during deploy.
- The existing noindex boundary for review/draft content remains in place.
- `/player-trap` is the public diagnostic conversion route; `/book-a-fit-call` remains `noindex, follow` and is excluded from the sitemap.

## Approval provenance

Approval source: direct user instruction in the active session (`פרסם`).

The latest production revision is `fccf4fa` (`dpl_EhMucLZRgYpz9merf4LFieo5r7Nr`). Deploy verification is recorded separately in `docs/PRODUCTION_VERIFICATION_2026-09-12.md`.
