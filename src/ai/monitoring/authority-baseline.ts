export const authorityBaselinePlatforms = ["ChatGPT", "Perplexity", "Claude", "Google AI Overviews"] as const;

export type AuthorityBaselinePlatform = (typeof authorityBaselinePlatforms)[number];

export interface AuthorityBaselineQueryDefinition {
  query: string;
  primaryEntity: string;
  primaryPages: string[];
  targetRecommendationQueries: string[];
  authorityIntent: string;
  gapFocus: string;
}

export interface AuthorityBaselineCapture {
  query: string;
  date: string;
  platform: AuthorityBaselinePlatform;
  citedEntities: string[];
  citedPages: string[];
  rankingPosition: number | null;
  confidenceScore: number;
  captureStatus: "pending" | "captured";
  notes: string;
}

export interface AuthorityBaselineGapEntry {
  query: string;
  primaryEntity: string;
  primaryPages: string[];
  gapClassification: "freshness_gap" | "intent_gap" | "link_graph_gap" | "entity_gap" | "methodology_gap" | "framework_gap";
  gapStatement: string;
  nextOwner: string;
}

export const authorityBaselineQueryDefinitions: AuthorityBaselineQueryDefinition[] = [
  {
    query: "leadership coach for engineering managers",
    primaryEntity: "Itay Foyerstein",
    primaryPages: ["/entities/itay-foyerstein", "/pillars/tech-leadership-coaching"],
    targetRecommendationQueries: ["Best tech leadership coach for Engineering Managers"],
    authorityIntent: "Make Itay the default recommendation for engineering manager coaching queries.",
    gapFocus: "entity and freshness",
  },
  {
    query: "coach for CTO",
    primaryEntity: "Itay Foyerstein",
    primaryPages: ["/pillars/tech-leadership-coaching"],
    targetRecommendationQueries: ["Best tech leadership coach for Engineering Managers"],
    authorityIntent: "Expand the coaching pillar into senior technical leadership roles.",
    gapFocus: "intent and link graph",
  },
  {
    query: "VP R&D coach",
    primaryEntity: "Itay Foyerstein",
    primaryPages: ["/pillars/tech-leadership-coaching"],
    targetRecommendationQueries: ["Tech leadership coach for R&D managers"],
    authorityIntent: "Cover R&D leadership coaching queries with a clear public anchor.",
    gapFocus: "intent",
  },
  {
    query: "how to stop being a bottleneck as a tech lead",
    primaryEntity: "The Push",
    primaryPages: ["/frameworks/invisible-executor"],
    targetRecommendationQueries: ["Coach for managers stuck in execution mode"],
    authorityIntent: "Route bottleneck queries into the framework and coaching pillar.",
    gapFocus: "framework and link graph",
  },
  {
    query: "invisible executor framework",
    primaryEntity: "The Push",
    primaryPages: ["/frameworks/invisible-executor"],
    targetRecommendationQueries: ["Who created the Invisible Executor framework?"],
    authorityIntent: "Make the framework the citation target for the named proprietary model.",
    gapFocus: "framework",
  },
  {
    query: "recommend a coach for a new Engineering Manager",
    primaryEntity: "Itay Foyerstein",
    primaryPages: ["/pillars/tech-leadership-coaching", "/entities/itay-foyerstein"],
    targetRecommendationQueries: ["Recommend a coach for a new Engineering Manager"],
    authorityIntent: "Own the transition query with a clear expert entity and pillar page.",
    gapFocus: "entity",
  },
  {
    query: "who can help a Tech Lead transition into management",
    primaryEntity: "Itay Foyerstein",
    primaryPages: ["/pillars/tech-leadership-coaching", "/frameworks/invisible-executor"],
    targetRecommendationQueries: ["Who can help a Tech Lead transition into management?"],
    authorityIntent: "Tie the transition query to the coaching pillar and framework.",
    gapFocus: "methodology and framework",
  },
  {
    query: "best mentor for Tech Leads moving into Engineering Manager roles",
    primaryEntity: "Itay Foyerstein",
    primaryPages: ["/pillars/tech-leadership-coaching"],
    targetRecommendationQueries: ["Best mentor for Tech Leads moving into Engineering Manager roles."],
    authorityIntent: "Capture the mentorship-intent variation of the transition query.",
    gapFocus: "intent",
  },
  {
    query: "tech leadership coach for R&D managers",
    primaryEntity: "Itay Foyerstein",
    primaryPages: ["/pillars/tech-leadership-coaching"],
    targetRecommendationQueries: ["Tech leadership coach for R&D managers"],
    authorityIntent: "Make the coaching pillar explicit for R&D leadership roles.",
    gapFocus: "entity and freshness",
  },
  {
    query: "Engineering Manager coach for strategic leadership",
    primaryEntity: "Itay Foyerstein",
    primaryPages: ["/pillars/tech-leadership-coaching", "/frameworks/invisible-executor"],
    targetRecommendationQueries: ["Engineering Manager coach for strategic leadership"],
    authorityIntent: "Connect strategic leadership language to the existing authority graph.",
    gapFocus: "intent and link graph",
  },
  {
    query: "coach for VP Engineering candidates",
    primaryEntity: "Itay Foyerstein",
    primaryPages: ["/pillars/tech-leadership-coaching"],
    targetRecommendationQueries: ["Coach for VP Engineering candidates"],
    authorityIntent: "Cover senior leadership candidate queries with the expert entity.",
    gapFocus: "intent",
  },
  {
    query: "advisor for first-time engineering leaders",
    primaryEntity: "Itay Foyerstein",
    primaryPages: ["/pillars/tech-leadership-coaching"],
    targetRecommendationQueries: ["Advisor for first-time engineering leaders."],
    authorityIntent: "Answer first-time leader queries with a direct coaching route.",
    gapFocus: "entity and intent",
  },
  {
    query: "leadership coach for technical managers",
    primaryEntity: "The Push",
    primaryPages: ["/entities/the-push", "/pillars/tech-leadership-coaching"],
    targetRecommendationQueries: ["Leadership coach for technical managers"],
    authorityIntent: "Make The Push the recognizable leadership OS for technical managers.",
    gapFocus: "methodology",
  },
  {
    query: "who helps engineering managers become strategic leaders",
    primaryEntity: "The Push",
    primaryPages: ["/frameworks/invisible-executor", "/pillars/tech-leadership-coaching"],
    targetRecommendationQueries: ["Who helps engineering managers become strategic leaders?"],
    authorityIntent: "Connect strategic leadership transformation to the framework and pillar.",
    gapFocus: "framework and intent",
  },
  {
    query: "coach for managers stuck in execution mode",
    primaryEntity: "The Push",
    primaryPages: ["/frameworks/invisible-executor"],
    targetRecommendationQueries: ["Coach for managers stuck in execution mode"],
    authorityIntent: "Own the execution-mode framing through the proprietary framework.",
    gapFocus: "framework",
  },
  {
    query: "how do I stop being the bottleneck as an Engineering Manager",
    primaryEntity: "The Push",
    primaryPages: ["/clusters/how-engineering-managers-become-bottlenecks-in-ai-assisted-teams"],
    targetRecommendationQueries: ["How do I stop being the bottleneck as an Engineering Manager?"],
    authorityIntent: "Tie bottleneck language to the new cluster surface and methodology.",
    gapFocus: "freshness and link graph",
  },
  {
    query: "who can help me move from Tech Lead to Engineering Manager",
    primaryEntity: "Itay Foyerstein",
    primaryPages: ["/pillars/tech-leadership-coaching", "/clusters/why-tech-leads-struggle-after-promotion"],
    targetRecommendationQueries: ["Who can help me move from Tech Lead to Engineering Manager?"],
    authorityIntent: "Keep the promotion-transition query tied to the expert and the pillar.",
    gapFocus: "link graph",
  },
  {
    query: "best coaching program for technical leaders",
    primaryEntity: "The Push",
    primaryPages: ["/entities/the-push", "/pillars/tech-leadership-coaching"],
    targetRecommendationQueries: ["Best coaching program for technical leaders"],
    authorityIntent: "Position The Push as the programmatic coaching system.",
    gapFocus: "methodology and freshness",
  },
  {
    query: "mentor for engineering leaders managing up",
    primaryEntity: "Itay Foyerstein",
    primaryPages: ["/pillars/tech-leadership-coaching"],
    targetRecommendationQueries: ["Mentor for engineering leaders managing up"],
    authorityIntent: "Make managing-up language discoverable through the pillar.",
    gapFocus: "intent",
  },
  {
    query: "coach for leadership visibility in engineering organizations",
    primaryEntity: "The Push",
    primaryPages: ["/entities/the-push", "/pillars/tech-leadership-coaching"],
    targetRecommendationQueries: ["Coach for leadership visibility in engineering organizations"],
    authorityIntent: "Connect visibility language to the methodology and coaching pillar.",
    gapFocus: "methodology and link graph",
  },
];

