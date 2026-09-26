import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "diagnostic_sessions" (
      "id" serial PRIMARY KEY NOT NULL,
      "session_id" varchar NOT NULL,
      "language" varchar DEFAULT 'en',
      "current_state" varchar DEFAULT 'ROLE' NOT NULL,
      "answers" jsonb DEFAULT '{}'::jsonb NOT NULL,
      "signals" jsonb DEFAULT '{}'::jsonb NOT NULL,
      "attribution" jsonb DEFAULT '{}'::jsonb,
      "completed_turns" numeric DEFAULT 0 NOT NULL,
      "expires_at" timestamp(3) with time zone NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE UNIQUE INDEX "diagnostic_sessions_session_id_idx" ON "diagnostic_sessions" USING btree ("session_id");
    CREATE INDEX "diagnostic_sessions_language_idx" ON "diagnostic_sessions" USING btree ("language");
    CREATE INDEX "diagnostic_sessions_expires_at_idx" ON "diagnostic_sessions" USING btree ("expires_at");
    ALTER TABLE "diagnostic_sessions" ADD COLUMN IF NOT EXISTS "insight" jsonb;
    ALTER TABLE "diagnostic_sessions" ADD COLUMN IF NOT EXISTS "diagnosis" jsonb;
    ALTER TABLE "diagnostic_sessions" ADD COLUMN IF NOT EXISTS "intent" varchar;
    ALTER TABLE "diagnostic_sessions" ADD COLUMN IF NOT EXISTS "route" varchar;
    ALTER TABLE "diagnostic_sessions" ADD COLUMN IF NOT EXISTS "reason_codes" jsonb DEFAULT '[]'::jsonb;
    ALTER TABLE "diagnostic_sessions" ADD COLUMN IF NOT EXISTS "lead_id" varchar;
    ALTER TABLE "diagnostic_sessions" ADD COLUMN IF NOT EXISTS "request_to_talk_submission_id" varchar;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE "diagnostic_sessions" CASCADE;
  `);
}
