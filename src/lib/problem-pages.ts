import { getServerPayload } from "./payload";
import { buildPublicationDecision, type PublicationDecision, type PublicationSourceRecord } from "../ai/governance/publication-state";
import {
  serializeProblemPagePublicationRevision,
  serializeProblemPageRevisionContent,
  validatePublicationApproval,
} from "../ai/governance/publication-approval";
export { buildProblemPageJsonLd } from "./problem-page-schema";

export type ProblemPageStatus = "draft" | "review" | "in_review" | "approved" | "published" | "archived";

export interface ProblemPageHumanApproval {
  approvalTimestamp: string;
  approver: string;
  contentRevisionHash: string;
  publicationRevisionHash?: string;
  supportingApprovedInsightIds: string[];
  validationResult: {
    deterministicHardGatesPassed: boolean;
    semanticQualityPassed: boolean;
    failureCodes: string[];
  };
  publicationScope: {
    approvedCanonicalPaths: string[];
    excludedDraftIds: string[];
    deploymentAuthorized: boolean;
    publicationAuthorized: boolean;
  };
  [key: string]: unknown;
}

export interface ProblemPageLink {
  label: string;
  href: string;
  reason: string;
}

export interface ProblemPageEvidenceBlock {
  claim: string;
  source: string;
  relatedEntity: string;
  confidence: "high" | "medium" | "low";
  approvalStatus: "approved" | "source-backed" | "review";
}

export interface ProblemPageRecord {
  title: string;
  slug: string;
  painStatement: string;
  dailyScenes: string[];
  whatTheyTried: string[];
  whyItFailed: string;
  diagnosis: string;
  evidenceBlock: ProblemPageEvidenceBlock;
  primaryCTA: ProblemPageLink;
  relatedFrameworks: ProblemPageLink[];
  relatedClusters: ProblemPageLink[];
  seoTitle: string;
  seoDescription: string;
  status: ProblemPageStatus;
  humanApproval?: ProblemPageHumanApproval;
  humanApproved?: boolean;
  canonicalUrl?: string | null;
  publishedAt?: string;
  updatedAt?: string;
  indexable?: boolean;
  sitemapEligible?: boolean;
  llmsTxtEligible?: boolean;
  schemaEligible?: boolean;
}

export interface ProblemPageModel {
  record: ProblemPageRecord;
  pathname: string;
  canonicalUrl: string;
  publicationDecision: PublicationDecision;
}

interface ProblemPageLoaderOptions {
  payload?: unknown;
  allowStaticFallback?: boolean;
}

