import { problemPageCatalog } from "@/lib/problem-pages";

export function getProblemPageSeedAssets() {
  return problemPageCatalog.map((page) => ({
    title: page.title,
    slug: page.slug,
    painStatement: page.painStatement,
    dailyScenes: page.dailyScenes.map((value) => ({ value })),
    whatTheyTried: page.whatTheyTried.map((value) => ({ value })),
    whyItFailed: page.whyItFailed,
    diagnosis: page.diagnosis,
    evidenceBlock: page.evidenceBlock,
    primaryCTA: {
      label: page.primaryCTA.label,
      href: page.primaryCTA.href,
      rationale: page.primaryCTA.reason,
    },
    relatedFrameworks: page.relatedFrameworks,
    relatedClusters: page.relatedClusters,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    status: page.status,
  }));
}
