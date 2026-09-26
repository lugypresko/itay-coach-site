import { NextResponse } from "next/server";

import { getServerPayload } from "@/lib/payload";
import { isPlayerTrapReportTokenValid, isPlayerTrapReportWithinTtl } from "@/lib/player-trap";

const historicalHeaders = {
  "Cache-Control": "private, no-store",
  "Referrer-Policy": "no-referrer",
};

async function readToken(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = (await request.json()) as { reportToken?: string };
    return body.reportToken?.trim() ?? "";
  }

  const formData = await request.formData();
  return String(formData.get("reportToken") ?? "").trim();
}

export async function GET(request: Request) {
  const reportToken = new URL(request.url).searchParams.get("reportToken")?.trim() ?? "";
  if (!isPlayerTrapReportTokenValid(reportToken)) {
    return NextResponse.json({ error: "Report token not found." }, { status: 404, headers: historicalHeaders });
  }

  const payload = await getServerPayload();
  const result = await payload.find({
    collection: "email-subscribers",
    limit: 1,
    overrideAccess: true,
    where: {
      reportToken: {
        equals: reportToken,
      },
    },
  } as never);

  const record = result.docs[0] as unknown as { id?: string; pageLanguage?: string; createdAt?: string } | undefined;

  if (!record?.id || !isPlayerTrapReportWithinTtl(record.createdAt)) {
    return NextResponse.json({ error: "Report token not found." }, { status: 404, headers: historicalHeaders });
  }

  await payload.update({
    collection: "email-subscribers",
    id: record.id,
    data: {
      lifecycleStage: "conversation_requested",
      diagnosisCallRequestedAt: new Date().toISOString(),
    } as never,
    overrideAccess: true,
  });

  const lang = record.pageLanguage === "he" ? "he" : "en";
  return NextResponse.redirect(new URL(`/contact?source=diagnostic&intent=request_to_talk&lang=${lang}`, request.url), { status: 303, headers: historicalHeaders });
}

export async function POST(request: Request) {
  const reportToken = await readToken(request);

  if (!reportToken) {
    return NextResponse.json({ error: "reportToken is required." }, { status: 400 });
  }

  const payload = await getServerPayload();
  const result = await payload.find({
    collection: "email-subscribers",
    limit: 1,
    overrideAccess: true,
    where: {
      reportToken: {
        equals: reportToken,
      },
    },
  } as never);

  const record = result.docs[0] as unknown as { id?: string; pageLanguage?: string } | undefined;

  if (!record?.id) {
    return NextResponse.json({ error: "Report token not found." }, { status: 404 });
  }

  await payload.update({
    collection: "email-subscribers",
    id: record.id,
    data: {
      lifecycleStage: "conversation_requested",
      diagnosisCallRequestedAt: new Date().toISOString(),
    } as never,
    overrideAccess: true,
  });

  const lang = record.pageLanguage === "he" ? "he" : "en";
  return NextResponse.redirect(new URL(`/contact?source=diagnostic&intent=request_to_talk&lang=${lang}`, request.url), { status: 303, headers: historicalHeaders });
}
