function clampText(value, fallback) {
  if (typeof value !== "string") {
    return fallback;
  }

  const text = value.trim();
  return text.length > 0 ? text : fallback;
}

function stableId() {
  return `evt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createTelemetryEvent(input) {
  const timestamp = input.timestamp ?? new Date().toISOString();

  return {
    id: input.id ?? stableId(),
    source: "snake-factory",
    timestamp,
    agent: clampText(input.agent, "UnknownAgent"),
    action: clampText(input.action, "observe"),
    detail: clampText(input.detail, "No detail provided."),
    tick: Number.isInteger(input.tick) ? input.tick : 0,
    severity: input.severity ?? "info",
    state: input.state ?? null,
  };
}

export function serializeTelemetryEvent(event) {
  return `${JSON.stringify(event)}\n`;
}

export function parseTelemetryLine(line) {
  const trimmed = line.trim();
  if (!trimmed) {
    return null;
  }

  return JSON.parse(trimmed);
}

export function buildTelemetrySummary(events) {
  const counts = new Map();

  for (const event of events) {
    counts.set(event.agent, (counts.get(event.agent) ?? 0) + 1);
  }

  return {
    totalEvents: events.length,
    agents: Array.from(counts.entries()).map(([agent, count]) => ({ agent, count })),
  };
}
