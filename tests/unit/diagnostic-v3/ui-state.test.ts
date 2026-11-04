import { describe, expect, it } from "vitest";
import { shouldAutoAdvance, toggleMultiAnswer } from "@/lib/diagnostic-v3/ui-state";

describe("Diagnostic V3 question UI state", () => {
  it("caps multi-select at three and allows deselecting to make room", () => {
    const first = toggleMultiAnswer({}, "attempts", "owner");
    const second = toggleMultiAnswer(first, "attempts", "decide");
    const third = toggleMultiAnswer(second, "attempts", "process");

    expect(third.attempts).toEqual(["owner", "decide", "process"]);
    expect(toggleMultiAnswer(third, "attempts", "escalated")).toBe(third);
    const deselected = toggleMultiAnswer(third, "attempts", "decide");
    expect(toggleMultiAnswer(deselected, "attempts", "escalated").attempts)
      .toEqual(["owner", "process", "escalated"]);
  });

  it("keeps exclusive multi-select choices exclusive", () => {
    expect(toggleMultiAnswer({ attempts: ["owner"] }, "attempts", "nothing").attempts)
      .toEqual(["nothing"]);
    expect(toggleMultiAnswer({ impact: ["time"] }, "impact", "little").impact)
      .toEqual(["little"]);
  });

  it("auto-advances single-answer questions after selection", () => {
    expect(shouldAutoAdvance(0, { situation: "decision" })).toBe(true);
    expect(shouldAutoAdvance(7, { desired: "own" })).toBe(true);
  });

  it("waits for both parts of Q5 and leaves multi-select and free-text steps in place", () => {
    expect(shouldAutoAdvance(4, { duration: "long" })).toBe(false);
    expect(shouldAutoAdvance(4, { duration: "long", frequency: "weekly" })).toBe(true);
    expect(shouldAutoAdvance(5, { attempts: ["owner"] })).toBe(false);
    expect(shouldAutoAdvance(6, { impact: ["time"] })).toBe(false);
    expect(shouldAutoAdvance(8, { context: "A case" })).toBe(false);
  });
});
