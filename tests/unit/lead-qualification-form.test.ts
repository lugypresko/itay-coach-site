import { describe, expect, it } from "vitest";

import {
  buildLeadQualification,
  classifyLeadPersona,
  validateLeadQualification,
} from "../../src/lib/lead-qualification";

describe("lead qualification", () => {
  it("separates buyer persona from support intent", () => {
    expect(classifyLeadPersona("VP R&D", "managers")).toBe("cto_vp_sponsor");
    expect(classifyLeadPersona("People Partner", "managers")).toBe("people_hr_sponsor");
    expect(classifyLeadPersona("Engineering Manager", "self")).toBe("individual");
  });

  it("requires qualification fields without requiring budget", () => {
    const input = {
      name: " Itay ",
      workEmail: "ITAY@EXAMPLE.COM",
      role: "VP R&D",
      company: "Example",
      supportIntent: "managers" as const,
      challenge: "Managers are escalating every decision.",
      timing: "This quarter",
    };

    expect(validateLeadQualification(input)).toEqual([]);
    expect(buildLeadQualification(input)).toMatchObject({
      name: "Itay",
      workEmail: "itay@example.com",
      persona: "cto_vp_sponsor",
    });
  });
});
