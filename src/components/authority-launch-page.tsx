import { notFound } from "next/navigation";

import type { AuthorityLaunchPageConfig } from "@/lib/authority-launch-pages";

export function AuthorityLaunchPage({ page }: { page: AuthorityLaunchPageConfig }) {
  void page;
  // Legacy launch data remains available for audit, but is not a public artifact.
  notFound();
  return null;
}
