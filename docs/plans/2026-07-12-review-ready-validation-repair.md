# Review-Ready Validation Repair Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Use `superpowers:test-driven-development` for every behavior change and `superpowers:verification-before-completion` before reporting completion.

**Goal:** Prevent structurally valid but thin or malformed content from being classified as `review_ready`, and prove the corrected positive path with exactly the existing Draft 05 asset.

**Architecture:** Keep the existing ProductionDirective, ContentDraftingAgent boundary, `contentDraftWorkflow`, and OperatingCycle. Split the current overloaded approval into deterministic, non-persisted validation stages: generation provenance, PageBrief completeness, rendered Markdown components, claim-level evidence, canonical/intent collision, and quality rubric. `review_ready` becomes an explicit transition that requires every stage to pass; no average quality score can compensate for a hard-gate failure.

**Tech Stack:** TypeScript 5, Vitest, existing PageBrief and ApprovedInsight contracts, existing ProductionDirective and content draft workflow. Do not add an Action Router, scheduler, orchestration framework, AgentRun, ContentJob, public URL, Payload migration, or autonomous publishing path.

---

## Guardrails

- Do not generate another authority asset while this repair is in progress.
- Use only `authority-draft-approved-insight-player-trap-05`, its existing PageBrief, its supporting Approved Insights, and `/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck` for the final positive-path proof.
- Do not create a new URL or PageBrief.
- Do not publish, deploy, commit, or push.
- Human approval remains mandatory before publication.
- Keep `decisions.md` append-only. Append a decision only if implementation selects a new material governance rule not already supported by `DEC-20260712-06`.
- Preserve unrelated changes in the dirty worktree.

## Required state semantics

```text
scaffold
  -> needs_generation

complete_draft + any failed hard gate
  -> needs_revision

complete_draft
  + verified generation provenance
  + PageBrief completeness passed
  + rendered components passed
  + claim-level evidence passed
  + canonical and intent validation passed
  + quality rubric passed
  -> review_ready

review_ready + explicit human decision
  -> human_approved

human_approved + authorized publication operation
  -> published
```

`review_ready` must never be inferred solely from `quality.approved`, schema validity, section presence, word count, or string containment.

## Failure codes required by this repair

Retain the existing PageBrief failure codes and add or refine these deterministic codes:

```ts
type ReviewReadinessFailureCode =
  | "generation_provenance_missing"
  | "meta_copy_detected"
  | "invalid_cta_link"
  | "missing_cta_context"
  | "invalid_internal_link"
  | "claim_without_valid_evidence"
  | "invalid_evidence_mapping"
  | "duplicate_content"
  | "insufficient_content_depth"
  | "primary_intent_unanswered"
  | "canonical_owner_invalid"
  | "duplicate_or_colliding_intent"
  | "forbidden_unsupported_claim";
```

The implementation may keep these codes in the existing compliance result rather than creating a new persisted contract.

### Task 1: Correct the Task 066 factual record

**Files:**
- Modify: `TASK_066_CANONICAL_BOTTLENECK_POSITIVE_PATH.md`
- Modify: `PLANS.md`
- Test: documentation/reference checks already used by the repository, if any

**Step 1: Update the factual classification**

Record the observed result as:

```text
maturity: complete_draft
saveStatus: needs_revision
review_ready: false
human approval request: premature
```

State explicitly that `buildPlayerTrapDraftContent()` generated the content and that no real `ContentDraftingAgent` invocation was proven.

**Step 2: Preserve the original false-positive evidence**

Do not delete the original content or validation output. Label it as the regression baseline and list the expected failure codes:

```text
meta_copy_detected
invalid_cta_link
invalid_internal_link
invalid_evidence_mapping
duplicate_content
insufficient_content_depth
```

**Step 3: Run documentation/reference checks**

Run the repository's existing documentation/reference check if present. Otherwise run:

```powershell
rg -n "Task 066|TASK_066|review_ready|Canonical Bottleneck Positive Path" PLANS.md TASK_*.md docs
git diff --check
```

Expected: Task 066 is not described as a verified positive path anywhere; `git diff --check` reports no whitespace errors.

### Task 2: Freeze the false-positive as a RED regression fixture

