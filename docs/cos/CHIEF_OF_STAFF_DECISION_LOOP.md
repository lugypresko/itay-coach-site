# Chief of Staff Decision Loop

Status: Active

Owner: Authority Engine

## Purpose

This document defines the minimal decision loop for the Chief of Staff layer.

It exists to keep prioritization deterministic, evidence-bound, and human-safe.

It does not add runtime orchestration by itself.

It does not authorize publishing.

## Decision Loop

Every Chief of Staff run must follow this order:

1. Read state.
2. Identify the bottleneck.
3. Decide the next best action.
4. Check whether the action crosses a human approval boundary.
5. Assign the most relevant specialist agent if analysis is still needed.
6. Require evidence before any recommendation becomes actionable.
7. Return to the stop point and wait for the next signal.

## Required Outputs

Each run must emit:

- `current_state`
- `current_bottleneck`
- `next_best_action`
- `recommended_owner`
- `evidence_required`
- `human_approval_required`
- `stop_point`

## Stop Conditions

The Chief of Staff must stop when any of the following is true:

- the next step crosses a governance boundary
- publishing is involved
- strategy changes are involved
- evidence is missing or stale
- the recommendation would create unsupported claims
- the next step depends on a fresh approved Itay insight that does not exist yet
- the system needs a human to choose between two valid but different priorities

## Agent Selection

If analysis is needed, the Chief of Staff should delegate to the single specialist that best matches the signal:

- Approved Insight Analyst for insight freshness and coverage
- Knowledge Asset Analyst for insight-to-asset gaps
- Authority Graph Analyst for entity and relationship gaps
- Gap Detection Analyst for missing public surfaces
- SEO Strategist for recommendation-intent and internal-link gaps
- Publishing Coordinator for readiness and approval status
- Performance Analyst for post-launch signals
- Recommendation Synthesizer for constrained next-best-action packaging

## Evidence Rule

No recommendation may move forward without evidence.

The evidence requirement must answer:

- what source supports the claim
- what signal triggered the recommendation
- why this is the next best action
- what the recommendation should not build yet

## Human Boundary Rule

The Chief of Staff must stop and ask for human review when:

- the action would publish content
- the action would change strategy
- the action would create or expand a governed contract
- the action would cross an approval boundary
- the evidence is insufficient to support the move

## Return To Stop Point

After the Chief of Staff emits a recommendation, it must preserve the stop point.

The next execution should resume from the preserved state rather than re-deciding from scratch.

This makes the loop auditable and prevents recommendation drift.

## Relationship To LangGraph

LangGraph is optional infrastructure.

This decision loop is the contract that should exist before any LangGraph implementation.

If LangGraph is added later, it should execute this loop, not redefine it.

