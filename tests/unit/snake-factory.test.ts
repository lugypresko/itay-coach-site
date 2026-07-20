import { describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync } from "node:fs";
import path from "node:path";
import os from "node:os";

import {
  buildQAReport,
  createInitialGameState,
  queueDirection,
  resetGame,
  stepGame,
} from "../../snake-factory/core.js";
import { createTelemetryEvent, parseTelemetryLine, serializeTelemetryEvent } from "../../snake-factory/telemetry.js";
import { appendTelemetryEvent, clearTelemetryEvents, ensureTelemetryStore, readTelemetryEvents } from "../../snake-factory/storage.js";

describe("snake-factory core", () => {
  it("creates deterministic initial state for the same seed", () => {
    const first = createInitialGameState({ seed: 42 });
    const second = createInitialGameState({ seed: 42 });

    expect(first).toEqual(second);
    expect(first.status).toBe("ready");
    expect(resetGame({ seed: 42 }).status).toBe("running");
    expect(first.snake).toHaveLength(3);
    expect(first.food).not.toBeNull();
  });

  it("rejects direct reversal but accepts legal turns", () => {
    const initial = createInitialGameState({ seed: 42 });
    const turned = queueDirection(initial, "up");
    const rejected = queueDirection(turned, "left");

    expect(turned.pendingDirection).toBe("up");
    expect(rejected.pendingDirection).toBe("up");
  });

  it("grows the snake and increments score when food is eaten", () => {
    const state = resetGame({ seed: 1 });
    const head = state.snake[0];
    const eatingState = {
      ...state,
      food: { x: head.x + 1, y: head.y },
      direction: "right",
      pendingDirection: "right",
    };

    const result = stepGame(eatingState);

    expect(result.event.type).toBe("eat_food");
    expect(result.state.score).toBe(1);
    expect(result.state.snake).toHaveLength(4);
  });

  it("ends the run when the snake hits a wall", () => {
    const state = resetGame({ seed: 1 });
    const wallState = {
      ...state,
      snake: [{ x: state.width - 1, y: 5 }, { x: state.width - 2, y: 5 }, { x: state.width - 3, y: 5 }],
      direction: "right",
      pendingDirection: "right",
    };

    const result = stepGame(wallState);

    expect(result.event.type).toBe("game_over");
    expect(result.state.status).toBe("game_over");
    expect(result.state.reason).toBe("wall_collision");
  });

  it("produces a useful QA report for a healthy board", () => {
    const state = resetGame({ seed: 9 });
    const report = buildQAReport(state);

    expect(report.ok).toBe(true);
    expect(report.summary).toMatch(/healthy|ended cleanly/i);
  });
});

describe("snake-factory telemetry", () => {
  it("serializes and parses JSONL events", () => {
    const event = createTelemetryEvent({
      agent: "LoggerAgent",
      action: "persist_cycle",
      detail: "Persisted a cycle.",
      tick: 3,
    });

    const line = serializeTelemetryEvent(event);
    const parsed = parseTelemetryLine(line);

    expect(parsed).toMatchObject({
      agent: "LoggerAgent",
      action: "persist_cycle",
      detail: "Persisted a cycle.",
      tick: 3,
      source: "snake-factory",
    });
  });

  it("appends and reads telemetry events from disk", async () => {
    const rootDir = mkdtempSync(path.join(os.tmpdir(), "snake-factory-test-"));
    const store = await ensureTelemetryStore(rootDir);

    await clearTelemetryEvents(store);
    await appendTelemetryEvent(store, createTelemetryEvent({ agent: "Orchestrator", action: "boot", detail: "Started." }));
    await appendTelemetryEvent(store, createTelemetryEvent({ agent: "QAAgent", action: "invariant_check", detail: "Healthy." }));

    const events = await readTelemetryEvents(store, 10);

    expect(events).toHaveLength(2);
    expect(events[0].agent).toBe("Orchestrator");
    expect(events[1].agent).toBe("QAAgent");
    expect(readFileSync(store.filePath, "utf8").trim().split(/\r?\n/)).toHaveLength(2);
  });
});
