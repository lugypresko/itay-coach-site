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

For every future implementation task:

- The verifier or validation method must be defined before implementation starts.
- A task may not move to `completed` unless its DOD is machine-verifiable or has an explicit human-verification step.
- Seed scripts must be idempotent by default.
- Verifier scripts must not mutate production data unless explicitly stated.
- Avoid full app bootstrapping for verification unless the task specifically requires runtime validation through Payload.
- Clean workspace root issues, lockfiles, and lint config before release verification.

## Autonomy Protocol

Codex may proceed without asking for clarification when:

- the task is already specified in `PLANS.md`
- the change does not require edits to `DATA_CONTRACTS.md`, `AGENTS.md`, `SECURITY_RULES.md`, or publishing rules
- the task does not depend on an unresolved runtime blocker

Codex must stop and ask only when:

- a task would require changing a governed contract, agent rule, security rule, or publishing rule
- the task is blocked by missing runtime verification, unavailable external state, or contradictory instructions
- the requested change would alter task scope or acceptance criteria

When a task is blocked, Codex should:

- update the task state
- record the blocker
- record the explicit unblock step
- continue with any independent task that remains allowed by the current spec

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

## Release Freeze

Feature development is frozen until `RELEASE_READINESS_CHECKLIST.md` passes.

Do not expand the system with new agents, collections, or workflows while the release checklist is incomplete.

The release target after verification is `Authority Engine Alpha`.

## Task Sequence

### Task 055A - Canonical Authority Sprint Documentation Update

State: `completed`
Lane: `documentation`, `seo`, `chief-of-staff`
Owner: Codex

Goal:
Update the relevant documentation and AI-readable route inventory after Task 055.

Scope:
- Document the five canonical authority sprint target pages.
- Update AI-readable route inventory to include the new canonical framework and problem targets.
- Record implementation artifacts and validation in the COS recommendation record.

Out of scope:
- No new content pages.
- No schema changes.
- No analytics changes.
- No publishing workflow changes.

Files expected to change:
- `src/app/llms.txt/route.ts`
- `docs/seed-content/README.md`
- `TASK_055_COS_RECOMMENDATION.md`
- `PLANS.md`

Data contracts affected:
- None.

Agent permissions affected:
- None.

Validation steps:
- Run focused tests for sitemap/route inventory if route output changes.
- Run `npm run typecheck`.

Acceptance criteria:
- AI-readable route inventory lists all five canonical sprint targets.
- Seed-content README explains how the canonical sprint uses the source-backed draft assets.
- COS recommendation record includes execution and verification summary.
- Typecheck passes.

Verification notes:
- Updated `llms.txt` route output with `/frameworks/player-trap`, both problem targets, and an explicit canonical sprint target section.
- Updated `docs/seed-content/README.md` with the Task 055 target pages and source-backed evidence inputs.
- Updated `TASK_055_COS_RECOMMENDATION.md` with execution and verification summaries.
- Added test coverage for canonical authority sprint target presence in `llms.txt`.
- Ran `npm test -- tests/unit/site-url-and-sitemap.test.ts`: passed, 5 tests.
- Ran `npm run typecheck`: passed.

### Task 055 - Canonical Authority Sprint

State: `completed`
Lane: `chief-of-staff`, `seo`, `public-rendering`, `analytics`
Owner: Codex

Goal:
Improve discovery, indexing, and first qualified customer conversations by concentrating authority around the five customer-intent pages:

- `/pillars/tech-leadership-coaching`
- `/frameworks/player-trap`
- `/frameworks/invisible-executor`
- `/problems/cto-becomes-the-bottleneck`
- `/problems/vp-rnd-losing-execution-control`

Scope:
- Validate canonical URL, unique metadata, robots indexability, sitemap inclusion, breadcrumbs schema, and related-page blocks for the target pages.
- Strengthen internal links from the homepage, About surface, pillar/framework/problem surfaces, and related blocks so each target receives at least five meaningful internal links.
- Add or strengthen evidence blocks and one primary CTA per target page.
- Implement lightweight Vercel Analytics events for target page views and CTA clicks with path, slug, CTA type, referrer, and UTM fields.

Out of scope:
- No broad content expansion.
- No ten-page publishing batch.
- No new architecture, governance, analytics system, Payload schema migration, provider calls, or publishing automation.

Files expected to change:
- `src/lib/public-content.ts`
- `src/lib/public-schema.ts`
- `src/lib/problem-pages.ts`
- `src/lib/public-authority-routes.ts`
- `src/components/public-content-page.tsx`
- `src/components/problem-page.tsx`
- `src/components/authority-launch-page.tsx`
- `src/components/page-brief-launch-page.tsx`
- `src/app/(site)/page.tsx`
- `tests/unit/*`
- `PLANS.md`

Data contracts affected:
- None.

Agent permissions affected:
- None.

Validation steps:
- Run focused unit tests for canonical authority sprint behavior.
- Run `npm test`.
- Run `npm run typecheck`.
- Run `npm run build`.

Acceptance criteria:
- Target pages are indexable.
- Target pages are in sitemap.
- Each target page has 5+ internal links.
- Evidence block exists on each target page.
- One clear CTA per target page.
- Breadcrumb schema exists.
- Related pages block exists.
- Analytics events are implemented: `target_page_view`, `target_cta_click`, `diagnostic_click`, `fit_call_click`.
- `npm test`, `npm run typecheck`, and `npm run build` pass.

COS note:
- This sprint is owned by Chief of Staff for prioritization, sequencing, and delegation.
- COS recommendation recorded in `TASK_055_COS_RECOMMENDATION.md`.
- COS assigned this sprint back to Codex for implementation under the original constraints.

Verification notes:
- Added `TASK_055_COS_RECOMMENDATION.md` as the COS executive recommendation and delegation record.
- Added `/frameworks/player-trap` as a canonical published static authority fallback, alongside published static fallbacks for `/pillars/tech-leadership-coaching` and `/frameworks/invisible-executor`.
- Corrected the VP R&D canonical target to `/problems/vp-rnd-losing-execution-control`.
- Published the two target problem pages in the static catalog for indexable metadata and sitemap inclusion.
- Added explicit target path and inbound-link registries with five meaningful inbound links per target page.
- Added evidence/proof blocks for all five target pages.
- Added breadcrumb JSON-LD support for problem pages and explicit index/follow metadata for public authority pages.
- Added one CTA type per target page and Vercel Analytics events: `target_page_view`, `target_cta_click`, `diagnostic_click`, and `fit_call_click`.
- Added related-page blocks to public authority pages and PageBrief launch pages; added homepage links to the five target pages.
- Added a regression test so non-renderable CMS records cannot block static canonical fallbacks.
- Local dev server smoke check passed for all five target routes on `http://localhost:3006`.
- Ran `npm test`: passed, 29 test files and 105 tests.
- Ran `npm run typecheck`: passed.
- Ran `npm run build`: passed with pre-existing lint warnings in migrations and seed files.

### Task 000A - Supabase MCP Client Setup

State: `completed`
Lane: `developer-tooling`
Owner: Codex

Goal:
Configure the local AI coding environment to use the Supabase MCP server for project `gvsgthtayhozembisgzn` and install/update Supabase agent skills if needed.

Scope:
- Verify `.vscode/mcp.json` contains the Supabase MCP server configuration.
- Install or update Supabase agent skills with `npx skills add supabase/agent-skills`.
- Verify the Supabase MCP endpoint is reachable.

Out of scope:
- No database schema changes.
- No Payload collection changes.
- No content generation or publishing.

Files expected to change:
- `.vscode/mcp.json`
- `.agents/skills/*`
- `skills-lock.json`
- `PLANS.md`

Data contracts affected:
- None.

Agent permissions affected:
- None.

Validation steps:
- Confirm `.vscode/mcp.json` matches the requested Supabase MCP server URL.
- Run the Supabase skills installer.
- Check the MCP endpoint returns an authentication response rather than a connection failure.

Acceptance criteria:
- VS Code MCP configuration exists for the Supabase project.
- Supabase agent skills are installed or already present.
- MCP endpoint reachability is verified.

### Task 001 - Agent-Ready Project Foundation

State: `completed`
Lane: `docs`, `contracts`, `governance`
Owner: system

Create the repo foundation: documentation, instruction files, architecture skeleton, typed contracts, validation workflow, and folder skeleton.

No product features are implemented in this task.

### Task 002 - Application Scaffold

State: `completed`
Lane: `app-shell`, `payload-boot`
Owner: coding agent

Blocker resolved:
- Vercel production now uses the Supabase Session Pooler URL for IPv4 compatibility.
- Payload CMS importMap generation added to Vercel build step (`payload generate:importmap`).
- Remote schema initialized via Payload database migrations.
- Admin route and database collections verified on Vercel.

Verification note:
- Production Payload Admin runtime verified after switching Vercel DATABASE_URL to Supabase pooler connection string.

Create the Next.js 15 + Payload CMS 3 + TypeScript project scaffold, connect local PostgreSQL, and verify local admin boot.

Acceptance criteria:

- Project has `package.json`, TypeScript config, Next config, lint config, and app entry files.
- Payload CMS boots locally.
- PostgreSQL connection is configured through environment variables.
- No content model beyond minimal boot requirements is implemented.

### Task 002A - Prisma ORM Setup

State: `completed`
Lane: `developer-tooling`, `database-config`
Owner: Codex

Goal:
Install Prisma ORM and configure it for the Supabase Postgres pooler connection strings.

Scope:
- Install Prisma as a development dependency.
- Initialize Prisma project files.
- Configure Prisma to use the Supabase session pooler `DIRECT_URL` for CLI and migration operations.
- Add local Supabase pooler placeholders to `.env.local`.
- Install or update Supabase agent skills.

Out of scope:
- No database schema changes.
- No Prisma models or migrations.
- No Payload collection changes.
- No content generation or publishing.

Files expected to change:
- `package.json`
- `package-lock.json`
- `prisma/schema.prisma`
- `.env.local`
- `.agents/skills/*`
- `skills-lock.json`
- `PLANS.md`

Data contracts affected:
- None.

Agent permissions affected:
- None.

Validation steps:
- Run `npx prisma validate`.
- Run the Supabase skills installer.
- Confirm generated Prisma files exist.

Acceptance criteria:
- Prisma CLI is installed as a dev dependency.
- Prisma schema declares PostgreSQL and Prisma config uses `DIRECT_URL` for CLI operations.
- Local env placeholders point to the requested Supabase pooler host and ports.
- Supabase agent skills are installed or already present.

### Task 002B - Payload Admin Light Design

State: `completed`
Lane: `admin-ui`
Owner: Codex

Goal:
Add a simple light visual treatment to the Payload admin UI.

Scope:
- Add scoped Payload admin CSS.
- Register the stylesheet in Payload admin configuration.
- Keep Payload admin behavior and collection contracts unchanged.

Out of scope:
- No Payload collection changes.
- No database schema changes.
- No content generation or publishing.
- No authentication or role changes.

Files expected to change:
- `payload.config.ts`
- `src/app/(payload)/layout.tsx`
- `src/app/(payload)/admin/custom.css`
- `PLANS.md`

Data contracts affected:
- None.

Agent permissions affected:
- None.

Validation steps:
- Run Payload import map generation.
- Run `npm run typecheck`.
- Run `npm run build`.

Acceptance criteria:
- Admin UI uses a light, readable visual system.
- Admin customization is scoped to Payload admin.
- Build and typecheck pass.

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

State: `completed`
Lane: `rendering`
Owner: coding agent

Render pillar, cluster, framework, case-study, FAQ, glossary, and entity pages with extractable structure.

Acceptance criteria:

- Public routes render CMS content.
- Pages include short answer, key takeaways, FAQ, citation snippet, last reviewed date, and internal links.
- Missing or draft content does not render as published.

### Task 005 - SEO and Entity Schema Layer

State: `completed`
Lane: `seo`, `schema`
Owner: coding agent

Add metadata, JSON-LD schema, breadcrumbs, sitemap, robots.txt, and llms.txt.

Acceptance criteria:

- Itay Foyerstein has valid `Person` schema.
- The Push has valid organization or brand schema.
- Content pages render valid JSON-LD for their schema type.
- `sitemap.xml`, `robots.txt`, and `llms.txt` exist.

### Task 005A - Entity Authority Layer

State: `completed`
Lane: `entity-graph`, `authority-model`
Owner: coding agent

Goal:
Create the knowledge graph foundation required before content seeding.

Scope:
- Introduce explicit entity records for Itay Foyerstein, The Push, and the proprietary framework nodes.
- Model the authority relationships between entities, competitors, insights, and target recommendation queries.
- Define how authority is scored before any content generation or publishing begins.
- Add lifecycle support for authority gaps so gaps can be opened, tracked, reviewed, and resolved.
- Add contracts for insight extraction so future content jobs can only originate from approved Itay source material.

Out of scope:
- No public content pages.
- No seed content.
- No auto-publishing.
- No live browser automation.
- No change to the existing content generation workflow beyond dependencies required for the authority graph.

Files expected to change:
- `src/payload/collections/EntityAuthorities.ts`
- `src/payload/collections/EntityRelationships.ts`
- `src/payload/collections/AuthorityGaps.ts`
- `src/payload/collections/Competitors.ts`
- `src/payload/collections/QueryAuthorityScores.ts`
- `src/payload/collections/InsightExtractions.ts`
- `src/ai/governance/*`
- `src/ai/monitoring/*`
- `src/ai/agents/*`
- `src/payload/collections/index.ts`
- `payload.config.ts`
- `tests/unit/*`

Data contracts affected:
- Entity record shape
- Entity relationship graph shape
- Authority scorecard shape
- Authority gap lifecycle shape
- Competitor record shape
- Insight extraction contract shape

Agent permissions affected:
- `InsightExtractionAgent` may create insight extraction contracts only.
- `VisibilityMonitorAgent` may measure and score authority only.
- `PayloadPublisherAgent` may not publish any content from this task.
- No agent may create public content from this task.

Validation steps:
- Add or update unit tests for each new collection and contract.
- Run `npm test`.
- Run `npm run build`.
- Run `npm run typecheck`.

Acceptance criteria:
- Entities collection exists for the canonical authority graph.
- Entity relationships are explicit and queryable.
- Authority scoring is defined before content seeding starts.
- `AuthorityGap` has a lifecycle that supports tracking and resolution.
- Competitor records are configurable and manually maintainable.
- Query authority scores are stored as first-class records.
- Insight extraction contracts exist and can gate future content jobs.
- No content is created or published as part of this task.

### Task 006 - Manual Seed Content

State: `review`
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

State: `review`
Lane: `insight-intake`
Owner: human reviewer

Create a fresh-insight intake and approval path so content generation only starts from Itay's recent voice, notes, interviews, or approved quotes.

Acceptance criteria:

- Itay insight records exist with capture time, approval status, and evidence links.
- Fresh approved insight freshness is enforced before new content generation.
- If no fresh approved Itay insight exists, the system may only monitor or request source material.
- Content jobs reference the insight source that authorized them.

### Task 007 - Internal Linking Engine

State: `completed`
Lane: `linking`
Owner: coding agent

Suggest related pages and anchor text based on entity tags, target questions, and content type.

Acceptance criteria:

- Link suggestions include target slug, anchor text, and reason.
- Suggestions avoid duplicate anchors and keyword stuffing.
- Pillar and cluster linking rules are enforced.
- Suggestions require review before publication.

### Task 008 - AI Draft Workflow

State: `completed`
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

State: `completed`
Lane: `governance`, `quality`
Owner: coding agent

Reject shallow, generic, unsupported, off-brand, or over-promotional content.

Acceptance criteria:

- Quality gate rejects unsupported factual claims.
- Quality gate rejects wrong entity naming.
- Quality gate rejects content without target recommendation queries.
- Quality gate explains rejection reasons.

### Task 010 - AI Visibility Monitoring

State: `completed`
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

### Task 011 - Authority Graph Model Documentation

State: `completed`
Lane: `docs`, `authority-model`
Owner: Codex

Goal:
Inspect the Payload schema and document the authority graph model before adding more entities.

Scope:
- Export and analyze the Entities, Entity Relationships, Frameworks, Pillar Pages, Cluster Pages, Query Authority Scores, and Query Authority Scorecards collections.
- Document field names, field types, required fields, relationship fields, and validation rules.
- Infer the intended graph structure and the minimum seed dataset required for Authority Engine v1.
- Produce `AUTHORITY_GRAPH_MODEL.md`.

Out of scope:
- No new content creation.
- No seed publishing.
- No schema changes.
- No agent workflow changes.

Files expected to change:
- `AUTHORITY_GRAPH_MODEL.md`
- `PLANS.md`

