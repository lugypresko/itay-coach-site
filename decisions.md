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
