# DQL and routing contract V1

## Signals

Keep these dimensions separate:

- `FIT`: role, scope, and technical leadership context match the ICP.
- `PAIN`: a confirmed current incident exists.
- `NOW`: a credible trigger or cost makes action timely.
- `INTENT`: the user indicates willingness to discuss or continue later.

Email capture is not DQL by itself.

## Routes

| Route | Required signals | User outcome |
| --- | --- | --- |
| `TALK_NOW` | FIT + PAIN + NOW + intent to discuss | Show diagnosis and accept a `request_to_talk` with context and attribution preserved. |
| `NURTURE` | FIT + PAIN, but NOW or intent is weak | Show diagnosis, preserve pattern/context, and offer an approved follow-up path. |
| `NO_FIT` | ICP mismatch or no confirmed pain | Give a useful self-serve next step without pushing a sales conversation. |
| `INSUFFICIENT_EVIDENCE` | Mirror rejected or evidence remains ambiguous | State uncertainty, ask one clarifying question, or return a bounded experiment. |

## Invariants

- Routing is derived from state and signals, never from a static CTA.
- `request_to_talk` is the only V1 commercial handoff.
- No route claims a report was delivered until the server confirms creation.
- Retry is idempotent by lead/session key.
- Failure always leaves a visible recovery path and a direct contact option.

