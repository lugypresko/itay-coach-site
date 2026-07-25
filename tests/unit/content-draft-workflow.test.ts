import { describe, expect, it } from "vitest";

import { createContentDraftWorkflow } from "../../src/ai/workflows";
import type { SemanticQualityEvaluation } from "../../src/ai/governance/content-quality-gate";

const passingSemanticEvaluation: SemanticQualityEvaluation = {
  dimensions: [
    { dimension: "clarity", score: 4, passed: true, reason: "The opening gives a direct definition and keeps the operating shift easy to follow." },
    { dimension: "depth", score: 4, passed: true, reason: "The draft explains why private operating rules keep decisions returning to one leader." },
    { dimension: "usefulness", score: 4, passed: true, reason: "The reader receives a concrete next step for exposing one repeated decision rule." },
    { dimension: "differentiation", score: 4, passed: true, reason: "The Invisible Executor framework provides a named first-party operating model." },
    { dimension: "repetition", score: 4, passed: true, reason: "The definition and operating-model explanation make separate contributions." },
    { dimension: "audience_fit", score: 5, passed: true, reason: "The examples focus on technical leaders, reviews, and team decision ownership." },
    { dimension: "persuasion", score: 4, passed: true, reason: "The fit-call invitation follows a diagnostic explanation and states who it serves." },
    { dimension: "authority_strength", score: 4, passed: true, reason: "The framework claim is bounded by an approved insight and first-party source." },
  ],
};

