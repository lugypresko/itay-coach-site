import { buildGameSnapshot, buildQAReport, DEFAULT_SEED, queueDirection, resetGame, stepGame } from "./core.js";
import { createTelemetryEvent } from "./telemetry.js";

const canvas = document.querySelector("#board");
const ctx = canvas.getContext("2d");
const startButton = document.querySelector("#start");
const pauseButton = document.querySelector("#pause");
const restartButton = document.querySelector("#restart");
const seedInput = document.querySelector("#seed");
const speedInput = document.querySelector("#speed");
const statusChip = document.querySelector("#status-chip");
const scoreValue = document.querySelector("#score");
const tickValue = document.querySelector("#tick");
const lengthValue = document.querySelector("#length");
const logList = document.querySelector("#log-list");
const agentGrid = document.querySelector("#agent-grid");
const healthText = document.querySelector("#health-text");
const logMeta = document.querySelector("#log-meta");
const seedDisplay = document.querySelector("#seed-display");

const agentBlueprints = [
  {
    name: "Orchestrator",
    role: "Starts runs, advances ticks, and coordinates restart or pause.",
    mood: "dispatch",
  },
  {
    name: "GameAgent",
    role: "Applies direction changes, advances the snake, and resolves collisions.",
    mood: "simulate",
  },
  {
    name: "MonitorAgent",
    role: "Observes board state, danger level, and score pressure.",
    mood: "observe",
  },
  {
    name: "LoggerAgent",
    role: "Sends every structured event to the local JSONL log.",
    mood: "persist",
  },
  {
    name: "QAAgent",
    role: "Checks invariants and reports when the run is healthy or broken.",
    mood: "verify",
  },
];

const eventMap = new Map();
const events = [];
const agentCounts = new Map(agentBlueprints.map((agent) => [agent.name, 0]));

let gameState = resetGame({ seed: Number(seedInput.value || DEFAULT_SEED) });
let loopHandle = null;
let isRunning = false;
let liveConnection = null;
let queuedDirection = gameState.pendingDirection;

function resetAgentCounts() {
  for (const key of agentCounts.keys()) {
    agentCounts.set(key, 0);
  }
}

function syncAgentMeters() {
  document.querySelectorAll("[data-agent-meter]").forEach((meter) => {
    const agent = meter.dataset.agentMeter;
    meter.textContent = `${agentCounts.get(agent) ?? 0} events`;
  });
}

function updateSummary() {
  const snapshot = buildGameSnapshot(gameState);
  statusChip.textContent = snapshot.status === "running" ? "RUNNING" : snapshot.status.toUpperCase();
  statusChip.dataset.status = snapshot.status;
  scoreValue.textContent = String(snapshot.score);
  tickValue.textContent = String(snapshot.tick);
  lengthValue.textContent = String(snapshot.length);
  healthText.textContent =
    snapshot.status === "game_over"
      ? `Run ended with ${snapshot.reason}.`
      : snapshot.status === "running"
        ? "Run is active. Logs are streaming live."
        : "Ready to start.";

  if (seedDisplay) {
    seedDisplay.textContent = String(snapshot.seed);
  }

  syncAgentMeters();
}

function renderAgents() {
  agentGrid.innerHTML = agentBlueprints
    .map((agent) => {
      const count = agentCounts.get(agent.name) ?? 0;
      return `
        <article class="agent-card" data-agent-card="${agent.name}">
          <div class="agent-card__top">
            <span class="agent-pill">${agent.mood}</span>
            <strong>${agent.name}</strong>
          </div>
          <p>${agent.role}</p>
          <div class="agent-meter" data-agent-meter="${agent.name}">${count} events</div>
        </article>
      `;
    })
    .join("");
}

function renderLogs() {
  const recent = events.slice(-24).reverse();
  logList.innerHTML = recent
    .map((event) => {
      const stateLabel = event.state?.status ? ` · ${event.state.status}` : "";
      return `
        <li class="log-row log-row--${event.agent.toLowerCase()}">
          <div class="log-row__meta">
            <span>${event.agent}</span>
            <time>${new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</time>
          </div>
          <strong>${event.action}</strong>
          <p>${event.detail}${stateLabel}</p>
        </li>
      `;
    })
    .join("");

  logMeta.textContent = `${events.length} events captured`;
}

