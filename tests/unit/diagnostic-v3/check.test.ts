import { afterEach, beforeEach, expect, it, vi } from "vitest";
const { guard } = vi.hoisted(() => ({guard: vi.fn()}));
vi.mock("@/payload/access/diagnostic-admin", () => ({requireDiagnosticAdmin: guard}));
const request = () => new Request("https://qa.example.test/api/diagnostic/v3/check");
beforeEach(() => guard.mockResolvedValue(null));
import { GET } from "@/app/api/diagnostic/v3/check/route";
afterEach(() => vi.unstubAllEnvs());
it("synthetic provider check is never exposed in Production", async () => {
  vi.stubEnv("VERCEL_ENV", "production");
  vi.stubEnv("DIAGNOSTIC_V3_PRODUCTION_ENABLED", "true");
  expect((await GET(request())).status).toBe(404);
});
it("reports disabled provider accurately and exposes no case or identity", async () => {
  vi.stubEnv("VERCEL_ENV", "preview");
  vi.stubEnv("DIAGNOSTIC_V3_AI_ENABLED", "false");
  const r = await GET(request());
  const body = await r.json();
  expect(body.groq_verified).toBe(false);
  expect(body.partial.source).toBe("fallback");
  expect(body.partial.fallback_reason).toBe("ai_disabled");
  expect(body).not.toHaveProperty("answers");
  expect(body).not.toHaveProperty("identity");
  expect(body).not.toHaveProperty("api_key");
});

it("unauthorized callers receive no verification metadata or provider call", async () => {
  vi.stubEnv("VERCEL_ENV", "preview");
  guard.mockResolvedValue(new Response(JSON.stringify({error: "Forbidden"}), {status: 403}));
  const r = await GET(request());
  expect(r.status).toBe(403);
  expect(await r.json()).toEqual({error: "Forbidden"});
});
