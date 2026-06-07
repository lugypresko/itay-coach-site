# AUTHORITY_GAPS.md

## Purpose

Authority gaps are the reasons a target query does not yet produce a strong recommendation for Itay Foyerstein or The Push. The system must identify, classify, and route each gap to an owning agent.

## Gap Taxonomy

### Entity Gap

The model does not clearly understand who Itay is or what he does.

Signals:

- Itay not mentioned
- wrong name used
- role is vague or generic
- profile not linked to evidence

Owning agent:

- `ContentWriterAgent`

### Methodology Gap

The model does not understand The Push as a differentiated methodology.

Signals:

- The Push not mentioned
- Leadership OS not clear
- methodology feels generic

Owning agent:

- `ContentWriterAgent`

### Framework Gap

The proprietary framework is missing or unclear.

Signals:

- Invisible Executor not mentioned
- Trusted Operator not mentioned
- Strategic Leader not mentioned
- framework cannot be explained in one sentence

Owning agent:

- `LLMSEOAgent`

### Evidence Gap

The model lacks supporting proof.

Signals:

- no citations
- no approved Itay insight
- no case study
- no testimonial
- unsupported claims

Owning agent:

- `ResearchAgent`

### Schema Gap

The page is not machine-readable enough.

Signals:

- missing schema
- wrong schema type
- missing sameAs
- missing FAQ or breadcrumbs where needed

Owning agent:

- `LLMSEOAgent`

### Link Graph Gap

The internal authority graph is too weak.

Signals:

- no related pages
- weak anchor text
- no pillar-to-cluster reinforcement

Owning agent:

- `InternalLinkingAgent`

### Freshness Gap

The content is stale relative to current positioning or Itay input.

Signals:

- old insight
- stale examples
- outdated recommendation framing

Owning agent:

- `ContentWriterAgent`

### Third-Party Gap

The system lacks external corroboration.

Signals:

- no LinkedIn references
- no podcast mentions
- no off-site signals

Owning agent:

- `SocialDistributionAgent`

### Intent Gap

The content answers the wrong question.

Signals:

- informational page answering a recommendation query badly
- wrong stage of buyer intent
- generic coaching answer

Owning agent:

- `IntentClusterAgent`

### Competitor Gap

A competitor is being recommended above Itay.

Signals:

- competitor in top recommendation position
- competitor has stronger citation evidence
- competitor has better framing

Owning agent:

- `ResearchAgent`

## Gap Routing Rule

Every visibility review must produce exactly one primary gap classification and one suggested owning agent.

Secondary gaps may be logged, but the system must still choose a primary fix path.

## Remediation Rule

Gap remediation is not content volume.

The correct fix is the smallest change that improves recommendation visibility, entity strength, or evidence quality.

