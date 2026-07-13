# Task 071 — Shared Publication Projection Repair

Date: `2026-07-13`
Environment: local repository and test environment
Deployment state: `not deployed`
Migration state: `generated, not applied`

## Result

The local implementation restores the invariant:

`one normalized Payload record -> one PublicationDecision -> page metadata, sitemap, and llms.txt`

This is local verification only. Production remains on the rolled-back Task 070 baseline until a separately authorized migration and deployment.

## Implemented

- Added canonical ownership, a revision-bound human-approval envelope, and Problem Page `publishedAt` to Payload collection definitions.
- Generated one additive nullable PostgreSQL migration. It contains no content/status DML and has not been run.
- Extracted the Task 069 SHA-256 serialization into one shared implementation and preserved the approved Draft 05 hash.
- Bound publication approval to current title, reader-facing content, canonical origin/path, supporting Approved Insights, deterministic/semantic validation, and explicit deployment/publication authorization.
- Added a full `publicationRevisionHash` covering every rendered/discovery-affecting generic authority and Problem Page field; the existing Task 069 content hash remains unchanged.
- Required authenticated Payload writes and restricted approval-governed changes to `admin`, `editor`, or `human` roles.
- Blocked agents and unauthenticated/internal override operations from approval mutation, approval, publication, approval-bound published edits, and transitions out of `published`.
- Preserved all raw Payload lifecycle states while mapping `in_review` and `approved` to semantic non-public `review` for publication evaluation.
- Removed the inference that `published` implies human approval.
- Ensured explicit surface flags can narrow but never override lifecycle/approval/canonical/schema requirements.
- Added shared per-record projection builders used by generic authority pages, Problem Pages, sitemap, and `llms.txt`.
- Made governed production reads fail closed when Payload is unavailable. Static fallback remains explicit and local/test-only.
- Added bounded pagination, parallel collection reads, duplicate-path rejection, canonical-null handling, and JSON-LD suppression when canonical/schema requirements fail.

## Verification

- Final full suite: `43` files, `258/258` tests passed.
- Focused normalization review: `68/68` tests passed.
- Payload governance review: `27/27` tests passed.
- Typecheck: passed.
- Production build: passed (`npm run build`, exit `0`); existing lint warnings and the existing Payload/Vercel media-storage warning remain.
- `git diff --check`: passed with existing LF-to-CRLF warnings only.
- Independent reviewers approved the Payload schema, normalization, and shared projection lanes.
- Final security/lifecycle reviewer approved Task 071 after the authenticated-write, full-fingerprint, and published-demotion guards were verified.

## Preserved approval identity

- Draft 05 canonical path: `/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck`
- Approved SHA-256: `f95ab45388c077de87efc8228e9788bf4fa9cca1a146a7ec02233e5c1b818211`
- Complete publication fingerprint: `pending explicit human approval`; none was invented or backfilled.
- Draft 05 remains non-public after the Task 070 rollback.
- Drafts 06 and 07 remain non-public.

## Project discovery Definition of Done

Task 071 local verification establishes publication eligibility only. The project discovery milestone is reached only when one canonical authority asset satisfies all of the following:

- HTTP 200;
- `index, follow`;
- valid canonical;
- sitemap inclusion;
- `llms.txt` inclusion;
- Google Search Console URL recognition;
- progression from discovered/crawled to indexed;
- relevant-query impressions, even if clicks remain zero.

Primary milestone: `One correctly published canonical authority asset indexed and receiving relevant impressions.`

## Pending human-authorized action

1. Review the Task 071 diff and additive migration.
2. Authorize commit/push/deployment separately.
3. Run the Payload migration during the authorized rollout without changing any content status.
4. Produce an evidence-backed inventory and human decision for every existing governed record currently marked `published`; do not backfill approval automatically.
5. Obtain explicit human approval for Draft 05's complete publication fingerprint and synchronize its approval envelope/canonical source facts.
6. Recompute both the preserved content hash and approved publication fingerprint before any publication transition.
7. Publish only explicitly authorized records.
8. Run a full post-deployment Production Observation.
9. Open a measurement window only after all production publication surfaces agree.

No commit, push, deployment, publication, ProductionDirective, or migration execution was performed by Task 071.