Data contracts affected:
- None.

Agent permissions affected:
- None.

Validation steps:
- Review the schema source files.
- Confirm the resulting document answers the graph structure questions.

Acceptance criteria:
- `AUTHORITY_GRAPH_MODEL.md` exists and reflects the actual collection schema.
- The document identifies the canonical authority source and the monitoring scorecard source.
- The minimum seed dataset is clearly enumerated for Authority Engine v1.

### Task 012 - Minimum Authority Graph Seed

State: `completed`
Lane: `content-seed`, `authority-model`
Owner: Codex

Goal:
Create the minimum verified Authority Graph seed dataset required for Authority Engine Alpha.

Scope:
- Seed the nine canonical authority entities.
- Seed the eight explicit entity relationships.
- Seed the approved fresh Itay insight record if required by the current schema and gating.
- Keep the operation idempotent.

Out of scope:
- No generated content.
- No public page publishing.
- No new collections.
- No data contract changes.
- No agent permission changes.

Files expected to change:
- `src/seed/*`
- `tests/unit/*`
- `package.json`
- `package-lock.json`
- `PLANS.md`

Data contracts affected:
- None.

Agent permissions affected:
- None.

Validation steps:
- Run the seed script locally.
- Confirm records persist in Supabase.
- Confirm relationships resolve in Payload Admin.
- Run `npm run typecheck`.
- Run `npm run build`.

Acceptance criteria:
- All nine entities exist with `status = active`.
- All eight relationships exist with `status = approved`.
- The seed operation is idempotent.
- Payload Admin can display the seeded entities and relationships.
- `PLANS.md` records the verification notes.

Verification note:
- Seed script ran successfully against Supabase.
- Verified record counts after repeat execution: 9 entities, 8 relationships, 1 approved fresh Itay insight.

### Task 012A - Authority Graph Verification Cleanup

State: `completed`
Lane: `content-seed`, `developer-tooling`
Owner: Codex

Goal:
Close the existing authority graph verifier and repository tooling cleanup so release verification is reproducible and the workspace is clean.

Scope:
- Confirm the `verify:authority-graph` script exists and emits a verification report.
- Tighten the verifier only if needed without changing seed behavior or contracts.
- Keep the minimum authority graph seed behavior unchanged.
- Resolve safe ESLint flat config warnings.
- Ensure the workspace uses only the repo-local lockfile and no stray parent lockfile.
- Verify `lint`, `typecheck`, `build`, and `verify:authority-graph` pass.

Out of scope:
- No new content pages.
- No schema changes.
- No contract changes.
- No new agents.
- No monitoring records.

Files expected to change:
- `package.json`
- `package-lock.json`
- `eslint.config.mjs`
- `src/seed/verify-minimum-authority-graph.ts`
- `PLANS.md`

Data contracts affected:
- None.

Agent permissions affected:
- None.

Validation steps:
- Run `npm run lint`.
- Run `npm run typecheck`.
- Run `npm run build`.
- Run `npm run verify:authority-graph`.

Acceptance criteria:
- `verify:authority-graph` exists and emits a verification report.
- The verifier checks counts, statuses, traversal, orphans, and idempotency.
- ESLint flat config warnings that are safe to fix are resolved.
- No stray parent `package-lock.json` remains in the workspace root path.
- `lint`, `typecheck`, `build`, and `verify:authority-graph` all pass.

Verification notes:
- Added `process.exit(0)` to `src/seed/verify-minimum-authority-graph.ts` so the verifier exits cleanly after successful execution.
- Removed the safe unused `agentFactoryPhaseOptions` imports from `src/ai/agents/agentFactoryPromptShells.ts` and `src/ai/agents/agentRegistry.ts`.
- Confirmed there is no parent `package-lock.json` at `..\\package-lock.json`.
- Ran `npm run lint`: passed with the existing four warnings in `src/migrations/20260607_205054.ts`.
- Ran `npm run verify:authority-graph`: passed and wrote `TASK_012_VERIFICATION_REPORT.md`.
- Ran `npm run typecheck`: passed.
- Ran `npm run build`: passed with the same pre-existing migration warnings.

### Task 026A - Workspace Hygiene & Commit Separation

State: `completed`
Lane: `release`, `developer-tooling`
Owner: Codex

Goal:
Separate Task 025, Task 023C, unrelated changes, and generated/cache files into clean commit boundaries.

Scope:
- Audit the current workspace diff.
- Separate Task 025 changes from Task 023C changes.
- Keep unrelated changes isolated.
- Remove generated/cache files from the tracked release surface.
- Preserve user-authored work that is not part of the current task.

Out of scope:
- No product changes.
- No contract changes.
- No schema changes.
- No workflow changes.

Files expected to change:
- `PLANS.md`
- Git commit history only, if needed for separation.

Data contracts affected:
- None.

Agent permissions affected:
- None.

Validation steps:
- Review `git status --short`.
- Review `git diff --stat`.
- Confirm Task 025 files are separated from Task 023C files.
- Confirm generated/cache files are excluded from release commits.

Acceptance criteria:
- Task 025 is isolated from Task 023C.
- Unrelated files are not mixed into task commits.
- Generated/cache files are separated from durable source changes.
- The workspace is ready for the next focused task.

Verification notes:
- Separated the Task 025 contract work into commit `1a6db10` (`docs: add codex-run agent factory contracts`).
- Separated the Task 023C Player Trap work into commit `be595ab` (`feat: align player trap flow copy`).
- Added `tmp/` to `.gitignore` so generated verification artifacts are not part of the tracked release surface.
- Confirmed `git status` no longer includes generated `tmp/` files.
- The remaining untracked historical planning artifacts are intentionally preserved as context and not part of the release commits.

### Task 026 - Codex-Run First Knowledge Asset

State: `pending`
Lane: `contracts`, `content-seed`, `authority-model`
Owner: Codex

Goal:
Use the Task 025 contracts to create one review-ready KnowledgeAsset from one approved insight.

Scope:
- Use only the Task 025 contract layer.
- Produce one review-ready KnowledgeAsset from one approved insight.
- Keep Codex execution manual.
- Keep Payload as the source of truth.
- Preserve human review as mandatory.

Out of scope:
- No LangGraph.
- No provider calls.
- No runtime generation.
- No publishing.

Files expected to change:
- `src/seed/*`
- `src/ai/agents/*`
- `tests/unit/*`
- `PLANS.md`

Data contracts affected:
- KnowledgeAsset contract usage.

Agent permissions affected:
- None.

Validation steps:
- Confirm the approved insight used as source is current and approved.
- Confirm the KnowledgeAsset is review-ready only.
- Confirm no runtime orchestration was added.

Acceptance criteria:
- One KnowledgeAsset is produced from one approved insight.
- The asset is review-ready only.
- No LangGraph orchestration exists.
- No provider calls exist.
- No runtime generation exists.

### Task 027 - Claim Ledger Storage

State: `pending`
Lane: `contracts`, `content-model`
Owner: Codex

Goal:
Implement Claim Ledger as Payload storage, based on the Task 025 contract.

Scope:
- Add Claim Ledger as a first-class Payload collection.
- Keep the Task 025 claim taxonomy intact.
- Keep storage queryable.
- Keep human review in the loop.

Out of scope:
- No autonomous generation.
- No publishing automation.
- No new runtime orchestration.

Files expected to change:
- `src/payload/collections/*`
- `tests/unit/*`
- `PLANS.md`

Data contracts affected:
- Claim Ledger contract.

Agent permissions affected:
- None.

Validation steps:
- Confirm Claim Ledger collection schema matches the contract.
- Confirm records are queryable in Payload.
- Confirm review status lifecycle works.

Acceptance criteria:
- Claim Ledger is stored in Payload.
- Claims remain queryable.
- The contract and storage are aligned.

### Task 028A - Itay IP Inventory & Insight Harvest

State: `completed`
Lane: `content-seed`, `authority-model`, `documentation`
Owner: Codex

Goal:
Build the canonical inventory of Itay intellectual property from local repo and Payload-accessible context, then convert it into review-ready Insight Candidates.

Scope:
- Inventory local repo and locally accessible Payload authority content only.
- Identify existing Itay IP sources in `docs/seed-content`, `src/seed`, `docs/plans`, `AGENT_FACTORY.md`, `DATA_CONTRACTS.md`, Player Trap source files, Invisible Executor / The Push assets already in the repo, and existing authority assets and reports.
- Define a typed `InsightCandidate` staging contract in `src/ai/insights`.
- Produce a deterministic source inventory report.
- Estimate the first 50 Approved Insights with the required topic mix.

Out of scope:
- No KnowledgeAssets.
- No Payload collection changes.
- No auto-approval.
- No publishing.
- No provider calls.
- No runtime workflows.
- No external Drive, Docs, Gmail, LinkedIn, or private external scans.

Files expected to change:
- `src/ai/insights/*`
- `tests/unit/*`
- `INSIGHT_HARVEST_REPORT.md`
- `PLANS.md`

Data contracts affected:
- InsightCandidate staging contract.
- Insight harvest inventory summary.

Agent permissions affected:
- None.

Validation steps:
- Run the `insight-candidate` unit test file.
- Run `npm test`.
- Run `npm run typecheck`.
- Confirm the report matches the local source inventory.

Acceptance criteria:
- All major Itay IP source families are identified.
- `InsightCandidateSchema` exists in `src/ai/insights`.
- The inventory report is review-ready and deterministic.
- The first 50 Approved Insight recommendation matches the canonical mix.
- No production behavior changes.

Verification notes:
- Created `InsightCandidate` staging contracts in `src/ai/insights`.
- Created a deterministic Itay IP source inventory and first-50 harvest target summary.
- Wrote `INSIGHT_HARVEST_REPORT.md` from local repo sources only; no external Drive, Docs, Gmail, LinkedIn, provider, or runtime workflow access was used.
- Confirmed the report matches the local source inventory and prioritizes 20 Player Trap, 15 Invisible Executor, 7 The Push Leadership Evolution / Strategic Leadership, 4 Engineering Management, 2 Leadership Promotion, and 2 AI Leadership insights.
- Ran `npm test -- tests/unit/insight-candidate-contracts.test.ts`: passed, 1 file and 3 tests.
- Ran `npm test`: passed, 18 files and 66 tests.
- Ran `npm run typecheck`: passed.

### Task 028 - Approved Insight Repository Sprint

State: `completed`
Lane: `content-seed`, `insight-intake`
Owner: Codex

Goal:
Create or organize 30-50 approved/review-ready Itay insights as the source material for future KnowledgeAssets.

Scope:
- Build the approved insight repository from existing Itay source material.
- Keep each insight review-ready or approved only.
- Preserve source attribution and freshness tracking.
- Keep the repository usable as upstream material.

Out of scope:
- No KnowledgeAsset publishing.
- No autonomous generation.
- No provider calls.

Files expected to change:
- `src/seed/*`
- `docs/insight-intake/*`
- `tests/unit/*`
- `PLANS.md`

Data contracts affected:
- Approved Insight contract.

Agent permissions affected:
- None.

Validation steps:
- Confirm the repository reaches the target count.
- Confirm each insight is approved or review-ready.
- Confirm freshness metadata is present.

Acceptance criteria:
- 30-50 approved/review-ready insights are available.
- The repository is organized and queryable.
- Future KnowledgeAssets have enough source material.

Verification notes:
- Added `src/ai/insights/approvedInsightRepository.ts` with 50 approved/review-ready insights.
- Preserved the Task 028A canonical mix: 20 Player Trap, 15 Invisible Executor, 7 The Push Leadership Evolution / Strategic Leadership, 4 Engineering Management, 2 Leadership Promotion, and 2 AI Leadership insights.
- Added topic query helpers for the repository.
- Updated `docs/insight-intake/README.md` to identify the repository as future KnowledgeAsset source material, not published content.
- Added `tests/unit/approved-insight-repository.test.ts`.
- Watched the focused test fail before implementation because the repository exports did not exist.
- Ran `npm test -- tests/unit/approved-insight-repository.test.ts`: passed, 1 file and 3 tests.
- Ran `npm test`: passed, 19 files and 69 tests.
- Ran `npm run typecheck`: passed.

### Task 029 - Recommendation Draft Sprint

State: `completed`
Lane: `public-rendering`, `content-seed`
Owner: Codex

Goal:
Create 5 review-ready recommendation-intent page drafts.

Scope:
- Produce 5 recommendation-intent page drafts only.
- Keep drafts review-ready, not published.
- Align each draft to a recommendation query and entity.
- Keep human review mandatory.

Out of scope:
- No publishing.
- No autonomous generation.
- No runtime orchestration.

Files expected to change:
- `src/seed/*`
- `docs/seed-content/*`
- `tests/unit/*`
- `PLANS.md`

Data contracts affected:
- Recommendation draft usage.

Agent permissions affected:
- None.

Validation steps:
- Confirm 5 drafts exist.
- Confirm each draft targets a recommendation-intent query.
- Confirm drafts are not published.

Acceptance criteria:
- 5 recommendation-intent drafts are created.
- Each draft is review-ready only.
- No automatic publishing exists.

Verification notes:
- Added five review-ready recommendation-intent draft docs in `docs/seed-content/`.
- Added `src/seed/recommendation-draft-sprint.ts` as the seed manifest for the five drafts.
- Updated `src/seed/index.ts` to export the sprint manifest.
- Updated `docs/seed-content/README.md` to document the new drafts as source material only.
- Added `tests/unit/recommendation-draft-sprint.test.ts`.
- Ran `npm test -- tests/unit/recommendation-draft-sprint.test.ts`: passed, 3 tests.
- Ran `npm test`: passed, 20 files and 72 tests.
- Ran `npm run typecheck`: passed.

### Task 030 - Distribution Asset Storage

State: `pending`
Lane: `content-model`, `distribution`
Owner: Codex

Goal:
Store LinkedIn, email, WhatsApp, video, and CTA drafts in Payload.

Scope:
- Add storage for distribution drafts.
- Keep channel-specific drafts queryable.
- Keep drafts review-ready only.
- Do not auto-publish.

Out of scope:
- No auto-publishing.
- No runtime generation.
- No provider calls.

Files expected to change:
- `src/payload/collections/*`
- `tests/unit/*`
- `PLANS.md`

Data contracts affected:
- DistributionAsset contract.

Agent permissions affected:
- None.

Validation steps:
- Confirm channel drafts persist in Payload.
- Confirm review status remains draft/review-ready.
- Confirm no publish automation exists.

Acceptance criteria:
- LinkedIn, email, WhatsApp, video, and CTA drafts are stored in Payload.
- Drafts remain review-ready.
- No auto-publishing exists.

### Task 031 - Performance Signal Mapping

State: `completed`
Lane: `monitoring`, `authority-model`
Owner: Codex

Goal:
Map current available performance signals versus future placeholders without introducing PerformanceLearningAgent runtime.

Scope:
- Define which signals exist now.
- Separate observed signals from placeholders.
- Keep PerformanceLearningAgent deferred.
- Keep the mapping explicit for future learning work.

Out of scope:
- No PerformanceLearningAgent runtime.
- No runtime orchestration.
- No autonomous generation.

Files expected to change:
- `src/ai/monitoring/*`
- `tests/unit/*`
- `PLANS.md`

Data contracts affected:
- PerformanceSignal contract.

Agent permissions affected:
- None.

Validation steps:
- Confirm observed and placeholder signals are separated.
- Confirm the mapping is explicit.
- Confirm no runtime learning agent was introduced.

Acceptance criteria:
- Current and future performance signals are clearly mapped.
- PerformanceLearningAgent remains deferred.
- No runtime learning exists.

### Task 031A - Authority Outcome Mapping Documentation

State: `completed`
Lane: `monitoring`, `authority-model`, `documentation`
Owner: Codex

Goal:
Document how PerformanceSignal records map into AuthorityOutcome records before the Chief of Staff Agent is formalized.

Scope:
- Use the existing AuthorityOutcome contract.
- Define mappings from PerformanceSignal types to AuthorityOutcome focus areas.
- Define status rules for healthy, watch, at_risk, and blocked.
- Define valid nextBestAction categories.
- Define human owner suggestions.
- Keep Chief of Staff Agent deferred.

Out of scope:
- Do not add Chief of Staff Agent to DATA_CONTRACTS.
- Do not add runtime agents.
- Do not add provider calls.
- Do not add autonomous decision-making.
- Do not change publishing rules.

Files expected to change:
- `AUTHORITY_OUTCOME_MAPPING.md`
- `PLANS.md`

Data contracts affected:
- None.

Agent permissions affected:
- None.

