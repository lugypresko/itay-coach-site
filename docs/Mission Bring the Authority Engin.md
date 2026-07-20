# Mission: Bring the Authority Engine to 85% End-to-End Operational Capability

You are working inside the existing Authority Engine repository.

Your mission is not to generate more content, redesign the architecture broadly, or add more agents.

Your mission is to close the execution gap between:

`Intent → Governed Artifact → Human Approval → Production Publication → Verification → Measurement → Next Best Action`

The system already demonstrates reasonable content generation, provenance, semantic review, and approval-package capabilities.

The current constraint is execution closure.

## Business Intent

Make the Authority Engine capable of receiving a business intent, selecting the highest-leverage next action through the Chief of Staff, producing or selecting the required governed artifact, requesting one valid human approval, publishing the exact approved artifact to Production, synchronizing all discovery surfaces, verifying the outcome, and returning the next constraint.

The first vertical slice is the governed `/about` authority page.

The second vertical slice must prove repeatability on another relevant authority asset without requiring new workflow code or manual publication logic.

---

# Definition of 85% Operational Capability

The system reaches 85% capability only when it can complete two end-to-end vertical slices with the following properties:

1. The workflow starts from a business Intent, not a page-writing instruction.
2. The Chief of Staff inspects the current repository and Production state.
3. The COS identifies one current constraint.
4. The COS selects one Next Best Action and explicitly rejects lower-priority alternatives.
5. The system reuses existing verified knowledge before creating new content.
6. A governed artifact is generated or selected only when required.
7. The artifact has deterministic identity, provenance, version, and content hash.
8. The exact human approval binds to the exact canonical artifact.
9. Approval automatically resumes execution.
10. One canonical publication decision controls every public surface.
11. The change is committed and deployed to the correct Vercel Production project.
12. Production is verified directly after deployment.
13. Any divergence causes mission failure and rollback or safe unpublication.
14. Measurement is active.
15. The COS runs again using the new Production state.
16. The second vertical slice completes without adding page-specific publication logic.

A Vercel deployment in `READY` state is not mission success.

A Markdown artifact or approval package is not mission success.

An HTTP 200 response is not mission success if the content is stale, empty, `noindex`, absent from discovery surfaces, or different from the approved artifact.

---

# Current Known State

Treat these observations as defects until independently verified as resolved:

* `/about` has previously returned HTTP 200 while rendering incomplete or stale content.
* `/about` has previously been `noindex, nofollow`.
* `/sitemap.xml` has previously returned an empty URL set.
* `/llms.txt` has previously contained no public routes.
* Artifact hashes have previously been manually declared and failed deterministic recomputation.
* Multiple surfaces may derive publication eligibility independently.
* The content and approval workflow currently stops before complete execution.

Do not trust repository comments, readiness labels, artifact reports, or previous mission output without direct verification.

---

# Non-Goals

Do not:

* create additional agents unless strictly required
* add more semantic-review dimensions
* create another generic scoring framework
* rewrite the About copy repeatedly
* create several new content pages before repairing publication integrity
* build a large orchestration framework
* introduce page-specific publication code
* declare success based on unit tests alone
* declare success based on deployment state alone
* manually copy approved content between files or reports

Prefer the smallest coherent implementation that closes the full loop.

---

# Required Architecture

## 1. Canonical Governed Artifact

Create or finalize one canonical artifact contract.

It must contain at least:

```ts
type GovernedAuthorityArtifact = {
  artifactId: string
  version: string

  route: string
  artifactType: string

  title: string
  body: string

  canonicalHash: string
  hashAlgorithm: "sha256"
  canonicalizationVersion: string

  provenance: {
    sourceIds: string[]
    claims: Array<{
      claim: string
      sourceId: string
      sourceLocation?: string
      relationshipType?: string
      verificationStatus: "verified" | "unsupported" | "ambiguous"
    }>
  }

  semanticReview: {
    status: "passed" | "failed"
    dimensions: Array<{
      name: string
      score: number
      recommendation?: string
    }>
    overallScore: number
  }

  approval: {
    status: "pending" | "approved" | "revision_requested" | "rejected"
    approvedArtifactId?: string
    approvedVersion?: string
    approvedHash?: string
    approvedAt?: string
    approvedBy?: string
  }

  publication: {
    state:
      | "draft"
      | "review_ready"
      | "approved"
      | "publishing"
      | "published"
      | "verification_failed"
      | "rolled_back"

    publishedAt?: string
    deploymentId?: string
    commitSha?: string
  }
}
```

Adapt this to the existing repository conventions instead of introducing duplicate domain models.

