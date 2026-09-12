"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";

const choices = [
  ["decision", "A decision", "“Can you make the final call?”"],
  ["review", "A review", "“Can you take one last look?”"],
  ["escalation", "An escalation", "“We need you in this one.”"],
  ["meeting", "A meeting", "“You should probably be there.”"],
] as const;

export function HomeV3Selector() {
  const [selected, setSelected] = useState<string | null>(null);
  return <div>
    <div className="choices">
      {choices.map(([value, label, hint]) => <button className={`choice${selected === value ? " selected" : ""}`} data-angle={value} aria-pressed={selected === value} type="button" key={value} onClick={() => { setSelected(value); const params = new URLSearchParams(window.location.search); params.set("pattern", value); window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`); window.dispatchEvent(new CustomEvent("homepage-pattern-change", { detail: { pattern: value } })); track("homepage_selector_choice", { pattern: value }); }}>
        {label}<small>{hint}</small>
      </button>)}
    </div>
    <div className="commit-status" id="commitStatus">{selected ? "Got it. We’ll carry this into the diagnostic — you can change it there." : "Pick one. Your selection will carry into the diagnostic."}</div>
  </div>;
}