const testContentDecision = {
  id: "decision-workflow-test",
  decisionVersion: 1,
  pagePatternId: "conversion_landing_page" as const,
  contentArchetype: "conversion" as const,
  primaryAudienceEntityId: "engineering-manager",
  primaryProblemId: "execution-bottleneck",
  symptomIds: ["approval-dependency"],
  primaryFrameworkEntityId: "invisible-executor-framework",
  primaryOfferId: "the-push-coaching",
  primaryCtaId: "book-fit-call",
  journeyStage: "coach_intent" as const,
  claimIds: ["claim-leaders-become-default-route"],
  evidenceIds: ["evidence-approved-insight-player-trap"],
  canonicalPath: "/clusters/tech-leadership-coaching",
  sourceInsightIds: ["approved-insight-player-trap-05"],
  status: "active" as const,
  lastValidatedAt: "2026-06-05T00:00:00.000Z",
  validationStatus: "valid" as const,
};

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
        maturity: "scaffold",
      },
      sourceNode: {
        slug: "tech-leadership-coaching",
        title: "Tech Leadership Coaching",
        kind: "pillar",
        entityTags: ["tech_leadership_coach"],
        targetRecommendationQueries: ["Best tech leadership coach for Engineering Managers"],
      },
      candidateNodes: [],
      pageBrief: {
        id: "page-brief-1",
        sourceInsightIds: ["insight-1"],
        title: "Tech Leadership Coaching",
        canonicalPath: "/clusters/tech-leadership-coaching",
        reviewStatus: "draft",
        marketContext: {
          summary: "Technical leaders need coaching when execution load keeps returning to one person.",
          marketMap: ["tech leadership coaching"],
          trendList: ["AI-assisted reviews"],
          riskNotes: ["Do not write generic leadership advice."],
        },
        audiencePain: {
          summary: "execution-bottleneck",
          painThemes: ["execution dependency"],
          workarounds: ["more process"],
          triggerEvents: ["the team waits for the leader"],
        },
        searchIntent: {
          summary: "Best tech leadership coach for Engineering Managers",
          intentClusters: ["coach intent"],
          priorityQueries: ["Best tech leadership coach for Engineering Managers"],
        },
        topicClusterPosition: {
          summary: "Core coaching pillar.",
          pillar: "/pillars/tech-leadership-coaching",
          cluster: "/clusters/tech-leadership-coaching",
          clusterRole: "supporting authority page",
          internalLinks: ["/pillars/tech-leadership-coaching", "/frameworks/invisible-executor"],
        },
        uniqueAngle: "Tech leaders need operating leverage, not more hustle.",
        proofNeeded: ["Fresh insight"],
        pagePromise: "A clear coaching page for technical leaders.",
        contentPlan: [
          {
            sectionTitle: "Short answer",
            purpose: "Answer the query directly.",
            proofNeeded: ["Fresh insight"],
          },
          {
            sectionTitle: "What this pattern looks like",
            purpose: "Show the reader the operating pattern.",
            proofNeeded: ["Fresh insight"],
          },
        ],
        cta: {
          label: "Book a fit call",
          href: "/book-a-fit-call",
          rationale: "Route readers to a human conversation.",
        },
      },
      now: "2026-06-07T00:00:00.000Z",
      semanticQualityEvaluation: passingSemanticEvaluation,
      canonicalOwnerPath: "/clusters/tech-leadership-coaching",
      knownCollidingIntentKeys: [],
      contentDecision: testContentDecision,
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
        excerpt: "Framework page for leaders moving from hidden execution into visible operating leverage.",
        content: [
          "## Short answer",
          "Invisible Executor is the starting point for technical leaders whose execution strength still hides the real operating model. Who created the Invisible Executor framework? This page answers that question and explains what it changes.",
          "",
          "## What this framework changes",
          "The framework moves the leader from hidden execution into visible operating rules that the team can use without waiting for one person.",
          "That shift matters because authority becomes reusable only when the leader's decisions are expressed as operating rules instead of private expertise, letting the team act without routing every choice back to one person.",
          "",
          "## Internal links",
          "Connect this diagnosis to [Tech Leadership Coaching](/pillars/tech-leadership-coaching) and the related [Player Trap framework](/frameworks/player-trap).",
          "",
          "## CTA",
          "If execution still routes through you, [Book a fit call](/book-a-fit-call) to decide whether this coaching path fits your situation.",
          "",
          "## Evidence",
          "Fresh insight.",
        ].join("\n"),
        aiSummary: "Framework summary.",
        citationSnippet: "Invisible Executor is part of The Push framework stack owned by Itay Foyerstein.",
        author: "Itay Foyerstein",
        entityTags: ["itay_foyerstein", "the_push"],
        targetRecommendationQueries: ["Who created the Invisible Executor framework?"],
        schemaType: "HowTo",
        evidenceUrls: ["docs/seed-content/invisible-executor-framework.md"],
        claimEvidenceMappings: [
          {
            claim: "Fresh insight.",
            evidenceType: "approved_insight",
            sourceReference: "https://example.com",
            approvedInsightIds: ["insight-1"],
            valid: true,
          },
        ],
        maturity: "complete_draft",
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
      pageBrief: {
        id: "page-brief-2",
        sourceInsightIds: ["insight-1"],
        title: "Invisible Executor",
        canonicalPath: "/clusters/invisible-executor",
        reviewStatus: "draft",
        marketContext: {
          summary: "Technical leaders need a clear operating model.",
          marketMap: ["framework"],
          trendList: ["AI-era leadership"],
          riskNotes: ["Keep the claim bounded."],
        },
        audiencePain: {
          summary: "execution-bottleneck",
          painThemes: ["hidden load"],
          workarounds: ["more reviews"],
          triggerEvents: ["the leader becomes the final reviewer"],
        },
        searchIntent: {
          summary: "Who created the Invisible Executor framework?",
          intentClusters: ["framework intent"],
          priorityQueries: ["Who created the Invisible Executor framework?"],
        },
        topicClusterPosition: {
          summary: "Framework page.",
          pillar: "/pillars/tech-leadership-coaching",
          cluster: "/clusters/invisible-executor",
          clusterRole: "framework surface",
          internalLinks: ["/pillars/tech-leadership-coaching", "/frameworks/player-trap"],
        },
        uniqueAngle: "Move from execution to visible leadership.",
        proofNeeded: ["Fresh insight."],
        pagePromise: "Explain who owns the framework and what it changes.",
        contentPlan: [
          {
            sectionTitle: "Short answer",
            purpose: "Answer the query directly.",
            proofNeeded: ["Fresh insight."],
          },
          {
            sectionTitle: "What this framework changes",
            purpose: "Explain the operating shift.",
            proofNeeded: ["Fresh insight."],
          },
        ],
        cta: {
          label: "Book a fit call",
          href: "/book-a-fit-call",
          rationale: "Invite a human conversation.",
        },
      },
      now: "2026-06-07T00:00:00.000Z",
      semanticQualityEvaluation: passingSemanticEvaluation,
      canonicalOwnerPath: "/clusters/invisible-executor",
      knownCollidingIntentKeys: [],
      contentDecision: { ...testContentDecision, canonicalPath: "/clusters/invisible-executor" },
    });

    expect(result.readiness.canGenerate).toBe(true);
    expect(result.contentMaturity).toBe("review_ready");
    expect(result.saveStatus).toBe("review_ready");
    expect(result.compliance?.passed).toBe(true);
    expect(result.draft?.maturity).toBe("review_ready");
    expect(result.agentRuns.some((run) => run.agentName === "InternalLinkingAgent")).toBe(true);
    expect(result.linkSuggestions.length).toBeGreaterThanOrEqual(0);
  });
});
