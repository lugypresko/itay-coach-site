import { describe, expect, it } from "vitest";

import { faqPage } from "../../src/lib/reader-facing-static-pages";

describe("buyer-facing FAQ", () => {
  it("contains a concise set of decision questions", () => {
    expect(faqPage.faqEntries).toHaveLength(10);
    expect(faqPage.faqEntries?.every(({ question, answer }) => question.endsWith("?") && answer.length >= 120)).toBe(true);
    expect(faqPage.definitionBody).not.toMatch(/FAQ (hub|is organized)|why readers land/i);
  });

  it("includes competing explanations and practical tests", () => {
    expect(faqPage.faqEntries?.some(({ answer }) => answer.includes("Two explanations"))).toBe(true);
    expect(faqPage.frameworkSteps.join(" ")).toMatch(/reversible experiment/i);
  });
});
