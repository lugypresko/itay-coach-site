# Authority Engine Decision Log

This file is the project’s single append-only decision record. New decisions are appended; existing entries are never rewritten or deleted. TASK and PLANS files remain implementation and execution records and do not replace this log.

## 2026-07-12 — Established Authority Engine operating decisions (backfilled)

### Customer creation is the North Star

- Decision: Optimize the Authority Engine toward qualified customer conversations and paying clients, not traffic volume alone.
- Context: `AGENTS.md`; `TASK_059_CHIEF_OF_STAFF_DECISION.md`.

### Payload is the source of truth

- Decision: Payload publication/content state is authoritative for public-surface decisions.
- Context: `DATA_CONTRACTS.md`; `TASK_047_CHIEF_OF_STAFF_RECOMMENDATION.md`.

### Human approval gates publication

- Decision: Human approval remains mandatory before publication; no autonomous publishing is allowed.
- Context: `AGENTS.md`; `TASK_058_CHIEF_OF_STAFF_DECISION.md`; `TASK_059_CHIEF_OF_STAFF_DECISION.md`.

### Semantic-agent boundary

- Decision: Keep only InsightExtractionAgent, ResearchSynthesisAgent, and ContentDraftingAgent as semantic agents.
- Context: `TASK_047_CHIEF_OF_STAFF_RECOMMENDATION.md`; `TASK_058_CHIEF_OF_STAFF_DECISION.md`.

### Deterministic control plane

- Decision: Validation, transformation, scoring, routing, publication-state mapping, and state transitions are deterministic code responsibilities.
- Context: `TASK_047_CHIEF_OF_STAFF_RECOMMENDATION.md`; `TASK_059_OPERATING_CYCLE.md`; `docs/notes/2026-07-12-publication-state-and-operating-loop.md`.

### No open-ended orchestration or swarm

- Decision: Do not introduce open-ended runtime orchestration, swarm behavior, or an unbounded process.
- Context: `TASK_047_CHIEF_OF_STAFF_RECOMMENDATION.md`; `TASK_059_OPERATING_CYCLE.md`.

### Shared publication decision

- Decision: Publication state is derived through one shared deterministic `PublicationDecision` used by route metadata, sitemap, and `llms.txt`.
- Context: `TASK_059_LOCAL_POST_REPAIR_VERIFICATION.md`; `TASK_059_OPERATING_CYCLE.md`.

### Minimal persisted operating cycle

- Decision: Persist one minimal `OperatingCycle` record containing the snapshot, bottleneck, one Next Best Action, approval gate, and measurement-window state.
- Context: `TASK_059_OPERATING_CYCLE.md`; `docs/notes/2026-07-12-publication-state-and-operating-loop.md`.

### Measurement sources and AI visibility status

- Decision: Use Vercel Analytics and Google Search Console as the selected measurement sources; represent AI recommendation visibility explicitly as `unmeasured`.
- Context: `TASK_058_PRODUCTION_OBSERVATION.md`; `TASK_059_CHIEF_OF_STAFF_DECISION.md`.

### Content-factory quality objective

- Decision: Maximize differentiated, evidence-backed, indexable authority content rather than raw draft volume.
- Context: `AGENTS.md`; `TASK_047_CHIEF_OF_STAFF_RECOMMENDATION.md`.

### Single decision record

- Decision: `decisions.md` is the project’s single append-only decision record.
- Context: This entry establishes the repository rule requested on 2026-07-12; implementation records remain in TASK and PLANS files.

## DEC-20260712-01 — Customer creation is the North Star

- Date: `2026-07-12`
- Status: `approved`
- Scope: Authority Engine strategy, prioritization, measurement, and operating-loop decisions.
- Decision: The North Star is Qualified Customer Conversations → Paying Clients. Google discovery and AI recommendation visibility are intermediate discovery objectives that support this outcome.
- Context: `AGENTS.md`; `TASK_059_CHIEF_OF_STAFF_DECISION.md`; `docs/cos/CHIEF_OF_STAFF_OPERATING_MODEL.md`.
- Rationale: Authority and visibility are valuable when they create qualified conversations and customers; they are not the final business outcome.
- Rejected alternatives: Treating traffic, indexing, or AI recommendation visibility as the sole North Star.
- Consequences: Prioritization must connect discovery work to qualified customer impact while preserving discovery instrumentation as an intermediate signal.
- Supersedes: The earlier shorthand statement “Success is AI recommendation visibility, not traffic volume” as the primary success definition.

