# Diagnostic retention policy

Status: **Local contract complete; Production approval BLOCKED** until Itay approves the retention period for Lead PII. This document is the E04 deliverable for 2026-09-16.

| Data class | Retention | Owner | Deletion policy | Exceptions |
| --- | --- | --- | --- | --- |
| Anonymous diagnostic session and raw answers | 24 hours from creation or last permitted session expiry timestamp | Developer / data operator | Purge expired `diagnostic-sessions` records and local test fixtures. Expiry must remove access and the stored record; access TTL alone is insufficient. | A security or incident hold may preserve a specific record when documented with owner, reason and end date. No Production hold exists by default. |
| Historical report access token and report snapshot | 30 days from report creation | Developer / data operator | Delete or irreversibly invalidate the report token and associated historical report after 30 days. Invalid and expired tokens return 404 and are never logged. | A documented legal or incident hold may extend a named report, with least-privilege access and an expiry date. |
| Lead PII (name, email, consent timestamps and request metadata) | **UNRESOLVED — Itay approval required** | Itay as business owner; developer implements the approved policy | Once approved, delete or anonymize on the documented schedule, including linked diagnostic snapshot fields that can identify the person. A delivery failure does not extend retention automatically. | Legal/tax, active customer relationship or incident hold may require a documented extension. The hold must identify the data owner, purpose and deletion date. |

## Collection boundaries

Anonymous answers stay in the server-side session store. Analytics receives only the allowlisted lifecycle fields in [`analytics-contract.md`](./analytics-contract.md). URLs, cookies, referrers, application logs and screenshots must not contain raw answers, name, email, session IDs or operation IDs.

Lead PII is collected only after explicit processing consent and a valid eligible route. Marketing consent is separate and optional. A contact-free diagnosis does not create a Lead.

## Operational requirements

The purge job must run against the isolated test/Preview database first, report counts without values, and be safe to repeat. Production execution requires the approved retention period, a rollback/backup plan and release approval. As of this document date, isolated DB and Preview execution evidence are **BLOCKED** when those environments are unavailable.