Validation steps:
- Ensure the document matches `DATA_CONTRACTS.md`.
- Run `npm test`.
- Run `npm run typecheck`.

Acceptance criteria:
- Every AuthorityOutcome focus has signal inputs.
- Every status has clear rules.
- Every nextBestAction is constrained to a safe operational category.
- Chief of Staff Agent remains deferred.

Verification notes:
- Added `AUTHORITY_OUTCOME_MAPPING.md` to document the mapping between `PerformanceSignal` inputs and `AuthorityOutcome` outputs.
- Kept Chief of Staff Agent deferred and out of `DATA_CONTRACTS.md`.
- Ran `npm test`: passed.
- Ran `npm run typecheck`: passed.

### Task 031B - Chief of Staff Agent Contract Formalization

State: `completed`
Lane: `monitoring`, `authority-model`, `contracts`
Owner: Codex

Goal:
Formalize the Chief of Staff Agent contract in `DATA_CONTRACTS.md` now that AuthorityOutcome ownership exists.

Scope:
- Define Chief of Staff Agent inputs around traffic, leads, content inventory, published assets, GSC, and Player Trap funnel state.
- Define the Chief of Staff Agent output as a next best action recommendation.
- Keep the contract outcome-driven rather than asset-driven.
- Keep runtime agent registration deferred.

Out of scope:
- Do not add runtime agents.
- Do not add provider calls.
- Do not add autonomous decision-making.
- Do not change publishing rules.
- Do not alter AuthorityOutcome semantics.

Files expected to change:
- `DATA_CONTRACTS.md`
- `tests/unit/*`
- `PLANS.md`

Data contracts affected:
- Chief of Staff Agent contract.

Agent permissions affected:
- None.

Validation steps:
- Ensure the contract references `AuthorityOutcome` rather than raw assets.
- Run `npm test`.
- Run `npm run typecheck`.

Acceptance criteria:
- Chief of Staff Agent inputs and outputs are documented in `DATA_CONTRACTS.md`.
- The contract is outcome-driven and not asset-driven.
- Chief of Staff Agent remains deferred in runtime planning.
- Existing validation still passes.

Verification notes:
- Formalized the Chief of Staff Agent input and output contract in `DATA_CONTRACTS.md`.
- Added the corresponding Zod schemas and types in `src/ai/agents/agentFactoryContracts.ts`.
- Kept runtime agent registration deferred.
- Ran `npm test`: passed.
- Ran `npm run typecheck`: passed.

### Task 032 - Publish Readiness Agent + First Authority Batch

State: `completed`
Lane: `governance`, `review`, `content-seed`
Owner: Codex

Goal:
Use a repeatable publish-readiness review process on the 9 existing review-ready assets and select the first human-approved publish batch.

Scope:
- Evaluate the 9 existing review-ready authority assets against publish-readiness criteria.
- Produce a repeatable publish-readiness review process for human approval.
- Select the first authority batch that is ready for explicit human approval.
- Move existing assets from review-ready to publish-ready only through review output, not autonomous publishing.

Out of scope:
- No Chief of Staff Agent expansion.
- No runtime agents.
- No provider calls.
- No content generation.
- No new contracts.
- No publishing without explicit human approval.

Files expected to change:
- `PLANS.md`
- `docs/*` if needed for the readiness review record
- `tests/unit/*` if needed for review-process validation

Data contracts affected:
- None.

Agent permissions affected:
- None.

Validation steps:
- Validate the publish-readiness criteria against the 9 existing review-ready assets.
- Confirm the selected batch is human-approval only.
- Run `npm test` if task implementation adds validation coverage.
- Run `npm run typecheck` if task implementation changes code.

Acceptance criteria:
- The 9 existing review-ready assets are assessed with a repeatable readiness process.
- A first publish batch is selected without autonomous publishing.
- Human approval remains required before any asset becomes published.
- Chief of Staff Agent remains deferred and runtime-less.

### Task 033 - Chief of Staff Recommendation: KnowledgeAsset Conversion Sprint

State: `completed`
Lane: `content-seed`, `authority-model`, `documentation`
Owner: Codex

Goal:
Convert the first 10 approved insights into KnowledgeAssets to prove the minimum viable factory: Approved Insight -> KnowledgeAsset.

Scope:
- Treat this as the execution of a Chief of Staff next-best-action recommendation.
- Create the first 10 KnowledgeAssets from approved insights.
- Prioritize Player Trap, Invisible Executor, and The Push / Strategic Leadership.
- Preserve human review.
- Keep all assets draft or in_review.
- Produce a conversion report showing 10 converted and 40 remaining.

Out of scope:
- No publishing.
- No distribution assets.
- No provider calls.
- No runtime Chief of Staff.
- No autonomous decision-making.
- No LangGraph.
- No Payload schema changes unless separately approved.

Files expected to change:
- `src/seed/*`
- `tests/unit/*`
- `TASK_033_CONVERSION_REPORT.md`
- `PLANS.md`

Data contracts affected:
- None.

Agent permissions affected:
- None.

Validation steps:
- Confirm each KnowledgeAsset links to a valid approved insight.
- Confirm no KnowledgeAsset is published.
- Confirm the report shows 10 converted and 40 remaining.
- Run `npm test`.
- Run `npm run typecheck`.

Acceptance criteria:
- Chief of Staff recommendation is recorded.
- 10 KnowledgeAssets exist.
- Each KnowledgeAsset links to a valid approved insight.
- No KnowledgeAsset is published.
- Remaining 40 approved insights are reported as backlog.

Verification notes:
- Added `TASK_033_CONVERSION_REPORT.md` with the Chief of Staff recommendation and the 10/40 conversion split.
- Added a deterministic KnowledgeAsset conversion sprint for the first 10 approved insights.
- Verified all 10 KnowledgeAssets remain `in_review` and link back to approved insights.
- Ran `npm test`: passed.
- Ran `npm run typecheck`: passed.
- Ran `npm run seed:knowledge-asset-conversion-sprint`: passed and wrote the report.
- Ran `npm run verify:knowledge-asset-conversion-sprint`: passed.

### Task 034 - Autonomy Protocol Upgrade for Factory Execution

State: `completed`
Lane: `governance`, `documentation`, `process`
Owner: Codex

Goal:
Stop requiring manual spoon-feeding between deterministic factory steps by defining a bounded autonomy rule for factory execution.

Scope:
- Update `PLANS.md` and `AGENTS.md` with a factory autonomy rule.
- Allow Codex to continue from one deterministic factory step to the next without asking when boundaries remain within the approved guardrails.
- Keep human approval requirements intact for publishing and strategy changes.

Out of scope:
- No governed contract changes.
- No `DATA_CONTRACTS` changes.
- No `AGENTS.md` security-rule changes beyond this autonomy rule.
- No Payload schema migrations.
- No publishing.
- No provider calls.
- No runtime agents.
- No external private source access.
- No autonomous business decision.
- No human approval boundary crossing.

Files expected to change:
- `PLANS.md`
- `AGENTS.md`

Data contracts affected:
- None.

Agent permissions affected:
- None.

Validation steps:
- Confirm the autonomy rule covers deterministic factory sequencing only.
- Confirm publishing and strategy changes still require human approval.
- Confirm no runtime or provider behavior is introduced.

Acceptance criteria:
- Codex may continue ApprovedInsight -> KnowledgeAsset -> PublicSurfaceMapping -> ContentDraft -> PublishReadiness without task-by-task prompting when the next step is deterministic and within boundaries.
- Human approval is still required for publishing and strategy changes.
- No autonomous external calls or runtime generation are allowed.

Verification notes:
- Confirmed the bounded factory autonomy rule is documented in `AGENTS.md` and `PLANS.md`.
- Added `docs/cos/CHIEF_OF_STAFF_DECISION_LOOP.md` to define the stop-and-resume Chief of Staff loop.
- Updated the Chief of Staff operating model and README to point to the canonical decision-loop document.

### Task 035 - KnowledgeAsset to Public Surface Mapping

State: `completed`
Lane: `content-seed`, `public-rendering`, `documentation`
Owner: Codex

Goal:
Map the 10 in_review KnowledgeAssets to their best public surface type.

Scope:
- Define the best public surface type for each converted KnowledgeAsset.
- Include sourceInsightId, topic family, proposed route or slug, primary target query, target entity, CTA alignment, priority, and rationale.
- Identify the first 3 create_next candidates.
- Produce `KNOWLEDGE_ASSET_PUBLIC_SURFACE_MAPPING.md`.
- Optionally add typed mapping data if it stays aligned with existing patterns.

Out of scope:
- No publishing.
- No new content generation.
- No contract changes.
- No Payload schema changes.
- No provider calls.
- No runtime agents.

Files expected to change:
- `src/seed/*`
- `tests/unit/*`
- `KNOWLEDGE_ASSET_PUBLIC_SURFACE_MAPPING.md`
- `PLANS.md`

Data contracts affected:
- None.

Agent permissions affected:
- None.

Validation steps:
- Ensure all 10 KnowledgeAssets are mapped.
- Ensure every mapping has sourceInsightId.
- Ensure every mapping has a valid public surface type.
- Ensure the first 3 create_next candidates are identified.
- Confirm no asset status is changed to published.

Acceptance criteria:
- All 10 KnowledgeAssets are mapped to a public surface type.
- The first 3 create_next candidates are explicitly identified.
- The mapping remains review-safe and non-publishing.
- No status changes to published are introduced.

Verification notes:
- Added `KNOWLEDGE_ASSET_PUBLIC_SURFACE_MAPPING.md` with the 10 mapped KnowledgeAssets and the first 3 create_next candidates.
- Added typed mapping data in `src/seed/knowledge-asset-public-surface-mapping.ts`.
- Confirmed all 10 KnowledgeAssets remain `in_review`.
- Ran `npm test`: passed.
- Ran `npm run typecheck`: passed.
- Ran `npm run seed:knowledge-asset-public-surface-mapping`: passed and wrote the report.
- Ran `npm run verify:knowledge-asset-public-surface-mapping`: passed.

### Task 036 - Payload Persistence Decision for Factory Outputs

State: `completed`
Lane: `governance`, `documentation`, `content-model`
Owner: Codex

Goal:
Decide and document which factory outputs must become Payload-managed editorial assets before further content drafting continues.

Scope:
- Make a storage decision for ApprovedInsight, KnowledgeAsset, RecommendationDraft, PublicSurfaceMapping, DistributionAsset, and ClaimLedger.
- Clarify the boundary between repo planning artifacts and Payload editorial assets.
- Recommend whether Task 037 should implement Payload persistence for ApprovedInsights and KnowledgeAssets.
- Keep this task read-only with no data writes.

Out of scope:
- No schema implementation yet.
- No migrations.
- No data writes.
- No publishing.
- No provider calls.
- No runtime agents.

Files expected to change:
- `FACTORY_OUTPUT_STORAGE_DECISION.md`
- `PLANS.md`

Data contracts affected:
- None.

Agent permissions affected:
- None.

Validation steps:
- Confirm each artifact type has an explicit storage decision.
- Confirm the decision separates repo planning artifacts from Payload editorial assets.
- Confirm the Task 037 recommendation is explicit.
- Confirm no data is modified.

Acceptance criteria:
- Clear storage decision for each artifact type.
- Clear boundary between repo planning artifacts and Payload editorial assets.
- Recommendation for whether Task 037 should implement Payload persistence for ApprovedInsights and KnowledgeAssets.
- No data is modified.

### Task 037 - Payload Persistence Foundation for Approved Insights and Knowledge Assets

State: `completed`
Lane: `content-model`, `content-seed`, `payload-storage`
Owner: Codex

Goal:
Persist the approved insight repository and first 10 KnowledgeAssets into Payload so the factory outputs live in the source of truth instead of only in repo artifacts.

Scope:
- Add a first-class `approved_insights` collection for repo-approved insights.
- Add a first-class Payload collection for KnowledgeAssets with `sourceInsightId` linkage.
- Seed all approved insights from the repository into Payload.
- Seed the first 10 KnowledgeAssets from the conversion sprint into Payload.
- Add deterministic verification of record counts and source-link integrity.

Out of scope:
- No publishing.
- No provider calls.
- No runtime agents.
- No autonomous business decisions.
- No external private sources.

Files expected to change:
- `src/payload/collections/ApprovedInsights.ts`
- `src/payload/collections/KnowledgeAssets.ts`
- `src/payload/collections/index.ts`
- `payload.config.ts`
- `src/seed/approved-insight-payload-seed.ts`
- `src/seed/knowledge-asset-payload-seed.ts`
- `src/seed/run-factory-storage-seed.ts`
- `src/seed/verify-payload-factory-storage.ts`
- `src/seed/index.ts`
- `tests/unit/*`
- `PLANS.md`

Data contracts affected:
- ApprovedInsight storage mapping
- KnowledgeAsset storage mapping

Agent permissions affected:
- None.

Validation steps:
- Run the approved-insight and knowledge-asset seed scripts.
- Run the storage verifier.
- Run `npm test`.
- Run `npm run typecheck`.
- Run `npm run build`.

Acceptance criteria:
- All 50 approved insights are persisted in Payload.
- The first 10 KnowledgeAssets are persisted in Payload.
- Each KnowledgeAsset has a valid `sourceInsightId`.
- No KnowledgeAsset is published.
- Verification reports accurate counts and linkage integrity.

Progress note:
- The storage foundation now extends into the first review-ready public surfaces so the deterministic factory can continue into route-visible content without changing publish governance.
- Verified locally: `npm run seed:factory-storage`, `npm run verify:factory-storage`, `npm run seed:review-ready-public-surface-batch`, `npm run verify:review-ready-public-surface-batch`, `npm test`, `npm run typecheck`, and `npm run build` all passed.

### Task 039 - Runtime Database Configuration Verification

State: `completed`
Lane: `runtime-config`, `verification`
Owner: Codex

Goal:
Make local runtime verification work against a valid database connection so browser-level route checks can run.

Scope:
- Audit the local runtime `DATABASE_URL` / `DIRECT_URL` configuration.
- Determine why `next start -p 3004` is trying localhost:5432.
- Align local runtime to the working Supabase pooler or available local Postgres.
- Do not change schema unless required by existing migrations.
- Do not modify content status.
- Do not publish.

Out of scope:
- No schema changes unless absolutely required by the runtime fix.
- No content status changes.
- No publishing.

Validation:
- `next start -p 3004` boots without Payload Postgres `ECONNREFUSED`.
- Browser-level checks can load the 3 review-ready routes.
- Verify the 3 routes render H1, short answer, CTA, internal links, and authority trust blocks.
- Run `npm test`, `npm run typecheck`, `npm run build` if config changes.

Acceptance criteria:
- `next start -p 3004` or equivalent local runtime boots against a valid database connection.
- The three review-ready routes render successfully in a browser session.
- Browser verification confirms the expected content blocks are present.
- No content status is modified and no publishing occurs.

Verification notes:
- Root cause was the empty `DATABASE_URL` in `.env.production.local`, which overrode the working pooler value from `.env.local` during `next start`.
- Updated `.env.production.local` to the working Supabase pooler `DATABASE_URL` and `DIRECT_URL`.
- Verified a fresh production start on port `3005` no longer fails with Payload Postgres `ECONNREFUSED`.
- Verified the three review-ready routes with Playwright: all returned `200` and rendered H1, short answer, CTA, internal links, and trust blocks.
- Re-ran `npm test`, `npm run typecheck`, and `npm run build` after the config fix; all passed.

### Task 040 - Publish Readiness Review for First 3 Public Surfaces

State: `completed`
Lane: `public-rendering`, `verification`, `governance`
Owner: Codex

Goal:
Run final publish-readiness review on the 3 browser-verified review-ready public surfaces.

Scope:
- Check duplicate FAQ blocks.
- Check generic copy.
- Check unsupported claims.
- Check CTA correctness.
- Check evidence URLs.
- Check internal links.
- Check metadata and schema.
- Check route rendering.
- Check sitemap inclusion.
- Produce a human approval checklist.

Out of scope:
- No publishing.
- No status change to published.
- No distribution.
- No provider calls.
- No runtime agents.
- No new content assets.

Acceptance criteria:
- Each of the 3 assets receives one status: `publish_ready`, `needs_edit`, or `hold`.
- Blocking issues are listed per asset.
- Non-blocking improvements are listed per asset.
- Human approval checklist exists.
- No content is published automatically.

Verification notes:
- Existing browser verification confirms the three routes render with H1, short answer, CTA, internal links, and trust blocks.
- Publish-readiness review found duplicated FAQ content blocks embedded in the page body and structured FAQ arrays, so the assets need edit before approval.
- Human approval checklist and publish-readiness review artifacts have been written to the repo.

