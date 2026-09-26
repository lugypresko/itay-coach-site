import { afterEach, describe, expect, it, vi } from "vitest";
import { rm } from "node:fs/promises";
import path from "node:path";

const getServerPayload = vi.fn(async () => {
  throw new Error("Payload must not be opened during a production build");
});

vi.mock("../../src/lib/payload", () => ({ getServerPayload }));

import { createCase, payloadIntent, readCase, saveCase, saveLead } from "../../src/lib/push-store";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetAllMocks();
});

  describe("build and local persistence boundaries", () => {
    it("maps UI intent values to the Payload enum contract", () => {
      expect(payloadIntent("talk_now")).toBe("TALK_NOW");
      expect(payloadIntent("later")).toBe("LATER");
      expect(payloadIntent("self_serve")).toBe("SELF_SERVE");
      expect(payloadIntent(null)).toBeNull();
    });

  it("does not open Payload during the production build phase", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PHASE", "phase-production-build");

    const { loadPublicationSurfaceProjection } = await import("../../src/lib/publication-surface-projection");
    const projection = await loadPublicationSurfaceProjection("https://itayfoyerstein.com");

    expect(getServerPayload).not.toHaveBeenCalled();
    expect(projection.byPathname.has("/")).toBe(true);
  });

  it("persists and restores a local conversation and its contact lead", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("DIAGNOSTIC_LOCAL_STORE", "1");

    const { token, record } = await createCase();
    const file = path.join(process.cwd(), ".local-diagnostic", `${record.key}.json`);
    try {
      record.journey.answers.incident = "A release decision returned to me.";
      record.journey.step = "reflection";
      await saveCase(record);
      await saveLead(record, { name: "Local QA", email: "qa@example.invalid", processing: true, marketing: false });
      await saveCase(record);

      const restored = await readCase(record.key);
      expect(restored?.journey.answers.incident).toBe("A release decision returned to me.");
      expect(restored?.journey.step).toBe("reflection");
      expect(restored?.contact).toMatchObject({ name: "Local QA", email: "qa@example.invalid" });
      expect(restored?.leadId).toBe(record.key);
      expect(token).toHaveLength(43);
    } finally {
      await rm(file, { force: true });
    }
  });
});
