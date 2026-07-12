# ARCHITECTURE.md

## System Overview

The Push LLM SEO Authority Engine is a Next.js and Payload CMS application for building a public, machine-readable knowledge graph around Itay Foyerstein, The Push, and the Leadership OS for Tech Leaders methodology.

Itay Foyerstein is the single canonical Person entity. Name variants are treated as aliases only and resolve back to the same human entity in contracts, seed content, and governance code.

The system separates human-reviewed content storage from agent-assisted draft generation. AI agents may research, draft, evaluate, and recommend changes, but publishing remains a human-controlled CMS action.

The system also requires fresh approved Itay insights as the source of truth for any new content generation. If no fresh insight exists, the machine may monitor, diagnose, and request inputs, but it may not create new authority content.

## Core Layers

### 1. Public Web Layer

Planned path: `src/app/(frontend)`

Responsibilities:

- Render authority pages.
- Render pillar and cluster pages.
- Render framework, case-study, FAQ, glossary, and lead-magnet pages.
- Expose metadata, schema, breadcrumbs, sitemap, robots.txt, and llms.txt.
- Keep content extractable for AI systems.

### 2. CMS Layer

Planned path: `src/payload`

Responsibilities:

- Define Payload CMS collections.
- Store content, entity tags, target questions, schema type, internal links, and review status.
- Store research sources and agent run logs.
- Store approved Itay insights and insight freshness metadata.
- Enforce draft/review/published workflow.

### 3. Human Insight Layer

Planned path: `src/ai/governance`

Responsibilities:

- Capture and validate fresh Itay insights.
- Mark insights as approved or archived.
- Define the freshness gate for content generation.
- Block content generation when no approved insight is fresh enough.

Canonical contracts in this layer are `ApprovedInsight` and `KnowledgeAsset`; they are the bridge between approved human input and downstream authority content.

### 4. AI Workflow Layer

Planned path: `src/ai`

Responsibilities:

- Research current sources and user questions.
- Cluster intent.
- Create outlines.
- Draft content.
- Add LLM SEO structures.
- Suggest internal links.
- Run quality gates.
- Require a fresh approved Itay insight before drafting new authority content.
- Save drafts to Payload only after validation.

Rule-based decisions in this layer are deterministic functions, not agent choices, when the output is schema selection, CTA selection, freshness gating, linking, or publication permission.

### 5. Visibility Monitoring Layer

Planned path: `src/ai/monitoring`

Responsibilities:

- Measure query-level visibility for target recommendation queries.
- Own the Query Authority Scorecard.
- Track recommendation level, citations, competitors, gaps, and score deltas.
- Route authority gaps back to the relevant agent.
- Never generate content directly.

Visibility observations are append-only measurements. They should be mapped into a canonical observation model before any reporting or routing logic runs.

### 6. Evaluation Layer

Planned path: `evals`

Responsibilities:

- Validate entity consistency.
- Validate target-query coverage.
- Validate content extractability.
- Validate no automatic publishing.
- Validate that unsupported claims are rejected.

### 7. Test Layer

Planned path: `tests`

Responsibilities:

- Unit tests for pure logic.
- Integration tests for Payload workflows.
- Rendering tests for page contracts.
- End-to-end tests for lead forms and review workflow.

## Planned Route Skeleton

- `/`
- `/itay-foyerstein`
- `/the-push`
- `/tech-leadership-coaching`
- `/articles/[slug]`
- `/guides/[slug]`
- `/frameworks/[slug]`
- `/case-studies/[slug]`
- `/glossary/[slug]`
- `/resources/[slug]`
- `/admin`
- `/api/content-generate`
- `/api/webhooks`
- `/api/cron`

## Non-Negotiable Architecture Constraint

Generated content must enter the CMS as a draft or recommendation. No agent workflow may publish directly.
