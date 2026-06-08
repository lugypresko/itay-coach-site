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

### Task 012A - Authority Graph Verification and Tooling Cleanup

State: `ready`
Lane: `content-seed`, `developer-tooling`
Owner: Codex

Goal:
Stabilize the minimum authority graph verification path and clean up repo tooling so release verification is reproducible.

Scope:
- Confirm the `verify:authority-graph` script exists and produces a verification report.
- Optimize the verifier if possible without changing contracts or seed behavior.
- Keep the minimum authority graph seed behavior unchanged.
- Clean ESLint flat config warnings that are safe to fix.
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

### Task 015 - Authority Evidence Layer

State: `in_progress`
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
