# Factory Output Storage Decision

## Purpose

This document decides which factory outputs should live in the repo versus Payload before any further content drafting continues.

It is a governance decision only. It does not change schema, migrate data, write records, or publish anything.

## Decision Summary

| Artifact type | Storage decision | Why |
| --- | --- | --- |
| ApprovedInsight | Payload-managed | Approved insights are source-of-truth editorial inputs and should be stored as first-class managed records, likely by extending or reusing `InsightExtractions` if the schema remains compatible. |
| KnowledgeAsset | Payload-managed | KnowledgeAssets are the canonical factory output and should become editorial records in Payload so they can move through review, approval, and later publication workflows. |
| RecommendationDraft | Payload-managed when promoted | Recommendation drafts can stay as repo/docs source material while being drafted, but once promoted they should become records in the relevant public content collections in Payload. |
| PublicSurfaceMapping | Repo/report is acceptable for now | This is a planning artifact that helps route KnowledgeAssets into surfaces. It does not need to be a managed editorial asset yet. |
| DistributionAsset | Payload-managed later | Distribution assets are downstream editorial artifacts and should live in Payload when Task 030 is implemented. |
| ClaimLedger | Payload-managed later | Claim ledgers are governance artifacts and should live in Payload when Task 027 is implemented. |

## Boundary

Repo-only artifacts:

- Planning and decision artifacts
- Mapping reports
- Draft-only seed documents
- Temporary factory orchestration outputs

Payload-managed editorial assets:

- Approved insights
- KnowledgeAssets
- Promoted recommendation drafts
- Public authority pages
- Distribution assets when enabled
- Claim ledgers when enabled

The key boundary is this:

- Repo artifacts help decide, draft, and route.
- Payload assets are the editable source of truth for managed editorial content.

## Detailed Decisions

### ApprovedInsight

Decision:
- Move to Payload-managed storage.

Implementation recommendation:
- Start with `InsightExtractions` if the current structure is compatible.
- If compatibility is insufficient, create a dedicated Approved Insights collection later.

Rationale:
- Approved insights are the authoritative source material for content generation.
- They should be persistent, reviewable, and available to downstream factory steps.

### KnowledgeAsset

Decision:
- Move to Payload-managed storage.

Implementation recommendation:
- Add a dedicated KnowledgeAssets collection or a clearly mapped equivalent in Payload.

Rationale:
- KnowledgeAssets are the minimum viable factory output.
- They need review workflow, traceability to the source insight, and a durable editorial lifecycle.

### RecommendationDraft

Decision:
- Keep in repo/docs while drafting.
- Promote into Payload public content collections when the draft is ready for editorial handling.

Implementation recommendation:
- Use the relevant content collection for the final record type, such as pillar pages, cluster pages, frameworks, FAQs, or entity pages.

Rationale:
- Recommendation drafts are not the canonical content record until they are promoted.
- The content collections in Payload are the correct source of truth once promotion happens.

### PublicSurfaceMapping

Decision:
- Keep in repo/report for now.

Rationale:
- The mapping is a planning and prioritization artifact.
- It informs what should be drafted next, but it does not need to become editorial content itself.

### DistributionAsset

Decision:
- Payload-managed later.

Rationale:
- Distribution assets belong in the editorial workflow, but they are downstream of the current factory boundary.

### ClaimLedger

Decision:
- Payload-managed later.

Rationale:
- Claim ledgers are governance records and should be persistent once that workflow is implemented.

## Recommendation For Task 037

Task 037 should implement Payload persistence for:

1. ApprovedInsights
2. KnowledgeAssets

Reason:

- These are the two factory outputs currently blocking the transition from repo-only planning into Payload-managed editorial truth.
- Once those are persisted, recommendation drafts and surface mappings can continue as deterministic downstream steps with a stable source of truth.

## Current-State Notes

- 50 Approved Insights currently exist only in repo.
- 10 KnowledgeAssets currently exist only in repo.
- 5 Recommendation Drafts currently exist only in repo/docs.
- Public Surface Mapping currently exists only in repo/report.
- Payload currently has 1 `insight_extractions` record and no dedicated KnowledgeAssets collection.
- Payload currently has live authority content records across public collections.

## Next Step Boundary

Do not move to schema implementation until this decision is approved.

Once approved, the next implementation step should focus on Payload persistence for ApprovedInsights and KnowledgeAssets, not publishing.
