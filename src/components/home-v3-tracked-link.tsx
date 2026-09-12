"use client";

import Link, { type LinkProps } from "next/link";
import { useSearchParams } from "next/navigation";
import { track } from "@vercel/analytics";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { buildDiagnosticHref } from "@/lib/target-page-analytics";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> & {
  children: ReactNode;
  className?: string;
  href?: string;
};

export function HomeV3TrackedLink({ children, className, href = "/player-trap", ...rest }: Props) {
  const searchParams = useSearchParams();
  const destination = href === "/player-trap" ? buildDiagnosticHref(searchParams.toString()) : href;
  return <Link {...rest} className={className} href={destination} onClick={() => track("homepage_cta_click", { destination })}>{children}</Link>;
}
