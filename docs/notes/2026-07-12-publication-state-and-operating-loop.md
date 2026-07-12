# Publication State and Operating Loop Architecture Note

The loop heartbeat is a short deterministic evaluation invoked by one of five triggers: weekly observation, content published, measurement-window closed, material signal change, or manual trigger. It evaluates once and exits; it is not a daemon and contains no unbounded loop.

One persisted `OperatingCycle` record contains the dated `SystemSnapshot`, bottleneck diagnosis, exactly one Next Best Action, target IDs, owner, evidence requirements, human-approval gate, stop point, review date, and measurement-window status. No separate snapshot collection or per-agent execution records are introduced.

Deterministic code owns publication-state mapping, validation, schema and canonical eligibility, sitemap/`llms.txt` routing, freshness classification, scoring, trigger idempotency, cycle transitions, and measurement-window transitions. The three existing semantic agents remain the only semantic agents; they may extract, synthesize, or draft from approved knowledge, but cannot publish.

Human approval stops execution before any deployment or publication-state change. Local verification therefore records `measurement_window_status: pending_deployment`; only a verified authorized deployment opens the production measurement window.