## DEC-20260712-02 — Approved Insights do not expire globally after 30 days

- Date: `2026-07-12`
- Status: `approved`
- Scope: Approved Insight freshness, claim validation, research, drafting, and publication readiness.
- Decision: Approved Insights do not expire globally after 30 days. Freshness is evaluated at claim level and is evidence-sensitive; stable principles may remain active, while time-sensitive claims require currently valid supporting evidence.
- Context: `TASK_059_CHIEF_OF_STAFF_DECISION.md`; `TASK_059_OPERATING_CYCLE.md`; `docs/notes/2026-07-12-publication-state-and-operating-loop.md`; `DATA_CONTRACTS.md`.
- Rationale: A universal age threshold would incorrectly invalidate durable leadership principles and would not distinguish stable claims from time-sensitive evidence.
- Rejected alternatives: Blocking all drafting whenever the latest Approved Insight is older than 30 days; treating every insight as permanently fresh.
- Consequences: Validators must retain approvedAt, lastValidatedAt, freshness class, and validUntil where applicable, and block only unsupported time-sensitive claims.
- Supersedes: The global 30-day Approved Insight freshness gate described in earlier implementation notes and tests.

## DEC-20260712-03 — Authority throughput is measured at publication and discovery, not draft volume

- Date: `2026-07-12`
- Status: `approved`
- Scope: Content-factory throughput, operating-loop prioritization, measurement, and Chief of Staff decisions.
- Decision: Authority throughput is measured at publication and discovery: indexable published assets, discovery-surface integrity, qualified discovery signals, and customer-path outcomes. Raw draft volume is not a success metric.
- Context: `AGENTS.md`; `TASK_047_CHIEF_OF_STAFF_RECOMMENDATION.md`; `TASK_058_PRODUCTION_OBSERVATION.md`; `TASK_059_CHIEF_OF_STAFF_DECISION.md`.
- Rationale: Draft accumulation does not create discoverable authority or customer conversations unless assets are reviewed, published, indexable, and measured.
- Rejected alternatives: Maximizing the number of drafts or converting every Approved Insight into a separate page.
- Consequences: The factory must prioritize repairing published assets, resolving relevant drafts, recomposing existing KnowledgeAssets, and publishing differentiated evidence-backed surfaces under human approval.
- Supersedes: Any backlog or throughput interpretation that treats draft count as the primary output.

## DEC-20260712-04 — Bounded ProductionDirective continuation at the existing factory boundary

- Date: `2026-07-12`
- Status: `approved`
- Scope: Authority Content Factory continuation, Chief of Staff execution, KnowledgeAsset conversion, PageBrief drafting, and OperatingCycle state.
- Decision: Use one bounded deterministic `ProductionDirective` executor at the existing factory boundary. It selects one prioritized cluster, consumes eligible unconverted Approved Insights up to target/WIP limits, creates KnowledgeAssets and PageBrief-backed drafts, records execution state on `OperatingCycle`, and stops before publication.
- Context: `TASK_060_AUTHORITY_FACTORY_ROOT_CAUSE_REPORT.md`; `TASK_033_CONVERSION_REPORT.md`; `TASK_035` section in `PLANS.md`; `TASK_059_OPERATING_CYCLE.md`; `docs/cos/CHIEF_OF_STAFF_DECISION_LOOP.md`.
- Rationale: The repository has reusable conversion, drafting, evidence, linking, and cycle components but no executable continuation mapping. A bounded executor closes that gap without adding a router, scheduler, orchestration framework, AgentRun, or ContentJob.
- Rejected alternatives: Add an Action Router; add a swarm or open-ended runtime loop; require per-draft human approval; publish automatically; create one page per Approved Insight without grouping and uniqueness checks.
- Consequences: Manual/directive runs can continue non-public production while respecting claim-level evidence, canonical ownership, unique intent, WIP, expiry, and stop conditions. Human approval remains mandatory before publication, and unresolved publication integrity blocks publication only.
- Supersedes: The prior finite one-time seed/sprint-only continuation model established by Tasks 033, 035, and 037.