const problemPages = [
  {
    title: "CTO Becomes the Bottleneck",
    slug: "cto-becomes-the-bottleneck",
    painStatement: "The CTO is still the default answer for technical judgment, escalation, and priority decisions.",
    dailyScenes: [
      "Every hard call lands back with the CTO.",
      "The team waits for technical approval instead of moving with clarity.",
      "Strategic time disappears into review and rescue work.",
    ],
    whatTheyTried: [
      "Delegating more decisions without changing decision rights.",
      "Adding more process and hoping the load will shrink.",
      "Staying close to the work so nothing breaks without the CTO.",
    ],
    whyItFailed: "The bottleneck is structural. More effort does not remove the dependency path.",
    diagnosis:
      "This is an Invisible Executor problem: high output, hidden judgment, and an organization that still routes through one person.",
    evidenceBlock: {
      claim: "The Push and Invisible Executor explain why a CTO can look effective while still being the bottleneck for judgment and priority.",
      source: "docs/seed-content/invisible-executor-framework.md",
      relatedEntity: "Invisible Executor",
      confidence: "high",
      approvalStatus: "approved",
    },
    primaryCTA: {
      label: "Book a fit call",
      href: "/book-a-fit-call",
      reason: "Talk through whether the bottleneck needs coaching or a diagnostic first.",
    },
    relatedFrameworks: [
      {
        label: "Invisible Executor",
        href: "/frameworks/invisible-executor",
        reason: "Names the hidden-load starting state.",
      },
      {
        label: "The Push methodology",
        href: "/the-push-methodology",
        reason: "Explains the leadership shift out of the bottleneck.",
      },
    ],
    relatedClusters: [
      {
        label: "Engineering Manager Coach for Strategic Leadership",
        href: "/clusters/engineering-manager-coach-for-strategic-leadership",
        reason: "Connects the bottleneck diagnosis to the leadership transition cluster.",
      },
      {
        label: "AI-era Leadership Operating System for Engineering Managers",
        href: "/clusters/ai-era-leadership-operating-system-for-engineering-managers",
        reason: "Shows the operating model pressure behind the bottleneck.",
      },
    ],
    seoTitle: "CTO Becomes the Bottleneck | The Push",
    seoDescription: "A problem page for CTOs who are still the default path for judgment, escalation, and progress.",
    status: "published" as const,
    humanApproved: true,
  },
  {
    title: "VP R&D Losing Execution Control",
    slug: "vp-rnd-losing-execution-control",
    painStatement: "The VP R&D is still managing execution directly instead of shaping the system that produces it.",
    dailyScenes: [
      "The roadmap depends on the VP to unblock progress.",
      "Leaders ask for decisions instead of ownership.",
      "Delivery speed comes with more hidden coordination.",
    ],
    whatTheyTried: [
      "Hiring more people to absorb the load.",
      "Creating more dashboards and check-ins.",
      "Telling the team to be more autonomous without changing the operating model.",
    ],
    whyItFailed: "Execution control is not a headcount issue. It is a decision-architecture issue.",
    diagnosis:
      "The Push helps expose the invisible decision loop so the VP can move from execution control to strategic leverage.",
    evidenceBlock: {
      claim: "The Push methodology exists to make the hidden operating model visible for technical leaders who carry too much execution load.",
      source: "docs/seed-content/the-push-methodology.md",
      relatedEntity: "The Push",
      confidence: "high",
      approvalStatus: "approved",
    },
    primaryCTA: {
      label: "Book a fit call",
      href: "/book-a-fit-call",
      reason: "Confirm whether this is a coaching fit or a broader operating change.",
    },
    relatedFrameworks: [
      {
        label: "The Push methodology",
        href: "/the-push-methodology",
        reason: "Shows the operating model the page points toward.",
      },
      {
        label: "Invisible Executor",
        href: "/frameworks/invisible-executor",
        reason: "Names the hidden-load state that usually drives the symptom.",
      },
    ],
    relatedClusters: [
      {
        label: "From Technical Expert to Strategic Engineering Leader",
        href: "/clusters/from-technical-expert-to-strategic-engineering-leader",
        reason: "Connects the role shift to the problem.",
      },
      {
        label: "Why Tech Leads Struggle After Promotion",
        href: "/clusters/why-tech-leads-struggle-after-promotion",
        reason: "Shows a common transition path into the same problem.",
      },
    ],
    seoTitle: "VP R&D Losing Execution Control | The Push",
    seoDescription: "A problem page for VP R&D leaders who need to move from direct execution control to strategic leverage.",
    status: "published" as const,
    humanApproved: true,
  },
  {
    title: "Engineering Managers Stuck in Firefighting",
    slug: "engineering-managers-stuck-in-firefighting",
    painStatement: "The manager is spending more time rescuing work than building a system that can run without rescue.",
    dailyScenes: [
      "Every week starts with a new urgent escalation.",
      "The manager becomes the default reviewer and decoder.",
      "The team waits for the manager to make work move.",
    ],
    whatTheyTried: [
      "Working harder and staying available longer.",
      "Delegating tasks instead of decision rights.",
      "Adding more process to keep the fire smaller.",
    ],
    whyItFailed: "Firefighting persists when the team still depends on the manager to interpret, decide, and approve.",
    diagnosis: "This is the Player Trap: execution strength becomes a dependency problem.",
    evidenceBlock: {
      claim: "Player Trap describes the state where a manager's execution strength turns into a dependency problem for the team.",
      source: "docs/seed-content/coach-for-engineering-managers-stuck-as-the-bottleneck.md",
      relatedEntity: "Player Trap",
      confidence: "high",
      approvalStatus: "approved",
    },
    primaryCTA: {
      label: "Book a fit call",
      href: "/book-a-fit-call",
      reason: "Decide whether the next step is coaching or the diagnostic route first.",
    },
    relatedFrameworks: [
      {
        label: "Invisible Executor",
        href: "/frameworks/invisible-executor",
        reason: "Names the hidden work pattern underneath the firefighting.",
      },
    ],
    relatedClusters: [
      {
        label: "Coach for Engineering Managers Stuck as the Bottleneck",
        href: "/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck",
        reason: "Directly matches the role-specific problem.",
      },
      {
        label: "How Engineering Managers Become Bottlenecks in AI-assisted Teams",
        href: "/clusters/how-engineering-managers-become-bottlenecks-in-ai-assisted-teams",
        reason: "Explains the AI-era pressure that amplifies the problem.",
      },
    ],
    seoTitle: "Engineering Managers Stuck in Firefighting | The Push",
    seoDescription: "A problem page for managers who keep rescuing work instead of leading a team that can move on its own.",
    status: "draft" as const,
  },
  {
    title: "Senior Developer Still Acting Like a Developer",
    slug: "senior-developer-still-acting-like-a-developer",
    painStatement: "The new leader still solves problems directly instead of building the operating model of a manager.",
    dailyScenes: [
      "Technical work is easier than letting the team own the outcome.",
      "The leader keeps jumping into the implementation details.",
      "Management feels like more work, not a different job.",
    ],
    whatTheyTried: [
      "Reading management advice without changing work patterns.",
      "Delegating a few tasks while keeping the hard decisions.",
      "Calling the shift a mindset issue instead of an operating model issue.",
    ],
    whyItFailed: "The role changed, but the leader's default operating system did not.",
    diagnosis:
      "The Push helps the person move from expert execution into visible leadership by making the hidden rules of work explicit.",
    evidenceBlock: {
      claim: "The Push makes the shift from technical expert to strategic leader explicit and readable.",
      source: "docs/seed-content/from-technical-expert-to-strategic-engineering-leader.md",
      relatedEntity: "Strategic Leader",
      confidence: "high",
      approvalStatus: "approved",
    },
    primaryCTA: {
      label: "Book a fit call",
      href: "/book-a-fit-call",
      reason: "Talk through the transition before adding more tactics.",
    },
    relatedFrameworks: [
      {
        label: "The Push methodology",
        href: "/the-push-methodology",
        reason: "Shows the shift out of expert mode.",
      },
    ],
    relatedClusters: [
      {
        label: "From Technical Expert to Strategic Engineering Leader",
        href: "/clusters/from-technical-expert-to-strategic-engineering-leader",
        reason: "Frames the exact transition problem.",
      },
      {
        label: "Why Tech Leads Struggle After Promotion",
        href: "/clusters/why-tech-leads-struggle-after-promotion",
        reason: "Shows the same mismatch after promotion.",
      },
    ],
    seoTitle: "Senior Developer Still Acting Like a Developer | The Push",
    seoDescription: "A problem page for leaders who have moved up but are still operating like individual contributors.",
    status: "draft" as const,
  },
  {
    title: "AI Adoption Creates More Work, Not Leverage",
    slug: "ai-adoption-creates-more-work-not-leverage",
    painStatement: "AI tools are increasing review, coordination, and ambiguity instead of freeing up strategic time.",
    dailyScenes: [
      "The team produces more output but still needs more review.",
      "The manager now interprets both the work and the AI output.",
      "Process grows, but leverage does not.",
    ],
    whatTheyTried: [
      "Adding AI without changing decision rules.",
      "Tightening process around the same operating model.",
      "Expecting leverage to appear from tooling alone.",
    ],
    whyItFailed: "Tools do not create leverage if the hidden operating model stays the same.",
    diagnosis:
      "The leader needs a clearer operating model before AI can reduce load instead of shifting it upward.",
    evidenceBlock: {
      claim: "AI-era leadership problems often increase the amount of coordination and review work landing on managers.",
      source: "docs/seed-content/how-to-lead-ai-generated-code-reviews-without-drowning.md",
      relatedEntity: "AI-assisted teams",
      confidence: "high",
      approvalStatus: "approved",
    },
    primaryCTA: {
      label: "Book a fit call",
      href: "/book-a-fit-call",
      reason: "Decide whether the issue is tool adoption or leadership operating model clarity.",
    },
    relatedFrameworks: [
      {
        label: "Invisible Executor",
        href: "/frameworks/invisible-executor",
        reason: "Names the hidden-review bottleneck that AI can amplify.",
      },
    ],
    relatedClusters: [
      {
        label: "How to Lead AI-generated Code Reviews Without Drowning",
        href: "/clusters/how-to-lead-ai-generated-code-reviews-without-drowning",
        reason: "Shows the AI review-pressure version of the problem.",
      },
      {
        label: "AI-era Leadership Operating System for Engineering Managers",
        href: "/clusters/ai-era-leadership-operating-system-for-engineering-managers",
        reason: "Shows how AI changes the operating model pressure.",
      },
    ],
    seoTitle: "AI Adoption Creates More Work, Not Leverage | The Push",
    seoDescription: "A problem page for leaders whose AI rollout increased coordination load instead of leverage.",
    status: "draft" as const,
  },
  {
    title: "Product & Engineering Misalignment",
    slug: "product-engineering-misalignment",
    painStatement: "The team is shipping work, but Product and Engineering are still not aligned on decision-making or priorities.",
    dailyScenes: [
      "Roadmap conversations turn into translation sessions.",
      "The leader spends time resolving disagreement instead of clarifying direction.",
      "Progress keeps stalling on ownership boundaries.",
    ],
    whatTheyTried: [
      "More meetings between Product and Engineering.",
      "Richer planning docs and more status updates.",
      "Escalating the same disagreement to leadership.",
    ],
    whyItFailed: "Alignment does not improve if the decision rights and operating rules stay unclear.",
    diagnosis:
      "The Push turns the hidden dependency pattern into visible rules that both sides can work with.",
    evidenceBlock: {
      claim: "The Push is meant to make the operating model visible enough that leadership and decision boundaries can be scaled.",
      source: "docs/seed-content/the-push-methodology.md",
      relatedEntity: "The Push",
      confidence: "high",
      approvalStatus: "approved",
    },
    primaryCTA: {
      label: "Book a fit call",
      href: "/book-a-fit-call",
      reason: "Check whether the misalignment is a fit-call problem or a broader operating issue.",
    },
    relatedFrameworks: [
      {
        label: "The Push methodology",
        href: "/the-push-methodology",
        reason: "Explains the decision-model shift.",
      },
    ],
    relatedClusters: [
      {
        label: "AI-era Leadership Operating System for Engineering Managers",
        href: "/clusters/ai-era-leadership-operating-system-for-engineering-managers",
        reason: "Shows the leadership-system layer behind alignment.",
      },
      {
        label: "Engineering Manager Coach for Strategic Leadership",
        href: "/clusters/engineering-manager-coach-for-strategic-leadership",
        reason: "Connects alignment to strategic leadership work.",
      },
    ],
    seoTitle: "Product & Engineering Misalignment | The Push",
    seoDescription: "A problem page for teams that keep shipping work without a shared decision model.",
    status: "draft" as const,
  },
  {
    title: "Squads Depend on One Strong Manager",
    slug: "squads-depend-on-one-strong-manager",
    painStatement: "The team looks stable, but everything still depends on one strong manager to keep things moving.",
    dailyScenes: [
      "The squad only seems fast when the manager is involved.",
      "Decisions wait until the manager weighs in.",
      "The team can execute, but not independently.",
    ],
    whatTheyTried: [
      "Pushing ownership without changing the path of escalation.",
      "Adding more ceremonies to spread the load.",
      "Trusting time to fix the dependency by itself.",
    ],
    whyItFailed: "A strong manager can hide the dependency instead of removing it.",
    diagnosis: "This is the Player Trap again: strength creates the bottleneck that the team has learned to route through.",
    evidenceBlock: {
      claim: "Player Trap describes the state where strong execution becomes a team dependency.",
      source: "docs/seed-content/coach-for-engineering-managers-stuck-as-the-bottleneck.md",
      relatedEntity: "Player Trap",
      confidence: "high",
      approvalStatus: "approved",
    },
    primaryCTA: {
      label: "Book a fit call",
      href: "/book-a-fit-call",
      reason: "Decide whether the team needs coaching, diagnosis, or a different starting point.",
    },
    relatedFrameworks: [
      {
        label: "Invisible Executor",
        href: "/frameworks/invisible-executor",
        reason: "Shows the hidden dependency pattern behind the team.",
      },
    ],
    relatedClusters: [
      {
        label: "Coach for Engineering Managers Stuck as the Bottleneck",
        href: "/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck",
        reason: "Directly names the bottleneck pattern.",
      },
    ],
    seoTitle: "Squads Depend on One Strong Manager | The Push",
    seoDescription: "A problem page for teams that only move when one manager is personally involved.",
    status: "draft" as const,
  },
  {
    title: "Busy Execution Without Business Results",
    slug: "busy-execution-without-business-results",
    painStatement: "The team is busy, but the work is not producing the business movement leadership expected.",
    dailyScenes: [
      "Everyone is moving, but the outcome is still unclear.",
      "The manager is reacting to requests instead of shaping direction.",
      "Activity increases while strategic impact stays flat.",
    ],
    whatTheyTried: [
      "Adding more tasks and more reporting.",
      "Trying to optimize effort without changing priorities.",
      "Pushing for speed while the underlying model stays unchanged.",
    ],
    whyItFailed: "Busy execution is not the same as leverage or business impact.",
    diagnosis:
      "The Push helps leaders move from output-first execution to visible strategic leadership.",
    evidenceBlock: {
      claim: "The Push is designed to move technical leaders from execution pressure into strategic leadership.",
      source: "docs/seed-content/from-technical-expert-to-strategic-engineering-leader.md",
      relatedEntity: "Strategic Leader",
      confidence: "high",
      approvalStatus: "approved",
    },
    primaryCTA: {
      label: "Book a fit call",
      href: "/book-a-fit-call",
      reason: "Confirm whether the next step is coaching or a more basic diagnostic.",
    },
    relatedFrameworks: [
      {
        label: "The Push methodology",
        href: "/the-push-methodology",
        reason: "Explains the shift from busy work to leverage.",
      },
    ],
    relatedClusters: [
      {
        label: "From Technical Expert to Strategic Engineering Leader",
        href: "/clusters/from-technical-expert-to-strategic-engineering-leader",
        reason: "Maps the transition to the business outcome.",
      },
    ],
    seoTitle: "Busy Execution Without Business Results | The Push",
    seoDescription: "A problem page for teams that are active but not creating the expected business movement.",
    status: "draft" as const,
  },
  {
    title: "Leadership Team Cannot Scale Decisions",
    slug: "leadership-team-cannot-scale-decisions",
    painStatement: "The leadership team is still depending on a few people to make every hard decision.",
    dailyScenes: [
      "Strategic issues bounce between the same leaders.",
      "Decision speed drops as scope increases.",
      "The org wants consistency but keeps negotiating every call.",
    ],
    whatTheyTried: [
      "More alignment meetings.",
      "More escalation points.",
      "More documentation without clearer decision rights.",
    ],
    whyItFailed: "Scaling decisions requires a visible operating model, not more discussion.",
    diagnosis:
      "The Push turns hidden decision logic into a legible system leaders can actually use.",
    evidenceBlock: {
      claim: "The Push helps technical leaders make the operating model visible so decisions can scale.",
      source: "docs/seed-content/the-push-methodology.md",
      relatedEntity: "The Push",
      confidence: "high",
      approvalStatus: "approved",
    },
    primaryCTA: {
      label: "Book a fit call",
      href: "/book-a-fit-call",
      reason: "Decide whether the system needs coaching or a narrower diagnostic route.",
    },
    relatedFrameworks: [
      {
        label: "The Push methodology",
        href: "/the-push-methodology",
        reason: "Explains how to scale decision rights.",
      },
      {
        label: "Invisible Executor",
        href: "/frameworks/invisible-executor",
        reason: "Names the hidden decision-load problem first.",
      },
    ],
    relatedClusters: [
      {
        label: "Engineering Manager Coach for Strategic Leadership",
        href: "/clusters/engineering-manager-coach-for-strategic-leadership",
        reason: "Connects the problem to strategic leadership.",
      },
      {
        label: "AI-era Leadership Operating System for Engineering Managers",
        href: "/clusters/ai-era-leadership-operating-system-for-engineering-managers",
        reason: "Shows the system-level pressure around decision scaling.",
      },
    ],
    seoTitle: "Leadership Team Cannot Scale Decisions | The Push",
    seoDescription: "A problem page for leadership teams that cannot scale decision-making beyond a few people.",
    status: "draft" as const,
  },
  {
    title: "Good Managers Burning Out Quietly",
    slug: "good-managers-burning-out-quietly",
    painStatement: "The manager looks competent on the outside but is carrying more invisible load than the role should require.",
    dailyScenes: [
      "They are still the fallback for everything important.",
      "The work keeps expanding because they can handle it.",
      "The load is visible only when the manager starts to stall.",
    ],
    whatTheyTried: [
      "Telling themselves the load is normal.",
      "Working harder to keep pace with the pressure.",
      "Adding more personal resilience instead of changing the system.",
    ],
    whyItFailed: "Quiet burnout is often a sign that the system is consuming the manager's leverage.",
    diagnosis:
      "The Push reduces hidden load by exposing the problem state and moving the leader out of permanent rescue mode.",
    evidenceBlock: {
      claim: "Smart managers often burn out because the organization keeps asking them to be the system.",
      source: "docs/seed-content/why-smart-managers-burn-out.md",
      relatedEntity: "The Push",
      confidence: "high",
      approvalStatus: "approved",
    },
    primaryCTA: {
      label: "Book a fit call",
      href: "/book-a-fit-call",
      reason: "Talk through the load before it turns into a deeper problem.",
    },
    relatedFrameworks: [
      {
        label: "Invisible Executor",
        href: "/frameworks/invisible-executor",
        reason: "Shows the hidden load pattern behind quiet burnout.",
      },
    ],
    relatedClusters: [
      {
        label: "Why Smart Managers Burn Out",
        href: "/clusters/why-smart-managers-burn-out",
        reason: "Directly addresses the problem state.",
      },
      {
        label: "Coach for Engineering Managers Stuck as the Bottleneck",
        href: "/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck",
        reason: "Connects burnout to the bottleneck pattern.",
      },
    ],
    seoTitle: "Good Managers Burning Out Quietly | The Push",
    seoDescription: "A problem page for capable managers who are absorbing too much hidden load.",
    status: "draft" as const,
  },
] as const satisfies ProblemPageRecord[];

