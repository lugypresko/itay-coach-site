import { describe, expect, it } from "vitest";
import { evaluateContentGenerationReadiness } from "../../src/ai/governance";

describe("content generation gate", () => {
  it("blocks generation when no approved Itay insight exists", () => {
    const readiness = evaluateContentGenerationReadiness({
      insights: [],
      now: "2026-06-07T00:00:00.000Z",
    });

    expect(readiness.canGenerate).toBe(false);
    expect(readiness.freshApprovedInsightCount).toBe(0);
    expect(readiness.reason).toMatch(/No approved Itay insight/);
  });

  it("blocks generation when the latest approved insight is stale", () => {
    const readiness = evaluateContentGenerationReadiness({
      insights: [
        {
          id: "insight-1",
          title: "Old insight",
          sourceType: "voice_memo",
          status: "approved",
          capturedAt: "2026-04-01T00:00:00.000Z",
          approvedAt: "2026-04-01T00:00:00.000Z",
          summary: "Old but approved.",
          evidenceUrls: [],
          entityTags: ["itay_foyerstein", "tech_leadership_coach"],
          targetRecommendationQueries: ["Best tech leadership coach for Engineering Managers"],
        },
      ],
      now: "2026-06-07T00:00:00.000Z",
      requiredFreshnessDays: 30,
    });

    expect(readiness.canGenerate).toBe(false);
    expect(readiness.daysSinceLatestInsight).toBeGreaterThan(30);
    expect(readiness.reason).toMatch(/claim-level evidence/);
  });

  it("allows generation when a fresh approved insight exists", () => {
    const readiness = evaluateContentGenerationReadiness({
      insights: [
        {
          id: "insight-1",
          title: "Fresh insight",
          sourceType: "voice_memo",
          status: "approved",
          capturedAt: "2026-06-01T00:00:00.000Z",
          approvedAt: "2026-06-01T00:00:00.000Z",
          summary: "Fresh Itay insight.",
          evidenceUrls: ["https://example.com"],
          entityTags: ["itay_foyerstein", "tech_leadership_coach"],
          targetRecommendationQueries: ["Best tech leadership coach for Engineering Managers"],
        },
      ],
      now: "2026-06-07T00:00:00.000Z",
      requiredFreshnessDays: 30,
    });

    expect(readiness.canGenerate).toBe(true);
    expect(readiness.latestInsightAt).toBe("2026-06-01T00:00:00.000Z");
    expect(readiness.freshApprovedInsightCount).toBe(1);
  });
});
