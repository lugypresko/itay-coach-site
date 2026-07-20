export type CampaignAudience = "sponsor" | "individual" | "diagnostic";

export interface CampaignPageCopy {
  audience: string;
  eyebrow: string;
  title: string;
  lede: string;
  primaryCta: string;
  secondaryCta?: string;
  destination: string;
  proof: string[];
  nextStep: string;
  variant: "memo" | "field-notes" | "diagnostic";
}
export interface CampaignPageContract {
  slug: string;
  pathname: string;
  audience: CampaignAudience;
  primaryCta: string;
  secondaryCta?: string;
  destination: string;
  discoverableInPrimaryNavigation: false;
  launchPhase: 1 | 2;
}

export const campaignPageContracts: readonly CampaignPageContract[] = [
  {
    slug: "operators-memo",
    pathname: "/campaigns/operators-memo",
    audience: "sponsor",
    primaryCta: "Discuss coaching for your managers",
    secondaryCta: "Learn how organizational sponsorship works",
    destination: "/for-organizations",
    discoverableInPrimaryNavigation: false,
    launchPhase: 1,
  },
  {
    slug: "field-notes",
    pathname: "/campaigns/field-notes",
    audience: "individual",
    primaryCta: "Book a fit call",
    secondaryCta: "Start with a conversation",
    destination: "/book-a-fit-call",
    discoverableInPrimaryNavigation: false,
    launchPhase: 1,
  },
  {
    slug: "player-trap",
    pathname: "/campaigns/player-trap",
    audience: "diagnostic",
    primaryCta: "Take the Player Trap Diagnostic",
    destination: "/player-trap",
    discoverableInPrimaryNavigation: false,
    launchPhase: 2,
  },
  {
    slug: "blueprint",
    pathname: "/campaigns/blueprint",
    audience: "sponsor",
    primaryCta: "Discuss leadership support",
    secondaryCta: "View the methodology",
    destination: "/for-organizations",
    discoverableInPrimaryNavigation: false,
    launchPhase: 2,
  },
  {
    slug: "leadership-os",
    pathname: "/campaigns/leadership-os",
    audience: "diagnostic",
    primaryCta: "Run the Leadership Dependency Assessment",
    secondaryCta: "View The Push methodology",
    destination: "/leadership-dependency-assessment",
    discoverableInPrimaryNavigation: false,
    launchPhase: 1,
  },
] as const;

export function getCampaignPageContract(slug: string): CampaignPageContract | undefined {
  return campaignPageContracts.find((page) => page.slug === slug);
}

export function getCampaignPathnames(): string[] {
  return campaignPageContracts.map((page) => page.pathname);
}
