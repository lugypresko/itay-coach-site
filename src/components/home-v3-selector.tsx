"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { track } from "@vercel/analytics";

import { buildDiagnosticHref } from "@/lib/target-page-analytics";

const patterns = ["decision", "review", "escalation", "meeting"] as const;

export function HomeV3Selector() {
  const [selected, setSelected] = useState<string | null>(null);
  const searchParams = useSearchParams();

  return (
    <section className="v3-section v3-selector" id="diagnostic" aria-labelledby="selector-title">
      <div className="v3-two">
        <div>
          <p className="v3-eyebrow">Small commitment</p>
          <h2 id="selector-title">What comes back to you most often?</h2>
        </div>
        <div>
          <p>Choose the pattern that is closest. The diagnostic will use it as a starting point, not a score.</p>
          <div className="v3-selector-options" role="group" aria-label="Choose a recurring pattern">
            {patterns.map((pattern) => {
              const label = pattern[0].toUpperCase() + pattern.slice(1);
              return (
                <button
                  type="button"
                  key={pattern}
                  className={selected === pattern ? "is-selected" : ""}
                  aria-pressed={selected === pattern}
                  onClick={() => {
                    setSelected(pattern);
                    track("homepage_selector_choice", { pattern });
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
          {selected ? (
            <Link className="v3-primary v3-selector-cta" href={buildDiagnosticHref(searchParams.toString(), selected)}>
              Bring this case to the diagnostic →
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
