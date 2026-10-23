# V3 Preview and production enablement

No production action is authorized in this task.

## Isolated database
- Provision a separate QA Postgres database and set `DIAGNOSTIC_V3_DATABASE_URL` for Preview only. It deliberately does not fall back to the Payload/Production DATABASE_URL.
- Apply only `src/migrations/20261023_180000_diagnostic_v3.ts` up against that isolated connection through the reviewed migration runner. Do not run the entire Payload migration history blindly.
- Table is server-only, RLS enabled and no PUBLIC grants. Runtime DB role must own the private table or have a narrowly reviewed policy; no anonymous Supabase grants.
- Restart/second-instance QA must confirm answers, identities, analyses and routing persist before durable-storage acceptance.
- Without isolated configuration, Preview displays a disposable-memory banner. Warm-instance refresh may work; server restart/multi-instance persistence is NOT accepted.

## Provider controls
- Groq is off unless `DIAGNOSTIC_V3_AI_ENABLED=true`, `GROQ_ZDR_VERIFIED=true` and `GROQ_API_KEY` are present. Verify account Data Controls before setting the verification flag. Model: `DIAGNOSTIC_V3_GROQ_MODEL` default `openai/gpt-oss-20b`; use only a current strict Structured Outputs model.
- Preview runs fallback with no provider request by default. No fabricated evidence or unvalidated provider text is rendered. Unsafe case input forces fallback.
- `DIAGNOSTIC_V3_BOOKING_URL`: approved HTTPS 20-minute scheduler. No URL configured -> honest unavailable message, no broken booking link. Booking completion requires a separately verified provider webhook, not a click.
- Email to the user is explicit and one message per answer revision. `DIAGNOSTIC_V3_MAIL_ENABLED=true`, `DIAGNOSTIC_V3_MAIL_FROM`, `RESEND_API_KEY` required. Preview always simulates (no live test recipient configured).
- Sales Brief is retained server-side in the same private V3 record, including unknown-fit leads. No extra CRM workflow or private data in client DTO. Operational notification recipient is not yet configured; no brief email is sent.

## Retention and privacy
- Expired sessions are denied immediately. Anonymous TTL: creation +30 days. Identified TTL: initial identity submission +12 calendar months. Views do not extend retention.
- User Delete my case removes private row and contact details. Does not claim to retract an email already delivered.
- Before production configure a daily cleanup for expired rows (and provider backups as applicable); expired access checks alone are not physical deletion. Review privacy text and AI provider disclosure before enabling.
- Return links are opaque, 7-day, one-time credentials. Browser exchanges token for HttpOnly cookie, clean redirect and no-referrer. No email/PII in URL. Email inbox access is the return-link trust boundary.

## Rollback
Checkpoint branch `rollback/pre-diagnostic-v3-2026-10-23` at `6722fa3603e9292ef2b4b8275f7fae178f20b3fa`; previous READY Production `dpl_HLEjaT3vrfzQvDJDfyCftKuPMBtY`.
V3 Production route/API disabled by default. Retain V2 contracts and storage; never down-migrate/delete V3 records on rollback. New migration down intentionally refuses destructive rollback. Restore recorded Vercel deployment/commit if a future release is separately authorized.
