import type { ReactNode } from "react";
import Link from "next/link";

import "../globals.css";

type SiteLayoutProps = {
  children: ReactNode;
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
