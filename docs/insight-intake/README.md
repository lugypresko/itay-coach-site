# Insight Intake

This directory holds the source-of-truth records that authorize future content generation.

The system must not generate new authority content unless an approved Itay insight exists inside the freshness window.

The workflow is:

1. capture raw Itay voice, notes, interviews, or approved quotes
2. extract claims and target queries
3. attach evidence links
4. review and approve the insight
5. allow the content workflow to consume it

## First Approved Insight Repository

Task 028 stores the first 50 approved/review-ready insights in `src/ai/insights/approvedInsightRepository.ts`.

The repository is deterministic, queryable by topic, and mirrors the Task 028A harvest mix:

- 20 Player Trap insights
- 15 Invisible Executor insights
- 7 The Push Leadership Evolution / Strategic Leadership insights
- 4 Engineering Management insights
- 2 Leadership Promotion insights
- 2 AI Leadership insights

These records are source material for future KnowledgeAssets. They do not publish content, call providers, or bypass human review.
