import { describe, expect, it } from "vitest";

import {
  agentRegistry,
  approvedInsightSchema,
  contentWriterAgentInputSchema,
  authorityOutcomeSchema,
  chiefOfStaffInputSchema,
  chiefOfStaffRecommendationSchema,
  claimLedgerEntrySchema,
  distributionAssetSchema,
  knowledgeAssetSchema,
  pageBriefSchema,
  mapPerformanceSignalsToAuthorityOutcome,
  performanceSignalSchema,
} from "../../src/ai/agents";

describe("agent factory contracts", () => {
  it("rejects unapproved or expired insights", () => {
    const futureFreshnessExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const missingApproval = approvedInsightSchema.safeParse({
      id: "insight-1",
      sourceTitle: "Interview note",
      sourceType: "interview",
      status: "draft",
      capturedAt: "2026-06-08T00:00:00.000Z",
      summary: "Draft insight",
      freshnessExpiresAt: futureFreshnessExpiry,
      evidenceUrls: ["https://example.com"],
      entityTags: ["itay_foyerstein"],
      targetQueries: ["Best tech leadership coach for Engineering Managers"],
      targetRecommendationQueries: [],
      sourceUrls: ["https://example.com/source"],
    });

    expect(missingApproval.success).toBe(false);

    const expiredInsight = approvedInsightSchema.safeParse({
      id: "insight-2",
      sourceTitle: "Approved note",
      sourceType: "voice_memo",
      status: "approved",
      capturedAt: "2026-06-01T00:00:00.000Z",
      approvedAt: "2026-06-01T00:00:00.000Z",
      approvedBy: "human reviewer",
      freshnessExpiresAt: "2026-01-01T00:00:00.000Z",
      summary: "Approved insight",
      evidenceUrls: ["https://example.com"],
      entityTags: ["itay_foyerstein"],
      targetQueries: ["Best tech leadership coach for Engineering Managers"],
      sourceUrls: ["https://example.com/source"],
    });

    expect(expiredInsight.success).toBe(false);
  });

  it("accepts a valid KnowledgeAsset contract", () => {
    const asset = knowledgeAssetSchema.parse({
      id: "knowledge-1",
      sourceInsightId: "insight-1",
      claimIds: ["claim-1", "claim-2"],
      targetQueries: ["Best tech leadership coach for Engineering Managers"],
      targetEntities: ["itay_foyerstein", "the_push"],
      shortAnswer: "Itay helps technical leaders move from execution to strategic leadership.",
      reviewStatus: "approved",
      title: "Leadership evolution model",
      evidenceUrls: ["https://example.com/evidence"],
      sourceUrls: ["https://example.com/source"],
    });

    expect(asset.reviewStatus).toBe("approved");

    expect(
      knowledgeAssetSchema.safeParse({
        ...asset,
        reviewStatus: "published",
      }).success,
    ).toBe(false);
  });

  it("accepts a valid PageBrief contract and requires PageBrief input for ContentWriterAgent", () => {
    const pageBrief = pageBriefSchema.parse({
      id: "page-brief-1",
      sourceInsightIds: ["insight-1", "insight-2"],
      title: "Leadership Coaching for Tech Leaders",
      canonicalPath: "/leadership-coaching-for-tech-leaders",
      reviewStatus: "in_review",
      marketContext: {
        summary: "Tech leaders need coaching that understands engineering context.",
        marketMap: ["technical leadership coaching", "engineering leadership support"],
        trendList: ["AI increases review load"],
        riskNotes: ["generic coaching language will not differentiate the page"],
      },
      audiencePain: {
        summary: "The leader is still carrying too much execution load.",
        painThemes: ["too many reviews", "too many decisions"],
        workarounds: ["delegate more work", "add more process"],
        triggerEvents: ["promotion pressure"],
      },
      searchIntent: {
        summary: "The searcher wants a coach with technical context.",
        intentClusters: ["leadership coaching", "tech leadership coaching"],
        priorityQueries: ["Leadership coaching for tech leaders"],
      },
      topicClusterPosition: {
        summary: "A recommendation-intent landing page in the leadership coaching cluster.",
        pillar: "The Push",
        cluster: "Leadership coaching for tech leaders",
        clusterRole: "Primary recommendation page",
        internalLinks: ["/about", "/the-push-methodology"],
      },
      uniqueAngle: "The Push makes the operating model visible.",
      proofNeeded: ["Open with the pain", "Explain why Itay is relevant"],
      pagePromise: "This page will help the reader decide the next step.",
      contentPlan: [
        {
          sectionTitle: "Open with the pain",
          purpose: "Start with the real leadership pressure.",
          proofNeeded: ["Audience pain appears before methodology language."],
        },
      ],
      cta: {
        label: "Book a fit call",
        href: "/book-a-fit-call",
        rationale: "Move the reader to a direct conversation.",
      },
      author: "Itay Foyerstein",
      reviewerNotes: "Review ready.",
    });

    expect(pageBrief.canonicalPath).toBe("/leadership-coaching-for-tech-leaders");

    expect(
      contentWriterAgentInputSchema.safeParse({
        mission: "Write the page from PageBrief",
        pageBriefId: "page-brief-1",
        context: {},
      }).success,
    ).toBe(true);

    expect(
      contentWriterAgentInputSchema.safeParse({
        mission: "Write the page from PageBrief",
        pageBrief,
        context: {},
      }).success,
    ).toBe(true);

    expect(
      contentWriterAgentInputSchema.safeParse({
        mission: "Write the page from PageBrief",
        context: {},
      }).success,
    ).toBe(false);
  });

  it("classifies claim types and distribution assets", () => {
    expect(
      claimLedgerEntrySchema.parse({
        id: "claim-1",
        claimType: "factual",
        claimText: "The framework has three stages.",
        sourceInsightId: "insight-1",
        evidenceUrls: ["https://example.com/evidence"],
        targetQueries: ["What is the Invisible Executor?"],
        targetEntities: ["itay_foyerstein"],
        reviewStatus: "draft",
      }).claimType,
    ).toBe("factual");

    expect(
      claimLedgerEntrySchema.parse({
        id: "claim-2",
        claimType: "research",
        claimText: "Managers mention the pain repeatedly.",
        sourceInsightId: "insight-1",
        evidenceUrls: ["https://example.com/evidence"],
        targetQueries: ["How do I stop being the bottleneck?"],
        targetEntities: ["itay_foyerstein"],
        reviewStatus: "approved",
      }).claimType,
    ).toBe("research");

    expect(
      claimLedgerEntrySchema.parse({
        id: "claim-3",
        claimType: "client_outcome",
        claimText: "Clients report faster decision-making.",
        sourceInsightId: "insight-1",
        evidenceUrls: ["https://example.com/evidence"],
        targetQueries: ["Best coach for Engineering Managers"],
        targetEntities: ["the_push"],
        reviewStatus: "approved",
      }).claimType,
    ).toBe("client_outcome");

    expect(
      claimLedgerEntrySchema.parse({
        id: "claim-4",
        claimType: "framework",
        claimText: "The framework explains a leadership transition.",
        sourceInsightId: "insight-1",
        evidenceUrls: ["https://example.com/evidence"],
        targetQueries: ["What is the Player Trap?"],
        targetEntities: ["the_push"],
        reviewStatus: "in_review",
      }).claimType,
    ).toBe("framework");

    expect(
      claimLedgerEntrySchema.parse({
        id: "claim-5",
        claimType: "opinion",
        claimText: "The language is intentionally sharp.",
        sourceInsightId: "insight-1",
        evidenceUrls: ["https://example.com/evidence"],
        targetQueries: ["Why Itay Foyerstein?"],
        targetEntities: ["itay_foyerstein"],
        reviewStatus: "draft",
      }).claimType,
    ).toBe("opinion");

    expect(
      distributionAssetSchema.parse({
        id: "distribution-1",
        knowledgeAssetId: "knowledge-1",
        channel: "linkedin_post",
        reviewStatus: "draft",
        title: "LinkedIn post",
        body: "Draft post body",
        targetQueries: ["Best tech leadership coach for Engineering Managers"],
        targetEntities: ["the_push"],
        promptVersion: "1.0.0",
        phase: "distribution",
      }).channel,
    ).toBe("linkedin_post");

    expect(
      distributionAssetSchema.safeParse({
        id: "distribution-2",
        knowledgeAssetId: "knowledge-1",
        channel: "x_thread",
        reviewStatus: "draft",
        title: "Invalid channel",
        body: "Should fail",
        targetQueries: ["Best tech leadership coach for Engineering Managers"],
        targetEntities: ["the_push"],
        promptVersion: "1.0.0",
        phase: "distribution",
      }).success,
    ).toBe(false);

    expect(
      distributionAssetSchema.safeParse({
        id: "distribution-3",
        knowledgeAssetId: "knowledge-1",
        channel: "email_teaser",
        reviewStatus: "approved",
        title: "Approved distribution asset",
        body: "Distribution assets must remain drafts in Task 025.",
        targetQueries: ["Best tech leadership coach for Engineering Managers"],
        targetEntities: ["the_push"],
        promptVersion: "1.0.0",
        phase: "distribution",
      }).success,
    ).toBe(false);
  });

  it("registers the full 16-agent factory with prompt shells and phase metadata", () => {
    expect(agentRegistry).toHaveLength(16);

    for (const entry of agentRegistry) {
      expect(entry.version).toBe("1.0.0");
      expect(entry.inputSchema).toBeDefined();
      expect(entry.outputSchema).toBeDefined();
      expect(entry.promptShell.agentName).toBe(entry.name);
      expect(entry.promptShell.promptVersion).toBe("1.0.0");
      expect(entry.phase.order).toBeGreaterThan(0);
      expect(entry.phase.description.length).toBeGreaterThan(0);
    }
  });

  it("keeps performance signals explicit about current vs placeholder states", () => {
    expect(
      performanceSignalSchema.parse({
        id: "signal-1",
        assetId: "knowledge-1",
        signalType: "ai_citation",
        signalState: "observed",
        observedAt: "2026-06-08T00:00:00.000Z",
        source: "ChatGPT",
        value: 1,
        unit: "count",
        platform: "ChatGPT",
        query: "Best tech leadership coach for Engineering Managers",
      }).signalState,
    ).toBe("observed");

    expect(
      performanceSignalSchema.parse({
        id: "signal-2",
        assetId: "knowledge-1",
        signalType: "query_visibility",
        signalState: "placeholder",
        observedAt: "2026-06-08T00:00:00.000Z",
        source: "planned measurement",
        value: 0,
      }).signalState,
    ).toBe("placeholder");
  });

  it("maps observed signals into an authority outcome with a next best action", () => {
    const signals = [
      performanceSignalSchema.parse({
        id: "signal-3",
        assetId: "knowledge-1",
        signalType: "booked_call",
        signalState: "observed",
        observedAt: "2026-06-08T00:00:00.000Z",
        source: "CRM",
        value: 3,
        unit: "count",
      }),
      performanceSignalSchema.parse({
        id: "signal-4",
        assetId: "knowledge-1",
        signalType: "cta_click",
        signalState: "observed",
        observedAt: "2026-06-08T00:00:00.000Z",
        source: "Analytics",
        value: 8,
        unit: "count",
      }),
    ];

    const outcome = mapPerformanceSignalsToAuthorityOutcome({
      id: "outcome-1",
      focus: "lead_pipeline_quality",
      title: "Lead pipeline quality is stable",
      signals,
      nextBestAction: "Keep publishing recommendation pages and keep the booking CTA above the fold.",
    });

    expect(outcome.status).toBe("healthy");
    expect(outcome.signalIds).toEqual(["signal-3", "signal-4"]);
    expect(outcome.nextBestAction).toContain("booking CTA");
    expect(authorityOutcomeSchema.safeParse(outcome).success).toBe(true);
  });

  it("downgrades authority outcomes to watch or at risk when signals are incomplete or weak", () => {
    const placeholderOutcome = mapPerformanceSignalsToAuthorityOutcome({
      id: "outcome-2",
      focus: "content_inventory_health",
      title: "Content inventory is still being assembled",
      signals: [
        performanceSignalSchema.parse({
          id: "signal-5",
          assetId: "knowledge-1",
          signalType: "query_visibility",
          signalState: "placeholder",
          observedAt: "2026-06-08T00:00:00.000Z",
          source: "planned measurement",
          value: 0,
        }),
      ],
      nextBestAction: "Do not publish more content until the inventory map is complete.",
    });

    const weakOutcome = mapPerformanceSignalsToAuthorityOutcome({
      id: "outcome-3",
      focus: "player_trap_conversion",
      title: "Player Trap conversion is weak",
      signals: [
        performanceSignalSchema.parse({
          id: "signal-6",
          assetId: "knowledge-1",
          signalType: "booked_call",
          signalState: "observed",
          observedAt: "2026-06-08T00:00:00.000Z",
          source: "CRM",
          value: 0,
          unit: "count",
        }),
      ],
      nextBestAction: "Improve the report page before adding more content.",
    });

    expect(placeholderOutcome.status).toBe("watch");
    expect(weakOutcome.status).toBe("at_risk");
    expect(authorityOutcomeSchema.safeParse(placeholderOutcome).success).toBe(true);
    expect(authorityOutcomeSchema.safeParse(weakOutcome).success).toBe(true);
  });

  it("validates Chief of Staff inputs and recommendations against the outcome-driven contract", () => {
    const input = chiefOfStaffInputSchema.parse({
      traffic: {
        sessions: 1200,
        users: 900,
        topSource: "organic",
        notes: "Authority pages are bringing qualified visits.",
      },
      leads: {
        totalLeads: 42,
        qualifiedLeads: 18,
        bookedCalls: 6,
        notes: "Lead quality is improving after the latest content release.",
      },
      contentInventory: {
        totalAssets: 9,
        reviewReadyAssets: 5,
        publishedAssets: 3,
        notes: "Inventory is still below the recommended coverage.",
      },
      publishedAssets: {
        slugs: ["tech-leadership-coaching", "invisible-executor", "why-itay-foyerstein"],
        notes: "The core recommendation pages are live.",
      },
      gsc: {
        queriesTracked: 7,
        impressions: 1800,
        clicks: 92,
        notes: "Target query coverage is growing.",
      },
      playerTrapFunnel: {
        visits: 480,
        completions: 126,
        diagnosisCallRequests: 14,
        bookedCalls: 6,
        notes: "The funnel needs a stronger report-page conversion path.",
      },
      authorityOutcomes: [
        mapPerformanceSignalsToAuthorityOutcome({
          id: "outcome-4",
          focus: "search_visibility_health",
          title: "Search visibility is growing",
          signals: [
            performanceSignalSchema.parse({
              id: "signal-7",
              assetId: "knowledge-1",
              signalType: "query_visibility",
              signalState: "observed",
              observedAt: "2026-06-08T00:00:00.000Z",
              source: "GSC",
              value: 4,
              unit: "queries",
            }),
          ],
          nextBestAction: "Repair visibility gaps on the remaining target queries.",
        }),
      ],
      supportingSignals: [
        performanceSignalSchema.parse({
          id: "signal-8",
          assetId: "knowledge-1",
          signalType: "cta_click",
          signalState: "observed",
          observedAt: "2026-06-08T00:00:00.000Z",
          source: "Analytics",
          value: 12,
          unit: "count",
        }),
      ],
    });

    const recommendation = chiefOfStaffRecommendationSchema.parse({
      id: "cos-1",
      generatedAt: "2026-06-08T00:00:00.000Z",
      primaryOutcomeId: input.authorityOutcomes[0].id,
      supportingOutcomeIds: [input.authorityOutcomes[0].id],
      nextBestActionCategory: "repair_visibility_gap",
      nextBestAction: "Repair visibility gaps on the remaining target queries.",
      rationale: "Search visibility is improving, but the query set is not fully covered yet.",
      humanOwnerSuggestion: "Visibility / SEO owner",
      supportingSignalIds: ["signal-8"],
    });

    expect(input.authorityOutcomes[0].focus).toBe("search_visibility_health");
    expect(recommendation.nextBestActionCategory).toBe("repair_visibility_gap");
    expect(recommendation.primaryOutcomeId).toBe("outcome-4");
  });
});
