import { mkdir, readFile, appendFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { parseTelemetryLine, serializeTelemetryEvent } from "./telemetry.js";

export async function ensureTelemetryStore(rootDir) {
  const logsDir = path.join(rootDir, "logs");
  const filePath = path.join(logsDir, "agent-events.jsonl");

  await mkdir(logsDir, { recursive: true });
  await mkdir(path.join(rootDir, "logs"), { recursive: true });

  return { rootDir, logsDir, filePath };
}

export async function appendTelemetryEvent(store, event) {
  const line = serializeTelemetryEvent(event);
  await appendFile(store.filePath, line, "utf8");
  return line;
}

export async function readTelemetryEvents(store, limit = 200) {
  try {
    const raw = await readFile(store.filePath, "utf8");
    const events = raw
      .split(/\r?\n/)
      .map(parseTelemetryLine)
      .filter(Boolean);

    return typeof limit === "number" && limit > 0 ? events.slice(-limit) : events;
  } catch (error) {
    if (error && typeof error === "object" && error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

export async function clearTelemetryEvents(store) {
  await writeFile(store.filePath, "", "utf8");
}
