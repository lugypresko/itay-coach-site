# Buyer-facing content drafts — 90-day focus

Status: `internal draft — do not publish`

Owner: Itay Foyerstein

Last updated: 2026-09-12

This document prepares the first commercial pillar and problem page for the 90-day acquisition loop:

`problem recognition → useful diagnosis → reversible experiment → qualified conversation`

No public route is added by this document. The existing public content system must continue to enforce its human approval and publication gates.

## Content decision

The first public content pair should be:

- Commercial pillar: `Tech Leadership Coaching for Engineering Managers, CTOs and VP R&D`
- Problem page: `How to Stop Being the Bottleneck as an Engineering Manager`

The problem page is the first test of the brand wedge `Every Decision Comes Back to You`. The other two angles remain distribution and message variants until they have distinct evidence or search intent:

- `You Delegated the Work. Why Are You Still the Bottleneck?`
- `Your Role Got Bigger. Your Operating Model Didn’t.`

This avoids publishing three near-duplicate indexed pages before the message has been validated.

## Draft A — commercial pillar

### SEO fields

Title: `Tech Leadership Coaching for Engineering Managers, CTOs and VP R&D | The Push`

Description: `Tech leadership coaching by Itay Foyerstein for technical leaders who need clearer decisions, stronger delegation, and visible strategic leadership.`

Primary CTA: `Start with the leadership diagnostic`

Fallback CTA while the diagnostic is unavailable: `Book a fit call`

### Hero

**Tech leadership coaching for the moment execution stops being enough.**

You can be the person everyone trusts and still be the path every decision, review, and escalation has to pass through. The Push helps Engineering Managers and technical leaders build a clearer operating model so the team can move without waiting for them.

CTA: `Start with the leadership diagnostic`

### Direct answer

Tech leadership coaching is focused support for technical leaders who need to change how decisions, ownership, delegation, and strategic visibility work inside engineering organizations. It is a fit when execution strength has become a dependency path and the leader needs more leverage than personal availability can provide.

### Who it is for

- Engineering Managers who remain the default reviewer or escalation path.
- Tech Leads moving into management and learning to create leverage through other people.
- R&D Managers and VP Engineering candidates whose scope has grown faster than their operating model.
- CTOs and VP R&D leaders who need a stronger management layer.

### What changes in the work

The Push works on a real leadership situation, not a generic curriculum. The work makes decision boundaries, delegation paths, stakeholder alignment, escalation rules, and leadership visibility explicit enough to use in the team's actual context.

The public model is:

`Player Trap → Invisible Executor → Trusted Operator → Strategic Leader`

These labels describe operating patterns. They are not a score and they do not replace investigation of the specific situation.

### What the 12-week engagement includes

The Push is a 12-week 1:1 engagement with six biweekly conversations. Each cycle connects the leadership problem to one observable change in how the team decides, owns, escalates, or communicates. The next step is chosen after fit is established.

### When coaching is not the answer

Coaching cannot substitute for missing authority, staffing, an unresolved organizational decision, or technical expertise outside the engagement. When the evidence points there, the right next step is to name the constraint and decide what must change around the leader.

### FAQ seed

**How do I stop being the bottleneck as an Engineering Manager?**

Start by mapping which decisions, reviews, and escalations still return to you, then make the decision boundaries and escalation rules visible enough for the team to use without constant approval.

**Is this management training?**

The Push is applied coaching and advisory work around a live engineering leadership problem. It does not begin with a standard course or assume that the same operating model fits every team.

**Who is this not for?**

It is not a substitute for a company decision about authority, staffing, role design, or a specialist technical intervention.

### Internal-link targets

- `/frameworks/player-trap` — the dependency pattern
- `/frameworks/invisible-executor` — hidden operating model
- `/entities/the-push` — methodology
- `/entities/itay-foyerstein` — expert identity
- `/problems/how-engineering-managers-become-bottlenecks-in-ai-assisted-teams` — problem-specific answer

## Draft B — first problem page

### SEO fields

Title: `How to Stop Being the Bottleneck as an Engineering Manager | The Push`

Description: `A practical way for Engineering Managers to identify when strong execution has become the team's dependency path and make decision boundaries visible.`

Primary CTA: `Run the leadership diagnostic`

