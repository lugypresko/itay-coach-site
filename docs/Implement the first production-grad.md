Implement the first production-grade Intent-to-Outcome mission runtime for the Authority Engine.

Do not continue by executing a manually specified task list.

The system must accept only:

1. Intent
2. Definition of Done
3. Constraints

From those inputs, it must independently:

- inspect current state
- identify gaps
- select the current constraint
- generate a plan
- execute the next safe action
- verify the result
- replan after failure or new evidence
- stop only when the DoD is proven or the mission is formally blocked

──────────────────────────────────────────────────────────────────────────────
MISSION

Build a governed Mission Runtime that allows the COS to move the system from
an intended business outcome to independently verified completion.

The COS is the mission controller.
It must not require file-by-file or step-by-step instructions from the user.

──────────────────────────────────────────────────────────────────────────────
1. DEFINE THE MISSION CONTRACT

Create a canonical MissionSpec domain contract.

Required fields:

- missionId
- intent
- definitionOfDone
- constraints
- allowedCapabilities
- riskLevel
- requiredHumanGates
- createdAt
- currentState
- status

Suggested structure:

type MissionSpec = {
  missionId: string
  intent: string
  definitionOfDone: DoDCondition[]
  constraints: MissionConstraint[]
  allowedCapabilities: CapabilityId[]
  riskLevel: "low" | "medium" | "high"
  requiredHumanGates: HumanGate[]
  status:
    | "pending"
    | "running"
    | "completed"
    | "blocked_human_approval"
    | "blocked_missing_capability"
    | "blocked_missing_evidence"
    | "failed_constraint_conflict"
    | "failed_verification"
  createdAt: string
}

DoDCondition must be machine-verifiable where possible.

Supported verifier types should include:

- http_status
- content_presence
- content_absence
- route_availability
- test_suite
- typecheck
- build
- database_state
- artifact_state
- semantic_review_state
- publication_state
- human_approval
- metric_threshold
- custom_verifier

Each condition must contain:

- id
- description
- verifier
- target
- required
- evidence
- verificationStatus

──────────────────────────────────────────────────────────────────────────────
2. DEFINE THE CAPABILITY REGISTRY

Create an explicit CapabilityRegistry.

The COS must reason only over capabilities that actually exist.

Initial capabilities should include:

- inspect_repository
- inspect_git_state
- inspect_production_routes
- inspect_rendered_content
- inspect_database_schema
- inspect_artifact_state
- inspect_semantic_review_state
- inspect_publication_state
- modify_code
- create_static_content
- run_typecheck
- run_tests
- run_build
- create_preview
- deploy_preview
- deploy_production
- run_database_migration
- create_human_review_package
- request_human_approval
- create_publication_record
- verify_post_deployment

Each capability must define:

- capabilityId
- description
- requiredInputs
- outputContract
- sideEffectLevel
- riskLevel
- requiredApproval
- reversible
- verifier

Do not allow the COS to call undefined or implied capabilities.

──────────────────────────────────────────────────────────────────────────────
3. DEFINE POLICY AND AUTHORITY BOUNDARIES

Create a MissionPolicy contract.

The COS may:

- observe
- diagnose
- plan
- create governed work items
- invoke allowed capabilities
- verify outputs
- replan
- stop execution

The COS may not:

- approve human review
- fabricate evidence
- invent frameworks or claims
- bypass semantic review
- bypass deterministic validation
- publish without valid approval
- run production migrations without explicit authorization
- enable indexing without explicit authorization
- declare completion without verifier evidence

Policy must be enforced in code, not only documented in prompts.

──────────────────────────────────────────────────────────────────────────────
4. IMPLEMENT CURRENT-STATE ASSESSMENT

Create a MissionSnapshotBuilder.

Given a MissionSpec, it must gather only the state relevant to the mission.

The snapshot should support:

- repository state
- deployed commit
- production deployment
- public route status
- rendered page content
- database schema
- artifact lifecycle
- semantic review lifecycle
- approval lifecycle
- publication lifecycle
- indexing state
- measurement signals

The snapshot must distinguish:

- reported state
- repository state
- deployed state
- observed production state

Observed production evidence has priority over agent-reported claims.

──────────────────────────────────────────────────────────────────────────────
5. IMPLEMENT GAP ANALYSIS

Create a deterministic GapAnalyzer.

For every required DoD condition:

- inspect current evidence
- mark it passed, failed, unknown, or blocked
- explain the missing evidence
- identify which capability could close the gap
- identify whether a human gate is required

The COS must not plan from the intent alone.
It must plan from the gap between current state and DoD.

──────────────────────────────────────────────────────────────────────────────
6. IMPLEMENT CONSTRAINT SELECTION

The COS must select exactly one current constraint for each execution cycle.

Examples:

- active production incident
- missing public content
- missing evidence
- invalid artifact
- missing semantic review
- missing human approval
- missing production schema
- failed deployment
- insufficient measurement
- blocked capability

The selected constraint must be supported by observed evidence.

The COS must explain why other issues are secondary.

──────────────────────────────────────────────────────────────────────────────
7. IMPLEMENT THE MISSION PLANNER

Create a planner that produces a MissionPlan from:

- MissionSpec
- current snapshot
- failed DoD conditions
- capability registry
- policy
- current constraint

The plan must contain:

- objective
- ordered actions
- capability used for each action
- expected state transition
- verification step
- rollback or recovery path
- human gate where required
- prohibited actions

The planner must not hardcode repository file names for every mission.

It should reason at the capability and outcome level.

──────────────────────────────────────────────────────────────────────────────
8. EXECUTE ONE SAFE ACTION AT A TIME

