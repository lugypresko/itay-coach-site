import { describe, expect, it } from "vitest";

import { POST as createSession } from "../../src/app/api/diagnostic/session/route";
import { POST as saveAnswer } from "../../src/app/api/diagnostic/answer/route";
import { GET as getResult, POST as saveResult } from "../../src/app/api/diagnostic/result/route";

const result = {
  observedPattern: "Important decisions keep returning to one leader.",
  hypothesis: {
    primary: "authority" as const,
    confidence: "medium" as const,
    explanation: "The team may not have a clear decision boundary.",
  },
  evidenceAgainst: ["The risk may genuinely require executive judgment."],
  experiment: {
    action: "Define one decision category the team can own.",
    observation: "Notice whether the decision returns with a clearer question.",
    duration: "one week",
  },
  nextStep: "coaching" as const,
};

type DiagnosticApiBody = {
  session: {
    id: string;
    timestamps: { createdAt: string };
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

async function json(response: Response) {
  return response.json() as Promise<DiagnosticApiBody>;
}

describe("diagnostic API routes", () => {
  it("creates a preview session without external persistence", async () => {
    const response = await createSession(new Request("http://localhost/api/diagnostic/session", {
      method: "POST",
      body: JSON.stringify({ source: { entryPoint: "homepage", utmSource: "linkedin" } }),
      headers: { "content-type": "application/json" },
    }));
    const body = await json(response);

    expect(response.status).toBe(201);
    expect(body.session).toMatchObject({
      id: expect.any(String),
      status: "started",
      source: { entryPoint: "homepage", utmSource: "linkedin" },
      answers: {},
    });
    expect(body.session.timestamps.createdAt).toEqual(expect.any(String));
    expect(response.headers.get("set-cookie")).toContain("diagnostic_session_id=");
  });

  it("updates answers through the preview repository and owns the lifecycle status", async () => {
    const created = await json(await createSession(new Request("http://localhost/api/diagnostic/session", {
      method: "POST",
      body: JSON.stringify({ source: {} }),
      headers: { "content-type": "application/json" },
    })));

    const response = await saveAnswer(new Request("http://localhost/api/diagnostic/answer", {
      method: "POST",
      body: JSON.stringify({
        sessionId: created.session.id,
        answers: { caseType: "decision", context: "A launch decision kept returning to me." },
      }),
      headers: { "content-type": "application/json" },
    }));
    const body = await json(response);

    expect(response.status).toBe(200);
    expect(body.session).toMatchObject({
      id: created.session.id,
      status: "in_progress",
      answers: { caseType: "decision", context: "A launch decision kept returning to me." },
    });
  });

  it("stores and reads a bounded result for an existing session", async () => {
    const created = await json(await createSession(new Request("http://localhost/api/diagnostic/session", {
      method: "POST",
      body: JSON.stringify({ source: {} }),
      headers: { "content-type": "application/json" },
    })));

    const saved = await saveResult(new Request("http://localhost/api/diagnostic/result", {
      method: "POST",
      body: JSON.stringify({ sessionId: created.session.id, result }),
      headers: { "content-type": "application/json" },
    }));
    expect(saved.status).toBe(200);
    expect((await json(saved)).session).toMatchObject({ status: "completed", result });

    const read = await getResult(new Request(`http://localhost/api/diagnostic/result?sessionId=${created.session.id}`));
    expect(read.status).toBe(200);
    expect(await json(read)).toEqual({ sessionId: created.session.id, result });
  });

  it("rejects malformed requests and unknown sessions without provider access", async () => {
    const response = await saveAnswer(new Request("http://localhost/api/diagnostic/answer", {
      method: "POST",
      body: JSON.stringify({ sessionId: "missing", answers: {} }),
      headers: { "content-type": "application/json" },
    }));
    expect(response.status).toBe(404);

    const malformed = await createSession(new Request("http://localhost/api/diagnostic/session", {
      method: "POST",
      body: "not-json",
      headers: { "content-type": "application/json" },
    }));
    expect(malformed.status).toBe(400);
  });
});
