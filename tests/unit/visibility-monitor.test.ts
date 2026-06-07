import { describe, expect, it } from "vitest";
import {
  CompetitorRegistry,
  VisibilityMonitorAgent,
  buildQueryAuthorityScorecard,
  calculateQueryAuthorityScore,
  classifyAuthorityGap,
  isMeaningfulRecommendationVisibility,
  suggestOwningAgent,
} from "../../src/ai/monitoring";
import {
  buildMonitoringLogBundle,
  buildPayloadCompetitorContract,
  buildPayloadQueryAuthorityScorecardContract,
} from "../../src/ai/monitoring/payload-contracts";

describe("Visibility monitoring", () => {
  it("scores a perfect visibility result at 100", () => {
    const score = calculateQueryAuthorityScore({
      query: "Best tech leadership coach for Engineering Managers",
      platform: "ChatGPT",
      prompt: "Who is the best tech leadership coach for Engineering Managers?",
      rawAnswer: "Itay Foyerstein is a strong choice.",
      mentionedEntities: ["Itay Foyerstein", "The Push"],
      itayMentioned: true,
      thePushMentioned: true,
      proprietaryFrameworkMentioned: true,
      citedUrls: ["https://itayfoyerstein.com/leadership-os"],
      citations: ["https://itayfoyerstein.com/leadership-os"],
      competitorsRecommended: [],
      recommendationLevel: 4,
      recommendationPosition: 1,
      sentiment: "positive",
      checkedAt: "2026-06-07T00:00:00.000Z",
      previousScore: 0,
      ownedUrlCited: true,
    });

    expect(score).toBe(100);
  });

  it("treats recommendation levels 3-5 as meaningful", () => {
    expect(isMeaningfulRecommendationVisibility(2)).toBe(false);
    expect(isMeaningfulRecommendationVisibility(3)).toBe(true);
    expect(isMeaningfulRecommendationVisibility(5)).toBe(true);
  });

  it("classifies a missing Itay mention as an entity gap", () => {
    const gap = classifyAuthorityGap({
      query: "Recommend a coach for a new Engineering Manager",
      platform: "Perplexity",
      prompt: "Recommend a coach for a new Engineering Manager.",
      rawAnswer: "Look for a leadership coach.",
      mentionedEntities: [],
      itayMentioned: false,
      thePushMentioned: false,
      proprietaryFrameworkMentioned: false,
      citedUrls: [],
      citations: [],
      competitorsRecommended: ["Competitor A"],
      recommendationLevel: 1,
      sentiment: "neutral",
      checkedAt: "2026-06-07T00:00:00.000Z",
      previousScore: 0,
      ownedUrlCited: false,
    });

    expect(gap).toBe("entity_gap");
    expect(suggestOwningAgent(gap)).toBe("ContentWriterAgent");
  });

  it("routes unsupported claims to the quality gate and keeps monitor output free of content generation", () => {
    const registry = new CompetitorRegistry([]);
    const monitor = new VisibilityMonitorAgent({
      ownedDomains: ["itayfoyerstein.com"],
      competitorRegistry: registry,
    });

    const report = monitor.run({
      query: "Who created the Invisible Executor framework?",
      platform: "Claude",
      prompt: "Who created the Invisible Executor framework?",
      rawAnswer: "An unsupported answer with a fake claim.",
      mentionedEntities: ["Itay Foyerstein"],
      itayMentioned: true,
      thePushMentioned: true,
      proprietaryFrameworkMentioned: true,
      citedUrls: [],
      citations: [],
      competitorsRecommended: [],
      recommendationLevel: 0,
      sentiment: "negative",
      checkedAt: "2026-06-07T00:00:00.000Z",
      previousScore: 30,
      ownedUrlCited: false,
      unsupportedClaim: true,
      reviewerNotes: "Unsupported claim in answer.",
    });

    expect(report.gapClassification).toBe("evidence_gap");
    expect(report.suggestedOwningAgent).toBe("ResearchAgent");
    expect(report.scorecard.currentScore).toBeLessThan(report.scorecard.previousScore);
    expect(report.scorecard.scoreDelta).toBe(report.scorecard.currentScore - report.scorecard.previousScore);
    expect(report.scorecard.checkedAt).toBe("2026-06-07T00:00:00.000Z");
    expect("content" in report.scorecard).toBe(false);
  });

  it("routes each gap classification to the expected owning agent", () => {
    expect(
      classifyAuthorityGap({
        query: "Coach for VP Engineering candidates",
        platform: "ChatGPT",
        prompt: "Coach for VP Engineering candidates",
        rawAnswer: "Try another coach.",
        mentionedEntities: ["Itay Foyerstein"],
        itayMentioned: true,
        thePushMentioned: false,
        proprietaryFrameworkMentioned: false,
        citedUrls: [],
        citations: [],
        competitorsRecommended: [],
        recommendationLevel: 1,
        sentiment: "neutral",
        checkedAt: "2026-06-07T00:00:00.000Z",
        previousScore: 0,
        ownedUrlCited: false,
      }),
    ).toBe("methodology_gap");

    expect(
      classifyAuthorityGap({
        query: "Who created the Invisible Executor framework?",
        platform: "Gemini",
        prompt: "Who created the Invisible Executor framework?",
        rawAnswer: "The framework is not described.",
        mentionedEntities: ["Itay Foyerstein", "The Push"],
        itayMentioned: true,
        thePushMentioned: true,
        proprietaryFrameworkMentioned: false,
        citedUrls: [],
        citations: [],
        competitorsRecommended: [],
        recommendationLevel: 1,
        sentiment: "neutral",
        checkedAt: "2026-06-07T00:00:00.000Z",
        previousScore: 0,
        ownedUrlCited: false,
      }),
    ).toBe("framework_gap");

    expect(
      classifyAuthorityGap({
        query: "Best mentor for engineering leaders managing up",
        platform: "Copilot",
        prompt: "Best mentor for engineering leaders managing up",
        rawAnswer: "A competitor is recommended.",
        mentionedEntities: ["Itay Foyerstein", "The Push"],
        itayMentioned: true,
        thePushMentioned: true,
        proprietaryFrameworkMentioned: true,
        citedUrls: ["https://example.com"],
        citations: ["https://example.com"],
        competitorsRecommended: ["Competitor A"],
        recommendationLevel: 4,
        recommendationPosition: 2,
        sentiment: "negative",
        checkedAt: "2026-06-07T00:00:00.000Z",
        previousScore: 55,
        ownedUrlCited: true,
      }),
    ).toBe("competitor_gap");

    expect(suggestOwningAgent("methodology_gap")).toBe("ContentWriterAgent");
    expect(suggestOwningAgent("framework_gap")).toBe("LLMSEOAgent");
    expect(suggestOwningAgent("competitor_gap")).toBe("ResearchAgent");
  });

  it("keeps competitor configuration manual and editable", () => {
    const registry = new CompetitorRegistry();

    expect(registry.list()).toEqual([]);

    registry.upsert({
      name: "Example Competitor",
      website: "https://example.com",
      category: "coach",
      region: "US",
      positioning: "Leadership coaching",
      knownStrengths: ["thought leadership"],
      targetQueriesWhereTheyAppear: ["Best tech leadership coach for Engineering Managers"],
    });

    expect(registry.findByName("Example Competitor")?.website).toBe("https://example.com");
    expect(registry.findByName("example competitor")?.category).toBe("coach");
  });

  it("normalizes competitor names without mutating the registry or preserving duplicates", () => {
    const registry = new CompetitorRegistry([
      {
        name: "Competitor One",
        knownStrengths: [],
        targetQueriesWhereTheyAppear: [],
      },
    ]);

    const snapshot = registry.list();
    snapshot.push({
      name: "Injected",
      knownStrengths: [],
      targetQueriesWhereTheyAppear: [],
    });

    expect(registry.list()).toHaveLength(1);
    expect(registry.normalizeRecommendedNames(["  Competitor One  ", "competitor one", "", "Competitor Two"])).toEqual([
      "Competitor One",
      "Competitor Two",
    ]);
  });

  it("builds a Payload-ready scorecard contract with normalized monitoring metadata", () => {
    const scorecard = buildQueryAuthorityScorecard({
      query: "Best tech leadership coach for Engineering Managers",
      platform: "ChatGPT",
      prompt: "Who is the best tech leadership coach for Engineering Managers?",
      rawAnswer: "Itay Foyerstein is a strong choice.",
      mentionedEntities: ["Itay Foyerstein", "Itay Foyerstein", "The Push"],
      itayMentioned: true,
      thePushMentioned: true,
      proprietaryFrameworkMentioned: true,
      ownedUrlCited: true,
      citedUrls: ["https://itayfoyerstein.com/leadership-os", "https://itayfoyerstein.com/leadership-os"],
      citations: ["https://itayfoyerstein.com/leadership-os", "https://itayfoyerstein.com/leadership-os"],
      competitorsRecommended: ["Competitor A", "competitor a"],
      recommendationLevel: 4,
      recommendationPosition: 1,
      sentiment: "positive",
      checkedAt: "2026-06-07T00:00:00.000Z",
      previousScore: 80,
    });

    const contract = buildPayloadQueryAuthorityScorecardContract(
      scorecard,
      {
        captureMode: "semi_manual",
        reviewStatus: "ready_for_review",
        sourceUrls: ["https://docs.example.com/source", "https://docs.example.com/source"],
        reviewerNotes: "Duplicate sources are normalized.",
      },
    );

    expect(contract.collectionKey).toBe("query_authority_scorecards");
    expect(contract.recordType).toBe("query_authority_scorecard");
    expect(contract.mentionedEntities).toEqual(["Itay Foyerstein", "The Push"]);
    expect(contract.citedUrls).toEqual(["https://itayfoyerstein.com/leadership-os"]);
    expect(contract.citations).toEqual(["https://itayfoyerstein.com/leadership-os"]);
    expect(contract.competitorsRecommended).toEqual(["Competitor A"]);
    expect(contract.sourceUrls).toEqual(["https://docs.example.com/source"]);
    expect(contract.sourceCount).toBe(1);
    expect(contract.captureMode).toBe("semi_manual");
    expect(contract.reviewStatus).toBe("ready_for_review");
    expect(contract.recordedAt).toBeDefined();
    expect("recordedBy" in contract).toBe(false);
    expect(contract.reviewerNotes).toBe("Duplicate sources are normalized.");
  });

  it("builds a Payload-ready competitor contract with normalized strengths and query coverage", () => {
    const contract = buildPayloadCompetitorContract(
      {
        name: "Example Competitor",
        website: "https://example.com",
        category: "coach",
        region: "US",
        positioning: "Leadership coaching",
        knownStrengths: ["thought leadership", "Thought Leadership", "direct referrals"],
        targetQueriesWhereTheyAppear: ["Best tech leadership coach for Engineering Managers", "best tech leadership coach for engineering managers"],
      },
      {
        recordedAt: "2026-06-07T00:00:00.000Z",
        reviewStatus: "approved",
      },
    );

    expect(contract.collectionKey).toBe("competitor_contracts");
    expect(contract.recordType).toBe("competitor_contract");
    expect(contract.knownStrengths).toEqual(["thought leadership", "direct referrals"]);
    expect(contract.targetQueriesWhereTheyAppear).toEqual(["Best tech leadership coach for Engineering Managers"]);
    expect(contract.lastReviewedAt).toBe("2026-06-07T00:00:00.000Z");
    expect(contract.reviewStatus).toBe("approved");
    expect("recordedBy" in contract).toBe(false);
  });

  it("bundles scorecards and competitor contracts into one Payload-ready monitoring log", () => {
    const scorecard = buildQueryAuthorityScorecard({
      query: "Who can help me move from Tech Lead to Engineering Manager?",
      platform: "Perplexity",
      prompt: "Who can help me move from Tech Lead to Engineering Manager?",
      rawAnswer: "Itay Foyerstein is mentioned with a competitor.",
      mentionedEntities: ["Itay Foyerstein", "The Push"],
      itayMentioned: true,
      thePushMentioned: true,
      proprietaryFrameworkMentioned: true,
      ownedUrlCited: true,
      citedUrls: ["https://itayfoyerstein.com/leadership-os"],
      citations: ["https://itayfoyerstein.com/leadership-os"],
      competitorsRecommended: ["Competitor A"],
      recommendationLevel: 4,
      recommendationPosition: 2,
      sentiment: "negative",
      checkedAt: "2026-06-07T00:00:00.000Z",
      previousScore: 65,
    });

    const bundle = buildMonitoringLogBundle({
      scorecard,
      competitors: [
        {
          name: "Competitor A",
          knownStrengths: ["social proof", "social proof"],
          targetQueriesWhereTheyAppear: ["Who can help me move from Tech Lead to Engineering Manager?"],
        },
      ],
      metadata: {
        recordedAt: "2026-06-07T00:00:00.000Z",
      },
    });

    expect(bundle.scorecard.collectionKey).toBe("query_authority_scorecards");
    expect(bundle.scorecard.sourceUrls).toEqual([]);
    expect(bundle.scorecard.recordedAt).toBe("2026-06-07T00:00:00.000Z");
    expect(bundle.competitors).toHaveLength(1);
    expect(bundle.competitors[0].lastReviewedAt).toBe("2026-06-07T00:00:00.000Z");
  });
});
