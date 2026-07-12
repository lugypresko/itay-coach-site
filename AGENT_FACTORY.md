# Agent Factory Contracts

## Purpose

This repo now defines the codex-run agent factory as contracts first. The goal is to lock the architecture before any runtime orchestration, provider calls, or LangGraph execution exists.

## Boundary

- No runtime content generation in Task 025.
- No provider calls in Task 025.
- No LangGraph execution in Task 025.
- No automatic publishing in Task 025.
- No Payload writes from agents in Task 025.

Deterministic functions own rule-based schema selection, linking, quality checks, freshness checks, routing, and publish permission. Agents are reserved for semantic work that needs interpretation.

## Contract Rules

- `ApprovedInsight` requires `approvedBy`, `approvedAt`, and at least one `targetQuery`.
- `KnowledgeAsset` is the canonical output contract.
- Agent-authored assets must never enter `published` state.
- The highest contract state allowed for agent-authored knowledge assets is `approved`.
- Publishing remains a human Payload action.
- `DistributionAsset` is draft-only and review-gated.

## Factory Agents

The factory keeps only semantic agent roles in the active core:

1. `InsightExtractionAgent`
2. `ResearchSynthesisAgent`
3. `ContentDraftingAgent`

Legacy names such as `MarketIntelligenceAgent`, `OutlineAgent`, and `PayloadPublisherAgent` are compatibility labels that map to deterministic services or deprecated boundaries, not new runtime autonomy.

`PerformanceLearningAgent` is intentionally deferred to Task 031.

## Deferred Agent Specs

### Chief of Staff Agent

Status: deferred

Canonical operating model:
- `docs/cos/CHIEF_OF_STAFF_OPERATING_MODEL.md`
- `docs/cos/README.md`

Purpose:
- Turn operational signals into the next best action for the authority engine.
- Act as a decision-support layer, not a content generator.

Inputs:
- Traffic
- Leads
- Content inventory
- Published assets
- GSC
- Player Trap funnel

Outputs:
- Next best action

Example outputs:
- "Don't create more content. Publish the 5 recommendation pages."
- "Stop publishing. Build more evidence."
- "Player Trap converts poorly. Improve report page."

Constraints:
- No autonomous publishing.
- No provider calls.
- No runtime agent registry entry until the release freeze is lifted.
- No duplicate role that overlaps with `VisibilityMonitorAgent` metrics ownership.
- No agent may own deterministic routing, scoring, or publication permission.

Ownership boundary:
- `VisibilityMonitorAgent` measures and classifies authority visibility gaps.
- `Chief of Staff Agent` recommends the next operational move after those gaps are known.

## Storage Notes

- Approved insights may map to `InsightExtractions` if that storage already exists.
- `KnowledgeAsset` may map onto Payload later.
- Claim ledger storage is deferred.
- Distribution assets should remain reviewable drafts until a human approves publication.

## Implementation Notes

- Prompt shells are static metadata only.
- Schemas are validated in tests.
- Runtime orchestration is intentionally absent until Task 026.
