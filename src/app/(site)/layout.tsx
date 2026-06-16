import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { getSiteUrl } from "@/lib/site-url";
import "../../styles/tokens.css";
import "../../styles/base.css";
import "../../styles/typography.css";
import "../../styles/layout.css";
import "../../styles/components.css";

type SiteLayoutProps = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: {
    default: "Itay Foyerstein - Tech Leadership Coach | The Push",
    template: "%s | The Push",
  },
  description:
    "Tech Leadership Coach for Engineering Managers, Tech Leads, R&D Managers, and VP Engineering candidates. The Push is the Leadership OS for Tech Leaders.",
  metadataBase: new URL(getSiteUrl()),
  robots: {
    index: true,
    follow: true,
  },
};

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <html lang="en">
      <body>
        <div className="site-frame">
          <header className="site-header">
            <Link href="/" className="site-brand" aria-label="The Push home">
              <span className="site-brand-mark" aria-hidden="true">
                TP
              </span>
              <span className="site-brand-name">The Push</span>
            </Link>
            <nav className="site-nav" aria-label="Primary">
              <Link href="/#ways">Ways to work</Link>
              <Link href="/#method">The method</Link>
              <Link href="/#fit">Who it is for</Link>
              <Link href="/entities/the-push">The Push</Link>
              <Link href="/book-a-fit-call" className="site-nav-cta">
                Book a fit call
              </Link>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