There must be one canonical body value.

The human approval view, stored hash, publication renderer, and verification logic must all use that same value.

Do not maintain manually copied versions of the artifact body.

---

## 2. Deterministic Artifact Identity

Implement one explicit canonicalization function.

Example responsibilities:

* normalize CRLF and CR to LF
* define whether leading and trailing whitespace is removed
* define whether trailing spaces on individual lines are preserved
* define Unicode normalization behavior
* encode using UTF-8
* version the canonicalization policy

Example API:

```ts
canonicalizeArtifactBody(body: string): string
computeArtifactHash(body: string): string
verifyArtifactHash(body: string, expectedHash: string): boolean
```

Required invariant:

```text
approved hash
==
canonical stored artifact hash
==
publication input hash
==
rendered artifact identity
```

Required tests:

1. The same canonical body always produces the same SHA-256 hash.
2. CRLF and LF behavior matches the documented policy.
3. Any meaningful content change invalidates approval.
4. The approval renderer reads the canonical body directly.
5. The publication renderer reads the same canonical body.
6. A mismatched approval hash blocks publication.
7. The stored hash is never accepted without recomputation.

The approval package must display:

* artifact ID
* version
* canonicalization version
* stored hash
* recomputed hash
* hash match result
* canonical body byte length

---

## 3. Approval as an Execution Trigger

Human approval must not be the end of the mission.

A valid approval command must include:

```text
APPROVE <artifact-id> / <version> / <hash>
```

The system must validate all three values.

If any value differs from the current canonical artifact:

```text
APPROVAL_REJECTED
Reason: artifact identity mismatch
```

After a valid approval, automatically continue with:

1. Lock the approved artifact identity.
2. Re-read the canonical artifact.
3. Recompute its hash.
4. Compare it with the approved hash.
5. Derive the publication decision.
6. Update the canonical publication state.
7. Run repository validation and tests.
8. Create a commit.
9. Push or invoke the existing deployment workflow.
10. Deploy to the correct Vercel Production project.
11. Run Production verification.
12. Mark the mission complete or blocked.
13. Run the COS again.

Do not require another user instruction to continue after a valid approval.

---

## 4. Unified Publication Decision

Implement or finalize one deterministic publication decision.

Example:

```ts
type PublicationDecision = {
  artifactId: string
  route: string

  render: boolean
  indexable: boolean
  canonicalUrl: string | null

  includeInSitemap: boolean
  includeInLlms: boolean
  includeInStructuredData: boolean
  eligibleForInternalLinks: boolean
  analyticsEnabled: boolean

  reasonCodes: string[]
}
```

Example API:

```ts
derivePublicationDecision(
  artifact: GovernedAuthorityArtifact
): PublicationDecision
```

The decision must be derived from the canonical normalized artifact and its valid approval state.

The following surfaces must consume the same decision:

* page rendering
* HTTP route availability
* robots metadata
* canonical metadata
* sitemap.xml
* llms.txt
* structured data
* internal-link eligibility
* navigation eligibility where applicable
* analytics eligibility

No surface may independently infer publication state from a different collection, fallback value, static file, or lossy transformation.

Required invariant:

```text
approved + published + public
=
rendered
+ indexable
+ canonical
+ sitemap
+ llms
+ structured-data eligibility
+ internal-link eligibility
+ analytics
```

If a surface cannot support the decision, publication verification must fail.

---

## 5. Chief of Staff Operating Loop

The COS must run before implementation selection and again after Production verification.

The COS output must contain:

```ts
type COSDecision = {
  businessObjective: string
  currentStateEvidence: string[]
  currentConstraint: string
  alternativesConsidered: Array<{
    action: string
    decision: "selected" | "rejected"
    reason: string
  }>
  nextBestAction: string
  expectedSignalMovement: string[]
  stopConditions: string[]
  requiredArtifacts: string[]
  nextReviewCondition: string
}
```

For the first vertical slice, the expected decision is likely:

```text
Current constraint:
Canonical publication and discovery integrity.

Selected action:
Complete governed publication of the existing About artifact.

Rejected:
- Generate more generic leadership articles
- Expand the methodology content
- Launch acquisition campaigns

Reason:
Additional content cannot create authority while approved assets remain noindex, absent from sitemap.xml and llms.txt, or inconsistent across publication surfaces.
```

Do not hardcode that decision. Derive it from the current repository and Production state.

The COS must distinguish among:

* missing knowledge
* insufficient evidence
* missing artifact
* approval blockage
* publication inconsistency
* discovery failure
* indexing failure
* measurement failure
* conversion failure

