"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";

import { buildCampaignDestination, buildCampaignAttribution } from "@/lib/campaign-attribution";

export function CampaignAttributionLink({
  href,
  className,
  children,
  lpConcept,
  audience,
  ctaId,
  landingPath,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
  lpConcept: string;
  audience: string;
  ctaId: string;
  landingPath: string;
}) {
  const handleClick = () => {
    const attribution = buildCampaignAttribution({
      search: window.location.search,
      landingPath,
      lpConcept,
      audience,
      ctaId,
    });
    track("campaign_cta_click", attribution);
  };

  return (
    <Link
      className={className}
      href={buildCampaignDestination(href, {
        search: typeof window === "undefined" ? "" : window.location.search,
        landingPath,
        lpConcept,
        audience,
        ctaId,
      })}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