**Files:**
- Modify: `tests/unit/page-brief-compliance.test.ts`
- Modify: `tests/unit/content-draft-workflow.test.ts`
- Modify: `tests/unit/production-directive.test.ts`
- Reuse: `TASK_066_CANONICAL_BOTTLENECK_POSITIVE_PATH.md`

**Step 1: Add the exact Task 066 content as a test fixture**

Use the exact Markdown from Task 066, including:

```markdown
The page starts with diagnosis because...

- /pillars/tech-leadership-coaching
- /frameworks/invisible-executor

Book a fit call
/book-a-fit-call
```

Do not improve the fixture before testing it.

**Step 2: Write a failing compliance test**

```ts
it("rejects the exact Task 066 false positive", () => {
  const result = validatePageBriefCompliance(playerTrapPageBrief, task066Draft);

  expect(result.passed).toBe(false);
  expect(result.failureCodes).toEqual(
    expect.arrayContaining([
      "meta_copy_detected",
      "invalid_cta_link",
      "invalid_internal_link",
      "invalid_evidence_mapping",
      "duplicate_content",
      "insufficient_content_depth",
    ]),
  );
});
```

**Step 3: Prove RED**

Run:

```powershell
npm test -- tests/unit/page-brief-compliance.test.ts
```

Expected: FAIL because the current validator incorrectly passes the Task 066 draft or lacks the new failure codes.

**Step 4: Add workflow and directive regression tests**

Assert that the exact same draft cannot yield:

```ts
expect(result.contentMaturity).not.toBe("review_ready");
expect(result.saveStatus).toBe("needs_revision");
```

Run the tests and confirm they fail for the expected reason before modifying production code.

### Task 3: Validate Markdown links and CTA as reader-facing components

**Files:**
- Modify: `src/ai/governance/page-brief-compliance.ts`
- Test: `tests/unit/page-brief-compliance.test.ts`
- Modify `package.json` only if no direct existing Markdown parser can be imported safely

**Step 1: Write isolated RED tests**

Cover:

```ts
it("rejects raw internal URLs without anchor text", ...);
it("rejects a CTA label and href on separate lines", ...);
it("accepts [Book a fit call](/book-a-fit-call)", ...);
it("requires reader-facing context around the CTA", ...);
it("accepts contextual internal links with non-empty anchor text", ...);
```

Expected failures:

```text
invalid_internal_link
invalid_cta_link
missing_cta_context
```

**Step 2: Prove RED**

Run the single test file and confirm raw URLs still pass incorrectly.

**Step 3: Implement the smallest deterministic Markdown-link extractor**

Extract links as structured values:

```ts
interface MarkdownLink {
  label: string;
  href: string;
  surroundingText: string;
}
```

Validation rules:

- CTA passes only when one parsed link has the exact approved `label` and `href`.
- Required internal links pass only when each destination is represented by a parsed link with meaningful anchor text.
- The anchor must not equal the raw href.
- CTA context must include a reader-facing sentence explaining who the conversation is for or what decision it supports.
- A URL in plain text, code, metadata, or an Evidence list does not count.

Prefer an already direct project dependency. Do not rely on a transitive-only package without adding it explicitly. If a small deterministic parser is sufficient for the supported Markdown subset, keep it local and cover escaped brackets/parentheses with tests.

**Step 4: Prove GREEN**

Run:

```powershell
npm test -- tests/unit/page-brief-compliance.test.ts
```

Expected: component tests pass; the Task 066 fixture still fails for all remaining reasons.

### Task 4: Strengthen meta-copy, section substance, and duplication gates

**Files:**
- Modify: `src/ai/governance/page-brief-compliance.ts`
- Test: `tests/unit/page-brief-compliance.test.ts`

**Step 1: Write RED tests for meta-copy**

Reject reader-visible editorial narration including:

```text
The page starts...
This page explains...
This section covers...
This draft...
The content should...
```

Do not reject legitimate references to a web page in evidence or navigation metadata; scope detection to reader-facing prose.

**Step 2: Write RED tests for duplicate content**

Use the Task 066 `What this pattern looks like` paragraph and `Specific symptoms` bullets. Assert `duplicate_content` when two sections repeat the same normalized propositions without adding explanation, example, consequence, or action.

**Step 3: Write RED tests for depth**

Assert `insufficient_content_depth` when:

