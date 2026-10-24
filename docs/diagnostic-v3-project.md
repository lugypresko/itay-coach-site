# Diagnostic V3 — Project Documentation

_Last updated: 2026-10-24_

## 1. Purpose

Diagnostic V3 is the main conversion and value-delivery experience on itayfoyerstein.com.

Its purpose is to help senior engineering leaders bring one real execution problem, receive a useful diagnosis before any sales conversation, and then route them to the most appropriate next step.

Primary audience:

- CTO
- VP R&D / VP Engineering
- Head / Director of Engineering
- Group Manager
- Engineering Manager

Core problem:

> Strong managers and good people, yet important decisions, dependencies and stalled work still return to the senior leader. Execution waits for them to push.

Desired transformation:

> Move from being the person the organization depends on to keep execution moving, to leading an organization that can make decisions and progress without waiting for you.

The diagnostic is intentionally designed to feel like an asynchronous first consulting interaction, not a generic quiz or lead magnet.

---

## 2. Product flow

The approved V3 flow is:

```text
Entry
→ Q1–Q9
→ First Read
→ Partial Reveal
→ Identity Gate
→ Full Read
→ Role + Engineering Org Size
→ scoring-v1
→ route
```

Identity fields:

- First name
- Email
- Company

Qualification fields:

- Role
- Engineering organization size

Phone number is not collected.

The user receives substantive value before final qualification.

---

## 3. Diagnostic questions

The question set captures:

1. Situation type
2. What happens if the leader does not intervene
3. Ownership
4. Decision authority
5. Duration and frequency
6. Previous attempts
7. Business impact
8. Desired future state
9. Optional real-case context

Key UX rules:

- no auto-submit on the last question
- Back/Edit must be supported
- refresh must restore the same session
- changing qualification must not re-run Groq
- changing answers must invalidate stale analysis

---

## 4. Analysis architecture

Core rule:

> Groq is the analyst; deterministic code is the judge.

Groq is responsible for interpretation and personalized reasoning.

Deterministic code is responsible for:

- Fit
- Pain
- Urgency
- Readiness
- total score
- routing

Groq does not determine whether a user becomes a Conversation, Nurture, or Self-service lead.

### First Read

The First Read produces a concise working hypothesis based on the user's answers.

Expected concepts include:

- primary pattern
- secondary pattern
- confidence
- evidence
- likely explanation
- alternative hypothesis
- contradictions
- missing information
- desired outcome
- teaser insight
- recommended test category

Typical patterns:

- ownership gap
- decision-rights gap
- cross-team dependency
- review / approval dependency
- escalation habit
- risk-boundary ambiguity
- capability gap
- system / process problem

### Full Read

The Full Read follows the coaching logic:

```text
SEE → CHALLENGE → MOVE → READ → ADJUST
```

It produces:

- primary pattern
- case summary
- likely explanation
- alternative hypothesis
- evidence
- leadership move
- manager question
- 7-day experiment
- success signal
- unresolved question

The system should avoid generic advice such as "delegate more". The output should be grounded in the actual answers supplied by the user.

---

## 5. Groq privacy and safety

Groq is called server-side only.

Relevant Preview configuration:

- `DIAGNOSTIC_V3_AI_ENABLED=true`
- `GROQ_API_KEY`
- `GROQ_ZDR_VERIFIED=true`

The project uses Groq inference APIs only after Zero Data Retention for Inference APIs has been explicitly verified.

The diagnostic sanitizes free-text case input before external inference.

Do not expose API keys, secrets or full connection strings in logs, documentation or debugging output.

---

## 6. scoring-v1

### Fit — role

| Role | Score |
|---|---:|
| CTO / VP / Head / Director | 6 |
| Group Manager | 5 |
| Engineering Manager | 3 |
| Other | 0 |

### Fit — engineering org size

| Size | Score |
|---|---:|
| <20 | 0 |
| 20–50 | 2 |
| 51–100 | 4 |
| 101–250 | 4 |
| 251+ | 3 |

### Pain

Intervention dependency:

- waits / repeated discussion / escalation: 4
- moves but not trusted: 2
- manager handles it: 0
- unsure: 1

Business impact:

- customer commitment: 4
- delivery: 4
- cross-team execution: 3
- VP time / manager development / accountability / strategic work: 2
- none / Other only: 0

Frequency:

- several times per week: 2
- weekly / several times per month: 1
- occasional: 0

### Urgency

Duration:

- first occurrence: 0
- weeks: 1
- 1–3 months: 2
- more than 3 months / operating model: 3

Frequency:

- several times per week: 3
- weekly: 2
- several times per month: 1
- occasional: 0

Impact:

- customer: 4
- delivery: 3
- cross-team / strategic work: 2
- other meaningful impact: 1
- none: 0

### Readiness

