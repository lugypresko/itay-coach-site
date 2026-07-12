import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_problem_pages_evidence_block_confidence" AS ENUM('high', 'medium', 'low');
  CREATE TYPE "public"."enum_problem_pages_evidence_block_approval_status" AS ENUM('approved', 'source-backed', 'review');
  CREATE TYPE "public"."enum_problem_pages_status" AS ENUM('draft', 'review', 'in_review', 'approved', 'published', 'archived');
  CREATE TABLE "problem_pages_daily_scenes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "problem_pages_what_they_tried" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "problem_pages_related_frameworks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"reason" varchar NOT NULL
  );
  
  CREATE TABLE "problem_pages_related_clusters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"reason" varchar NOT NULL
  );
  
  CREATE TABLE "problem_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"pain_statement" varchar NOT NULL,
  	"why_it_failed" varchar NOT NULL,
  	"diagnosis" varchar NOT NULL,
  	"evidence_block_claim" varchar NOT NULL,
  	"evidence_block_source" varchar NOT NULL,
  	"evidence_block_related_entity" varchar NOT NULL,
  	"evidence_block_confidence" "enum_problem_pages_evidence_block_confidence" DEFAULT 'high' NOT NULL,
  	"evidence_block_approval_status" "enum_problem_pages_evidence_block_approval_status" DEFAULT 'source-backed' NOT NULL,
  	"primary_c_t_a_label" varchar NOT NULL,
  	"primary_c_t_a_href" varchar NOT NULL,
  	"primary_c_t_a_rationale" varchar NOT NULL,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"status" "enum_problem_pages_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "problem_pages_id" integer;
  ALTER TABLE "problem_pages_daily_scenes" ADD CONSTRAINT "problem_pages_daily_scenes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."problem_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "problem_pages_what_they_tried" ADD CONSTRAINT "problem_pages_what_they_tried_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."problem_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "problem_pages_related_frameworks" ADD CONSTRAINT "problem_pages_related_frameworks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."problem_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "problem_pages_related_clusters" ADD CONSTRAINT "problem_pages_related_clusters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."problem_pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "problem_pages_daily_scenes_order_idx" ON "problem_pages_daily_scenes" USING btree ("_order");
  CREATE INDEX "problem_pages_daily_scenes_parent_id_idx" ON "problem_pages_daily_scenes" USING btree ("_parent_id");
  CREATE INDEX "problem_pages_what_they_tried_order_idx" ON "problem_pages_what_they_tried" USING btree ("_order");
  CREATE INDEX "problem_pages_what_they_tried_parent_id_idx" ON "problem_pages_what_they_tried" USING btree ("_parent_id");
  CREATE INDEX "problem_pages_related_frameworks_order_idx" ON "problem_pages_related_frameworks" USING btree ("_order");
  CREATE INDEX "problem_pages_related_frameworks_parent_id_idx" ON "problem_pages_related_frameworks" USING btree ("_parent_id");
  CREATE INDEX "problem_pages_related_clusters_order_idx" ON "problem_pages_related_clusters" USING btree ("_order");
  CREATE INDEX "problem_pages_related_clusters_parent_id_idx" ON "problem_pages_related_clusters" USING btree ("_parent_id");
  CREATE INDEX "problem_pages_title_idx" ON "problem_pages" USING btree ("title");
  CREATE UNIQUE INDEX "problem_pages_slug_idx" ON "problem_pages" USING btree ("slug");
  CREATE INDEX "problem_pages_status_idx" ON "problem_pages" USING btree ("status");
  CREATE INDEX "problem_pages_updated_at_idx" ON "problem_pages" USING btree ("updated_at");
  CREATE INDEX "problem_pages_created_at_idx" ON "problem_pages" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_problem_pages_fk" FOREIGN KEY ("problem_pages_id") REFERENCES "public"."problem_pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_problem_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("problem_pages_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "problem_pages_daily_scenes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "problem_pages_what_they_tried" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "problem_pages_related_frameworks" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "problem_pages_related_clusters" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "problem_pages" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "problem_pages_daily_scenes" CASCADE;
  DROP TABLE "problem_pages_what_they_tried" CASCADE;
  DROP TABLE "problem_pages_related_frameworks" CASCADE;
  DROP TABLE "problem_pages_related_clusters" CASCADE;
  DROP TABLE "problem_pages" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_problem_pages_fk";
  
  DROP INDEX "payload_locked_documents_rels_problem_pages_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "problem_pages_id";
  DROP TYPE "public"."enum_problem_pages_evidence_block_confidence";
  DROP TYPE "public"."enum_problem_pages_evidence_block_approval_status";
  DROP TYPE "public"."enum_problem_pages_status";`)
}
