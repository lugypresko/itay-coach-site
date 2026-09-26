# Conversion Core EN acceptance scenarios

These scenarios are executable acceptance requirements for the V1 contract.

## Fit and urgent

Given an engineering manager describes a current decision bottleneck, confirms the mirror, and explains why it matters now, when they accept the micro-insight, provide contact consent, and request a conversation, then the system returns a diagnosis and routes to `TALK_NOW` with `request_to_talk`.

## Fit but not now

Given a matching technical leader confirms a real pain but reports no current trigger, when they complete the diagnostic, then the system routes to `NURTURE`, preserves pattern and context, and does not force a conversation.

## No fit

Given the visitor is outside the ICP or cannot identify a leadership incident, when the diagnostic completes, then the system returns a bounded self-serve next step and does not request a sales handoff.

## Insufficient evidence

Given the visitor rejects the mirror or gives contradictory evidence, when the system attempts to advance, then it asks one clarifying question or returns `INSUFFICIENT_EVIDENCE`; it does not present a confident diagnosis.

## Retry

Given a report request times out after server acceptance, when the visitor retries with the same attempt key, then the original report is reused and no duplicate lead or notification is created.

