import { getPreviewDiagnosticSessionRepository } from "./preview-repository";
import { createSupabaseDiagnosticSessionRepository } from "./supabase-session-repository";
import type { DiagnosticSessionRepository } from "./session-repository";

/** Preview remains disposable; Production uses the shared Supabase store. */
export function getDiagnosticSessionRepository(): DiagnosticSessionRepository {
  if (process.env.VERCEL_ENV === "preview" || process.env.NODE_ENV !== "production") {
    return getPreviewDiagnosticSessionRepository();
  }
  return createSupabaseDiagnosticSessionRepository();
}
