# Authority Graph Model

## Scope

This document describes the current Payload authority schema for the Push / Itay Foyerstein authority engine.

Reviewed source files:
- [src/payload/collections/Entities.ts](src/payload/collections/Entities.ts)
- [src/payload/collections/EntityRelationships.ts](src/payload/collections/EntityRelationships.ts)
- [src/payload/collections/Frameworks.ts](src/payload/collections/Frameworks.ts)
- [src/payload/collections/PillarPages.ts](src/payload/collections/PillarPages.ts)
- [src/payload/collections/ClusterPages.ts](src/payload/collections/ClusterPages.ts)
- [src/payload/collections/QueryAuthorityScores.ts](src/payload/collections/QueryAuthorityScores.ts)
- [src/payload/collections/VisibilityMonitoring.ts](src/payload/collections/VisibilityMonitoring.ts)
- [src/payload/collections/content.ts](src/payload/collections/content.ts)
- [src/payload/collections/authority-model.ts](src/payload/collections/authority-model.ts)

## Canonical Model Summary

- `entities` is the canonical authority graph source.
- `entity_relationships` is the canonical edge store for explicit graph links.
- `query_authority_scores` is the canonical query-level visibility record.
- `query_authority_scorecards` is the append-only monitoring log for query visibility.
- The content collections (`entity-pages`, `pillar-pages`, `cluster-pages`, `frameworks`) are graph-aware documents, but they are not the canonical authority source.

## Collection Inventory

### 1) Entities

Collection: `entities`

Purpose: canonical authority nodes.

Fields:

| Field | Type | Required | Relationship | Validation / Notes |
|---|---|---:|---|---|
| `name` | `text` | yes | - | unique, indexed |
| `slug` | `text` | yes | - | unique, indexed |
| `entityType` | `select` | yes | - | one of `expert`, `methodology`, `framework`, `audience`, `concept` |
| `category` | `text` | yes | - | indexed |
| `canonicalRole` | `text` | yes | - | free text |
| `description` | `textarea` | yes | - | free text |
| `targetRecommendationQueries` | `array[text]` | yes | - | each item must have `value` |
| `entityTags` | `array[text]` | yes | - | each item must have `value` |
| `sameAs` | `array[text]` | no | - | optional reference URLs |
| `evidenceUrls` | `array[text]` | no | - | optional evidence URLs |
| `authorityScore` | `number` | yes | - | default `0`, indexed |
| `authorityTier` | `select` | yes | - | default `foundational`; one of `foundational`, `emerging`, `strong`, `dominant` |
| `status` | `select` | yes | - | default `draft`; one of `draft`, `active`, `archived` |
| `lastReviewedAt` | `date` | no | - | indexed |
| `notes` | `textarea` | no | - | free text |

Validation rules:
- Required fields are enforced by Payload.
- `name` and `slug` are unique.
- `entityType`, `authorityTier`, and `status` are closed enums.
- Arrays are required where marked; each array item is a required nested `value`.

### 2) Entity Relationships

Collection: `entity_relationships`

Purpose: directional edges between canonical entities.

Fields:

| Field | Type | Required | Relationship | Validation / Notes |
|---|---|---:|---|---|
| `sourceEntity` | `relationship` | yes | `entities` | indexed |
| `targetEntity` | `relationship` | yes | `entities` | indexed |
| `relationshipType` | `select` | yes | - | one of `owns`, `explains`, `supports`, `serves`, `reinforces`, `derived_from`, `mentions`, `recommended_for`, `contrasts_with` |
| `weight` | `number` | yes | - | default `1`, indexed |
| `rationale` | `textarea` | yes | - | free text |
| `targetRecommendationQueries` | `array[text]` | no | - | optional query alignment |
| `evidenceUrls` | `array[text]` | no | - | optional evidence URLs |
| `status` | `select` | yes | - | default `proposed`; one of `proposed`, `approved`, `archived` |
| `lastReviewedAt` | `date` | no | - | indexed |
| `notes` | `textarea` | no | - | free text |

Validation rules:
- Both endpoints are required and must point to `entities`.
- Relationship type and status are closed enums.
- Weight is numeric and defaults to `1`.

### 3) Frameworks

Collection: `frameworks`

Purpose: proprietary framework pages.

Fields inherit from the shared authority content builder:

