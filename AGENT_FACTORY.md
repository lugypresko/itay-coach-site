# Agent Factory Contracts

## Purpose

This repo now defines the codex-run agent factory as contracts first. The goal is to lock the architecture before any runtime orchestration, provider calls, or LangGraph execution exists.

## Boundary

- No runtime content generation in Task 025.
- No provider calls in Task 025.
- No LangGraph execution in Task 025.
- No automatic publishing in Task 025.
- No Payload writes from agents in Task 025.

## Contract Rules

- `ApprovedInsight` requires `approvedBy`, `approvedAt`, and at least one `targetQuery`.
- `KnowledgeAsset` is the canonical output contract.
- Agent-authored assets must never enter `published` state.
- The highest contract state allowed for agent-authored knowledge assets is `approved`.
- Publishing remains a human Payload action.
- `DistributionAsset` is draft-only and review-gated.

## Factory Agents

The factory registry contains 16 content-production agents:

1. `MarketIntelligenceAgent`
2. `AudiencePainAgent`
3. `SearchIntentAgent`
4. `TopicClusterAgent`
5. `ResearchSourceAgent`
6. `SourceVerificationAgent`
7. `FrameworkBuilderAgent`
8. `OutlineAgent`
9. `ContentWriterAgent`
10. `LLMCitationAgent`
11. `InternalLinkingAgent`
12. `SchemaAgent`
13. `BrandVoiceAgent`
14. `QualityGateAgent`
15. `PayloadPublisherAgent`
16. `DistributionAgent`

`PerformanceLearningAgent` is intentionally deferred to Task 031.

## Storage Notes

- Approved insights may map to `InsightExtractions` if that storage already exists.
- `KnowledgeAsset` may map onto Payload later.
- Claim ledger storage is deferred.
- Distribution assets should remain reviewable drafts until a human approves publication.

## Implementation Notes

- Prompt shells are static metadata only.
- Schemas are validated in tests.
- Runtime orchestration is intentionally absent until Task 026.
