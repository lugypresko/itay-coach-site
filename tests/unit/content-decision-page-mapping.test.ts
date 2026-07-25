import { describe, expect, it } from "vitest";

import { contentDecisionPageMappings, contentDecisionPageDecisions } from "../../src/seed/content-decision-page-mapping";

describe("ContentDecision page mapping", () => {
  it("maps 12 representative pages without changing existing content records", () => {
    expect(contentDecisionPageMappings).toHaveLength(12);
    expect(contentDecisionPageDecisions).toHaveLength(10);
    expect(contentDecisionPageMappings.filter((page) => page.decisionId)).toHaveLength(10);
  });

  it("uses explicit decision IDs for every mapped page", () => {
    for (const page of contentDecisionPageMappings.filter((item) => item.decisionId)) {
      expect(page.decisionId).toMatch(/^decision-/);
      expect(page.canonicalPath).toMatch(/^\//);
    }
  });
});
