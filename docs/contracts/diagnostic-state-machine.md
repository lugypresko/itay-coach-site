# Diagnostic state machine V1

```text
ROLE
  → PAIN_RAW
  → PATTERN_HYPOTHESES
  → PAIN_CONFIRMED
  → WHY_NOW
  → MICRO_INSIGHT
  → CONTACT_EARNED
  → DIAGNOSIS
  → INTENT
  → ROUTE
```

The machine is monotonic for a single attempt, except that `MIRROR_CORRECTION` may return to `PAIN_RAW` without losing the original answer. A route is terminal for that attempt. A retry resumes the same attempt and must not create duplicate leads, reports, or notifications.

