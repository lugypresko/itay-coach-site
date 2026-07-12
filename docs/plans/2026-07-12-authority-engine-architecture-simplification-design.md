# Authority Engine Architecture Simplification Design

## Decision

The authority engine will use one canonical Person entity: `Itay Foyerstein`. Alternative spellings are aliases on that entity and must never create additional Person records or public entity pages.

The simplification will be incremental and non-destructive. Canonical contracts and deterministic services will be introduced first. Existing Payload collections remain readable through compatibility adapters until their records have been migrated and verified.

## Considered approaches

### Immediate replacement

Delete duplicate contracts and collections, generate one migration, and update all consumers at once. This produces the cleanest repository quickly but has the highest risk of losing or orphaning local Payload data.

### Compatibility-first consolidation

Introduce canonical models, route new writes through them, retain read compatibility for legacy collections, migrate records, verify counts and identifiers, and only then remove legacy registrations. This adds temporary adapters but keeps the change reversible and auditable.

### Documentation-only simplification

Declare canonical models without changing Payload or runtime code. This is low risk but leaves the actual duplication and agent taxonomy intact.

The approved approach is compatibility-first consolidation.

## Canonical domain model

The durable domain contracts are:

- `ApprovedInsight`: an approved, fresh Itay source with claim-level evidence.
- `KnowledgeAsset`: a reviewable synthesis derived from approved insights.
- `AuthorityContent`: a public-surface record with a deterministic `contentType`.
- `VisibilityObservation`: an append-only observation for one query and platform.

`WorkflowRun` is optional execution metadata, not an authority-domain entity. It will replace the separate `ContentJob` and `AgentRun` concepts only when orchestration requires persistence.

Claims remain embedded in approved insights and knowledge assets. Authority outcomes and Chief of Staff inputs are computed projections, not stored source-of-truth records.

## Collection model

The target Payload model contains:

- `entities`
- `entity_relationships`
- `authority_content`
- `insights`
- `knowledge_assets`
- `research_sources`
- `visibility_observations`
- `email_subscribers`
- `users`
- `media`
- optional `workflow_runs`

The current content-type collections become legacy read sources during migration. Their records map to `authority_content.contentType`. `ApprovedInsights` and `InsightExtractions` map to `insights`. Both scorecard collections map to `visibility_observations`. Competitor identity remains canonical metadata; competitor appearances belong to visibility observations.

## Deterministic decisions

Code, not agents, owns:

- canonical entity normalization;
- insight freshness and generation eligibility;
- schema selection by content type;
- internal-link eligibility and ranking;
- required-field and evidence validation;
- visibility scoring and gap classification;
- owner routing from gap type;
- CTA selection from intent and content type;
- publishing state transitions and permissions.

Agents remain only for semantic work that cannot be expressed reliably as rules: insight extraction, research synthesis, and content drafting.

## Data flow

An approved insight passes deterministic freshness and evidence checks. Semantic synthesis may produce a KnowledgeAsset. A drafting step may produce AuthorityContent in `draft` or `in_review`. Deterministic validators select schema, links, CTA, and review outcome. Only a human may transition approved content to `published`.

Visibility checks are stored as append-only observations. Scores, gaps, trends, and next deterministic actions are derived from those observations.

## Migration safety

Each consolidation follows four gates:

1. Add the canonical schema and contract.
2. Add tested legacy-to-canonical mapping.
3. Migrate and verify record counts, stable identifiers, relationships, and review status.
4. Remove legacy collection registration only after verification.

No migration may publish content, call a provider, or infer a missing approval.

## Testing

Contract tests will verify canonical parsing and reject duplicate Person identities. Mapping tests will cover every legacy collection type. Deterministic-service tests will cover schema, CTA, link, quality, score, routing, freshness, and publishing decisions. Migration verification will compare record counts and preserved identifiers before legacy removal.

