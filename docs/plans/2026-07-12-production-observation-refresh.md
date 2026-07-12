# Production Observation Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Record current production evidence and produce one constrained Chief of Staff next-best-action decision.

**Architecture:** Collect read-only observations from the canonical domain and repository state, normalize the evidence into a report, then apply the documented Chief of Staff decision loop. Keep external AI visibility explicitly unmeasured because provider calls are outside scope.

**Tech Stack:** PowerShell, HTTP, Next.js production routes, Markdown reports, existing Authority Engine contracts.

---

### Task 1: Collect production evidence

**Files:**
- Create: `TASK_058_PRODUCTION_OBSERVATION.md`

1. Inspect the current Vercel production deployment.
2. Request the canonical homepage, sitemap, robots, llms, and authority routes.
3. Record status codes, canonical/schema/CTA/link/analytics evidence.
4. Reconcile published and draft inventory from repository state.

### Task 2: Produce the Chief of Staff decision

**Files:**
- Create: `TASK_058_CHIEF_OF_STAFF_DECISION.md`

1. Read the observation and existing decision-loop contract.
2. Identify the single current bottleneck.
3. Select one valid safe action category and human owner.
4. Record evidence requirements, approval boundary, and stop point.

### Task 3: Verify and close

**Files:**
- Modify: `PLANS.md`

1. Verify every report claim against collected evidence.
2. Run focused repository tests if implementation files changed.
3. Mark Task 058 completed with verification notes.
