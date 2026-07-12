import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_approved_insights_source_type" AS ENUM('voice_memo', 'interview', 'review', 'note', 'approved_quote');
    CREATE TYPE "public"."enum_approved_insights_status" AS ENUM('approved');
    CREATE TYPE "public"."enum_knowledge_assets_review_status" AS ENUM('draft', 'in_review', 'approved', 'rejected');

    CREATE TABLE "approved_insights_claims_evidence_urls" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "value" varchar NOT NULL
    );

    CREATE TABLE "approved_insights_claims_target_queries" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "value" varchar NOT NULL
    );

    CREATE TABLE "approved_insights_claims_target_entities" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "value" varchar NOT NULL
    );

    CREATE TABLE "approved_insights_claims" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar NOT NULL
    );

    CREATE TABLE "approved_insights_evidence_urls" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "value" varchar NOT NULL
    );

    CREATE TABLE "approved_insights_entity_tags" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "value" varchar NOT NULL
    );

    CREATE TABLE "approved_insights_target_queries" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "value" varchar NOT NULL
    );

    CREATE TABLE "approved_insights_target_recommendation_queries" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "value" varchar NOT NULL
    );

    CREATE TABLE "approved_insights_source_urls" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "value" varchar NOT NULL
    );

    CREATE TABLE "approved_insights" (
      "id" serial PRIMARY KEY NOT NULL,
      "source_insight_id" varchar NOT NULL,
      "source_title" varchar NOT NULL,
      "source_type" "enum_approved_insights_source_type" NOT NULL,
      "status" "enum_approved_insights_status" DEFAULT 'approved' NOT NULL,
      "captured_at" timestamp(3) with time zone NOT NULL,
      "approved_at" timestamp(3) with time zone NOT NULL,
      "approved_by" varchar NOT NULL,
      "freshness_expires_at" timestamp(3) with time zone NOT NULL,
      "summary" varchar NOT NULL,
      "raw_text" varchar,
      "authority_purpose" varchar,
      "linked_content_job_id" varchar,
      "reviewer_notes" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE "knowledge_assets_claim_ids" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "value" varchar NOT NULL
    );

    CREATE TABLE "knowledge_assets_target_queries" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "value" varchar NOT NULL
    );

    CREATE TABLE "knowledge_assets_target_entities" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "value" varchar NOT NULL
    );

    CREATE TABLE "knowledge_assets_evidence_urls" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "value" varchar NOT NULL
    );

    CREATE TABLE "knowledge_assets_source_urls" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "value" varchar NOT NULL
    );

    CREATE TABLE "knowledge_assets" (
      "id" serial PRIMARY KEY NOT NULL,
      "source_insight_id" varchar NOT NULL,
      "source_insight_record_id" integer NOT NULL,
      "short_answer" varchar NOT NULL,
      "review_status" "enum_knowledge_assets_review_status" NOT NULL,
      "title" varchar,
      "summary" varchar,
      "reviewer_notes" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    ALTER TABLE "approved_insights_claims_evidence_urls"
      ADD CONSTRAINT "approved_insights_claims_evidence_urls_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."approved_insights_claims"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "approved_insights_claims_target_queries"
      ADD CONSTRAINT "approved_insights_claims_target_queries_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."approved_insights_claims"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "approved_insights_claims_target_entities"
      ADD CONSTRAINT "approved_insights_claims_target_entities_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."approved_insights_claims"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "approved_insights_claims"
      ADD CONSTRAINT "approved_insights_claims_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."approved_insights"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "approved_insights_evidence_urls"
      ADD CONSTRAINT "approved_insights_evidence_urls_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."approved_insights"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "approved_insights_entity_tags"
      ADD CONSTRAINT "approved_insights_entity_tags_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."approved_insights"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "approved_insights_target_queries"
      ADD CONSTRAINT "approved_insights_target_queries_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."approved_insights"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "approved_insights_target_recommendation_queries"
      ADD CONSTRAINT "approved_insights_target_recommendation_queries_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."approved_insights"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "approved_insights_source_urls"
      ADD CONSTRAINT "approved_insights_source_urls_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."approved_insights"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "knowledge_assets_claim_ids"
      ADD CONSTRAINT "knowledge_assets_claim_ids_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."knowledge_assets"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "knowledge_assets_target_queries"
      ADD CONSTRAINT "knowledge_assets_target_queries_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."knowledge_assets"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "knowledge_assets_target_entities"
      ADD CONSTRAINT "knowledge_assets_target_entities_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."knowledge_assets"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "knowledge_assets_evidence_urls"
      ADD CONSTRAINT "knowledge_assets_evidence_urls_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."knowledge_assets"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "knowledge_assets_source_urls"
      ADD CONSTRAINT "knowledge_assets_source_urls_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."knowledge_assets"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "knowledge_assets"
      ADD CONSTRAINT "knowledge_assets_source_insight_record_id_approved_insights_id_fk"
      FOREIGN KEY ("source_insight_record_id") REFERENCES "public"."approved_insights"("id") ON DELETE set null ON UPDATE no action;

    CREATE INDEX "approved_insights_claims_evidence_urls_order_idx" ON "approved_insights_claims_evidence_urls" USING btree ("_order");
    CREATE INDEX "approved_insights_claims_evidence_urls_parent_id_idx" ON "approved_insights_claims_evidence_urls" USING btree ("_parent_id");
    CREATE INDEX "approved_insights_claims_target_queries_order_idx" ON "approved_insights_claims_target_queries" USING btree ("_order");
    CREATE INDEX "approved_insights_claims_target_queries_parent_id_idx" ON "approved_insights_claims_target_queries" USING btree ("_parent_id");
    CREATE INDEX "approved_insights_claims_target_entities_order_idx" ON "approved_insights_claims_target_entities" USING btree ("_order");
    CREATE INDEX "approved_insights_claims_target_entities_parent_id_idx" ON "approved_insights_claims_target_entities" USING btree ("_parent_id");
    CREATE INDEX "approved_insights_claims_order_idx" ON "approved_insights_claims" USING btree ("_order");
    CREATE INDEX "approved_insights_claims_parent_id_idx" ON "approved_insights_claims" USING btree ("_parent_id");
    CREATE INDEX "approved_insights_evidence_urls_order_idx" ON "approved_insights_evidence_urls" USING btree ("_order");
    CREATE INDEX "approved_insights_evidence_urls_parent_id_idx" ON "approved_insights_evidence_urls" USING btree ("_parent_id");
    CREATE INDEX "approved_insights_entity_tags_order_idx" ON "approved_insights_entity_tags" USING btree ("_order");
    CREATE INDEX "approved_insights_entity_tags_parent_id_idx" ON "approved_insights_entity_tags" USING btree ("_parent_id");
    CREATE INDEX "approved_insights_target_queries_order_idx" ON "approved_insights_target_queries" USING btree ("_order");
    CREATE INDEX "approved_insights_target_queries_parent_id_idx" ON "approved_insights_target_queries" USING btree ("_parent_id");
    CREATE INDEX "approved_insights_target_recommendation_queries_order_idx" ON "approved_insights_target_recommendation_queries" USING btree ("_order");
    CREATE INDEX "approved_insights_target_recommendation_queries_parent_id_idx" ON "approved_insights_target_recommendation_queries" USING btree ("_parent_id");
    CREATE INDEX "approved_insights_source_urls_order_idx" ON "approved_insights_source_urls" USING btree ("_order");
    CREATE INDEX "approved_insights_source_urls_parent_id_idx" ON "approved_insights_source_urls" USING btree ("_parent_id");
    CREATE UNIQUE INDEX "approved_insights_source_insight_id_idx" ON "approved_insights" USING btree ("source_insight_id");
    CREATE INDEX "approved_insights_source_title_idx" ON "approved_insights" USING btree ("source_title");
    CREATE INDEX "approved_insights_source_type_idx" ON "approved_insights" USING btree ("source_type");
    CREATE INDEX "approved_insights_status_idx" ON "approved_insights" USING btree ("status");
    CREATE INDEX "approved_insights_captured_at_idx" ON "approved_insights" USING btree ("captured_at");
    CREATE INDEX "approved_insights_approved_at_idx" ON "approved_insights" USING btree ("approved_at");
    CREATE INDEX "approved_insights_approved_by_idx" ON "approved_insights" USING btree ("approved_by");
    CREATE INDEX "approved_insights_freshness_expires_at_idx" ON "approved_insights" USING btree ("freshness_expires_at");
    CREATE INDEX "approved_insights_linked_content_job_id_idx" ON "approved_insights" USING btree ("linked_content_job_id");
    CREATE INDEX "approved_insights_updated_at_idx" ON "approved_insights" USING btree ("updated_at");
    CREATE INDEX "approved_insights_created_at_idx" ON "approved_insights" USING btree ("created_at");

    CREATE INDEX "knowledge_assets_claim_ids_order_idx" ON "knowledge_assets_claim_ids" USING btree ("_order");
    CREATE INDEX "knowledge_assets_claim_ids_parent_id_idx" ON "knowledge_assets_claim_ids" USING btree ("_parent_id");
    CREATE INDEX "knowledge_assets_target_queries_order_idx" ON "knowledge_assets_target_queries" USING btree ("_order");
    CREATE INDEX "knowledge_assets_target_queries_parent_id_idx" ON "knowledge_assets_target_queries" USING btree ("_parent_id");
    CREATE INDEX "knowledge_assets_target_entities_order_idx" ON "knowledge_assets_target_entities" USING btree ("_order");
    CREATE INDEX "knowledge_assets_target_entities_parent_id_idx" ON "knowledge_assets_target_entities" USING btree ("_parent_id");
    CREATE INDEX "knowledge_assets_evidence_urls_order_idx" ON "knowledge_assets_evidence_urls" USING btree ("_order");
    CREATE INDEX "knowledge_assets_evidence_urls_parent_id_idx" ON "knowledge_assets_evidence_urls" USING btree ("_parent_id");
    CREATE INDEX "knowledge_assets_source_urls_order_idx" ON "knowledge_assets_source_urls" USING btree ("_order");
    CREATE INDEX "knowledge_assets_source_urls_parent_id_idx" ON "knowledge_assets_source_urls" USING btree ("_parent_id");
    CREATE UNIQUE INDEX "knowledge_assets_source_insight_id_idx" ON "knowledge_assets" USING btree ("source_insight_id");
    CREATE INDEX "knowledge_assets_source_insight_record_idx" ON "knowledge_assets" USING btree ("source_insight_record_id");
    CREATE INDEX "knowledge_assets_review_status_idx" ON "knowledge_assets" USING btree ("review_status");
    CREATE INDEX "knowledge_assets_title_idx" ON "knowledge_assets" USING btree ("title");
    CREATE INDEX "knowledge_assets_updated_at_idx" ON "knowledge_assets" USING btree ("updated_at");
    CREATE INDEX "knowledge_assets_created_at_idx" ON "knowledge_assets" USING btree ("created_at");

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "approved_insights_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "knowledge_assets_id" integer;
    CREATE INDEX "payload_locked_documents_rels_approved_insights_id_idx" ON "payload_locked_documents_rels" USING btree ("approved_insights_id");
    CREATE INDEX "payload_locked_documents_rels_knowledge_assets_id_idx" ON "payload_locked_documents_rels" USING btree ("knowledge_assets_id");
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_approved_insights_fk" FOREIGN KEY ("approved_insights_id") REFERENCES "public"."approved_insights"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_knowledge_assets_fk" FOREIGN KEY ("knowledge_assets_id") REFERENCES "public"."knowledge_assets"("id") ON DELETE cascade ON UPDATE no action;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_approved_insights_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_knowledge_assets_fk";
    DROP INDEX "payload_locked_documents_rels_approved_insights_id_idx";
    DROP INDEX "payload_locked_documents_rels_knowledge_assets_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "approved_insights_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "knowledge_assets_id";

    DROP INDEX "knowledge_assets_created_at_idx";
    DROP INDEX "knowledge_assets_updated_at_idx";
    DROP INDEX "knowledge_assets_title_idx";
    DROP INDEX "knowledge_assets_review_status_idx";
    DROP INDEX "knowledge_assets_source_insight_record_idx";
    DROP INDEX "knowledge_assets_source_insight_id_idx";
    DROP INDEX "knowledge_assets_source_urls_parent_id_idx";
    DROP INDEX "knowledge_assets_source_urls_order_idx";
    DROP INDEX "knowledge_assets_evidence_urls_parent_id_idx";
    DROP INDEX "knowledge_assets_evidence_urls_order_idx";
    DROP INDEX "knowledge_assets_target_entities_parent_id_idx";
    DROP INDEX "knowledge_assets_target_entities_order_idx";
    DROP INDEX "knowledge_assets_target_queries_parent_id_idx";
    DROP INDEX "knowledge_assets_target_queries_order_idx";
    DROP INDEX "knowledge_assets_claim_ids_parent_id_idx";
    DROP INDEX "knowledge_assets_claim_ids_order_idx";
    DROP TABLE "knowledge_assets_source_urls" CASCADE;
    DROP TABLE "knowledge_assets_evidence_urls" CASCADE;
    DROP TABLE "knowledge_assets_target_entities" CASCADE;
    DROP TABLE "knowledge_assets_target_queries" CASCADE;
    DROP TABLE "knowledge_assets_claim_ids" CASCADE;
    DROP TABLE "knowledge_assets" CASCADE;

    DROP INDEX "approved_insights_created_at_idx";
    DROP INDEX "approved_insights_updated_at_idx";
    DROP INDEX "approved_insights_linked_content_job_id_idx";
    DROP INDEX "approved_insights_freshness_expires_at_idx";
    DROP INDEX "approved_insights_approved_by_idx";
    DROP INDEX "approved_insights_approved_at_idx";
    DROP INDEX "approved_insights_captured_at_idx";
    DROP INDEX "approved_insights_status_idx";
    DROP INDEX "approved_insights_source_type_idx";
    DROP INDEX "approved_insights_source_title_idx";
    DROP INDEX "approved_insights_source_insight_id_idx";
    DROP INDEX "approved_insights_source_urls_parent_id_idx";
    DROP INDEX "approved_insights_source_urls_order_idx";
    DROP INDEX "approved_insights_target_recommendation_queries_parent_id_idx";
    DROP INDEX "approved_insights_target_recommendation_queries_order_idx";
    DROP INDEX "approved_insights_target_queries_parent_id_idx";
    DROP INDEX "approved_insights_target_queries_order_idx";
    DROP INDEX "approved_insights_entity_tags_parent_id_idx";
    DROP INDEX "approved_insights_entity_tags_order_idx";
    DROP INDEX "approved_insights_evidence_urls_parent_id_idx";
    DROP INDEX "approved_insights_evidence_urls_order_idx";
    DROP INDEX "approved_insights_claims_parent_id_idx";
    DROP INDEX "approved_insights_claims_order_idx";
    DROP INDEX "approved_insights_claims_target_entities_parent_id_idx";
    DROP INDEX "approved_insights_claims_target_entities_order_idx";
    DROP INDEX "approved_insights_claims_target_queries_parent_id_idx";
    DROP INDEX "approved_insights_claims_target_queries_order_idx";
    DROP INDEX "approved_insights_claims_evidence_urls_parent_id_idx";
    DROP INDEX "approved_insights_claims_evidence_urls_order_idx";
    DROP TABLE "approved_insights_source_urls" CASCADE;
    DROP TABLE "approved_insights_target_recommendation_queries" CASCADE;
    DROP TABLE "approved_insights_target_queries" CASCADE;
    DROP TABLE "approved_insights_entity_tags" CASCADE;
    DROP TABLE "approved_insights_evidence_urls" CASCADE;
    DROP TABLE "approved_insights_claims" CASCADE;
    DROP TABLE "approved_insights_claims_target_entities" CASCADE;
    DROP TABLE "approved_insights_claims_target_queries" CASCADE;
    DROP TABLE "approved_insights_claims_evidence_urls" CASCADE;
    DROP TABLE "approved_insights" CASCADE;

    DROP TYPE "public"."enum_knowledge_assets_review_status";
    DROP TYPE "public"."enum_approved_insights_status";
    DROP TYPE "public"."enum_approved_insights_source_type";
  `);
}