### Direct answer

An Engineering Manager stops being the bottleneck by changing the routing of decisions, reviews, and escalations. Delegating more tasks is not enough if the team still does not know who can decide what, when to escalate, and which guardrails apply.

### The pattern

The Player Trap is the state where a manager's strongest execution habits become the team's default path for progress. Common signals include:

- The manager is the final reviewer.
- Escalations skip the team and arrive directly with the manager.
- Decision rules live in the manager's head.
- AI-assisted output creates another review queue instead of reducing load.

### Two explanations to test

**Explanation 1: the operating model is implicit.** The team cannot act independently because decision rights, escalation rules, and review standards are not visible.

**Explanation 2: the intervention is currently necessary.** A new team member, high-risk decision, cross-functional dependency, or missing authority may require the manager's involvement. The same behavior can look like a bottleneck while serving a real constraint.

The diagnostic should collect evidence for and against both explanations before recommending an experiment.

### Reversible experiment

Choose one recurring decision or review. Write down the owner, the manager's guardrail, the escalation trigger, and the date for review. Let the named owner run one cycle, then inspect what actually returned to the manager and why.

This is an experiment, not a promise that every decision should be delegated.

### Counter-example and scope

If a new employee needs close support, or a decision genuinely carries risk the team is not authorized to accept, increased manager involvement may be correct. The question is whether the involvement is explicit, temporary, and proportional to the constraint.

### Practical artifact

| Decision or review | Named owner | Manager guardrail | Escalate when | Review date |
|---|---|---|---|---|
| One recurring decision | One person or role | What must remain true | Specific trigger | One cycle later |

### Next step

Use the diagnostic to identify whether the recurring pattern is a routing problem, a real context or risk constraint, an authority gap, or a capability gap. If the evidence shows a coaching fit, continue to a fit conversation about The Push.

## Evidence ledger

The current draft relies only on repository material already marked as approved, review, or established framework language:

| Claim or asset | Source | Publication state |
|---|---|---|
| Itay, The Push, and the framework entities | `docs/insight-intake/fresh-approved-insight.md` | Approved insight source |
| Pillar audience, queries, and positioning | `docs/seed-content/tech-leadership-coaching-pillar.md` | Draft seed; requires review |
| Bottleneck definition, symptoms, explanations, and CTA direction | `docs/seed-content/how-engineering-managers-become-bottlenecks-in-ai-assisted-teams.md` | Review-ready; requires approval |
| Engagement structure and applied work | `src/seed/authority-asset-production-sprint.ts` | Existing seed material; verify before publication |
| Voice and post constraints | `Brand Voice.MD`, `Content Strategy.MD`, and the supplied thought-leadership SOP | Internal guidance |

No client name, testimonial, metric, or personal incident is claimed here. A case study must remain a separate draft until the transcript speaker, facts, attribution, and publication permission are confirmed.

## Publication DoD

The asset is ready for a public route only when every item below is true:

- [ ] Itay confirms the English copy sounds like him and approves any Hebrew adaptation.
- [ ] Every personal or client-specific fact has a transcript/source reference.
- [ ] Any case study has confirmed attribution or explicit anonymization approval.
- [ ] The page has one direct answer, two competing explanations, one counter-example, and one reusable artifact.
- [ ] The diagnostic CTA exists and returns a useful result; otherwise the CTA says `Book a fit call`.
- [ ] Canonical, index/follow, schema, sitemap inclusion, and internal links are checked together.
- [ ] EN and HE versions are adapted for their audiences, with correct language metadata and reciprocal links if both are published.
- [ ] Analytics records source angle, language, diagnostic start, completion, qualified conversation, and assisted opportunity without storing diagnostic free text.
- [ ] The page has a human approval record and an approved publication scope.

## Distribution DoD

For each published asset, record one completed action in each surface:

- SEO: page indexed or submitted for indexing, linked from the pillar, and linked from one relevant framework or FAQ.
- GEO: the page answers a defined question directly; the monitoring query set and date are recorded. A citation is measured, not promised.
- Outbound/LinkedIn: one post or real follow-up message uses the asset in context and carries a tagged link to the diagnostic or pillar.

The operating loop is:

`publish → distribute → drive to diagnostic → measure conversation quality`

