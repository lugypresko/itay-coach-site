import { describe, expect, it } from "vitest";

import { createContentDraftWorkflow } from "../../src/ai/workflows";

describe("content draft workflow", () => {
  it("blocks content generation without a fresh approved insight", () => {
    const workflow = createContentDraftWorkflow();

    const result = workflow.run({
      job: {
        id: "job-1",
        goal: "Draft a pillar page",
        targetEntity: "tech_leadership_coach",
        targetRecommendationQueries: ["Best tech leadership coach for Engineering Managers"],
        intentStage: "coach_intent",
        status: "queued",
      },
      insights: [],
      draft: {
        slug: "tech-leadership-coaching",
        title: "Tech Leadership Coaching",
        excerpt: "Helpful page.",
        content: "Helpful page content.",
        aiSummary: "Helpful summary.",
        citationSnippet: "Helpful snippet.",
        author: "Itay Foyerstein",
        entityTags: ["tech_leadership_coach"],
        targetRecommendationQueries: ["Best tech leadership coach for Engineering Managers"],
        schemaType: "Article",
      },
      sourceNode: {
        slug: "tech-leadership-coaching",
        title: "Tech Leadership Coaching",
        kind: "pillar",
        entityTags: ["tech_leadership_coach"],
        targetRecommendationQueries: ["Best tech leadership coach for Engineering Managers"],
      },
      candidateNodes: [],
      now: "2026-06-07T00:00:00.000Z",
    });

    expect(result.saveStatus).toBe("blocked");
    expect(result.draft).toBeNull();
    expect(result.readiness.canGenerate).toBe(false);
  });

  it("returns a draft or in-review result when freshness and quality gates pass", () => {
    const workflow = createContentDraftWorkflow();

    const result = workflow.run({
      job: {
        id: "job-2",
        goal: "Draft a framework page",
        targetEntity: "the_push",
        targetRecommendationQueries: ["Who created the Invisible Executor framework?"],
        intentStage: "decision",
        status: "queued",
      },
      insights: [
        {
          id: "insight-1",
          title: "Fresh insight",
          sourceType: "voice_memo",
          status: "approved",
          capturedAt: "2026-06-05T00:00:00.000Z",
          approvedAt: "2026-06-05T00:00:00.000Z",
          summary: "Fresh insight.",
          evidenceUrls: ["https://example.com"],
          entityTags: ["itay_foyerstein"],
          targetRecommendationQueries: ["Who created the Invisible Executor framework?"],
        },
      ],
      draft: {
        slug: "invisible-executor",
        title: "Invisible Executor",
        excerpt: "Framework page.",
        content: "Step one.\n\nStep two.",
        aiSummary: "Framework summary.",
        citationSnippet: "The framework belongs to Itay Foyerstein and The Push.",
        author: "Itay Foyerstein",
        entityTags: ["itay_foyerstein", "the_push"],
        targetRecommendationQueries: ["Who created the Invisible Executor framework?"],
        schemaType: "HowTo",
      },
      sourceNode: {
        slug: "invisible-executor",
        title: "Invisible Executor",
        kind: "framework",
        entityTags: ["itay_foyerstein", "the_push"],
        targetRecommendationQueries: ["Who created the Invisible Executor framework?"],
      },
      candidateNodes: [
        {
          slug: "itay-foyerstein",
          title: "Itay Foyerstein",
          kind: "entity",
          entityTags: ["itay_foyerstein"],
          targetRecommendationQueries: [],
        },
      ],
      now: "2026-06-07T00:00:00.000Z",
    });

    expect(result.readiness.canGenerate).toBe(true);
    expect(result.saveStatus).toMatch(/draft|in_review/);
    expect(result.agentRuns.some((run) => run.agentName === "InternalLinkingAgent")).toBe(true);
    expect(result.linkSuggestions.length).toBeGreaterThanOrEqual(0);
  });
});