## DEC-20260712-05 â€” Draft 05 merges into the canonical bottleneck cluster surface

- Date: `2026-07-12`
- Status: `approved`
- Scope: Canonical ownership, Player Trap cluster content, and non-public authority surface consolidation.
- Decision: Merge the Player Trap Draft 05 insight into `/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck` rather than creating a new public cluster page.
- Context: `TASK_062_PLAYER_TRAP_DRAFT_PUBLISH_READINESS_REVIEW.md`; `src/seed/review-ready-public-surface-batch.ts`; `docs/seed-content/coach-for-engineering-managers-stuck-as-the-bottleneck.md`; `src/lib/public-authority-routes.ts`.
- Rationale: The existing cluster surface already owns the recommendation intent; absorbing the draft as diagnosis-first copy preserves canonical ownership, reduces overlap, and avoids creating another near-duplicate route.
- Rejected alternatives: Publishing Draft 05 as a standalone URL; creating a second Player Trap cluster page; leaving the scaffold separate while the canonical surface remains underdeveloped.
- Consequences: The canonical bottleneck cluster page should carry the diagnosis-first Player Trap framing and CTA guidance; future Player Trap production should route to the same canonical surface unless a materially different intent is proven.
- Supersedes: The implicit standalone Draft 05 URL produced by the bounded Player Trap ProductionDirective.

## DEC-20260712-06 â€” PageBrief compliance hard gate before content scoring

- Date: `2026-07-12`
- Status: `approved`
- Scope: Content maturity, draft validation, and review-readiness classification.
- Decision: Treat scaffold, complete draft, review-ready, and human-approved as distinct content maturities, and require deterministic PageBrief compliance before any content-quality score may run.
- Context: `TASK_065` in `PLANS.md`; `TASK_061_MANUAL_PRODUCTION_DIRECTIVE_RUN.md`; `src/ai/workflows/contentDraftWorkflow.ts`; `src/ai/governance/page-brief-compliance.ts`.
- Rationale: A schema-valid scaffold can still be incomplete, meta, or non-reader-facing; the review gate must fail fast on missing sections, CTA, links, evidence coverage, and intent answer quality before scoring can succeed.
- Rejected alternatives: Keep a single `draft` status; let quality scoring compensate for missing sections or CTA; infer review-readiness only from schema validity.
- Consequences: The workflow must return explicit failure codes and classify incomplete content as scaffold, needs_generation, needs_revision, or blocked, while reserving review_ready for content that has passed hard gates and quality scoring.
- Supersedes: Any interpretation that treats `draft` as a sufficient proxy for completeness or review readiness.

## DEC-20260712-07 — Review readiness separates objective hard gates from semantic quality judgment