### Task 041 - Publish Readiness Recheck for First 3 Public Surfaces

State: `completed`
Lane: `public-rendering`, `verification`, `governance`
Owner: Codex

Goal:
Re-run publish-readiness on the first 3 browser-verified public surfaces after removing duplicate FAQ content from the page bodies.

Scope:
- Verify the three assets render without duplicate FAQ blocks.
- Recheck CTA correctness, evidence URLs, internal links, metadata, schema, route rendering, and sitemap inclusion.
- Record final statuses for the three assets.
- Produce the updated human approval checklist.

Out of scope:
- No publishing.
- No status change to published.
- No distribution.
- No provider calls.
- No runtime agents.
- No new content assets.

Acceptance criteria:
- Each of the 3 assets receives one status: `publish_ready`, `needs_edit`, or `hold`.
- Blocking issues are listed per asset.
- Non-blocking improvements are listed per asset.
- Human approval checklist exists.
- No content is published automatically.

Verification notes:
- The FAQ duplication blocker was removed from the page bodies and the structured FAQ array remains the single FAQ source.
- Browser verification now shows exactly one visible FAQ section per asset.
- All three assets are now publish-ready pending human approval.

### Task 042 - Human Approval Gate

State: `completed`
Lane: `governance`, `approval`
Owner: human reviewer

Goal:
Record the human approval decision for the first publish-ready public surface batch.

Scope:
- Read `TASK_041_PUBLISH_READINESS_RECHECK.md`.
- Read `TASK_041_HUMAN_APPROVAL_CHECKLIST.md`.
- Record the human approval decision for the 3 publish-ready Payload records.

Out of scope:
- No publishing.
- No status changes to published.
- No distribution.
- No provider calls.
- No runtime agents.
- No new content assets.

Required decision:
- `approve_all`, `approve_some`, or `reject_all`.

Must record:
- approver_name
- approval_timestamp
- approved_routes
- rejected_routes
- approval_notes
- explicit_no_auto_publish_confirmation

Verification notes:
- Human approval decision recorded by Itay Foyerstein at `2026-06-16T22:38:28.4392656+03:00`.
- Decision: `approve_all`.
- Approved routes: `/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck`, `/frameworks/invisible-executor`, `/clusters/engineering-manager-coach-for-strategic-leadership`.
- Explicit no-auto-publish confirmation: yes.

### Task 043 - Authority Site Launch Recommendation Pass

State: `completed`
Lane: `governance`, `launch-strategy`
Owner: Codex

Goal:
Produce a Chief of Staff recommendation record for the current Authority Engine state without publishing or creating content.

Scope:
- Review the current approved insights, knowledge assets, and publish-ready routes.
- Recommend the next launch task.
- Rank content priorities.
- List pages to publish now.
- List pages to create next.
- List what not to build yet.
- Provide rationale.

Out of scope:
- No publishing.
- No content creation.
- No new infrastructure.
- No runtime agents.
- No autonomous publishing.

Verification notes:
- Recommendation record produced from the current Authority Engine state and the current launch constraints.

### Task 043A - Publish Approved Batch + Build Minimum Authority Site

State: `completed`
Lane: `content-seed`, `public-rendering`, `launch`
Owner: Codex

Goal:
Publish the approved batch and create the smallest possible authority website that Google, ChatGPT, Perplexity, and AI search systems can understand.

Scope:
- Publish the 3 human-approved routes.
- Add the minimum static authority pages required for indexability and recommendation intent.
- Keep internal links pointing to Book a fit call and related authority pages.
- Keep the site focused on public authority visibility rather than infrastructure expansion.

Out of scope:
- No runtime agents.
- No LangGraph.
- No recommendation engines.
- No internal signal systems.
- No distribution systems.
- No new governance layers.
- No new workflows.

Files expected to change:
- `src/app/(site)/*`
- `src/components/*`
- `src/lib/public-authority-routes.ts`
- `src/seed/*`
- `src/app/sitemap.ts`
- `PLANS.md`

Data contracts affected:
- None expected.

Agent permissions affected:
- None.

Validation steps:
- Run `npm test`.
- Run `npm run typecheck`.
- Run `npm run build`.
- Verify the published routes and new static pages render locally.
- Verify sitemap coverage includes the new public pages.

Acceptance criteria:
- The 3 approved routes are published.
- About, FAQ, Contact, and the requested landing pages exist.
- At least 10 authority pages are live.
- Sitemap includes the new public pages.
- Each new page links to Book a fit call and at least 2 related pages.
- No unsupported claims are introduced.

Verification notes:
- Published the human-approved batch and the minimum authority content set in Payload.
- The `entity-pages`, `pillar-pages`, `cluster-pages`, `frameworks`, `faqs`, and `glossary-terms` collections now have the expected published authority records.
- Added the new public pages: `/about`, `/the-push-methodology`, `/faq`, `/contact`, `/engineering-manager-coach`, `/cto-coach`, `/leadership-coach-for-engineering-managers`, `/leadership-coaching-for-tech-leaders`, `/strategic-leadership`, `/why-engineering-managers-become-bottlenecks`, `/from-star-player-to-strategic-leader`, and `/why-smart-managers-burn-out`.
- Canonical Chief of Staff operating model documented in `docs/cos/CHIEF_OF_STAFF_OPERATING_MODEL.md` and worker docs in `docs/cos/`.
- Ran `npm test`: passed.
- Ran `npm run typecheck`: passed.
- Ran `npm run build`: passed with existing migration and seed warnings only.
- Verified the approved routes plus the new static pages on a local `next dev` browser session, including H1, Book a fit call CTA, related links, trust blocks, and sitemap exposure.

### Task 044 - Production Launch Verification

State: `completed`
Lane: `launch`, `verification`
Owner: Codex

Goal:
Verify the production launch for the public authority site.

Scope:
- Confirm the production deploy is completed.
- Verify all new routes return 200 on production.
- Verify the sitemap is live and includes the new routes.
- Verify robots allows crawling.
- Verify Google Search Console URL inspection / sitemap submission status or document explicit deferral.
- Verify PostHog is installed or explicitly deferred.
- Verify no 404 remains on static one-segment routes in production.

Out of scope:
- No content changes.
- No schema changes.
- No publishing changes.
- No runtime agent changes.
- No new infrastructure.

Files expected to change:
- `PLANS.md`
- Verification notes only if needed

Data contracts affected:
- None.

Agent permissions affected:
- None.

Validation steps:
- Check production URLs directly.
- Check sitemap and robots on production.
- Check route status for all newly added pages.
- Check PostHog integration status in code or deployment config.

Acceptance criteria:
- Production deploy completed.
- All new routes return 200 in production.
- Sitemap is live and includes the new routes.
- Robots allows crawling.
- GSC submission/inspection is confirmed or explicitly deferred.
- PostHog is confirmed or explicitly deferred.
- No 404 on static one-segment routes in production.

Verification notes:
- Production deploy completed via Vercel production alias to `https://itayfoyerstein.com`.
- Verified production `200` responses for `/about`, `/the-push-methodology`, `/faq`, `/contact`, `/engineering-manager-coach`, `/cto-coach`, `/leadership-coach-for-engineering-managers`, `/leadership-coaching-for-tech-leaders`, `/strategic-leadership`, `/why-engineering-managers-become-bottlenecks`, `/from-star-player-to-strategic-leader`, `/why-smart-managers-burn-out`, `/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck`, `/frameworks/invisible-executor`, and `/clusters/engineering-manager-coach-for-strategic-leadership`.
- Verified `robots.txt` allows crawling and points to `https://itayfoyerstein.com/sitemap.xml`.
- Verified `sitemap.xml` is live and includes the new authority routes.
- Verified no 404 on the new static one-segment routes in production.
- PostHog is not present in `package.json` or repository code and is explicitly deferred for this launch.
- Google Search Console verification could not be completed from the current environment because the connected Windsor.ai app requires reauthentication; treat GSC submission / URL inspection as explicitly deferred until access is restored.

### Task 045 - COS Recommendation-Intent Content Direction

State: `completed`
Lane: `cos-docs`
Owner: Codex

Goal:
Update the Chief of Staff operating model so it prioritizes recommendation-intent pages written for humans first and crawlers second.

Scope:
- Add a clear COS direction that stops template generation.
- Add a clear COS direction that favors recommendation-intent public pages.
- Keep the change documentation-only.

Out of scope:
- No runtime changes.
- No governance changes.
- No new agents.
- No publishing changes.

Files expected to change:
- `docs/cos/CHIEF_OF_STAFF_OPERATING_MODEL.md`
- `PLANS.md`

Data contracts affected:
- None.

Agent permissions affected:
- None.

Validation steps:
- Confirm the COS operating model contains the new content-direction statement.
- Confirm no runtime or governance behavior was changed.

Acceptance criteria:
- The COS explicitly stops generating authority templates.
- The COS explicitly prioritizes recommendation-intent pages for humans first, crawlers second.

### Task 046A - Page Brief Contract and First Rewrite

State: `completed`
Lane: `contracts`, `public-rendering`
Owner: Codex

Goal:
Introduce a PageBrief contract that bridges agent analysis into public page creation, then rewrite one public page from a PageBrief.

Scope:
- Define a PageBrief contract.
- Update ContentWriterAgent input requirements to require a PageBrief or pageBriefId.
- Mark current static launch pages as legacy_static_page.
- Rewrite `/leadership-coaching-for-tech-leaders` from a PageBrief.

Out of scope:
- No runtime agent execution.
- No provider calls.
- No LangGraph.
- No autonomous generation.
- No publishing without review.
- No new analytics layer.
- No distribution automation.
- No governance or publishing rule changes.

Files expected to change:
- `src/ai/agents/agentFactoryContracts.ts`
- `src/ai/agents/agentFactoryPromptShells.ts`
- `src/ai/agents/agentRegistry.ts`
- `src/lib/authority-launch-pages.ts`
- `src/components/page-brief-launch-page.tsx`
- `src/app/(site)/leadership-coaching-for-tech-leaders/page.tsx`
- `tests/unit/agent-factory-contracts.test.ts`
- `tests/unit/authority-launch-pages.test.ts`
- `tests/unit/page-brief-launch-page.test.tsx`
- `PLANS.md`

Data contracts affected:
- PageBrief
- ContentWriterAgent input contract
- AuthorityLaunchPageConfig pageSource status

Agent permissions affected:
- None.

Validation steps:
- Run `npm test`.
- Run `npm run typecheck`.
- Run `npm run build`.
- Verify the rewritten page renders without query/entity/template metadata in the body.

Acceptance criteria:
- PageBrief schema exists.
- PageBrief includes required marketContext, audiencePain, searchIntent, topicClusterPosition, uniqueAngle, proofNeeded, contentPlan, pagePromise, and CTA fields.
- ContentWriterAgent requires PageBrief input.
- `/leadership-coaching-for-tech-leaders` is rewritten from a PageBrief.
- The rewritten page has a real H1 and human-first opening.
- The rewritten page includes why Itay / The Push.
- The rewritten page includes a Book a fit call CTA.
- Existing tests pass.
- No governance or publishing rules are changed.

Verification notes:
- Added `PageBrief` and related sub-schemas to `src/ai/agents/agentFactoryContracts.ts`.
- Updated `ContentWriterAgent` prompt shell and registry input schema to require `pageBriefId` or `pageBrief`.
- Marked the static launch pages as `legacy_static_page`; the rewritten page is flagged `page_brief`.
- Rewrote `/leadership-coaching-for-tech-leaders` to render from a PageBrief through `PageBriefLaunchPage`.
- Added unit coverage for the PageBrief contract, legacy/static page markings, and rendered HTML shape.
- `npm run typecheck`: passed.
- `npm test`: passed.
- `npm run build`: passed.

### Task 046B - PageBrief Enforcement for Public Pages

State: `completed`
Lane: `contracts`, `public-rendering`, `verification`
Owner: Codex

Goal:
Enforce that public authority launch pages are created only through `PageBrief` or an explicitly marked legacy static page path.

Scope:
- Add a validation rule that every authority launch page has a page source marker.
- Add a validation rule that recommendation-intent landing pages use the PageBrief path.
- Add tests that fail for visible query/entity/template metadata on new landing pages.
- Add tests that fail for landing pages without a real H1 or without pain-first opening.

Out of scope:
- No runtime agent execution.
- No provider calls.
- No LangGraph.
- No autonomous generation.
- No publishing changes.
- No governance rule changes.

Files expected to change:
- `src/lib/authority-launch-pages.ts`
- `src/components/page-brief-launch-page.tsx`
- `tests/unit/authority-launch-pages.test.ts`
- `tests/unit/page-brief-launch-page.test.tsx`
- `PLANS.md`

Data contracts affected:
- None beyond enforcement helpers.

Agent permissions affected:
- None.

Validation steps:
- Run `npm test`.
- Run `npm run typecheck`.
- Run `npm run build`.

Acceptance criteria:
- No new authority launch page can be added without `pageBrief` or `legacy_static_page`.
- Every recommendation-intent landing page uses the PageBrief path.
- Legacy static pages are only allowed when explicitly marked.
- Tests fail when a new page exposes query/entity/template metadata.
- Tests fail when a new landing page lacks a real H1.
- Tests fail when a new landing page does not open with pain/problem.

Verification notes:
- Added `validateAuthorityLaunchPageConfig` and `validateAuthorityLaunchPagesManifest` in `src/lib/authority-launch-pages.ts`.
- Added manifest tests that reject landing pages missing a `pageBrief` when they are not explicitly legacy.
- Added render tests that require the PageBrief page to start with audience pain, use a real H1, and hide query/entity/template metadata.
- `npm run typecheck`: passed.
- `npm test`: passed.
- `npm run build`: passed.

### Task 046C - Rewrite Top Legacy Static Pages Through PageBrief

State: `completed`
Lane: `contracts`, `public-rendering`
Owner: Codex

Goal:
Rewrite the top 3 legacy static authority launch pages through PageBrief and remove visible template/authority metadata from their public bodies.

Scope:
- Rank all `legacy_static_page` routes by business importance.
- Rewrite `/about`, `/engineering-manager-coach`, and `/cto-coach` through PageBrief.
- Ensure the three rewritten pages open with audience pain, explain why Itay / The Push matters, and keep the CTA explicit.
- Keep the remaining legacy static pages explicitly marked as legacy.

Out of scope:
- No runtime agent execution.
- No provider calls.
- No LangGraph.
- No autonomous generation.
- No publishing changes.
- No governance rule changes.

Files expected to change:
- `src/lib/authority-launch-pages.ts`
- `src/app/(site)/about/page.tsx`
- `src/app/(site)/engineering-manager-coach/page.tsx`
- `src/app/(site)/cto-coach/page.tsx`
- `src/app/(site)/leadership-coaching-for-tech-leaders/page.tsx`
- `tests/unit/authority-launch-pages.test.ts`
- `tests/unit/page-brief-launch-page.test.tsx`
- `PLANS.md`

Data contracts affected:
- None beyond the existing PageBrief path.

Agent permissions affected:
- None.

Validation steps:
- Run `npm test`.
- Run `npm run typecheck`.
- Run `npm run build`.
- Verify the three routes render H1, pain-first opening, Why Itay / The Push, and CTA without visible template metadata.

Acceptance criteria:
- The top 3 legacy static pages are rewritten through PageBrief.
- Visible query/entity/template metadata is removed from the three rewritten pages.
- The three rewritten pages open with pain/problem.
- The three rewritten pages explain why Itay / The Push matters.
- The three rewritten pages include a Book a fit call CTA.
- Tests pass.

Verification notes:
- Ranked the legacy static routes by business importance before rewrite as:
  1. `/about`
  2. `/engineering-manager-coach`
  3. `/cto-coach`
  4. `/leadership-coach-for-engineering-managers`
  5. `/the-push-methodology`
  6. `/faq`
  7. `/strategic-leadership`
  8. `/why-engineering-managers-become-bottlenecks`
  9. `/from-star-player-to-strategic-leader`
  10. `/why-smart-managers-burn-out`
  11. `/contact`
- Rewrote the top 3 routes through PageBrief: `/about`, `/engineering-manager-coach`, and `/cto-coach`.
- Each rewritten page now renders through `PageBriefLaunchPage` and no longer exposes query/entity/template metadata in the public body.
- `npm run typecheck`: passed.
- `npm test`: passed.
- `npm run build`: passed.

### Task 046D - Rewrite Next Legacy Static Pages Through PageBrief

State: `completed`
Lane: `contracts`, `public-rendering`
Owner: Codex

Goal:
Rewrite `/leadership-coach-for-engineering-managers`, `/the-push-methodology`, and `/faq` through PageBrief and verify the pages remain human-first.

