import { afterEach, expect, it, vi } from "vitest";
import { GET } from "@/app/api/diagnostic/v3/check/route";
afterEach(() => vi.unstubAllEnvs());
it("synthetic provider check is never exposed in Production", async () => {
  vi.stubEnv("VERCEL_ENV", "production");
  vi.stubEnv("DIAGNOSTIC_V3_PRODUCTION_ENABLED", "true");
  expect((await GET()).status).toBe(404);
});
it("reports disabled provider accurately and exposes no case or identity", async () => {
  vi.stubEnv("VERCEL_ENV", "preview");
  vi.stubEnv("DIAGNOSTIC_V3_AI_ENABLED", "false");
  const r = await GET();
  const body = await r.json();
  expect(body.groq_verified).toBe(false);
  expect(body.partial.source).toBe("fallback");
  expect(body.partial.fallback_reason).toBe("ai_disabled");
  expect(body).not.toHaveProperty("answers");
  expect(body).not.toHaveProperty("identity");
  expect(body).not.toHaveProperty("api_key");
});
