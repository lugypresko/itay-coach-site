import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

/** Additive Conversion Core fields. Legacy Player Trap columns are retained
 * for historical records; the new flow reads/writes only these fields. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "email_subscribers"
      ADD COLUMN IF NOT EXISTS "diagnostic_session" varchar,
      ADD COLUMN IF NOT EXISTS "diagnostic_snapshot" jsonb,
      ADD COLUMN IF NOT EXISTS "processing_consent_accepted" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "processing_consent_accepted_at" timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS "marketing_consent_accepted" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "marketing_consent_accepted_at" timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS "submission_id" varchar,
      ADD COLUMN IF NOT EXISTS "explicit_intent" varchar,
      ADD COLUMN IF NOT EXISTS "dql_route" varchar,
      ADD COLUMN IF NOT EXISTS "route_reason_codes" jsonb,
      ADD COLUMN IF NOT EXISTS "request_to_talk_at" timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS "request_to_talk_status" varchar,
      ADD COLUMN IF NOT EXISTS "itay_notification_status" varchar,
      ADD COLUMN IF NOT EXISTS "visitor_confirmation_status" varchar;
    CREATE UNIQUE INDEX IF NOT EXISTS "email_subscribers_diagnostic_session_idx"
      ON "email_subscribers" USING btree ("diagnostic_session")
      WHERE "diagnostic_session" IS NOT NULL;
    CREATE UNIQUE INDEX IF NOT EXISTS "email_subscribers_submission_id_idx"
      ON "email_subscribers" USING btree ("submission_id")
      WHERE "submission_id" IS NOT NULL;
    CREATE INDEX IF NOT EXISTS "email_subscribers_dql_route_idx"
      ON "email_subscribers" USING btree ("dql_route");
    CREATE INDEX IF NOT EXISTS "email_subscribers_request_to_talk_status_idx"
      ON "email_subscribers" USING btree ("request_to_talk_status");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "email_subscribers_diagnostic_session_idx";
    DROP INDEX IF EXISTS "email_subscribers_submission_id_idx";
    DROP INDEX IF EXISTS "email_subscribers_dql_route_idx";
    DROP INDEX IF EXISTS "email_subscribers_request_to_talk_status_idx";
    ALTER TABLE "email_subscribers"
      DROP COLUMN IF EXISTS "diagnostic_session",
      DROP COLUMN IF EXISTS "diagnostic_snapshot",
      DROP COLUMN IF EXISTS "processing_consent_accepted",
      DROP COLUMN IF EXISTS "processing_consent_accepted_at",
      DROP COLUMN IF EXISTS "marketing_consent_accepted",
      DROP COLUMN IF EXISTS "marketing_consent_accepted_at",
      DROP COLUMN IF EXISTS "submission_id",
      DROP COLUMN IF EXISTS "explicit_intent",
      DROP COLUMN IF EXISTS "dql_route",
      DROP COLUMN IF EXISTS "route_reason_codes",
      DROP COLUMN IF EXISTS "request_to_talk_at",
      DROP COLUMN IF EXISTS "request_to_talk_status",
      DROP COLUMN IF EXISTS "itay_notification_status",
      DROP COLUMN IF EXISTS "visitor_confirmation_status";
  `);
}
