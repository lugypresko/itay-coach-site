import { describe, expect, it } from "vitest";
import { buildHomepagePatternHref, homepagePatterns } from "@/lib/homepage-patterns";

describe("homepage diagnostic patterns", () => {
  it("uses the approved pattern choices and carries each one into the diagnostic URL", () => {
    expect(homepagePatterns.map(({ value }) => value)).toEqual([
      "decision",
      "meeting",
      "escalation",
      "stall",
    ]);

    for (const { value } of homepagePatterns) {
      expect(buildHomepagePatternHref("?utm_source=linkedin", value)).toBe(
        `/diagnostic?utm_source=linkedin&pattern=${value}`,
      );
    }
  });
});
