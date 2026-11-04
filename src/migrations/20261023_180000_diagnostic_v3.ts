import { MigrateUpArgs, sql } from "@payloadcms/db-postgres";
/** Additive only. Run on an isolated QA DB first; never at build/start. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
CREATE TABLE IF NOT EXISTS diagnostic_v3_sessions (
 id uuid PRIMARY KEY, auth_hash varchar(64) UNIQUE NOT NULL,
 payload jsonb NOT NULL, record_version integer NOT NULL DEFAULT 0,
 expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE diagnostic_v3_sessions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON diagnostic_v3_sessions FROM PUBLIC;
CREATE INDEX IF NOT EXISTS diagnostic_v3_expiry_idx ON diagnostic_v3_sessions(expires_at);
`);
}
export async function down(): Promise<void> {
  throw new Error(
    "V3 rollback preserves data. Restore code; archive/drop the isolated table only through separately reviewed maintenance.",
  );
}
