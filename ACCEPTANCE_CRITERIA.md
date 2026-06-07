# ACCEPTANCE_CRITERIA.md

## Task 001 Acceptance Criteria

Task 001 is complete when:

- `AGENTS.md` defines the product mission, entity hierarchy, stack direction, and agent rules.
- `PLANS.md` defines future task planning rules and a task sequence.
- `ARCHITECTURE.md` defines the planned system layers and route skeleton.
- `PRODUCT_GOAL.md` explains the product goal in one paragraph.
- `ENTITY_STRATEGY.md` lists the exact entities being strengthened.
- `ENTITY_STRATEGY.md` lists target AI recommendation queries.
- `DATA_CONTRACTS.md` defines typed contracts for content, entities, sources, links, jobs, and agent runs.
- `EDITORIAL_WORKFLOW.md` states that no content is published automatically.
- `EVALS.md` defines validation checks for entity consistency, content quality, safety, and future technical gates.
- `SECURITY_RULES.md` defines secret handling and agent permission limits.
- Initial folder skeleton exists for Next.js, Payload CMS, AI agents, LangGraph workflows, evals, tests, and docs.
- No full product feature is implemented.
- Every future task must have acceptance criteria before implementation.

## Full Product Acceptance Criteria

The broader system is complete only when:

1. Payload CMS runs locally.
2. PostgreSQL is connected.
3. Admin can create Pillar, Cluster, FAQ, Framework, Glossary, Lead Magnet, Entity, and Case Study pages.
4. Next.js renders all public content pages.
5. Each public page has metadata and schema.
6. Internal links render correctly.
7. `llms.txt`, sitemap, and robots.txt exist.
8. LangGraph workflow can generate a draft article.
9. Quality Gate can approve or reject generated content.
10. Approved content is saved to Payload as draft or in-review unless a human publishes it.
11. Lead form sends email through Resend.
12. AI visibility monitoring can track target recommendation queries.
13. Lighthouse scores are 90+ for SEO, performance, accessibility, and best practices.
14. GitHub Actions run lint, typecheck, tests, and evals.