- Date: `2026-07-12`
- Status: `approved`
- Scope: Draft validation, semantic content evaluation, evidence mapping, canonical ownership, and `review_ready` transitions.
- Decision: Deterministic hard gates are limited to objectively verifiable rules such as known reader-visible meta-copy, renderable Markdown links and CTA, reader-facing CTA context, structured claim-evidence mappings, canonical ownership, and known intent collisions. Depth, usefulness, differentiation, audience fit, persuasion, authority strength, and comparable qualitative judgments are evaluated semantically and must return a score, pass/fail decision, draft-grounded reason, and revision recommendation when failed. `review_ready` requires both layers to pass and never removes the pending human publication approval.
- Context: `TASK_066_CANONICAL_BOTTLENECK_POSITIVE_PATH.md`; `docs/plans/2026-07-12-review-ready-validation-repair.md`; Task 068 in `PLANS.md`; `src/ai/governance/page-brief-compliance.ts`; `src/ai/governance/content-quality-gate.ts`.
- Rationale: Task 066 proved that structural presence checks and circular quality messages can create a false positive. Objective rules are reliable hard gates, while qualitative editorial judgment requires an explicit semantic evaluation rather than brittle deterministic heuristics.
- Rejected alternatives: Implement a broad heuristic content-quality engine; allow metadata or average scoring to compensate for malformed links, CTA, evidence, or canonical ownership; treat an Evidence heading or repeated claim as proof; retain a generic success reason.
- Consequences: The exact rejected Task 066 draft remains a regression baseline. Drafts without a complete semantic evaluation cannot become `review_ready`; failed dimensions must explain the problem and recommended revision. Human approval remains mandatory before publication.
- Supersedes: The broad deterministic-quality scope proposed in the original Task 067 plan and any interpretation of `DEC-20260712-06` that assigns subjective editorial judgment to deterministic code.

## DEC-20260713-01 — Publication approval facts are persisted; publication surfaces are derived

- Date: `2026-07-13`
- Status: `approved`
- Scope: Payload authority collections, Problem Pages, publication approval, canonical ownership, page metadata, sitemap, `llms.txt`, and publication-integrity validation.
- Decision: Persist the minimum governance-critical source facts in Payload: lifecycle status, publication timestamp, canonical URL, and a revision-bound human-approval envelope. Derive indexability, sitemap eligibility, `llms.txt` eligibility, canonical output, and schema eligibility through the existing deterministic `PublicationDecision`. Page loaders, sitemap, and `llms.txt` must use the same per-record publication projection builders. Governed production assets fail closed when Payload is unavailable; repository fallback content is local/test evidence only.
- Context: `TASK_070` in `PLANS.md`; `TASK_071_SHARED_PUBLICATION_PROJECTION_REPAIR.md`; `docs/plans/2026-07-13-shared-publication-projection-repair.md`; `TASK_069_DRAFT_05_HUMAN_APPROVAL_AND_DEPLOYMENT_PACKAGE.md`.
- Rationale: Task 070 proved that live Payload rendering, a static sitemap registry, and hard-coded/catalog-derived `llms.txt` routes could disagree. Persisting derived surface flags would create more mutable copies. A revision-bound approval envelope plus one deterministic projection preserves human approval and canonical ownership while preventing surface drift.
- Rejected alternatives: Continue using static registries as production publication truth; infer human approval from `status=published`; persist independently mutable index/sitemap/`llms.txt` booleans; allow production static fallback; introduce a router, orchestration framework, or new persisted execution contract.
- Consequences: Publishing and approval-bound edits require a matching human-approved content hash, canonical origin/path, supporting Approved Insights, passed validation, and explicit deployment/publication scope. Agent users cannot publish or mutate approval-bound fields on published records. The additive Payload migration must be reviewed and run by an authorized human deployment; until then production behavior is unchanged.
- Supersedes: Any implementation interpretation of the shared publication decision that allows separate production read models or treats `published` status alone as proof of human approval.

## DEC-20260713-02 — Discovery requires verified indexing and relevant impressions