function recordEvent(event) {
  if (!event || !event.id || eventMap.has(event.id)) {
    return;
  }

  eventMap.set(event.id, event);
  events.push(event);
  agentCounts.set(event.agent, (agentCounts.get(event.agent) ?? 0) + 1);
  renderLogs();
  updateSummary();
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  return response.json();
}

async function emit(agent, action, detail, severity = "info", overrideState) {
  const event = createTelemetryEvent({
    agent,
    action,
    detail,
    severity,
    tick: overrideState?.tick ?? gameState.tick,
    state: overrideState ?? buildGameSnapshot(gameState),
  });

  const response = await fetchJson("/api/event", {
    method: "POST",
    body: JSON.stringify(event),
  });

  recordEvent(response.event);
  return response.event;
}

function dangerLevel(snapshot) {
  if (snapshot.status === "game_over") {
    return "critical";
  }

  if (!snapshot.head || !snapshot.food) {
    return "unknown";
  }

  const distance = Math.abs(snapshot.head.x - snapshot.food.x) + Math.abs(snapshot.head.y - snapshot.food.y);
  if (distance <= 2) {
    return "high";
  }

  if (distance <= 5) {
    return "medium";
  }

  return "low";
}

async function runQA() {
  const report = buildQAReport(gameState);
  const snapshot = buildGameSnapshot(gameState);
  await emit(
    "QAAgent",
    report.ok ? "invariant_check" : "invariant_failure",
    report.ok
      ? `No invariant violations detected. ${report.summary}.`
      : `Invariant failure detected: ${report.summary}.`,
    report.ok ? "info" : "error",
    snapshot,
  );
}

async function runMonitor() {
  const snapshot = buildGameSnapshot(gameState);
  await emit(
    "MonitorAgent",
    "observe_board",
    `Board ${gameState.width}x${gameState.height}, danger ${dangerLevel(snapshot)}, head at ${snapshot.head?.x ?? "?"},${snapshot.head?.y ?? "?"}.`,
    snapshot.status === "game_over" ? "warn" : "info",
    snapshot,
  );
}

async function runGameTick() {
  if (!isRunning) {
    return;
  }

  const before = buildGameSnapshot(gameState);
  await emit("Orchestrator", "dispatch_tick", `Dispatching tick ${before.tick + 1} with seed ${before.seed}.`, "info", before);

  gameState = queueDirection(gameState, queuedDirection);
  const result = stepGame(gameState);
  gameState = result.state;
  const after = buildGameSnapshot(gameState);

  await emit(
    "GameAgent",
    result.event.type === "game_over" ? "resolve_collision" : result.event.ateFood ? "eat_food" : "advance",
    result.event.type === "game_over"
      ? `Collision ended the run via ${result.event.reason}.`
      : result.event.ateFood
        ? `Snake grew to ${after.length} segments after eating food.`
        : `Moved ${after.direction} to ${after.head?.x ?? "?"},${after.head?.y ?? "?"}.`,
    result.event.type === "game_over" ? "error" : "info",
    after,
  );

  await runMonitor();
  await runQA();

  await emit(
    "LoggerAgent",
    "persist_cycle",
    `Persisted the latest agent cycle to the JSONL log with ${events.length + 1} total recorded events.`,
    "info",
    after,
  );

  if (gameState.status === "game_over") {
    stopLoop();
    await emit("Orchestrator", "halt_cycle", `Run paused because the snake hit a ${gameState.reason}. Use restart to begin a new deterministic run.`, "warn", after);
  }
}

function drawCell(x, y, fillStyle, inset = 0) {
  const cellSize = canvas.width / gameState.width;
  const size = cellSize - inset * 2;
  ctx.fillStyle = fillStyle;
  ctx.fillRect(x * cellSize + inset, y * cellSize + inset, size, size);
}

