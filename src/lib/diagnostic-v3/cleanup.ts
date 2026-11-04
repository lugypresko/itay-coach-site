/** Explicit maintenance command, never imported by the app or run on build.
 * Use a separately authorized scheduler with DIAGNOSTIC_V3_DATABASE_URL.
 */
import pg from "pg";
export async function deleteExpiredSessions(connectionString: string) {
  const pool = new pg.Pool({ connectionString, max: 1 });
  try {
    const result = await pool.query(
      "DELETE FROM diagnostic_v3_sessions WHERE expires_at <= now()",
    );
    return result.rowCount ?? 0;
  } finally {
    await pool.end();
  }
}
