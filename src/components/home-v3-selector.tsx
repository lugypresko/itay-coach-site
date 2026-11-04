"use client";

import Link from "next/link";
import { useState } from "react";
import { track } from "@vercel/analytics";
import { buildHomepagePatternHref, homepagePatterns, type HomepagePattern } from "@/lib/homepage-patterns";

export function HomeV3Selector() {
  const [selected, setSelected] = useState<HomepagePattern | null>(null);
  const [search, setSearch] = useState("");

  function selectPattern(pattern: HomepagePattern) {
    setSelected(pattern);
    setSearch(window.location.search);
    window.dispatchEvent(new CustomEvent("homepage-pattern-change", { detail: { pattern } }));
    track("homepage_selector_choice", { pattern });
  }

  const destination = selected ? buildHomepagePatternHref(search, selected) : "/diagnostic";
  const selectedLabel = homepagePatterns.find(({ value }) => value === selected)?.label;

  return (
    <div className="pick">
      <div>
        <h2>What comes back to you most often?</h2>
        <p>Pick the closest one. It won&apos;t diagnose you. It gives the first read a better place to start, and your choice carries into the form.</p>
      </div>
      <div>
        <div className="ch" role="group" aria-label="Pattern">
          {homepagePatterns.map(({ value, label }) => (
            <button
              aria-pressed={selected === value}
              data-p={value}
              key={value}
              onClick={() => selectPattern(value)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
        <div className="go">
          <Link
            aria-disabled={!selected}
            className={`btn dark${selected ? "" : " off"}`}
            href={destination}
            id="go"
            onClick={() => selected && track("homepage_cta_click", { destination })}
          >
            {selectedLabel ? `Continue: ${selectedLabel}` : "Continue with this pattern"}
          </Link>
        </div>
      </div>
    </div>
  );
}
