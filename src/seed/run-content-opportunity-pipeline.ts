import fs from "node:fs";
import path from "node:path";
import { approvedInsightRepository } from "../ai/insights";
import { pageBriefSchema, type PageBrief } from "../ai/agents/agentFactoryContracts";
import { createReaderFacingArtifactDraft, type ReaderFacingPageArtifact, type ReaderFacingSection } from "../domain/reader-facing-page-artifact";
import {
  validateReaderFacingArtifactDeterministically,
  validateArtifactInternalLanguage,
  validateArtifactCompleteness,
  analyzeArtifactDifferentiation,
  validateArtifactUrls,
  type DifferentiationAnalysis,
} from "../ai/governance/reader-facing-artifact-governance";
import {
  canonicalOpportunities,
  analyzeOpportunityOverlap,
} from "../ai/workflows/content-opportunity";

type ContentBodySectionInput = {
  sectionId: string;
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
};

type ContentOpportunityQueueEntry = {
  artifactId: string;
  artifactVersion: number;
  artifactHash: string;
  canonicalPath: string;
  pageType: ReaderFacingPageArtifact["pageType"];
  lifecycle: ReaderFacingPageArtifact["lifecycle"];
  intendedQuery: string;
  ctaRationale: string;
  sourceInsightMapping: string[];
  claimsTraceability: Array<{ claimText: string; sourceInsightId: string; evidenceUrls: string[] }>;
  overlapAnalysis: DifferentiationAnalysis[];
  plannedInternalLinks: string[];
  governanceMetadata: {
    reviewPriority: number;
    suggestedPublicationOrder: number;
  };
  validation: {
    deterministic: { passed: boolean; failureCodes: string[] };
    internalLanguage: { passed: boolean; failureCodes: string[] };
    completeness: { passed: boolean; failureCodes: string[] };
    url: { passed: boolean; failureCodes: string[] };
    differentiation: { passed: boolean; failureCodes: string[] };
  };
  semanticReview: "not_run";
  humanApproval: "absent";
  publicationRecord: "absent";
  publicationBlocked: boolean;
  previewRoute: string;
  readerFacingContent: {
    title: string;
    description: string;
    body: ReaderFacingSection[];
    primaryCta: ReaderFacingPageArtifact["primaryCta"];
    internalLinks: ReaderFacingPageArtifact["internalLinks"];
  };
};

// 1. Single static timestamp snapshot for consistent reproducible artifact hashing
const FIXED_TIMESTAMP = "2026-07-13T12:00:00.000Z";

// Active path registry for URL validation
const activePaths = new Set([
  "/",
  "/book-a-fit-call",
  "/player-trap",
  "/problems/cto-becomes-the-bottleneck",
  "/problems/vp-rnd-losing-execution-control",
]);

// Helper to determine CTA based on intentStage and validate it meets Zod ZHref constraints
function getCtaForIntent(intentStage: string): { label: string; href: string; rationale: string } {
  if (intentStage === "coach_intent" || intentStage === "decision") {
    return {
      label: "Book a fit call",
      href: "/book-a-fit-call",
      rationale: "Direct fit call routing for confirmed high intent.",
    };
  } else if (intentStage === "consideration") {
    return {
      label: "Try the Player Trap diagnostic",
      href: "/player-trap",
      rationale: "Diagnostic entry for leaders recognizing performance plateaus.",
    };
  } else {
    // Stage must be awareness
    return {
      label: "View Leadership Insights",
      href: "/", 
      rationale: "General entry point for leaders exploring operating model shifts.",
    };
  }
}

// 2. Local public URL / CTA href validation (checks lead slash, no unsafe characters, and existence)
function validatePublicUrl(href: string): boolean {
  if (!href.startsWith("/") || href.startsWith("//")) return false;
  if (href.includes("\\") || href.includes("..")) return false;
  if (href.includes("#") || href.includes("?")) return false;
  return activePaths.has(href);
}

