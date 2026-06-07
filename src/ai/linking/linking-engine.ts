import type { ContentNode, InternalLinkSuggestion } from "./types";

function normalizedKey(value: string): string {
  return value.trim().toLowerCase();
}

function uniqueSuggestions(items: InternalLinkSuggestion[]): InternalLinkSuggestion[] {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = `${normalizedKey(item.targetSlug)}::${normalizedKey(item.anchorText)}`;
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function makeAnchorText(source: ContentNode, target: ContentNode): string {
  if (target.kind === "entity") {
    return target.title;
  }

  if (target.kind === "pillar") {
    return target.title;
  }

  if (target.kind === "framework") {
    return target.title;
  }

  if (target.kind === "case-study") {
    return `${target.title} case study`;
  }

  if (target.kind === "faq") {
    return target.title;
  }

  if (target.kind === "glossary") {
    return target.title;
  }

  if (source.kind === "pillar" && target.kind === "cluster") {
    return target.title;
  }

  return target.title;
}

function relationReason(source: ContentNode, target: ContentNode): string {
  if (source.kind === "pillar" && target.kind === "cluster") {
    return "Supporting cluster page deepens the pillar's topical authority.";
  }

  if (source.kind === "cluster" && target.kind === "pillar") {
    return "Cluster page should point back to its pillar to reinforce the topic hub.";
  }

  if (source.kind === "framework" && target.kind === "entity") {
    return "Framework page should reinforce the expert entity behind the methodology.";
  }

  if (source.kind === "entity" && target.kind === "framework") {
    return "Entity page should connect to the proprietary methodology it owns.";
  }

  if (target.kind === "faq") {
    return "FAQ supports recommendation intent with concise answers.";
  }

  if (target.kind === "case-study") {
    return "Case study adds proof and evidence for the target query.";
  }

  if (target.kind === "glossary") {
    return "Glossary page clarifies a shared term used across the authority graph.";
  }

  return "Related authority page supports internal graph coverage.";
}

function shouldLink(source: ContentNode, target: ContentNode): boolean {
  if (source.slug === target.slug) {
    return false;
  }

  if (source.kind === "pillar") {
    return ["cluster", "framework", "entity", "faq", "case-study", "glossary"].includes(target.kind);
  }

  if (source.kind === "cluster") {
    return ["pillar", "framework", "entity", "faq", "case-study"].includes(target.kind);
  }

  if (source.kind === "framework") {
    return ["entity", "pillar", "faq", "glossary", "case-study"].includes(target.kind);
  }

  if (source.kind === "entity") {
    return ["framework", "pillar", "faq", "case-study", "glossary", "cluster"].includes(target.kind);
  }

  return ["pillar", "entity", "framework", "faq", "case-study"].includes(target.kind);
}

export function suggestInternalLinks(source: ContentNode, candidates: ContentNode[]): InternalLinkSuggestion[] {
  const suggestions = candidates
    .filter((candidate) => shouldLink(source, candidate))
    .map((target) => ({
      sourceSlug: source.slug,
      targetSlug: target.slug,
      anchorText: makeAnchorText(source, target),
      reason: relationReason(source, target),
      sourceEntityTags: source.entityTags,
      targetEntityTags: target.entityTags,
      reviewStatus: "draft" as const,
    }))
    .filter((candidate) => candidate.anchorText.trim().length > 0)
    .filter((candidate) => candidate.anchorText.length <= 80);

  return uniqueSuggestions(suggestions).slice(0, 8);
}

