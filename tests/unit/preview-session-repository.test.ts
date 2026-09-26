import { describe, expect, it, vi } from "vitest";

import { createPreviewSessionRepository } from "@/lib/diagnostic-funnel/preview-session-repository";

const now = new Date("2026-09-26T12:00:00.000Z");

describe("preview diagnostic session repository", () => {
  it("supports isolated in-memory CRUD without external providers", async () => {
    const repo = createPreviewSessionRepository();
    const created = await repo.create({ source: {}, status: "started", answers: {} }, now);

    expect(await repo.read(created.id, now)).toEqual(created);
    expect(await repo.update(created.id, { status: "in_progress" }, now)).toMatchObject({ status: "in_progress" });
    expect(await repo.delete(created.id, new Date("2026-10-26T12:00:00.000Z"))).toBe(true);
    expect(await repo.read(created.id, now)).toBeNull();
  });

  it("logs structured metadata only and never session payload", async () => {
    const logger = vi.fn();
    const repo = createPreviewSessionRepository({ logger });
    const created = await repo.create({
      source: { entryPoint: "homepage" },
      status: "started",
      answers: { context: "private answer" },
    }, now);

    expect(logger).toHaveBeenCalledWith("diagnostic_session_created", {
      sessionId: created.id,
      status: "started",
    });
    expect(JSON.stringify(logger.mock.calls)).not.toContain("private answer");
  });

  it("does not share state between repository instances", async () => {
    const first = createPreviewSessionRepository();
    const second = createPreviewSessionRepository();
    const created = await first.create({ source: {}, status: "started", answers: {} }, now);

    expect(await second.read(created.id, now)).toBeNull();
  });
});
