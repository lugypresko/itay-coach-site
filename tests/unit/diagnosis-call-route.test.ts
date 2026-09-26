import { describe, expect, it, vi } from "vitest";

const { payload } = vi.hoisted(() => ({
  payload: { find: vi.fn(), update: vi.fn() },
}));

vi.mock("../../src/lib/payload", () => ({
  getServerPayload: vi.fn(async () => payload),
}));

import { GET } from "../../src/app/api/player-trap/diagnosis-call/route";

const validToken = "550e8400-e29b-41d4-a716-446655440000";

describe("historical diagnosis-call GET", () => {
  it("returns 404 for a malformed token without querying Payload", async () => {
    payload.find.mockClear();
    const response = await GET(new Request("https://example.com/api/player-trap/diagnosis-call?reportToken=manager%40example.com"));
    expect(response.status).toBe(404);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(response.headers.get("referrer-policy")).toBe("no-referrer");
    expect(payload.find).not.toHaveBeenCalled();
  });

  it("returns 404 for an expired token", async () => {
    payload.find.mockResolvedValueOnce({ docs: [{ id: "1", createdAt: "2026-07-01T00:00:00.000Z" }] });
    const response = await GET(new Request(`https://example.com/api/player-trap/diagnosis-call?reportToken=${validToken}`));
    expect(response.status).toBe(404);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(payload.update).not.toHaveBeenCalled();
  });

  it("accepts a valid token, updates the lifecycle, and redirects without leaking it", async () => {
    payload.find.mockResolvedValueOnce({ docs: [{ id: "1", pageLanguage: "en", createdAt: new Date().toISOString() }] });
    payload.update.mockResolvedValueOnce({});
    const response = await GET(new Request(`https://example.com/api/player-trap/diagnosis-call?reportToken=${validToken}`));
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("https://example.com/contact?source=diagnostic&intent=request_to_talk&lang=en");
    expect(response.headers.get("location")).not.toContain(validToken);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(response.headers.get("referrer-policy")).toBe("no-referrer");
    expect(payload.update).toHaveBeenCalledOnce();
  });
});

