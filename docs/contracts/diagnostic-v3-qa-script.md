# Diagnostic V3 — fictional fill script and Groq verification

Use the feature/diagnostic-v3 Preview only. No real customer or employee details.
Groq verification is NOT established by a result appearing; deterministic fallback also produces a complete result.

## Scenario A: high-fit repeated decision dependency
1. Open /diagnostic. Start a new case in a fresh browser profile. Choose **Diagnose one current case**.
2. Q1: **A decision keeps coming back to me**. Next.
3. Q2: **The work would wait**. Next.
4. Q3: **One manager clearly owns it**. Next. Use Previous to confirm the selected answer stays marked; try Ownership is unclear, then restore One manager clearly owns it. Answers on other screens must remain.
5. Q4: **Yes, but they would probably check with me first**. Next.
6. Q5 duration: **More than 3 months**. Frequency: **Several times a week**. Next.
7. Q6: **Clarified who owns it** AND **Told the manager to decide without me**. Optional context: `The manager still asks for approval when the trade-off changes.` Next.
8. Q7: **Customer commitments**. Optional consequence: `The release date is at risk while two teams wait for a decision.` Next.
9. Q8: **My managers would own more**. Next.
10. Q9: `Two teams are waiting for a release decision. The assigned manager asks for approval each time the trade-off changes.` Click **Analyze my case** explicitly.
11. Partial read must appear before contact fields are submitted. Check that the evidence reflects your answers and does not invent a company/person/outcome. A cause must be presented as a hypothesis.
12. First name: `Fictional`; Email: `diagnostic-qa-20261023@example.com`; Company: `Fictional QA`. Submit **Show me the full read**.
13. Full Read must be visible BEFORE role/org size is supplied. It includes evidence, an alternative explanation only when supported, one move, one manager question, a 7-day experiment with a review point, an observable success signal and a genuinely unresolved question. It must acknowledge what was already tried.
14. Qualification: **VP R&D or Engineering**, **51–100**. Submit. Expected internal scoring: Fit 10, Pain 10, Urgency 10, Readiness 10, Total 40; conversation via rule 3_threshold. Scores must NOT appear in the visitor UI. Without configured scheduler, an honest unavailable message is expected, not a working booking claim.
15. Change role/org size using **Update role or org size**. This must not produce any further diagnostic_v3_analysis log or Groq call. **Skip for now** retains Full Read and stores unqualified_nurture with no booking CTA.
16. Refresh: current Full Read should restore on a warm Preview instance. With disposable_preview this does not prove restart/cross-instance persistence.
17. **Review all answers** -> change Q4 from checks to limited boundaries -> continue and explicitly analyze again. A new answer revision must receive both fresh passes. No stale result or completed->in_progress error. Existing identity should not need to be submitted again.
18. Request written read. Preview must say delivery was simulated; no email delivery claim. Do not book a real meeting during QA.

## Other routing checks
- Missing qualification: skip step 14. Full Read remains visible, route unqualified_nurture, no booking CTA, brief retained.
- Low pain: Q2 manager would probably handle it; Q7 probably not much; Q5 occasionally. After qualification -> self_service. If Other/free options require specificity, do not fabricate details.
- Low fit/high pain: use main scenario but role Other, size 51–100. Fit 4 / Total 34 -> nurture, never automatic booking.

## Proving Groq itself works
The Preview-only /api/diagnostic/v3/check runs two bounded server-side calls on a fixed fictional case. It accepts no customer data or caller-defined prompts. Cached/coalesced for 10 minutes per instance; unavailable in Production.
- PASS only when partial.source and full.source are both groq and groq_verified=true.
- HTTP 200 alone is NOT success: inspect source and fallback_reason.
- key_present is a boolean only. Never display, paste, log or screenshot a key.
- zdr_attested reports the environment flag, NOT independent verification of the Groq account's Data Controls.
- ai_disabled / zdr_unverified / missing_key: configuration prevents provider calls.
- http_401 / http_403: provider authorization rejected.
- http_429: provider quota/rate limit.
- timeout / provider_unavailable: request failed; fallback must preserve journey.
- invalid_json / invalid_schema / invalid_evidence / unsafe_output: response rejected; fallback content must be deterministic, never the rejected text.

For the ACTUAL visitor flow, inspect Preview runtime records named diagnostic_v3_analysis: one partial and one full source=groq for the active revision, with model, HTTP status and duration. Changing qualification produces no analysis record. These logs contain no identity, case text, key, cookie or session token. The synthetic check validates provider integration, not the browser flow or persistence.
