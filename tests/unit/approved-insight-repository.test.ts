import { describe, expect, it } from "vitest";

import { approvedInsightSchema } from "../../src/ai/agents";
import {
  approvedInsightRepository,
  countApprovedInsightsByTopic,
  getApprovedInsightsForTopic,
} from "../../src/ai/insights";

describe("approved insight repository", () => {
  it("contains the first 50 review-ready approved insights in the canonical topic mix", () => {
    expect(approvedInsightRepository).toHaveLength(50);

    const topicCounts = countApprovedInsightsByTopic();

    expect(topicCounts).toEqual({
      "Player Trap": 20,
      "Invisible Executor": 15,
      "The Push Leadership Evolution / Strategic Leadership": 7,
      "Engineering Management": 4,
      "Leadership Promotion": 2,
      "AI Leadership": 2,
    });
  });

  it("keeps every approved insight source-backed, fresh, and schema-valid", () => {
    const parsedInsights = approvedInsightRepository.map((insight) => approvedInsightSchema.parse(insight));
    const ids = new Set(parsedInsights.map((insight) => insight.id));

    expect(ids.size).toBe(50);

    for (const insight of parsedInsights) {
      expect(insight.status).toBe("approved");
      expect(insight.approvedBy).toBe("human reviewer");
      expect(insight.claims.length).toBeGreaterThanOrEqual(1);
      expect(insight.sourceTitle).toMatch(/^(docs|src|AGENT_FACTORY\.md|DATA_CONTRACTS\.md)/);
      expect(insight.targetQueries.length).toBeGreaterThanOrEqual(1);
      expect(insight.targetRecommendationQueries.length).toBeGreaterThanOrEqual(1);
      expect(insight.entityTags.length).toBeGreaterThanOrEqual(1);
      expect(new Date(insight.freshnessExpiresAt).getTime()).toBeGreaterThan(Date.now());
    }
  });

  it("can query insights by topic without mutating the repository", () => {
    const playerTrapInsights = getApprovedInsightsForTopic("Player Trap");

    expect(playerTrapInsights).toHaveLength(20);
    expect(playerTrapInsights.every((insight) => insight.id.startsWith("approved-insight-player-trap-"))).toBe(true);
    expect(approvedInsightRepository).toHaveLength(50);
  });
});