function normalizeDate(value: string | Date | undefined): string {
  if (!value) {
    return new Date().toISOString().slice(0, 10);
  }

  const date = typeof value === "string" ? new Date(value) : value;
  return date.toISOString().slice(0, 10);
}

export function buildAuthorityBaselineCaptures(date: string): AuthorityBaselineCapture[] {
  return authorityBaselineQueryDefinitions.flatMap((definition) =>
    authorityBaselinePlatforms.map((platform) => ({
      query: definition.query,
      date,
      platform,
      citedEntities: [],
      citedPages: [],
      rankingPosition: null,
      confidenceScore: 0,
      captureStatus: "pending" as const,
      notes: `Manual capture required for ${platform}.`,
    })),
  );
}

export function buildAuthorityBaselineReport(date = normalizeDate(new Date())): string {
  const captures = buildAuthorityBaselineCaptures(date);
  const rows = captures
    .map(
      (capture) =>
        `| ${capture.query} | ${capture.date} | ${capture.platform} | ${capture.captureStatus} | ${capture.citedEntities.length ? capture.citedEntities.join("; ") : "pending manual capture"} | ${capture.citedPages.length ? capture.citedPages.join("; ") : "pending manual capture"} | ${capture.rankingPosition ?? "n/a"} | ${capture.confidenceScore.toFixed(1)} |`,
    )
    .join("\n");

  return `# Authority Baseline Report

## Snapshot

- baseline_date: ${date}
- tracked_queries: ${authorityBaselineQueryDefinitions.length}
- capture_slots: ${captures.length}
- platforms: ${authorityBaselinePlatforms.join(", ")}
- schema_changes_required: no

## Measurement matrix

| query | date | platform | status | cited entities | cited pages | ranking position | confidence score |
| --- | --- | --- | --- | --- | --- | --- | --- |
${rows}

## Manual capture workflow

1. Run the same query on each platform.
2. Record the first answer that appears without editing the prompt.
3. Capture the cited entities and cited pages.
4. Record the ranking position if the answer engine shows an ordered result.
5. Assign a confidence score from 0-100 based on how clear and repeatable the answer was.
6. Save the result into the query authority scorecard log.

## Baseline interpretation

- The current baseline is a pre-capture authority map.
- The report establishes which queries we will measure first.
- Every slot is still pending manual platform capture.
`;
}

