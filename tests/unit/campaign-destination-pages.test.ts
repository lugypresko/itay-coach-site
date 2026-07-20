import { describe, expect, it } from "vitest";

import { metadata as organizationsMetadata } from "../../src/app/(site)/for-organizations/page";
import { metadata as assessmentMetadata } from "../../src/app/(site)/leadership-dependency-assessment/page";

describe("campaign destination pages", () => {
  it("provides a canonical sponsor destination", () => {
    expect(organizationsMetadata.title).toBe("Leadership Support for Organizations");
    expect(organizationsMetadata.alternates?.canonical).toBe("/for-organizations");
  });

  it("provides a diagnostic destination for Leadership OS traffic", () => {
    expect(assessmentMetadata.title).toBe("Leadership Dependency Assessment");
    expect(assessmentMetadata.alternates?.canonical).toBe("/leadership-dependency-assessment");
    expect(assessmentMetadata.robots).toEqual({ index: false, follow: false });
  });
});
