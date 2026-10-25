# Diagnostic V3 Preview acceptance — 2026-10-23

Overall status: BLOCKED. No Production migration is prepared or authorized for execution.

## Scope and observed state
- Repository: lugypresko/itay-coach-site only; branch feature/diagnostic-v3.
- Application source tested: 3aa75cacd684991abafbd8043921435063513d51.
- Neon: winter-resonance-15589128, Preview br-cold-credit-b9x1qomi, neondb.
- User-approved additive trace DDL committed in the previous execution: 28 statements; source SQL SHA-256 aee4169dad9dad9c2ef84dd8547d56bba89c624206f8f3f43ad11904536d0229.
- All six tables observed. Existing sessions payload/record_version preserved. No migration rerun, no Production connection/data changes, no main merge.

## Database health — 10/10 PASS
Six tables; six RLS-enabled tables; no PUBLIC grants; foreign keys validated; selected-analysis unique index; pending-analysis unique index; event idempotency unique constraint; provider receipt unique index; existing payload fingerprint preserved; no dangling active revision.

## Constraint tests — 9/9 PASS
Repeatable SQL: scripts/diagnostic-v3-preview-constraints.sql.
1. Stale record_version UPDATE affects zero rows.
2. Duplicate answer revision rejected.
3. Duplicate in-flight analysis for the same revision/version/pass rejected.
4. Full Read cannot reference another session's First Read.
5. Unknown Fit cannot use Conversation route.
6. Booking completion without verified confirmation rejected.
7. Duplicate provider receipt rejected.
8. Active revision must exist.
9. Duplicate event idempotency key rejected.
All synthetic rows were rolled back inside the test block. Existing fixture remains; revisions/analyses/leads/qualifications/events remain empty. These are database assertions, not browser or live-provider E2E tests.

## Required three synthetic E2E scenarios — BLOCKED
- Conversation: repeated customer-impact decision dependency, VP / 51–100; expected scoring-v1 total 40, rule 3_threshold.
- Nurture: same answers, Other / 51–100; expected total 34, rule 6_other.
- Self-service: manager handles the issue, occasional recurrence, leader-time impact; expected rule 2_low_pain.
All three share a failing prerequisite: deployed /api/diagnostic/v3 returns HTTP 503 before the first question. No completed E2E session or real Groq acceptance is claimed.

## Application integration gaps
- DIAGNOSTIC_V3_DATABASE_URL remains unavailable to the tested application deployment. The previous explicit env-list and Preview-only Secret-create operations returned Vercel HTTP 403. No unchanged permission-denied operation was retried.
- Current store.ts still writes the compatibility sessions.payload only. The normalized revision/analysis/lead/qualification/event writer, real prompt/attempt metadata, active-version promotion transaction and reader cutover have not been implemented. Empty trace tables do not establish E2E verification.
- Isolated Payload schema/admin bootstrap and Preview PAYLOAD_SECRET remain required for authenticated internal verification.
- Existing 65 unit tests are prior evidence only; not rerun or represented as this expanded schema's E2E acceptance.

## Redeploy check
A fresh Preview redeploy was requested for the same exact application commit: dpl_BoVu3NH6rZ7UaSUCpPW391y4ke2D.
URL: https://itay-coach-site-moumccf1s-fitay-yahoocoms-projects.vercel.app/diagnostic
Deployment READY at exact source commit 3aa75cacd684991abafbd8043921435063513d51, target Preview. Post-redeploy API still HTTP 503. Existing session record_version=5 and exact payload MD5 remained unchanged; current_answer_revision remains NULL (not falsely marked normalized). Database retention PASS; application recovery BLOCKED.
An unchanged database fingerprint after redeploy only proves database retention; application session recovery requires successful API/browser retrieval and is not accepted while HTTP 503 persists.

## Production gate
Only after persistent application configuration, normalized writer integration, authenticated health check, three actual synthetic E2E sessions and app-session recovery across redeploy pass may the approved Production migration package be prepared. No Production mutation or merge is permitted by this task.


## 2026-10-24 normalized writer verification

Application DB connectivity was confirmed before this implementation. New sessions now use the normalized writer/reader. `payload` is limited to UI state and return-link/delivery metadata. No schema migration was applied in this implementation.

Local evidence: eight PostgreSQL/PGlite integration cases use a schema snapshot introspected from Neon Preview. Four complete service flows reach conversation, nurture, self_service and unqualified_nurture; all verify revisions, two analyses, identity, qualification, brief, events, restored reads, and cascading cleanup. Additional cases verify a failed Groq attempt plus separate fallback, validated mocked Groq metadata, payload contamination isolation, stale analysis preservation without selection, answer edits, and Role/Org changes without provider calls. These tests are **not deployed browser E2E** and mocked Groq is **not evidence of live Groq personalization**.

Remaining acceptance: authenticated stable branch Preview browser journeys (four), live Groq outputs, and one complete Neon trace. Existing legacy analyzed/identified sessions need explicit offline snapshot migration before Production; they are preserved rather than silently fabricated. Production migration/release and main merge remain prohibited.
