import { notFound } from "next/navigation";

import type { PageBrief } from "@/ai/agents";

export function PageBriefLaunchPage({ brief }: { brief: PageBrief }) {
  void brief;
  // A PageBrief is an internal production input, never a public rendering source.
  notFound();
  return null;
}