| Field | Type | Required | Relationship | Validation / Notes |
|---|---|---:|---|---|
| `title` | `text` | yes | - | indexed |
| `slug` | `text` | yes | - | unique, indexed |
| `excerpt` | `textarea` | yes | - | free text |
| `content` | `textarea` | yes | - | free text |
| `aiSummary` | `textarea` | yes | - | free text |
| `citationSnippet` | `textarea` | yes | - | free text |
| `targetQuestions` | `array[text]` | yes | - | required array items |
| `targetRecommendationQueries` | `array[text]` | yes | - | required array items |
| `entityTags` | `array[select]` | no | - | each tag must be one of the approved entity tags |
| `seoTitle` | `text` | yes | - | free text |
| `seoDescription` | `textarea` | yes | - | free text |
| `schemaType` | `select` | yes | - | default `HowTo`; closed enum |
| `faq` | `array[object]` | no | - | nested `question`, `answer`, `entityTags`, `targetRecommendationQueries` |
| `internalLinks` | `array[object]` | no | - | nested `targetSlug`, `anchorText`, `reason`, `sourceEntityTags`, `targetEntityTags` |
| `status` | `select` | yes | - | default `draft`; one of `draft`, `review`, `in_review`, `approved`, `published`, `archived` |
| `publishedAt` | `date` | no | - | auto-set when status becomes `published` |
| `lastReviewedAt` | `date` | no | - | indexed |
| `author` | `text` | yes | - | default `Itay Foyerstein` |
| `featuredImage` | `relationship` | no | `media` | optional media reference |

Validation rules:
- Agent users cannot transition content to `published`.
- `publishedAt` is auto-populated when status becomes `published`.
- `schemaType` is restricted to the shared schema enum.
- Nested `faq.entityTags`, `faq.targetRecommendationQueries`, `internalLinks.sourceEntityTags`, and `internalLinks.targetEntityTags` are text arrays, not relationships.

### 4) Pillar Pages

Collection: `pillar-pages`

Purpose: top-level authority pages for core recommendation-intent topics.

Fields:
- Same schema as `frameworks`.

Notes:
- Default `schemaType` is `Article`.
- Relationship to entities is tag-based, not a direct foreign key.

### 5) Cluster Pages

Collection: `cluster-pages`

Purpose: supporting topical pages that reinforce pillar and entity authority.

Fields:
- Same schema as `frameworks`.

Notes:
- Default `schemaType` is `Article`.
- Used to expand topical coverage and internal link depth.

### 6) Query Authority Scores

Collection: `query_authority_scores`

Purpose: canonical query-level authority records that define recommendation visibility.

Fields:

| Field | Type | Required | Relationship | Validation / Notes |
|---|---|---:|---|---|
| `entity` | `relationship` | yes | `entities` | indexed |
| `query` | `text` | yes | - | indexed |
| `platform` | `text` | yes | - | indexed |
| `promptUsed` | `textarea` | yes | - | free text |
| `rawAnswer` | `textarea` | yes | - | free text |
| `mentionedEntities` | `array[text]` | yes | - | required array items |
| `competitorNames` | `array[text]` | yes | - | required array items |
| `itayMentioned` | `checkbox` | yes | - | boolean |
| `thePushMentioned` | `checkbox` | yes | - | boolean |
| `proprietaryFrameworkMentioned` | `checkbox` | yes | - | boolean |
| `ownedUrlCited` | `checkbox` | yes | - | boolean |
| `citedUrls` | `array[text]` | yes | - | required array items |
| `citations` | `array[text]` | yes | - | required array items |
| `recommendationLevel` | `number` | yes | - | indexed |
| `recommendationPosition` | `number` | no | - | indexed |
| `confidence` | `number` | no | - | indexed |
| `sentiment` | `select` | yes | - | one of `positive`, `neutral`, `negative` |
| `previousScore` | `number` | yes | - | indexed |
| `currentScore` | `number` | yes | - | indexed |
| `scoreDelta` | `number` | yes | - | indexed |
| `gapClassification` | `select` | yes | - | one of the visibility gap classes |
| `suggestedOwningAgent` | `select` | yes | - | closed agent enum |
| `authorityTier` | `select` | yes | - | default `foundational` |
| `status` | `select` | yes | - | default `draft`; one of `draft`, `review`, `approved`, `archived` |
| `checkedAt` | `date` | yes | - | indexed |
| `recordedAt` | `date` | yes | - | indexed |
| `recordedBy` | `text` | no | - | indexed |
| `sourceUrls` | `array[text]` | yes | - | required array items |
| `sourceCount` | `number` | yes | - | indexed |
| `reviewerNotes` | `textarea` | no | - | free text |

Validation rules:
- The record must point to exactly one `entities` record.
- Most monitoring fields are required because the collection is used as the canonical score record.
- Arrays are required for cited/source URLs and competitor/entity lists.

### 7) Query Authority Scorecards

Collection: `query_authority_scorecards`

Purpose: append-only monitoring log for recommendation visibility.

Fields:

