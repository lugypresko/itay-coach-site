# Task 073 — Reader-Facing Artifact Publication Boundary

Date: `2026-07-13`

## Result

Implemented locally. Not committed, pushed, deployed, approved, or published.

The public identity is now one versioned `ReaderFacingPageArtifact`. Canonical serialization hashes only its allowlisted reader-facing fields. Deterministic validation, internal-language validation, semantic review, human approval, provenance, and publication records are separate hash-bound contracts.

Public resolution is fail-closed. A page enters page rendering, metadata, structured data, sitemap, and `llms.txt` only when the artifact is valid and approved and every required governance record matches its ID, version, and hash. Missing Payload access returns an empty artifact projection rather than legacy fallback content.

## Legacy disposition

- Existing legacy Payload/content records remain unchanged as history.
- No legacy approval was transferred or backfilled.
- Legacy generic and Problem Page dynamic routes no longer render from those records.
- Legacy PageBrief and authority-launch components return 404 and expose no public canonical.
- Site-level metadata defaults to `noindex, nofollow`; only the approved artifact route projection opts into `index, follow`.
- Static legacy registries remain available to audit/seed tests but no longer feed runtime sitemap or `llms.txt`.

## Draft 05 replacement

- Artifact ID: `authority-draft-approved-insight-player-trap-05`
- Artifact version: `2`
- Artifact hash: `f06d5cf04e27f07b38246445b031bf4637c4def6884bef3feabe8ce054571687`
- Canonical path: `/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck`
- Lifecycle: `draft`
- Human approval: absent
- Publication record: absent
- Public projection: excluded
- Sitemap / `llms.txt`: excluded
- Preview route: `/preview/artifacts/authority-draft-approved-insight-player-trap-05` in non-production only
- Preview verification: local HTTP 200; production mode is hard-coded to 404

The replacement uses the existing PageBrief and seven existing Approved Insights. It introduces no URL and makes no client, company, metric, testimonial, or outcome claim.

## Verification

- `npm test`: `49` files / `301` tests passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- `git diff --check`: passed with line-ending warnings only.
- Local preview: HTTP 200 and rendered the artifact through the same renderer used by the future public projection.

## Human boundary and blockers

The new Payload migration was generated but not executed. Draft 05 requires artifact-specific human review and a new approval against the exact v2 hash. Publication also requires a separate matching `PublicationRecord`, authorized migration/deployment, and post-deployment verification. The earlier legacy Draft 05 approval/hash is intentionally not transferred.

Local Payload-backed HTTP verification encountered the existing local database schema-pull delay; contract, projection, full-suite, build, and non-production preview verification completed successfully.