export const problemPageCatalog = problemPages;

export function getProblemPagePathnames() {
  return problemPageCatalog.map((page) => `/problems/${page.slug}`);
}

export function getPublishedProblemPagePathnames(origin = "https://itayfoyerstein.com") {
  return problemPageCatalog.flatMap((page) => {
    const decision = buildProblemPagePublicationDecision(page, {
      origin,
      pathname: `/problems/${page.slug}`,
    });

    return decision.sitemapEligible ? [`/problems/${page.slug}`] : [];
  });
}

export function getProblemPageCatalogEntry(slug: string): ProblemPageRecord | undefined {
  return problemPageCatalog.find((page) => page.slug === slug);
}

export function getProblemPagesForSurface(pathname: string): ProblemPageRecord[] {
  return problemPageCatalog.filter((page) =>
    page.relatedFrameworks.some((link) => link.href === pathname) || page.relatedClusters.some((link) => link.href === pathname),
  );
}

export function buildProblemPagePublicationDecision(
  record: ProblemPageRecord,
  context: {
    origin: string;
    pathname?: string;
    treatAsHumanApproved?: boolean;
    canonicalUrl?: string | null;
    indexable?: boolean;
    sitemapEligible?: boolean;
    llmsTxtEligible?: boolean;
    schemaEligible?: boolean;
    publiclyAccessible?: boolean;
  },
) {
  const pathname = context.pathname ?? `/problems/${record.slug}`;
  const canonicalUrl =
    context.canonicalUrl !== undefined
      ? context.canonicalUrl
      : record.canonicalUrl !== undefined
        ? record.canonicalUrl
        : new URL(pathname, context.origin).toString();

  return buildPublicationDecision(
    {
      slug: record.slug,
      status: toPublicationLifecycleStatus(record.status),
      title: record.title,
      seoTitle: record.seoTitle,
      seoDescription: record.seoDescription,
      painStatement: record.painStatement,
      diagnosis: record.diagnosis,
      humanApproved: record.humanApproved,
      canonicalUrl: record.canonicalUrl ?? null,
      indexable: record.indexable,
      sitemapEligible: record.sitemapEligible,
      llmsTxtEligible: record.llmsTxtEligible,
      schemaEligible: record.schemaEligible,
    },
    {
      origin: context.origin,
      pathname,
      treatAsHumanApproved: context.treatAsHumanApproved,
      canonicalUrl,
      indexable: context.indexable,
      sitemapEligible: context.sitemapEligible,
      llmsTxtEligible: context.llmsTxtEligible,
      schemaEligible: context.schemaEligible,
      publiclyAccessible: context.publiclyAccessible,
    },
  );
}

