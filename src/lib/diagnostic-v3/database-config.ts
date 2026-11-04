/** Preview must never fall back to the general (possibly Production) connection. */
export function payloadDatabaseUrl(): string {
  return process.env.VERCEL_ENV === "preview"
    ? (process.env.DIAGNOSTIC_V3_DATABASE_URL ?? "")
    : (process.env.DATABASE_URL ?? "");
}
