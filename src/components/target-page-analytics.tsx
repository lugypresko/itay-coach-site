"use client";

import React from "react";
import { useEffect } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";

import {
  buildTargetAnalyticsProperties,
  targetAnalyticsEventNames,
  type TargetCtaType,
} from "@/lib/target-page-analytics";

export interface TargetPageAnalyticsProps {
  path: string;
  slug: string;
}

export interface TargetTrackedLinkProps extends TargetPageAnalyticsProps {
  href: string;
  ctaType: TargetCtaType;
  className: string;
  children: React.ReactNode;
}

export function TargetPageAnalytics({ path, slug }: TargetPageAnalyticsProps) {
  useEffect(() => {
    track(
      targetAnalyticsEventNames.pageView,
      buildTargetAnalyticsProperties({
        path,
        slug,
        search: window.location.search,
      }),
    );
  }, [path, slug]);

  return null;
}

export function TargetTrackedLink({ href, ctaType, path, slug, className, children }: TargetTrackedLinkProps) {
  const handleClick = () => {
    const properties = buildTargetAnalyticsProperties({
      path,
      slug,
      ctaType,
      search: window.location.search,
    });

    track(targetAnalyticsEventNames.ctaClick, properties);
    track(ctaType === "diagnostic" ? targetAnalyticsEventNames.diagnosticClick : targetAnalyticsEventNames.fitCallClick, properties);
  };

  return (
    <Link className={className} href={href} onClick={handleClick}>
      {children}
    </Link>
  );
}