export async function loadProblemPage(
  slug: string,
  origin: string,
  options: ProblemPageLoaderOptions = {},
): Promise<ProblemPageModel | null> {
  try {
    const payload = (options.payload ?? (await getServerPayload())) as {
      find(args: Record<string, unknown>): Promise<{ docs: unknown[] }>;
    };
    const result = await payload.find({
      collection: "problem-pages",
      limit: 1,
      overrideAccess: true,
      where: {
        slug: {
          equals: slug,
        },
      },
    } as never);

    const record = result.docs[0] as unknown as Record<string, unknown> | undefined;
    if (record) {
      const { buildProblemPageSurfaceEntry } = await import("./publication-surface-projection");
      return buildProblemPageSurfaceEntry({ record, origin })?.problemPage ?? null;
    }
  } catch {
    // Fall back to the static catalog below.
  }

  if (options.allowStaticFallback === false || (options.allowStaticFallback === undefined && process.env.NODE_ENV === "production")) {
    return null;
  }

  const fallback = getProblemPageCatalogEntry(slug);

  if (!fallback) {
    return null;
  }

  const { buildProblemPageSurfaceEntry } = await import("./publication-surface-projection");
  return buildProblemPageSurfaceEntry({ record: fallback, origin, trustStaticApproval: true })?.problemPage ?? null;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      if (item && typeof item === "object") {
        const record = item as Record<string, unknown>;
        if (typeof record.value === "string") {
          return record.value.trim();
        }
      }

      return "";
    })
    .filter(Boolean);
}

