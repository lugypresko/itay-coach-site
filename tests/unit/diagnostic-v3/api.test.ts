import { describe, it, expect, vi, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/diagnostic/v3/route";
const origin = "https://qa.example.test";
const req = (body: unknown, cookie = "") =>
  new NextRequest(`${origin}/api/diagnostic/v3`, {
    method: "POST",
    headers: { origin, "content-type": "application/json", cookie },
    body: JSON.stringify(body),
  });
afterEach(() => vi.unstubAllEnvs());
describe("V3 API privacy and browser lifecycle", () => {
  it("records view before start and restores cookie-authorized state", async () => {
    const first = await GET(new NextRequest(`${origin}/api/diagnostic/v3`));
    const initial = await first.json();
    expect(initial.session.stage).toBe("entry");
    const cookie = first.headers.get("set-cookie")!.split(";")[0];
    expect(cookie).toContain("diagnostic_v3_session=");
    expect(first.headers.get("set-cookie")).toContain("HttpOnly");
    const started = await POST(req({ action: "start" }, cookie));
    const s = (await started.json()).session;
    expect(s.stage).toBe("answering");
    const restored = await GET(
      new NextRequest(`${origin}/api/diagnostic/v3`, { headers: { cookie } }),
    );
    expect((await restored.json()).session.record_version).toBe(
      s.record_version,
    );
    const stale = await POST(
      req(
        { action: "answers", expected_version: -1, answers: {}, step: 0 },
        cookie,
      ),
    );
    expect(stale.status).toBe(409);
    const removed = await POST(req({ action: "delete" }, cookie));
    expect((await removed.json()).session).toBeNull();
  });
  it("rejects cross-origin mutation and missing session authorization", async () => {
    const r = await POST(
      new NextRequest(`${origin}/api/diagnostic/v3`, {
        method: "POST",
        headers: { origin: "https://attacker.example" },
        body: '{"action":"start"}',
      }),
    );
    expect(r.status).toBe(403);
    expect(
      (
        await POST(
          req({ action: "identify", expected_version: 0, identity: {} }),
        )
      ).status,
    ).toBe(401);
  });
  it("keeps Production traffic disabled without explicit gate", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    expect(
      (await GET(new NextRequest(`${origin}/api/diagnostic/v3`))).status,
    ).toBe(404);
    expect((await POST(req({ action: "start" }))).status).toBe(404);
  });
  it("rejects oversized input", async () => {
    expect(
      (await POST(req({ action: "start", text: "x".repeat(17000) }))).status,
    ).toBe(413);
  });
});
