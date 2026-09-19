# The Push Site Next - Atomic Execution Plan

## ××™×š ×¢×•×‘×“×™× ×¢× ×”×ž×¡×ž×š

×”×ª×•×›× ×™×ª ×ž×¤×•×¨×§×ª ×œÖ¾63 ×ž×©×™×ž×•×ª. ×›×œ ×©×•×¨×” ×ž×’×“×™×¨×” ×ª×•×¦×¨ ××—×“, ×ª×œ×•×ª ×•×ª× ××™ ×¡×’×™×¨×” ×©× ×™×ª×Ÿ ×œ×‘×“×•×§. ×¤×™×¨×•×˜ ×”×ž×©×™×ž×•×ª ×‘×× ×’×œ×™×ª ×›×“×™ ×œ×©×ž×© ×™×©×™×¨×•×ª ××ª ×”×ž×¤×ª×— ×•××ª ×”×‘×“×™×§×•×ª; ×–×”×• ×ž×§×•×¨ ×”×ž×©×™×ž×•×ª ×”×™×—×™×“, ×‘×ž×§×•× ×”×˜×‘×œ×” ×”×§×•×“×ž×ª.

**DoD ×œ×ž×©×™×ž×”:** ×”×ª×•×¦×¨ ×§×™×™×, ×›×œ ×”×ª× ××™× ×‘×©×•×¨×” ×¢×‘×¨×•, ×•× ×©×ž×¨ ×“×•×— ×©×ž×¦×™×’ expected ×ž×•×œ actual ×¢× ×§×™×©×•×¨ ×œ×¨××™×”. ×‘×œ×™ ×¨××™×” â€” ×”×ž×©×™×ž×” ××™× ×” PASS. ××™×Ÿ ×›××Ÿ ×˜×¢× ×” ×©×‘×“×™×§×•×ª ×”×•×¨×¦×• ×ž×—×“×©.

**×“×•×’×ž×” â€” C08:** ×ž×¤×™×œ×™× ××ª ×”×ª×’×•×‘×” ××—×¨×™ ×©×ž×™×¨×ª ×‘×§×©×”, ×©×•×œ×—×™× ××•×ª×” ×©×•×‘, ×•×ž×•×›×™×—×™× ×©×‘×ž×¡×“ ×™×© ×œ×™×“ ××—×“ ×•×‘×§×©×” ××—×ª. ×´×”×•×¡×¤× ×• idempotency×´ ××™× ×• ×ª× ××™ ×¡×’×™×¨×”.

**×“×•×’×ž×” â€” D05:** ×ž×‘×§×¨ ×ž×“×œ×’ ×¢×œ ×¤×¨×˜×™ ×§×©×¨, ×ž×§×‘×œ ××‘×—× ×” ×©×™×ž×•×©×™×ª, ×•×‘×ž×¡×“ ×œ× × ×•×¦×¨ ×œ×™×“. ×¦×™×œ×•× ×ž×¡×š ×©×œ ×›×¤×ª×•×¨ Skip ××™× ×• ×ž×¡×¤×™×§.

**×¡×™×•× ×”××™×¨×•×¢:** ×ž×¢×‘×¨ ×©×¢×¨ ×ž×§×•×ž×™, ×©×¢×¨ Preview ×•×©×¢×¨ Production ×ž××•×©×¨; ××¤×¡ ×›×©×œ×™× ×§×¨×™×˜×™×™× ×¤×ª×•×—×™× ×‘×ž×¡×œ×•×œ ×”×”×ž×¨×”, ×‘×˜×™×—×•×ª ×”× ×ª×•× ×™× ×•× ×’×™×©×•×ª ×”×œ×™×‘×”. ×”×¡×˜×˜×•×¡ ×›×¨×’×¢: Gate A ×¢×“×™×™×Ÿ ×œ× ×”×•×©×œ×. ×›×ª×™×‘×ª ×”×ž×¡×ž×š ××™× ×” ××™×©×•×¨ ×œ×¤×¨×¡×•×.

Date: 2026-09-16. Companion to [system status](2026-09-16-site-next-system-status-and-handoff.md). This replaces the old R/C/Q/V/P task table; maintain one task tracker.

**Goal:** Complete the incident-to-diagnosis-to-qualified-conversation journey with a proven rollback path.

**Architecture:** Extend the existing Next.js/React/Payload/Postgres application in `site-next`. The server persists evidence and computes routing; React presents the conversation. Do not rebuild the Authority Engine or reintroduce full MEDDPICC.

## Rules for closing a task

Each row has one deliverable, explicit dependencies and falsifiable acceptance criteria. All criteria in a row must pass. Code written, screenshots generated and deployment READY are not proof of working behavior.

