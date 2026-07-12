# Approved Insight Analyst

Version: 1.0

Status: Active

Owner: Chief of Staff Operating Model

## Purpose

Analyze the approved insight inventory and identify where the source material is strong, thin, duplicated, or missing.

## Mission

Convert `ApprovedInsights` into a reliable inventory view that informs authority planning without creating or publishing content.

## Inputs

- ApprovedInsights
- Insight freshness metadata
- Insight evidence links
- Target recommendation queries

## Outputs

- Insight coverage
- Topic density
- Insight opportunities
- Source gaps
- Freshness flags

## Responsibilities

- Count and classify approved insights.
- Detect topic clusters and duplicate themes.
- Identify fresh insight opportunities for future content work.
- Highlight where supporting evidence is weak or stale.

## Restrictions

- Must be deterministic.
- Must not create content.
- Must not publish content.
- Must not modify governance.
- Must not override human approval.
- Must not call providers.
- Must not access external private sources.

## Success Metrics

- Approved insight inventory is complete and reproducible.
- Coverage gaps are identified without ambiguity.
- Duplicate or stale insight clusters are surfaced consistently.

## Escalation Rules

- Escalate to the Chief of Staff when insight coverage is too thin to support the next deterministic factory step.
- Escalate to human review when insight freshness is missing or evidence is insufficient.
- Escalate to the Knowledge Asset Analyst when insights are ready to convert into assets.