Scope:
- Rank the remaining legacy static routes by business importance.
- Rewrite the three next highest-value legacy routes through PageBrief.
- Remove visible query/entity/template metadata from the public body.
- Verify the pages open with pain/problem, explain why Itay / The Push matters, and include a CTA.

Out of scope:
- No runtime agent execution.
- No provider calls.
- No LangGraph.
- No autonomous generation.
- No publishing changes.
- No governance rule changes.

Files expected to change:
- `src/lib/authority-launch-pages.ts`
- `src/app/(site)/leadership-coach-for-engineering-managers/page.tsx`
- `src/app/(site)/the-push-methodology/page.tsx`
- `src/app/(site)/faq/page.tsx`
- `tests/unit/authority-launch-pages.test.ts`
- `tests/unit/legacy-static-page-rewrites.test.tsx`
- `PLANS.md`

Data contracts affected:
- None beyond the existing PageBrief path.

Agent permissions affected:
- None.

Validation steps:
- Run `npm test`.
- Run `npm run typecheck`.
- Run `npm run build`.
- Verify the three routes render H1, pain-first opening, why Itay / The Push, and CTA without visible template metadata.

Acceptance criteria:
- The three selected legacy pages are rewritten through PageBrief.
- Visible query/entity/template metadata is removed from the three rewritten pages.
- The three rewritten pages open with pain/problem.
- The three rewritten pages explain why Itay / The Push matters.
- The three rewritten pages include a Book a fit call CTA.
- Verification completed:
  - `npm run typecheck`: passed.
  - `npm test`: passed.
- `npm run build`: passed.
- Tests pass.

### Task 046E - Complete Authority Legacy Migration

State: `completed`
Lane: `contracts`, `public-rendering`
Owner: Codex

Goal:
Rewrite the final four remaining authority/content legacy pages through PageBrief and leave `contact` explicitly legacy.

Scope:
- Rewrite `/strategic-leadership`, `/why-engineering-managers-become-bottlenecks`, `/from-star-player-to-strategic-leader`, and `/why-smart-managers-burn-out` through PageBrief.
- Remove visible query/entity/template metadata from the public body.
- Verify each page opens with pain/problem, explains why Itay / The Push matters, and includes a Book a fit call CTA.
- Leave `/contact` as `legacy_static_page`.

Out of scope:
- No runtime agent execution.
- No provider calls.
- No LangGraph.
- No autonomous generation.
- No publishing changes.
- No governance rule changes.

Files expected to change:
- `src/lib/authority-launch-pages.ts`
- `src/app/(site)/strategic-leadership/page.tsx`
- `src/app/(site)/why-engineering-managers-become-bottlenecks/page.tsx`
- `src/app/(site)/from-star-player-to-strategic-leader/page.tsx`
- `src/app/(site)/why-smart-managers-burn-out/page.tsx`
- `tests/unit/authority-launch-pages.test.ts`
- `tests/unit/legacy-static-page-rewrites.test.tsx`
- `PLANS.md`

Validation steps:
- Run `npm test`.
- Run `npm run typecheck`.
- Run `npm run build`.
- Verify the four routes render H1, pain-first opening, why Itay / The Push, and CTA without visible template metadata.

Acceptance criteria:
- The four selected legacy pages are rewritten through PageBrief.
- `contact` remains explicitly `legacy_static_page`.
- Visible query/entity/template metadata is removed from the four rewritten pages.
- The four rewritten pages open with pain/problem.
- The four rewritten pages explain why Itay / The Push matters.
- The four rewritten pages include a Book a fit call CTA.
- Tests pass.
- Verification completed:
  - `npm run typecheck`: passed.
  - `npm test`: passed.
  - `npm run build`: passed.

### Task 015 - Authority Evidence Layer

State: `completed`
Lane: `public-rendering`, `schema`
Owner: Codex

Goal:
Increase trust, provenance, and recommendation confidence by exposing graph-backed authority signals on every public authority asset.

Scope:
- Add reusable authority trust components for evidence, review, entity context, recommendation intent, and related authority.
- Expose evidence metadata on public authority content.
- Reuse existing authority graph relationships where possible.
- Keep the public authority rendering path shared rather than template-specific.

Out of scope:
- No new agents.
- No content generation.
- No monitoring expansion.
- No workflow changes.
- No collection redesign beyond the minimal fields required to surface evidence URLs.

Files expected to change:
- `src/payload/collections/content.ts`
- `src/lib/public-content.ts`
- `src/lib/public-schema.ts`
- `src/components/public-content-page.tsx`
- `src/styles/components.css`
- `src/seed/*`
- `docs/seed-content/*`
- `tests/unit/*`
- `PLANS.md`

Data contracts affected:
- Authority content evidence URL shape
- Public authority trust block shape
- Public content page model shape

Agent permissions affected:
- None.

Validation steps:
- Run unit tests for public content normalization and trust block rendering.
- Run `npm run typecheck`.
- Run `npm run build`.
- Verify public authority pages render the new trust blocks.

Acceptance criteria:
- Framework pages, pillar pages, and methodology pages render evidence metadata.
- Framework pages, pillar pages, and methodology pages render review metadata.
- Framework pages, pillar pages, and methodology pages render entity context and recommendation intent.
- Public authority pages render related authority signals without editing each page template individually.
- Build passes.
- Typecheck passes.

Verification notes:
- Task 015 was created from the dedicated authority evidence layer brief in `docs/Create Task 015 - Authority Evidenc.md`.
- Task 012 was completed and verified before Task 015 began.

### Task 016 - AI-First Leadership Landing Page

State: `completed`
Lane: `public-rendering`, `site-pages`
Owner: Codex

Goal:
Create `/ai-first-leadership` as a public landing page in the existing Next.js 15 app using the uploaded static HTML as a reference only.

Scope:
- Rebuild the landing page structure in React/Next.js.
- Reuse the existing authority design system and tokens.
- Adapt the conversion flow and CTA hierarchy to the current authority architecture.
- Link into existing authority pages and lead-magnet routes.
- Keep the page clean, fast, mobile-first, and free of animations or visual effects.

Out of scope:
- No raw HTML import.
- No new schema.
- No new collections.
- No placeholder testimonials.
- No fake claims.
- No static demo form behavior.
- No design-system bypass.

Files expected to change:
- `src/app/(site)/ai-first-leadership/page.tsx`
- `src/app/sitemap.ts`
- `PLANS.md`

Data contracts affected:
- None.

Agent permissions affected:
- None.

Validation steps:
- Open `/ai-first-leadership` in the local app.
- Confirm the primary CTA points to the scorecard or assessment route.
- Confirm the secondary CTA points to the Invisible Executor Framework route.
- Confirm no placeholder content remains.
- Run `npm run typecheck`.
- Run `npm run build`.

Acceptance criteria:
- `/ai-first-leadership` renders successfully.
- The page uses the existing authority design system.
- The page contains no unsupported claims or placeholder testimonials.
- The page links into existing authority pages.
- Typecheck and build pass.

Verification note:
- `/ai-first-leadership` renders in the local app.
- Primary CTA links to `/tech-leadership-visibility-scorecard`.
- Secondary CTA links to `/frameworks/invisible-executor`.
- `npm run typecheck` passed.
- `npm run build` passed.

### Task 016B - Homepage Copy Alignment

State: `completed`
Lane: `public-rendering`, `site-pages`, `content`
Owner: Codex

Goal:
Align the homepage copy to the book-first authority direction with one pain statement above the fold and Player Trap positioned as a supporting sub-section.

Scope:
- Tighten the homepage hero around the core pain point.
- Make `/book-a-fit-call` the singular primary above-the-fold CTA.
- Surface Player Trap as a sub-section rather than a competing hero action.
- Preserve existing authority graph links where they still fit.
- Keep the page English-first and aligned to The Push / Itay Foyerstein authority strategy.

Out of scope:
- No layout redesign.
- No styling changes unless required for copy rendering.
- No changes to unrelated pages.
- No unsupported claims, testimonials, or invented credentials.

Files expected to change:
- `src/app/(site)/page.tsx`
- `PLANS.md`

Data contracts affected:
- None.

Agent permissions affected:
- None.

Validation steps:
- Review the homepage copy in `src/app/(site)/page.tsx`.
- Confirm the hero has one clear pain statement and one primary CTA.
- Confirm Player Trap appears as a supporting sub-section.

Acceptance criteria:
- Homepage hero is book-first and pain-led.
- Above-fold CTA is singular and primary.
- Player Trap is a supporting section, not the main competing CTA.
- Existing authority graph links remain if still relevant.

Verification notes:
- Tightened the homepage hero around a single pain statement and a single above-fold primary CTA.
- Positioned Player Trap as a supporting section rather than a competing hero action.
- Preserved the existing canonical authority links section.
- Ran `npm run typecheck`: passed.

### Task 017 - Authority Asset Production Sprint

State: `completed`
Lane: `content-seed`, `public-rendering`
Owner: Codex

Goal:
Create the first 10 authority assets that expand the graph-to-surface layer and increase AI recommendation visibility.

Scope:
- Create draft and review authority assets only.
- Use existing authority graph, approved insight, The Push methodology, Invisible Executor framework, tech leadership coaching pillar, existing design system, and existing quality gate.
- Add five cluster pages, one FAQ set, three glossary terms, and one case study draft.
- Keep all assets review-safe and source-backed.

Out of scope:
- No auto-publishing.
- No fake testimonials.
- No unsupported client claims.
- No new schema.
- No new collections.
- No content generation outside source-backed drafts.

Files expected to change:
- `src/seed/*`
- `docs/seed-content/*`
- `tests/unit/*`
- `package.json`
- `PLANS.md`

Data contracts affected:
- Public authority content drafts and review-safe render contracts.

Agent permissions affected:
- None.

Validation steps:
- Run the sprint seed script.
- Verify records exist in Payload.
- Verify public routes render for review-safe pages.
- Verify internal links resolve.
- Run `npm run typecheck`.
- Run `npm run build`.

Acceptance criteria:
- 10 draft/review authority assets exist.
- Each asset strengthens The Push, Itay Foyerstein, or Invisible Executor Framework.
- No published content is created automatically.
- No unsupported claims are introduced.
- Build passes.
- `PLANS.md` updated.

Verification note:
- `npm run seed:authority-asset-sprint` seeded 10 assets.
- `npm run verify:authority-asset-sprint` passed.
- Review-safe routes render in the local app.
- `npm run typecheck` passed.
- `npm run build` passed.

### Task 018 - Editorial Expansion Sprint

State: `completed`
Lane: `content-expansion`, `public-rendering`
Owner: Codex

Goal:
Expand the 10 Task 017 authority assets from thin draft/review records into review-ready authority assets.

Scope:
- Expand each asset using only approved source material.
- Preserve all existing slugs, entity tags, target recommendation queries, and internal links.
- Replace "Needs evidence" notes with either approved evidence-backed language or keep explicit evidence gaps.
- Add stronger short answers, key takeaways, citation snippets, FAQs, and internal links.
- Keep all content status as review, not published.

Out of scope:
- No auto-publishing.
- No fake testimonials.
- No new client claims.
- No new entities.
- No schema changes.
- No agent workflow changes.

Files expected to change:
- `src/seed/authority-asset-sprint/*`
- `docs/seed-content/*`
- `tests/unit/*`
- `PLANS.md`

Data contracts affected:
- None.

Agent permissions affected:
- None.

Validation steps:
- Run `npm run verify:authority-asset-sprint` for each asset.
- Run `npm run typecheck`.
- Run `npm run build`.
- Confirm no asset contains unsupported outcome claims.
- Confirm no placeholder testimonials.
- Confirm all assets remain draft/review.

Acceptance criteria:
- All 10 assets are review-ready.
- Each asset has a useful short answer.
- Each asset has meaningful key takeaways.
- Each asset has a citation snippet.
- Each asset has internal links.
- Each asset strengthens at least one canonical entity.
- No unsupported claims are introduced.
- Build passes.

Verification notes:
- Expanded all 10 assets with 400-800 word content sections.
- Replaced all "Needs evidence" placeholders with substantive content or explicit evidence gaps.
- Expanded FAQ sections from 1-3 to 5-9 questions per asset.
- All content uses only approved source material (fresh-approved-insight, the-push-methodology, invisible-executor-framework, tech-leadership-coaching-pillar).
- Ran `npm run verify:authority-asset-sprint`: passed all 10 assets.
- Ran `npm run typecheck`: passed.
- Ran `npm run build`: passed with only pre-existing migration warnings.
- Confirmed no unsupported claims, no fake testimonials, no invented metrics.
- Case study outcome explicitly marked as "pending evidence source approval".
- All assets remain review-safe (9 in review, 1 in draft).
- Generated `TASK_018_VERIFICATION_REPORT.md`.


### Task 019 - Authority Measurement Baseline

State: `completed`
Lane: `monitoring`, `reporting`
Owner: Codex

Goal:
Establish the first measurable authority baseline before expanding content volume.

Scope:
- Define the top 20 recommendation queries.
- Create a baseline scorecard format for manual measurement across ChatGPT, Perplexity, Claude, and Google AI Overviews.
- Generate `AUTHORITY_BASELINE_REPORT.md`.
- Generate `AUTHORITY_GAPS_REPORT.md`.
- Document the manual measurement workflow.

Out of scope:
- No schema changes.
- No new collections.
- No auto-publishing.
- No content generation.
- No new agents.

Files expected to change:
- `src/ai/monitoring/*`
- `src/seed/*`
- `docs/*`
- `tests/unit/*`
- `package.json`
- `PLANS.md`

Data contracts affected:
- None.

Agent permissions affected:
- None.

Validation steps:
- Generate the baseline report.
- Generate the gap report.
- Confirm the top 20 queries are tracked.
- Run `npm run typecheck`.
- Run `npm run build`.

Acceptance criteria:
- First authority baseline established.
- Authority gaps identified.
- Future growth measurable.
- No schema changes required.

Verification note:
- `npm run seed:authority-baseline` generated `AUTHORITY_BASELINE_REPORT.md` and `AUTHORITY_GAPS_REPORT.md`.
- `npm run verify:authority-baseline` passed.
- The baseline tracks 20 queries across 4 platforms for 80 measurement slots.
- `npm run typecheck` passed.
- `npm run build` passed.
- The reports do not require schema changes.

### Task 021 - Player Trap Conversion Infrastructure

State: `completed`
Lane: `conversion`, `lead-capture`, `email`
Owner: Codex

Goal:
Prepare the conversion infrastructure required before launching paid traffic.

Scope:
- Implement Resend integration.
- Build lead capture flow.
- Build Player Trap result pages.
- Build diagnostic report delivery.
- Build 5-email nurture sequence.
- Capture UTM attribution.
- Track completed test, report request, and diagnosis call.

Out of scope:
- No paid traffic launch.
- No schema changes beyond the minimum data required for the conversion flow.
- No new content publishing.
- No fake claims or placeholder testimonials.

Files expected to change:
- `src/app/*`
- `src/lib/*`
- `src/payload/collections/*`
- `src/payload/*`
- `src/email/*`
- `tests/unit/*`
- `package.json`
- `package-lock.json`
- `PLANS.md`

Data contracts affected:
- Email subscriber records may store UTM attribution, test result context, and nurture state.

Agent permissions affected:
- None.

Validation steps:
- Run the end-to-end test and report request flow locally.
- Confirm the first nurture email is sent through Resend.
- Confirm UTM attribution is captured and persisted.
- Run `npm run typecheck`.
- Run `npm run build`.

Acceptance criteria:
- Visitor -> Test -> Result -> Lead -> Resend -> Email #1 works end to end.
- Diagnostic report delivery is operational.
- 5-email nurture sequence is defined and connected to the lead capture flow.
- No paid traffic should be launched until this flow is operational.

Verification notes:
- Added the Player Trap assessment page at `/player-trap` with live scoring and lead capture.
- Added the report page at `/player-trap/report/[token]` and the diagnosis-call tracking route.
- Added Resend delivery helpers with dry-run fallback when `RESEND_API_KEY` is not configured locally.
- Added UTM capture and subscriber state fields to `email-subscribers`.
- Added `tests/unit/player-trap.test.ts` for scoring, report generation, and nurture sequence coverage.
- Ran `npm test`: passed, 16 files and 56 tests.
- Ran `npm run typecheck`: passed.
- Ran `npm run build`: passed with the same pre-existing migration warnings.
- Verified the local flow end to end on `http://localhost:3004/player-trap`: assessment page loaded, lead submission returned a report URL, report page rendered, and diagnosis-call POST redirected to `/book-a-fit-call?source=player-trap`.
- Lead submission used Resend dry-run mode locally because no live API key is configured in this workspace.

