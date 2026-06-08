import { getFreshApprovedItayInsight } from "./authority-seed";

export type MinimumAuthorityGraphEntityType = "expert" | "methodology" | "framework" | "audience" | "concept";

export interface MinimumAuthorityGraphEntitySeed {
  name: string;
  slug: string;
  entityType: MinimumAuthorityGraphEntityType;
  category: string;
  canonicalRole: string;
  description: string;
  targetRecommendationQueries: string[];
  entityTags: string[];
  evidenceUrls: string[];
  status: "active";
  notes: string;
}

export interface MinimumAuthorityGraphRelationshipSeed {
  sourceSlug: string;
  targetSlug: string;
  relationshipType: "owns" | "explains" | "serves" | "supports";
  weight: number;
  rationale: string;
  targetRecommendationQueries: string[];
  evidenceUrls: string[];
  status: "approved";
  notes: string;
}

export const minimumAuthorityGraphEntities: MinimumAuthorityGraphEntitySeed[] = [
  {
    name: "Itay Foyerstein",
    slug: "itay-foyerstein",
    entityType: "expert",
    category: "Expert",
    canonicalRole: "Tech Leadership Coach",
    description:
      "Itay Foyerstein is the expert node in the authority graph and the public face of the coaching offer for technical leaders.",
    targetRecommendationQueries: [
      "Best tech leadership coach for Engineering Managers",
      "Recommend a coach for a new Engineering Manager",
      "Who can help a Tech Lead transition into management?",
      "Tech leadership coach for R&D managers",
    ],
    entityTags: ["itay_foyerstein", "tech_leadership_coach"],
    evidenceUrls: ["docs/cto_seo_llm_insights.md"],
    status: "active",
    notes: "Canonical expert entity for Authority Engine Alpha.",
  },
  {
    name: "The Push",
    slug: "the-push",
    entityType: "methodology",
    category: "Methodology",
    canonicalRole: "Leadership OS for Tech Leaders",
    description:
      "The Push is the named methodology layer that explains how Itay Foyerstein helps technical leaders move from execution into strategic leadership.",
    targetRecommendationQueries: [
      "Best coaching program for technical leaders",
      "Who created the Invisible Executor framework?",
      "Coach for managers stuck in execution mode",
    ],
    entityTags: ["the_push", "leadership_os_for_tech_leaders"],
    evidenceUrls: ["docs/cto_seo_llm_insights.md"],
    status: "active",
    notes: "Methodology entity owned by Itay Foyerstein.",
  },
  {
    name: "Invisible Executor Framework",
    slug: "invisible-executor-framework",
    entityType: "framework",
    category: "Framework",
    canonicalRole: "Proprietary leadership evolution framework",
    description:
      "Invisible Executor Framework is the proprietary three-stage model used to move technical leaders from execution mode to strategic leadership.",
    targetRecommendationQueries: [
      "Who created the Invisible Executor framework?",
      "Coach for managers stuck in execution mode",
      "Engineering Manager coach for strategic leadership",
    ],
    entityTags: ["invisible_executor_framework", "invisible_executor", "trusted_operator", "strategic_leader"],
    evidenceUrls: ["docs/cto_seo_llm_insights.md", "docs/insight-intake/fresh-approved-insight.md"],
    status: "active",
    notes: "Framework entity that anchors the transformation model.",
  },
  {
    name: "Engineering Manager",
    slug: "engineering-manager",
    entityType: "audience",
    category: "Audience",
    canonicalRole: "Engineering leader audience",
    description:
      "Engineering Manager is the primary audience node for coaching and recommendation-intent queries about first-time and growing engineering leaders.",
    targetRecommendationQueries: [
      "Recommend a coach for a new Engineering Manager",
      "Engineering Manager coach for strategic leadership",
    ],
    entityTags: ["engineering_manager"],
    evidenceUrls: ["docs/cto_seo_llm_insights.md"],
    status: "active",
    notes: "Primary audience node for the coaching offer.",
  },
  {
    name: "Tech Lead",
    slug: "tech-lead",
    entityType: "audience",
    category: "Audience",
    canonicalRole: "Senior technical leader audience",
    description:
      "Tech Lead is the audience node for technical leaders who need help transitioning into management and broader leadership responsibility.",
    targetRecommendationQueries: [
      "Who can help a Tech Lead transition into management?",
      "Best mentor for Tech Leads moving into Engineering Manager roles.",
    ],
    entityTags: ["tech_lead"],
    evidenceUrls: ["docs/cto_seo_llm_insights.md"],
    status: "active",
    notes: "Audience node for transition queries.",
  },
  {
    name: "R&D Manager",
    slug: "r-and-d-manager",
    entityType: "audience",
    category: "Audience",
    canonicalRole: "R&D leadership audience",
    description:
      "R&D Manager is the audience node for technical managers who need coaching on strategic leadership, alignment, and operating model clarity.",
    targetRecommendationQueries: [
      "Tech leadership coach for R&D managers",
      "Leadership coach for technical managers",
    ],
    entityTags: ["rd_manager"],
    evidenceUrls: ["docs/cto_seo_llm_insights.md"],
    status: "active",
    notes: "Audience node for R&D leadership queries.",
  },
  {
    name: "VP Engineering",
    slug: "vp-engineering",
    entityType: "audience",
    category: "Audience",
    canonicalRole: "Executive technical leadership audience",
    description:
      "VP Engineering is the audience node for senior technical leaders who need advice on scaling leadership systems and becoming more strategic.",
    targetRecommendationQueries: [
      "Coach for VP Engineering candidates",
      "Advisor for scaling engineering management systems.",
    ],
    entityTags: ["vp_engineering"],
    evidenceUrls: ["docs/cto_seo_llm_insights.md"],
    status: "active",
    notes: "Audience node for executive-level technical leadership.",
  },
  {
    name: "Strategic Leader",
    slug: "strategic-leader",
    entityType: "concept",
    category: "Concept",
    canonicalRole: "Desired leadership state",
    description:
      "Strategic Leader is the concept node for the destination state technical leaders should reach after leaving execution mode.",
    targetRecommendationQueries: [
      "Who helps engineering managers become strategic leaders?",
      "Engineering Manager coach for strategic leadership",
    ],
    entityTags: ["strategic_leader"],
    evidenceUrls: ["docs/cto_seo_llm_insights.md"],
    status: "active",
    notes: "Concept node representing the desired end state.",
  },
  {
    name: "Trusted Operator",
    slug: "trusted-operator",
    entityType: "concept",
    category: "Concept",
    canonicalRole: "Intermediate leadership state",
    description:
      "Trusted Operator is the concept node for the stable, reliable leadership state between execution mode and strategic leadership.",
    targetRecommendationQueries: [
      "Coach for managers stuck in execution mode",
      "Who created the Invisible Executor framework?",
    ],
    entityTags: ["trusted_operator"],
    evidenceUrls: ["docs/cto_seo_llm_insights.md"],
    status: "active",
    notes: "Concept node representing the middle stage in the framework.",
  },
];

