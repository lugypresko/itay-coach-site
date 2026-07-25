import { NextResponse } from "next/server";

import { createContentDraftWorkflow } from "@/ai/workflows";
import type { ContentDraftWorkflowInput } from "@/ai/workflows/contentDraftWorkflow";

export async function POST(request: Request) {
  const body = (await request.json()) as ContentDraftWorkflowInput & { requiredFreshnessDays?: number };
  const workflow = createContentDraftWorkflow({
    requiredFreshnessDays: body.requiredFreshnessDays,
  });

  const result = workflow.run(body);

  return NextResponse.json(result);
}