- Date: `2026-07-13`
- Status: `approved`
- Scope: Authority Engine Definition of Done, publication verification, Google Search Console observation, measurement windows, and discovery milestones.
- Decision: An authority asset is considered discovered only when the same canonical URL returns HTTP 200, emits `index, follow`, has a valid canonical, appears in sitemap and `llms.txt`, is recognized by Google Search Console, progresses from discovered/crawled to indexed, and receives impressions for relevant queries. The primary milestone is: one correctly published canonical authority asset indexed and receiving relevant impressions.
- Context: User-defined Definition of Done on `2026-07-13`; `TASK_071_SHARED_PUBLICATION_PROJECTION_REPAIR.md`; `TASK_070` in `PLANS.md`; `TASK_058_PRODUCTION_OBSERVATION.md`.
- Rationale: Local correctness and production publication integrity establish eligibility for discovery, but they do not prove that Google indexed the asset or that relevant demand surfaces it. Relevant impressions are the first observable evidence that the authority asset participates in discovery.
- Rejected alternatives: Declare discovery after deployment; declare discovery from HTTP/indexability alone; treat sitemap or `llms.txt` inclusion as indexing proof; treat irrelevant impressions, traffic volume, or clicks as the initial milestone.
- Consequences: Local Task 071 completion cannot satisfy the project Definition of Done. After an authorized deployment and publication, the measurement window remains open until GSC recognizes and indexes the canonical URL and relevant impressions are observed, or a dated wait/block decision is recorded. Evidence must identify the URL, query relevance, observation timestamp, environment, source freshness, confidence, and limitations.
- Supersedes: Any earlier shorthand that equates a correctly deployed/indexable production page with achieved discovery.

## DEC-20260713-03 — Public frontend receives reader-facing content only

- Date: `2026-07-13`
- Status: `approved`
- Scope: Public authority-page rendering, Problem Page rendering, CMS records, review metadata, evidence sources, approval state, and audit data.
- Decision: Public page components receive an explicit reader-facing projection only. Lifecycle status, review timestamps, human-approval envelopes, publication decisions, internal evidence paths, confidence and approval labels, editorial rationale, system FAQ prompts, and other operational metadata remain in Payload, admin, validation, or audit layers and are not passed to public page components.
- Context: User governance correction on `2026-07-13`; Task 072 in `PLANS.md`; `src/lib/reader-facing-publication.ts`; `tests/unit/reader-facing-publication-boundary.test.ts`.
- Rationale: Task 071 unified publication eligibility but the renderer still consumed the complete CMS model, causing valid reader-facing prose to appear inside an Authority Engine debug view and exposing internal governance metadata publicly.
- Rejected alternatives: Hide individual debug labels with CSS; maintain a denylist only in JSX; rewrite the article while keeping the full CMS model at the frontend boundary; delete governance metadata from Payload.
- Consequences: Public renderers use narrow DTOs and fail closed for system FAQ schema. CMS and audit data remain available internally. Reader-facing copy can evolve independently, but no operational field may re-enter the public renderer without an explicit public contract and regression coverage.
- Supersedes: The prior rendering pattern in which `PublicContentPage` and `ProblemPage` accepted complete normalized CMS/publication models.

## DEC-20260713-04 — One immutable reader-facing artifact owns publication identity

- Date: `2026-07-13`
- Status: `approved`
- Scope: PageBrief output, public content generation, deterministic validation, internal-language validation, semantic review, human approval, hashing, Payload publication records, rendering, metadata, structured data, sitemap, and `llms.txt`.
- Decision: Introduce a versioned `ReaderFacingPageArtifact` containing only an explicit allowlist of public fields. Canonical serialization produces an immutable artifact hash from those public fields only. Deterministic validation, internal-language validation, semantic review, and human approval must each reference the exact artifact hash. A public route exists only when an approved artifact, matching human approval, matching publication record, and `PublicationDecision=published` agree on artifact ID, version, and hash. All public surfaces derive from that same artifact.
- Context: User-approved Authority Engine publication-boundary design on `2026-07-13`; Task 073 in `PLANS.md`; `DEC-20260713-01`; `DEC-20260713-03`.
- Rationale: Removing operational metadata at render time prevents leakage but does not prove that the rendered page is the object a human reviewed. Publication identity must belong to one immutable public artifact shared by review, approval, hashing, publication, and rendering.
- Rejected alternatives: Bind approval to a broad CMS record; construct the public object only during frontend rendering; use an adapter between workflow output and a late DTO; transfer legacy approval automatically; leave drafts accessible with `noindex` as the default production behavior.
- Consequences: Draft/review artifacts return 404 on production routes unless exposed through a separate authenticated or local preview. Legacy records retain history but have no public existence until a new artifact passes review and approval. Any public-field change creates a new artifact version/hash and invalidates prior validation, semantic review, approval, and publication linkage. Draft 05 replacement returns to human review and remains non-public.
- Supersedes: Any interpretation of `DEC-20260713-03` in which a late frontend DTO is sufficient to establish approval or publication identity.

