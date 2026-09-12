"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { buildDiagnosticHref } from "@/lib/target-page-analytics";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> & {
  children: ReactNode;
  className?: string;
  href?: string;
};

export function HomeV3TrackedLink({ children, className, href = "/player-trap", ...rest }: Props) {
  const [search, setSearch] = useState("");
  const [pattern, setPattern] = useState<string | undefined>(undefined);

  useEffect(() => {
    const currentSearch = window.location.search;
    setSearch(currentSearch);
    setPattern(new URLSearchParams(currentSearch).get("pattern") || undefined);

    const handlePatternChange = (event: Event) => {
      const nextPattern = (event as CustomEvent<{ pattern?: string }>).detail?.pattern;
      setPattern(nextPattern || undefined);
    };
    window.addEventListener("homepage-pattern-change", handlePatternChange);
    return () => window.removeEventListener("homepage-pattern-change", handlePatternChange);
  }, []);

  const destination = href === "/player-trap" ? buildDiagnosticHref(search, pattern) : href;
  return <Link {...rest} className={className} href={destination} onClick={() => track("homepage_cta_click", { destination })}>{children}</Link>;
}
