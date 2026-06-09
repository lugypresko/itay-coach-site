import { describe, expect, it } from "vitest";

import {
  agentRegistry,
  approvedInsightSchema,
  claimLedgerEntrySchema,
  distributionAssetSchema,
  knowledgeAssetSchema,
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
});