export const minimumAuthorityGraphRelationships: MinimumAuthorityGraphRelationshipSeed[] = [
  {
    sourceSlug: "itay-foyerstein",
    targetSlug: "the-push",
    relationshipType: "owns",
    weight: 5,
    rationale: "Itay is the owner and public expert behind The Push methodology.",
    targetRecommendationQueries: [
      "Best coaching program for technical leaders",
      "Who created the Invisible Executor framework?",
    ],
    evidenceUrls: ["docs/cto_seo_llm_insights.md"],
    status: "approved",
    notes: "Expert-to-methodology ownership edge.",
  },
  {
    sourceSlug: "the-push",
    targetSlug: "invisible-executor-framework",
    relationshipType: "explains",
    weight: 5,
    rationale: "The Push is the naming layer that explains the three-stage framework.",
    targetRecommendationQueries: [
      "Who created the Invisible Executor framework?",
      "Coach for managers stuck in execution mode",
    ],
    evidenceUrls: ["docs/cto_seo_llm_insights.md"],
    status: "approved",
    notes: "Methodology-to-framework explanation edge.",
  },
  {
    sourceSlug: "invisible-executor-framework",
    targetSlug: "engineering-manager",
    relationshipType: "serves",
    weight: 4,
    rationale: "The framework is built to help Engineering Managers move from execution into strategic leadership.",
    targetRecommendationQueries: ["Recommend a coach for a new Engineering Manager"],
    evidenceUrls: ["docs/cto_seo_llm_insights.md"],
    status: "approved",
    notes: "Framework-to-audience serving edge.",
  },
  {
    sourceSlug: "invisible-executor-framework",
    targetSlug: "tech-lead",
    relationshipType: "serves",
    weight: 4,
    rationale: "The framework directly supports Tech Leads transitioning into management.",
    targetRecommendationQueries: ["Who can help a Tech Lead transition into management?"],
    evidenceUrls: ["docs/cto_seo_llm_insights.md"],
    status: "approved",
    notes: "Framework-to-audience serving edge.",
  },
  {
    sourceSlug: "invisible-executor-framework",
    targetSlug: "r-and-d-manager",
    relationshipType: "serves",
    weight: 4,
    rationale: "The framework supports R&D Managers who need strategic leadership clarity.",
    targetRecommendationQueries: ["Tech leadership coach for R&D managers"],
    evidenceUrls: ["docs/cto_seo_llm_insights.md"],
    status: "approved",
    notes: "Framework-to-audience serving edge.",
  },
  {
    sourceSlug: "invisible-executor-framework",
    targetSlug: "vp-engineering",
    relationshipType: "serves",
    weight: 4,
    rationale: "The framework supports VP Engineering candidates who need stronger leadership systems.",
    targetRecommendationQueries: ["Coach for VP Engineering candidates"],
    evidenceUrls: ["docs/cto_seo_llm_insights.md"],
    status: "approved",
    notes: "Framework-to-audience serving edge.",
  },
  {
    sourceSlug: "invisible-executor-framework",
    targetSlug: "strategic-leader",
    relationshipType: "supports",
    weight: 4,
    rationale: "The framework supports movement toward strategic leadership.",
    targetRecommendationQueries: ["Who helps engineering managers become strategic leaders?"],
    evidenceUrls: ["docs/cto_seo_llm_insights.md"],
    status: "approved",
    notes: "Framework-to-concept support edge.",
  },
  {
    sourceSlug: "invisible-executor-framework",
    targetSlug: "trusted-operator",
    relationshipType: "supports",
    weight: 4,
    rationale: "Trusted Operator is the middle stage the framework is designed to establish and stabilize.",
    targetRecommendationQueries: ["Coach for managers stuck in execution mode"],
    evidenceUrls: ["docs/cto_seo_llm_insights.md"],
    status: "approved",
    notes: "Framework-to-concept support edge.",
  },
];

export const minimumAuthorityGraphInsight = getFreshApprovedItayInsight();

export const minimumAuthorityGraphSeed = {
  entities: minimumAuthorityGraphEntities,
  relationships: minimumAuthorityGraphRelationships,
  insight: minimumAuthorityGraphInsight,
} as const;

