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


## 2026-10-23 isolated Neon Preview provisioning
- Project winter-resonance-15589128 (itay-coach-site), Frankfurt. Existing parent production / br-jolly-lake-b9s9s6fz had no user tables when inspected. Its connection/configuration was not modified.
- Created preview/diagnostic-v3 / br-cold-credit-b9x1qomi, endpoint ep-icy-fire-b9b5tsic. Default account compute settings used: changing suspend interval returned HTTP 412 and created no branch; no account policy was changed.
- Applied the exact additive V3 migration DDL to neondb on the Preview branch only, using a transaction. Payload migration ledger/bootstrap was not run; the private V3 table exists, full Payload CMS schema/users still require isolated initialization.
- One synthetic session generated through real V3 service actions was inserted. UUID ed6378ce-6627-4bbe-945b-a54e121fa855; revision 1, record_version 5, total 40, conversation via 3_threshold. After restarting only the Preview compute, exact JSONB equality, both analysis revisions and brief preservation passed. Wrong-version UPDATE affected zero rows. RLS enabled and no PUBLIC grants verified.
- This proves Neon persistence across its compute restart, not browser-to-DB or application-redeploy acceptance. Those remain blocked until Vercel connects to it.
- Vercel env metadata read and branch-specific create both returned HTTP 403. No env was changed. Required manual/authorized operation: add DIAGNOSTIC_V3_DATABASE_URL as Secret to Preview, branch feature/diagnostic-v3 only, using this Preview branch connection from Neon Console. Never select Production. Existing general/Production DATABASE_URL is unchanged.
- New code requires isolated persistent storage in deployed Preview; memory adapter remains local-test only. Preview Payload also resolves only DIAGNOSTIC_V3_DATABASE_URL; missing configuration fails closed and does not contact a general DATABASE_URL.
- Existing synthetic provider check now requires server-verified Payload users/role=admin before reading its cached result or calling a provider. Anonymous 401, non-admin 403, unavailable/missing auth configuration 503. No status/PII is returned on denied access. Future Verification, Session Audit and Health Check surfaces must call the same guard before accessing data.
- Payload role field create/update is restricted to authenticated administrators, preventing self-promotion via API. No second auth system, no role assignment or real user copy performed. An isolated QA Payload admin and a distinct Preview PAYLOAD_SECRET must be configured before authenticated browser acceptance.
- Code rollback point: 7b2bb04755e70637c335f5c96a9117a227dd2ae5. Rollback retains Preview data and does not drop tables/branches. No Production release or main merge.
