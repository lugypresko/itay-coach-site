# Reader-Facing Page Artifact Design

Date: `2026-07-13`
Status: `approved`
Decision: `DEC-20260713-04`

## Objective

Replace the Authority Engine's broad-CMS-record publication boundary with one immutable, versioned `ReaderFacingPageArtifact` that is the exact object bound to validation, semantic review, human approval, hashing, publication, rendering, metadata, structured data, sitemap, and `llms.txt`.

No content is published or automatically approved by this change.

## Required flow

```text
PageBrief
→ Generation
→ ReaderFacingPageArtifact Draft
→ Canonical Serialization
→ Artifact Hash
→ Deterministic Validation { artifactHash }
→ Internal-Language Validation { artifactHash }
→ Semantic Review { artifactHash }
→ Human Review
→ Human Approval { artifactHash }
→ Immutable Approved Artifact
→ PublicationRecord { artifactId, artifactVersion, artifactHash, publicationState, indexable }
→ Shared Public Projection
→ Page / Metadata / Structured Data / Sitemap / llms.txt
```

Generation may be agentic, deterministic, or hybrid. Every generator must return the same artifact contract.

## Artifact ownership

`ReaderFacingPageArtifact` contains only public allowlisted fields:

- identity: artifact ID, version, schema version;
- routing: page type, canonical path, locale;
- content: title, description, reader-facing body sections;
- conversion: primary CTA and optional secondary CTA;
- navigation: public internal links and optional public FAQ;
- discovery: public SEO input and optional structured-data input;
- integrity: artifact hash, draft/approved lifecycle, creation timestamp.

Evidence, provenance, validation results, semantic reviews, and human approvals are logically separate entities. They may be persisted in fewer physical Payload collections, but they may not be embedded in or rendered as public content.

## Hash and immutability

Canonical serialization includes every public artifact field except `artifactHash`, lifecycle, and storage timestamps. Object keys and arrays preserve their contract-defined order; line endings are normalized. SHA-256 of the canonical serialization is the artifact hash.

The hash is computed server-side and cannot be supplied or edited by an ordinary create/update request. Approved artifacts cannot be updated or deleted. Any public-field change creates a new artifact version and hash; earlier validation, semantic review, approval, and publication linkage do not transfer.

## Persistence

Use one physical Payload collection, `reader-facing-page-artifacts`, for immutable artifact versions. Store validation, semantic review, human approval, provenance, and publication record as logically distinct groups/records with their own hash bindings. A later physical split remains possible without changing the domain contracts.

Payload remains the source of truth. Existing generic content and Problem Page collections remain historical/editorial sources only and are not public publication sources after cutover.

## Fail-closed public behavior

A route has no public existence unless all conditions hold:

1. artifact lifecycle is `approved`;
2. deterministic validation passes for the exact artifact hash;
3. internal-language validation passes for the exact artifact hash;
4. semantic review passes for the exact artifact hash;
5. human approval matches the exact artifact hash;
6. publication record matches artifact ID, version, and hash;
7. publication state is `published` and deterministic publication decision is published/indexable.

Otherwise production returns 404 and the asset has no canonical, structured data, sitemap entry, or `llms.txt` entry. Draft/review content is available only through a separate authenticated or non-production preview that uses the same artifact and renderer.

## Legacy policy

- Preserve historical records.
- Do not backfill artifacts automatically.
- Do not transfer existing approvals.
- Remove legacy records from production routes and discovery surfaces after artifact cutover.
- Require every legacy asset to produce a new artifact and return to human review.
- Generate only the Draft 05 replacement in this task; keep it non-public.

## Replacement content

Create one new Draft 05 artifact for:

`/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck`

It uses the approved diagnosis-first structure and only evidence-supported claims. Missing company, outcome, metric, case, or testimonial proof is omitted rather than invented. The artifact stops at human review and receives no human approval or publication record.

## Verification

Tests must prove allowlist enforcement, canonical hash stability, hash invalidation on every public change, immutable approval, hash-bound validations/reviews/approval, fail-closed public resolution, legacy exclusion, preview/render identity, Draft 05 non-public state, and surface consistency across page, metadata, structured data, sitemap, and `llms.txt`.
