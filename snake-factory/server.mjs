import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createTelemetryEvent } from "./telemetry.js";
import { appendTelemetryEvent, clearTelemetryEvents, ensureTelemetryStore, readTelemetryEvents } from "./storage.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const store = await ensureTelemetryStore(__dirname);
const subscribers = new Set();
const port = Number(process.env.PORT ?? 8787);

const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "application/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".ico", "image/x-icon"],
]);

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function sendText(res, statusCode, payload, contentType = "text/plain; charset=utf-8") {
  res.writeHead(statusCode, { "Content-Type": contentType });
  res.end(payload);
}

function sanitizeLimit(value, fallback = 200) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.min(parsed, 1000);
}

function broadcast(event) {
  const payload = `data: ${JSON.stringify(event)}\n\n`;
  for (const res of subscribers) {
    res.write(payload);
  }
}

async function handleEventRequest(req, res) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  let body;
  try {
    body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  } catch {
    return sendJson(res, 400, { ok: false, error: "INVALID_JSON" });
  }

  if (!body || typeof body.agent !== "string" || typeof body.action !== "string") {
    return sendJson(res, 400, { ok: false, error: "INVALID_EVENT" });
  }

  const event = createTelemetryEvent({
    ...body,
    timestamp: body.timestamp ?? new Date().toISOString(),
  });

  await appendTelemetryEvent(store, event);
  broadcast(event);
  return sendJson(res, 200, { ok: true, event });
}

async function handleLogsRequest(req, res, url) {
  const limit = sanitizeLimit(url.searchParams.get("limit"));
  const events = await readTelemetryEvents(store, limit);
  return sendJson(res, 200, { ok: true, events });
}

async function handleResetRequest(res) {
  await clearTelemetryEvents(store);
  return sendJson(res, 200, { ok: true });
}

async function serveStatic(req, res, pathname) {
  const relativePath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(__dirname, `.${relativePath}`));

  if (!filePath.startsWith(__dirname)) {
    return sendText(res, 403, "Forbidden");
  }

  try {
    const data = await readFile(filePath);
    const ext = path.extname(filePath);
    const contentType = contentTypes.get(ext) ?? "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  } catch {
    return sendText(res, 404, "Not found");
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

  if (url.pathname === "/api/health") {
    return sendJson(res, 200, {
      ok: true,
      service: "snake-factory",
      logFile: store.filePath,
    });
  }

  if (url.pathname === "/api/event" && req.method === "POST") {
    return handleEventRequest(req, res);
  }

  if (url.pathname === "/api/logs" && req.method === "GET") {
    return handleLogsRequest(req, res, url);
  }

  if (url.pathname === "/api/reset" && req.method === "POST") {
    return handleResetRequest(res);
  }

  if (url.pathname === "/events") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    });
    res.write("retry: 2000\n\n");
    subscribers.add(res);

    req.on("close", () => {
      subscribers.delete(res);
    });
    return;
  }

  return serveStatic(req, res, url.pathname);
});

server.listen(port, () => {
  console.log(`Snake Factory running at http://localhost:${port}`);
  console.log(`Telemetry log: ${store.filePath}`);
});
