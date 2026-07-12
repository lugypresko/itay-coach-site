import type { PageBrief } from "../agents";

export type ContentMaturity = "scaffold" | "complete_draft" | "review_ready" | "human_approved";

export type PageBriefComplianceFailureCode =
  | "missing_required_section"
  | "missing_reader_facing_prose"
  | "meta_copy_detected"
  | "missing_cta_label"
  | "missing_cta_href"
  | "invalid_cta_link"
  | "missing_cta_context"
  | "missing_required_internal_link"
  | "invalid_internal_link"
  | "missing_evidence"
  | "invalid_evidence_mapping"
  | "primary_intent_unanswered"
  | "canonical_owner_invalid"
  | "forbidden_unsupported_claim"
  | "duplicate_or_colliding_intent";

export interface PageBriefComplianceFailure {
  code: PageBriefComplianceFailureCode;
  detail: string;
}

export interface PageBriefComplianceDraft {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  aiSummary?: string;
  citationSnippet: string;
  author: string;
  entityTags: string[];
  targetRecommendationQueries: string[];
  schemaType: string;
  evidenceUrls?: string[];
  claimEvidenceMappings?: ClaimEvidenceMapping[];
  maturity?: ContentMaturity;
}

export type ClaimEvidenceType =
  | "first_party_framework_source"
  | "approved_insight"
  | "external_evidence"
  | "experience_based_claim";

export interface ClaimEvidenceMapping {
  claim: string;
  evidenceType: ClaimEvidenceType;
  sourceReference: string;
  approvedInsightIds: string[];
  valid: boolean;
  limitation?: string;
}

export interface PageBriefComplianceContext {
  canonicalOwnerPath?: string;
  knownCollidingIntentKeys?: string[];
}

export interface PageBriefComplianceResult {
  passed: boolean;
  failureCodes: PageBriefComplianceFailureCode[];
  failures: PageBriefComplianceFailure[];
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function hasHeading(content: string, sectionTitle: string): boolean {
  const pattern = new RegExp(`^#{1,6}\\s+${escapeRegExp(sectionTitle)}\\s*$`, "im");
  return pattern.test(content);
}

function extractSection(content: string, sectionTitle: string): string {
  const lines = content.split(/\r?\n/);
  const startIndex = lines.findIndex((line) => new RegExp(`^#{1,6}\\s+${escapeRegExp(sectionTitle)}\\s*$`, "i").test(line.trim()));

  if (startIndex < 0) {
    return "";
  }

  const sectionLines: string[] = [];
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^#{1,6}\s+/.test(line.trim())) {
      break;
    }
    sectionLines.push(line);
  }

  return sectionLines.join("\n").trim();
}

function containsMetaCopy(content: string): boolean {
  return /\b(scaffold|placeholder|tbd|todo|this draft is intended|review-ready draft|built from pagebrief|no publication path was invoked|the page (?:starts|explains|shows|describes)|this page (?:starts|explains|shows|describes)|this section (?:covers|explains|shows|describes)|the content should)\b/i.test(content);
}

function containsUnsupportedClaim(content: string): boolean {
  return /\b(best|top|#1|number one|leading|guarantee|guaranteed|always|never)\b/i.test(content);
}

function isValidEvidenceReference(value: string): boolean {
  return /^https?:\/\//i.test(value) || /^(?:docs|src|TASK)_/i.test(value) || /^docs\//i.test(value) || /^src\//i.test(value);
}

interface MarkdownLink {
  label: string;
  href: string;
}

function extractInlineMarkdownLinks(content: string): MarkdownLink[] {
  const links: MarkdownLink[] = [];
  const inlineLinkPattern = /\[([^\]\r\n]+)\]\((\/[^\s)]+)\)/g;

  for (const match of content.matchAll(inlineLinkPattern)) {
    links.push({ label: match[1].trim(), href: match[2].trim() });
  }

  return links;
}

function hasReaderFacingCtaContext(ctaSection: string, ctaLink: MarkdownLink | undefined): boolean {
  if (!ctaLink) return false;
  const linkMarkdown = `[${ctaLink.label}](${ctaLink.href})`;
  const context = ctaSection.replace(linkMarkdown, " ").replace(/\s+/g, " ").trim();
  return context.split(/\s+/).filter(Boolean).length >= 8;
}

function hasValidEvidenceMapping(
  claim: string,
  mappings: ClaimEvidenceMapping[],
  approvedSourceInsightIds: string[],
): boolean {
  const normalizedClaim = normalize(claim);

  return mappings.some((mapping) => {
    const approvedInsightSupported =
      mapping.approvedInsightIds.length > 0 &&
      mapping.approvedInsightIds.some((id) => approvedSourceInsightIds.includes(id));

    return (
      normalize(mapping.claim) === normalizedClaim &&
      mapping.valid === true &&
      isValidEvidenceReference(mapping.sourceReference) &&
      normalize(mapping.sourceReference) !== normalizedClaim &&
      approvedInsightSupported
    );
  });
}

