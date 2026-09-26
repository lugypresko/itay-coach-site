import { describe, expect, it } from "vitest";

import {
  assessmentJourneyEvents,
  advanceDiagnosticState,
  routeDiagnostic,
  getAssessmentNextStep,
} from "../../src/lib/assessment-journey";

describe("assessment journey", () => {
  it("defines lifecycle events", () => {
    expect(assessmentJourneyEvents).toEqual([
      "assessment_start",
      "diagnostic_micro_insight",
      "diagnostic_contact_earned",
      "request_to_talk",
      "assessment_complete",
    ]);
  });

  it("routes individual and sponsor next steps separately", () => {
    expect(getAssessmentNextStep("individual")).toEqual({
      label: "Request to talk with Itay",
      href: "/contact?source=diagnostic&intent=request_to_talk",
    });
    expect(getAssessmentNextStep("sponsor")).toEqual({
      label: "Discuss the findings",
      href: "/for-organizations?source=assessment",
    });
  });

  it("advances through the executable diagnostic states without a score", () => {
    expect(advanceDiagnosticState("ROLE", { role: "Engineering Manager" })).toBe("PAIN_RAW");
    expect(advanceDiagnosticState("PAIN_CONFIRMED", {})).toBe("PAIN_CONFIRMED");
    expect(advanceDiagnosticState("MICRO_INSIGHT", { accepted: true })).toBe("CONTACT_OFFERED");
    expect(advanceDiagnosticState("CONTACT_OFFERED", { consented: true })).toBe("CONTACT_SUBMITTED");
  });

  it("routes from independent DQL signals to request_to_talk, nurture, or no-fit", () => {
    expect(routeDiagnostic({ fit: true, pain: true, now: true, intent: "talk_now" })).toBe("TALK_NOW");
    expect(routeDiagnostic({ fit: true, pain: true, now: false, intent: "later" })).toBe("NURTURE");
    expect(routeDiagnostic({ fit: false, pain: true, now: true, intent: "talk_now" })).toBe("NO_FIT");
    expect(routeDiagnostic({ fit: true, pain: true, now: true, intent: "none" })).toBe("INSUFFICIENT_EVIDENCE");
  });
});