function renderBoard() {
  const width = canvas.width;
  const height = canvas.height;
  const cellSize = width / gameState.width;

  ctx.clearRect(0, 0, width, height);
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#07141d");
  gradient.addColorStop(0.5, "#0e202d");
  gradient.addColorStop(1, "#04080f");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= gameState.width; i += 1) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(width, i * cellSize);
    ctx.stroke();
  }

  if (gameState.food) {
    drawCell(gameState.food.x, gameState.food.y, "#ff8b3d", 2);
    ctx.fillStyle = "rgba(255, 180, 120, 0.5)";
    ctx.beginPath();
    ctx.arc((gameState.food.x + 0.5) * cellSize, (gameState.food.y + 0.5) * cellSize, cellSize * 0.22, 0, Math.PI * 2);
    ctx.fill();
  }

  gameState.snake.forEach((segment, index) => {
    const alpha = Math.max(0.35, 1 - index * 0.06);
    const isHead = index === 0;
    const color = isHead ? `rgba(175, 255, 122, ${alpha})` : `rgba(88, 201, 117, ${alpha})`;
    drawCell(segment.x, segment.y, color, isHead ? 1.5 : 3);
  });

  if (gameState.status === "game_over") {
    ctx.fillStyle = "rgba(1, 5, 10, 0.64)";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#f8fbff";
    ctx.font = "700 28px Inter, system-ui, sans-serif";
    ctx.fillText("Game Over", 24, 54);
    ctx.font = "400 14px Inter, system-ui, sans-serif";
    ctx.fillText(`Reason: ${gameState.reason}`, 24, 80);
  }
}

function stopLoop() {
  if (loopHandle) {
    clearInterval(loopHandle);
    loopHandle = null;
  }

  isRunning = false;
  startButton.disabled = false;
  pauseButton.disabled = true;
  updateSummary();
}

function startLoop() {
  if (loopHandle) {
    clearInterval(loopHandle);
  }

  isRunning = true;
  startButton.disabled = true;
  pauseButton.disabled = false;
  const speed = Number(speedInput.value) || 240;
  loopHandle = setInterval(() => {
    void runGameTick().then(() => renderBoard());
  }, speed);
}

async function restartRun() {
  stopLoop();
  await fetchJson("/api/reset", { method: "POST", body: "{}" }).catch(() => null);

  const seed = Number(seedInput.value || DEFAULT_SEED);
  gameState = resetGame({ seed });
  queuedDirection = gameState.pendingDirection;
  events.length = 0;
  eventMap.clear();
  resetAgentCounts();
  renderLogs();
  renderAgents();
  renderBoard();
  updateSummary();
  void emit("Orchestrator", "restart_run", `Reset the board with seed ${seed}.`, "info", buildGameSnapshot(gameState));
  startLoop();
}

function pauseRun() {
  stopLoop();
  void emit("Orchestrator", "pause_run", "Paused the current deterministic run.", "info", buildGameSnapshot(gameState));
}

function bindKeyboard() {
  window.addEventListener("keydown", (event) => {
    const map = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      w: "up",
      s: "down",
      a: "left",
      d: "right",
    };

    const direction = map[event.key];
    if (!direction) {
      return;
    }

    gameState = queueDirection(gameState, direction);
    queuedDirection = gameState.pendingDirection;
    updateSummary();
  });
}

async function loadTelemetry() {
  const response = await fetch("/api/logs?limit=200");
  if (!response.ok) {
    return;
  }

  const payload = await response.json();
  for (const event of payload.events ?? []) {
    recordEvent(event);
  }
}

function connectLiveFeed() {
  if (liveConnection) {
    liveConnection.close();
  }

  liveConnection = new EventSource("/events");
  liveConnection.onmessage = (message) => {
    try {
      recordEvent(JSON.parse(message.data));
    } catch {
      // Ignore malformed telemetry.
    }
  };
}

function wireControls() {
  startButton.addEventListener("click", () => startLoop());
  pauseButton.addEventListener("click", () => pauseRun());
  restartButton.addEventListener("click", () => {
    void restartRun();
  });

  speedInput.addEventListener("change", () => {
    if (isRunning) {
      startLoop();
    }
  });
}

function renderHeader() {
  const snapshot = buildGameSnapshot(gameState);
  if (seedDisplay) {
    seedDisplay.textContent = String(snapshot.seed);
  }
}

async function bootstrap() {
  renderAgents();
  renderLogs();
  renderBoard();
  updateSummary();
  renderHeader();
  wireControls();
  bindKeyboard();
  connectLiveFeed();
  await fetchJson("/api/reset", { method: "POST", body: "{}" }).catch(() => null);
  await loadTelemetry();
  void emit("Orchestrator", "boot", "Loaded the standalone Snake factory demo and prepared the initial run.", "info", buildGameSnapshot(gameState));
  startLoop();
}

bootstrap().catch((error) => {
  console.error(error);
  healthText.textContent = "Failed to bootstrap the Snake Factory demo.";
});
