import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { buildHomepagePatternHref, homepagePatterns } from "@/lib/homepage-patterns";
import { ZIV_BARUCH_QUOTE } from "@/lib/social-proof";

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

  it("renders the Ziv Baruch quote from the shared diagnostic source", () => {
    const home = readFileSync("src/app/(site)/page.tsx", "utf8");
    const source = readFileSync("src/lib/social-proof.ts", "utf8");
    expect(home).toContain("ZivBaruchQuote");
    expect(home).not.toContain(ZIV_BARUCH_QUOTE.text);
    expect(source).toContain(ZIV_BARUCH_QUOTE.text);
    expect(source).toContain(ZIV_BARUCH_QUOTE.attribution);
  });
});
