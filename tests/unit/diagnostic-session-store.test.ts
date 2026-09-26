import { describe, expect, it, vi } from "vitest";
import { createAnonymousDiagnosticSession, findAnonymousDiagnosticSession, saveAnonymousDiagnosticSession } from "@/lib/diagnostic-session-store";

function fakePayload() {
  const records: Array<Record<string, unknown>> = [];
  return {
    records,
    find: vi.fn(async (args: Record<string, unknown>) => { const where = args.where as { sessionId?: { equals?: string } } | undefined; return { docs: records.filter((r) => r.sessionId === where?.sessionId?.equals) }; }),
    create: vi.fn(async (args: Record<string, unknown>) => { const data = args.data as Record<string, unknown>; const record = { id: "1", ...data }; records.push(record); return record; }),
    update: vi.fn(async (args: Record<string, unknown>) => Object.assign(records[0], args.data as Record<string, unknown>)),
  };
}

describe("diagnostic session store", () => {
  it("persists state without contact fields and resumes it", async () => {
    const payload = fakePayload();
    const session = await createAnonymousDiagnosticSession(payload, { language: "en" }, new Date("2026-09-13T12:00:00Z"));
    session.currentState = "PAIN_RAW";
    session.answers = { incident: "decisions return to me" };
    session.completedTurns = 1;
    await saveAnonymousDiagnosticSession(payload, session);
    const restored = await findAnonymousDiagnosticSession(payload, session.sessionId, new Date("2026-09-13T13:00:00Z"));
    expect(restored?.currentState).toBe("PAIN_RAW");
    expect(restored?.answers).toEqual(session.answers);
    expect(payload.records[0]).not.toHaveProperty("email");
    expect(payload.records[0]).not.toHaveProperty("name");
  });

  it("does not restore an expired session", async () => {
    const payload = fakePayload();
    const session = await createAnonymousDiagnosticSession(payload, { language: "en" }, new Date("2026-09-13T12:00:00Z"));
    expect(await findAnonymousDiagnosticSession(payload, session.sessionId, new Date("2026-09-14T12:00:00Z"))).toBeNull();
  });
});