function normalizeProblemPageLink(value: unknown): ProblemPageLink[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") {
      return [];
    }

    const record = item as Record<string, unknown>;
    const label = typeof record.label === "string" ? record.label.trim() : "";
    const href = typeof record.href === "string" ? record.href.trim() : "";
    const reason = typeof record.reason === "string" ? record.reason.trim() : "";

    if (!label || !href || !reason) {
      return [];
    }

    return [{ label, href, reason }];
  });
}

function normalizeProblemPageStatus(status: unknown): ProblemPageStatus {
  return status === "review" ||
    status === "in_review" ||
    status === "approved" ||
    status === "published" ||
    status === "archived"
    ? status
    : "draft";
}

function toPublicationLifecycleStatus(status: ProblemPageStatus): PublicationSourceRecord["status"] {
  return status === "in_review" || status === "approved" ? "review" : status;
}

function normalizeApprovalStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const normalized = value.map((item) => {
    if (typeof item === "string") {
      return item.trim();
    }

    if (item && typeof item === "object" && typeof (item as Record<string, unknown>).value === "string") {
      return ((item as Record<string, unknown>).value as string).trim();
    }

    return null;
  });

  return normalized.some((item) => item === null) ? null : normalized.filter((item): item is string => Boolean(item));
}

function normalizeProblemPageHumanApproval(value: unknown): ProblemPageHumanApproval | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const approval = value as Record<string, unknown>;
  const validation = approval.validationResult;
  const scope = approval.publicationScope;

  if (!validation || typeof validation !== "object" || !scope || typeof scope !== "object") {
    return undefined;
  }

  const validationRecord = validation as Record<string, unknown>;
  const scopeRecord = scope as Record<string, unknown>;
  const failureCodes = normalizeApprovalStringArray(validationRecord.failureCodes);
  const approvedCanonicalPaths = normalizeApprovalStringArray(scopeRecord.approvedCanonicalPaths);
  const excludedDraftIds = normalizeApprovalStringArray(scopeRecord.excludedDraftIds);
  const approvalTimestamp = typeof approval.approvalTimestamp === "string" ? approval.approvalTimestamp.trim() : "";
  const approver = typeof approval.approver === "string" ? approval.approver.trim() : "";
  const contentRevisionHash = typeof approval.contentRevisionHash === "string" ? approval.contentRevisionHash.trim() : "";
  const publicationRevisionHash =
    typeof approval.publicationRevisionHash === "string" ? approval.publicationRevisionHash.trim() : "";
  const supportingApprovedInsightIds =
    approval.supportingApprovedInsightIds === undefined
      ? []
      : normalizeApprovalStringArray(approval.supportingApprovedInsightIds);

  if (
    !approvalTimestamp ||
    Number.isNaN(Date.parse(approvalTimestamp)) ||
    !approver ||
    !/^[a-f0-9]{64}$/i.test(contentRevisionHash) ||
    (publicationRevisionHash !== "" && !/^[a-f0-9]{64}$/i.test(publicationRevisionHash)) ||
    failureCodes === null ||
    approvedCanonicalPaths === null ||
    excludedDraftIds === null ||
    supportingApprovedInsightIds === null ||
    typeof validationRecord.deterministicHardGatesPassed !== "boolean" ||
    typeof validationRecord.semanticQualityPassed !== "boolean" ||
    typeof scopeRecord.deploymentAuthorized !== "boolean" ||
    typeof scopeRecord.publicationAuthorized !== "boolean"
  ) {
    return undefined;
  }

  return {
    ...approval,
    approvalTimestamp,
    approver,
    contentRevisionHash,
    publicationRevisionHash: publicationRevisionHash || undefined,
    supportingApprovedInsightIds,
    validationResult: {
      deterministicHardGatesPassed: validationRecord.deterministicHardGatesPassed,
      semanticQualityPassed: validationRecord.semanticQualityPassed,
      failureCodes,
    },
    publicationScope: {
      approvedCanonicalPaths,
      excludedDraftIds,
      deploymentAuthorized: scopeRecord.deploymentAuthorized,
      publicationAuthorized: scopeRecord.publicationAuthorized,
    },
  };
}