### Task 022 - Production Resend Verification

State: `completed`
Lane: `production-verification`, `email`, `conversion`
Owner: Codex

Goal:
Verify the Player Trap lead capture flow works in production with real Resend delivery before paid traffic begins.

Scope:
- Configure required Vercel env vars: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_REPLY_TO`.
- Verify the sender domain in Resend.
- Submit a real test lead on production at `https://itayfoyerstein.com/player-trap`.
- Confirm the lead is saved in Payload, UTM params are captured, the report token is generated, the report URL works, Email #1 is delivered through Resend, and the diagnosis-call click redirects correctly.

Out of scope:
- No Facebook campaign launch.
- No new email copy.
- No new automations.
- No schema changes unless production verification exposes a defect.

Files expected to change:
- `PLANS.md`
- `src/*` only if production verification exposes a defect.

Data contracts affected:
- None unless production verification exposes a defect.

Agent permissions affected:
- None.

Validation steps:
- Submit a production Player Trap lead.
- Confirm a Resend delivery event exists.
- Confirm the email arrives in inbox.
- Confirm the Payload subscriber record exists.
- Confirm the report page works.
- Confirm the diagnosis-call redirect works.
- Run `npm run typecheck`.
- Run `npm run build`.

Acceptance criteria:
- Production Player Trap funnel works end to end.
- Resend is no longer in dry-run mode in production.
- No lead is lost if email delivery fails.
- `PLANS.md` includes verification notes.

Verification notes:
- Added production-scoped Vercel env vars for `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `RESEND_REPLY_TO`.
- Verified the sender domain `itayfoyerstein.com` in Resend is sending-enabled and DKIM/SPF are verified; inbound MX remains pending and does not block sending.
- Deployed a fresh production build to `https://itayfoyerstein.com`.
- Submitted a live production Player Trap lead to `https://itayfoyerstein.com/api/player-trap/lead`.
- Confirmed the production subscriber record exists via the public Payload API and captures UTM fields.
- Confirmed the production report URL renders successfully.
- Confirmed the diagnosis-call POST redirects to `/book-a-fit-call?source=player-trap`.
- Confirmed Resend delivered the email with `last_event: delivered`.
- Confirmed the email arrived in the connected Gmail inbox for `itayf32@gmail.com`.
- Ran `npm run typecheck`: passed.
- Ran `npm run build`: passed with the same pre-existing migration warnings.

### Task 023 - Player Trap Conversion Redesign

State: `completed`
Lane: `conversion`, `public-rendering`, `diagnostic-funnel`
Owner: Codex

Goal:
Transform the `/player-trap` page into a diagnostic-first conversion funnel without changing the homepage, global navigation, or top-level CTAs.

Scope:
- Redesign only the `/player-trap` page UX/UI.
- Reframe the hero around the Player Trap diagnosis.
- Add the 4-sign diagnostic section.
- Add the leadership evolution framework.
- Add the self-assessment section.
- Improve the CTA and form language for result-driven conversion.
- Apply a dark authority visual system to the funnel page only.

Out of scope:
- No homepage redesign.
- No global CTA changes.
- No navigation changes.
- No authority page changes.
- No top-level site restructuring.

Files expected to change:
- `src/app/(site)/player-trap/page.tsx`
- `src/app/(site)/player-trap/player-trap-assessment-client.tsx`
- `src/styles/components.css`
- `src/styles/layout.css`
- `tests/unit/*` if the funnel copy or behavior needs coverage
- `PLANS.md`
- `docs/plans/*`

Data contracts affected:
- None.

Agent permissions affected:
- None.

Validation steps:
- Run `npm run typecheck`.
- Run `npm run build`.
- Verify `/player-trap` renders in desktop and mobile widths.
- Verify the CTA still routes into the existing lead capture flow.
- Verify the result state remains functional.

Acceptance criteria:
- A visitor understands Player Trap within 5 seconds.
- The page looks and reads like a diagnostic, not a coaching landing page.
- The redesign stays isolated to `/player-trap`.
- Build passes.

Verification notes:
- Ran `npm test -- tests/unit/player-trap.test.ts`: passed.
- Ran `npm test`: passed, 16 files and 58 tests.
- Ran `npm run typecheck`: passed.
- Ran `npm run build`: passed with the pre-existing unused migration argument warnings in `src/migrations/20260607_205054.ts`.
- Verified `/player-trap` locally at `http://127.0.0.1:3011/player-trap` with Playwright fallback at desktop `1440x1100` and mobile `390x844`.
- Verified the primary CTA scrolls to `#player-trap-self-check`.
- Verified the quick diagnostic alert appears after three yes answers.
- Verified completed scoring shows the `Execution Bottleneck` result state.
- Verified the lead form posts to `/api/player-trap/lead` and redirects to `/player-trap/report/test-token` with a mocked successful response.

### Task 024 - Player Trap Bilingual Campaign Pages

State: `completed`
Lane: `conversion`, `public-rendering`, `lead-capture`, `campaign-localization`
Owner: Codex

Goal:
Create separate English and Hebrew Player Trap campaign landing pages with native page copy, shared diagnostic logic, language-aware lead tracking, and language-matched result pages.

Scope:
- Keep `/player-trap` as the English campaign page.
- Add `/player-trap-he` as the Hebrew RTL campaign page.
- Reorder both funnels around outcome, daily dependency pain, wrong fixes, reframe, Player Trap naming, diagnostic, result, and diagnosis-call CTA.
- Keep the 3-minute/no-fluff positioning, 120+ managers authority block, leadership evolution framework, and diagnostic scoring flow.
- Track campaign page language through lead submission and subscriber records.
- Render result pages and CTA copy in the selected language.

Out of scope:
- No homepage or global navigation changes.
- No new publishing workflow.
- No new unsupported proof points, testimonials, or client names.
- No direct translation between English and Hebrew.

Files expected to change:
- `src/app/(site)/player-trap/page.tsx`
- `src/app/(site)/player-trap-he/page.tsx`
- `src/app/(site)/player-trap/player-trap-assessment-client.tsx`
- `src/app/(site)/player-trap/report/[token]/page.tsx`
- `src/app/api/player-trap/lead/route.ts`
- `src/app/api/player-trap/diagnosis-call/route.ts`
- `src/lib/player-trap.ts`
- `src/payload/collections/content.ts`
- `src/styles/components.css`
- `tests/unit/player-trap.test.ts`
- `PLANS.md`
- `docs/plans/*`

Data contracts affected:
- Email subscriber records add `pageLanguage`, `testCompletedAt`, `resultProfile`, `resultScore`, `reportRequestedAt`, `diagnosisCallRequestedAt`, `contentConsentAccepted`, `cookiesConsentAccepted`, and `consentAcceptedAt` usage for Player Trap campaign tracking.

Agent permissions affected:
- None.

Validation steps:
- Run `npm test -- tests/unit/player-trap.test.ts`.
- Run `npm test`.
- Run `npm run typecheck`.
- Run `npm run build`.
- Verify `/player-trap` renders English LTR copy.
- Verify `/player-trap-he` renders Hebrew RTL copy.
- Verify both pages submit to the existing lead/result flow.
- Verify mocked lead records include `pageLanguage`.
- Verify report pages match the selected language and diagnosis-call CTA language.

Acceptance criteria:
- `/player-trap` renders the English StoryBrand-style page correctly.
- `/player-trap-he` renders the Hebrew direct-response page correctly.
- Hebrew page uses `dir="rtl"`.
- Both pages submit to the existing lead/result flow.
- Lead records include `pageLanguage`.
- Result pages match the selected language.
- CTA copy matches the page language.
- No mixed Hebrew/English except brand/model names.

Verification notes:
- Added `/player-trap-he` as a dedicated Hebrew RTL campaign page and kept `/player-trap` as the English campaign page.
- Reordered both campaign pages around the approved funnel logic: outcome, dependency scenes, wrong fixes, reframe, Player Trap naming, leadership evolution framework, authority block, diagnostic, result capture, and diagnosis-call CTA.
- Added native Hebrew funnel copy, Hebrew diagnostic questions, Hebrew answer choices, Hebrew report labels, and language-aware diagnosis-call redirects.
- Removed the duplicate quick-check step from the assessment flow so visitors answer one scoring diagnostic before lead capture.
- Added a result gate: visitors must complete all scoring questions, leave first name and email, and approve content/cookie consent before receiving the result report.
- Added server-side validation for first name, email, content consent, and cookie consent in `/api/player-trap/lead`.
- Persisted `pageLanguage`, result profile, result score, UTM attribution, test/report/diagnosis timestamps, and consent fields on email subscriber records.
- Verified production-mode local pages at `http://127.0.0.1:3023/player-trap` and `http://127.0.0.1:3023/player-trap-he`.
- Confirmed the Hebrew page contains Hebrew diagnostic questions and the lead form, and does not render the old English diagnostic question or duplicate quick-check prompt.
- Ran `npm test -- tests/unit/player-trap.test.ts`: passed.
- Ran `npm test`: passed, 16 files and 60 tests.
- Ran `npm run typecheck`: passed.
- Ran `npm run build`: passed with only the pre-existing unused migration argument warnings in `src/migrations/20260607_205054.ts`.

### Task 023C - Align Player Trap UX Copy With Current Verified Flow

State: `review`
Lane: `conversion`, `public-rendering`, `diagnostic-funnel`
Owner: Codex

Goal:
Improve conversion psychology inside the current verified Player Trap flow without changing the core mechanics.

Scope:
- Improve `/player-trap` and `/player-trap-he` copy hierarchy.
- Improve CTA wording.
- Improve assessment intro copy.
- Improve the locked-form explanation.
- Improve report page copy inside the existing hero/cards/CTA structure.
- Improve bilingual Hebrew/English wording.
- Fix mojibake or broken encoding in task docs or copied text.
- Update documentation so it reflects the current verified flow.

Out of scope:
- No pre-assessment self-identification step.
- No post-submit loading or analysis transition.
- No API contract changes.
- No Payload schema changes unless absolutely necessary.
- No report token logic changes.
- No email sending logic changes.
- No homepage or global navigation changes.
- No payment, book, or checkout changes.
- No report page architecture replacement.

Files expected to change:
- `src/app/(site)/player-trap/page.tsx`
- `src/app/(site)/player-trap-he/page.tsx`
- `src/app/(site)/player-trap/report/[token]/page.tsx`
- `src/app/(site)/player-trap/player-trap-assessment-client.tsx`
- `src/lib/player-trap.ts`
- `src/styles/components.css`
- `tests/unit/player-trap.test.ts`
- `PLANS.md`
- `docs/plans/*`
- `docs/Task 023B — Player Trap Funnel Flow.txt`

Data contracts affected:
- None expected.

Agent permissions affected:
- None.

Validation steps:
- Run `npm test -- tests/unit/player-trap.test.ts`.
- Run `npm test`.
- Run `npm run typecheck`.
- Run `npm run build`.
- Verify English and Hebrew flows still complete end to end.
- Verify submit still posts directly to `/api/player-trap/lead`.
- Verify report redirect still works.
- Verify diagnosis call CTA still tracks and redirects.

Acceptance criteria:
- English flow still works end to end.
- Hebrew flow still works end to end.
- Submit still posts directly to `/api/player-trap/lead`.
- Report redirect still works.
- Payload subscriber record is still created.
- Resend still works.
- Diagnosis call CTA still tracks and redirects.
- No regressions to verified production behavior.

Verification notes:
- Task 023B is superseded and should not be treated as canonical.
- Current verified production flow remains the source of truth.
- Completed copy alignment across the English and Hebrew Player Trap campaign pages and the report page while keeping the verified funnel mechanics unchanged.
- Updated locked-form, CTA, and report copy to match the current verified flow and bilingual handling.
- Validation passed: `npm test -- tests/unit/player-trap.test.ts`, `npm test`, `npm run typecheck`, and `npm run build`.
- Production-mode local verification was completed for both `/player-trap` and `/player-trap-he`.

### Task 025 - Codex-Run Agent Contract System

State: `completed`
Lane: `contracts`, `documentation`, `tests`
Owner: Codex

Goal:
Define the codex-run agent contract system for the Authority Engine before any runtime orchestration exists.

Scope:
- Define typed contracts for the 16 content-production agents.
- Define Zod schemas for Approved Insight, KnowledgeAsset, Claim Ledger, DistributionAsset, and PerformanceSignal contracts.
- Define prompt shells and versioned prompt metadata.
- Document the architecture decision block for the codex-run factory.
- Add contract validation tests.
- Update supporting documentation only where needed.

Out of scope:
- No runtime content generation.
- No provider calls.
- No LangGraph orchestration execution.
- No publishing.
- No Payload schema migration unless explicitly required by the contract design.
- No homepage changes.
- No Player Trap changes.

Files expected to change:
- `docs/plans/2026-06-09-agent-factory-contracts.md`
- `AGENT_FACTORY.md` if needed
- `DATA_CONTRACTS.md` if needed
- `src/ai/agents/*` or other safe Type/Zod contract files
- `tests/unit/*`
- `PLANS.md`

Data contracts affected:
- Approved Insight contract
- KnowledgeAsset contract
- Claim Ledger contract
- DistributionAsset contract
- PerformanceSignal contract

Agent permissions affected:
- None.

Validation steps:
- Run `npm test -- tests/unit/agent-factory-contracts.test.ts`.
- Run `npm test`.
- Run `npm run typecheck`.
- Confirm no runtime generation paths were added.

Acceptance criteria:
- Codex-run factory contracts exist without runtime execution.
- 16 content-production agent contracts are defined.
- PerformanceLearningAgent is deferred to Task 031.
- Approved Insights live in Payload or the existing `InsightExtractions` storage if present.
- KnowledgeAsset is the canonical output contract.
- Claim Ledger contract exists in Task 025.
- Recommendation pages are review-ready drafts only.
- Distribution assets are drafts only and are not auto-published.
- No runtime generation exists in Task 025.

Verification notes:
- Task 025 has been reserved as the contracts-only phase for the agent factory.
- The plan will define contract-first boundaries before any orchestration or provider work begins.
- Added contract-only Zod schemas for `ApprovedInsight`, `KnowledgeAsset`, `ClaimLedger`, `DistributionAsset`, and `PerformanceSignal`.
- Enforced `DistributionAsset.reviewStatus = "draft"` in the Zod contract and regression test.
- Added the 16-agent factory registry, prompt shell metadata, phase metadata, and exports from `src/ai/agents/index.ts`.
- Documented the codex-run factory architecture decisions in `AGENT_FACTORY.md` and added the contract section to `DATA_CONTRACTS.md`.
- Confirmed `PerformanceLearningAgent` remains deferred to Task 031.
- Confirmed no provider calls, LangGraph execution, Payload writes, publishing logic, or runtime generation paths were added for Task 025.
- Ran `npm test -- tests/unit/agent-factory-contracts.test.ts`: passed, 1 file and 5 tests.
- Ran `npm test`: passed, 17 files and 63 tests.
- Ran `npm run typecheck`: passed.

### Task 013 - Authority Surface Seed

State: `completed`
Lane: `content-seed`, `public-rendering`
Owner: Codex

Goal:
Create the first manually-authored authority assets that sit on top of the canonical authority graph.

Scope:
- Create three draft authority surface assets: one framework, one methodology, and one pillar page.
- Seed only information already established in the canonical entities, approved insight, and existing authority graph.
- Keep the authority graph contracts unchanged.
- Verify the assets render through Payload and the site build path.

Out of scope:
- No AI-generated bulk content.
- No automatic publishing.
- No monitoring records.
- No new entities.
- No schema changes.
- No new collections.

Files expected to change:
- `src/seed/*`
- `docs/seed-content/*`
- `tests/unit/*`
- `package.json`
- `package-lock.json`
- `PLANS.md`

Data contracts affected:
- None.

Agent permissions affected:
- None.

Validation steps:
- Run the surface seed script.
- Confirm records exist in Payload.
- Confirm the build passes.
- Confirm entity tags and internal links resolve against the existing graph.
- Confirm the surface verifier completes end-to-end and writes a verification report.

Acceptance criteria:
- One framework page exists.
- One methodology page exists.
- One pillar page exists.
- All assets are draft or review status.
- Assets connect to existing graph entities.
- Build passes.

