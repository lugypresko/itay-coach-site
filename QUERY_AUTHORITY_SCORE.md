# QUERY_AUTHORITY_SCORE.md

## Purpose

This document defines the score used to measure whether Itay Foyerstein is becoming more visible and more recommendable across target AI recommendation queries.

## Scope

Scoring is tracked per:

- query
- platform
- review date

The system must record:

- `previousScore`
- `currentScore`
- `scoreDelta`
- `checkedAt`

## 100-Point Rubric

### Positive Signals

- Itay mentioned: `+20`
- The Push mentioned: `+15`
- Direct recommendation: `+25`
- Appears in top 3 recommendations: `+15`
- URL cited: `+15`
- Proprietary framework mentioned: `+10`

### Penalties

- Competitor recommended above Itay: `-10`
- Wrong positioning: `-10`
- Unsupported or hallucinated claim: `-20`

## Recommendation Visibility Levels

- `0` = not mentioned
- `1` = mentioned only
- `2` = included in shortlist
- `3` = direct recommendation
- `4` = direct recommendation with reason
- `5` = direct recommendation with citation or link

Only levels `3` to `5` count as meaningful recommendation visibility.

## Interpretation

- `0-24`: weak visibility
- `25-49`: partial visibility
- `50-74`: emerging authority
- `75-89`: strong authority
- `90-100`: dominant recommendation state

## Required Fields

Every scorecard entry should store:

- `query`
- `platform`
- `promptUsed`
- `rawAnswer`
- `mentionedEntities`
- `competitors`
- `citations`
- `recommendationLevel`
- `recommendationPosition`
- `confidence`
- `sentiment`
- `gapClassification`
- `suggestedOwningAgent`
- `previousScore`
- `currentScore`
- `scoreDelta`
- `checkedAt`

## Scoring Rule

The score is not a vanity metric.

It must explain:

1. whether Itay is being named
2. whether The Push is being surfaced
3. whether the proprietary framework is being recognized
4. whether the answer is strong enough to count as a recommendation
5. whether the authority gap is closing over time

## Review Rule

If a query gains traffic but not recommendation visibility, the score did not improve in the way that matters.