## DEC-20260720-01 - Campaign acquisition remains separate from canonical authority

- Date: `2026-07-20`
- Status: `implementation`
- Scope: Campaign landing pages, sponsor/individual conversion paths, attribution, and measurement.
- Decision: Keep campaign pages under `/campaigns/*` as `noindex` acquisition surfaces outside primary navigation. Preserve `/technical-leadership-coaching` and `/for-organizations` as canonical authority destinations.
- Context: `docs/plans/2026-07-20-campaign-message-market-fit.md`; `docs/measurement/campaign-message-market-fit.md`; `src/lib/campaign-pages.ts`.
- Rationale: Campaign concepts serve different entry contexts and should be measured for qualified conversations without competing with canonical SEO ownership.
- Consequences: Campaign performance is evaluated by qualified conversations and persona, not clicks alone. Human review remains required before traffic, publication, or deployment.

## DEC-20260720-02 - Initial qualification delivery uses the existing email boundary

- Date: `2026-07-20`
- Status: `implementation`
- Scope: Sponsor and individual fit-call qualification.
- Decision: Use a shared deterministic qualification contract and the existing Resend integration for the initial lead handoff; do not add a new Payload collection or CRM migration in this campaign batch.
- Context: `docs/plans/2026-07-20-campaign-message-market-fit.md`; `src/lib/lead-qualification.ts`; `src/app/api/fit-call/lead/route.ts`.
- Rationale: The current repository has no established fit-call lead collection. Email handoff keeps the implementation bounded while preserving persona, intent, timing, challenge, and attribution fields for manual qualification.
- Consequences: CRM persistence, booked/attended call reconciliation, retention policy, and production recipient configuration remain explicit follow-up work and human review items.

## DEC-20260720-03 - Proof language is evidence-gated

- Date: `2026-07-20`
- Status: `implementation`
- Scope: Campaign pages, canonical authority pages, testimonials, case studies, company relationships, quantified outcomes, and framework claims.
- Decision: Public copy may use source-backed facts, approved framework definitions, clearly labeled professional observations, and modal professional theses. Testimonials, case studies, quantified outcomes, stronger company relationship wording, and scientific-validation language remain blocked until claim-level evidence and human approval exist.
- Context: `docs/evidence/campaign-claim-ledger.md`; `docs/evidence/authority-evidence-registry.md`; `docs/plans/2026-07-20-campaign-message-market-fit.md`; `AGENTS.md`.
- Rationale: Visual polish and framework language establish positioning but do not prove outcomes. Unsupported metrics and implied client proof would weaken trust and violate the repository evidence gate.
- Consequences: The public campaign copy gate rejects `73%`, `41%`, `2.5x`, `tested in production`, and unqualified `clients include` language. Missing proof is recorded as an evidence gap rather than filled with invented claims.

## DEC-20260721-01 - FAQ is indexable and LLM-readable as a canonical discovery surface

- Date: `2026-07-21`
- Status: `approved`
- Scope: Public FAQ metadata, `llms.txt` discovery inventory, and FAQ-specific search/LLM visibility.
- Decision: The public `/faq` page should emit `index, follow` metadata and appear in the LLM-readable route inventory. Other governed authority-launch pages retain their existing robots behavior unless explicitly changed.
- Context: `PLANS.md` Task 086; `src/lib/authority-launch-pages.ts`; `src/lib/publication-surface-projection.ts`; `src/app/llms.txt/route.ts`.
- Rationale: The FAQ now functions as a canonical question-answer surface for discovery, comparison, and conversion. Keeping it discoverable improves search engine indexing and LLM retrieval without weakening the noindex boundary on other authority-launch pages.
- Rejected alternatives: Leave the FAQ `noindex`; make all authority-launch pages indexable by default; add a separate FAQ-only route outside the governed discovery surfaces.
- Consequences: `/faq` becomes a searchable public authority asset and a first-class LLM-facing discovery surface. Tests must cover both the robots output and `llms.txt` inclusion so the policy does not drift.