| Field | Type | Required | Relationship | Validation / Notes |
|---|---|---:|---|---|
| `collectionKey` | `text` | yes | - | hidden |
| `recordType` | `text` | yes | - | hidden |
| `query` | `text` | yes | - | indexed |
| `platform` | `text` | yes | - | indexed |
| `prompt` | `textarea` | yes | - | free text |
| `rawAnswer` | `textarea` | yes | - | free text |
| `mentionedEntities` | `array[text]` | yes | - | required array items |
| `itayMentioned` | `checkbox` | yes | - | boolean |
| `thePushMentioned` | `checkbox` | yes | - | boolean |
| `proprietaryFrameworkMentioned` | `checkbox` | yes | - | boolean |
| `ownedUrlCited` | `checkbox` | yes | - | boolean |
| `citedUrls` | `array[text]` | yes | - | required array items |
| `citations` | `array[text]` | yes | - | required array items |
| `competitorsRecommended` | `array[text]` | yes | - | required array items |
| `recommendationLevel` | `number` | yes | - | indexed |
| `recommendationPosition` | `number` | no | - | indexed |
| `confidence` | `number` | no | - | indexed |
| `sentiment` | `select` | yes | - | one of `positive`, `neutral`, `negative` |
| `reviewerNotes` | `textarea` | no | - | free text |
| `checkedAt` | `date` | yes | - | indexed |
| `previousScore` | `number` | yes | - | indexed |
| `currentScore` | `number` | yes | - | indexed |
| `scoreDelta` | `number` | yes | - | indexed |
| `gapClassification` | `select` | yes | - | visibility gap enum |
| `suggestedOwningAgent` | `select` | yes | - | closed agent enum |
| `captureMode` | `select` | yes | - | one of `manual`, `semi_manual`, `automated` |
| `reviewStatus` | `select` | yes | - | one of `draft`, `needs_review`, `ready_for_review`, `approved` |
| `recordedAt` | `date` | yes | - | indexed |
| `recordedBy` | `text` | no | - | indexed |
| `sourceUrls` | `array[text]` | yes | - | required array items |
| `sourceCount` | `number` | yes | - | indexed |

Validation rules:
- The collection is append-only: create/read allowed, update/delete blocked by access policy.
- `collectionKey` and `recordType` are hidden but required.
- This collection is for monitoring history, not the canonical authority graph.

## Intended Graph Structure

The schema is intentionally split between canonical nodes, edges, and content surfaces.

```text
Expert
  -> Methodology
  -> Framework
  -> Audience
  -> Concept
  -> Query
```

How the graph is actually modeled:

1. `Expert` is an `entities` record with `entityType = expert`.
2. `Methodology` is also an `entities` record, usually `entityType = methodology`.
3. `Framework` is an `entities` record with `entityType = framework`, plus a content page in `frameworks`.
4. `Audience` is an `entities` record with `entityType = audience`.
5. `Concept` is an `entities` record with `entityType = concept`.
6. `Query` is not a normalized entity table; it is stored as text in content, insight, gap, and monitoring records, with `query_authority_scores` acting as the canonical visibility record.

### Direct answers

- How does an Expert connect to a Framework?
  - Through `entity_relationships` using `sourceEntity -> targetEntity` and a relationship type such as `owns`, `explains`, or `derived_from`.
  - Operationally, the expert and framework pages also reinforce each other through `entityTags` and `internalLinks`.

- How does a Framework connect to an Audience?
  - Through `entity_relationships` with `relationshipType = serves` or `recommended_for`.
  - Through the framework page's `entityTags`, FAQ tags, and target recommendation queries.

- How does a Pillar Page connect to Entities?
  - Not with a direct entity foreign key.
  - It connects by `entityTags`, FAQ entity tags, internal link source/target tags, and target recommendation queries.

- How are recommendation queries linked?
  - As plain text arrays across entities, pages, insights, content jobs, gaps, and internal links.
  - `query_authority_scores.query` is the canonical query-level visibility record.
  - `query_authority_scorecards.query` stores append-only monitoring snapshots.

- Which collection is the canonical source of authority?
  - `entities`.
  - `query_authority_scores` is the canonical source of visibility measurement, not the authority source itself.

## Recommended Minimum Seed Dataset for Authority Engine v1

Minimum viable seed set:

1. `freshApprovedItayInsight` in `insight_extractions`
2. `Itay Foyerstein` expert entity
3. `The Push` methodology entity
4. `Invisible Executor` framework entity
5. Audience entities for the primary recommendation intents:
   - `Engineering Manager`
   - `Tech Lead`
   - `R&D Manager`
   - `VP Engineering`
6. Concept entities for the core abstract nodes:
   - `Strategic Leader`
   - `Trusted Operator`
7. `entity_relationships` records for:
   - Expert -> Methodology
   - Methodology -> Framework
   - Framework -> Audience
   - Framework -> Concept
8. One `frameworks` page for `Invisible Executor`
9. One `pillar-pages` page for `Tech Leadership Coaching`
10. One `cluster-pages` page or one case-study page to support the pillar
11. One baseline `query_authority_scores` record for each primary target query cluster
12. One append-only `query_authority_scorecards` baseline per platform/query used by VisibilityMonitor

Practical minimum:
- If the goal is graph coherence, items 1 through 9 are the hard minimum.
- If the goal is measurable recommendation visibility, add items 11 and 12.

## Operational Boundary

- Content collections are graph-aware but not graph-authoritative.
- Monitoring collections are append-only and should not be used as the source of truth for entity identity.
- No new content should be created until a fresh approved Itay insight exists.
