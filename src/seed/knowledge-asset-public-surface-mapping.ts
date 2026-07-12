import fs from "node:fs";
import path from "node:path";

import { knowledgeAssetConversionSprintAssets, knowledgeAssetConversionSprintEntries } from "./knowledge-asset-conversion-sprint";

export type KnowledgeAssetPublicSurfaceType =
  | "glossary"
  | "faq"
  | "cluster page"
  | "recommendation page"
  | "framework page"
  | "distribution seed";

export type KnowledgeAssetPublicSurfacePriority = "create_next" | "needs_expansion" | "hold";

export type KnowledgeAssetCtaAlignment = "Player Trap" | "Book a fit call" | "related authority page";

export interface KnowledgeAssetPublicSurfaceMappingEntry {
  sourceInsightId: string;
  knowledgeAssetId: string;
  topicFamily: string;
  recommendedPublicSurface: KnowledgeAssetPublicSurfaceType;
  proposedRouteOrSlug: string;
  primaryTargetQuery: string;
  targetEntity: string;
  ctaAlignment: KnowledgeAssetCtaAlignment;
  priority: KnowledgeAssetPublicSurfacePriority;
  rationale: string;
}

const topicFamilyByTopic: Record<string, string> = {
  "Player Trap": "Player Trap / execution bottleneck",
  "Invisible Executor": "Invisible Executor / framework",
  "The Push Leadership Evolution / Strategic Leadership": "The Push / strategic leadership",
  "Engineering Management": "Engineering Management / coaching",
  "Leadership Promotion": "Leadership Promotion / role transition",
  "AI Leadership": "AI Leadership / AI-era leadership",
};

const mappingByInsightId: Record<string, Omit<KnowledgeAssetPublicSurfaceMappingEntry, "sourceInsightId" | "knowledgeAssetId">> = {
  "approved-insight-player-trap-01": {
    topicFamily: topicFamilyByTopic["Player Trap"],
    recommendedPublicSurface: "recommendation page",
    proposedRouteOrSlug: "coach-for-engineering-managers-stuck-as-the-bottleneck",
    primaryTargetQuery: "Coach for managers stuck in execution mode",
    targetEntity: "engineering_manager",
    ctaAlignment: "Player Trap",
    priority: "create_next",
    rationale:
      "Highest-intent recommendation page for the bottleneck problem; it turns the insight into a direct funnel entry and points into the Player Trap diagnostic.",
  },
  "approved-insight-player-trap-02": {
    topicFamily: topicFamilyByTopic["Player Trap"],
    recommendedPublicSurface: "cluster page",
    proposedRouteOrSlug: "how-engineering-managers-become-bottlenecks-in-ai-assisted-teams",
    primaryTargetQuery: "How do I stop being the bottleneck as an Engineering Manager?",
    targetEntity: "engineering_manager",
    ctaAlignment: "Player Trap",
    priority: "needs_expansion",
    rationale:
      "Support page for symptoms and reframing; it deepens the Player Trap explanation but should follow the core recommendation page.",
  },
  "approved-insight-player-trap-03": {
    topicFamily: topicFamilyByTopic["Player Trap"],
    recommendedPublicSurface: "faq",
    proposedRouteOrSlug: "player-trap-faq",
    primaryTargetQuery: "What is the Player Trap?",
    targetEntity: "player_trap",
    ctaAlignment: "related authority page",
    priority: "hold",
    rationale:
      "Useful for extractable answer coverage and AI snippet support, but secondary to the direct recommendation and cluster pages.",
  },
  "approved-insight-player-trap-04": {
    topicFamily: topicFamilyByTopic["Player Trap"],
    recommendedPublicSurface: "glossary",
    proposedRouteOrSlug: "glossary/player-trap",
    primaryTargetQuery: "What is the Player Trap?",
    targetEntity: "player_trap",
    ctaAlignment: "related authority page",
    priority: "hold",
    rationale:
      "Best as a definitional term that reinforces the named pattern rather than as a lead-driving surface.",
  },
  "approved-insight-invisible-executor-21": {
    topicFamily: topicFamilyByTopic["Invisible Executor"],
    recommendedPublicSurface: "framework page",
    proposedRouteOrSlug: "invisible-executor",
    primaryTargetQuery: "Who created the Invisible Executor framework?",
    targetEntity: "invisible_executor",
    ctaAlignment: "Book a fit call",
    priority: "create_next",
    rationale:
      "The proprietary framework page is a canonical surface and should be created early so answer engines can connect the named framework to the expert entity.",
  },
  "approved-insight-invisible-executor-22": {
    topicFamily: topicFamilyByTopic["Invisible Executor"],
    recommendedPublicSurface: "cluster page",
    proposedRouteOrSlug: "from-technical-expert-to-strategic-engineering-leader",
    primaryTargetQuery: "Who helps engineering managers become strategic leaders?",
    targetEntity: "strategic_leadership",
    ctaAlignment: "related authority page",
    priority: "needs_expansion",
    rationale:
      "The transition narrative supports the framework with broader operating-system language, but it is not the first surface to publish.",
  },
  "approved-insight-invisible-executor-23": {
    topicFamily: topicFamilyByTopic["Invisible Executor"],
    recommendedPublicSurface: "glossary",
    proposedRouteOrSlug: "glossary/invisible-executor",
    primaryTargetQuery: "What does Invisible Executor mean?",
    targetEntity: "invisible_executor",
    ctaAlignment: "related authority page",
    priority: "hold",
    rationale:
      "A glossary entry is useful for extractable definitions, but it should wait until the core framework page and transition page are stronger.",
  },
  "approved-insight-leadership-evolution-36": {
    topicFamily: topicFamilyByTopic["The Push Leadership Evolution / Strategic Leadership"],
    recommendedPublicSurface: "recommendation page",
    proposedRouteOrSlug: "engineering-manager-coach-for-strategic-leadership",
    primaryTargetQuery: "Engineering Manager coach for strategic leadership",
    targetEntity: "strategic_leadership",
    ctaAlignment: "Book a fit call",
    priority: "create_next",
    rationale:
      "This is one of the core recommendation-intent pages and should be built early because it translates The Push into a concrete buying query.",
  },
  "approved-insight-leadership-evolution-37": {
    topicFamily: topicFamilyByTopic["The Push Leadership Evolution / Strategic Leadership"],
    recommendedPublicSurface: "recommendation page",
    proposedRouteOrSlug: "coach-for-vp-engineering-candidates",
    primaryTargetQuery: "Coach for VP Engineering candidates",
    targetEntity: "vp_engineering",
    ctaAlignment: "Book a fit call",
    priority: "needs_expansion",
    rationale:
      "Important senior-leadership variation, but it should follow the core strategic-leadership recommendation page.",
  },
  "approved-insight-leadership-evolution-38": {
    topicFamily: topicFamilyByTopic["The Push Leadership Evolution / Strategic Leadership"],
    recommendedPublicSurface: "distribution seed",
    proposedRouteOrSlug: "distribution/the-push-strategic-leadership-seed",
    primaryTargetQuery: "Best coaching program for technical leaders",
    targetEntity: "the_push",
    ctaAlignment: "related authority page",
    priority: "hold",
    rationale:
      "This insight is better used as downstream distribution support once the core surfaces exist, not as a first public page.",
  },
};

