import { buildAuthorityGapCollection } from "./authority-model";

export const AuthorityGaps = buildAuthorityGapCollection({
  slug: "authority_gaps",
  singular: "Authority Gap",
  plural: "Authority Gaps",
  description: "Lifecycle-tracked authority defects that block stronger recommendation visibility.",
});