Default status of all tasks: TODO. Other statuses: IN_PROGRESS, BLOCKED (named blocker), FAIL (actual result), PASS (linked evidence). Previous evidence can be linked with its original date, but must not be described as a fresh run. Baseline: 420/421 tests passed; lint reported 18 errors and 61 warnings. This document is not a new test run.

For every ID create `site-next/output/site-next/tasks/<ID>/result.md`: date, environment, HEAD plus diff hash for uncommitted work, command/action, expected result, actual result, exit code and evidence links. Use synthetic data only; exclude secrets, tokens and PII from logs and screenshots.

For each behavioral fix execute three separate steps: write the focused failing test; implement the smallest correction; rerun that test and record PASS. Test names below are required tests to create, not claims that they already exist. Do not replace behavior tests with source-string assertions or compatibility markers.

Owners: developer for implementation and automated tests; QA for browser/visual evidence; Itay for business decisions, claims and release approval. Record who approved each result. One person may perform multiple roles.

## A - Rollback and scope

| ID | Single deliverable | Depends on | DoD / required evidence |
|---|---|---|---|
| A01 | Verified baseline archive | None | Manifest and extracted archive contain 575 files; all SHA256 hashes match. Link existing baseline verification and restore-drill evidence with original date; mismatch count = 0. |
| A02 | Verified WIP archive | None | Archive contains 588 files; integrity and all manifest hashes pass. Link `rollback-checkpoints/2026-09-16-site-next-wip/verification.txt`. |
| A03 | Live Production identity | Read-only Vercel access | `production-baseline.md` records project, deployment ID, domain, commit SHA and timestamp obtained from deployment metadata. Unknown live SHA = BLOCKED, never inferred from local HEAD. |
| A04 | Complete change inventory | A01,A02 | `change-inventory.md` classifies every changed/untracked file as inherited/new/line-ending-only, with reason. Unclassified file count = 0. |
| A05 | Repeatable local restore procedure | A01,A02 | `rollback-local.md` gives checkpoint, verify and restore-to-new-directory commands. A synthetic modified file returns to its previous hash; `repo-work` remains untouched. |

## B - Minimal product contract

Files: `site-next/docs/contracts/site-next-diagnostic.md`, `site-next/tests/unit/push-conversation.test.ts`. B2B, participant confidentiality, EN-first and optional contact remain settled.

| ID | Single deliverable | Depends on | DoD / required evidence |
|---|---|---|---|
| B01 | Routing truth table | None | Each of four routes has sample answers, required evidence, reason codes and UI outcome. Resolve self-service versus insufficient evidence explicitly; self-service alone is not proof of missing evidence. Any new business decision blocks this item only. |
| B02 | Checkpoint contract | B01 | Each checkpoint lists persisted answers, allowed payload, next checkpoint and exact refresh result. Presentation-only clicks do not require server transitions. |
| B03 | Contact/request contract | B01 | Contact follows insight; skip retains diagnosis. Talk intent after skip requests minimum contact. Processing and marketing are separate; request requires explicit intent, eligible route and valid contact. |
| B04 | Four routing fixtures | B01,B02,B03 | `tests/fixtures/site-next-routes.ts` contains four complete answer sets and exact expected route/reasons. Tests assert exact values, not merely a nonempty route. |

## C - Persistence and duplicate prevention

Implementation files relative to `site-next`: `src/lib/push-store.ts`, `src/lib/push-conversation.ts`, `src/app/api/player-trap/conversation/route.ts`, `src/app/api/conversation-request/route.ts`, existing collections and migrations. Extend the existing Lead model.

