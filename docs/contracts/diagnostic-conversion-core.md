# Diagnostic Conversion Core Contract

The isolated English `/player-trap` diagnostic collects only evidence needed to
decide whether an Itay conversation is worthwhile. The server persists raw
answers and computes the route; the browser owns presentation state only.

## Flow and persisted checkpoints

```text
LANDING → INCIDENT → REFLECTION → PAIN_CONFIRMATION → IMPACT → WHY_NOW
→ MICRO_INSIGHT → CONTACT_OFFERED → CONTACT_SUBMITTED | CONTACT_SKIPPED
→ DIAGNOSIS → INTENT → ROUTED
```

Each completed checkpoint is saved before the response is returned. Refresh
loads the same safe view model. Raw answers are never rewritten by the server.

| State | Required evidence | Allowed completion |
| --- | --- | --- |
| INCIDENT | role/fit and free-text incident | reflection |
| REFLECTION | correction or confirmation of the reflection | pain confirmation |
| PAIN_CONFIRMATION | explicit yes/no | impact, no-fit, or insufficient evidence |
| IMPACT | initial consequence in the visitor's words | why now |
| WHY_NOW | urgency/context | micro insight |
| MICRO_INSIGHT | generated insight | contact offered |
| CONTACT_OFFERED | none | submit contact or skip |
| CONTACT_SUBMITTED | name, email, processing acknowledgement | diagnosis |
| CONTACT_SKIPPED | none | diagnosis |
| DIAGNOSIS | generated from persisted evidence | explicit intent |
| INTENT | `TALK_NOW`, `LATER`, or `SELF_SERVE` | routed |
| ROUTED | route and reason codes | terminal |

Invalid or out-of-order actions return `409` and do not mutate the session.

## Route precedence

| Route | Rule |
| --- | --- |
| `NO_FIT` | role/fit rejected, pain rejected, or reflection explicitly rejected without a confirming correction |
| `TALK_NOW` | fit and pain confirmed, why-now present, and explicit intent is `TALK_NOW` |
| `NURTURE` | fit and pain confirmed and intent is `LATER` or `SELF_SERVE`; why-now may be unknown |
| `INSUFFICIENT_EVIDENCE` | no disqualifier, but fit/pain/impact evidence is missing or contradictory |

The route is computed from the persisted evidence on the server. The client
must not submit a route, score, tier, or legacy five-question answers.

## Lead and consent contract

Processing/privacy acknowledgement is required to create a Lead and is stored
separately from optional marketing consent. Marketing defaults to false and is
never inferred from processing acknowledgement. Contact may be skipped; if a
visitor later selects `TALK_NOW`, the minimum contact fields are requested then.

`request_to_talk` is accepted only for a persisted `TALK_NOW` route and is
idempotent by `submissionId`. Retries update delivery status and do not create a
second Lead or duplicate a successful notification.

No PII, free text, session identifier, token, or diagnostic content is sent to
analytics or placed in URLs/logs.
