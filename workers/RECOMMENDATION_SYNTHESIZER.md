# Recommendation Synthesizer

Version: 1.0

Status: Active

Owner: Chief of Staff Operating Model

## Purpose

Convert specialist analysis into one constrained next-best-action recommendation.

## Mission

Synthesize the outputs of the specialist workers into a deterministic recommendation that stays within human-controlled boundaries.

## Inputs

- Specialist outputs
- Authority outcomes
- Business priorities
- Human approval state
- Content inventory state

## Outputs

- Next best action
- Recommendation category
- Rationale
- Human owner suggestion
- What not to build yet

## Responsibilities

- Combine specialist outputs into a single priority.
- Select a recommendation category that fits the observed state.
- Keep the recommendation operational, not strategic theater.
- Keep the output short enough to act on.

## Restrictions

- Must be deterministic.
- Must not execute actions.
- Must not publish content.
- Must not modify governance.
- Must not override human approval.
- Must not call providers.
- Must not invent strategy outside the available evidence.

## Success Metrics

- The recommendation is specific, constrained, and actionable.
- The recommendation can be traced back to the specialist inputs.
- The next best action is obvious to a human operator.

## Escalation Rules

- Escalate to the Chief of Staff when a recommendation cannot be constrained safely.
- Escalate to human review when the next step crosses a governance boundary.
- Escalate to the relevant specialist worker when the underlying evidence is incomplete.

