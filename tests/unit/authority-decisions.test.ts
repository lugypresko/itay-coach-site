import { describe, expect, it } from "vitest";

import {
  canTransitionContent,
  isInsightFresh,
  selectAuthorityCta,
  selectSchemaType,
} from "../../src/ai/governance/authority-decisions";

describe("deterministic authority decisions", () => {
  it.each([
    ["entity", "Person"],
    ["faq", "FAQPage"],
    ["framework", "HowTo"],
    ["pillar", "Article"],
  ] as const)("maps %s content to %s schema", (contentType, schemaType) => {
    expect(selectSchemaType(contentType)).toBe(schemaType);
  });

  it("routes coach-intent content to a fit call", () => {
    expect(selectAuthorityCta({ intentStage: "coach_intent", contentType: "pillar" }))
      .toBe("fit_call");
  });

  it("routes awareness content to the Player Trap diagnostic", () => {
    expect(selectAuthorityCta({ intentStage: "awareness", contentType: "problem" }))
      .toBe("player_trap_diagnostic");
  });

  it("evaluates insight freshness against an explicit clock", () => {
    expect(isInsightFresh("2026-07-13T00:00:00.000Z", new Date("2026-07-12T00:00:00.000Z")))
      .toBe(true);
    expect(isInsightFresh("2026-07-11T00:00:00.000Z", new Date("2026-07-12T00:00:00.000Z")))
      .toBe(false);
  });

  it("allows only a human to publish approved content", () => {
    expect(canTransitionContent("approved", "published", "human")).toBe(true);
    expect(canTransitionContent("approved", "published", "agent")).toBe(false);
  });

  it("rejects skipped review transitions", () => {
    expect(canTransitionContent("draft", "published", "human")).toBe(false);
    expect(canTransitionContent("draft", "in_review", "agent")).toBe(true);
  });
});
