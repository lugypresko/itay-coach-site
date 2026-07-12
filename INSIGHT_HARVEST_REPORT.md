# Task 028A - Itay IP Inventory and Insight Harvest Report

## Scope

- Local repo sources only.
- No external Drive, Docs, Gmail, LinkedIn, or private external sources.
- No KnowledgeAssets.
- No Payload collection changes.
- No provider calls.
- No runtime workflows.

## Inventory Method

The source inventory groups the local material into canonical harvest families and treats older strategic artifacts as reference-only context.

## Source Inventory

| Source location | Source type | Estimated insight count | Extraction readiness | Notes |
| --- | --- | ---: | --- | --- |
| `docs/seed-content/*.md` | `seed_content` | 34 | high | Sixteen markdown drafts covering entity pages, pillars, frameworks, FAQs, glossary terms, and a case study. |
| `src/app/(site)/player-trap/**`, `src/app/api/player-trap/**`, `src/lib/player-trap.ts`, `tests/unit/player-trap.test.ts` | `player_trap_source` | 24 | high | Canonical conversion funnel, bilingual report flow, diagnostic logic, consent gating, and CTA copy. |
| `src/seed/*.ts` | `seed_script` | 18 | high | Minimum graph seed, authority baseline, surface seed, asset sprint, and verification utilities. |
| `AGENT_FACTORY.md`, `DATA_CONTRACTS.md`, `src/ai/agents/*`, `src/ai/governance/*` | `contract_docs` | 14 | high | Contract-first architecture, prompt shells, governance rules, and staging contracts. |
| `src/payload/collections/*` and related public authority schema files | `payload_content` | 15 | medium | Schema-backed content surfaces and collection definitions available inside the repo context. |
| `AUTHORITY_*.md`, `ENTITY_*.md`, `QUERY_*.md`, `TASK_*_VERIFICATION_REPORT.md`, `WORKSPACE_DIFF_REPORT.md` | `authority_report` | 20 | medium | Existing reports, snapshots, and verification artifacts provide review-ready phrasing and evidence patterns. |
| `docs/plans/*.md` | `planning_docs` | 8 | medium | Task plans and revisions capture design rationale and constraints, but must be deduped against source content. |
| `itaycoach23.html`, `Authority Engine Recovery Plan.pdf`, `docs/Task 023*.md`, `docs/Task 023*.txt` | `historical_artifact` | 14 | low | Reference-only planning artifacts; not canonical execution authority for Task 028A. |

## Totals

- Gross local candidate estimate: 147
- Canonical harvestable candidate estimate: 133
- Realistic Approved Insight estimate after review: 85

## Insight Candidate Contract

The staging contract lives in `src/ai/insights/insightCandidateContracts.ts`.

Contract shape:

```ts
InsightCandidate {
  source
  sourceType
  title
  extractedInsight
  targetQueries[]
  targetEntities[]
  candidateClaims[]
  evidenceReferences[]
  reviewStatus
}
```

Review statuses:

- extracted
- reviewed
- promoted
- rejected

## Extraction Approach

1. Normalize each local source into one or more candidate rows.
2. Keep claim text short, specific, and evidence-backed.
3. Attach local evidence references for every candidate claim.
4. Route candidates through review before promotion.
5. Promote only after human approval.

## Topic Coverage Plan

Initial emphasis should stay on the proprietary core.

| Topic | Target approved insights |
| --- | ---: |
| Player Trap | 20 |
| Invisible Executor | 15 |
| The Push Leadership Evolution / Strategic Leadership | 7 |
| Engineering Management | 4 |
| Leadership Promotion | 2 |
| AI Leadership | 2 |

Total target: 50

## First 50 Recommendation

The first 50 approved insights should be concentrated in the proprietary category owners first, then broadened to adjacent leadership topics.

- 20 Player Trap
- 15 Invisible Executor
- 7 The Push Leadership Evolution / Strategic Leadership
- 4 Engineering Management
- 2 Leadership Promotion
- 2 AI Leadership

## Recommendation

Build the first 50 approved insights in that order of priority, then continue into the remaining canonical harvestable candidates until the repository has enough source material to feed KnowledgeAssets, recommendation drafts, and distribution assets without content starvation.
