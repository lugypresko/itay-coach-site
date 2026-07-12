# Chief of Staff Delegation Matrix

Version: 1.0

Status: Active

Owner: Authority Engine

## Purpose

Define which specialist worker owns which deterministic analysis step, what triggers that worker, what output contract it must produce, and when the result escalates to the Chief of Staff or human review.

This document is documentation only.

It does not add runtime behavior.

It does not change governance.

## Delegation Rules

- Each worker has one primary trigger condition.
- Each worker must emit one required output contract.
- Each worker must define an escalation path.
- If two workers could own the same signal, the conflict resolution rule decides ownership deterministically.
- No worker may publish autonomously.
- No worker may modify governance.
- No worker may override human approval.

## Matrix

| Worker | Trigger conditions | Required output contract | Escalation path |
|---|---|---|---|
| Approved Insight Analyst | Approved insights inventory changes, freshness expires, or insight coverage is incomplete | Insight coverage report with topic density, source gaps, and freshness flags | Escalate to Chief of Staff when coverage is too thin; escalate to human review when evidence is stale or missing |
| Knowledge Asset Analyst | Approved insights exist without matching KnowledgeAssets, or asset linkage is incomplete | Knowledge asset conversion report with coverage, conversion gaps, and source insight linkage quality | Escalate to Chief of Staff when backlog blocks the next factory step; escalate to human review when source linkage is ambiguous |
| Authority Graph Analyst | Entities, relationships, frameworks, or published assets change or appear under-connected | Authority graph gap report with entity gaps, weak authority zones, and relationship opportunities | Escalate to Chief of Staff when graph gaps affect priority; escalate to human review when canonical naming or ownership is unclear |
| SEO Strategist | Published pages exist, sitemap changes, or recommendation-intent coverage is uneven | SEO opportunity report with recommendation-intent gaps, discoverability gaps, and internal linking recommendations | Escalate to Chief of Staff when discoverability gaps should change the next priority; escalate to human review when a recommendation would change strategy |
| Gap Detection Analyst | KnowledgeAssets exist without clear public surfaces, or content inventory is missing a surface type | Missing surface report with missing pages, clusters, landing pages, FAQs, and framework support | Escalate to Chief of Staff when missing surfaces define the next best action; escalate to human review when filling the gap requires a strategy decision |
| Publishing Coordinator | Publish-readiness review exists, or human approval records are present | Publish-ready inventory with blockers, non-blocking improvements, and approval checklist status | Escalate to human approval when publication is possible; escalate to Chief of Staff when readiness should change priority |
| Performance Analyst | Post-launch signals, GSC, PostHog, or authority outcomes change | Performance summary with signal patterns, outcome patterns, bottleneck patterns, and visibility deltas | Escalate to Chief of Staff when performance should change the next recommendation; escalate to human review when signals are ambiguous |
| Recommendation Synthesizer | Specialist outputs are available and a single next-best-action recommendation is needed | Recommendation record with next best action, category, rationale, human owner suggestion, and what not to build yet | Escalate to Chief of Staff when the recommendation cannot be constrained safely; escalate to human review when the next step crosses a governance boundary |

## Required Output Contracts

### Approved Insight Analyst

- `insightCoverage`
- `topicDensity`
- `insightOpportunities`
- `sourceGaps`
- `freshnessFlags`

### Knowledge Asset Analyst

- `assetCoverage`
- `conversionGaps`
- `missingAssets`
- `inReviewBacklog`
- `sourceInsightLinkageQuality`

### Authority Graph Analyst

- `entityGaps`
- `weakAuthorityZones`
- `relationshipOpportunities`
- `missingAuthorityReinforcement`

### SEO Strategist

- `seoOpportunities`
- `recommendationIntentGaps`
- `internalLinkingRecommendations`
- `crawlabilityGaps`
- `indexabilityGaps`

### Gap Detection Analyst

- `missingPages`
- `missingClusters`
- `missingLandingPages`
- `missingFAQs`
- `missingFrameworkSupport`

### Publishing Coordinator

- `publishReadyInventory`
- `publishingRecommendations`
- `blockers`
- `nonBlockingImprovements`
- `approvalChecklistStatus`

### Performance Analyst

- `signalPatterns`
- `outcomePatterns`
- `bottleneckPatterns`
- `visibilityDeltas`
- `performanceSummaries`

### Recommendation Synthesizer

- `nextBestAction`
- `recommendationCategory`
- `rationale`
- `humanOwnerSuggestion`
- `whatNotToBuildYet`

## Conflict Resolution Rule

When more than one worker could own the same signal, use the following order:

1. Approved Insight Analyst
2. Knowledge Asset Analyst
3. Authority Graph Analyst
4. Gap Detection Analyst
5. SEO Strategist
6. Publishing Coordinator
7. Performance Analyst
8. Recommendation Synthesizer

This order is deterministic.

It favors source integrity and structural gaps before optimization and recommendation synthesis.

If a conflict remains after applying the order, the Chief of Staff owns the final delegation decision and the disputed item must be escalated to human review.

## Non-Goals

- No runtime implementation.
- No agent registry changes.
- No provider calls.
- No publishing behavior.
- No governance changes.

