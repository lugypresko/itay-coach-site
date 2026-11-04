import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import {
  bookingNotes,
  bookingOffer,
  withBookingPrefill,
} from "@/lib/diagnostic-v3/booking";
import { publicSession } from "@/lib/diagnostic-v3/service";
import type { Session } from "@/lib/diagnostic-v3/contracts";

afterEach(() => {
  vi.unstubAllEnvs();
});

function conversationSession(): Session {
  return {
    id: "d1a5d300-6c53-4a13-a707-30e6a7b4c6f1",
    diagnostic_version: "v3",
    record_version: 4,
    answer_revision: 9,
    answers: {},
    step: 8,
    stage: "full",
    identity: { first_name: "Ada Lovelace", email: "ada@example.test", company: "Analytical" },
    full: {
      session_id: "d1a5d300-6c53-4a13-a707-30e6a7b4c6f1",
      answer_revision: 9,
      analysis_version: "analysis-v2",
      source: "fallback",
      model: "deterministic-v1",
      data: {
        primary_pattern: "decision_rights_gap",
        likely_explanation: "A decision boundary is still open.",
        alternative_hypothesis: null,
        evidence: [],
        case_summary: "A case.",
        leadership_move: "Name the boundary.",
        manager_question: "What can you decide?",
        seven_day_experiment: {
          action: "Ask once.",
          trigger: "Next decision.",
          safety_boundary: "Keep material risk.",
          observation: "Who decides.",
          review_point: "In seven days.",
        },
        success_signal: "The next decision stays with the manager.",
        unresolved_question: "What risk still needs you?",
      },
    },
    scoring: {
      scoring_version: "scoring-v1",
      fit_status: "known",
      fit: 10,
      pain: 10,
      urgency: 10,
      readiness: 10,
      total: 40,
      route: "conversation",
      rule: "3_threshold",
    },
    events: [],
    created_at: new Date(0).toISOString(),
    expires_at: new Date(Date.now() + 86400000).toISOString(),
  };
}

describe("Diagnostic V3 booking card", () => {
  it("describes a 75-minute session and does not display a price", () => {
    vi.stubEnv("DIAGNOSTIC_V3_BOOKING_PRICE", "$225");
    const offer = bookingOffer();
    expect(offer).toMatchObject({
      durationMin: 75,
      meta: "75 min · online",
      cta: "Book the 75-min session",
      microcopy: "Your name and email carry over.",
    });
    expect(offer?.deliverables).toHaveLength(3);
    expect(JSON.stringify(offer)).not.toMatch(/\$|£|€|\bprice\b/i);
  });

  it("hides the priced card when duration config is explicitly cleared", () => {
    vi.stubEnv("DIAGNOSTIC_V3_BOOKING_DURATION_MIN", "");
    expect(bookingOffer()).toBeNull();
    vi.stubEnv("DIAGNOSTIC_V3_BOOKING_DURATION_MIN", "off");
    expect(bookingOffer()).toBeNull();
  });

  it("keeps existing query params and prefills name, email, and a human pattern note", () => {
    const href = withBookingPrefill(
      "https://cal.com/itayfoyer/leadership-diagnostic-75-minutes?utm_source=linkedin&utm_campaign=diag",
      { name: "Ada Lovelace", email: "ada@example.test", pattern: "decision_rights_gap" },
    );
    const url = new URL(href);
    expect(url.searchParams.get("utm_source")).toBe("linkedin");
    expect(url.searchParams.get("utm_campaign")).toBe("diag");
    expect(url.searchParams.get("name")).toBe("Ada Lovelace");
    expect(url.searchParams.get("email")).toBe("ada@example.test");
    expect(url.searchParams.get("notes")).toBe("Pattern to test: Decision-rights gap");
    expect(href).not.toContain("decision_rights_gap");
    expect(bookingNotes("not_a_pattern")).toBe("Pattern to test: from your diagnostic");
  });

  it("puts the prefilled link only on conversation routes when a booking URL exists", () => {
    vi.stubEnv(
      "DIAGNOSTIC_V3_BOOKING_URL",
      "https://cal.com/itayfoyer/leadership-diagnostic-75-minutes?utm_source=site",
    );
    const dto = publicSession(conversationSession());
    expect(dto.booking_offer?.meta).toBe("75 min · online");
    expect(dto.booking_offer?.cta).toBe("Book the 75-min session");
    const url = new URL(dto.booking_url ?? "");
    expect(url.searchParams.get("utm_source")).toBe("site");
    expect(url.searchParams.get("name")).toBe("Ada Lovelace");
    expect(url.searchParams.get("email")).toBe("ada@example.test");
    expect(url.searchParams.get("notes")).toBe("Pattern to test: Decision-rights gap");
    expect(JSON.stringify(dto.booking_offer)).not.toMatch(/\$/);
  });

  it("keeps dollar amounts and the 20-minute label out of the diagnostic V3 UI", () => {
    const ui = readFileSync("src/components/diagnostic/diagnostic-v3.tsx", "utf8");
    const page = readFileSync("src/app/(site)/diagnostic/page.tsx", "utf8");
    expect(ui).not.toMatch(/20-minute/);
    expect(page).not.toMatch(/20-minute/);
    expect(ui).not.toMatch(/\$\d/);
    expect(page).not.toMatch(/\$\d/);
    expect(ui).not.toContain("Paid session");
  });
});