Verification notes:
- Surface seed structure is implemented and typechecked.
- Fixed the Task 013 seed and verifier CLI entrypoints so successful Payload runs exit cleanly instead of hanging on open runtime handles.
- Ran `npm run seed:authority-surface`: seeded 3 authority surface assets.
- Ran `npm run verify:authority-surface`: passed and wrote `TASK_013_VERIFICATION_REPORT.md`.
- Verification report confirms 9 entities, 8 relationships, 1 insight, and all three surface records pass existence, title, status, public route, entity tag, and internal link checks.
- Ran `npm run typecheck`: passed.
- Ran `npm test`: 12 files passed, 42 tests passed.
- Ran `npm run build`: passed with four existing migration warnings in `src/migrations/20260607_205054.ts`.
- The surface assets are intentionally structure-first and thin; content depth can be expanded after the graph-to-rendering path is proven.

### Task 014 - Minimal Authority Design System

State: `review`
Lane: `design-system`, `public-rendering`
Owner: Codex

Goal:
Create a minimal authority-focused design system that supports long-form public content, AI discovery, and high readability over visual impressiveness.

Scope:
- Refine global site CSS tokens, base styles, typography, layout, and components.
- Keep the system clean, fast, mobile-first, and readable.
- Remove decorative motion, visual effects, and negative tracking from public styles.
- Add a lightweight style contract test for the authority design constraints.

Out of scope:
- No content generation.
- No schema changes.
- No collection changes.
- No animation or visual-effect libraries.
- No Payload admin redesign.

Files expected to change:
- `src/styles/*`
- `tests/unit/*`
- `PLANS.md`

Data contracts affected:
- None.

Agent permissions affected:
- None.

Validation steps:
- Run the design-system style contract test.
- Run `npm run lint`.
- Run `npm run typecheck`.

Acceptance criteria:
- Public styles are mobile-first and optimized for long-form authority content.
- Typography uses strong readable defaults with non-negative letter spacing.
- Public CSS contains no animations, transitions, shadows, filters, gradients, transforms, backdrop effects, or blend modes.
- Layout supports extractable content sections and LLM-readable long-form pages.

Verification notes:
- Added `tests/unit/authority-design-system.test.ts` to enforce no animation/effect declarations and long-form readability tokens.
- Ran focused style contract test: passed.
- Ran `npm test`: 12 files passed, 42 tests passed.
- Ran `npm run lint`: passed with four existing warnings in `src/migrations/20260607_205054.ts`.
- Ran `npm run typecheck`: passed.
- Ran `npm run build`: passed with the same existing migration warnings.
- Verified `http://localhost:3001/` with Playwright snapshot and screenshots at desktop and mobile widths.
- Mobile check confirmed no horizontal overflow, 17px body text, and no loaded transition declarations.

### Task RC-01 - Authority Engine Alpha Snapshot

State: `completed`
Lane: `release`, `documentation`, `verification`
Owner: Codex

Goal:
Capture and preserve the current working Authority Engine state before any growth, SEO, or integration work begins.

Scope:
- Audit the working tree and write `WORKSPACE_DIFF_REPORT.md`.
- Group the current changes by completed task: Task 012, Task 013, Task 014, Task 017, and Task 018.
- Verify `npm run typecheck`, `npm run build`, and `npm test`.
- Write `AUTHORITY_ENGINE_ALPHA_RELEASE.md`.
- Commit the release snapshot in logical groups and push all commits.
- Tag the release `authority-engine-alpha`.

Out of scope:
- No new product features.
- No schema changes.
- No new collections.
- No auto-publishing.

Files expected to change:
- `PLANS.md`
- `WORKSPACE_DIFF_REPORT.md`
- `AUTHORITY_ENGINE_ALPHA_RELEASE.md`
- `docs/*`
- `src/*`
- `tests/*`

Validation steps:
- Run `npm run typecheck`.
- Run `npm run build`.
- Run `npm test`.
- Confirm the working tree is clean after the release commits.
- Confirm the remote branch is updated.
- Confirm the `authority-engine-alpha` tag exists.

Acceptance criteria:
- No critical work exists only on the local machine.
- Alpha snapshot is reproducible.
- GitHub is the source of truth.
- Working tree is clean.

Verification notes:
- Ran `npm run typecheck`: passed.
- Ran `npm test`: passed.
- Ran `npm run build`: passed.
- Captured the workspace diff and release summary in `WORKSPACE_DIFF_REPORT.md` and `AUTHORITY_ENGINE_ALPHA_RELEASE.md`.

### Task 026B - First Content Publishing Sprint

State: `completed`
Lane: `content-seed`, `public-rendering`, `authority-copy`
Owner: Codex

Goal:
Convert the strongest existing recommendation drafts and insight-backed content into the first review-ready authority pages for the site.

Scope:
- Select 3 priority content assets from the existing insight repository and recommendation drafts.
- Prefer pages that strengthen Player Trap, Invisible Executor, and Itay recommendation intent.
- Expand the selected assets into full review-ready website content.
- Store the updates in the existing Payload seed structure currently used by the site.
- Keep every asset in `review` status unless explicit human approval exists.
- Make sure the selected pages render cleanly on the public site once approved/published.

Out of scope:
- No LangGraph.
- No provider calls.
- No autonomous generation.
- No new runtime.
- No auto-publishing without human approval.
- No fake testimonials.
- No unsupported metrics.

Files expected to change:
- `src/seed/authority-asset-production-sprint.ts`
- `docs/seed-content/*`
- `src/components/public-content-page.tsx`
- `tests/unit/*`
- `PLANS.md`

Data contracts affected:
- Public content record shape
- Authority asset sprint seed shape

Agent permissions affected:
- None.

Validation steps:
- Run the content verifier if available.
- Run `npm test`.
- Run `npm run typecheck`.
- Run `npm run build`.
- Verify the selected pages render locally or through the existing review-safe route.

Acceptance criteria:
- At least 3 full review-ready authority pages exist.
- Each selected page is connected to a target query.
- Each selected page strengthens Player Trap, Invisible Executor, or Itay authority.
- Each selected page has a CTA into the business funnel.
- No unsupported claims are introduced.

Verification notes:
- Expanded the three selected review-ready pages into full authority assets with definition, framework, symptom, uncomfortable truth, target-question, citation, FAQ, and internal-link sections.
- Updated the public content renderer so the secondary CTA points to the Player Trap test and the content body can render labeled authority sections.
- Updated the AI-facing llms text to surface the Player Trap route and CTA alignment.
- Ran `npm run seed:authority-asset-sprint`: passed and seeded 10 authority asset production sprint assets.
- Ran `npm run verify:authority-asset-sprint`: passed.
- Verified the updated routes locally in Playwright and confirmed the H1, definition section, framework section, symptom section, uncomfortable-truth section, Book a fit call CTA, and Player Trap CTA render on the page.
- Ran `npm test`: passed, 21 test files and 78 tests.
- Ran `npm run typecheck`: passed.
- Ran `npm run build`: passed with the existing unused-variable warnings in `src/migrations/20260607_205054.ts`.

## Commit Discipline

Prefer small commits per task. Do not mix documentation, scaffolding, product features, and generated content in the same commit unless the task explicitly requires it.

### Task 056 - Authority Engine Architecture Simplification

State: `completed`
Lane: `architecture`, `contracts`, `payload-model`, `deterministic-governance`
Owner: Codex

Goal:
Reduce contract, collection, and agent complexity while preserving human publishing gates and establishing `Itay Foyerstein` as the single canonical Person entity.

Scope:
- Document the approved simplification design and migration sequence.
- Consolidate duplicated contract definitions behind canonical runtime schemas.
- Introduce one authority-content model with deterministic content types while preserving compatibility during migration.
- Consolidate overlapping insight and monitoring models where migration can be verified safely.
- Replace agent roles with deterministic functions when the decision is rule-based.
- Enforce `Itay Foyerstein` as the canonical Person entity and treat spelling variants as aliases only.

Out of scope:
- No publishing.
- No provider calls or runtime agents.
- No destructive database migration without a verified compatibility path.
- No removal of human review gates.
- No new authority content.

Data contracts affected:
- Authority content
- Approved insight
- Visibility observation
- Workflow execution metadata
- Canonical entity identity

Validation steps:
- Run focused architecture contract tests.
- Run `npm test`.
- Run `npm run typecheck`.
- Run `npm run build`.
- Verify existing Payload data remains readable during migration.

Acceptance criteria:
- One canonical Person entity exists for Itay Foyerstein.
- Duplicate contract definitions have a documented canonical owner.
- Rule-based schema, linking, quality, scoring, routing, and publication decisions are deterministic.
- Collection consolidation has a non-destructive migration path.
- No agent can publish content.

### Task 057 - Dependency Vulnerability Remediation

State: `completed`
Lane: `security`, `dependencies`, `verification`
Owner: Codex

Goal:
Reduce npm audit findings through compatible, non-breaking dependency updates and verify the application remains healthy.

Scope:
- Apply non-force npm security fixes where compatible.
- Upgrade direct dependencies only when the resulting versions remain within the supported stack.
- Re-run audit, typecheck, tests, and build.

Out of scope:
- No `npm audit fix --force`.
- No unrelated feature changes.
- No publishing or deployment.

Acceptance criteria:
- No unreviewed breaking dependency changes are introduced.
- Production dependency vulnerabilities are reduced or documented with an explicit compatibility blocker.
- Typecheck, tests, and build pass after remediation.

Verification notes:
- Updated Payload packages from 3.85.0 to 3.85.2, removing the production `undici` vulnerability chain.
- Kept Next.js at 15.4.11 because the installed Payload 3.85.2 peer range excludes Next 15.5.x; upgrading Next requires a separately verified Payload compatibility change.
- `npm audit --omit=dev` reduced to 7 remaining findings: 6 moderate and 1 high, with no critical production finding. Remaining issues are Next.js 15.4.11 and an esbuild chain with no compatible fix available.
- Ran `npm run typecheck`: passed.
- Ran `npm test`: passed, 32 test files and 126 tests.
- Ran `npm run build`: passed with the existing migration and seed lint warnings.

### Task 058 - Post-Publication Production Observation and Chief of Staff Decision

State: `completed`
Lane: `production-observation`, `measurement`, `chief-of-staff`
Owner: Codex

Goal:
Refresh the production observation after the June 17 authority publication and produce an evidence-bound Chief of Staff next-best-action decision.

Scope:
- Observe the live production deployment and canonical domain.
- Verify public authority routes, crawlability, machine-readable surfaces, schema, internal links, CTAs, and measurement markers.
- Reconcile the published surface with the draft and KnowledgeAsset backlog.
- Produce a dated append-only observation report and a new Chief of Staff recommendation.

Out of scope:
- No provider calls to AI answer engines.
- No new content generation.
- No publishing changes.
- No autonomous business decision.

Acceptance criteria:
- The observation names the platform, checked routes, timestamps, observed state, gaps, and evidence.
- The report distinguishes verified production facts from unavailable AI recommendation measurements.
- The Chief of Staff decision contains all required decision-loop outputs.
- The next action is constrained to an existing safe action category and preserves human approval boundaries.

Verification notes:
- Observed Vercel production deployment `dpl_Eu2LeCHGpb74XbmEME6B1He2iJiE` in `Ready` state on July 12, 2026.
- Verified all 50 sitemap URLs return HTTP 200; robots allows crawling and declares the canonical sitemap.
- Verified `llms.txt`, canonical metadata, authority CTAs, internal links, Problem Page JSON-LD, and the Vercel Analytics script delivery surface.
- Detected that all 10 Problem Pages are in the sitemap while 9 return `noindex`; `CTO Becomes the Bottleneck` is marked published in the repository but noindexed in production.
- Produced `TASK_058_PRODUCTION_OBSERVATION.md` and `TASK_058_CHIEF_OF_STAFF_DECISION.md`.
- Selected `repair_visibility_gap` as the next safe action and stopped at the human publication-state approval boundary.
- Explicitly recorded answer-engine recommendation position and score delta as unavailable because no provider checks were authorized or performed.
- Ran required-output and whitespace verification for the new reports: passed.
- Incorporated the human-supplied GSC snapshot: 147 impressions, 1 click, `/pillars/tech-leadership-coaching` as the dominant page, `technical leadership coaching` as the dominant query, and 0 Problem Pages visible in GSC.
- Updated the decision owner to Engineering and expanded `repair_visibility_gap` to cover Payload status, robots metadata, sitemap, `llms.txt`, draft-backlog resolution, and pillar internal-link verification.

### Task 059 - Publication State Integrity and Operating Loop Heartbeat

State: `completed`
Lane: `production-observation`, `measurement`, `chief-of-staff`, `public-surface-contracts`
Owner: Codex

Goal:
Repair publication-state integrity for the Problem Pages and add the minimal deterministic operating-loop heartbeat using one shared publication decision helper and one persisted OperatingCycle record.

Scope:
- Derive publication state from one shared `PublicationDecision` helper.
- Keep route metadata, sitemap, and `llms.txt` aligned to the same source record and decision helper.
- Add deterministic invalid-state reason codes for conflicting lifecycle and discovery states.
- Add one persisted `OperatingCycle` contract with snapshot, next-best-action, stop-point, review-date, and measurement-window state.
- Record local baseline and local post-repair verification only; keep real post-deployment observation pending human authorization.

Out of scope:
- No deployment, commit, push, or publish.
- No autonomous publishing.
- No new runtime agent.
- No broad refactor of unrelated content contracts.

Files expected to change:
- `src/lib/problem-pages.ts`
- `src/lib/public-content-loader.ts`
- `src/app/(site)/problems/[slug]/page.tsx`
- `src/app/sitemap.ts`
- `src/app/llms.txt/route.ts`
- `src/lib/public-authority-routes.ts`
- `src/domain/authority-contracts.ts`
- `src/ai/governance/authority-decisions.ts`
- `src/ai/governance/index.ts`
- `src/ai/workflows/*`
- `tests/unit/*`
- `TASK_058_PRODUCTION_OBSERVATION.md`
- `TASK_058_CHIEF_OF_STAFF_DECISION.md`
- `TASK_059_*`
- `PLANS.md`

Data contracts affected:
- PublicationDecision
- OperatingCycle
- SystemSnapshot

Agent permissions affected:
- No new agent permissions.
- Human publishing approval remains mandatory.

Validation steps:
- Run targeted unit tests for publication decision, sitemap/llms consistency, invalid-state reason codes, and operating-cycle persistence.
- Run `npm test`.
- Run `npm run typecheck`.

Acceptance criteria:
- Published Problem Pages are indexable and discoverable through the shared helper.
- Draft Problem Pages are excluded from sitemap and `llms.txt`.
- Invalid states emit explicit reason codes.
- Exactly one active Next Best Action is persisted per cycle.
- Local verification records the expected post-deployment measurement window but does not open it.
- Human deployment approval remains outside this task.

Verification completed 2026-07-12:
- `npm test`: passed, 34 files / 136 tests.
- `npm run typecheck`: passed.
- `npm run build`: passed; only pre-existing unused-variable lint warnings in migrations and seed code.
- Baseline preserved in `TASK_058_PRODUCTION_OBSERVATION.md`.
- Local-only verification recorded in `TASK_059_LOCAL_POST_REPAIR_VERIFICATION.md`; it is explicitly not a Production Observation.
- Resolution report, Chief of Staff decision, operating-cycle record, and architecture note added under `TASK_059_*` and `docs/notes/`.
- Live Payload/GSC/Vercel access remains unavailable; AI recommendation visibility remains `unmeasured`.
- No commit, push, deploy, or publish performed.

Unresolved blocker: authorized human review and deployment are required before confirming production behavior or opening a real measurement window. Required pending action: **Run post-deployment Production Observation** after a deployment identifier or timestamp is provided.

Next review trigger/date: immediately after authorized deployment, or scheduled review on `2026-07-13` if deployment has not occurred.

Task 059 status clarification:
- Implementation state: `completed`.
- Production rollout state: `pending human deployment`.
- Operating-cycle state: `blocked at deployment approval`.
- Measurement window: `not opened`.

Post-deployment observation attempted 2026-07-12 at `2026-07-12T19:18:46.3104335+03:00`:
- Live HTTP was available, but no deployment identifier was supplied.
- `CTO Becomes the Bottleneck` still returns `noindex, nofollow`; the repair is not confirmed in production.
- The second published Problem Page is indexable; drafts remain noindex and excluded from sitemap/`llms.txt`.
- The live pillar HTML did not contain links to either published Problem Page.
- Production measurement window remains closed/pending deployment verification.
- Follow-up remains **Run post-deployment Production Observation** after an authorized deployment identifier/timestamp is available.

### Task 060 - Authority Content Factory Root-Cause Diagnosis

State: `completed`
Lane: `factory-diagnosis`, `chief-of-staff`, `governance`
Owner: Codex

Goal:
Diagnose why production stopped after the first 10 KnowledgeAssets and 10 Problem Pages before proposing any new router, workflow, or contract.

