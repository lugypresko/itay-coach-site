import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

/** Stores the V1 diagnostic funnel contract without disrupting the legacy
 * conversational diagnostic columns already used by the Payload collection.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "diagnostic_sessions"
      ADD COLUMN IF NOT EXISTS "funnel_session" jsonb;
    CREATE INDEX IF NOT EXISTS "diagnostic_sessions_funnel_session_expires_idx"
      ON "diagnostic_sessions" USING btree ("expires_at");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "diagnostic_sessions_funnel_session_expires_idx";
    ALTER TABLE "diagnostic_sessions"
      DROP COLUMN IF EXISTS "funnel_session";
  `);
}
