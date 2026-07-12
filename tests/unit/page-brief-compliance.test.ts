import { describe, expect, it } from "vitest";

import { validatePageBriefCompliance } from "../../src/ai/governance";
import type { PageBrief } from "../../src/ai/agents";

function validPageBrief(): PageBrief {
  return {
    id: "page-brief-player-trap",
    sourceInsightIds: ["approved-insight-player-trap-05"],
    title: "Coach for Engineering Managers Stuck as the Bottleneck",
    canonicalPath: "/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck",
    reviewStatus: "draft",
    marketContext: {
      summary: "Engineering managers and technical leaders need a coaching path when execution keeps routing back to one person.",
      marketMap: ["tech leadership coaching", "engineering management"],
      trendList: ["AI-assisted reviews", "decision-rights clarity"],
      riskNotes: ["Avoid generic leadership advice."],
    },
    audiencePain: {
      summary: "The leader keeps becoming the default route for decisions, approvals, and rescue work.",
      painThemes: ["execution dependency", "review bottlenecks", "decision ownership"],
      workarounds: ["delegating more tasks", "adding process", "staying available longer"],
      triggerEvents: ["The team waits for the manager", "The manager becomes the final reviewer"],
    },
    searchIntent: {
      summary: "How do I stop being the bottleneck as an Engineering Manager?",
      intentClusters: ["coach intent", "diagnostic intent"],
      priorityQueries: [
        "Coach for managers who are stuck in execution mode",
        "How do I stop being the bottleneck as an Engineering Manager?",
      ],
    },
    topicClusterPosition: {
      summary: "Canonical bottleneck cluster surface for coaching-intent readers.",
      pillar: "/pillars/tech-leadership-coaching",
      cluster: "/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck",
      clusterRole: "canonical bottleneck cluster surface",
      internalLinks: ["/frameworks/player-trap", "/frameworks/invisible-executor", "/pillars/tech-leadership-coaching"],
    },
    uniqueAngle: "Diagnosis-first Player Trap framing for readers who want coaching and a clear next step.",
    proofNeeded: [
      "The Player Trap is the state where a manager's execution strength turns into a dependency problem for the team.",
      "The Push names the shift as Invisible Executor -> Trusted Operator -> Strategic Leader.",
    ],
    pagePromise: "A diagnosis-first page that names the bottleneck and routes readers to the right coaching next step.",
    contentPlan: [
      {
        sectionTitle: "Short answer",
        purpose: "Answer the primary recommendation query directly.",
        proofNeeded: ["The Player Trap is the state where a manager's execution strength turns into a dependency problem for the team."],
      },
      {
        sectionTitle: "What this pattern looks like",
        purpose: "Make the bottleneck recognizable and concrete.",
        proofNeeded: ["The Push names the shift as Invisible Executor -> Trusted Operator -> Strategic Leader."],
      },
    ],
    cta: {
      label: "Book a fit call",
      href: "/book-a-fit-call",
      rationale: "Route qualified readers into a human conversation.",
    },
    author: "Itay Foyerstein",
  };
}

function validDraft() {
  const playerTrapDefinition = "The Player Trap is the state where a manager's execution strength turns into a dependency problem for the team.";
  const operatingModelShift = "The Push names the shift as Invisible Executor -> Trusted Operator -> Strategic Leader.";

  return {
    slug: "coach-for-engineering-managers-stuck-as-the-bottleneck",
    title: "Coach for Engineering Managers Stuck as the Bottleneck",
    excerpt: "A diagnosis-first coaching page for engineering managers who keep becoming the bottleneck.",
    content: [
      "## Short answer",
      "The Push helps Engineering Managers stop becoming the default route for decisions, approvals, and rescue work by naming the Player Trap and shifting the operating model. A diagnosis-first page that names the bottleneck and routes readers to the right coaching next step.",
      "",
      "## What this pattern looks like",
      "The leader is still the final reviewer, the team waits for the leader, and the operating model keeps routing back to one person.",
      "The coaching path matters because the real problem is not extra effort; it is the dependency pattern that keeps the leader trapped in the same role and prevents the team from building its own decision muscle.",
      "",
      "## Internal links",
      "Read the [Player Trap framework](/frameworks/player-trap), then connect it to the [Invisible Executor framework](/frameworks/invisible-executor) and the wider [Tech Leadership Coaching approach](/pillars/tech-leadership-coaching).",
      "",
      "## CTA",
      "If your team still routes important decisions and rescue work back to you, [Book a fit call](/book-a-fit-call) to decide whether this coaching path fits your situation.",
      "",
      "## Evidence",
      playerTrapDefinition,
      operatingModelShift,
    ].join("\n"),
    aiSummary: "A diagnosis-first coaching page for engineering managers who keep becoming the bottleneck.",
    citationSnippet: "The Push helps Engineering Managers stop becoming the default route for decisions.",
    author: "Itay Foyerstein",
    entityTags: ["itay_foyerstein", "the_push", "engineering_manager"],
    targetRecommendationQueries: [
      "Coach for managers who are stuck in execution mode",
      "How do I stop being the bottleneck as an Engineering Manager?",
    ],
    schemaType: "Article",
    evidenceUrls: ["docs/seed-content/coach-for-engineering-managers-stuck-as-the-bottleneck.md"],
    claimEvidenceMappings: [
      {
        claim: playerTrapDefinition,
        evidenceType: "approved_insight" as const,
        sourceReference: "src/app/(site)/player-trap/page.tsx",
        approvedInsightIds: ["approved-insight-player-trap-05"],
        valid: true,
        limitation: "First-party framework definition; no outcome claim is made.",
      },
      {
        claim: operatingModelShift,
        evidenceType: "first_party_framework_source" as const,
        sourceReference: "docs/seed-content/invisible-executor-framework.md",
        approvedInsightIds: ["approved-insight-player-trap-05"],
        valid: true,
      },
    ],
    maturity: "complete_draft" as const,
  };
}