Previous attempts:

- one meaningful attempt: 2
- two or more: 4
- none: 0

Desired outcome:

- structured answer: 3
- Other without detail: 0

Impact recognition:

- meaningful impact: 3
- none / Other only: 0

### Routing precedence

1. Missing Fit → `unqualified_nurture`
2. Pain <= 3 → `self_service`
3. Total >= 28 AND Fit >= 6 AND Pain >= 6 → `conversation`
4. Pain >= 9 AND Urgency >= 9 AND role in CTO/VP/Head/Director/Group → `conversation_override`
5. Total < 18 → `self_service`
6. Else → `nurture`

---

## 7. Persistence architecture

### Neon project

Project:

- Project ID: `winter-resonance-15589128`
- Project name: `itay-coach-site`
- Region: `aws-eu-central-1`

Preview:

- Branch: `preview/diagnostic-v3`
- Branch ID: `br-cold-credit-b9x1qomi`
- Database: `neondb`

Production must not be used for V3 verification until release is explicitly approved.

### Normalized V3 tables

The normalized source of truth consists of:

- `diagnostic_v3_sessions`
- `diagnostic_v3_revisions`
- `diagnostic_v3_analyses`
- `diagnostic_v3_leads`
- `diagnostic_v3_qualifications`
- `diagnostic_v3_events`

### `sessions.payload`

`diagnostic_v3_sessions.payload` is legacy/transitional only.

For new normalized sessions it may contain transitional UI metadata such as:

- stage
- step
- identified_at
- origin

It must not be the source of truth for:

- answers
- analyses
- identity
- qualification
- scoring
- events
- Sales Brief

### Revision safety

The persistence layer is designed so that:

- answer revisions are immutable
- stale analysis can be retained but must not become selected
- only the current revision may promote a current analysis
- Full Read links to the exact First Read
- qualification changes do not trigger a new analysis
- answer edits invalidate derived reads
- refresh restores the same committed session

---

## 8. Sales Brief

After identity and Full Read, the system stores a Sales Brief with the information already learned during the diagnostic.

It exists to prevent the eventual sales conversation from restarting discovery from zero.

Typical contents:

- lead identity
- qualification
- answers
- Full Read analysis
- scoring and route
- unresolved opening question

The intended behavior is:

> Do not ask the user again for information already captured by the diagnostic.

---

## 9. Funnel events

The V3 event model includes:

- `diagnostic_view`
- `diagnostic_start`
- `q1_complete` … `q9_complete`
- `analysis_started`
- `partial_result_view`
- `identity_gate_view`
- `identity_submit`
- `full_result_view`
- `qualification_submit`
- `qualification_skipped`
- `route_conversation`
- `route_nurture`
- `route_self_service`
- `booking_click`
- `booking_complete`

Primary early conversion metric:

> Partial Reveal → Identity Submit

Longer-term quality metric:

> Qualified Lead → Good Meeting

PII and case free-text should not be copied into analytics or general logs.

---

## 10. Repository and development workflow

Repository:

`https://github.com/lugypresko/itay-coach-site`

Current V3 working branch:

`feature/diagnostic-v3`

Important implementation commit:

`648c30f3adc428f2e262fa6b106615ef8dfbb9bd`

This commit introduced the normalized persistence implementation. Later commits on the same branch are descendants of this work.

Before working on V3, verify:

```bash
git remote -v
git branch --show-current
git status
git log -3 --oneline
```

Expected:

- repository is `lugypresko/itay-coach-site`
- working branch is `feature/diagnostic-v3`
- do not work on `main`
- do not deploy Production unless explicitly approved

### Vercel workflow

Preferred workflow:

```text
edit
→ commit to feature/diagnostic-v3
→ push
→ Vercel creates Preview automatically
→ stable branch Preview alias updates
```

Do not manually redeploy an arbitrary previous deployment. This previously caused Preview deployments to be created from unrelated old commits.

Stable branch Preview:

`https://itay-coach-site-git-feature-dia-8ab94c-fitay-yahoocoms-projects.vercel.app/diagnostic`

---

## 11. What has been built

Diagnostic V3 currently includes:

- full Q1–Q9 flow
- First Read
- Partial Reveal
- identity gate
- Full Read
- qualification
- deterministic scoring-v1
- deterministic routing
- Groq analysis with deterministic fallback
- normalized persistence
- immutable answer revisions
- revision-safe analyses
- linked First Read / Full Read
- lead persistence
- Sales Brief persistence
- qualification snapshots
- funnel events
- session refresh / recovery
- protection against duplicate analysis after refresh
- stale analysis protection
- support for editing answers
- support for changing Role / Org Size without new Groq inference

---

## 12. Verified Preview acceptance

A fresh QA session was successfully executed against Preview after Groq and ZDR configuration were corrected.

