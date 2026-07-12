# Production Observation Refresh Design

## Objective

Refresh the post-publication state from live production evidence and issue one auditable Chief of Staff decision.

## Observation Boundary

The run checks the canonical production site, sitemap, robots policy, `llms.txt`, published authority routes, structured data, CTAs, internal links, analytics markers, and the repository backlog. It does not call ChatGPT, Perplexity, Gemini, or another answer-engine provider.

## Decision Boundary

Observed production facts are separated from unavailable recommendation-position data. The Chief of Staff uses the existing decision loop and safe next-action categories, preserves the human publishing gate, and stops when the next step requires external measurement or approval.

## Outputs

- `TASK_058_PRODUCTION_OBSERVATION.md`
- `TASK_058_CHIEF_OF_STAFF_DECISION.md`
- Task verification notes in `PLANS.md`