- required sections merely restate headings or the primary claim;
- most of the word count consists of headings, bullets, CTA, evidence metadata, or citation snippets;
- the persistence explanation lacks causal reasoning;
- the practical next step lacks an executable action.

Do not use one global word-count threshold as the sole rule. Measure reader-facing prose per PageBrief purpose and exclude non-body metadata.

**Step 4: Implement minimal deterministic checks**

Add helpers that operate on extracted section bodies:

```ts
containsReaderVisibleMetaCopy(sectionBody)
sectionImplementsPurpose(sectionBody, contentPlanItem)
findDuplicateSectionPairs(sectionBodies)
measureReaderFacingDepth(pageBrief, sectionBodies)
```

The purpose check may use required concepts supplied by the PageBrief and Approved Insight claims; it must not make an open-ended model call.

**Step 5: Prove GREEN**

Run the compliance tests. Expected: Task 066 fails for meta-copy, duplication, and depth; a deliberately complete fixture passes these checks.

### Task 5: Require claim-level evidence instead of an Evidence heading

**Files:**
- Modify: `src/ai/governance/page-brief-compliance.ts`
- Modify: `src/ai/workflows/contentDraftWorkflow.ts`
- Modify: `src/ai/workflows/production-directive.ts`
- Test: `tests/unit/page-brief-compliance.test.ts`
- Test: `tests/unit/content-draft-workflow.test.ts`

**Step 1: Define a non-persisted validation input**

Extend the existing draft validation input rather than creating a new workflow record:

```ts
interface ClaimEvidenceMapping {
  claim: string;
  evidenceType:
    | "first_party_framework_source"
    | "approved_insight"
    | "external_evidence"
    | "experience_based_claim";
  sourceReference: string;
  approvedInsightIds: string[];
  valid: boolean;
  limitation?: string;
}
```

**Step 2: Write RED tests**

Reject:

- a heading named `Evidence` with no mapping;
- the claim repeated as its own evidence;
- a generic repository URL unrelated to the claim;
- a missing Approved Insight ID for an insight-backed claim;
- an invalid or superseded time-sensitive source.

Accept a material claim only when the mapping identifies its evidence type, actual source, supporting Approved Insight where applicable, and validity.

**Step 3: Prove RED**

Run the compliance and workflow tests. Expected: current `evidenceUrls` behavior passes cases that must now fail.

**Step 4: Implement claim-level validation**

For every material claim from `pageBrief.proofNeeded` and the draft's declared claim set:

- require exactly one or more valid mappings;
- verify the source reference is present in approved input;
- verify the referenced Approved Insight supports the claim;
- apply claim-level freshness only when the evidence class is time-sensitive;
- return `claim_without_valid_evidence` or `invalid_evidence_mapping` explicitly.

Remove the global default `requiredFreshnessDays = 30` from the ProductionDirective drafting path. Stable approved framework principles must not fail solely because 30 days elapsed.

**Step 5: Prove GREEN**

Run the focused tests. Expected: an Evidence heading alone never passes; valid claim mappings do.

### Task 6: Replace metadata approval with an explanatory quality rubric

**Files:**
- Modify: `src/ai/governance/content-quality-gate.ts`
- Test: `tests/unit/content-quality-gate.test.ts`
- Test: `tests/unit/content-draft-workflow.test.ts`

**Step 1: Write RED tests for required dimensions**

Require results for:

```ts
type ContentQualityDimension =
  | "clarity"
  | "depth"
  | "usefulness"
  | "differentiation"
  | "repetition"
  | "audience_fit"
  | "persuasion"
  | "authority_strength";
```

Each result must include `score`, `passed`, and a non-circular reason tied to observed content.

**Step 2: Reject circular reasons**

Add a regression assertion that the result never contains:

```text
Content satisfies the current quality gate.
```

**Step 3: Preserve hard-gate precedence**

Assert that `evaluateContentQuality()` is not called when compliance, component, evidence, or canonical/intent validation fails.

**Step 4: Implement the deterministic rubric**

Use explicit signals already available in the PageBrief, extracted sections, evidence map, target audience, and existing canonical content. Return observed reasons such as:

```text
depth: failed — the operating-model shift is named but no causal explanation or worked next step is present
repetition: failed — Specific symptoms repeats three propositions from What this pattern looks like
```

