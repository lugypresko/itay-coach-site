import { describe, it, expect, vi } from "vitest";

// Mocking some dependencies to test the hook logic in isolation within the kernel
const humanRoles = new Set(["admin", "editor", "human"]);
type RequestLike = { user?: { role?: string; id?: unknown } };
type InsightData = Record<string, unknown>;

function roleOf(req: RequestLike) {
  return req?.user?.role;
}
function userIdOf(req: RequestLike) {
  return req?.user?.id?.toString();
}

const enforceApprovedInsightBoundary = async ({
  data,
  originalDoc,
  req,
}: {
  data: InsightData;
  originalDoc?: InsightData;
  req: RequestLike;
}) => {
  const next = { ...data };
  const previous = originalDoc ?? {};
  const userRole = roleOf(req);
  const isHuman = humanRoles.has(userRole ?? "");

  if (next.status === "approved") {
    if (!isHuman) {
      throw new Error("Only an authenticated human role can approve an insight.");
    }

    const approvalBoundFields = ["summary", "claims"];
    const anyContentChanged = approvalBoundFields.some(
      (field) => JSON.stringify(next[field]) !== JSON.stringify(previous[field]),
    );

    if (anyContentChanged && previous.status === "approved") {
      next.status = "needs_review";
      delete next.approvedBy;
      delete next.approvedAt;
    } else {
      next.approvedBy = userIdOf(req) || "human-editor";
      next.approvedAt = new Date().toISOString();
    }
  } else {
    if (!isHuman) {
      delete next.approvedBy;
      delete next.approvedAt;
    }
  }
  return next;
};

describe("ApprovedInsights Boundary Hook", () => {
  it("rejects approval from unauthenticated caller", async () => {
    const data = { status: "approved" };
    const req = {}; 
    await expect(enforceApprovedInsightBoundary({ data, req })).rejects.toThrow("Only an authenticated human role can approve an insight.");
  });

  it("rejects approval from agent role", async () => {
    const data = { status: "approved" };
    const req = { user: { role: "agent" } };
    await expect(enforceApprovedInsightBoundary({ data, req })).rejects.toThrow("Only an authenticated human role can approve an insight.");
  });

  it("accepts approval from human editor and sets metadata", async () => {
    const data = { status: "approved" };
    const req = { user: { id: "user-123", role: "editor" } };
    const result = await enforceApprovedInsightBoundary({ data, req });
    expect(result.status).toBe("approved");
    expect(result.approvedBy).toBe("user-123");
    expect(result.approvedAt).toBeDefined();
  });

  it("strips forged approval metadata from agent candidate creation", async () => {
    const data = { 
      status: "needs_review", 
      approvedBy: "FORGED", 
      approvedAt: "2020-01-01" 
    };
    const req = { user: { role: "agent" } };
    const result = await enforceApprovedInsightBoundary({ data, req });
    expect(result.approvedBy).toBeUndefined();
    expect(result.approvedAt).toBeUndefined();
  });

  it("invalidates approval when content is modified", async () => {
    const originalDoc = { status: "approved", summary: "Original", claims: [] };
    const data = { status: "approved", summary: "TAMPERED", claims: [] };
    const req = { user: { role: "editor", id: "editor-1" } };
    const result = await enforceApprovedInsightBoundary({ data, originalDoc, req });
    expect(result.status).toBe("needs_review");
    expect(result.approvedBy).toBeUndefined();
  });

  it("allows candidate updates by agents", async () => {
    const data = { summary: "Updated by agent" };
    const req = { user: { role: "agent" } };
    const result = await enforceApprovedInsightBoundary({ data, req });
    expect(result.summary).toBe("Updated by agent");
  });
});
