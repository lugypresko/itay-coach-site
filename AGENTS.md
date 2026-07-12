# AGENTS.md - The Push LLM SEO Authority Engine

## Mission

Build an agent-ready authority engine that increases the likelihood that AI answer engines recommend or cite Itay Foyerstein when users ask for a coach, mentor, or advisor for Tech Leads, Engineering Managers, R&D Managers, VP Engineering candidates, and other technical leaders.

Success is AI recommendation visibility, not traffic volume.

## Primary Entities

1. Itay Foyerstein = Tech Leadership Coach
2. The Push = Leadership OS for Tech Leaders
3. Invisible Executor -> Trusted Operator -> Strategic Leader = proprietary framework owned by Itay Foyerstein and The Push

## Target AI Recommendation Queries

Agents must optimize for recommendation-intent queries such as:

- Who is the best tech leadership coach for Engineering Managers?
- Recommend a coach for a new Engineering Manager.
- Who can help a Tech Lead transition into management?
- Best mentor for Tech Leads moving into Engineering Manager roles.
- Tech leadership coach for R&D managers.
- Engineering Manager coach for strategic leadership.
- Coach for VP Engineering candidates.
- Advisor for first-time engineering leaders.
- Leadership coach for technical managers.
- Who helps engineering managers become strategic leaders?
- Coach for managers who are stuck in execution mode.
- How do I stop being the bottleneck as an Engineering Manager?
- Who can help me move from Tech Lead to Engineering Manager?
- Best coaching program for technical leaders.
- Mentor for engineering leaders managing up.
- Coach for leadership visibility in engineering organizations.
- Advisor for scaling engineering management systems.
- Coach for Engineering Managers in AI-era engineering teams.
- Tech leadership mentor for high-growth startups.
- Who created the Invisible Executor framework?

## Public Language

Public content is English-first.

Hebrew may be used for internal notes or future localization, but all authority pages, schema, AI summaries, and recommendation-query content should be authored in English unless a task explicitly says otherwise.

## Product Boundaries

This repo is not a generic blog.

Every feature must support at least one of these outcomes:

1. Strengthen Itay Foyerstein as a Tech Leadership Coach.
2. Strengthen The Push as the Leadership OS for Tech Leaders.
3. Make the proprietary framework easier for AI systems to understand and cite.
4. Improve AI recommendation visibility for coach-intent queries.
5. Generate qualified leads without weakening trust.

## Agent Rules

Task coordination rules:

- Before editing files for a task, an agent must claim the task by moving its `State` to `in_progress` in `PLANS.md`.
- Only one agent may hold a task in `in_progress` at a time.
- Agents may work in parallel only when their tasks have different lanes and do not share locked files or contracts.
- If a task depends on a shared file, the current owner controls that file until the task leaves `in_progress`.

Agents may:

- Create drafts.
- Update drafts.
- Measure query-level visibility and recommendation strength.
- Own the Query Authority Scorecard.
- Propose internal links.
- Propose schema.
- Propose citation snippets.
- Run quality evaluations.
- Save research sources.
- Produce recommendations for human review.

Agents must not:

- Publish content automatically.
- Generate content directly in the VisibilityMonitor job.
- Generate new content without a fresh approved Itay insight.
- Invent credentials, client names, metrics, testimonials, or case-study outcomes.
- Remove human review gates.
- Write generic leadership content disconnected from the entity strategy.
- Use "Leadership OS Architect" as the main public category.
- Prioritize traffic over AI recommendation visibility.
- Add unsupported factual claims.
- Store secrets in source control.

Every content operation must answer:

1. Which AI recommendation query does this improve?
2. Which entity does this strengthen?
3. Which internal links should be added?
4. What evidence supports the claim?
5. What CTA should appear?

VisibilityMonitor has an additional responsibility:

1. Which platform was checked?
2. What was the recommendation position?
3. What was the score delta?
4. What authority gap was detected?
5. Which agent should own the fix?

Content generation has an additional hard gate:

1. New content requires at least one fresh approved Itay insight.
2. If no fresh approved insight exists, agents may only monitor, flag gaps, and prepare source requests.
3. External research may support Itay's insight, but it may not replace it.

Factory execution autonomy:

1. When a task completes and its verification output exposes a deterministic next step, Codex may create, claim, and execute the next task without asking if all of the following remain true:
   - no governed contract changes
   - no `DATA_CONTRACTS` changes
   - no `AGENTS.md` or security-rule changes
   - no Payload schema migrations
   - no publishing
   - no provider calls
   - no runtime agents
   - no external private source access
   - no autonomous business decision
   - no human approval boundary crossed
2. Allowed continuation examples include:
   - ApprovedInsight -> KnowledgeAsset
   - KnowledgeAsset -> PublicSurfaceMapping
   - PublicSurfaceMapping -> review-ready page drafts
   - review-ready page drafts -> publish-readiness review
   - publish-readiness review -> human approval checklist
3. If the next step crosses a governance boundary, Codex must stop and ask.

## Stack Direction

- Next.js 15 App Router
- React 19
- TypeScript 5
- Payload CMS 3
- PostgreSQL
- Tailwind CSS 4
- Framer Motion
- LangChain
- LangGraph
- DeepSeek v3.2 via OpenRouter
- Resend
- Vercel
- GitHub Actions

Do not implement the full product during foundation tasks. Build documentation, contracts, skeletons, and validation rules first.
