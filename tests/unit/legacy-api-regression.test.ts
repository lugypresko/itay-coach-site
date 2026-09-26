import { describe, expect, it, vi } from "vitest";

const { payload } = vi.hoisted(() => ({
  payload: { find: vi.fn(), update: vi.fn() },
}));

vi.mock("../../src/lib/payload", () => ({ getServerPayload: vi.fn(async () => payload) }));

import { POST as legacySessionPost } from "../../src/app/api/player-trap/session/route";

describe("legacy session API boundary", () => {
  it("rejects forged state writes without reading or mutating the session", async () => {
    const response = await legacySessionPost(new Request("https://example.com/api/player-trap/session", {
      method: "POST",
      headers: { cookie: "diagnostic_session=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" },
      body: JSON.stringify({ currentState: "DIAGNOSIS", answers: { PAIN_RAW: "forged" }, signals: { route: "TALK_NOW" }, completedTurns: 99 }),
    }));
    expect(response.status).toBe(410);
    expect(await response.json()).toEqual({ error: "This endpoint is retired. Use /api/player-trap/conversation." });
    expect(payload.find).not.toHaveBeenCalled();
    expect(payload.update).not.toHaveBeenCalled();
  });
});
