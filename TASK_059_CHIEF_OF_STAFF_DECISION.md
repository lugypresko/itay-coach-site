# Task 059 — Chief of Staff Decision

Decision date: `2026-07-12`
Decision status: `pending_human_deployment_approval`
Owner: Engineering
Business North Star: Qualified Customer Conversations → Paying Clients

## Current state

Local implementation derives route metadata, sitemap inclusion, and `llms.txt` eligibility from one deterministic `PublicationDecision`. Two published Problem Pages are eligible; eight drafts remain excluded and unapproved. The local operating cycle persists exactly one Next Best Action. Live Payload, GSC, and Vercel integrations were unavailable in this run.

## Bottleneck and evidence

Primary bottleneck: publication-state integrity. Evidence: pre-repair production observation dated `2026-07-12T16:05:48.0949820+03:00`, plus local tests reproducing the prior surface disagreement. Confidence is high for the repository defect, limited for current production because no deployment occurred.

## Exactly one Next Best Action

`repair_visibility_gap` — review the local change, authorize deployment if appropriate, then run the post-deployment Production Observation against the two published Problem Pages and discovery surfaces.

Target IDs: `cto-becomes-the-bottleneck`, `vp-rnd-losing-execution-control`, sitemap, `llms.txt`, `/pillars/tech-leadership-coaching`.

Expected impact: restore indexable authority discovery and create a trustworthy baseline for qualified discovery measurement.

Required evidence: deployment identifier or timestamp, live HTTP status, robots/meta robots, canonical, schema, internal links, sitemap, `llms.txt`, and analytics instrumentation.

Human approval is required before deployment or publication-state changes. Stop point: before deployment. Review date: `2026-07-13` or immediately after authorized deployment.

What not to do: do not publish the eight drafts, call ChatGPT/Perplexity, infer AI visibility from traffic, or open a production measurement window during local verification.

Pending follow-up action: **Run post-deployment Production Observation**.
