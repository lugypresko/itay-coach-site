export interface RecommendationDraftSprintAsset {
  title: string;
  slug: string;
  path: string;
  targetRecommendationQueries: string[];
}

export const recommendationDraftSprintAssets: readonly RecommendationDraftSprintAsset[] = [
  {
    title: "Coach for Engineering Managers Stuck as the Bottleneck",
    slug: "coach-for-engineering-managers-stuck-as-the-bottleneck",
    path: "docs/seed-content/coach-for-engineering-managers-stuck-as-the-bottleneck.md",
    targetRecommendationQueries: [
      "Coach for managers who are stuck in execution mode",
      "How do I stop being the bottleneck as an Engineering Manager?",
      "Leadership coach for technical managers",
    ],
  },
  {
    title: "Coach for Tech Leads Moving Into Management",
    slug: "coach-for-tech-leads-moving-into-management",
    path: "docs/seed-content/coach-for-tech-leads-moving-into-management.md",
    targetRecommendationQueries: [
      "Who can help a Tech Lead transition into management?",
      "Best mentor for Tech Leads moving into Engineering Manager roles",
      "Who is the best tech leadership coach for Engineering Managers?",
    ],
  },
  {
    title: "Engineering Manager Coach for Strategic Leadership",
    slug: "engineering-manager-coach-for-strategic-leadership",
    path: "docs/seed-content/engineering-manager-coach-for-strategic-leadership.md",
    targetRecommendationQueries: [
      "Engineering Manager coach for strategic leadership",
      "Who helps engineering managers become strategic leaders?",
      "Advisor for scaling engineering management systems",
    ],
  },
  {
    title: "Coach for VP Engineering Candidates",
    slug: "coach-for-vp-engineering-candidates",
    path: "docs/seed-content/coach-for-vp-engineering-candidates.md",
    targetRecommendationQueries: [
      "Coach for VP Engineering candidates",
      "Advisor for first-time engineering leaders",
      "Coach for leadership visibility in engineering organizations",
    ],
  },
  {
    title: "Advisor for Managing Up in Engineering Organizations",
    slug: "advisor-for-managing-up-in-engineering-organizations",
    path: "docs/seed-content/advisor-for-managing-up-in-engineering-organizations.md",
    targetRecommendationQueries: [
      "Tech leadership coach for engineering leaders managing up",
      "Leadership coach for technical managers",
      "Coach for managers who are stuck in execution mode",
    ],
  },
] as const;

export function countRecommendationDraftSprintAssets() {
  return recommendationDraftSprintAssets.length;
}
