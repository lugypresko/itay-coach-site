import { describe, expect, it } from "vitest";

import { contentDecisionVocabulary } from "../../src/ai/content-decision/vocabulary";

describe("ContentDecision vocabulary", () => {
  it("contains the authority graph references used by the first decision mapping", () => {
    expect(contentDecisionVocabulary.entities).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: "itay-foyerstein", type: "expert" }),
      expect.objectContaining({ id: "the-push", type: "methodology" }),
      expect.objectContaining({ id: "invisible-executor-framework", type: "framework" }),
      expect.objectContaining({ id: "engineering-manager", type: "audience" }),
    ]));
  });

  it("keeps unresolved content components explicit instead of guessing", () => {
    expect(contentDecisionVocabulary.problems.find((item) => item.id === "execution-bottleneck")).toMatchObject({
      status: "approved",
    });
    expect(contentDecisionVocabulary.offers.find((item) => item.id === "the-push-coaching")).toMatchObject({
      status: "approved",
    });
  });
});
