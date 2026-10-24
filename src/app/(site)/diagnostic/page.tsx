import React from "react";
import type { Metadata } from "next";

import { DiagnosticV3 } from "@/components/diagnostic/diagnostic-v3";

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
  const v3 =
    process.env.VERCEL_ENV !== "production" ||
    process.env.DIAGNOSTIC_V3_PRODUCTION_ENABLED === "true";
  return (
    <main
      id="main-content"
      className={`content-shell${v3 ? " diagnostic-v3-shell" : ""}`}
    >
      <header className="content-hero">
        <p className="eyebrow">Private working diagnostic</p>
        <h1 id="diagnostic-route-title">
          {v3 ? "Bring one real situation." : title}
        </h1>
        <p className="lede">
          {v3
            ? "See what may be keeping it stuck — and one move worth testing next."
            : description}
        </p>
      </header>
      {v3 ? <DiagnosticV3 /> : <DiagnosticFunnel />}
    </main>
  );
}
