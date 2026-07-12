import { describe, expect, it } from "vitest";

import { approvedInsightRepository } from "../../src/ai/insights";
import { ApprovedInsights, KnowledgeAssets } from "../../src/payload/collections";
import {
  approvedInsightPayloadSeedEntries,
} from "../../src/seed/approved-insight-payload-seed";
import { knowledgeAssetConversionSprintEntries } from "../../src/seed/knowledge-asset-conversion-sprint";

describe("payload factory storage", () => {
  it("registers the approved insight and knowledge asset collections", () => {
    expect(ApprovedInsights.slug).toBe("approved_insights");
    expect(KnowledgeAssets.slug).toBe("knowledge_assets");
  });

  it("prepares all approved insights for Payload persistence", () => {
    expect(approvedInsightPayloadSeedEntries).toHaveLength(approvedInsightRepository.length);
    expect(approvedInsightPayloadSeedEntries[0]?.payloadData.status).toBe("approved");
    expect(approvedInsightPayloadSeedEntries[0]?.payloadData.freshnessExpiresAt).toBeDefined();
    expect(approvedInsightPayloadSeedEntries.every((entry) => Boolean(entry.sourceInsightId))).toBe(true);
  });

  it("prepares the first 10 knowledge assets for Payload persistence", () => {
    expect(knowledgeAssetConversionSprintEntries).toHaveLength(10);
    expect(
      knowledgeAssetConversionSprintEntries.every((entry) => entry.knowledgeAsset.reviewStatus === "in_review"),
    ).toBe(true);
    expect(
      knowledgeAssetConversionSprintEntries.every((entry) => entry.sourceInsightId === entry.knowledgeAsset.sourceInsightId),
    ).toBe(true);
  });
});