// Generate human-readable trace records for claims mapped cleanly to insight details
function buildClaimTraceability(insightIds: string[]) {
  const result: Array<{
    claimText: string;
    sourceInsightId: string;
    evidenceUrls: string[];
  }> = [];

  for (const id of insightIds) {
    const insight = approvedInsightRepository.find(ins => ins.id === id);
    if (!insight) continue;

    for (const claim of insight.claims) {
      result.push({
        claimText: claim.text,
        sourceInsightId: id,
        evidenceUrls: claim.evidenceUrls,
      });
    }
  }
  return result;
}

function getImprovedBodyForOp(id: string): ContentBodySectionInput[] {
  if (id === "opportunity-player-trap-bottleneck") {
    return [
      {
        sectionId: "recognition",
        heading: "Finding yourself at the center of every choice",
        paragraphs: [
          "When you keep becoming the final reviewer and rescue option for your team, the problem may not be your individual speed. It is the architecture of your team's decision-making.",
          "Stopping the bottleneck pattern requires recognizing where technical strength has become an operational single point of failure."
        ]
      },
      {
        sectionId: "situations",
        heading: "Recognizable bottleneck moments",
        bullets: [
          "Senior engineers wait for your approval before closing routine trade-offs.",
          "Incident response defaults to your direct execution rather than team process.",
          "You delegate implementation but keep the final review for every exception.",
          "Decision rights are unclear, causing small choices to route back to you."
        ]
      },
      {
        sectionId: "cost",
        heading: "The cost of manager-dependency",
        paragraphs: [
          "High manager dependency slows execution velocity and prevents the team from developing independent judgment. The team learns that they are not truly responsible for outcomes if you always catch the failure."
        ]
      },
      {
        sectionId: "failed-fixes",
        heading: "Why individual speed fails as a fix",
        paragraphs: [
          "Working more hours only increases your capacity to absorb work. It does not change the logic that brought the work to your desk in the first place."
        ]
      },
      {
        sectionId: "root-cause",
        heading: "The lack of visible decision rules",
        paragraphs: [
          "The root cause is usually a set of invisible decision rules. When risk boundaries are not explicit, the safest move for the team is to ask you to decide."
        ]
      },
      {
        sectionId: "intervention",
        heading: "The first move toward leverage",
        paragraphs: [
          "Select one repeated decision that currently requires your involvement. Document the constraints and let someone else own the outcome. Review the rule, not the result, afterward."
        ]
      },
      {
        sectionId: "cta",
        heading: "Diagnose your bottleneck",
        paragraphs: [
          "Map which decisions waited for you over the last week. This audit reveals the exact path to restoring team autonomy."
        ]
      }
    ];
  }
  if (id === "opportunity-invisible-executor-framework") {
    return [
      {
        sectionId: "definition",
        heading: "What is an Invisible Executor?",
        paragraphs: [
          "The Invisible Executor defines the stage where a technical leader remains productive through hidden execution rather than visible operating systems.",
          "The transition toward strategic leadership requires moving from private expertise toward reusable operating discipline."
        ]
      },
      {
        sectionId: "problem",
        heading: "The leadership leverage gap",
        paragraphs: [
          "Many managers are promoted because they are great executors, but they struggle to shift their identity. They remain the hidden route for progress, which prevents them from shaping organizational direction."
        ]
      },
      {
        sectionId: "symptoms",
        heading: "Symptoms of hidden execution",
        bullets: [
          "Decision logic remains isolated in the leader's head.",
          "The team is productive but cannot scale without the leader's presence.",
          "Escalation skips the team and goes directly to the manager.",
          "Output remains high while strategic impact stays low."
        ]
      },
      {
        sectionId: "stages",
        heading: "Stages of leadership evolution",
        paragraphs: [
          "The journey follows a three-stage progression:",
          "1. Invisible Executor: Hidden execution and private expertise.",
          "2. Trusted Operator: Visible rules and team autonomy.",
          "3. Strategic Leader: Organizational influence and directional shape."
        ]
      },
      {
        sectionId: "interpretation",
        heading: "Interpreting the shift",
        paragraphs: [
          "This shift is about doing different work, not less work. You provide value through systems that teach judgment rather than providing the answers themselves."
        ]
      },
      {
        sectionId: "limits",
        heading: "Limits of the framework",
        paragraphs: [
          "This model addresses operational and technical leadership transitions. Dynamic management habits like 1:1s and performance reviews continue alongside this evolution."
        ]
      },
      {
        sectionId: "next-step",
        heading: "Identify your current stage",
        paragraphs: [
          "Review your last week. If you spent more time resolving implementation blockers than setting directional guardrails, you are likely operating as an Invisible Executor."
        ]
      }
    ];
  }
  if (id === "opportunity-em-coach-strategic-leadership") {
    return [
      {
        sectionId: "answer",
        heading: "Leadership coaching for strategic results",
        paragraphs: [
          "The path to a strategic role starts with changing how you decide, delegate, and lead. Coaching provides the framework to move beyond execution loops into organizational influence."
        ]
      },
      {
        sectionId: "role-context",
        heading: "Engineering Manager context",
        paragraphs: [
          "The transition from Senior Developer to Engineering Manager often leaves technical leaders stuck in high-output firefighting. We focus on the specific challenges of technical leadership leverage."
        ]
      },
      {
        sectionId: "symptoms",
        heading: "When to seek coaching support",
        bullets: [
          "You feel like you are the smartest person in the room but also the biggest bottleneck.",
          "You want to shape strategy but are consumed by implementation reviews.",
          "You share your thinking often but the team still doesn't know how to decide without you."
        ]
      },
      {
        sectionId: "mechanism",
        heading: "How technical coaching works",
        paragraphs: [
          "We use a leadership evolution model to identify where hidden work is slowing your progression. By making decision rules visible, you create the space needed for strategic impact."
        ]
      },
      {
        sectionId: "next-step",
        heading: "Restoring your focus",
        paragraphs: [
          "The next step is to choose one area where your involvement is mandatory and draft a rule that would make it optional. This is the foundation of strategic autonomy."
        ]
      },
      {
        sectionId: "why-help",
        heading: "The value of an external framework",
        paragraphs: [
          "External coaching helps you see patterns in your operating model that are invisible from the inside. A structured approach ensures you aren't just trying harder at the same habits."
        ]
      },
      {
        sectionId: "cta",
        heading: "Begin your transition",
        paragraphs: [
          "Take the first step toward leadership leverage by scheduling a diagnostic session to map your current team dependencies."
        ]
      }
    ];
  }
  return [];
}