| ID | Single deliverable | Depends on | DoD / required evidence |
|---|---|---|---|
| C01 | Isolated test Postgres connection | None | **BLOCKED (2026-09-17 verification):** Supabase MCP connects to `https://gvsgthtayhozembisgzn.supabase.co` and read-only identity is `database=postgres`, `current_user=postgres`, PostgreSQL 17.6, but no Production identity is available to prove this is isolated. Record identity without credentials. Do not infer isolation from the project ref. |
| C02 | Applied test migrations | C01 | **PASS (2026-09-17):** authorized direct Production migration through Supabase MCP. Applied `20260913_120000_diagnostic_sessions` and `20260914_090000_conversion_core_lead_fields`; migration history now contains both, `diagnostic_sessions` exists with 18 columns, and all 14 Conversion Core columns are present on `email_subscribers`. No seed or data submission was performed. |
| C03 | Proven session persistence | C02 | `persists_and_restores_checkpoint` writes an answer and reads it through a new store instance; raw answer and checkpoint match exactly. File-store/mock results do not qualify. |
| C04 | Enforced anonymous expiry | C03 | `rejects_expired_anonymous_session`: accessible at 23h59m, inaccessible at 24h using a controlled clock. Expired response exposes no prior conversation; restart behavior matches contract. |
| C05 | Atomic contact write | B03,C03 | `contact_write_is_atomic` injects failure between lead and session writes; no partial committed state remains. Retry yields one Lead and linked session. Success is returned only after commit. |
| C06 | Database-enforced request uniqueness | C05 | `concurrent_requests_create_one_request` runs simultaneous submissions from two processes; request count = 1. A process-local mutex alone cannot satisfy this test. |
| C07 | Payload-bound operation IDs | C05 | `same_operation_changed_payload_is_rejected`: same ID/payload returns same outcome; same ID/different payload is rejected without mutation. No sensitive digest input goes to analytics. |
| C08 | Safe lost-response retry | C06,C07 | `lost_response_retry_does_not_duplicate` drops response after successful write; retry returns existing result. Lead count = 1, request count = 1, no duplicate success event. |
| C09 | Legacy endpoint inventory | None | `legacy-api-inventory.md` lists every old endpoint, current callers and retain/retire decision. Previously public endpoints are considered even with no code callers. |
| C10 | Closed legacy state-write bypass | C09 | `legacy_post_cannot_mutate_new_session` submits forged state/route/contact; request is rejected and new session unchanged. Historical report reading remains supported. |
| C11 | Historical report regression proof | C10 | Valid token returns report; malformed/expired-over-30-days tokens return 404. Responses set `Cache-Control: private, no-store` and `Referrer-Policy: no-referrer`; application logs contain no full token. |

## D - Conversation behavior

Files: `src/components/push-conversation.tsx`, `src/lib/push-conversation.ts`. Use the real component and API; do not replace the experience with a static questionnaire.

| ID | Single deliverable | Depends on | DoD / required evidence |
|---|---|---|---|
| D01 | Incident-specific reflection | B02 | Three different incident fixtures produce different reflections grounded in supplied details, without invented actors/causes. Missing evidence triggers clarification. Verbatim echo alone does not pass dynamic reflection. Document external-provider data handling before integration if one is needed. |
| D02 | Correction recovery proof | D01 | `correction_updates_reflection_preserves_raw_history`: browser correction updates reflection; original and correction remain verbatim; refresh restores latest correction. |
| D03 | Explicit pain confirmation proof | B02 | `reflection_confirmation_is_not_pain_confirmation`: confirming reflection does not set pain confirmed. No/unclear answers follow B01 rules. |
| D04 | Evidence-tailored micro-insight | B04,D03 | Different pattern/fork fixtures produce different explanation/experiment. Each diagnosis assertion has supporting input or is labeled hypothesis. Insight appears before contact request. |
| D05 | Contact-free diagnosis proof | D04 | `skip_contact_keeps_diagnosis`: skip reaches useful diagnosis, no Lead is created, no name/email is required and content is not gated by a call CTA. |
| D06 | Separate consent proof | C05,D04 | `processing_required_marketing_optional`: processing=false rejected; processing=true/marketing=false accepted. Persist distinct values and appropriate timestamps. |
| D07 | Late contact proof | D05,C06 | `talk_now_after_skip_collects_minimum_contact`: diagnosis remains available; explicit confirmation creates one request. Forged request from an ineligible route is rejected server-side. |
| D08 | Four real UI outcomes | B04,D05,D06,D07 | `scripts/verify-site-next.mjs` completes all four fixtures via real answers; assert exact route, reasons and final action. No route injection or direct jump to final screen. |
| D09 | Every-checkpoint recovery proof | D08 | Browser test refreshes at every B02 checkpoint and compares answers, reflection, diagnosis, contact status, intent and route. Submission counts do not increase. |
| D10 | Recoverable API errors | D08 | Timeout and 503 show error/retry; draft answer survives, focus reaches message, no false success. Retry resumes from persisted checkpoint. |

## E - Lead handling, privacy and analytics

