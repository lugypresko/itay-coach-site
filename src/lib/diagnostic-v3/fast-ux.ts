/**
 * Fast Diagnostic V3 UX is on unless explicitly disabled.
 * Read through a dynamic env lookup so a request-time change to
 * DIAGNOSTIC_V3_FAST_UX=false restores the slower path.
 */
export function diagnosticFastUxEnabled(): boolean {
  return process.env["DIAGNOSTIC_V3_FAST_UX"] !== "false";
}

/** QA banners stay tied to Preview, independent of the fast-UX flag. */
export function diagnosticPreviewQa(): boolean {
  return process.env.VERCEL_ENV === "preview";
}
