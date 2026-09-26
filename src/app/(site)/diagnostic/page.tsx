import React from "react";
import type { Metadata } from "next";

import { DiagnosticFunnel } from "@/components/diagnostic/diagnostic-funnel";

const title = "Leadership Diagnostic";
const description =
  "Bring one real leadership situation. Examine the pattern and choose one small move to try.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/diagnostic" },
  // The funnel is still an implementation surface; publish it only after the
  // anonymous result and fit-context flow pass Preview acceptance.
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main id="main-content" className="content-shell">
      <header className="content-hero">
        <p className="eyebrow">Private working diagnostic</p>
        <h1 id="diagnostic-route-title">{title}</h1>
        <p className="lede">{description}</p>
      </header>
      <DiagnosticFunnel />
    </main>
  );
}
