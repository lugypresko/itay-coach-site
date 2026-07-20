import { describe, expect, it } from "vitest";

import {
  assessmentJourneyEvents,
  getAssessmentNextStep,
} from "../../src/lib/assessment-journey";

describe("assessment journey", () => {
  it("defines lifecycle events", () => {
    expect(assessmentJourneyEvents).toEqual(["assessment_start", "assessment_complete"]);
  });

  it("routes individual and sponsor next steps separately", () => {
    expect(getAssessmentNextStep("individual")).toEqual({
      label: "Review your result with Itay",
      href: "/book-a-fit-call?source=assessment",
    });
    expect(getAssessmentNextStep("sponsor")).toEqual({
      label: "Discuss the findings",
      href: "/for-organizations?source=assessment",
    });
  });
});
