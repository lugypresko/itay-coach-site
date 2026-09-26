# Conversion Core V1 contract

## Scope

The V1 funnel is English only:

`Home → Diagnostic Conversation → Micro-insight → Earned contact → Diagnosis → Intent → Request to talk`

The diagnostic is an acquisition conversation, not a score or a generic quiz. It must start from one current leadership incident and return a bounded hypothesis plus one reversible experiment.

## Required states

`ROLE → PAIN_RAW → PATTERN_HYPOTHESES → PAIN_CONFIRMED → WHY_NOW → MICRO_INSIGHT → CONTACT_EARNED → DIAGNOSIS → INTENT → ROUTE`

Each transition records the user's answer and the evidence supporting the transition. A mirror can be corrected and must not advance the state until the user confirms or refines it.

## Conversation rules

- Every question is preceded by a reflection, acknowledgement, hypothesis, or useful distinction.
- Do not ask for name or email before the micro-insight is delivered.
- Contact consent for the diagnostic report is separate from optional marketing consent.
- The report never presents a certainty score. It contains: observed pattern, likely cause, evidence for/against, business cost, one reversible experiment, what to watch next, and when coaching is not the answer.
- The commercial action is `request_to_talk`; direct booking is out of scope for V1.
- If evidence is insufficient, return a useful uncertainty statement and a self-serve next step.

## Data and privacy

The server accepts a POST payload. Personal fields are never placed in query parameters or analytics events. UTM and pattern attribution may be stored without free-text pain or diagnosis.

## V1 language boundary

Only the EN flow is active in V1. Hebrew is a separate port task after the EN flow passes acceptance and production verification.

