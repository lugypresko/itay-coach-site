import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const { auth, getPayload } = vi.hoisted(() => ({ auth: vi.fn(), getPayload: vi.fn() }));
vi.mock("payload", () => ({getPayload}));
vi.mock("../../../payload.config", () => ({default: {}}));
import { payloadDatabaseUrl } from "@/lib/diagnostic-v3/database-config";
import { getStore } from "@/lib/diagnostic-v3/store";
import { requireDiagnosticAdmin, isPayloadAdministrator } from "@/payload/access/diagnostic-admin";
beforeEach(() => {
  vi.stubEnv("VERCEL_ENV", "preview");
  vi.stubEnv("DIAGNOSTIC_V3_DATABASE_URL", "postgres://fictional.invalid/qa");
  vi.stubEnv("PAYLOAD_SECRET", "fictional-test-secret");
  getPayload.mockResolvedValue({auth});
});
afterEach(() => {vi.unstubAllEnvs(); vi.clearAllMocks();});
const request = () => new Request("https://qa.example.test/api/diagnostic/v3/check", {headers: {cookie: "payload-token=fictional-test"}});
describe("Payload administrator authorization", () => {
  it("denies anonymous requests before any database or provider access", async () => {
    expect((await requireDiagnosticAdmin(new Request("https://qa.example.test")))?.status).toBe(401);
    expect(getPayload).not.toHaveBeenCalled();
  });
  it("fails closed if isolated Preview configuration is missing", async () => {
    vi.stubEnv("DIAGNOSTIC_V3_DATABASE_URL", "");
    vi.stubEnv("DATABASE_URL", "postgres://never-use.invalid/production");
    expect((await requireDiagnosticAdmin(request()))?.status).toBe(503);
    expect(getPayload).not.toHaveBeenCalled();
  });
  it("does not trust a forged cookie", async () => {
    auth.mockResolvedValue({user: null});
    expect((await requireDiagnosticAdmin(request()))?.status).toBe(401);
  });
  it.each(["editor", "human", "agent"])("denies authenticated %s", async (role) => {
    auth.mockResolvedValue({user: {id: 1, collection: "users", role}});
    const result = await requireDiagnosticAdmin(request());
    expect(result?.status).toBe(403);
    expect(await result?.json()).toEqual({error: "Forbidden"});
  });
  it("accepts only a Payload-verified users administrator", async () => {
    auth.mockResolvedValue({user: {id: 1, collection: "users", role: "admin"}});
    expect(await requireDiagnosticAdmin(request())).toBeNull();
    expect(auth.mock.calls[0][0].headers).toBeInstanceOf(Headers);
    expect(isPayloadAdministrator({id: 1, collection: "other", role: "admin"})).toBe(false);
  });
  it("returns no sensitive authentication error on failure", async () => {
    auth.mockRejectedValue(new Error("fictional-private-token"));
    const result = await requireDiagnosticAdmin(request());
    expect(result?.status).toBe(503);
    expect(JSON.stringify(await result?.json())).not.toContain("token");
  });
});

describe("database environment isolation", () => {
  it("never uses general DATABASE_URL in Preview and never uses Preview URL in Production", () => {
    vi.stubEnv("DATABASE_URL", "postgres://production.invalid/db");
    expect(payloadDatabaseUrl()).toBe("postgres://fictional.invalid/qa");
    vi.stubEnv("DIAGNOSTIC_V3_DATABASE_URL", "");
    expect(payloadDatabaseUrl()).toBe("");
    expect(() => getStore()).toThrow("isolated database");
    vi.stubEnv("VERCEL_ENV", "production");
    expect(payloadDatabaseUrl()).toBe("postgres://production.invalid/db");
  });
});
