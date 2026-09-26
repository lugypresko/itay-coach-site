import { describe, expect, it } from "vitest";

import type { DiagnosticSession } from "@/lib/diagnostic-funnel/types";
import type {
  DiagnosticSessionCreateInput,
  DiagnosticSessionRepository,
} from "@/lib/diagnostic-funnel/session-repository";
import { createPreviewSessionRepository } from "@/lib/diagnostic-funnel/preview-session-repository";

const now = new Date("2026-09-26T12:00:00.000Z");

const input: DiagnosticSessionCreateInput = {
  source: { entryPoint: "homepage", utmSource: "linkedin" },
  status: "started",
  answers: {},
};

function repository(): DiagnosticSessionRepository {
  return createPreviewSessionRepository();
}

describe("diagnostic session repository contract", () => {
  it("creates and reads a session with server-owned identity and timestamps", async () => {
    const repo = repository();
    const created = await repo.create(input, now);

    expect(created.id).toEqual(expect.any(String));
    expect(created.timestamps).toEqual({
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });
    expect(await repo.read(created.id, now)).toEqual(created);
    expect(created).not.toBe(await repo.read(created.id, now));
  });

  it("updates through the lifecycle and preserves the stored value from caller mutation", async () => {
    const repo = repository();
    const created = await repo.create(input, now);
    const updated = await repo.update(created.id, {
      status: "in_progress",
      answers: { context: "A launch decision kept returning to me." },
    }, new Date("2026-09-26T12:01:00.000Z"));

    expect(updated.status).toBe("in_progress");
    expect(updated.timestamps.updatedAt).toBe("2026-09-26T12:01:00.000Z");
    expect((await repo.read(created.id, now))?.answers.context).toContain("launch");

    (updated.answers as DiagnosticSession["answers"]).context = "mutated outside repository";
    expect((await repo.read(created.id, now))?.answers.context).toContain("launch");
  });

  it("rejects invalid lifecycle transitions and missing sessions", async () => {
    const repo = repository();
    const created = await repo.create(input, now);

    await expect(repo.update(created.id, { status: "completed" }, now)).rejects.toThrow("Invalid diagnostic lifecycle transition");
    await expect(repo.read("missing", now)).resolves.toBeNull();
    await expect(repo.update("missing", { status: "in_progress" }, now)).rejects.toThrow("Diagnostic session not found");
  });

  it("only permits deletion after lifecycle expiry", async () => {
    const repo = repository();
    const created = await repo.create(input, now);
    expect(await repo.isDeletionEligible(created.id, new Date("2026-10-26T11:59:59.999Z"))).toBe(false);
    expect(await repo.delete(created.id, new Date("2026-10-26T11:59:59.999Z"))).toBe(false);
    expect(await repo.isDeletionEligible(created.id, new Date("2026-10-26T12:00:00.000Z"))).toBe(true);
    expect(await repo.delete(created.id, new Date("2026-10-26T12:00:00.000Z"))).toBe(true);
    expect(await repo.read(created.id, now)).toBeNull();
  });
});
