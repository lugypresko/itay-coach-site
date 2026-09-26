# Isolated Diagnostic Production-Ready Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Keep the core site pages stable while shipping an English, isolated `/player-trap` diagnostic that is production-ready in Preview.

**Architecture:** The existing Home, About, FAQ, Methodology and The Push routes remain unchanged. `/player-trap` becomes a bounded conversational funnel backed by Payload/Postgres sessions and the existing Lead collection. The browser owns presentation only; the server validates/persists diagnostic data and computes the final route.

**Tech Stack:** Next.js App Router, React, Payload CMS, PostgreSQL, Vitest, Playwright, Vercel Preview.

---

### Task 1: Lock contracts and route rules

**Files:** `docs/contracts/diagnostic-conversion-core.md`, `docs/contracts/lead-submission.md`, `tests/unit/diagnostic-route-contract.test.ts`

- Define the English flow, states, four routes, reason codes, consent fields and idempotency behavior.
- Add failing tests for route precedence and forbidden legacy fields.

### Task 2: Extend Payload session and Lead storage

**Files:** `src/payload/collections/DiagnosticSessions.ts`, `src/payload/collections/content.ts`, `src/migrations/*diagnostic*`, `src/migrations/*lead*`

- Store checkpoint, raw evidence, insight/diagnosis, intent, route and reasons without PII before contact.
- Extend `email-subscribers` with diagnostic relationship/snapshot, separate consent, submission and delivery fields.
- Restrict public read/update access.

### Task 3: Implement server diagnostic API

**Files:** `src/app/api/player-trap/diagnostic/route.ts`, `src/lib/diagnostic-session-store.ts`, `src/lib/diagnostic-core.ts`

- Validate expected checkpoint server-side.
- Persist raw answers exactly as submitted.
- Return a safe view model for refresh and rendering.
- Compute diagnosis and route from persisted evidence.

### Task 4: Migrate Lead and request-to-talk flow

**Files:** `src/app/api/player-trap/lead/route.ts`, `src/lib/player-trap.ts`, `tests/unit/player-trap-lead.test.ts`

- Remove new-flow dependency on the five-question schema and score.
- Enforce two consent purposes.
- Create/update one Lead per session and make request-to-talk idempotent.
- Persist and retry notification delivery independently.

### Task 5: Port the English prototype UX into isolated `/player-trap`

**Files:** `src/app/(site)/player-trap/player-trap-assessment-client.tsx`, `src/styles/*player-trap*`, `tests/component/player-trap-flow.test.tsx`

- Port one-turn incident, reflection/correction, confirmation, impact, why-now, insight, contact, diagnosis and intent screens.
- Render server view models; do not reconstruct routing locally.
- Keep existing site shell and avoid Home changes.

### Task 6: Acceptance and Preview verification

**Files:** `tests/e2e/player-trap.spec.ts`, `docs/qa/diagnostic-preview-acceptance.md`

- Exercise all four routes, submit/skip contact, refresh recovery, invalid transitions, retries and API failure recovery on desktop/mobile.
- Run full tests, typecheck, ESLint and diff checks.
- Deploy Preview only, run migration there, record URL and SHA; do not merge or deploy Production.
