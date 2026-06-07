# EDITORIAL_WORKFLOW.md

## Editorial Principle

The system may assist content creation, but authority is built through reviewed, accurate, specific, useful content. No agent may publish directly.

## Workflow States

1. `draft`
2. `in_review`
3. `approved`
4. `published`
5. `archived`

## Draft Creation

Drafts may be created by:

- Human editors.
- Codex-assisted implementation tasks.
- LangGraph content agents.

New content drafts may only be created when there is at least one fresh approved Itay insight within the freshness window defined by the operating spec.

Every draft must include:

- Target recommendation query.
- Target entity.
- Target intent stage.
- Evidence or research sources.
- Suggested internal links.
- CTA.
- `aiSummary`.
- `citationSnippet`.

If no fresh approved Itay insight exists, the system may only generate research requests, monitoring updates, or gap reports. It may not generate a new content draft.

## Review Requirements

A human reviewer must verify:

- The entity strategy is followed.
- Itay Foyerstein is named correctly.
- The page strengthens a specific target entity.
- Claims are supported by sources or clearly framed as expert perspective.
- The content is English-first.
- The content is not generic leadership advice.
- Internal links are useful and natural.
- The CTA is relevant but not over-promotional.

## Publication Rule

Only a human CMS action may move content to `published`.

Agents may move content to `draft`, `in_review`, or recommendation states only.

## Required Page Structure

Every published authority page should include:

- Clear H1.
- Short answer section near the top.
- Key takeaways.
- Definition box where relevant.
- Tables or structured comparisons where useful.
- FAQ.
- Author credibility.
- Last reviewed date.
- Internal links.
- Citation-worthy snippet.
- Clear CTA near the end.

## Rejection Criteria

Reject content if it:

- Uses the wrong name for Itay Foyerstein.
- Uses "Leadership OS Architect" as the main public category.
- Makes unsupported factual claims.
- Invents testimonials, metrics, or client results.
- Sounds like generic coaching content.
- Fails to map to a recommendation query.
- Fails to strengthen a defined entity.
- Has no internal-link plan.
- Has no evidence or source trail.
- Was generated without a fresh approved Itay insight.
