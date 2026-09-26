# Diagnostic analytics contract

Status: **Contract and local allowlist test complete.** Real Preview capture and replay evidence remain **BLOCKED** until a Preview deployment and isolated database are available.

Telemetry is product measurement, not a copy of the conversation. Every diagnostic event may contain only `step`, `route`, `intent` and `result`, each as a bounded coarse string. It must never contain raw answers, contact fields, cookies, session IDs, operation IDs, report tokens, full URLs, referrer queries or sensitive digests.

| Event | When it may fire | Required ordering / guard |
| --- | --- | --- |
| `diagnostic_started` | User activates the diagnostic CTA | First event; payload is `{step: "incident"}`. |
| `diagnostic_pain_confirmed` | Server accepts the explicit pain answer | After the pain checkpoint; reflection confirmation alone does not qualify. |
| `diagnostic_micro_insight_delivered` | A diagnosis is returned after the insight checkpoint | After pain confirmation and before contact/request events. |
| `diagnostic_contact_earned` | A contact POST commits with processing consent and valid contact | Only after successful commit; never on contact-form display, skip, validation failure or retry replay. |
| `diagnostic_intent_selected` | User explicitly selects a contact intent | After insight; payload contains only the coarse intent. |
| `diagnostic_route_selected` | Server returns the final route | After routing is computed; payload contains only the route and reason-free coarse result. |
| `request_to_talk_submitted` | A contact request commits successfully | After eligible route, explicit intent and consented contact; once per operation. |

The current UI also emits `diagnostic_turn_completed` for coarse checkpoint progress. It follows the same allowlist and must be deduplicated on replay. Legacy page and CTA analytics may carry approved UTM attribution, but visitor-entered diagnostic answers and contact values are never forwarded.

## Verification

The local unit contract test checks the event names and payload boundary. E07 still requires a real four-fixture journey proving order and the consent guard. E08 requires refresh and lost-response retry proving exact once counts; this cannot be claimed from a source inspection or mocked provider.