Approval requires every mandatory dimension to meet its threshold. Do not approve by average score.

**Step 5: Prove GREEN**

Run:

```powershell
npm test -- tests/unit/content-quality-gate.test.ts tests/unit/content-draft-workflow.test.ts
```

Expected: thin content receives explicit failed dimensions and `needs_revision`; a complete fixture receives explicit passed dimensions.

### Task 7: Make generation provenance truthful

**Files:**
- Modify: `src/ai/workflows/production-directive.ts`
- Modify: `src/ai/workflows/contentDraftWorkflow.ts`
- Inspect and reuse: existing `ContentDraftingAgent` implementation and contracts under `src/ai/agents/`
- Test: `tests/unit/production-directive.test.ts`
- Test: `tests/unit/content-draft-workflow.test.ts`

**Step 1: Write RED tests**

Assert:

- output from `buildPlayerTrapDraftContent()` cannot claim agent generation provenance;
- a missing or skipped ContentDraftingAgent invocation returns `generation_provenance_missing` and cannot become `review_ready`;
- an actual bounded ContentDraftingAgent result records the real semantic agent name and input/output IDs;
- no fictitious `ContentWriterAgent` run is recorded.

**Step 2: Prove RED**

Run the directive and workflow tests. Expected: current hard-coded template path incorrectly passes.

**Step 3: Reuse the existing semantic-agent boundary**

At the existing factory boundary:

- pass the existing PageBrief, selected Approved Insights, KnowledgeAsset, canonical ownership, CTA, required internal links, and claim evidence mappings to `ContentDraftingAgent`;
- receive one bounded draft result;
- do not add an orchestration layer or runtime agent;
- do not claim the agent ran when using deterministic fallback/template output;
- retain deterministic validation after generation.

If provider configuration is unavailable, stop with `needs_generation` and an explicit blocker. Do not fabricate semantic-agent output or manually relabel a template.

**Step 4: Remove the false positive generator path**

Delete or demote `buildPlayerTrapDraftContent()` so it can produce only a scaffold/test fixture, never a `complete_draft` eligible for `review_ready`.

**Step 5: Prove GREEN**

Run focused tests. Expected: provenance is accurate, templates cannot advance, and no autonomous publication path exists.

### Task 8: Centralize the `review_ready` transition

**Files:**
- Modify: `src/ai/workflows/contentDraftWorkflow.ts`
- Modify: `src/ai/governance/page-brief-compliance.ts`
- Test: `tests/unit/content-draft-workflow.test.ts`

**Step 1: Write a RED transition matrix test**

Test every required gate independently:

| Generation | Compliance | Components | Evidence | Canonical/intent | Quality | Expected |
|---|---|---|---|---|---|---|
| fail | pass | pass | pass | pass | pass | `needs_generation` |
| pass | fail | pass | pass | pass | pass | `needs_revision` |
| pass | pass | fail | pass | pass | pass | `needs_revision` |
| pass | pass | pass | fail | pass | pass | `needs_revision` |
| pass | pass | pass | pass | fail | pass | `needs_revision` |
| pass | pass | pass | pass | pass | fail | `needs_revision` |
| pass | pass | pass | pass | pass | pass | `review_ready` |

**Step 2: Prove RED**

Expected: the current shortcut `quality.approved ? "review_ready" : "needs_revision"` fails the matrix.

**Step 3: Implement one explicit transition decision**

Replace the shortcut with a single deterministic decision derived from all gate results. Reporting, maturity, and save status must all use this same decision.

**Step 4: Protect the human boundary**

Assert that the transition can produce at most `review_ready`. It must never produce `human_approved` or `published`.

**Step 5: Prove GREEN**

Run the workflow tests. Expected: the full matrix passes and no hard gate can be compensated by quality scoring.

### Task 9: Re-run exactly one positive path

**Files:**
- Modify only if generated output is persisted locally: existing Draft 05 record/report
- Modify: `TASK_066_CANONICAL_BOTTLENECK_POSITIVE_PATH.md`
- Modify: `PLANS.md`
- Test: focused and full relevant suites

**Step 1: Verify prerequisites**

Confirm:

