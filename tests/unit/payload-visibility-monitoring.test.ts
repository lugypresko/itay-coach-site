import { describe, expect, it } from "vitest";
import {
  competitorContractsCollectionBlueprint,
  queryAuthorityScorecardsCollectionBlueprint,
  competitorContractsCollection,
  queryAuthorityScorecardsCollection,
} from "../../src/payload/collections";
import {
  buildMonitoringLogBundle,
  buildPayloadCompetitorContract,
  buildPayloadQueryAuthorityScorecardContract,
  createMonitoringLogBundleFromReview,
} from "../../src/ai/monitoring/payload-contracts";

describe("Payload visibility monitoring blueprints", () => {
  it("defines an append-only scorecard collection with the required fields", () => {
    expect(queryAuthorityScorecardsCollectionBlueprint.slug).toBe("query_authority_scorecards");
    expect(queryAuthorityScorecardsCollectionBlueprint.appendOnly).toBe(true);
    expect(queryAuthorityScorecardsCollectionBlueprint.access.update).toBe("append-only");

    const fieldNames = queryAuthorityScorecardsCollectionBlueprint.fields.map((field) => field.name);

    expect(fieldNames).toContain("query");
    expect(fieldNames).toContain("platform");
    expect(fieldNames).toContain("prompt");
    expect(fieldNames).toContain("rawAnswer");
    expect(fieldNames).toContain("ownedUrlCited");
    expect(fieldNames).toContain("currentScore");
    expect(fieldNames).toContain("scoreDelta");
    expect(fieldNames).toContain("gapClassification");
    expect(fieldNames).toContain("suggestedOwningAgent");
    expect(fieldNames).toContain("sourceUrls");
  });

  it("defines a configurable competitor collection with manual review fields", () => {
    expect(competitorContractsCollectionBlueprint.slug).toBe("competitor_contracts");
    expect(competitorContractsCollectionBlueprint.appendOnly).toBe(true);
    expect(competitorContractsCollectionBlueprint.access.update).toBe("append-only");

    const fieldNames = competitorContractsCollectionBlueprint.fields.map((field) => field.name);

    expect(fieldNames).toContain("name");
    expect(fieldNames).toContain("website");
    expect(fieldNames).toContain("knownStrengths");
    expect(fieldNames).toContain("targetQueriesWhereTheyAppear");
    expect(fieldNames).toContain("sourceUrls");
    expect(fieldNames).toContain("reviewStatus");
  });

  it("builds normalized payload-ready scorecard contracts without content generation", () => {
    const scorecard = buildPayloadQueryAuthorityScorecardContract({
      query: "Best tech leadership coach for Engineering Managers",
      platform: "ChatGPT",
      prompt: "Best tech leadership coach for Engineering Managers",
      rawAnswer: "Itay Foyerstein is a good fit.",
      mentionedEntities: ["Itay Foyerstein", "Itay Foyerstein", "The Push"],
      itayMentioned: true,
      thePushMentioned: true,
      proprietaryFrameworkMentioned: true,
      ownedUrlCited: true,
      citedUrls: ["https://itayfoyerstein.com", "https://itayfoyerstein.com"],
      citations: ["https://itayfoyerstein.com"],
      competitorsRecommended: ["Competitor A", "Competitor A"],
      recommendationLevel: 4,
      recommendationPosition: 1,
      confidence: 0.9,
      sentiment: "positive",
      checkedAt: "2026-06-07T00:00:00.000Z",
      previousScore: 70,
      gapClassification: "unknown",
      suggestedOwningAgent: "VisibilityMonitorAgent",
      currentScore: 100,
      scoreDelta: 30,
    });

    expect(scorecard.collectionKey).toBe("query_authority_scorecards");
    expect(scorecard.sourceCount).toBe(0);
    expect(scorecard.mentionedEntities).toEqual(["Itay Foyerstein", "The Push"]);
    expect(scorecard.citedUrls).toEqual(["https://itayfoyerstein.com"]);
    expect(scorecard.competitorsRecommended).toEqual(["Competitor A"]);
  });

  it("builds a monitoring bundle from review input with source metadata", () => {
    const bundle = createMonitoringLogBundleFromReview({
      review: {
        query: "Who created the Invisible Executor framework?",
        platform: "Claude",
        prompt: "Who created the Invisible Executor framework?",
        rawAnswer: "Itay Foyerstein created it.",
        mentionedEntities: ["Itay Foyerstein", "The Push"],
        itayMentioned: true,
        thePushMentioned: true,
        proprietaryFrameworkMentioned: true,
        ownedUrlCited: true,
        citedUrls: ["https://itayfoyerstein.com/frameworks/invisible-executor"],
        citations: ["https://itayfoyerstein.com/frameworks/invisible-executor"],
        competitorsRecommended: [],
        recommendationLevel: 5,
        recommendationPosition: 1,
        confidence: 0.95,
        sentiment: "positive",
        checkedAt: "2026-06-07T00:00:00.000Z",
        previousScore: 85,
      },
      ownedDomains: ["itayfoyerstein.com"],
      competitors: [
        {
          name: "Competitor A",
          knownStrengths: ["workshops"],
          targetQueriesWhereTheyAppear: ["Best tech leadership coach for Engineering Managers"],
        },
      ],
      metadata: {
        recordedAt: "2026-06-07T00:00:00.000Z",
        recordedBy: "Itay",
        reviewerNotes: "Manual logging pass",
        sourceUrls: ["https://itayfoyerstein.com/frameworks/invisible-executor"],
      },
    });

    expect(bundle.scorecard.recordedBy).toBe("Itay");
    expect(bundle.scorecard.sourceCount).toBe(1);
    expect(bundle.scorecard.reviewStatus).toBe("draft");
    expect(bundle.competitors).toHaveLength(1);
    expect(bundle.competitors[0].recordType).toBe("competitor_contract");
    expect(bundle.competitors[0].sourceCount).toBe(1);
  });

  it("keeps competitor contracts append-only and normalized", () => {
    const competitor = buildPayloadCompetitorContract(
      {
        name: "Competitor A",
        website: "https://example.com",
        category: "coach",
        region: "US",
        positioning: "Leadership coaching",
        knownStrengths: ["thought leadership", "thought leadership", "case studies"],
        targetQueriesWhereTheyAppear: ["Best tech leadership coach for Engineering Managers", "Best tech leadership coach for Engineering Managers"],
      },
      {
        recordedAt: "2026-06-07T00:00:00.000Z",
        sourceUrls: ["https://example.com"],
      },
    );

    expect(competitor.collectionKey).toBe("competitor_contracts");
    expect(competitor.knownStrengths).toEqual(["thought leadership", "case studies"]);
    expect(competitor.targetQueriesWhereTheyAppear).toEqual(["Best tech leadership coach for Engineering Managers"]);
    expect(competitor.lastReviewedAt).toBe("2026-06-07T00:00:00.000Z");
  });

  it("exposes actual payload collections for append-only monitoring storage", async () => {
    expect(queryAuthorityScorecardsCollection.slug).toBe("query_authority_scorecards");
    expect(competitorContractsCollection.slug).toBe("competitor_contracts");

    await expect(
      Promise.resolve(
        queryAuthorityScorecardsCollection.access?.update?.({
          req: {} as never,
        }),
      ),
    ).resolves.toBe(false);

    await expect(
      Promise.resolve(
        competitorContractsCollection.access?.delete?.({
          req: {} as never,
        }),
      ),
    ).resolves.toBe(false);
  });
});