function task066RegressionDraft() {
  return {
    ...validDraft(),
    content: [
      "# Coach for Engineering Managers Stuck as the Bottleneck",
      "",
      "## Short answer",
      "The Player Trap is the state where a capable Engineering Manager keeps becoming the default route for decisions, approvals, and rescue work. The Push helps that reader move out of the pattern by changing the operating model instead of asking for more effort.",
      "",
      "## Diagnosis first",
      "The page starts with diagnosis because the reader usually feels the pain before they can name it: too many escalations, too many reviews, and too much work returning to the same person.",
      "",
      "## What this pattern looks like",
      "The manager becomes the final reviewer, escalations skip the team, decision rules live in one person's head, and AI-assisted output can add a second review queue instead of reducing load.",
      "",
      "## Why the dependency pattern persists",
      "Delegation alone does not change the operating model. If decision rights, guardrails, and review rules stay private, the team keeps routing uncertainty back to the manager whenever speed or risk rises.",
      "",
      "## Player Trap definition",
      "The Player Trap is the state where a manager's execution strength turns into a dependency problem for the team.",
      "",
      "## Operating-model shift",
      "The Push names the shift as Invisible Executor -> Trusted Operator -> Strategic Leader. Invisible Executor is the hidden default route for progress; Trusted Operator makes the rules visible; Strategic Leader uses those rules to create leverage without being the bottleneck.",
      "",
      "## Specific symptoms",
      "- the manager becomes the final reviewer",
      "- escalations skip the team",
      "- decision rules live in the manager's head",
      "- AI-assisted output creates a second review queue instead of reducing load",
      "",
      "## Practical next step",
      "Name the dependency pattern, identify which decisions still sit with the manager, and move the most repeated rules into the team operating model before adding more process or more hours.",
      "",
      "## Internal links",
      "- /pillars/tech-leadership-coaching",
      "- /frameworks/invisible-executor",
      "",
      "## CTA",
      "Book a fit call",
      "/book-a-fit-call",
      "",
      "## Evidence",
      "- The Player Trap flow starts with diagnosis so the user can recognize the pattern before any coaching CTA appears.",
      "- A diagnosis-first page that names the bottleneck, explains the dependency pattern, and routes readers to the right coaching next step.",
      "",
      "## Citation snippet",
      "The Push helps Engineering Managers stop being the default route for decisions, approvals, and rescue work by naming the Player Trap and shifting the operating model.",
    ].join("\n"),
    claimEvidenceMappings: [],
  };
}