export function validatePageBriefCompliance(
  pageBrief: PageBrief,
  draft: PageBriefComplianceDraft,
  context: PageBriefComplianceContext = {},
): PageBriefComplianceResult {
  const failures: PageBriefComplianceFailure[] = [];
  const content = draft.content ?? "";
  const contentLower = content.toLowerCase();
  const requiredSections = pageBrief.contentPlan.map((item) => item.sectionTitle);
  const proofNeeded = [...new Set(pageBrief.proofNeeded.map((item) => item.trim()).filter(Boolean))];
  const targetQueries = [...new Set(pageBrief.searchIntent.priorityQueries.map((item) => item.trim()).filter(Boolean))];
  const internalLinks = [...new Set(pageBrief.topicClusterPosition.internalLinks.map((item) => item.trim()).filter(Boolean))];

  if (
    !pageBrief.canonicalPath.trim().startsWith("/clusters/") ||
    pageBrief.topicClusterPosition.cluster !== pageBrief.canonicalPath ||
    (context.canonicalOwnerPath !== undefined && context.canonicalOwnerPath !== pageBrief.canonicalPath)
  ) {
    failures.push({
      code: "canonical_owner_invalid",
      detail: `Expected a canonical cluster path, got ${pageBrief.canonicalPath}.`,
    });
  }

  for (const sectionTitle of requiredSections) {
    const sectionBody = extractSection(content, sectionTitle);
    if (!hasHeading(content, sectionTitle) || sectionBody.length < 40) {
      failures.push({
        code: "missing_required_section",
        detail: `Required section "${sectionTitle}" is missing or not substantive enough.`,
      });
    }
  }

  const sectionBodies = requiredSections.map((sectionTitle) => extractSection(content, sectionTitle));
  const substantiveSectionBodies = sectionBodies.filter((body) => body.split(/\s+/).filter(Boolean).length >= 18);

  if (substantiveSectionBodies.length < requiredSections.length) {
    failures.push({
      code: "missing_reader_facing_prose",
      detail: "Reader-facing prose is too thin to count as a complete draft.",
    });
  }

  if (containsMetaCopy(content)) {
    failures.push({
      code: "meta_copy_detected",
      detail: "Draft content still contains meta-copy or placeholder language.",
    });
  }

  const markdownLinks = extractInlineMarkdownLinks(content);
  const ctaSection = extractSection(content, "CTA");
  const ctaLink = markdownLinks.find(
    (link) => link.label === pageBrief.cta.label && link.href === pageBrief.cta.href,
  );

  if (!content.includes(pageBrief.cta.label)) {
    failures.push({
      code: "missing_cta_label",
      detail: `CTA label "${pageBrief.cta.label}" does not appear in the draft content.`,
    });
  }

  if (!content.includes(pageBrief.cta.href)) {
    failures.push({
      code: "missing_cta_href",
      detail: `CTA href "${pageBrief.cta.href}" does not appear in the draft content.`,
    });
  }

  if (!ctaLink) {
    failures.push({
      code: "invalid_cta_link",
      detail: `CTA must be one renderable Markdown link: [${pageBrief.cta.label}](${pageBrief.cta.href}).`,
    });
  }

  if (!hasReaderFacingCtaContext(ctaSection, ctaLink)) {
    failures.push({
      code: "missing_cta_context",
      detail: "CTA must include reader-facing context explaining who the next step is for.",
    });
  }

  const missingInternalLinks = internalLinks.filter(
    (href) => !markdownLinks.some((link) => link.href === href && link.label !== href),
  );
  if (missingInternalLinks.length) {
    failures.push({
      code: "missing_required_internal_link",
      detail: "At least one required internal link is missing from the draft content.",
    });
    failures.push({
      code: "invalid_internal_link",
      detail: `Required internal destinations must be renderable Markdown links with anchor text: ${missingInternalLinks.join(", ")}.`,
    });
  }

  const evidenceMappings = draft.claimEvidenceMappings ?? [];
  if (proofNeeded.some((claim) => !hasValidEvidenceMapping(claim, evidenceMappings, pageBrief.sourceInsightIds))) {
    failures.push({
      code: "missing_evidence",
      detail: "One or more material claims have no valid claim-level evidence mapping.",
    });
    failures.push({
      code: "invalid_evidence_mapping",
      detail: "Evidence headings, repeated claims, or generic source lists do not satisfy claim-level evidence requirements.",
    });
  }

  const shortAnswerSection = extractSection(content, "Short answer");
  const shortAnswerWords = shortAnswerSection.split(/\s+/).filter(Boolean).length;
  const directIntentSatisfied =
    shortAnswerWords >= 25 &&
    (targetQueries.some((query) => contentLower.includes(normalize(query))) ||
      contentLower.includes(normalize(pageBrief.pagePromise)) ||
      contentLower.includes(normalize(pageBrief.searchIntent.summary)));

  if (!directIntentSatisfied) {
    failures.push({
      code: "primary_intent_unanswered",
      detail: "The draft does not answer the primary intent directly enough in the short-answer section.",
    });
  }

  if (containsUnsupportedClaim(`${draft.title}\n${draft.excerpt}\n${content}\n${draft.citationSnippet}`)) {
    failures.push({
      code: "forbidden_unsupported_claim",
      detail: "The draft contains unsupported or promotional claim language.",
    });
  }

  const knownIntentKeys = new Set((context.knownCollidingIntentKeys ?? []).map(normalize));
  const duplicateIntentDetected = [pageBrief.searchIntent.summary, ...targetQueries].some((value) =>
    knownIntentKeys.has(normalize(value)),
  );

  if (duplicateIntentDetected) {
    failures.push({
      code: "duplicate_or_colliding_intent",
      detail: "The PageBrief repeats or collides on a section, query, or link intent.",
    });
  }

  const uniqueFailures = failures.filter(
    (failure, index, self) => self.findIndex((candidate) => candidate.code === failure.code && candidate.detail === failure.detail) === index,
  );

  return {
    passed: uniqueFailures.length === 0,
    failureCodes: uniqueFailures.map((failure) => failure.code),
    failures: uniqueFailures,
  };
}
