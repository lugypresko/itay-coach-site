"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const [pattern, setPattern] = useState(() => searchParams.get("pattern") || undefined);

  useEffect(() => {
    const handlePatternChange = (event: Event) => {
      const nextPattern = (event as CustomEvent<{ pattern?: string }>).detail?.pattern;
      setPattern(nextPattern || undefined);
    };
    window.addEventListener("homepage-pattern-change", handlePatternChange);
    return () => window.removeEventListener("homepage-pattern-change", handlePatternChange);
  }, []);

  const destination = href === "/player-trap" ? buildDiagnosticHref(searchParams.toString(), pattern) : href;
  return <Link {...rest} className={className} href={destination} onClick={() => track("homepage_cta_click", { destination })}>{children}</Link>;
}
