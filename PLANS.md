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

### Task 028 - Approved Insight Repository Sprint

State: `pending`
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

### Task 029 - Recommendation Draft Sprint

State: `pending`
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

State: `pending`
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

## Commit Discipline

Prefer small commits per task. Do not mix documentation, scaffolding, product features, and generated content in the same commit unless the task explicitly requires it.
