# Diagnostic V3 implementation contract and gap analysis

User-approved 2026-10-23. Diagnostic version v3; scoring-v1; analysis-v2 (approved two-pass prompts).

## Gap analysis (completed before implementation)
- Existing UI: five auto-advancing questions; result computed client-side; no restore; Review returns only Q5.
- Existing lifecycle: started -> in_progress -> completed -> result_viewed -> email/fit. No revision model; completed -> in_progress fails.
- Existing persistence: diagnostic_sessions, legacy columns + funnel_session JSONB; Supabase REST publishable credential; Preview memory. Payload collection excludes funnel_session and permits anonymous create. Do not add V3 PII there.
- Files: new lib/diagnostic-v3 modules, API /api/diagnostic/v3, new V3 component and scoped CSS; existing diagnostic page switches component; new additive migration and migration registry; tests and this contract. Homepage untouched.
- Reuse: existing shell, PostgreSQL dependency, mail provider pattern. V2 readers/routes/types untouched, not coerced into V3.
- Database: dedicated private diagnostic_v3_sessions table; token hashes, CAS record_version, expiry, JSON payload. No destructive migration/backfill. Isolated DIAGNOSTIC_V3_DATABASE_URL required for durable Preview QA; explicit disposable Preview adapter otherwise.
- Risks: stale analyses, duplicate identity/email, anonymous authorization, refresh loss, internal-score leakage, unsafe text, Preview database accidentally using Production. Mitigations: opaque cookie credentials; expected record version on every mutation; analysis tuple; server-only DTO; opt-in isolated DB URL; no DATABASE_URL fallback.
- Migration/rollback: checkpoint 6722fa3 / dpl_HLEjaT3vrfzQvDJDfyCftKuPMBtY. Apply migration only to isolated QA database first. Never auto-migrate at build/start. Roll code back without dropping V3 data. down refuses to drop data; destructive cleanup separate.
- Tests: all routing thresholds and precedence, duplicate recurrence/impact signals, fit unknown, evidence validation, sanitizer fallback, Groq timeout/schema failure, stale CAS/revision, identity idempotency, scoring-only qualification, TTL, public response privacy, backward navigation, refresh and CTA.

## Lifecycle and safety
entry -> answering -> partial -> identified/full -> qualified. Full read precedes qualification and remains accessible if skipped. Missing fit stores unqualified_nurture immediately. Editing increments answer_revision and clears analyses; identity retained. Every analysis is tied to session_id + answer_revision + analysis_version; compare-and-swap prevents stale writes. Qualifying never calls Groq.

Scoring is the approved scoring-v1 table in the conversation. Routing order: missing fit, Pain<=3, normal conversation, override, Total<18, nurture. Store rule ID. Never show score/reason to visitor. Several choices (nothing/probably_not_much) are exclusive. Other/free text does not add points.

## Production gates
No Production enabled in this task. Require isolated database migration verification, GROQ_API_KEY server-side, GROQ_ZDR_VERIFIED=true only after account Data Controls reviewed; explicit DIAGNOSTIC_V3_AI_ENABLED=true. No Groq otherwise. Model default openai/gpt-oss-20b with strict schema, validate again and verify evidence references. No identity or session ID in requests. Fail closed to deterministic analysis on unsafe free text, timeout, schema/evidence error.
Set DIAGNOSTIC_V3_BOOKING_URL to the approved HTTPS scheduler; DIAGNOSTIC_V3_MAIL_FROM, DIAGNOSTIC_V3_BRIEF_TO and explicitly enable DIAGNOSTIC_V3_MAIL_ENABLED. Preview mail remains simulated unless separately enabled for a controlled QA recipient. No five-email sequence, no marketing consent implied. Brief stored internally even before qualification.
Update privacy policy before Production to explain external processing and retention. Anonymous expiry: creation+30d; identified: initial submit+12 calendar months, never extended by view. Cleanup scheduled separately before Production; expired rows inaccessible immediately. Deletion by user removes row and expires cookie. Return links carry only random one-time tokens, exchange for cookie and redirect to clean diagnostic URL; access requires cookie not UUID. Separate short-lived return credential from session cookie token.

## Provider schemas
Both passes: fixed pattern enum, confidence enum, evidence with answer_reference and interpretation; alternative nullable, contradictions/missing-information arrays. Second adds action, manager question, seven-day experiment, success signal and unresolved question. No scores/routes accepted. All properties required and additionalProperties=false; length/evidence checks server-side. Render plain text only. Untrusted inputs are data, never instructions.

## Preview limitations and acceptance
Disposable memory adapter must be visibly labeled and not mistaken for durable cross-instance persistence. No external email or booking success claims in simulation. Real persistence, email delivery, booking webhook and ZDR must be verified separately before Production. User journey must remain usable without those providers.


## Approved First Read / Full Read integration (2026-10-23)
Gap against the initial V3 implementation: shared short prompt, coarse pattern enum, internal field references instead of Q IDs, extra First Read fields in Full Read, and missing experiment review_point. This revision separates the two approved reasoning instructions in src/lib/diagnostic-v3/prompts.ts, updates strict schemas, maps actual answer labels to Q1–Q9, permits CASE_CONTEXT only in Full Read, and renders the review point and unresolved question. JSON schemas are supplied separately from the reasoning text; application injection/privacy/no-scoring guardrails are appended to both passes.

Q5 contains duration + recurrence and counts as one independent question. Q6 includes attempts/context, Q7 impact/context, Q8 desired outcome, Q9 case context. CASE_CONTEXT aliases Q9, never independent evidence. First Read is validated before being included in the second pass. Identity and qualification remain excluded from provider payloads. scoring-v1 and routing are unchanged.

No database migration: JSONB session envelope remains unchanged. analysis_version advances to analysis-v2. Older derived reads are invalidated on load; answers, identity, qualification and retained Sales Brief remain. User explicitly reruns analysis; no background provider request. Atomic record-version writes continue to reject stale updates. No Production action or homepage change.

Rollback of this Preview revision: redeploy 14e129a9ae98c60defa503e71e0df4699dcf3ead (analysis-v1); use a fresh disposable Preview session for QA. Production rollback checkpoint remains unchanged. Neither a Production rollback nor persistent DB migration was exercised here.
