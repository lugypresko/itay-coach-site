import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_reader_facing_page_artifacts_lifecycle" AS ENUM('draft', 'approved');
  CREATE TABLE "reader_facing_page_artifacts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"artifact_id" varchar NOT NULL,
  	"artifact_version" numeric NOT NULL,
  	"schema_version" varchar NOT NULL,
  	"artifact_key" varchar NOT NULL,
  	"artifact_hash" varchar NOT NULL,
  	"lifecycle" "enum_reader_facing_page_artifacts_lifecycle" DEFAULT 'draft' NOT NULL,
  	"public_fields" jsonb NOT NULL,
  	"deterministic_validation" jsonb,
  	"internal_language_validation" jsonb,
  	"semantic_review" jsonb,
  	"human_approval" jsonb,
  	"provenance" jsonb NOT NULL,
  	"publication_record" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "reader_facing_page_artifacts_id" integer;
  CREATE INDEX "reader_facing_page_artifacts_artifact_id_idx" ON "reader_facing_page_artifacts" USING btree ("artifact_id");
  CREATE INDEX "reader_facing_page_artifacts_artifact_version_idx" ON "reader_facing_page_artifacts" USING btree ("artifact_version");
  CREATE UNIQUE INDEX "reader_facing_page_artifacts_artifact_key_idx" ON "reader_facing_page_artifacts" USING btree ("artifact_key");
  CREATE INDEX "reader_facing_page_artifacts_artifact_hash_idx" ON "reader_facing_page_artifacts" USING btree ("artifact_hash");
  CREATE INDEX "reader_facing_page_artifacts_lifecycle_idx" ON "reader_facing_page_artifacts" USING btree ("lifecycle");
  CREATE INDEX "reader_facing_page_artifacts_updated_at_idx" ON "reader_facing_page_artifacts" USING btree ("updated_at");
  CREATE INDEX "reader_facing_page_artifacts_created_at_idx" ON "reader_facing_page_artifacts" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reader_facing_page_artifact_fk" FOREIGN KEY ("reader_facing_page_artifacts_id") REFERENCES "public"."reader_facing_page_artifacts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_reader_facing_page_artifac_idx" ON "payload_locked_documents_rels" USING btree ("reader_facing_page_artifacts_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "reader_facing_page_artifacts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "reader_facing_page_artifacts" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_reader_facing_page_artifact_fk";
  
  DROP INDEX "payload_locked_documents_rels_reader_facing_page_artifac_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "reader_facing_page_artifacts_id";
  DROP TYPE "public"."enum_reader_facing_page_artifacts_lifecycle";`)
}
