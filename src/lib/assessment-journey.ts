export type AssessmentAudience = "individual" | "sponsor";

export const assessmentJourneyEvents = [
  "assessment_start",
  "assessment_complete",
] as const;

export function getAssessmentNextStep(audience: AssessmentAudience) {
  return audience === "sponsor"
    ? {
        label: "Discuss the findings",
        href: "/for-organizations?source=assessment",
      }
    : {
        label: "Review your result with Itay",
        href: "/book-a-fit-call?source=assessment",
      };
}
