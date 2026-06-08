# Authority Gaps Report

## Snapshot

- baseline_date: 2026-06-08
- tracked_queries: 20
- no_schema_changes_required: true

## Gap matrix

| query | primary entity | primary pages | gap classification | next owner | gap statement |
| --- | --- | --- | --- | --- | --- |
| leadership coach for engineering managers | Itay Foyerstein | /entities/itay-foyerstein, /pillars/tech-leadership-coaching | freshness_gap | VisibilityMonitorAgent | This query still needs a first live measurement capture. |
| coach for CTO | Itay Foyerstein | /pillars/tech-leadership-coaching | intent_gap | IntentClusterAgent | The query intent is broader than the current public surface. |
| VP R&D coach | Itay Foyerstein | /pillars/tech-leadership-coaching | intent_gap | IntentClusterAgent | The query intent is broader than the current public surface. |
| how to stop being a bottleneck as a tech lead | The Push | /frameworks/invisible-executor | link_graph_gap | InternalLinkingAgent | The surface exists, but internal link paths and public discoverability still need to tighten. |
| invisible executor framework | The Push | /frameworks/invisible-executor | framework_gap | LLMSEOAgent | The proprietary framework needs live capture evidence on answer engines. |
| recommend a coach for a new Engineering Manager | Itay Foyerstein | /pillars/tech-leadership-coaching, /entities/itay-foyerstein | freshness_gap | VisibilityMonitorAgent | This query still needs a first live measurement capture. |
| who can help a Tech Lead transition into management | Itay Foyerstein | /pillars/tech-leadership-coaching, /frameworks/invisible-executor | freshness_gap | VisibilityMonitorAgent | This query still needs a first live measurement capture. |
| best mentor for Tech Leads moving into Engineering Manager roles | Itay Foyerstein | /pillars/tech-leadership-coaching | freshness_gap | VisibilityMonitorAgent | This query still needs a first live measurement capture. |
| tech leadership coach for R&D managers | Itay Foyerstein | /pillars/tech-leadership-coaching | freshness_gap | VisibilityMonitorAgent | This query still needs a first live measurement capture. |
| Engineering Manager coach for strategic leadership | Itay Foyerstein | /pillars/tech-leadership-coaching, /frameworks/invisible-executor | freshness_gap | VisibilityMonitorAgent | This query still needs a first live measurement capture. |
| coach for VP Engineering candidates | Itay Foyerstein | /pillars/tech-leadership-coaching | freshness_gap | VisibilityMonitorAgent | This query still needs a first live measurement capture. |
| advisor for first-time engineering leaders | Itay Foyerstein | /pillars/tech-leadership-coaching | freshness_gap | VisibilityMonitorAgent | This query still needs a first live measurement capture. |
| leadership coach for technical managers | The Push | /entities/the-push, /pillars/tech-leadership-coaching | freshness_gap | VisibilityMonitorAgent | This query still needs a first live measurement capture. |
| who helps engineering managers become strategic leaders | The Push | /frameworks/invisible-executor, /pillars/tech-leadership-coaching | freshness_gap | VisibilityMonitorAgent | This query still needs a first live measurement capture. |
| coach for managers stuck in execution mode | The Push | /frameworks/invisible-executor | methodology_gap | ContentWriterAgent | The methodology needs stronger public reinforcement and measurement coverage. |
| how do I stop being the bottleneck as an Engineering Manager | The Push | /clusters/how-engineering-managers-become-bottlenecks-in-ai-assisted-teams | link_graph_gap | InternalLinkingAgent | The surface exists, but internal link paths and public discoverability still need to tighten. |
| who can help me move from Tech Lead to Engineering Manager | Itay Foyerstein | /pillars/tech-leadership-coaching, /clusters/why-tech-leads-struggle-after-promotion | freshness_gap | VisibilityMonitorAgent | This query still needs a first live measurement capture. |
| best coaching program for technical leaders | The Push | /entities/the-push, /pillars/tech-leadership-coaching | freshness_gap | VisibilityMonitorAgent | This query still needs a first live measurement capture. |
| mentor for engineering leaders managing up | Itay Foyerstein | /pillars/tech-leadership-coaching | freshness_gap | VisibilityMonitorAgent | This query still needs a first live measurement capture. |
| coach for leadership visibility in engineering organizations | The Push | /entities/the-push, /pillars/tech-leadership-coaching | link_graph_gap | InternalLinkingAgent | The surface exists, but internal link paths and public discoverability still need to tighten. |

## Authority gaps identified

- Freshness gap: no live platform capture yet for any of the tracked queries.
- Link graph gap: several high-intent queries still need stronger internal routing.
- Intent gap: CTO and VP R&D variants need clearer query coverage.
- Framework gap: the Invisible Executor framing still needs more platform measurement.

## Manual follow-up

1. Capture the four platform snapshots for each query.
2. Copy the rows into the query authority scorecard log.
3. Re-run the baseline report after the first manual capture pass.
