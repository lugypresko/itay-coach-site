import { describe, expect, it } from "vitest";

import { contentDecisionPageMappings, contentDecisionPageDecisions } from "../../src/seed/content-decision-page-mapping";

describe("ContentDecision page mapping", () => {
  it("maps 12 representative pages without changing existing content records", () => {
    expect(contentDecisionPageMappings).toHaveLength(12);
    expect(contentDecisionPageDecisions).toHaveLength(11);
    expect(contentDecisionPageMappings.filter((page) => page.decisionId)).toHaveLength(11);
    expect(contentDecisionPageMappings.find((page) => page.canonicalPath === "/contact")).toMatchObject({ mappingStatus: "excluded" });
  });

  it("uses explicit decision IDs for every mapped page", () => {
    for (const page of contentDecisionPageMappings.filter((item) => item.decisionId)) {
      expect(page.decisionId).toMatch(/^decision-/);
      expect(page.canonicalPath).toMatch(/^\//);
    }
  });

  it("maps CTO Coach explicitly and records Contact as an intentional exclusion", () => {
    expect(contentDecisionPageMappings.find((page) => page.canonicalPath === "/cto-coach")).toMatchObject({ decisionId: "decision-cto-coach", mappingStatus: "mapped" });
    expect(contentDecisionPageMappings.find((page) => page.canonicalPath === "/contact")?.exclusionReason).toBeTruthy();
  });
});