- asset ID is `authority-draft-approved-insight-player-trap-05`;
- the existing PageBrief is reused;
- supporting Approved Insight IDs are explicit;
- canonical path remains `/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck`;
- no new PageBrief, URL, or batch is created;
- ContentDraftingAgent provider/configuration is available without inventing credentials.

If the semantic agent cannot run, record `needs_generation` with the exact blocker and stop. Do not hand-write a passing fixture and call it generated.

**Step 2: Run one bounded ProductionDirective**

Produce at most one draft. The draft must contain:

- complete reader-facing prose;
- direct diagnosis and concrete symptoms without duplicate sections;
- causal reasoning for why dependency persists;
- Player Trap definition;
- operating-model shift;
- practical next step;
- contextual Markdown internal links;
- contextual Markdown CTA;
- claim-level evidence mappings;
- no meta-copy or unsupported outcomes.

**Step 3: Run all gates in order**

Record separately:

```text
generation provenance
PageBrief compliance
rendered components
claim-level evidence
canonical and intent collision
quality rubric
final transition decision
```

If any gate fails, return its exact failure codes, persist `needs_revision` or `needs_generation`, and stop.

**Step 4: Request human review only after success**

Expected successful state:

```text
maturity: review_ready
publication status: non-public
human publication approval: required
```

Do not deploy or publish.

### Task 10: Verification and documentation closure

**Files:**
- Modify: `PLANS.md`
- Modify: `TASK_066_CANONICAL_BOTTLENECK_POSITIVE_PATH.md`
- Append to `decisions.md` only if a genuinely new material decision was selected

**Step 1: Run focused tests**

```powershell
npm test -- tests/unit/page-brief-compliance.test.ts tests/unit/content-quality-gate.test.ts tests/unit/content-draft-workflow.test.ts tests/unit/production-directive.test.ts
```

Expected: all focused tests pass, including the exact Task 066 regression and the transition matrix.

**Step 2: Run the complete relevant suite**

```powershell
npm test
npm run typecheck
git diff --check
```

Expected: all tests pass, typecheck passes, and there are no whitespace errors. Existing CRLF warnings may be reported but must not be hidden.

**Step 3: Review the diff for scope**

```powershell
git diff -- src/ai/governance/page-brief-compliance.ts src/ai/governance/content-quality-gate.ts src/ai/workflows/contentDraftWorkflow.ts src/ai/workflows/production-directive.ts tests/unit/page-brief-compliance.test.ts tests/unit/content-quality-gate.test.ts tests/unit/content-draft-workflow.test.ts tests/unit/production-directive.test.ts TASK_066_CANONICAL_BOTTLENECK_POSITIVE_PATH.md PLANS.md decisions.md
```

Expected: no router, scheduler, workflow framework, publication action, new authority asset, new URL, or unrelated edit.

**Step 4: Record closure**

Update `PLANS.md` with:

- exact tests and counts;
- Task 066 final factual state;
- exact failure codes or successful gate results;
- provider/configuration blockers, if any;
- confirmation that deployment/publication remain pending human authorization.

## Definition of Done

This repair is done only when all statements below are true:

- The original Task 066 content is rejected automatically.
- `The page starts with diagnosis because...` produces `meta_copy_detected`.
- Raw URLs do not pass as internal links.
- A CTA label and href on separate lines do not pass as a CTA.
- An Evidence heading or repeated claim does not count as evidence.
- Every material claim maps to a valid evidence type and source.
- Duplicate symptom sections are detected.
- A thin draft cannot become `review_ready` through metadata or average scoring.
- Quality output includes explicit results for clarity, depth, usefulness, differentiation, repetition, audience fit, persuasion, and authority strength.
- ContentDraftingAgent provenance is truthful and required.
- The 30-day global freshness shortcut does not block stable approved knowledge in this path.
- Exactly one existing asset proves the positive path, or stops honestly with exact failure codes.
- The successful terminal state remains non-public and requires human publication approval.
- No deployment, publication, commit, or push occurs.

## Stop conditions

Stop immediately and report the blocker when:

- ContentDraftingAgent provider/configuration is unavailable;
- evidence cannot support a material claim;
- canonical ownership is ambiguous;
- the existing PageBrief cannot support a complete, differentiated draft;
- a change would require a new persisted contract, Payload migration, agent/orchestration layer, URL, publication action, or governance decision not yet approved;
- any hard gate fails during the one-asset positive path.
