type GovernedAuthorityArtifact = { approval: { status: string }; publication: { state: string }; verification: { status: string } };
import { AuthorityLaunchPageConfig } from "@/lib/authority-launch-pages";

export function derivePublicationDecision(artifact: GovernedAuthorityArtifact, page: AuthorityLaunchPageConfig) {
  const isApproved = artifact.approval.status === "approved";
  const isPublished = artifact.publication.state === "published";
  const isVerified = artifact.verification.status === "passed";

  const isPublic = isApproved && isPublished && isVerified;

  return {
    render: isPublic,
    indexable: isPublic,
    sitemap: isPublic,
    llms: isPublic,
    structuredData: isPublic,
    analytics: isPublic,
    canonicalPath: page.canonicalPath,
    eligibility: isPublic ? "public" : "preview"
  };
}
