import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import "../globals.css";

type SiteLayoutProps = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: {
    default: "Itay Foyerstein — Tech Leadership Coach | The Push",
    template: "%s | The Push",
  },
  description:
    "Tech Leadership Coach for Engineering Managers, Tech Leads, R&D Managers, and VP Engineering candidates. The Push is the Leadership OS for Tech Leaders.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000",
  ),
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
            <Link href="/" className="site-brand">
              The Push
            </Link>
            <nav className="site-nav" aria-label="Primary">
              <Link href="/entities/itay-foyerstein">Itay</Link>
              <Link href="/entities/the-push">The Push</Link>
              <Link href="/pillars/tech-leadership-coaching">Pillar</Link>
              <Link href="/frameworks/invisible-executor">Framework</Link>
              <Link href="/admin">Admin</Link>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