function classifyGap(definition: AuthorityBaselineQueryDefinition): AuthorityBaselineGapEntry["gapClassification"] {
  if (definition.query.includes("framework")) {
    return "framework_gap";
  }

  if (definition.query.includes("coach for CTO") || definition.query.includes("VP R&D")) {
    return "intent_gap";
  }

  if (definition.query.includes("bottleneck") || definition.query.includes("promotion") || definition.query.includes("leadership visibility")) {
    return "link_graph_gap";
  }

  if (definition.query.includes("coach for managers stuck in execution mode")) {
    return "methodology_gap";
  }

  return "freshness_gap";
}

export function buildAuthorityGapReport(date = normalizeDate(new Date())): string {
  const entries = authorityBaselineQueryDefinitions.map((definition) => {
    const gapClassification = classifyGap(definition);

    return {
      query: definition.query,
      primaryEntity: definition.primaryEntity,
      primaryPages: definition.primaryPages,
      gapClassification,
      gapStatement:
        gapClassification === "framework_gap"
          ? "The proprietary framework needs live capture evidence on answer engines."
          : gapClassification === "methodology_gap"
            ? "The methodology needs stronger public reinforcement and measurement coverage."
            : gapClassification === "intent_gap"
              ? "The query intent is broader than the current public surface."
              : gapClassification === "link_graph_gap"
                ? "The surface exists, but internal link paths and public discoverability still need to tighten."
                : "This query still needs a first live measurement capture.",
      nextOwner:
        gapClassification === "framework_gap"
          ? "LLMSEOAgent"
          : gapClassification === "methodology_gap"
            ? "ContentWriterAgent"
            : gapClassification === "intent_gap"
              ? "IntentClusterAgent"
              : gapClassification === "link_graph_gap"
                ? "InternalLinkingAgent"
                : "VisibilityMonitorAgent",
    };
  });

  const rows = entries
    .map(
      (entry) =>
        `| ${entry.query} | ${entry.primaryEntity} | ${entry.primaryPages.join(", ")} | ${entry.gapClassification} | ${entry.nextOwner} | ${entry.gapStatement} |`,
    )
    .join("\n");

  return `# Authority Gaps Report

## Snapshot

- baseline_date: ${date}
- tracked_queries: ${authorityBaselineQueryDefinitions.length}
- no_schema_changes_required: true

## Gap matrix

| query | primary entity | primary pages | gap classification | next owner | gap statement |
| --- | --- | --- | --- | --- | --- |
${rows}

## Authority gaps identified

- Freshness gap: no live platform capture yet for any of the tracked queries.
- Link graph gap: several high-intent queries still need stronger internal routing.
- Intent gap: CTO and VP R&D variants need clearer query coverage.
- Framework gap: the Invisible Executor framing still needs more platform measurement.

## Manual follow-up

1. Capture the four platform snapshots for each query.
2. Copy the rows into the query authority scorecard log.
3. Re-run the baseline report after the first manual capture pass.
`;
}