Do not label an execution problem as knowledge unavailability.

---

## 6. About Vertical Slice

Use the existing governed About artifact as the first vertical slice.

Do not broadly rewrite it unless factual verification requires a correction.

The approved artifact must use conservative, verified company-relationship language.

Do not infer employment, executive responsibility, or organization-wide impact from the presence of company names in a biography.

The exact artifact must be stored in the canonical source and rendered through the existing managed About pipeline, including:

```ts
getAuthorityLaunchPage("about")
```

or the repository’s correct equivalent.

Required pre-publication checks:

* artifact ID exists
* version exists
* canonical hash recomputes successfully
* provenance passes
* unsupported claims are absent
* approval identity matches
* CTA exists and points to a valid route
* required internal relationships are defined

---

## 7. Vercel Deployment

Use the existing Vercel project and deployment mechanism.

Before deployment, identify and record:

* Vercel team
* Vercel project ID
* production domain
* source branch
* commit SHA
* deployment target

After deployment, record:

* deployment ID
* deployment URL
* production alias
* deployment timestamp
* build state
* verification timestamp

Do not deploy to a similarly named secondary project without proving it is the project currently serving the production domain.

---

## 8. Production Verification Gate

Implement a deterministic Production verifier.

It must fetch the actual public Production domain, not merely inspect local code or build output.

For `/about`, verify:

* HTTP status is 200
* expected approved content is present
* stale or fallback content is absent
* rendered identity matches the approved artifact
* exactly one H1 is present
* title is correct
* meta description is correct
* robots is `index, follow`
* canonical URL is correct
* CTA label is correct
* CTA destination resolves correctly
* required outbound internal links exist
* at least one relevant inbound internal link exists
* structured data is present and valid where required
* analytics is loaded

For `/sitemap.xml`, verify:

* HTTP 200
* valid XML
* `/about` is included
* no draft, review, noindex, redirected, or invalid route is included
* the sitemap derives from the same publication decision set

For `/llms.txt`, verify:

* HTTP 200
* `/about` is listed
* route descriptions match the approved entity and methodology model
* routes derive from the same publication decision set

For `/robots.txt`, verify:

* HTTP 200
* the site is not blocked unintentionally
* the correct sitemap URL is declared
* `/about` is not blocked

For internal discovery, verify:

* the About page is not orphaned
* meaningful anchor text is used
* relationships to relevant methodology, framework, service, or homepage surfaces are present

For measurement, verify:

* Vercel Analytics or the approved analytics layer is present
* Production can be distinguished from Preview
* the CTA interaction is measurable
* a baseline timestamp is recorded

---

## 9. Failure Handling and Rollback

A deployment in `READY` state with failed Production verification is a failed mission.

If any required invariant fails:

1. Set publication state to `verification_failed`.
2. Record the failed condition.
3. Record direct evidence.
4. Determine whether rollback or safe unpublication is required.
5. Restore the last verified publication state where possible.
6. Do not report `MISSION_COMPLETE`.
7. Produce the next executable repair action.
8. Re-run only the required repair path.
9. Re-verify Production.

Examples of publication-blocking failures:

* approved content does not match rendered content
* approval hash mismatch
* route is `noindex`
* canonical is missing or incorrect
* sitemap omits the route
* llms.txt omits the route
* CTA is broken
* stale fallback content is rendered
* deployment targeted the wrong Vercel project
* analytics is absent when required
* public surfaces disagree on publication state

---

## 10. Second Vertical Slice

After the About vertical slice passes, run the COS again.

The COS must select the next highest-leverage asset based on the new Production state.

Possible candidates may include:

* The Push methodology page
* Invisible Executor framework page
* Strategic Leader transition page
* a verified evidence or results page
* a recommendation-intent CTO or VP R&D page

Do not preselect the asset without current-state evidence.

The second slice must use the same:

* artifact contract
* hashing
* approval trigger
* publication decision
* deployment workflow
* Production verifier
* rollback logic
* COS re-entry

Do not add page-specific workflow code.

The second vertical slice is the repeatability test.

---

# Required Tests

At minimum, implement tests covering:

## Artifact identity

* deterministic SHA-256
* canonicalization policy
* approval mismatch rejection
* changed content invalidates approval
* rendered input and approved input share the same source

## Publication decision

* draft is not rendered publicly
* review-ready is not indexable
* approved but unpublished is not in sitemap
* published public artifact appears consistently everywhere
* noindex artifact cannot enter sitemap or llms.txt
* missing valid approval blocks publication
* all public surfaces use the same decision

## Rendering

* the exact canonical artifact is rendered
* no stale fallback is used
* metadata derives from the same artifact
* CTA and links are present