Verified session:

`5c19a9cb-86f2-4dea-adfd-349695ca33bc`

Verified deployment:

`dpl_4E3232Qmrn4jSTZHGy5Adsp9q9Xx`

Verified Git HEAD at that acceptance point:

`25cdec4ab5e84379065a1721f693dbfdb4737302`

### Groq — PASS

Both First Read and Full Read were stored with:

- `provider=groq`
- `status=succeeded`
- HTTP 200
- no deterministic fallback

The Full Read was linked to the exact First Read.

### Normalized persistence — PASS

Verified:

- answers persisted in `diagnostic_v3_revisions`
- analyses persisted in `diagnostic_v3_analyses`
- lead persisted
- Sales Brief persisted
- qualification persisted
- scoring and route persisted
- funnel events persisted
- `sessions.payload` contained transitional metadata only

### Refresh recovery — PASS

After refresh:

- the same session was restored
- the same Full Read was restored
- route remained `conversation`
- analysis count remained 2
- no duplicate Groq call was created

This establishes that the technical V3 Preview POC works end-to-end.

---

## 13. Earlier issues that were resolved

### Preview 503

Cause:

The Preview runtime initially did not have the expected isolated V3 database configuration.

This was corrected by configuring the Preview V3 database connection to the correct Neon Preview branch.

### Old deployment / legacy payload confusion

A real user session was initially handled by an older deployment, before normalized persistence was active.

That session therefore wrote the old session shape into `sessions.payload`.

This was not a failure of the normalized writer.

### Groq `ai_disabled`

An older Preview deployment did not have `DIAGNOSTIC_V3_AI_ENABLED=true`.

The result was deterministic fallback.

### Groq `zdr_unverified`

V3 intentionally refused to call Groq until Zero Data Retention for Inference APIs had been verified.

Inference APIs ZDR was enabled in Groq and the Preview flag was then set.

### Manual Vercel redeploy selecting old source

Manual redeploys repeatedly created deployments from old commit `6722fa3`.

The project workflow was changed to rely on branch push → automatic Preview deployment instead.

---

## 14. Known tooling limitation

The Vercel MCP/plugin connection can inspect deployments and logs but currently returns HTTP 403 when attempting to list or manage project environment variables.

This is a connector permission limitation, not an application defect.

Neon MCP has been verified successfully for:

- project access
- Preview branch access
- database access
- table inspection

Do not weaken Preview or Production security to compensate for an MCP permission limitation.

---

## 15. Known UX/product improvements

The technical POC is complete enough to move focus to product quality.

Known improvements from real result review:

1. Avoid repetition between "What I would test first" and the 7-day experiment.
2. Make the 7-day experiment more concise and operational.
3. Improve the visual layout of Role and Org Size qualification controls.
4. Review output quality across multiple real scenarios, not only one happy-path case.
5. Preserve the strongest value moment: a specific evidence-based reframe.

Example of a strong reframe already produced:

> Ownership may be assigned while the next decision still needs your permission.

The diagnostic should consistently generate this level of specificity.

---

## 16. Current status

### Technical POC

**PASS**

Verified in Preview:

- live Groq
- ZDR gate
- normalized persistence
- deterministic scoring
- routing
- Sales Brief
- funnel events
- refresh recovery
- no duplicate analysis on refresh

### Product / UX

**IN PROGRESS**

The next focus is not infrastructure. It is:

- quality of Groq reasoning
- usefulness of the diagnostic result
- clarity and visual polish
- behavior across multiple realistic cases
- conversion from Partial Reveal to identity
- conversion from qualified result to conversation

---

## 17. Next recommended phase

Before Production rollout:

1. Run 3–5 realistic browser journeys representing different patterns.
2. Review First Read and Full Read for usefulness, specificity and repetition.
3. Fix known UX issues.
4. Verify all routing classes:
   - conversation
   - nurture
   - self_service
   - unqualified_nurture
5. Confirm no sensitive data leaks into logs or analytics.
6. Define the Production migration and rollback plan.
7. Perform a controlled Production rollout only after explicit approval.

---

## 18. Production guardrails

Until explicitly approved:

- do not merge V3 to `main`
- do not mutate Production data
- do not point V3 Preview at Production Neon
- do not expose secrets
- do not silently migrate legacy analyzed sessions
- do not disable ZDR checks
- do not weaken deployment protection for automation convenience

---

## 19. Mental model for future contributors

The hardest infrastructure work is no longer the main problem.

The core technical path is proven:

```text
correct Git branch
+ correct Preview environment
+ isolated Neon Preview
+ live Groq with ZDR
+ normalized persistence
= working Diagnostic V3 POC
```

The next question is product quality:

> Does the diagnostic consistently help a senior engineering leader see something useful enough that they want to continue the conversation?