Scope:
- Trace the exact KnowledgeAsset and Problem Page creation mechanisms.
- Inspect PageBrief lifecycle, Chief of Staff decisions, freshness gates, automation, schedulers, and completion behavior.
- Produce a repository-evidence root-cause report and the smallest implementation proposal.

Out of scope:
- No code implementation in this diagnosis phase.
- No new Action Router or orchestration layer.
- No deploy, publish, commit, or push.

Deliverable:
- `TASK_060_AUTHORITY_FACTORY_ROOT_CAUSE_REPORT.md`

Verification notes:
- Root cause documented from repository evidence: finite one-time seed/sprint execution plus no executable Chief of Staff continuation mapping or scheduler.
- Secondary 30-day freshness gate identified in `content-generation-gate.ts` and `contentDraftWorkflow.ts`; no code changed.
- Smallest proposal reuses existing conversion, Payload persistence, PageBrief, draft workflow, and OperatingCycle components without an Action Router.
- No new material decision appended because the proposed approach has not been selected.

### Task 061 - Bounded ProductionDirective Factory Continuation

State: `completed`
Lane: `factory`, `chief-of-staff`, `governance`
Owner: Codex

Goal:
Execute one small bounded ProductionDirective using existing factory components, producing non-public KnowledgeAssets and review-ready drafts only.

Scope:
- Select up to three unconverted Approved Insights in one prioritized cluster.
- Convert them to KnowledgeAssets and PageBrief-backed drafts.
- Replace the global 30-day freshness gate with claim-level evidence-sensitive validation.
- Persist bounded execution state on the existing OperatingCycle result.
- Run a manual repository-only bounded execution and report its stop point.

Out of scope:
- No Action Router, scheduler, orchestration framework, AgentRun, ContentJob, deployment, publication, commit, or push.

Files expected to change:
- `src/ai/governance/content-generation-gate.ts`
- `src/ai/workflows/contentDraftWorkflow.ts`
- `src/ai/workflows/operating-cycle.ts`
- `src/ai/workflows/production-directive.ts`
- `src/domain/authority-contracts.ts`
- `src/seed/knowledge-asset-conversion-sprint.ts`
- `tests/unit/*`
- `decisions.md`
- `PLANS.md`

Verification notes:
- Added one bounded `runProductionDirective` executor; no Action Router, scheduler, AgentRun, ContentJob, or orchestration framework.
- Manual run selected `Player Trap`, consumed `approved-insight-player-trap-05`, `-06`, and `-07`, created 3 KnowledgeAssets and 3 PageBrief-backed drafts, and stopped at `directive_target_reached`.
- The Task 061 outputs were scaffold-level drafts that required additional validation before they could be considered review-ready; no publication path was invoked.
- Claim-level evidence validation replaced the global captured-date freshness block.
- ProductionDirective decision appended as `DEC-20260712-04` to `decisions.md`.
- `npm test`: passed, 35 files / 139 tests.
- `npm run typecheck`: passed.
- Manual run report: `TASK_061_MANUAL_PRODUCTION_DIRECTIVE_RUN.md`.
- No deploy, publish, commit, or push performed.

### Task 062 - Player Trap ProductionDirective Publish-Readiness Review

State: `completed`
Lane: `review`, `content-quality`, `canonical-ownership`
Owner: Codex

Goal:
Review the three drafts produced by the bounded Player Trap ProductionDirective before any further content production.

Scope:
- Inspect the actual draft prose and PageBrief metadata.
- Check intent uniqueness, overlap, evidence, canonical ownership, links, CTA, schema, and quality validation.
- Record the local dev-server cache/module issue from `start-3006.err` separately.

Out of scope:
- No new content generation.
- No publication, deployment, commit, or push.

Deliverable:
- `TASK_062_PLAYER_TRAP_DRAFT_PUBLISH_READINESS_REVIEW.md`

Verification notes:
- Reviewed all three actual draft scaffolds, their PageBrief metadata, evidence context, canonical paths, overlap, links, CTAs, schema, and structural quality results.
- Draft 05: `merge` into `/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck`.
- Draft 06: `merge` into `/frameworks/player-trap`.
- Draft 07: `archive` as a standalone surface; preserve only as a possible supporting section.
- No draft is approved for publication and no new content was generated.
- Recorded `start-3006.err` as a local Next.js cache/module issue, separate from factory health.

### Task 063 - Player Trap Draft Merge Into Canonical Cluster Page

State: `completed`
Lane: `content-seed`, `canonical-ownership`, `review`
Owner: Codex

Goal:
Merge the reviewed Player Trap cluster draft into the canonical review-ready public surface and verify the resulting content remains review-safe.

Scope:
- Reuse the existing `coach-for-engineering-managers-stuck-as-the-bottleneck` cluster surface.
- Add the diagnosis-first lead and explicit CTA block approved during the publish-readiness review.
- Keep the asset in `review` status and preserve human approval boundaries.
- Update the content-level regression test to cover the merge outcome.

Out of scope:
- No publication, deployment, commit, or push.
- No new router, workflow, contract, or autonomous content generation.

Files expected to change:
- `docs/seed-content/coach-for-engineering-managers-stuck-as-the-bottleneck.md`
- `src/seed/review-ready-public-surface-batch.ts`
- `tests/unit/review-ready-public-surface-batch.test.ts`
- `PLANS.md`

Acceptance criteria:
- The cluster draft reads as a coherent review-ready asset with diagnosis-first framing and an explicit CTA section.
- The batch seed and source document remain aligned.
- Regression tests pass.

Verification notes:
- Updated the canonical bottleneck cluster source to start with diagnosis-first framing and an explicit CTA section.
- Synced the review-ready batch payload copy with the source document.
- Added a unit test that asserts the merged surface keeps the diagnosis-first and CTA language in place.
- `npm test`: passed, 35 files / 140 tests.
- `npm run typecheck`: passed.
- No publication, deployment, commit, or push performed.

### Task 064 - Player Trap Draft 06 Canonical Merge

State: `completed`
Lane: `content`, `canonical-ownership`, `factory`
Owner: Codex

Goal:
Merge the Player Trap Draft 06 insight into the existing canonical Player Trap framework surface without creating a new public route.

Scope:
- Update the canonical framework content so it frames the shift from answers to stronger operating systems.
- Keep the merge target as `/frameworks/player-trap`.
- Leave Draft 07 untouched for now.

Out of scope:
- No publication, deployment, commit, or push.
- No new route, workflow, router, or contract.

Files expected to change:
- `src/lib/public-content.ts`
- `tests/unit/public-content.test.ts`

Acceptance criteria:
- The Player Trap framework content includes the manager identity shift language from Draft 06.
- The canonical framework surface remains review-safe and non-published.
- Regression tests pass.

Verification notes:
- Merged Draft 06 into the canonical `/frameworks/player-trap` static content surface.
- Added a regression test that asserts the framework surface carries the manager identity shift language.
- `npm test -- tests/unit/review-ready-public-surface-batch.test.ts tests/unit/canonical-authority-sprint.test.ts tests/unit/public-content.test.ts`: passed, 16 tests.
- `npm run typecheck`: passed.
- No publication, deployment, commit, or push performed.

### Task 065 - PageBrief Compliance Hard Gate

State: `completed`
Lane: `factory`, `governance`, `review`
Owner: Codex

Goal:
Replace scaffold-level false positives with explicit content maturity states and a deterministic PageBrief compliance hard gate.

Scope:
- Classify draft maturity explicitly.
- Add a deterministic `validatePageBriefCompliance(pageBrief, draft)` hard gate.
- Ensure content-quality scoring runs only after hard-gate compliance passes.
- Reclassify the Task 061 outputs as scaffolds / needs_generation in factual records.

Out of scope:
- No publication, deployment, commit, or push.
- No new production directive.
- No new authority asset.

Files expected to change:
- `src/ai/governance/*`
- `src/ai/workflows/contentDraftWorkflow.ts`
- `src/ai/workflows/production-directive.ts`
- `src/seed/run-production-directive.ts`
- `TASK_061_MANUAL_PRODUCTION_DIRECTIVE_RUN.md`
- `tests/unit/*`
- `PLANS.md`

Verification notes:
- `npm test`: passed, 36 files / 148 tests.
- `npm run typecheck`: passed.
- Exact Task 061 scaffold validation failures: `missing_required_section`, `missing_reader_facing_prose`, `missing_cta_label`, `missing_cta_href`, `missing_required_internal_link`, `primary_intent_unanswered`.

### Task 066 - Canonical Bottleneck Positive Path Verification

State: `completed`
Lane: `factory`, `review`
Owner: Codex

Goal:
Prove one bounded ProductionDirective can turn the canonical Player Trap scaffold into a complete review-ready draft on the existing bottleneck surface.

Scope:
- Reuse the existing `/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck` surface.
- Produce exactly one complete reader-facing draft with the existing ContentDraftingAgent path.
- Verify compliance, quality, evidence, canonical ownership, and intent collision handling.

Out of scope:
- No new URL.
- No new PageBrief.
- No extra batch.
- No publishing, deployment, commit, or push.

Files expected to change:
- `src/ai/workflows/production-directive.ts`
- `src/ai/workflows/contentDraftWorkflow.ts`
- `tests/unit/*`
- `PLANS.md`

Verification notes:
- `npm test -- tests/unit/page-brief-compliance.test.ts tests/unit/content-draft-workflow.test.ts tests/unit/production-directive.test.ts`: passed, 12 tests.
- `npm test`: passed, 36 files / 148 tests.
- `npm run typecheck`: passed.
- Factual correction recorded by Task 068: the original Task 066 output was a false positive and is preserved as the regression baseline with `maturity = complete_draft`, `saveStatus = needs_revision`, `review_ready = false`, and a premature human approval request.
- The original verification counts above describe the historical false-positive run; they do not establish review readiness under the repaired contract.

### Task 067 - Review-Ready Validation Repair Plan

State: `completed`
Lane: `governance`, `factory`, `content-quality`
Owner: Codex

Goal:
Document the test-first repair plan for the false-positive `review_ready` decision exposed by Task 066.

Scope:
- Correct the factual classification of Task 066.
- Define independent hard gates for generated prose, rendered links and CTA, claim-level evidence, intent/canonical ownership, and content quality.
- Require real ContentDraftingAgent provenance before a generated artifact can advance.
- Specify regression and positive-path verification using exactly the existing Draft 05 asset.

Out of scope:
- No implementation of the repair.
- No new content generation, publication, deployment, commit, or push.

Deliverable:
- `docs/plans/2026-07-12-review-ready-validation-repair.md`

Verification notes:
- Documented the test-first repair sequence for the Task 066 false-positive `review_ready` result.
- The plan preserves the existing ProductionDirective, ContentDraftingAgent boundary, content draft workflow, OperatingCycle, canonical URL, PageBrief, and human publication gate.
- The plan requires exact Task 066 RED regression coverage, rendered Markdown link/CTA validation, claim-level evidence mapping, explanatory quality dimensions, truthful generation provenance, and one centralized readiness transition.
- No implementation, content generation, publication, deployment, commit, or push was performed.
- Accepted implementation scope was subsequently reduced to the objective 80/20 hard gates plus semantic quality evaluation described in Task 068 and `DEC-20260712-07`.

### Task 068 - Review-Ready Gate 80/20 Repair and Draft 05 Revision

State: `completed`
Lane: `governance`, `factory`, `content-quality`
Owner: Codex

Goal:
Implement the accepted reduced Task 067 scope so the exact Task 066 false positive is rejected and the existing Draft 05 can advance only through objective hard gates plus an explicit semantic quality evaluation.

Scope:
- Correct and preserve the Task 066 factual baseline.
- Add objective Markdown link/CTA, meta-copy, evidence-map, canonical ownership, and known collision checks.
- Add a structured semantic quality result for the eight requested dimensions.
- Revise only `authority-draft-approved-insight-player-trap-05` on its existing PageBrief and canonical surface.

Out of scope:
- No generalized deterministic depth, usefulness, differentiation, audience-fit, persuasion, authority-strength, or semantic-purpose heuristics.
- No new URL, PageBrief, authority asset, batch, router, scheduler, orchestration layer, deployment, publication, commit, or push.

Files expected to change:
- `src/ai/governance/page-brief-compliance.ts`
- `src/ai/governance/content-quality-gate.ts`
- `src/ai/workflows/contentDraftWorkflow.ts`
- `src/ai/workflows/production-directive.ts`
- `tests/unit/page-brief-compliance.test.ts`
- `tests/unit/content-quality-gate.test.ts`
- `tests/unit/content-draft-workflow.test.ts`
- `tests/unit/production-directive.test.ts`
- `TASK_066_CANONICAL_BOTTLENECK_POSITIVE_PATH.md`
- `PLANS.md`

Verification notes:
- Corrected the original Task 066 classification to `complete_draft / needs_revision / review_ready=false` and preserved the rejected draft verbatim as the regression baseline.
- Added objective hard gates for known reader-visible meta-copy, renderable Markdown CTA and internal links, CTA context, structured claim-level evidence mappings, canonical ownership, and known intent collisions.
- No direct Markdown dependency exists in `package.json`; the implementation uses only a bounded inline-link extractor and does not implement a general Markdown parser.
- The quality evaluator now requires all eight semantic dimensions to return score, pass/fail, a draft-grounded reason, and a revision recommendation when failed; generic success language is not accepted.
- Revised only `authority-draft-approved-insight-player-trap-05`, reused its existing PageBrief identity and canonical path, and synchronized the existing canonical seed/source content without creating another URL, asset, or batch.
- Bounded recheck result: insight consumed `approved-insight-player-trap-05`; deterministic validation passed with no failures; all eight semantic dimensions passed; final maturity/save status `review_ready`; publication remains non-public and human approval remains pending.
- `npm test -- tests/unit/page-brief-compliance.test.ts tests/unit/content-quality-gate.test.ts tests/unit/content-draft-workflow.test.ts tests/unit/production-directive.test.ts tests/unit/review-ready-public-surface-batch.test.ts`: passed, 5 files / 24 tests.
- `npm test`: passed, 36 files / 153 tests.
- `npm run typecheck`: passed.
- `git diff --check`: passed with existing LF-to-CRLF warnings only.
- Decision appended as `DEC-20260712-07` in the append-only `decisions.md`.
- No deployment, publication, commit, or push was performed.

### Task 069 - Draft 05 Human Approval and Deployment Preparation

State: `completed`
Lane: `governance`, `approval`, `deployment-readiness`
Owner: Codex

Goal:
Record the explicit human approval for Draft 05 and prepare a locally verified, narrowly scoped deployment package without executing deployment.

Scope:
- Transition only `authority-draft-approved-insight-player-trap-05` from `review_ready` to `human_approved`.
- Bind approval to an immutable content revision hash, canonical path, supporting Approved Insights, validation result, approver record, and explicit publication scope.
- Verify locally that the approved revision, CTA, internal links, canonical metadata, publication surfaces, CTO repair, and pillar-to-Problem-Page links are included.

Out of scope:
- No approval or publication of any other draft.
- No ProductionDirective run.
- No commit, push, deployment, or publication.

Deliverables:
- Machine-verifiable approval metadata on the existing Draft 05 authority asset.
- `TASK_069_DRAFT_05_HUMAN_APPROVAL_AND_DEPLOYMENT_PACKAGE.md`.
- Regression tests for approval scope and deployment prerequisites.

Verification notes:
- Recorded the transition for only `authority-draft-approved-insight-player-trap-05`: `review_ready → human_approved`.
- Approval timestamp: `2026-07-12T22:50:58.0453369+03:00`; approver recorded as `human_user_via_codex_session` because no personal name was provided.
- Approved canonical path: `/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck`.
- Approved SHA-256 revision: `f95ab45388c077de87efc8228e9788bf4fa9cca1a146a7ec02233e5c1b818211`; tests recompute it from the exact Payload title, canonical path, and content.
- Exactly one authority asset carries human approval metadata. Drafts 06 and 07 and all other drafts remain excluded from approval and publication scope.
- Pre-deployment checks passed locally for CTA, internal links, canonical model, CTO publication repair, pillar links to both approved Problem Pages, and revision identity.
- Corrected sitemap selection so non-published `review` assets are excluded, matching their absence from `llms.txt`; the human-approved Draft 05 remains non-public until a separately authorized publication transition.
- Focused deployment-readiness suite: passed, 5 files / 23 tests.
- `npm test`: passed, 37 files / 157 tests.
- `npm run typecheck`: passed.
- `git diff --check`: passed with LF-to-CRLF warnings only.
- Deployment, publication, commit, push, and ProductionDirective execution were not performed.
