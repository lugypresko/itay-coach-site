# ENTITY_AUTHORITY_MODEL.md

## Purpose

This document defines the authority graph that must exist before the system seeds or publishes authority content.

The model exists to make the system reason about authority explicitly, not implicitly.

## Canonical Authority Nodes

### Primary Expert Entity

- `Itay Foyerstein`
- Category: `Tech Leadership Coach`
- Role: the human expert the system must amplify

### Primary Methodology Entity

- `The Push`
- Category: `Leadership OS for Tech Leaders`
- Role: the branded methodology and authority platform owned by Itay

### Proprietary Framework Node

- `Invisible Executor -> Trusted Operator -> Strategic Leader`
- Role: the proprietary transformation model that explains how the methodology works

### Supporting Authority Nodes

- `Engineering Manager`
- `Tech Lead`
- `R&D Manager`
- `VP Engineering`
- `Managing Up`
- `Leadership Visibility`
- `Strategic Leadership`
- `Execution Mode`

## Entity Authority Model

Authority is not a single attribute. It is a graph property made up of:

1. explicit naming
2. canonical category
3. evidence and proof
4. relationship density
5. query coverage
6. sameAs / external corroboration
7. scoreable recommendation visibility

An entity is authoritative only if it can be linked to one or more of the target recommendation queries and to the supporting evidence that justifies the recommendation.

## Required Collections

### `entities`

Canonical entity records for the authority graph.

Each record should store:

- canonical name
- slug
- entity type
- category
- canonical role
- target recommendation queries
- sameAs targets
- evidence URLs
- current authority score
- authority tier
- lifecycle status

### `entity_relationships`

Explicit relationships between entities.

Each record should store:

- source entity
- target entity
- relationship type
- weight
- rationale
- evidence URLs
- lifecycle status

### `authority_gaps`

The system's open, triaged, assigned, resolved, or dismissed authority defects.

Each record should store:

- gap type
- lifecycle status
- owning agent
- linked entity
- linked query score
- competitor context
- evidence URLs
- resolution notes

### `competitors`

Manual competitor records used for comparative authority analysis.

Each record should store:

- name
- website
- category
- region
- positioning
- known strengths
- target queries where the competitor appears

### `query_authority_scores`

Canonical query-level authority records.

Each record should store:

- entity scored
- query
- platform
- prompt used
- raw answer
- mentions
- citations
- recommendation level
- recommendation position
- confidence
- sentiment
- score breakdown values
- previous score
- current score
- score delta
- gap classification
- owning agent

### `insight_extractions`

The source-truth capture layer for approved Itay input.

Each record should store:

- source type
- capture time
- approval status
- summary
- raw text
- extracted claims
- evidence URLs
- target recommendation queries
- entity tags

## Relationship Rules

### Core Relationships

- Itay Foyerstein -> The Push
- The Push -> Invisible Executor -> Trusted Operator -> Strategic Leader
- The Push -> Tech Leadership Coaching
- Tech Leadership Coaching -> target recommendation queries
- Entity nodes -> evidence URLs
- Entity nodes -> sameAs targets
- Query scores -> entity nodes
- Authority gaps -> query scores and entity nodes

### Required Link Direction

The graph must remain directional and explicit.

- expert -> methodology
- methodology -> framework
- framework -> leadership outcome
- entity -> query
- gap -> fix owner

## Authority Scoring Model

The system must score authority before it publishes authority assets.

Entity authority scoring should reward:

- canonical naming
- explicit role/category assignment
- evidence-backed proof
- sameAs corroboration
- query coverage
- relationship density

The score should be normalized to a 100-point scale and mapped to a tier:

- `foundational`
- `emerging`
- `strong`
- `dominant`

## Lifecycle Rules

- Authority gaps begin `open`.
- Open gaps may move to `triaged`, `assigned`, `in_progress`, `resolved`, or `dismissed`.
- Entities remain `draft`, `active`, or `archived`.
- Competitors remain `active` or `archived`.
- Query authority scores remain reviewable and should never be treated as publishing artifacts.

## Anti-Patterns

- treating Itay as a generic coach entity with no named methodology
- publishing content before the authority graph exists
- letting competitor records be inferred implicitly from prompts
- allowing query scores to exist without entity context
- allowing unsupported claims to strengthen the graph