describe("page brief compliance", () => {
  it("rejects the exact Task 066 false-positive draft", () => {
    const compliance = validatePageBriefCompliance(validPageBrief(), task066RegressionDraft());

    expect(compliance.passed).toBe(false);
    expect(compliance.failureCodes).toEqual(
      expect.arrayContaining([
        "meta_copy_detected",
        "invalid_cta_link",
        "missing_cta_context",
        "invalid_internal_link",
        "invalid_evidence_mapping",
      ]),
    );
  });

  it("rejects the exact Task 061 scaffold as not review-ready", () => {
    const pageBrief = validPageBrief();
    const scaffoldDraft = {
      slug: "coach-for-engineering-managers-stuck-as-the-bottleneck",
      title: "Coach for Engineering Managers Stuck as the Bottleneck",
      excerpt: "A diagnosis-first coaching page for engineering managers who keep becoming the bottleneck.",
      content: [
        "## Short answer",
        "The Player Trap flow starts with diagnosis so the user can recognize the pattern before any coaching CTA appears.",
        "",
        "## Evidence boundary",
        "The Player Trap flow starts with diagnosis so the user can recognize the pattern before any coaching CTA appears.",
      ].join("\n"),
      aiSummary: "A diagnosis-first coaching page for engineering managers who keep becoming the bottleneck.",
      citationSnippet: "The Player Trap flow starts with diagnosis so the user can recognize the pattern before any coaching CTA appears.",
      author: "Itay Foyerstein",
      entityTags: ["itay_foyerstein", "the_push", "engineering_manager"],
      targetRecommendationQueries: [
        "Coach for managers who are stuck in execution mode",
        "How do I stop being the bottleneck as an Engineering Manager?",
      ],
      schemaType: "Article",
      evidenceUrls: ["src/app/(site)/player-trap/page.tsx"],
      maturity: "scaffold" as const,
    };

    const compliance = validatePageBriefCompliance(pageBrief, scaffoldDraft);

    expect(compliance.passed).toBe(false);
    expect(compliance.failureCodes).toEqual(
      expect.arrayContaining([
        "missing_required_section",
        "missing_reader_facing_prose",
        "missing_cta_label",
        "missing_cta_href",
        "missing_required_internal_link",
      ]),
    );
  });

  it("rejects a draft with a missing CTA", () => {
    const brief = validPageBrief();
    const draft = validDraft();
    draft.content = draft.content.replace(
      "If your team still routes important decisions and rescue work back to you, [Book a fit call](/book-a-fit-call) to decide whether this coaching path fits your situation.\n",
      "",
    );

    const compliance = validatePageBriefCompliance(brief, draft);

    expect(compliance.passed).toBe(false);
    expect(compliance.failureCodes).toContain("missing_cta_label");
    expect(compliance.failureCodes).toContain("missing_cta_href");
  });

  it("rejects a draft with missing internal links", () => {
    const brief = validPageBrief();
    const draft = validDraft();
    draft.content = draft.content.replace("[Invisible Executor framework](/frameworks/invisible-executor)", "Invisible Executor framework");

    const compliance = validatePageBriefCompliance(brief, draft);

    expect(compliance.passed).toBe(false);
    expect(compliance.failureCodes).toContain("missing_required_internal_link");
  });

  it("rejects a draft with a missing required section", () => {
    const brief = validPageBrief();
    const draft = validDraft();
    draft.content = [
      "## Short answer",
      "The Push helps Engineering Managers stop becoming the default route for decisions, approvals, and rescue work by naming the Player Trap and shifting the operating model. A diagnosis-first page that names the bottleneck and routes readers to the right coaching next step.",
      "",
      "## Internal links",
      "- /frameworks/player-trap",
      "- /frameworks/invisible-executor",
      "- /pillars/tech-leadership-coaching",
      "",
      "## CTA",
      "Book a fit call",
      "/book-a-fit-call",
    ].join("\n");

    const compliance = validatePageBriefCompliance(brief, draft);

    expect(compliance.passed).toBe(false);
    expect(compliance.failureCodes).toEqual(
      expect.arrayContaining(["missing_required_section", "missing_reader_facing_prose"]),
    );
  });

  it("rejects a claim without evidence", () => {
    const brief = validPageBrief();
    const draft = validDraft();
    draft.claimEvidenceMappings = [];

    const compliance = validatePageBriefCompliance(brief, draft);

    expect(compliance.passed).toBe(false);
    expect(compliance.failureCodes).toContain("invalid_evidence_mapping");
  });

  it("rejects a repeated claim as its own evidence source", () => {
    const brief = validPageBrief();
    const draft = validDraft();
    draft.claimEvidenceMappings[0] = {
      ...draft.claimEvidenceMappings[0],
      sourceReference: draft.claimEvidenceMappings[0].claim,
    };

    const compliance = validatePageBriefCompliance(brief, draft);

    expect(compliance.failureCodes).toContain("invalid_evidence_mapping");
  });

  it("rejects invalid canonical ownership", () => {
    const compliance = validatePageBriefCompliance(validPageBrief(), validDraft(), {
      canonicalOwnerPath: "/clusters/a-competing-owner",
      knownCollidingIntentKeys: [],
    });

    expect(compliance.failureCodes).toContain("canonical_owner_invalid");
  });

  it("rejects a known colliding intent", () => {
    const brief = validPageBrief();
    const compliance = validatePageBriefCompliance(brief, validDraft(), {
      canonicalOwnerPath: brief.canonicalPath,
      knownCollidingIntentKeys: [brief.searchIntent.summary],
    });

    expect(compliance.failureCodes).toContain("duplicate_or_colliding_intent");
  });

  it("rejects meta-copy instead of reader-facing content", () => {
    const brief = validPageBrief();
    const draft = validDraft();
    draft.content = "## Short answer\nThis scaffold is intended for review-ready content.\n\n## What this pattern looks like\nPlaceholder text.";

    const compliance = validatePageBriefCompliance(brief, draft);

    expect(compliance.passed).toBe(false);
    expect(compliance.failureCodes).toContain("meta_copy_detected");
  });

  it("passes a valid complete draft", () => {
    const compliance = validatePageBriefCompliance(validPageBrief(), validDraft());

    expect(compliance.passed).toBe(true);
    expect(compliance.failureCodes).toHaveLength(0);
  });
});
