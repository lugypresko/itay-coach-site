# Site-next diagnostic contract (B01–B03)

This is the minimal product contract for the English `/player-trap` diagnostic.
The server owns the persisted journey, evidence and route. The browser owns
presentation only and never submits a route, score, tier, session identifier or
legacy answer set.

## Routing truth table (B01)

The route is derived in this order: rejected fit or need, unresolved evidence,
explicit conversation intent, then the bounded self-serve outcome.

| Route | Sample answers | Required evidence | Reason codes | UI outcome |
| --- | --- | --- | --- | --- |
| `TALK_NOW` | `role=manager`, `pain=yes`, `category=decision_escalation`, `why=growth`, `intent=talk_now` | A relevant leadership role, confirmed pain, a current why-now context, and explicit talk intent | `relevant_role`, `pain_confirmed`, `talk_requested` | “A conversation could be useful.” The diagnosis remains visible and the visitor may explicitly request a conversation. |
| `NURTURE` | `role=manager`, `pain=yes`, `category=ownership`, `why=later`, `intent=later` | A relevant role and confirmed pain; timing does not call for a conversation now | `not_ready_for_conversation` | “Keep this for when the timing is right.” Diagnosis and experiment remain available; no request is created. |
| `NO_FIT` | `role=other`, `pain=yes`, `category=capacity`, `intent=talk_now` | A role outside the supported coaching fit, or an explicit `pain=no` | `role_or_need_not_matched` | “A coaching conversation may not be the right next step.” Keep the bounded self-serve diagnosis; do not offer a request. |
| `INSUFFICIENT_EVIDENCE` | `role=manager`, `pain=unclear`, `category=unclear`, `intent=talk_now` | No disqualifier, but pain, pattern or impact evidence is missing or contradictory | `pattern_or_need_unresolved` | “Continue with the experiment.” Keep the diagnosis bounded and do not create a request. |

Self-serve policy is explicitly unresolved for business review. The current
implementation emits `INSUFFICIENT_EVIDENCE` with `self_serve_chosen` for
`role=manager`, `pain=yes`, `intent=self_serve`; that must not be described as
proof that evidence is missing. The product decision is whether that case is a
`NURTURE` outcome (`self_serve` means “later / independent timing”) or a
separate bounded outcome. Until Itay records that decision, this case is
`BLOCKED` and is excluded from the four canonical fixtures.

## Checkpoint contract (B02)

Every transition includes `expected` (the current server step) and a unique
operation ID. A completed transition is persisted before its response is
returned. Retrying the same operation returns the same state; a new operation
for an old step is rejected with `409` and cannot mutate the session.

| Checkpoint | Persisted answers | Allowed payload | Next checkpoint | Exact refresh result |
| --- | --- | --- | --- | --- |
| `incident` | Raw `incident` wording | 10–4000 characters | `reflection` | Reflection prompt, exact raw incident available to the server-backed view. |
| `reflection` | Incident plus correction history and selected `category` on confirmation | `confirm` + known category, or `correct` | `role` on confirm; `incident` on correction | Confirmed reflection or correction prompt; original wording remains in turns. |
| `role` | `role` | One enumerated role | `pain` | Pain confirmation prompt. |
| `pain` | `pain` | `yes`, `no`, or `unclear` | `impact` | Impact prompt; confirmation alone never marks pain confirmed. |
| `impact` | Raw `impact` wording | 10–4000 characters | `why` | Why-now prompt, exact raw impact retained. |
| `why` | `why` | One enumerated urgency choice | `fork` | Category-specific fork prompt. |
| `fork` | `fork` | Category-specific choice | `insight` | Micro-insight prompt and diagnosis view. |
| `insight` | Completed insight checkpoint | `continue` | `contact` | Optional contact offer. Presentation-only clicks before this point do not transition the server. |
| `contact` | Contact status; contact fields only after acknowledgement | `skip`, or valid contact plus `processing=true` and separate `marketing` | `diagnosis` | Skip keeps diagnosis available and creates no Lead; submit proceeds to diagnosis. |
| `diagnosis` | Completed diagnosis checkpoint | `continue` | `intent` | Intent choices with diagnosis still available. |
| `intent` | Explicit intent | `talk_now`, `later`, or `self_serve` | `route` | Exact route and reason codes computed from persisted evidence. |
| `route` | Request status if created | `request` only for persisted `TALK_NOW` | `talk_contact` or terminal | Request opens minimum contact collection, or remains terminal with no follow-up. |
| `talk_contact` | Submitted contact and request status | Valid contact plus `processing=true`, or no-op is rejected | terminal `route` | Request acknowledged only after the write succeeds. |

## Contact and request contract (B03)

Contact follows the insight and is optional. `skip` retains the diagnosis and
does not create a Lead. Processing acknowledgement is mandatory for submitted
contact; marketing consent is separate and defaults to `false`. A request is
created only after explicit `request` intent, a persisted eligible
`TALK_NOW` route and valid minimum contact. It is idempotent by submission or
operation ID. No email delivery is implied by the UI acknowledgement.