| ID | Single deliverable | Depends on | DoD / required evidence |
|---|---|---|---|
| E01 | Request delivery contract | B03 | `request-delivery-contract.md` names where Itay receives requests, failure owner and meaning of received versus notified. No invented SLA or email promise. |
| E02 | Retryable delivery implementation | E01,C06 | Provider-failure test preserves request with pending/failed status; retry delivers without duplicate request. Mock-provider evidence is local only; real delivery is H04. |
| E03 | Sponsor-contact proof | E02 | Contact form's one-manager option persists sponsor request without demanding an employee's private case or granting monitoring rights. Request appears in defined handling channel. |
| E04 | Retention policy document | None | `retention-policy.md` separates anonymous 24h, report access 30d and Lead PII. Each has owner, deletion policy and exceptions. Unapproved Lead retention is explicitly unresolved and blocks Production, not other local work. |
| E05 | Expired-data purge | E04 | Isolated-DB purge test removes expired fixture and retains valid fixture; Lead relationships obey documented policy. Schedule/execution mechanism is specified. Access TTL alone does not pass. |
| E06 | Data protection proof | C03,D09 | Synthetic PII canary appears zero times in URLs, analytics and application logs. HTTPS cookie is HttpOnly/Secure/SameSite=Lax; view model exposes no token/session ID; anonymous access cannot enumerate Leads or read another session. Raw answers stay server-side and out of telemetry. |
| E07 | Lifecycle event coverage | D08 | `analytics-contract.md` maps start/pain/insight/contact/intent/route/request. Captured events follow order and payload allowlist. `diagnostic_contact_earned` occurs only after successful consented contact, never display or skip. |
| E08 | Analytics replay protection | E07,C08 | Refresh and lost-response retry do not add a second completion/contact/request event for the same operation; assert exact counts. |

## F - Interface and content

| ID | Single deliverable | Depends on | DoD / required evidence |
|---|---|---|---|
| F01 | Behavioral replacement for legacy test | D08 | Replace source-string assertion at `tests/unit/player-trap.test.ts:167` with rendered/browser CTA-start proof. Temporarily disabling handler makes it fail; restoring handler passes. No compatibility markers. |
| F02 | Six current diagnostic screenshots | D08 | Prestart/incident/micro-insight at 1440x900 and 390x844; record viewport, URL and environment. PNG generation alone is not visual acceptance. |
| F03 | Documented visual acceptance | F02 | `visual-review.md` marks each of six screenshots PASS/FAIL: Home-matching cream/green/lime/type, no clipping/overflow, full prestart CTA inside viewport, one question/primary action. Header visible; Footer at end. Home comparison attached. |
| F04 | Complete keyboard journey | D08 | Reach final route without mouse; visible focus moves to new question/message; inputs labeled; no trap; loading/errors announced. Record result at each checkpoint. |
| F05 | Measured contrast report | F03 | Table of actual computed foreground/background/ratio: normal text >=4.5:1, large text >=3:1, applicable UI/focus >=3:1. Cover active/error/insight states, not just landing. |
| F06 | Offer content ownership | A04 | `content-ownership.md` identifies route or Payload owner for every published field, with no competing active source. UI and metadata/schema describe same offer. |
| F07 | Publication claim ledger | None | Every visible claim has location and status. Three approved claims are owner-attested/approved, not independently verified. No unapproved 120+ managers, trusted-by language or invented outcomes. |
| F08 | Product-aligned copy review | F06,F07 | URL-to-copy checklist for Home/Offer/Method/About/FAQ/Contact: situation-focused H1; 12 weeks/6 sessions; SEE/CHALLENGE/MOVE/READ/ADJUST; no employer monitoring; no instant READ/ADJUST promise. Record each PASS/FAIL. |
| F09 | Metadata/schema verification | F08 | Six pages plus diagnostic: one H1, no duplicated title suffix, correct canonical, accessible OG title/description/url/image, schema matching visible claims. Record actual values. |
| F10 | Sitemap/indexability verification | F09 | Every sitemap URL returns 200 with intended canonical and no noindex; redirect/404/noindex count = 0. Robots/llms agree with policy. Do not remove Preview indexing protection to pass. |

## G - Local quality gate

Run from `site-next`. Capture `$LASTEXITCODE` immediately after each command, before reading logs or running another command.

| ID | Single deliverable | Depends on | DoD / required evidence |
|---|---|---|---|
| G01 | Clean lint result | Implementation above | **IN_PROGRESS (2026-09-17):** full `npx eslint .` exits 0 with 0 errors and 61 existing warnings. The two script errors were fixed; warning baseline/disposition remains open. No blanket disabling was added. |
| G02 | Full test-suite result | G01 | **PASS (2026-09-17):** `npx vitest run` exit 0; 83 files and 435 tests passed, with no skipped tests reported. |
| G03 | Typecheck result | G02 | **PASS (2026-09-17):** `npm run typecheck` / `tsc --noEmit` exit 0, errors 0. |
| G04 | Local production-build result | G03 | **PASS (2026-09-17):** added a build-phase static projection boundary so `NEXT_PHASE=phase-production-build` does not open Payload/DB. `npm run build` exits 0, generates 48 routes without the previous Postgres connection attempt, and built `next start` returns HTTP 200 for `/`, `/player-trap`, `/sitemap.xml` and `/llms.txt`. |
| G05 | Reviewed final diff | G04,A04 | `git diff --check`: exit 0. All new files classified; no secrets/QA PII or unexplained changes to original repo. Exact file list recorded. |

