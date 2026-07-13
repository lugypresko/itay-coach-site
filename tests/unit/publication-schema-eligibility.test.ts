import { describe, expect, it } from "vitest";

import { buildProblemPageJsonLd } from "../../src/lib/problem-page-schema";
import { buildProblemPagePublicationDecision, getProblemPageCatalogEntry } from "../../src/lib/problem-pages";
import {
  buildPublicContentPageModel,
  getPublicContentSectionSpec,
  getStaticPublicContentCatalogEntry,
} from "../../src/lib/public-content";
import { buildPageJsonLd } from "../../src/lib/public-schema";

const origin = "https://itayfoyerstein.com";

describe("publication schema eligibility", () => {
  it("does not emit authority JSON-LD when the publication decision has no canonical", () => {
    const page = buildPublicContentPageModel({
      spec: getPublicContentSectionSpec("frameworks")!,
      record: { ...getStaticPublicContentCatalogEntry("frameworks", "player-trap")!, canonicalUrl: null },
      origin,
    });

    expect(page.publicationDecision.canonicalUrl).toBeNull();
    expect(buildPageJsonLd(page)).toEqual([]);
  });

  it("does not emit Problem Page JSON-LD when the publication decision has no canonical", () => {
    const record = { ...getProblemPageCatalogEntry("cto-becomes-the-bottleneck")!, canonicalUrl: null };
    const publicationDecision = buildProblemPagePublicationDecision(record, {
      origin,
      pathname: `/problems/${record.slug}`,
      canonicalUrl: null,
    });
    const page = {
      record,
      pathname: `/problems/${record.slug}`,
      canonicalUrl: `${origin}/problems/${record.slug}`,
      publicationDecision,
    };

    expect(publicationDecision.canonicalUrl).toBeNull();
    expect(buildProblemPageJsonLd(page)).toEqual([]);
  });
});
