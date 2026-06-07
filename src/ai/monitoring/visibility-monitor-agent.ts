import { CompetitorRegistry } from "./competitors";
import {
  buildQueryAuthorityScorecard,
} from "./scoring";
import type {
  QueryAuthorityReviewInput,
  QueryAuthorityScorecard,
  VisibilityMonitorReport,
} from "./types";

export interface VisibilityMonitorConfig {
  ownedDomains: string[];
  competitorRegistry?: CompetitorRegistry;
}

function normalizeHostname(value: string): string | null {
  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function matchesOwnedDomain(hostname: string, ownedDomains: string[]): boolean {
  return ownedDomains.some((ownedDomain) => {
    const normalizedOwnedDomain = ownedDomain.toLowerCase();
    return hostname === normalizedOwnedDomain || hostname.endsWith(`.${normalizedOwnedDomain}`);
  });
}

function detectOwnedUrlCitation(citedUrls: string[], ownedDomains: string[]): boolean {
  return citedUrls.some((url) => {
    const hostname = normalizeHostname(url);
    return hostname ? matchesOwnedDomain(hostname, ownedDomains) : false;
  });
}

export class VisibilityMonitorAgent {
  private readonly ownedDomains: string[];

  private readonly competitorRegistry: CompetitorRegistry;

  constructor(config: VisibilityMonitorConfig) {
    this.ownedDomains = [...config.ownedDomains];
    this.competitorRegistry = config.competitorRegistry ?? new CompetitorRegistry();
  }

  evaluate(input: QueryAuthorityReviewInput): QueryAuthorityScorecard {
    const scorecard = buildQueryAuthorityScorecard({
      ...input,
      competitorsRecommended: this.competitorRegistry.normalizeRecommendedNames(input.competitorsRecommended),
      ownedUrlCited: detectOwnedUrlCitation(input.citedUrls, this.ownedDomains),
    });

    return scorecard;
  }

  run(input: QueryAuthorityReviewInput): VisibilityMonitorReport {
    const scorecard = this.evaluate(input);

    return {
      query: scorecard.query,
      platform: scorecard.platform,
      gapClassification: scorecard.gapClassification,
      suggestedOwningAgent: scorecard.suggestedOwningAgent,
      scorecard,
    };
  }
}