## DEC-20260725-01 - Phase 1 ContentDecision integration remains code-only

- Date: `2026-07-25`
- Status: `implementation`
- Scope: ContentDecision projection, generation readiness, revalidation, and publishing provenance.
- Decision: Keep ContentDecision as a separate versioned internal contract. Phase 1 may add deterministic validators, PageBrief projection, and governance gates, but must not add a Payload collection, migration, or autonomous publishing workflow while the release freeze is active.
- Context: `PLANS.md` Task 094; `docs/plans/2026-07-25-content-decision-graph.md`; Phase 0 ContentDecision implementation on `codex/content-decision-graph`.
- Rationale: The model must first prove that explicit IDs govern content decisions and fail safely on CTA conflicts, missing evidence, stale validation, and provenance mismatch before persistence or generation wiring expands.
- Consequences: `/cto-coach` is mapped explicitly, `/contact` is an intentional exclusion, and callers opt into the ContentDecision generation gate until a later approved schema/pipeline phase.

## DEC-20260726-01 - Engineering Manager Coach uses one canonical content chain

- Date: `2026-07-26`
- Status: `implementation`
- Scope: `/engineering-manager-coach` ContentDecision, PageBrief projection, reader-facing artifact generation, validation, and publication provenance.
- Decision: Revalidate the explicit ContentDecision, derive the PageBrief from it, and treat the legacy PageBrief only as historical input. Generate a new hash-bound reader-facing artifact from the canonical chain. Human approval remains required before publication and provenance can become current.
- Context: User-approved chain order on `2026-07-26`; `PLANS.md` Task 095; `DEC-20260713-04`; `DEC-20260725-01`.
- Rationale: Keeping the static PageBrief as a parallel authority would recreate the two-source-of-truth problem. A deterministic projection makes the decision, artifact, validation, approval, and publication identities auditable.
- Consequences: The generated artifact is a draft until a human reviews and approves its exact hash. No publication record, sitemap, `llms.txt`, or analytics update is produced by this implementation step.

## DEC-20260726-02 - ContentDecision provenance is explicit for publication binding

- Date: `2026-07-26`
- Status: `implementation`
- Scope: ContentDecision-generated artifact provenance and publishing validation.
- Decision: ContentDecision-generated provenance must include both `contentDecisionId` and `contentDecisionVersion` in addition to the artifact and PageBrief bindings. Publishing validation consumes those explicit fields and fails on any mismatch.
- Context: User review correction on `2026-07-26`; `PLANS.md` Task 095; `src/ai/content-decision/integration-gates.ts`; `DEC-20260726-01`.
- Rationale: Artifact approval must not be detached from the exact ContentDecision revision that produced it.
- Consequences: Existing historical artifact provenance remains compatible as legacy provenance; newly generated ContentDecision artifacts cannot be considered publication-ready without the explicit decision binding.

## DEC-20260726-03 - Page Pattern owns governed page structure

- Date: `2026-07-26`
- Status: `implementation`
- Scope: ContentDecision, PageBrief projection, ReaderFacingPageArtifact completeness, renderer input, and governance validation.
- Decision: Every governed ContentDecision selects a canonical `pagePatternId` and `contentArchetype`. Page Patterns own required sections and journey/CTA compatibility; ContentDecision owns meaning and canonical IDs; the reader-facing renderer owns presentation.
- Context: User-approved Page Pattern requirement on `2026-07-26`; `PLANS.md` Task 096; `DEC-20260713-04`; `DEC-20260726-01`.
- Rationale: A shared structural contract prevents conversion, framework, problem, FAQ, and other surfaces from drifting into generic or incomplete artifacts while keeping operational metadata out of public output.
- Consequences: Artifacts missing pattern-required sections or containing internal vocabulary IDs are rejected. Preview and publication continue to use the same renderer, and no draft becomes publishable without the existing hash-bound approval chain.