Implement a MissionExecutionLoop.

Required loop:

1. Build snapshot
2. Evaluate DoD
3. If all required conditions pass, complete mission
4. Select current constraint
5. Generate or update plan
6. Select one next safe action
7. Verify policy and authorization
8. Execute
9. Capture evidence
10. Rebuild snapshot
11. Re-evaluate DoD
12. Replan if necessary

Do not execute the entire plan blindly.

Every state-changing action must be followed by verification before the next
action begins.

──────────────────────────────────────────────────────────────────────────────
9. IMPLEMENT VERIFICATION-FIRST COMPLETION

A mission may not be completed because:

- code was written
- tests passed locally
- a commit exists
- deployment is READY
- an agent reports PASS
- a route returns HTTP 200

Mission completion requires every required DoD condition to contain independent
verification evidence.

Example:

A public page condition should verify:

- production URL
- HTTP status
- visible main content
- H1
- minimum prose
- required CTA
- absence of internal language

The verifier result must be persisted.

──────────────────────────────────────────────────────────────────────────────
10. IMPLEMENT REPLANNING

The runtime must replan when:

- an action fails
- verification fails
- production differs from repository state
- a new incident is discovered
- a capability is unavailable
- a constraint prevents the next action
- the plan would violate policy
- a human gate is reached

The runtime must not repeatedly retry the same failed action without changing
its diagnosis.

Persist:

- previous hypothesis
- action attempted
- observed result
- reason for replan
- new constraint
- next action

──────────────────────────────────────────────────────────────────────────────
11. DEFINE FORMAL STOP STATES

The runtime may stop only with one of:

- COMPLETED
- BLOCKED_HUMAN_APPROVAL
- BLOCKED_MISSING_CAPABILITY
- BLOCKED_MISSING_EVIDENCE
- FAILED_CONSTRAINT_CONFLICT
- FAILED_VERIFICATION
- TIMED_OUT

Each blocked or failed state must report:

- exact unsatisfied DoD conditions
- evidence collected
- blocking reason
- required human decision or missing capability
- safest next action

Do not use “mostly complete”, “core infrastructure ready”, or “PASS” without
formal DoD verification.

──────────────────────────────────────────────────────────────────────────────
12. IMPLEMENT ONE PILOT MISSION

Use the current core-page recovery as the first mission.

Mission input:

Intent:
Restore the public authority site to a trustworthy reader-facing baseline.

Definition of Done:

- /about returns 200 in production
- /about contains complete reader-facing content
- /the-push-methodology returns 200 in production
- /the-push-methodology contains complete reader-facing content
- /faq returns 200 in production
- /faq contains complete reader-facing content
- /contact returns 200 in production
- /contact contains complete reader-facing content
- every page contains an H1
- every page contains a relevant CTA
- no PageBrief or internal planning language is exposed
- governed artifact routes remain fail-closed
- robots remain noindex
- typecheck passes
- tests pass
- build passes
- production deployment commit matches the intended repository commit
- live production verification passes

Constraints:

- no production database migration
- no artifact approval
- no PublicationRecord creation
- no governed artifact publication
- no indexing enablement
- no invented claims
- no invented framework terminology
- no human approval bypass

The runtime must independently identify and execute the actions required to
reach this DoD.

Do not give the pilot a pre-written file-by-file plan.

──────────────────────────────────────────────────────────────────────────────
13. TESTS

Add tests proving:

- a mission cannot complete with an unverified DoD condition
- HTTP 200 alone does not satisfy a content condition
- reported deployment SHA cannot override observed deployment SHA
- forbidden capability invocation is blocked
- production migration requires a human gate
- publishing requires human approval
- a failed verifier triggers replanning
- a missing capability produces BLOCKED_MISSING_CAPABILITY
- a human gate produces BLOCKED_HUMAN_APPROVAL
- all required DoD conditions passing produces COMPLETED
- optional DoD conditions do not block completion
- the COS selects one constraint per cycle
- repeated failed actions require a changed plan
- mission evidence is persisted and traceable

──────────────────────────────────────────────────────────────────────────────
14. DELIVERABLES

Create:

- MissionSpec contract
- DoDCondition contract
- MissionConstraint contract
- CapabilityRegistry
- MissionPolicy
- MissionSnapshotBuilder
- GapAnalyzer
- ConstraintSelector
- MissionPlanner
- MissionExecutionLoop
- VerifierRegistry
- MissionRun persistence model
- MissionAction persistence model
- VerificationEvidence model
- tests
- one pilot mission run

Suggested locations:

src/domain/missions/
src/ai/cos/
src/ai/missions/
src/ai/capabilities/
src/ai/verifiers/
src/payload/collections/MissionRuns.ts

Use the existing repository conventions where appropriate.

──────────────────────────────────────────────────────────────────────────────
15. EXECUTION BOUNDARY

For this task:

- implement locally
- run typecheck
- run tests
- run build
- run the pilot in dry-run mode
- do not deploy
- do not migrate production
- do not approve
- do not publish
- do not enable indexing

The dry run may observe production but must not change it.

──────────────────────────────────────────────────────────────────────────────
FINAL REPORT

Return:

1. Architecture implemented
2. Files created and modified
3. Mission contracts
4. Capability registry
5. Policy boundaries
6. Execution loop
7. Verification model
8. Replanning behavior
9. Tests and results
10. Pilot MissionSpec
11. Pilot dry-run output
12. Current unsatisfied DoD conditions
13. Final mission state
14. Remaining architectural limitations

Do not claim that the system is autonomous or production-ready unless the pilot
proves that it can move from Intent + DoD + Constraints to verified completion
without step-by-step human instructions.