import { headers } from "next/headers";
import { notFound } from "next/navigation";
import WatchdogClient from "./watchdog-client";
import { requireDiagnosticAdmin } from "@/payload/access/diagnostic-admin";

export const dynamic = "force-dynamic";

export default async function DiagnosticV3WatchdogPage() {
  if (process.env.VERCEL_ENV !== "preview") notFound();
  const requestHeaders = await headers();
  const request = new Request("https://watchdog.internal/admin/diagnostic-v3", { headers: requestHeaders });
  const denied = await requireDiagnosticAdmin(request);
  if (denied) notFound();
  return <WatchdogClient />;
}