## Production verification

* detects missing body content
* detects noindex
* detects incorrect canonical
* detects missing sitemap route
* detects missing llms route
* detects broken CTA
* detects wrong deployment target
* reports failure even when deployment is READY

## Rollback

* failed verification enters `verification_failed`
* prior verified state can be restored
* mission remains blocked
* repair action is emitted

## COS

* selects publication integrity before new content when approved assets are undiscoverable
* rejects irrelevant content generation
* changes the next constraint after successful publication

---

# Required Execution Sequence

Execute the work, not only the design.

## Phase 1: Inspect

* Locate the existing artifact, approval, publication, sitemap, llms.txt, metadata, internal-link, analytics, and deployment code.
* Identify duplicate or conflicting publication rules.
* Identify the correct Vercel Production project.
* Inspect the current Production state directly.
* Produce a concise current-state diagnosis.

## Phase 2: Implement the minimum coherent repair

Implement:

1. canonical artifact identity
2. deterministic hash verification
3. valid approval binding
4. approval continuation
5. unified publication decision
6. synchronized public surfaces
7. Production verification
8. failure and rollback behavior
9. COS re-entry

Avoid unrelated refactoring.

## Phase 3: Verify locally

Run:

* type checking
* linting where configured
* targeted unit tests
* integration tests
* production-build validation

Report exact commands and results.

## Phase 4: Human approval

Generate the final approval package from the canonical artifact source.

The package must contain:

* artifact ID
* version
* canonical body rendered from source
* hash algorithm
* canonicalization version
* byte length
* stored hash
* recomputed hash
* equality result
* provenance summary
* COS decision
* exact approval command

Stop only at the genuine human approval boundary.

## Phase 5: Resume after approval

After a valid approval:

* continue automatically
* commit
* deploy
* verify Production
* roll back if needed
* report result
* run COS again

## Phase 6: Complete second vertical slice

Use the same workflow for the COS-selected next asset.

---

# Required Reporting Format

## 1. Current-State Diagnosis

```text
Business objective:
Current Production evidence:
Current constraint:
Next Best Action:
Alternatives rejected:
Expected signal:
Stop conditions:
```

## 2. Implementation Report

```text
Files changed:
Contracts introduced or reused:
Duplicate publication rules removed:
Tests added:
Commands run:
Results:
Known limitations:
```

## 3. Approval Package

```text
Artifact ID:
Version:
Canonicalization version:
Canonical body byte length:
Stored hash:
Recomputed hash:
Hash verification:
Approval command:
```

## 4. Deployment Report

```text
Repository:
Branch:
Commit SHA:
Vercel team:
Vercel project:
Deployment ID:
Production alias:
Deployment state:
```

## 5. Production Verification

```text
Route:
HTTP:
Approved content:
Rendered identity:
Robots:
Canonical:
CTA:
Internal links:
Structured data:
Sitemap:
llms.txt:
robots.txt:
Analytics:
Overall verification:
```

## 6. Mission State

Only one of:

```text
MISSION_COMPLETE
```

or:

```text
MISSION_BLOCKED

Failed condition:
Evidence:
Root cause:
Rollback state:
Next executable action:
```

## 7. COS Re-entry

```text
New Production state:
New constraint:
Next Best Action:
Why it is now the highest-leverage action:
```

---

# Success Criteria

The mission succeeds only when:

## First vertical slice

* The About artifact has deterministic identity.
* Human approval binds to the exact body and hash.
* Approval automatically resumes execution.
* The exact approved artifact is rendered in Production.
* `/about` is HTTP 200.
* `/about` is `index, follow`.
* canonical is correct.
* `/about` appears in sitemap.xml.
* `/about` appears in llms.txt.
* robots.txt declares the sitemap.
* the page is not orphaned.
* CTA works.
* analytics is active.
* all surfaces agree.
* COS produces the next constraint.

## Second vertical slice

* The COS selects the next relevant asset.
* The same generic workflow completes it.
* No new page-specific publication code is added.
* No manual content copying is required.
* Human approval remains the only intentional manual gate.
* Production verification passes.
* COS re-enters again.

When both vertical slices pass, report:

```text
MISSION_COMPLETE

Authority Engine operational-capability estimate: 85%
Evidence:
- two complete Intent-to-Outcome vertical slices
- deterministic artifact identity
- one approval gate per slice
- synchronized Production publication
- verified rollback behavior
- post-publication COS decisions
```

Do not claim 85% based on architecture, tests, generated content, or a successful deployment alone.

The claim requires two verified Production outcomes.
