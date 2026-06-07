# QUERY_AUTHORITY_SCORE.md

## Purpose

This document defines the canonical query-level score used to measure whether Itay Foyerstein is becoming more visible and more recommendable across target AI recommendation queries.

The score is not a traffic metric.

It is a query-level authority metric.

## Source of Record

The canonical storage layer for this model is the `query_authority_scores` collection.

Every record should be tracked per:

- query
- platform
- date checked
- entity scored

## Required Fields

Each query authority score record should store:

- `entity`
- `query`
- `platform`
- `promptUsed`
- `rawAnswer`
- `mentionedEntities`
- `competitorsRecommended`
- `itayMentioned`
- `thePushMentioned`
- `proprietaryFrameworkMentioned`
- `ownedUrlCited`
- `citedUrls`
- `citations`
- `recommendationLevel`
- `recommendationPosition`
- `confidence`
- `sentiment`
- `previousScore`
- `currentScore`
- `scoreDelta`
- `gapClassification`
- `suggestedOwningAgent`
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

## Score Interpretation

- `0-24`: weak visibility
- `25-49`: partial visibility
- `50-74`: emerging authority
- `75-89`: strong authority
- `90-100`: dominant recommendation state

## Score Meaning

The score must explain:

1. whether Itay is being named
2. whether The Push is being surfaced
3. whether the proprietary framework is being recognized
4. whether the answer is strong enough to count as a recommendation
5. whether the authority gap is closing over time

## Storage Rule

Each score record must preserve:

- `previousScore`
- `currentScore`
- `scoreDelta`
- `checkedAt`

These fields are required so the system can compare authority month over month and platform over platform.

## Lifecycle Rule

The score is reviewable data, not published content.

It may be created manually or semi-manually in Phase 1 and later collected automatically where available.

## Interpretation Rule

If a query gains traffic but not recommendation visibility, the authority score did not improve in the way that matters.