## H - Preview acceptance

| ID | Single deliverable | Depends on | DoD / required evidence |
|---|---|---|---|
| H01 | Identified Preview deployment | Gate A and action authorization | Record URL, SHA/deployment ID; Production unchanged; isolated DB and file-store disabled. Missing deployment access does not block local work. |
| H02 | Real Preview persistence | H01 | Expected migration history; session created in Preview can be read from a different instance; no file fallback; database is not Production. |
| H03 | Four Preview journeys | H02 | **BLOCKED â€” local-only evidence is not Preview:** local dev with `DIAGNOSTIC_LOCAL_STORE=1` passed desktop/mobile journeys, refresh, correction, skip and late contact. Built production routes return 200, but the full production-mode journey stalls because file-store is correctly disabled and Postgres is unavailable. H02 is not met, so no real Preview or DB-count claim is made. |
| H04 | Real request delivery | H03,E02 | QA request reaches defined Itay handling channel. If email is required, verify receipt in QA inbox via non-sensitive correlation. Provider acceptance/no-send mode alone does not prove inbox delivery. |
| H05 | Preview privacy proof | H03,E06 | Preview network/log capture has no canary PII/session/token leakage; HTTPS cookie and cache/referrer headers correct. |
| H06 | Preview visual/non-regression proof | H03,F03 | Six Preview screenshots pass F03-F05. Home matches approved site-next version, unaffected by diagnostic deployment. Approved Home changes in site-next need not be reverted to old Production design. |

## I - Controlled release

| ID | Single deliverable | Depends on | DoD / required evidence |
|---|---|---|---|
| I01 | Rehearsed code/schema rollback | A03,H02 | `production-rollback-runbook.md` identifies previous deployment, rollback command, DB backup and schema limitations. Run previous code against new schema in DB clone; if incompatible, rehearse recovery that preserves newly collected leads. Record results/duration. |
| I02 | Specific release approval | Gate B,I01,E04 | Itay approves specific SHA, Preview, retention policy and rollback plan. Without approval: BLOCKED; no merge/Production. |
| I03 | Approved Production release | I02 | Deploy only approved revision; record deployment ID and rollback target; no unplanned migrations. |
| I04 | Live Production smoke proof | I03 | Four routes with synthetic QA data, one delivered request, refresh, metadata and analytics pass against live deployment. Broken/duplicate requests, blocked journey or PII leak trigger rollback runbook. Do not delete real leads during QA cleanup. |

## Explicit completion gates

- **Gate A / Local:** A01,A02,A04,A05 and all B-G PASS. Missing isolated Postgres leaves DB tasks BLOCKED while UI/unit work continues; Preview is not required for this gate. E04 can pass as an explicit unresolved-policy document, but that does not approve Production PII retention.
- **Gate B / Preview:** Gate A and all H PASS. File-store or mocked delivery evidence cannot substitute for real DB/delivery evidence.
- **Gate C / Production:** A03 and all I PASS, including approved retention. Open P0/P1 issues affecting conversion, data safety or core accessibility = 0.
- **Incident DONE:** Gate C passed; no broken business route, duplicate request, lost answer, exposed PII or blocking core accessibility defect. Every finding has ID, severity, evidence and disposition. Noncritical content/cosmetic improvements remain explicitly listed in backlog.
- **Business success is separate:** qualified conversations and opportunities against targets, distinguishing first-touch and assisted influence. QA success does not establish channel fit or SEO/GEO success.

Severity: P0 = broken conversion, data loss/exposure, duplicate request or missing rollback during release. P1 = failed mandatory acceptance requirement including core accessibility, delivery or indexability. P2 = enhancement outside an approved acceptance requirement. Never downgrade a defect simply to close a gate.

## Execution order

1. A01,A02,A04 alongside B01-B04. Read-only A03 research does not block local implementation.
2. C01-C08; independently C09-C11 and F01.
3. D01-D10; E01,E04,F06,F07 need not wait for UI.
4. E02-E08 and F02-F10; then G01-G05.
5. H only after Gate A. I release only after Gate B and explicit approval.

This plan does not authorize an automatic commit, push, merge, Production migration or deployment. Preserve unrelated changes and `.playwright-cli/`.