// Main execution workflow
export function runContentOpportunityPipeline() {
  const outputDir = path.resolve(process.cwd(), "output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. Map opportunities
  const selectedOps = [
    canonicalOpportunities.find(op => op.id === "opportunity-player-trap-bottleneck")!,
    canonicalOpportunities.find(op => op.id === "opportunity-invisible-executor-framework")!,
    canonicalOpportunities.find(op => op.id === "opportunity-em-coach-strategic-leadership")!,
  ].filter((op): op is typeof canonicalOpportunities[number] => Boolean(op));

  const remainingOps = canonicalOpportunities.filter(
    op => !selectedOps.some(sel => sel.id === op.id)
  );

  const titlesForOps: Record<string, string> = {
    "opportunity-player-trap-bottleneck": "Coach for Engineering Managers Stuck as the Bottleneck",
    "opportunity-invisible-executor-framework": "Invisible Executor Framework | The Push",
    "opportunity-em-coach-strategic-leadership": "Engineering Manager Coach for Strategic Leadership | The Push",
  };

  const descriptionsForOps: Record<string, string> = {
    "opportunity-player-trap-bottleneck": "Diagnose why decisions and rescue work keep returning to you, then shift ownership into a clearer team operating model.",
    "opportunity-invisible-executor-framework": "The framework behind The Push leadership model. Learn how to transition from execution toward strategic authority.",
    "opportunity-em-coach-strategic-leadership": "Coaching system details for Engineering Managers seeking to move from firefighting execution dependencies to true strategic organizational influence.",
  };

  const artifacts: ReaderFacingPageArtifact[] = [];
  const briefs: PageBrief[] = [];

  for (const op of selectedOps) {
    const cta = getCtaForIntent(op.intentStage);
    const proofNeeded = op.sourceInsightIds.map(id => {
      const ins = approvedInsightRepository.find(ins => ins.id === id);
      return ins ? ins.summary : id;
    });

    // Create Zod compliant PageBrief
    const brief = pageBriefSchema.parse({
      id: `page-brief-${op.id}`,
      sourceInsightIds: op.sourceInsightIds,
      title: titlesForOps[op.id],
      canonicalPath: `/${op.pageType === "pillar" ? "pillars" : op.pageType === "framework" ? "frameworks" : "clusters"}/${op.proposedSlug}`,
      reviewStatus: "draft",
      marketContext: {
        summary: `Market intelligence context for ${op.proposedSlug}.`,
        marketMap: ["technical leadership coaching"],
        trendList: ["strategic progression", "executive visibility"],
        riskNotes: ["Ensure claims are grounded only in the source insights."],
      },
      audiencePain: {
        summary: "Target manager suffers from lack of organizational leverage.",
        painThemes: ["stuck in firefighting", "execution bottlenecks"],
        workarounds: ["working longer hours", "micromanagement"],
        triggerEvents: ["promotion to EM", "AI tool adoption bottlenecks"],
      },
      searchIntent: {
        summary: op.targetQuery,
        intentClusters: [op.targetQuery],
        priorityQueries: [op.targetQuery],
      },
      topicClusterPosition: {
        summary: `Placement for ${op.proposedSlug}`,
        pillar: "/pillars/tech-leadership-coaching",
        clusterRole: op.id === "opportunity-player-trap-bottleneck" ? "primary" : "supporting",
        internalLinks: ["/pillars/tech-leadership-coaching"],
      },
      uniqueAngle: op.id === "opportunity-player-trap-bottleneck" ? "Diagnostic first" : "Framework mapping",
      proofNeeded,
      pagePromise: "Clear actionable framework paths.",
      contentPlan: [
        {
          sectionTitle: "Overview",
          purpose: "Name the topic and query directly.",
          proofNeeded,
        },
      ],
      cta,
      author: "Itay Foyerstein",
      reviewerNotes: "Generated via automated pipeline. Bounded by source insights.",
    });

    briefs.push(brief);

    // Create versioned ReaderFacingPageArtifact
    const artifactId = op.id === "opportunity-player-trap-bottleneck"
      ? "authority-draft-approved-insight-player-trap-05"
      : `authority-draft-${op.id}`;
    
    const artifactVersion = op.id === "opportunity-player-trap-bottleneck" ? 3 : 1;

    // Validate CTA public URLs
    if (!validatePublicUrl(brief.cta.href)) {
      throw new Error(`Invalid CTA public URL target: ${brief.cta.href}`);
    }

    const draftInput = {
      artifactId,
      artifactVersion,
      schemaVersion: "1.0.0",
      createdAt: FIXED_TIMESTAMP,
      pageType: op.pageType,
      canonicalPath: brief.canonicalPath,
      locale: "en",
      title: titlesForOps[op.id],
      description: descriptionsForOps[op.id],
      body: getImprovedBodyForOp(op.id),
      primaryCta: {
        label: brief.cta.label,
        href: brief.cta.href as `/${string}`,
        context: brief.cta.rationale,
      },
      internalLinks: [], // Empty public links array
      faq: [],
      seo: {
        title: titlesForOps[op.id],
        description: descriptionsForOps[op.id],
      },
      structuredDataInput: {
        type: op.pageType === "pillar" ? ("Article" as const) : ("Person" as const),
      },
    };

    const artifact = createReaderFacingArtifactDraft(draftInput);
    artifacts.push(artifact);
  }

  const queueEntries: ContentOpportunityQueueEntry[] = [];
  
  for (let i = 0; i < selectedOps.length; i++) {
    const op = selectedOps[i];
    const artifact = artifacts[i];
    const brief = briefs[i];

    // 1. Core validations
    const deterministicVal = validateReaderFacingArtifactDeterministically(artifact, FIXED_TIMESTAMP);
    const languageVal = validateArtifactInternalLanguage(artifact, FIXED_TIMESTAMP);
    const completenessVal = validateArtifactCompleteness(artifact, FIXED_TIMESTAMP);
    const urlVal = validateArtifactUrls(artifact, activePaths, FIXED_TIMESTAMP);

    // 2. Differentiation check
    const others = artifacts.filter(a => a.artifactId !== artifact.artifactId);
    const differentiationVal = analyzeArtifactDifferentiation(artifact, others, FIXED_TIMESTAMP);

    queueEntries.push({
      artifactId: artifact.artifactId,
      artifactVersion: artifact.artifactVersion,
      artifactHash: artifact.artifactHash,
      canonicalPath: artifact.canonicalPath,
      pageType: artifact.pageType,
      lifecycle: artifact.lifecycle,
      intendedQuery: op.targetQuery,
      ctaRationale: brief.cta.rationale,
      sourceInsightMapping: op.sourceInsightIds,
      claimsTraceability: buildClaimTraceability(op.sourceInsightIds),
      overlapAnalysis: differentiationVal.metadata?.analysis as DifferentiationAnalysis[] || [],
      plannedInternalLinks: brief.topicClusterPosition.internalLinks,
      governanceMetadata: {
        reviewPriority: op.priorityScore === 95 ? 1 : op.priorityScore === 90 ? 2 : 3,
        suggestedPublicationOrder: op.id === "opportunity-invisible-executor-framework" ? 1 : op.id === "opportunity-player-trap-bottleneck" ? 2 : 3,
      },
      validation: {
        deterministic: {
          passed: deterministicVal.passed,
          failureCodes: deterministicVal.failureCodes,
        },
        internalLanguage: {
          passed: languageVal.passed,
          failureCodes: languageVal.failureCodes,
        },
        completeness: {
          passed: completenessVal.passed,
          failureCodes: completenessVal.failureCodes,
        },
        url: {
          passed: urlVal.passed,
          failureCodes: urlVal.failureCodes,
        },
        differentiation: {
          passed: differentiationVal.passed,
          failureCodes: differentiationVal.failureCodes,
        },
      },
      semanticReview: "not_run",
      humanApproval: "absent",
      publicationRecord: "absent",
      publicationBlocked: true,
      previewRoute: `/preview/artifacts/${artifact.artifactId}`,
      readerFacingContent: {
        title: artifact.title,
        description: artifact.description,
        body: artifact.body,
        primaryCta: artifact.primaryCta,
        internalLinks: artifact.internalLinks,
      },
    });
  }

  // 3. Write outputs to output/ directory
  fs.writeFileSync(
    path.join(outputDir, "human-review-queue.json"),
    JSON.stringify(queueEntries, null, 2),
    "utf8"
  );

  // Write publication order Markdown
  const pubOrderMd = `# Human Review Priority & Publication Order

## 1. Review Priority

1. **opportunity-player-trap-bottleneck** — Priority Score: 95
2. **opportunity-invisible-executor-framework** — Priority Score: 90
3. **opportunity-em-coach-strategic-leadership** — Priority Score: 85

## 2. Publication Order

1. **opportunity-invisible-executor-framework**
2. **opportunity-player-trap-bottleneck**
3. **opportunity-em-coach-strategic-leadership**
`;

  fs.writeFileSync(path.join(outputDir, "publication-order.md"), pubOrderMd, "utf8");

  console.log("Successfully ran ContentOpportunity pipeline.");
}

// Run if called directly
const entryPoint = process.argv[1];
if (entryPoint && path.resolve(entryPoint) === path.resolve(process.argv[1])) {
  runContentOpportunityPipeline();
}
