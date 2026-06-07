# PLANS.md

## Planning Standard

Every future task must have acceptance criteria before implementation starts.

Plans should be small enough for one focused engineering pass and must include:

- Goal
- Scope
- Out of scope
- Files expected to change
- Data contracts affected
- Agent permissions affected
- Validation steps
- Acceptance criteria

## Task State Protocol

Every task must carry a live state so multiple agents can work in parallel without stepping on each other.

Allowed states:

- `pending` - not started
- `ready` - fully specified and available to claim
- `in_progress` - currently owned by one agent
- `blocked` - waiting on a dependency or external input
- `review` - implementation complete, awaiting verification or approval
- `completed` - done and verified

Coordination rules:

- Only one agent may own a task in `in_progress` at a time.
- Agents must claim a task before editing files in that task's scope.
- Tasks in different lanes may run in parallel if they do not share locked files.
- If a task touches shared contracts, the owner must declare the lock scope in the task metadata.
- A task may not move to `completed` until validation passes.

## Task Sequence

### Task 001 - Agent-Ready Project Foundation

State: `completed`
Lane: `docs`, `contracts`, `governance`
Owner: system

Create the repo foundation: documentation, instruction files, architecture skeleton, typed contracts, validation workflow, and folder skeleton.

No product features are implemented in this task.

### Task 002 - Application Scaffold

State: `review`
Lane: `app-shell`, `payload-boot`
Owner: coding agent

Create the Next.js 15 + Payload CMS 3 + TypeScript project scaffold, connect local PostgreSQL, and verify local admin boot.

Acceptance criteria:

- Project has `package.json`, TypeScript config, Next config, lint config, and app entry files.
- Payload CMS boots locally.
- PostgreSQL connection is configured through environment variables.
- No content model beyond minimal boot requirements is implemented.

### Task 003 - Payload Content Model

State: `completed`
Lane: `content-model`
Owner: coding agent

Implement core collections for authority content, entity pages, FAQs, glossary terms, lead magnets, research sources, internal links, content jobs, and agent runs.

Acceptance criteria:

- Required collections exist in Payload.
- Shared fields match `DATA_CONTRACTS.md`.
- Content status supports draft, review, approved, published, and archived.
- Agent role cannot publish.

### Task 004 - Public Rendering Layer

State: `pending`
Lane: `rendering`
Owner: coding agent

Render pillar, cluster, framework, case-study, FAQ, glossary, and entity pages with extractable structure.

Acceptance criteria:

- Public routes render CMS content.
- Pages include short answer, key takeaways, FAQ, citation snippet, last reviewed date, and internal links.
- Missing or draft content does not render as published.

### Task 005 - SEO and Entity Schema Layer

State: `pending`
Lane: `seo`, `schema`
Owner: coding agent

Add metadata, JSON-LD schema, breadcrumbs, sitemap, robots.txt, and llms.txt.

Acceptance criteria:

- Itay Foyerstein has valid `Person` schema.
- The Push has valid organization or brand schema.
- Content pages render valid JSON-LD for their schema type.
- `sitemap.xml`, `robots.txt`, and `llms.txt` exist.

### Task 006 - Manual Seed Content

State: `pending`
Lane: `content-seed`
Owner: human reviewer

Create the first manually reviewed authority assets before enabling generation:

- Itay Foyerstein entity page
- The Push methodology page
- Tech Leadership Coaching pillar page
- Invisible Executor framework page
- One case study draft

Acceptance criteria:

- Seed content is English-first.
- Each page maps to at least one target recommendation query.
- Each page strengthens at least one defined entity.
- No seed content is auto-published by an agent.

### Task 006A - Itay Insight Capture

State: `pending`
Lane: `insight-intake`
Owner: human reviewer

Create a fresh-insight intake and approval path so content generation only starts from Itay's recent voice, notes, interviews, or approved quotes.

Acceptance criteria:

- Itay insight records exist with capture time, approval status, and evidence links.
- Fresh approved insight freshness is enforced before new content generation.
- If no fresh approved Itay insight exists, the system may only monitor or request source material.
- Content jobs reference the insight source that authorized them.

### Task 007 - Internal Linking Engine

State: `pending`
Lane: `linking`
Owner: coding agent

Suggest related pages and anchor text based on entity tags, target questions, and content type.

Acceptance criteria:

- Link suggestions include target slug, anchor text, and reason.
- Suggestions avoid duplicate anchors and keyword stuffing.
- Pillar and cluster linking rules are enforced.
- Suggestions require review before publication.

### Task 008 - AI Draft Workflow

State: `pending`
Lane: `agents`, `langgraph`
Owner: coding agent

Add LangGraph draft generation only after the CMS, rendering, and quality rules exist.

Acceptance criteria:

- Workflow can generate a draft from a content job.
- Agent runs are logged.
- Research sources are stored.
- Generated content is saved only as draft or in-review.
- Draft generation is blocked unless there is a fresh approved Itay insight.

### Task 009 - Quality Gate

State: `pending`
Lane: `governance`, `quality`
Owner: coding agent

Reject shallow, generic, unsupported, off-brand, or over-promotional content.

Acceptance criteria:

- Quality gate rejects unsupported factual claims.
- Quality gate rejects wrong entity naming.
- Quality gate rejects content without target recommendation queries.
- Quality gate explains rejection reasons.

### Task 010 - AI Visibility Monitoring

State: `review`
Lane: `monitoring`, `scorecard`
Owner: coding agent

Track target recommendation queries, platform responses, mentions, citations, competitors, and sentiment over time.

Task 010 must be implemented as an independent monitoring and authority feedback system, not as part of the content generation workflow. It owns query-level visibility measurement and routes authority gaps back to the relevant agents.

Acceptance criteria:

- Monitoring records query, platform, date, mentions, citations, competitors, and sentiment.
- Reports distinguish traffic metrics from recommendation visibility.
- Baseline can be compared month over month.
- VisibilityMonitor owns the Query Authority Scorecard.
- VisibilityMonitor does not generate content directly.
- VisibilityMonitor outputs gap classifications and suggested owning agents.
- Payload-ready scorecard and competitor blueprints exist for manual or semi-manual logging.
- Monitoring records are append-only and reviewable.

## Commit Discipline

Prefer small commits per task. Do not mix documentation, scaffolding, product features, and generated content in the same commit unless the task explicitly requires it.