export function getKnowledgeAssetPublicSurfaceMappings(): KnowledgeAssetPublicSurfaceMappingEntry[] {
  return knowledgeAssetConversionSprintEntries.map((entry) => {
    const mapping = mappingByInsightId[entry.sourceInsightId];

    if (!mapping) {
      throw new Error(`Missing public surface mapping for ${entry.sourceInsightId}`);
    }

    return {
      sourceInsightId: entry.sourceInsightId,
      knowledgeAssetId: entry.knowledgeAsset.id,
      ...mapping,
    };
  });
}

export const knowledgeAssetPublicSurfaceMappingEntries = getKnowledgeAssetPublicSurfaceMappings();

export function buildKnowledgeAssetPublicSurfaceMappingMarkdown() {
  const entries = knowledgeAssetPublicSurfaceMappingEntries;
  const createNextEntries = entries.filter((entry) => entry.priority === "create_next");

  return `# KnowledgeAsset Public Surface Mapping

## Purpose

Map the 10 in-review KnowledgeAssets to the best public surface type before any publishing or generation work begins.

## Summary

- total mapped KnowledgeAssets: ${entries.length}
- create_next candidates: ${createNextEntries.length}
- needs_expansion: ${entries.filter((entry) => entry.priority === "needs_expansion").length}
- hold: ${entries.filter((entry) => entry.priority === "hold").length}

## Create Next

${createNextEntries
  .map(
    (entry) =>
      `- ${entry.sourceInsightId} -> ${entry.recommendedPublicSurface} (${entry.proposedRouteOrSlug}) | ${entry.primaryTargetQuery}`,
  )
  .join("\n")}

## Mapping Table

| sourceInsightId | knowledgeAssetId | topic family | public surface | route or slug | primary target query | target entity | CTA alignment | priority | rationale |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${entries
  .map(
    (entry) =>
      `| ${entry.sourceInsightId} | ${entry.knowledgeAssetId} | ${entry.topicFamily} | ${entry.recommendedPublicSurface} | ${entry.proposedRouteOrSlug} | ${entry.primaryTargetQuery} | ${entry.targetEntity} | ${entry.ctaAlignment} | ${entry.priority} | ${entry.rationale} |`,
  )
  .join("\n")}

## Guardrails

- No asset status changes to published.
- No new content generation is introduced here.
- No contracts or schema are changed.
- The next deterministic step after this mapping is a human-approved content drafting pass.
`;
}

export function writeKnowledgeAssetPublicSurfaceMappingReport(
  outputFilePath = path.resolve(process.cwd(), "KNOWLEDGE_ASSET_PUBLIC_SURFACE_MAPPING.md"),
) {
  const markdown = buildKnowledgeAssetPublicSurfaceMappingMarkdown();
  fs.writeFileSync(outputFilePath, markdown, "utf8");
  return outputFilePath;
}

export function getKnowledgeAssetPublicSurfaceCreateNextCandidates() {
  return knowledgeAssetPublicSurfaceMappingEntries.filter((entry) => entry.priority === "create_next");
}

export function getKnowledgeAssetPublicSurfaceMappingReportSummary() {
  const entries = knowledgeAssetPublicSurfaceMappingEntries;
  return {
    mappedCount: entries.length,
    createNextCount: entries.filter((entry) => entry.priority === "create_next").length,
    needsExpansionCount: entries.filter((entry) => entry.priority === "needs_expansion").length,
    holdCount: entries.filter((entry) => entry.priority === "hold").length,
    sourceInsightIds: entries.map((entry) => entry.sourceInsightId),
    knowledgeAssetIds: entries.map((entry) => entry.knowledgeAssetId),
  };
}