export function normalizeProblemPageRecord(
  record: Record<string, unknown>,
  canonicalOrigin = "https://itayfoyerstein.com",
): ProblemPageRecord | null {
  const title = typeof record.title === "string" ? record.title.trim() : "";
  const slug = typeof record.slug === "string" ? record.slug.trim() : "";
  const painStatement = typeof record.painStatement === "string" ? record.painStatement.trim() : "";
  const whyItFailed = typeof record.whyItFailed === "string" ? record.whyItFailed.trim() : "";
  const diagnosis = typeof record.diagnosis === "string" ? record.diagnosis.trim() : "";
  const seoTitle = typeof record.seoTitle === "string" ? record.seoTitle.trim() : title;
  const seoDescription = typeof record.seoDescription === "string" ? record.seoDescription.trim() : painStatement;
  const status = typeof record.status === "string" ? record.status : "draft";
  const humanApproval = normalizeProblemPageHumanApproval(record.humanApproval);

  if (!title || !slug || !painStatement || !whyItFailed || !diagnosis) {
    return null;
  }

  const evidenceBlockRaw = record.evidenceBlock && typeof record.evidenceBlock === "object" ? (record.evidenceBlock as Record<string, unknown>) : {};
  const primaryCtaRaw = record.primaryCTA && typeof record.primaryCTA === "object" ? (record.primaryCTA as Record<string, unknown>) : {};

  const normalizedRecord: ProblemPageRecord = {
    title,
    slug,
    painStatement,
    dailyScenes: toStringArray(record.dailyScenes),
    whatTheyTried: toStringArray(record.whatTheyTried),
    whyItFailed,
    diagnosis,
    evidenceBlock: {
      claim: typeof evidenceBlockRaw.claim === "string" ? evidenceBlockRaw.claim.trim() : "",
      source: typeof evidenceBlockRaw.source === "string" ? evidenceBlockRaw.source.trim() : "",
      relatedEntity: typeof evidenceBlockRaw.relatedEntity === "string" ? evidenceBlockRaw.relatedEntity.trim() : "",
      confidence:
        evidenceBlockRaw.confidence === "medium" || evidenceBlockRaw.confidence === "low" ? evidenceBlockRaw.confidence : "high",
      approvalStatus:
        evidenceBlockRaw.approvalStatus === "approved" || evidenceBlockRaw.approvalStatus === "review"
          ? evidenceBlockRaw.approvalStatus
          : "source-backed",
    },
    primaryCTA: {
      label: typeof primaryCtaRaw.label === "string" ? primaryCtaRaw.label.trim() : "Book a fit call",
      href: typeof primaryCtaRaw.href === "string" ? primaryCtaRaw.href.trim() : "/book-a-fit-call",
      reason: typeof primaryCtaRaw.rationale === "string" ? primaryCtaRaw.rationale.trim() : "",
    },
    relatedFrameworks: normalizeProblemPageLink(record.relatedFrameworks),
    relatedClusters: normalizeProblemPageLink(record.relatedClusters),
    seoTitle,
    seoDescription,
    status: normalizeProblemPageStatus(status),
    humanApproval,
    humanApproved: false,
    canonicalUrl:
      typeof record.canonicalUrl === "string" ? record.canonicalUrl.trim() : record.canonicalUrl === null ? null : undefined,
    publishedAt: typeof record.publishedAt === "string" ? record.publishedAt : undefined,
    updatedAt: typeof record.updatedAt === "string" ? record.updatedAt : undefined,
    indexable: typeof record.indexable === "boolean" ? record.indexable : undefined,
    sitemapEligible: typeof record.sitemapEligible === "boolean" ? record.sitemapEligible : undefined,
    llmsTxtEligible: typeof record.llmsTxtEligible === "boolean" ? record.llmsTxtEligible : undefined,
    schemaEligible: typeof record.schemaEligible === "boolean" ? record.schemaEligible : undefined,
  };
  const humanApproved = validatePublicationApproval({
    approval: humanApproval,
    title,
    content: serializeProblemPageRevisionContent(normalizedRecord as unknown as Record<string, unknown>),
    canonicalUrl: normalizedRecord.canonicalUrl,
    canonicalOrigin,
    slug,
    publicationRevision: serializeProblemPagePublicationRevision(normalizedRecord as unknown as Record<string, unknown>),
  }).valid;

  return { ...normalizedRecord, humanApproved };
}
