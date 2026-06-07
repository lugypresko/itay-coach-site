import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'agent', 'human');
  CREATE TYPE "public"."enum_entities_entity_type" AS ENUM('expert', 'methodology', 'framework', 'audience', 'concept');
  CREATE TYPE "public"."enum_entities_authority_tier" AS ENUM('foundational', 'emerging', 'strong', 'dominant');
  CREATE TYPE "public"."enum_entities_status" AS ENUM('draft', 'active', 'archived');
  CREATE TYPE "public"."enum_entity_relationships_relationship_type" AS ENUM('owns', 'explains', 'supports', 'serves', 'reinforces', 'derived_from', 'mentions', 'recommended_for', 'contrasts_with');
  CREATE TYPE "public"."enum_entity_relationships_status" AS ENUM('proposed', 'approved', 'archived');
  CREATE TYPE "public"."enum_authority_gaps_gap_type" AS ENUM('entity_gap', 'methodology_gap', 'framework_gap', 'evidence_gap', 'schema_gap', 'link_graph_gap', 'freshness_gap', 'third_party_gap', 'intent_gap', 'competitor_gap', 'unknown');
  CREATE TYPE "public"."enum_authority_gaps_lifecycle_status" AS ENUM('open', 'triaged', 'assigned', 'in_progress', 'resolved', 'dismissed');
  CREATE TYPE "public"."enum_authority_gaps_owner_agent" AS ENUM('ResearchAgent', 'IntentClusterAgent', 'OutlineAgent', 'ContentWriterAgent', 'LLMSEOAgent', 'InternalLinkingAgent', 'QualityGateAgent', 'PayloadPublisherAgent', 'SocialDistributionAgent', 'VisibilityMonitorAgent', 'InsightExtractionAgent');
  CREATE TYPE "public"."enum_competitors_status" AS ENUM('active', 'archived');
  CREATE TYPE "public"."enum_query_authority_scores_sentiment" AS ENUM('positive', 'neutral', 'negative');
  CREATE TYPE "public"."enum_query_authority_scores_gap_classification" AS ENUM('entity_gap', 'methodology_gap', 'framework_gap', 'evidence_gap', 'schema_gap', 'link_graph_gap', 'freshness_gap', 'third_party_gap', 'intent_gap', 'competitor_gap', 'unknown');
  CREATE TYPE "public"."enum_query_authority_scores_suggested_owning_agent" AS ENUM('ResearchAgent', 'IntentClusterAgent', 'OutlineAgent', 'ContentWriterAgent', 'LLMSEOAgent', 'InternalLinkingAgent', 'QualityGateAgent', 'PayloadPublisherAgent', 'SocialDistributionAgent', 'VisibilityMonitorAgent', 'InsightExtractionAgent');
  CREATE TYPE "public"."enum_query_authority_scores_authority_tier" AS ENUM('foundational', 'emerging', 'strong', 'dominant');
  CREATE TYPE "public"."enum_query_authority_scores_status" AS ENUM('draft', 'review', 'approved', 'archived');
  CREATE TYPE "public"."enum_insight_extractions_source_type" AS ENUM('voice_memo', 'interview', 'review', 'note', 'approved_quote');
  CREATE TYPE "public"."enum_insight_extractions_status" AS ENUM('draft', 'needs_review', 'approved', 'archived');
  CREATE TYPE "public"."enum_entity_pages_entity_tags_tag" AS ENUM('itay_foyerstein', 'the_push', 'tech_leadership_coach', 'leadership_os_for_tech_leaders', 'invisible_executor', 'trusted_operator', 'strategic_leader', 'engineering_manager', 'tech_lead', 'rd_manager', 'vp_engineering', 'strategic_leadership', 'managing_up', 'leadership_visibility');
  CREATE TYPE "public"."enum_entity_pages_schema_type" AS ENUM('Person', 'Organization', 'Brand', 'Article', 'FAQPage', 'HowTo', 'BreadcrumbList', 'ItemList');
  CREATE TYPE "public"."enum_entity_pages_status" AS ENUM('draft', 'review', 'in_review', 'approved', 'published', 'archived');
  CREATE TYPE "public"."enum_pillar_pages_entity_tags_tag" AS ENUM('itay_foyerstein', 'the_push', 'tech_leadership_coach', 'leadership_os_for_tech_leaders', 'invisible_executor', 'trusted_operator', 'strategic_leader', 'engineering_manager', 'tech_lead', 'rd_manager', 'vp_engineering', 'strategic_leadership', 'managing_up', 'leadership_visibility');
  CREATE TYPE "public"."enum_pillar_pages_schema_type" AS ENUM('Person', 'Organization', 'Brand', 'Article', 'FAQPage', 'HowTo', 'BreadcrumbList', 'ItemList');
  CREATE TYPE "public"."enum_pillar_pages_status" AS ENUM('draft', 'review', 'in_review', 'approved', 'published', 'archived');
  CREATE TYPE "public"."enum_cluster_pages_entity_tags_tag" AS ENUM('itay_foyerstein', 'the_push', 'tech_leadership_coach', 'leadership_os_for_tech_leaders', 'invisible_executor', 'trusted_operator', 'strategic_leader', 'engineering_manager', 'tech_lead', 'rd_manager', 'vp_engineering', 'strategic_leadership', 'managing_up', 'leadership_visibility');
  CREATE TYPE "public"."enum_cluster_pages_schema_type" AS ENUM('Person', 'Organization', 'Brand', 'Article', 'FAQPage', 'HowTo', 'BreadcrumbList', 'ItemList');
  CREATE TYPE "public"."enum_cluster_pages_status" AS ENUM('draft', 'review', 'in_review', 'approved', 'published', 'archived');
  CREATE TYPE "public"."enum_frameworks_entity_tags_tag" AS ENUM('itay_foyerstein', 'the_push', 'tech_leadership_coach', 'leadership_os_for_tech_leaders', 'invisible_executor', 'trusted_operator', 'strategic_leader', 'engineering_manager', 'tech_lead', 'rd_manager', 'vp_engineering', 'strategic_leadership', 'managing_up', 'leadership_visibility');
  CREATE TYPE "public"."enum_frameworks_schema_type" AS ENUM('Person', 'Organization', 'Brand', 'Article', 'FAQPage', 'HowTo', 'BreadcrumbList', 'ItemList');
  CREATE TYPE "public"."enum_frameworks_status" AS ENUM('draft', 'review', 'in_review', 'approved', 'published', 'archived');
  CREATE TYPE "public"."enum_case_studies_entity_tags_tag" AS ENUM('itay_foyerstein', 'the_push', 'tech_leadership_coach', 'leadership_os_for_tech_leaders', 'invisible_executor', 'trusted_operator', 'strategic_leader', 'engineering_manager', 'tech_lead', 'rd_manager', 'vp_engineering', 'strategic_leadership', 'managing_up', 'leadership_visibility');
  CREATE TYPE "public"."enum_case_studies_schema_type" AS ENUM('Person', 'Organization', 'Brand', 'Article', 'FAQPage', 'HowTo', 'BreadcrumbList', 'ItemList');
  CREATE TYPE "public"."enum_case_studies_status" AS ENUM('draft', 'review', 'in_review', 'approved', 'published', 'archived');
  CREATE TYPE "public"."enum_faqs_entity_tags_tag" AS ENUM('itay_foyerstein', 'the_push', 'tech_leadership_coach', 'leadership_os_for_tech_leaders', 'invisible_executor', 'trusted_operator', 'strategic_leader', 'engineering_manager', 'tech_lead', 'rd_manager', 'vp_engineering', 'strategic_leadership', 'managing_up', 'leadership_visibility');
  CREATE TYPE "public"."enum_faqs_schema_type" AS ENUM('Person', 'Organization', 'Brand', 'Article', 'FAQPage', 'HowTo', 'BreadcrumbList', 'ItemList');
  CREATE TYPE "public"."enum_faqs_status" AS ENUM('draft', 'review', 'in_review', 'approved', 'published', 'archived');
  CREATE TYPE "public"."enum_glossary_terms_entity_tags_tag" AS ENUM('itay_foyerstein', 'the_push', 'tech_leadership_coach', 'leadership_os_for_tech_leaders', 'invisible_executor', 'trusted_operator', 'strategic_leader', 'engineering_manager', 'tech_lead', 'rd_manager', 'vp_engineering', 'strategic_leadership', 'managing_up', 'leadership_visibility');
  CREATE TYPE "public"."enum_glossary_terms_schema_type" AS ENUM('Person', 'Organization', 'Brand', 'Article', 'FAQPage', 'HowTo', 'BreadcrumbList', 'ItemList');
  CREATE TYPE "public"."enum_glossary_terms_status" AS ENUM('draft', 'review', 'in_review', 'approved', 'published', 'archived');
  CREATE TYPE "public"."enum_lead_magnets_entity_tags_tag" AS ENUM('itay_foyerstein', 'the_push', 'tech_leadership_coach', 'leadership_os_for_tech_leaders', 'invisible_executor', 'trusted_operator', 'strategic_leader', 'engineering_manager', 'tech_lead', 'rd_manager', 'vp_engineering', 'strategic_leadership', 'managing_up', 'leadership_visibility');
  CREATE TYPE "public"."enum_lead_magnets_schema_type" AS ENUM('Person', 'Organization', 'Brand', 'Article', 'FAQPage', 'HowTo', 'BreadcrumbList', 'ItemList');
  CREATE TYPE "public"."enum_lead_magnets_status" AS ENUM('draft', 'review', 'in_review', 'approved', 'published', 'archived');
  CREATE TYPE "public"."enum_email_subscribers_status" AS ENUM('subscribed', 'unsubscribed', 'pending');
  CREATE TYPE "public"."enum_research_sources_trust_level" AS ENUM('primary', 'high', 'medium', 'low');
  CREATE TYPE "public"."enum_internal_links_review_status" AS ENUM('draft', 'approved', 'rejected');
  CREATE TYPE "public"."enum_content_jobs_target_entity" AS ENUM('itay_foyerstein', 'the_push', 'tech_leadership_coach', 'leadership_os_for_tech_leaders', 'invisible_executor', 'trusted_operator', 'strategic_leader', 'engineering_manager', 'tech_lead', 'rd_manager', 'vp_engineering', 'strategic_leadership', 'managing_up', 'leadership_visibility');
  CREATE TYPE "public"."enum_content_jobs_intent_stage" AS ENUM('awareness', 'consideration', 'decision', 'coach_intent');
  CREATE TYPE "public"."enum_content_jobs_status" AS ENUM('queued', 'running', 'needs_review', 'rejected', 'completed');
  CREATE TYPE "public"."enum_agent_runs_agent_name" AS ENUM('ResearchAgent', 'IntentClusterAgent', 'OutlineAgent', 'ContentWriterAgent', 'LLMSEOAgent', 'InternalLinkingAgent', 'QualityGateAgent', 'PayloadPublisherAgent', 'SocialDistributionAgent', 'VisibilityMonitorAgent');
  CREATE TYPE "public"."enum_agent_runs_status" AS ENUM('started', 'succeeded', 'failed');
  CREATE TYPE "public"."enum_query_authority_scorecards_sentiment" AS ENUM('positive', 'neutral', 'negative');
  CREATE TYPE "public"."enum_query_authority_scorecards_gap_classification" AS ENUM('entity_gap', 'methodology_gap', 'framework_gap', 'evidence_gap', 'schema_gap', 'link_graph_gap', 'freshness_gap', 'third_party_gap', 'intent_gap', 'competitor_gap', 'unknown');
  CREATE TYPE "public"."enum_query_authority_scorecards_suggested_owning_agent" AS ENUM('ResearchAgent', 'IntentClusterAgent', 'OutlineAgent', 'ContentWriterAgent', 'LLMSEOAgent', 'InternalLinkingAgent', 'QualityGateAgent', 'PayloadPublisherAgent', 'SocialDistributionAgent', 'VisibilityMonitorAgent');
  CREATE TYPE "public"."enum_query_authority_scorecards_capture_mode" AS ENUM('manual', 'semi_manual', 'automated');
  CREATE TYPE "public"."enum_query_authority_scorecards_review_status" AS ENUM('draft', 'needs_review', 'ready_for_review', 'approved');
  CREATE TYPE "public"."enum_competitor_contracts_capture_mode" AS ENUM('manual', 'semi_manual', 'automated');
  CREATE TYPE "public"."enum_competitor_contracts_review_status" AS ENUM('draft', 'needs_review', 'ready_for_review', 'approved');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'human' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"caption" varchar,
  	"source_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "entities_target_recommendation_queries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "entities_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "entities_same_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "entities_evidence_urls" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "entities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"entity_type" "enum_entities_entity_type" NOT NULL,
  	"category" varchar NOT NULL,
  	"canonical_role" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"authority_score" numeric DEFAULT 0 NOT NULL,
  	"authority_tier" "enum_entities_authority_tier" DEFAULT 'foundational' NOT NULL,
  	"status" "enum_entities_status" DEFAULT 'draft' NOT NULL,
  	"last_reviewed_at" timestamp(3) with time zone,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "entity_relationships_target_recommendation_queries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "entity_relationships_evidence_urls" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "entity_relationships" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"source_entity_id" integer NOT NULL,
  	"target_entity_id" integer NOT NULL,
  	"relationship_type" "enum_entity_relationships_relationship_type" NOT NULL,
  	"weight" numeric DEFAULT 1 NOT NULL,
  	"rationale" varchar NOT NULL,
  	"status" "enum_entity_relationships_status" DEFAULT 'proposed' NOT NULL,
  	"last_reviewed_at" timestamp(3) with time zone,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "authority_gaps_target_recommendation_queries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "authority_gaps_evidence_urls" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "authority_gaps" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"entity_id" integer NOT NULL,
  	"query_authority_score_id" integer,
  	"competitor_id" integer,
  	"query" varchar NOT NULL,
  	"platform" varchar NOT NULL,
  	"gap_type" "enum_authority_gaps_gap_type" NOT NULL,
  	"lifecycle_status" "enum_authority_gaps_lifecycle_status" DEFAULT 'open' NOT NULL,
  	"severity" numeric DEFAULT 1 NOT NULL,
  	"owner_agent" "enum_authority_gaps_owner_agent" NOT NULL,
  	"description" varchar NOT NULL,
  	"opened_at" timestamp(3) with time zone NOT NULL,
  	"triaged_at" timestamp(3) with time zone,
  	"resolved_at" timestamp(3) with time zone,
  	"resolution_notes" varchar,
  	"last_reviewed_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "competitors_known_strengths" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "competitors_target_queries_where_they_appear" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "competitors_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "competitors_evidence_urls" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "competitors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"website" varchar,
  	"category" varchar,
  	"region" varchar,
  	"positioning" varchar,
  	"status" "enum_competitors_status" DEFAULT 'active' NOT NULL,
  	"last_reviewed_at" timestamp(3) with time zone,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "query_authority_scores_mentioned_entities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "query_authority_scores_competitor_names" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "query_authority_scores_cited_urls" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "query_authority_scores_citations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "query_authority_scores_source_urls" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "query_authority_scores" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"entity_id" integer NOT NULL,
  	"query" varchar NOT NULL,
  	"platform" varchar NOT NULL,
  	"prompt_used" varchar NOT NULL,
  	"raw_answer" varchar NOT NULL,
  	"itay_mentioned" boolean DEFAULT false NOT NULL,
  	"the_push_mentioned" boolean DEFAULT false NOT NULL,
  	"proprietary_framework_mentioned" boolean DEFAULT false NOT NULL,
  	"owned_url_cited" boolean DEFAULT false NOT NULL,
  	"recommendation_level" numeric NOT NULL,
  	"recommendation_position" numeric,
  	"confidence" numeric,
  	"sentiment" "enum_query_authority_scores_sentiment" NOT NULL,
  	"previous_score" numeric NOT NULL,
  	"current_score" numeric NOT NULL,
  	"score_delta" numeric NOT NULL,
  	"gap_classification" "enum_query_authority_scores_gap_classification" NOT NULL,
  	"suggested_owning_agent" "enum_query_authority_scores_suggested_owning_agent" NOT NULL,
  	"authority_tier" "enum_query_authority_scores_authority_tier" DEFAULT 'foundational' NOT NULL,
  	"status" "enum_query_authority_scores_status" DEFAULT 'draft' NOT NULL,
  	"checked_at" timestamp(3) with time zone NOT NULL,
  	"recorded_at" timestamp(3) with time zone NOT NULL,
  	"recorded_by" varchar,
  	"source_count" numeric NOT NULL,
  	"reviewer_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "insight_extractions_claims_evidence_urls" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "insight_extractions_claims_target_recommendation_queries" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "insight_extractions_claims_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "insight_extractions_claims" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "insight_extractions_evidence_urls" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "insight_extractions_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "insight_extractions_target_recommendation_queries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "insight_extractions_source_urls" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "insight_extractions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"source_title" varchar NOT NULL,
  	"source_type" "enum_insight_extractions_source_type" NOT NULL,
  	"status" "enum_insight_extractions_status" DEFAULT 'draft' NOT NULL,
  	"captured_at" timestamp(3) with time zone NOT NULL,
  	"approved_at" timestamp(3) with time zone,
  	"summary" varchar NOT NULL,
  	"raw_text" varchar,
  	"approved_by" varchar,
  	"authority_purpose" varchar,
  	"linked_content_job_id" varchar,
  	"reviewer_notes" varchar,
  	"last_reviewed_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "entity_pages_target_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "entity_pages_target_recommendation_queries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "entity_pages_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" "enum_entity_pages_entity_tags_tag" NOT NULL
  );
  
  CREATE TABLE "entity_pages_faq_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "entity_pages_faq_target_recommendation_queries" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "entity_pages_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "entity_pages_internal_links_source_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "entity_pages_internal_links_target_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "entity_pages_internal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"target_slug" varchar NOT NULL,
  	"anchor_text" varchar NOT NULL,
  	"reason" varchar NOT NULL
  );
  
  CREATE TABLE "entity_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"excerpt" varchar NOT NULL,
  	"content" varchar NOT NULL,
  	"ai_summary" varchar NOT NULL,
  	"citation_snippet" varchar NOT NULL,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"schema_type" "enum_entity_pages_schema_type" DEFAULT 'Person' NOT NULL,
  	"status" "enum_entity_pages_status" DEFAULT 'draft' NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"last_reviewed_at" timestamp(3) with time zone,
  	"author" varchar DEFAULT 'Itay Foyerstein' NOT NULL,
  	"featured_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pillar_pages_target_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "pillar_pages_target_recommendation_queries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "pillar_pages_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" "enum_pillar_pages_entity_tags_tag" NOT NULL
  );
  
  CREATE TABLE "pillar_pages_faq_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "pillar_pages_faq_target_recommendation_queries" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "pillar_pages_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "pillar_pages_internal_links_source_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "pillar_pages_internal_links_target_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "pillar_pages_internal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"target_slug" varchar NOT NULL,
  	"anchor_text" varchar NOT NULL,
  	"reason" varchar NOT NULL
  );
  
  CREATE TABLE "pillar_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"excerpt" varchar NOT NULL,
  	"content" varchar NOT NULL,
  	"ai_summary" varchar NOT NULL,
  	"citation_snippet" varchar NOT NULL,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"schema_type" "enum_pillar_pages_schema_type" DEFAULT 'Article' NOT NULL,
  	"status" "enum_pillar_pages_status" DEFAULT 'draft' NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"last_reviewed_at" timestamp(3) with time zone,
  	"author" varchar DEFAULT 'Itay Foyerstein' NOT NULL,
  	"featured_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cluster_pages_target_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "cluster_pages_target_recommendation_queries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "cluster_pages_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" "enum_cluster_pages_entity_tags_tag" NOT NULL
  );
  
  CREATE TABLE "cluster_pages_faq_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "cluster_pages_faq_target_recommendation_queries" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "cluster_pages_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "cluster_pages_internal_links_source_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "cluster_pages_internal_links_target_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "cluster_pages_internal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"target_slug" varchar NOT NULL,
  	"anchor_text" varchar NOT NULL,
  	"reason" varchar NOT NULL
  );
  
  CREATE TABLE "cluster_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"excerpt" varchar NOT NULL,
  	"content" varchar NOT NULL,
  	"ai_summary" varchar NOT NULL,
  	"citation_snippet" varchar NOT NULL,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"schema_type" "enum_cluster_pages_schema_type" DEFAULT 'Article' NOT NULL,
  	"status" "enum_cluster_pages_status" DEFAULT 'draft' NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"last_reviewed_at" timestamp(3) with time zone,
  	"author" varchar DEFAULT 'Itay Foyerstein' NOT NULL,
  	"featured_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "frameworks_target_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "frameworks_target_recommendation_queries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "frameworks_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" "enum_frameworks_entity_tags_tag" NOT NULL
  );
  
  CREATE TABLE "frameworks_faq_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "frameworks_faq_target_recommendation_queries" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "frameworks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "frameworks_internal_links_source_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "frameworks_internal_links_target_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "frameworks_internal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"target_slug" varchar NOT NULL,
  	"anchor_text" varchar NOT NULL,
  	"reason" varchar NOT NULL
  );
  
  CREATE TABLE "frameworks" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"excerpt" varchar NOT NULL,
  	"content" varchar NOT NULL,
  	"ai_summary" varchar NOT NULL,
  	"citation_snippet" varchar NOT NULL,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"schema_type" "enum_frameworks_schema_type" DEFAULT 'HowTo' NOT NULL,
  	"status" "enum_frameworks_status" DEFAULT 'draft' NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"last_reviewed_at" timestamp(3) with time zone,
  	"author" varchar DEFAULT 'Itay Foyerstein' NOT NULL,
  	"featured_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "case_studies_target_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "case_studies_target_recommendation_queries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "case_studies_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" "enum_case_studies_entity_tags_tag" NOT NULL
  );
  
  CREATE TABLE "case_studies_faq_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "case_studies_faq_target_recommendation_queries" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "case_studies_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "case_studies_internal_links_source_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "case_studies_internal_links_target_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "case_studies_internal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"target_slug" varchar NOT NULL,
  	"anchor_text" varchar NOT NULL,
  	"reason" varchar NOT NULL
  );
  
  CREATE TABLE "case_studies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"excerpt" varchar NOT NULL,
  	"content" varchar NOT NULL,
  	"ai_summary" varchar NOT NULL,
  	"citation_snippet" varchar NOT NULL,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"schema_type" "enum_case_studies_schema_type" DEFAULT 'Article' NOT NULL,
  	"status" "enum_case_studies_status" DEFAULT 'draft' NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"last_reviewed_at" timestamp(3) with time zone,
  	"author" varchar DEFAULT 'Itay Foyerstein' NOT NULL,
  	"featured_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs_target_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "faqs_target_recommendation_queries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "faqs_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" "enum_faqs_entity_tags_tag" NOT NULL
  );
  
  CREATE TABLE "faqs_faq_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "faqs_faq_target_recommendation_queries" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "faqs_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "faqs_internal_links_source_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "faqs_internal_links_target_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "faqs_internal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"target_slug" varchar NOT NULL,
  	"anchor_text" varchar NOT NULL,
  	"reason" varchar NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"excerpt" varchar NOT NULL,
  	"content" varchar NOT NULL,
  	"ai_summary" varchar NOT NULL,
  	"citation_snippet" varchar NOT NULL,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"schema_type" "enum_faqs_schema_type" DEFAULT 'FAQPage' NOT NULL,
  	"status" "enum_faqs_status" DEFAULT 'draft' NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"last_reviewed_at" timestamp(3) with time zone,
  	"author" varchar DEFAULT 'Itay Foyerstein' NOT NULL,
  	"featured_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "glossary_terms_target_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "glossary_terms_target_recommendation_queries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "glossary_terms_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" "enum_glossary_terms_entity_tags_tag" NOT NULL
  );
  
  CREATE TABLE "glossary_terms_faq_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "glossary_terms_faq_target_recommendation_queries" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "glossary_terms_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "glossary_terms_internal_links_source_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "glossary_terms_internal_links_target_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "glossary_terms_internal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"target_slug" varchar NOT NULL,
  	"anchor_text" varchar NOT NULL,
  	"reason" varchar NOT NULL
  );
  
  CREATE TABLE "glossary_terms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"excerpt" varchar NOT NULL,
  	"content" varchar NOT NULL,
  	"ai_summary" varchar NOT NULL,
  	"citation_snippet" varchar NOT NULL,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"schema_type" "enum_glossary_terms_schema_type" DEFAULT 'Article' NOT NULL,
  	"status" "enum_glossary_terms_status" DEFAULT 'draft' NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"last_reviewed_at" timestamp(3) with time zone,
  	"author" varchar DEFAULT 'Itay Foyerstein' NOT NULL,
  	"featured_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lead_magnets_target_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "lead_magnets_target_recommendation_queries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "lead_magnets_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" "enum_lead_magnets_entity_tags_tag" NOT NULL
  );
  
  CREATE TABLE "lead_magnets_faq_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "lead_magnets_faq_target_recommendation_queries" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "lead_magnets_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "lead_magnets_internal_links_source_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "lead_magnets_internal_links_target_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "lead_magnets_internal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"target_slug" varchar NOT NULL,
  	"anchor_text" varchar NOT NULL,
  	"reason" varchar NOT NULL
  );
  
  CREATE TABLE "lead_magnets" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"excerpt" varchar NOT NULL,
  	"content" varchar NOT NULL,
  	"ai_summary" varchar NOT NULL,
  	"citation_snippet" varchar NOT NULL,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"schema_type" "enum_lead_magnets_schema_type" DEFAULT 'Article' NOT NULL,
  	"status" "enum_lead_magnets_status" DEFAULT 'draft' NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"last_reviewed_at" timestamp(3) with time zone,
  	"author" varchar DEFAULT 'Itay Foyerstein' NOT NULL,
  	"featured_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "email_subscribers_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "email_subscribers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"name" varchar,
  	"status" "enum_email_subscribers_status" DEFAULT 'subscribed' NOT NULL,
  	"source" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "research_sources_supported_claims" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "research_sources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"publisher" varchar,
  	"author" varchar,
  	"published_at" timestamp(3) with time zone,
  	"accessed_at" timestamp(3) with time zone NOT NULL,
  	"summary" varchar NOT NULL,
  	"trust_level" "enum_research_sources_trust_level" DEFAULT 'high' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "internal_links_source_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "internal_links_target_entity_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "internal_links" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"target_slug" varchar NOT NULL,
  	"anchor_text" varchar NOT NULL,
  	"reason" varchar NOT NULL,
  	"source_slug" varchar NOT NULL,
  	"review_status" "enum_internal_links_review_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "content_jobs_target_recommendation_queries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "content_jobs_source_insight_ids" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "content_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"goal" varchar NOT NULL,
  	"target_entity" "enum_content_jobs_target_entity" NOT NULL,
  	"intent_stage" "enum_content_jobs_intent_stage" NOT NULL,
  	"status" "enum_content_jobs_status" DEFAULT 'queued' NOT NULL,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "agent_runs_errors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "agent_runs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"content_job_id" varchar NOT NULL,
  	"agent_name" "enum_agent_runs_agent_name" NOT NULL,
  	"input" varchar NOT NULL,
  	"output" varchar NOT NULL,
  	"status" "enum_agent_runs_status" NOT NULL,
  	"started_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "query_authority_scorecards_mentioned_entities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "query_authority_scorecards_cited_urls" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "query_authority_scorecards_citations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "query_authority_scorecards_competitors_recommended" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "query_authority_scorecards_source_urls" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "query_authority_scorecards" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"collection_key" varchar NOT NULL,
  	"record_type" varchar NOT NULL,
  	"query" varchar NOT NULL,
  	"platform" varchar NOT NULL,
  	"prompt" varchar NOT NULL,
  	"raw_answer" varchar NOT NULL,
  	"itay_mentioned" boolean DEFAULT false NOT NULL,
  	"the_push_mentioned" boolean DEFAULT false NOT NULL,
  	"proprietary_framework_mentioned" boolean DEFAULT false NOT NULL,
  	"owned_url_cited" boolean DEFAULT false NOT NULL,
  	"recommendation_level" numeric NOT NULL,
  	"recommendation_position" numeric,
  	"confidence" numeric,
  	"sentiment" "enum_query_authority_scorecards_sentiment" NOT NULL,
  	"reviewer_notes" varchar,
  	"checked_at" timestamp(3) with time zone NOT NULL,
  	"previous_score" numeric NOT NULL,
  	"current_score" numeric NOT NULL,
  	"score_delta" numeric NOT NULL,
  	"gap_classification" "enum_query_authority_scorecards_gap_classification" NOT NULL,
  	"suggested_owning_agent" "enum_query_authority_scorecards_suggested_owning_agent" NOT NULL,
  	"capture_mode" "enum_query_authority_scorecards_capture_mode" NOT NULL,
  	"review_status" "enum_query_authority_scorecards_review_status" NOT NULL,
  	"recorded_at" timestamp(3) with time zone NOT NULL,
  	"recorded_by" varchar,
  	"source_count" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "competitor_contracts_known_strengths" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "competitor_contracts_target_queries_where_they_appear" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "competitor_contracts_source_urls" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "competitor_contracts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"collection_key" varchar NOT NULL,
  	"record_type" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"website" varchar,
  	"category" varchar,
  	"region" varchar,
  	"positioning" varchar,
  	"capture_mode" "enum_competitor_contracts_capture_mode" NOT NULL,
  	"review_status" "enum_competitor_contracts_review_status" NOT NULL,
  	"recorded_at" timestamp(3) with time zone NOT NULL,
  	"recorded_by" varchar,
  	"source_count" numeric NOT NULL,
  	"reviewer_notes" varchar,
  	"last_reviewed_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"entities_id" integer,
  	"entity_relationships_id" integer,
  	"authority_gaps_id" integer,
  	"competitors_id" integer,
  	"query_authority_scores_id" integer,
  	"insight_extractions_id" integer,
  	"entity_pages_id" integer,
  	"pillar_pages_id" integer,
  	"cluster_pages_id" integer,
  	"frameworks_id" integer,
  	"case_studies_id" integer,
  	"faqs_id" integer,
  	"glossary_terms_id" integer,
  	"lead_magnets_id" integer,
  	"email_subscribers_id" integer,
  	"research_sources_id" integer,
  	"internal_links_id" integer,
  	"content_jobs_id" integer,
  	"agent_runs_id" integer,
  	"query_authority_scorecards_id" integer,
  	"competitor_contracts_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "entities_target_recommendation_queries" ADD CONSTRAINT "entities_target_recommendation_queries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "entities_entity_tags" ADD CONSTRAINT "entities_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "entities_same_as" ADD CONSTRAINT "entities_same_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "entities_evidence_urls" ADD CONSTRAINT "entities_evidence_urls_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "entity_relationships_target_recommendation_queries" ADD CONSTRAINT "entity_relationships_target_recommendation_queries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."entity_relationships"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "entity_relationships_evidence_urls" ADD CONSTRAINT "entity_relationships_evidence_urls_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."entity_relationships"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "entity_relationships" ADD CONSTRAINT "entity_relationships_source_entity_id_entities_id_fk" FOREIGN KEY ("source_entity_id") REFERENCES "public"."entities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "entity_relationships" ADD CONSTRAINT "entity_relationships_target_entity_id_entities_id_fk" FOREIGN KEY ("target_entity_id") REFERENCES "public"."entities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "authority_gaps_target_recommendation_queries" ADD CONSTRAINT "authority_gaps_target_recommendation_queries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."authority_gaps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "authority_gaps_evidence_urls" ADD CONSTRAINT "authority_gaps_evidence_urls_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."authority_gaps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "authority_gaps" ADD CONSTRAINT "authority_gaps_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "authority_gaps" ADD CONSTRAINT "authority_gaps_query_authority_score_id_query_authority_scores_id_fk" FOREIGN KEY ("query_authority_score_id") REFERENCES "public"."query_authority_scores"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "authority_gaps" ADD CONSTRAINT "authority_gaps_competitor_id_competitors_id_fk" FOREIGN KEY ("competitor_id") REFERENCES "public"."competitors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "competitors_known_strengths" ADD CONSTRAINT "competitors_known_strengths_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."competitors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "competitors_target_queries_where_they_appear" ADD CONSTRAINT "competitors_target_queries_where_they_appear_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."competitors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "competitors_entity_tags" ADD CONSTRAINT "competitors_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."competitors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "competitors_evidence_urls" ADD CONSTRAINT "competitors_evidence_urls_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."competitors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "query_authority_scores_mentioned_entities" ADD CONSTRAINT "query_authority_scores_mentioned_entities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."query_authority_scores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "query_authority_scores_competitor_names" ADD CONSTRAINT "query_authority_scores_competitor_names_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."query_authority_scores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "query_authority_scores_cited_urls" ADD CONSTRAINT "query_authority_scores_cited_urls_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."query_authority_scores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "query_authority_scores_citations" ADD CONSTRAINT "query_authority_scores_citations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."query_authority_scores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "query_authority_scores_source_urls" ADD CONSTRAINT "query_authority_scores_source_urls_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."query_authority_scores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "query_authority_scores" ADD CONSTRAINT "query_authority_scores_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "insight_extractions_claims_evidence_urls" ADD CONSTRAINT "insight_extractions_claims_evidence_urls_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."insight_extractions_claims"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "insight_extractions_claims_target_recommendation_queries" ADD CONSTRAINT "insight_extractions_claims_target_recommendation_queries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."insight_extractions_claims"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "insight_extractions_claims_entity_tags" ADD CONSTRAINT "insight_extractions_claims_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."insight_extractions_claims"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "insight_extractions_claims" ADD CONSTRAINT "insight_extractions_claims_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."insight_extractions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "insight_extractions_evidence_urls" ADD CONSTRAINT "insight_extractions_evidence_urls_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."insight_extractions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "insight_extractions_entity_tags" ADD CONSTRAINT "insight_extractions_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."insight_extractions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "insight_extractions_target_recommendation_queries" ADD CONSTRAINT "insight_extractions_target_recommendation_queries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."insight_extractions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "insight_extractions_source_urls" ADD CONSTRAINT "insight_extractions_source_urls_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."insight_extractions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "entity_pages_target_questions" ADD CONSTRAINT "entity_pages_target_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."entity_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "entity_pages_target_recommendation_queries" ADD CONSTRAINT "entity_pages_target_recommendation_queries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."entity_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "entity_pages_entity_tags" ADD CONSTRAINT "entity_pages_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."entity_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "entity_pages_faq_entity_tags" ADD CONSTRAINT "entity_pages_faq_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."entity_pages_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "entity_pages_faq_target_recommendation_queries" ADD CONSTRAINT "entity_pages_faq_target_recommendation_queries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."entity_pages_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "entity_pages_faq" ADD CONSTRAINT "entity_pages_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."entity_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "entity_pages_internal_links_source_entity_tags" ADD CONSTRAINT "entity_pages_internal_links_source_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."entity_pages_internal_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "entity_pages_internal_links_target_entity_tags" ADD CONSTRAINT "entity_pages_internal_links_target_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."entity_pages_internal_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "entity_pages_internal_links" ADD CONSTRAINT "entity_pages_internal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."entity_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "entity_pages" ADD CONSTRAINT "entity_pages_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pillar_pages_target_questions" ADD CONSTRAINT "pillar_pages_target_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pillar_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pillar_pages_target_recommendation_queries" ADD CONSTRAINT "pillar_pages_target_recommendation_queries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pillar_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pillar_pages_entity_tags" ADD CONSTRAINT "pillar_pages_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pillar_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pillar_pages_faq_entity_tags" ADD CONSTRAINT "pillar_pages_faq_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pillar_pages_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pillar_pages_faq_target_recommendation_queries" ADD CONSTRAINT "pillar_pages_faq_target_recommendation_queries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pillar_pages_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pillar_pages_faq" ADD CONSTRAINT "pillar_pages_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pillar_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pillar_pages_internal_links_source_entity_tags" ADD CONSTRAINT "pillar_pages_internal_links_source_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pillar_pages_internal_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pillar_pages_internal_links_target_entity_tags" ADD CONSTRAINT "pillar_pages_internal_links_target_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pillar_pages_internal_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pillar_pages_internal_links" ADD CONSTRAINT "pillar_pages_internal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pillar_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pillar_pages" ADD CONSTRAINT "pillar_pages_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cluster_pages_target_questions" ADD CONSTRAINT "cluster_pages_target_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cluster_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cluster_pages_target_recommendation_queries" ADD CONSTRAINT "cluster_pages_target_recommendation_queries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cluster_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cluster_pages_entity_tags" ADD CONSTRAINT "cluster_pages_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cluster_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cluster_pages_faq_entity_tags" ADD CONSTRAINT "cluster_pages_faq_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cluster_pages_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cluster_pages_faq_target_recommendation_queries" ADD CONSTRAINT "cluster_pages_faq_target_recommendation_queries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cluster_pages_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cluster_pages_faq" ADD CONSTRAINT "cluster_pages_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cluster_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cluster_pages_internal_links_source_entity_tags" ADD CONSTRAINT "cluster_pages_internal_links_source_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cluster_pages_internal_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cluster_pages_internal_links_target_entity_tags" ADD CONSTRAINT "cluster_pages_internal_links_target_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cluster_pages_internal_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cluster_pages_internal_links" ADD CONSTRAINT "cluster_pages_internal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cluster_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cluster_pages" ADD CONSTRAINT "cluster_pages_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "frameworks_target_questions" ADD CONSTRAINT "frameworks_target_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."frameworks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "frameworks_target_recommendation_queries" ADD CONSTRAINT "frameworks_target_recommendation_queries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."frameworks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "frameworks_entity_tags" ADD CONSTRAINT "frameworks_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."frameworks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "frameworks_faq_entity_tags" ADD CONSTRAINT "frameworks_faq_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."frameworks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "frameworks_faq_target_recommendation_queries" ADD CONSTRAINT "frameworks_faq_target_recommendation_queries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."frameworks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "frameworks_faq" ADD CONSTRAINT "frameworks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."frameworks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "frameworks_internal_links_source_entity_tags" ADD CONSTRAINT "frameworks_internal_links_source_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."frameworks_internal_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "frameworks_internal_links_target_entity_tags" ADD CONSTRAINT "frameworks_internal_links_target_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."frameworks_internal_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "frameworks_internal_links" ADD CONSTRAINT "frameworks_internal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."frameworks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "frameworks" ADD CONSTRAINT "frameworks_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_target_questions" ADD CONSTRAINT "case_studies_target_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_target_recommendation_queries" ADD CONSTRAINT "case_studies_target_recommendation_queries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_entity_tags" ADD CONSTRAINT "case_studies_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_faq_entity_tags" ADD CONSTRAINT "case_studies_faq_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_faq_target_recommendation_queries" ADD CONSTRAINT "case_studies_faq_target_recommendation_queries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_faq" ADD CONSTRAINT "case_studies_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_internal_links_source_entity_tags" ADD CONSTRAINT "case_studies_internal_links_source_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_internal_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_internal_links_target_entity_tags" ADD CONSTRAINT "case_studies_internal_links_target_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_internal_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_internal_links" ADD CONSTRAINT "case_studies_internal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faqs_target_questions" ADD CONSTRAINT "faqs_target_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_target_recommendation_queries" ADD CONSTRAINT "faqs_target_recommendation_queries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_entity_tags" ADD CONSTRAINT "faqs_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_faq_entity_tags" ADD CONSTRAINT "faqs_faq_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_faq_target_recommendation_queries" ADD CONSTRAINT "faqs_faq_target_recommendation_queries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_faq" ADD CONSTRAINT "faqs_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_internal_links_source_entity_tags" ADD CONSTRAINT "faqs_internal_links_source_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs_internal_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_internal_links_target_entity_tags" ADD CONSTRAINT "faqs_internal_links_target_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs_internal_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_internal_links" ADD CONSTRAINT "faqs_internal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs" ADD CONSTRAINT "faqs_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "glossary_terms_target_questions" ADD CONSTRAINT "glossary_terms_target_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."glossary_terms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "glossary_terms_target_recommendation_queries" ADD CONSTRAINT "glossary_terms_target_recommendation_queries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."glossary_terms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "glossary_terms_entity_tags" ADD CONSTRAINT "glossary_terms_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."glossary_terms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "glossary_terms_faq_entity_tags" ADD CONSTRAINT "glossary_terms_faq_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."glossary_terms_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "glossary_terms_faq_target_recommendation_queries" ADD CONSTRAINT "glossary_terms_faq_target_recommendation_queries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."glossary_terms_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "glossary_terms_faq" ADD CONSTRAINT "glossary_terms_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."glossary_terms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "glossary_terms_internal_links_source_entity_tags" ADD CONSTRAINT "glossary_terms_internal_links_source_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."glossary_terms_internal_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "glossary_terms_internal_links_target_entity_tags" ADD CONSTRAINT "glossary_terms_internal_links_target_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."glossary_terms_internal_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "glossary_terms_internal_links" ADD CONSTRAINT "glossary_terms_internal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."glossary_terms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "glossary_terms" ADD CONSTRAINT "glossary_terms_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lead_magnets_target_questions" ADD CONSTRAINT "lead_magnets_target_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lead_magnets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lead_magnets_target_recommendation_queries" ADD CONSTRAINT "lead_magnets_target_recommendation_queries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lead_magnets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lead_magnets_entity_tags" ADD CONSTRAINT "lead_magnets_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lead_magnets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lead_magnets_faq_entity_tags" ADD CONSTRAINT "lead_magnets_faq_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lead_magnets_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lead_magnets_faq_target_recommendation_queries" ADD CONSTRAINT "lead_magnets_faq_target_recommendation_queries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lead_magnets_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lead_magnets_faq" ADD CONSTRAINT "lead_magnets_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lead_magnets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lead_magnets_internal_links_source_entity_tags" ADD CONSTRAINT "lead_magnets_internal_links_source_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lead_magnets_internal_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lead_magnets_internal_links_target_entity_tags" ADD CONSTRAINT "lead_magnets_internal_links_target_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lead_magnets_internal_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lead_magnets_internal_links" ADD CONSTRAINT "lead_magnets_internal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lead_magnets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lead_magnets" ADD CONSTRAINT "lead_magnets_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "email_subscribers_tags" ADD CONSTRAINT "email_subscribers_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."email_subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "research_sources_supported_claims" ADD CONSTRAINT "research_sources_supported_claims_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."research_sources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "internal_links_source_entity_tags" ADD CONSTRAINT "internal_links_source_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."internal_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "internal_links_target_entity_tags" ADD CONSTRAINT "internal_links_target_entity_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."internal_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_jobs_target_recommendation_queries" ADD CONSTRAINT "content_jobs_target_recommendation_queries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_jobs_source_insight_ids" ADD CONSTRAINT "content_jobs_source_insight_ids_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "agent_runs_errors" ADD CONSTRAINT "agent_runs_errors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."agent_runs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "query_authority_scorecards_mentioned_entities" ADD CONSTRAINT "query_authority_scorecards_mentioned_entities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."query_authority_scorecards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "query_authority_scorecards_cited_urls" ADD CONSTRAINT "query_authority_scorecards_cited_urls_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."query_authority_scorecards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "query_authority_scorecards_citations" ADD CONSTRAINT "query_authority_scorecards_citations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."query_authority_scorecards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "query_authority_scorecards_competitors_recommended" ADD CONSTRAINT "query_authority_scorecards_competitors_recommended_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."query_authority_scorecards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "query_authority_scorecards_source_urls" ADD CONSTRAINT "query_authority_scorecards_source_urls_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."query_authority_scorecards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "competitor_contracts_known_strengths" ADD CONSTRAINT "competitor_contracts_known_strengths_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."competitor_contracts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "competitor_contracts_target_queries_where_they_appear" ADD CONSTRAINT "competitor_contracts_target_queries_where_they_appear_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."competitor_contracts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "competitor_contracts_source_urls" ADD CONSTRAINT "competitor_contracts_source_urls_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."competitor_contracts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_entities_fk" FOREIGN KEY ("entities_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_entity_relationships_fk" FOREIGN KEY ("entity_relationships_id") REFERENCES "public"."entity_relationships"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_authority_gaps_fk" FOREIGN KEY ("authority_gaps_id") REFERENCES "public"."authority_gaps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_competitors_fk" FOREIGN KEY ("competitors_id") REFERENCES "public"."competitors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_query_authority_scores_fk" FOREIGN KEY ("query_authority_scores_id") REFERENCES "public"."query_authority_scores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_insight_extractions_fk" FOREIGN KEY ("insight_extractions_id") REFERENCES "public"."insight_extractions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_entity_pages_fk" FOREIGN KEY ("entity_pages_id") REFERENCES "public"."entity_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pillar_pages_fk" FOREIGN KEY ("pillar_pages_id") REFERENCES "public"."pillar_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cluster_pages_fk" FOREIGN KEY ("cluster_pages_id") REFERENCES "public"."cluster_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_frameworks_fk" FOREIGN KEY ("frameworks_id") REFERENCES "public"."frameworks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_glossary_terms_fk" FOREIGN KEY ("glossary_terms_id") REFERENCES "public"."glossary_terms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lead_magnets_fk" FOREIGN KEY ("lead_magnets_id") REFERENCES "public"."lead_magnets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_email_subscribers_fk" FOREIGN KEY ("email_subscribers_id") REFERENCES "public"."email_subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_research_sources_fk" FOREIGN KEY ("research_sources_id") REFERENCES "public"."research_sources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_internal_links_fk" FOREIGN KEY ("internal_links_id") REFERENCES "public"."internal_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_content_jobs_fk" FOREIGN KEY ("content_jobs_id") REFERENCES "public"."content_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_agent_runs_fk" FOREIGN KEY ("agent_runs_id") REFERENCES "public"."agent_runs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_query_authority_scorecards_fk" FOREIGN KEY ("query_authority_scorecards_id") REFERENCES "public"."query_authority_scorecards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_competitor_contracts_fk" FOREIGN KEY ("competitor_contracts_id") REFERENCES "public"."competitor_contracts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_role_idx" ON "users" USING btree ("role");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "entities_target_recommendation_queries_order_idx" ON "entities_target_recommendation_queries" USING btree ("_order");
  CREATE INDEX "entities_target_recommendation_queries_parent_id_idx" ON "entities_target_recommendation_queries" USING btree ("_parent_id");
  CREATE INDEX "entities_entity_tags_order_idx" ON "entities_entity_tags" USING btree ("_order");
  CREATE INDEX "entities_entity_tags_parent_id_idx" ON "entities_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "entities_same_as_order_idx" ON "entities_same_as" USING btree ("_order");
  CREATE INDEX "entities_same_as_parent_id_idx" ON "entities_same_as" USING btree ("_parent_id");
  CREATE INDEX "entities_evidence_urls_order_idx" ON "entities_evidence_urls" USING btree ("_order");
  CREATE INDEX "entities_evidence_urls_parent_id_idx" ON "entities_evidence_urls" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "entities_name_idx" ON "entities" USING btree ("name");
  CREATE UNIQUE INDEX "entities_slug_idx" ON "entities" USING btree ("slug");
  CREATE INDEX "entities_entity_type_idx" ON "entities" USING btree ("entity_type");
  CREATE INDEX "entities_category_idx" ON "entities" USING btree ("category");
  CREATE INDEX "entities_authority_score_idx" ON "entities" USING btree ("authority_score");
  CREATE INDEX "entities_authority_tier_idx" ON "entities" USING btree ("authority_tier");
  CREATE INDEX "entities_status_idx" ON "entities" USING btree ("status");
  CREATE INDEX "entities_last_reviewed_at_idx" ON "entities" USING btree ("last_reviewed_at");
  CREATE INDEX "entities_updated_at_idx" ON "entities" USING btree ("updated_at");
  CREATE INDEX "entities_created_at_idx" ON "entities" USING btree ("created_at");
  CREATE INDEX "entity_relationships_target_recommendation_queries_order_idx" ON "entity_relationships_target_recommendation_queries" USING btree ("_order");
  CREATE INDEX "entity_relationships_target_recommendation_queries_parent_id_idx" ON "entity_relationships_target_recommendation_queries" USING btree ("_parent_id");
  CREATE INDEX "entity_relationships_evidence_urls_order_idx" ON "entity_relationships_evidence_urls" USING btree ("_order");
  CREATE INDEX "entity_relationships_evidence_urls_parent_id_idx" ON "entity_relationships_evidence_urls" USING btree ("_parent_id");
  CREATE INDEX "entity_relationships_source_entity_idx" ON "entity_relationships" USING btree ("source_entity_id");
  CREATE INDEX "entity_relationships_target_entity_idx" ON "entity_relationships" USING btree ("target_entity_id");
  CREATE INDEX "entity_relationships_relationship_type_idx" ON "entity_relationships" USING btree ("relationship_type");
  CREATE INDEX "entity_relationships_weight_idx" ON "entity_relationships" USING btree ("weight");
  CREATE INDEX "entity_relationships_status_idx" ON "entity_relationships" USING btree ("status");
  CREATE INDEX "entity_relationships_last_reviewed_at_idx" ON "entity_relationships" USING btree ("last_reviewed_at");
  CREATE INDEX "entity_relationships_updated_at_idx" ON "entity_relationships" USING btree ("updated_at");
  CREATE INDEX "entity_relationships_created_at_idx" ON "entity_relationships" USING btree ("created_at");
  CREATE INDEX "authority_gaps_target_recommendation_queries_order_idx" ON "authority_gaps_target_recommendation_queries" USING btree ("_order");
  CREATE INDEX "authority_gaps_target_recommendation_queries_parent_id_idx" ON "authority_gaps_target_recommendation_queries" USING btree ("_parent_id");
  CREATE INDEX "authority_gaps_evidence_urls_order_idx" ON "authority_gaps_evidence_urls" USING btree ("_order");
  CREATE INDEX "authority_gaps_evidence_urls_parent_id_idx" ON "authority_gaps_evidence_urls" USING btree ("_parent_id");
  CREATE INDEX "authority_gaps_entity_idx" ON "authority_gaps" USING btree ("entity_id");
  CREATE INDEX "authority_gaps_query_authority_score_idx" ON "authority_gaps" USING btree ("query_authority_score_id");
  CREATE INDEX "authority_gaps_competitor_idx" ON "authority_gaps" USING btree ("competitor_id");
  CREATE INDEX "authority_gaps_query_idx" ON "authority_gaps" USING btree ("query");
  CREATE INDEX "authority_gaps_platform_idx" ON "authority_gaps" USING btree ("platform");
  CREATE INDEX "authority_gaps_gap_type_idx" ON "authority_gaps" USING btree ("gap_type");
  CREATE INDEX "authority_gaps_lifecycle_status_idx" ON "authority_gaps" USING btree ("lifecycle_status");
  CREATE INDEX "authority_gaps_severity_idx" ON "authority_gaps" USING btree ("severity");
  CREATE INDEX "authority_gaps_owner_agent_idx" ON "authority_gaps" USING btree ("owner_agent");
  CREATE INDEX "authority_gaps_opened_at_idx" ON "authority_gaps" USING btree ("opened_at");
  CREATE INDEX "authority_gaps_triaged_at_idx" ON "authority_gaps" USING btree ("triaged_at");
  CREATE INDEX "authority_gaps_resolved_at_idx" ON "authority_gaps" USING btree ("resolved_at");
  CREATE INDEX "authority_gaps_last_reviewed_at_idx" ON "authority_gaps" USING btree ("last_reviewed_at");
  CREATE INDEX "authority_gaps_updated_at_idx" ON "authority_gaps" USING btree ("updated_at");
  CREATE INDEX "authority_gaps_created_at_idx" ON "authority_gaps" USING btree ("created_at");
  CREATE INDEX "competitors_known_strengths_order_idx" ON "competitors_known_strengths" USING btree ("_order");
  CREATE INDEX "competitors_known_strengths_parent_id_idx" ON "competitors_known_strengths" USING btree ("_parent_id");
  CREATE INDEX "competitors_target_queries_where_they_appear_order_idx" ON "competitors_target_queries_where_they_appear" USING btree ("_order");
  CREATE INDEX "competitors_target_queries_where_they_appear_parent_id_idx" ON "competitors_target_queries_where_they_appear" USING btree ("_parent_id");
  CREATE INDEX "competitors_entity_tags_order_idx" ON "competitors_entity_tags" USING btree ("_order");
  CREATE INDEX "competitors_entity_tags_parent_id_idx" ON "competitors_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "competitors_evidence_urls_order_idx" ON "competitors_evidence_urls" USING btree ("_order");
  CREATE INDEX "competitors_evidence_urls_parent_id_idx" ON "competitors_evidence_urls" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "competitors_name_idx" ON "competitors" USING btree ("name");
  CREATE UNIQUE INDEX "competitors_slug_idx" ON "competitors" USING btree ("slug");
  CREATE INDEX "competitors_category_idx" ON "competitors" USING btree ("category");
  CREATE INDEX "competitors_region_idx" ON "competitors" USING btree ("region");
  CREATE INDEX "competitors_status_idx" ON "competitors" USING btree ("status");
  CREATE INDEX "competitors_last_reviewed_at_idx" ON "competitors" USING btree ("last_reviewed_at");
  CREATE INDEX "competitors_updated_at_idx" ON "competitors" USING btree ("updated_at");
  CREATE INDEX "competitors_created_at_idx" ON "competitors" USING btree ("created_at");
  CREATE INDEX "query_authority_scores_mentioned_entities_order_idx" ON "query_authority_scores_mentioned_entities" USING btree ("_order");
  CREATE INDEX "query_authority_scores_mentioned_entities_parent_id_idx" ON "query_authority_scores_mentioned_entities" USING btree ("_parent_id");
  CREATE INDEX "query_authority_scores_competitor_names_order_idx" ON "query_authority_scores_competitor_names" USING btree ("_order");
  CREATE INDEX "query_authority_scores_competitor_names_parent_id_idx" ON "query_authority_scores_competitor_names" USING btree ("_parent_id");
  CREATE INDEX "query_authority_scores_cited_urls_order_idx" ON "query_authority_scores_cited_urls" USING btree ("_order");
  CREATE INDEX "query_authority_scores_cited_urls_parent_id_idx" ON "query_authority_scores_cited_urls" USING btree ("_parent_id");
  CREATE INDEX "query_authority_scores_citations_order_idx" ON "query_authority_scores_citations" USING btree ("_order");
  CREATE INDEX "query_authority_scores_citations_parent_id_idx" ON "query_authority_scores_citations" USING btree ("_parent_id");
  CREATE INDEX "query_authority_scores_source_urls_order_idx" ON "query_authority_scores_source_urls" USING btree ("_order");
  CREATE INDEX "query_authority_scores_source_urls_parent_id_idx" ON "query_authority_scores_source_urls" USING btree ("_parent_id");
  CREATE INDEX "query_authority_scores_entity_idx" ON "query_authority_scores" USING btree ("entity_id");
  CREATE INDEX "query_authority_scores_query_idx" ON "query_authority_scores" USING btree ("query");
  CREATE INDEX "query_authority_scores_platform_idx" ON "query_authority_scores" USING btree ("platform");
  CREATE INDEX "query_authority_scores_itay_mentioned_idx" ON "query_authority_scores" USING btree ("itay_mentioned");
  CREATE INDEX "query_authority_scores_the_push_mentioned_idx" ON "query_authority_scores" USING btree ("the_push_mentioned");
  CREATE INDEX "query_authority_scores_proprietary_framework_mentioned_idx" ON "query_authority_scores" USING btree ("proprietary_framework_mentioned");
  CREATE INDEX "query_authority_scores_owned_url_cited_idx" ON "query_authority_scores" USING btree ("owned_url_cited");
  CREATE INDEX "query_authority_scores_recommendation_level_idx" ON "query_authority_scores" USING btree ("recommendation_level");
  CREATE INDEX "query_authority_scores_recommendation_position_idx" ON "query_authority_scores" USING btree ("recommendation_position");
  CREATE INDEX "query_authority_scores_confidence_idx" ON "query_authority_scores" USING btree ("confidence");
  CREATE INDEX "query_authority_scores_sentiment_idx" ON "query_authority_scores" USING btree ("sentiment");
  CREATE INDEX "query_authority_scores_previous_score_idx" ON "query_authority_scores" USING btree ("previous_score");
  CREATE INDEX "query_authority_scores_current_score_idx" ON "query_authority_scores" USING btree ("current_score");
  CREATE INDEX "query_authority_scores_score_delta_idx" ON "query_authority_scores" USING btree ("score_delta");
  CREATE INDEX "query_authority_scores_gap_classification_idx" ON "query_authority_scores" USING btree ("gap_classification");
  CREATE INDEX "query_authority_scores_suggested_owning_agent_idx" ON "query_authority_scores" USING btree ("suggested_owning_agent");
  CREATE INDEX "query_authority_scores_authority_tier_idx" ON "query_authority_scores" USING btree ("authority_tier");
  CREATE INDEX "query_authority_scores_status_idx" ON "query_authority_scores" USING btree ("status");
  CREATE INDEX "query_authority_scores_checked_at_idx" ON "query_authority_scores" USING btree ("checked_at");
  CREATE INDEX "query_authority_scores_recorded_at_idx" ON "query_authority_scores" USING btree ("recorded_at");
  CREATE INDEX "query_authority_scores_recorded_by_idx" ON "query_authority_scores" USING btree ("recorded_by");
  CREATE INDEX "query_authority_scores_source_count_idx" ON "query_authority_scores" USING btree ("source_count");
  CREATE INDEX "query_authority_scores_updated_at_idx" ON "query_authority_scores" USING btree ("updated_at");
  CREATE INDEX "query_authority_scores_created_at_idx" ON "query_authority_scores" USING btree ("created_at");
  CREATE INDEX "insight_extractions_claims_evidence_urls_order_idx" ON "insight_extractions_claims_evidence_urls" USING btree ("_order");
  CREATE INDEX "insight_extractions_claims_evidence_urls_parent_id_idx" ON "insight_extractions_claims_evidence_urls" USING btree ("_parent_id");
  CREATE INDEX "insight_extractions_claims_target_recommendation_queries_order_idx" ON "insight_extractions_claims_target_recommendation_queries" USING btree ("_order");
  CREATE INDEX "insight_extractions_claims_target_recommendation_queries_parent_id_idx" ON "insight_extractions_claims_target_recommendation_queries" USING btree ("_parent_id");
  CREATE INDEX "insight_extractions_claims_entity_tags_order_idx" ON "insight_extractions_claims_entity_tags" USING btree ("_order");
  CREATE INDEX "insight_extractions_claims_entity_tags_parent_id_idx" ON "insight_extractions_claims_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "insight_extractions_claims_order_idx" ON "insight_extractions_claims" USING btree ("_order");
  CREATE INDEX "insight_extractions_claims_parent_id_idx" ON "insight_extractions_claims" USING btree ("_parent_id");
  CREATE INDEX "insight_extractions_evidence_urls_order_idx" ON "insight_extractions_evidence_urls" USING btree ("_order");
  CREATE INDEX "insight_extractions_evidence_urls_parent_id_idx" ON "insight_extractions_evidence_urls" USING btree ("_parent_id");
  CREATE INDEX "insight_extractions_entity_tags_order_idx" ON "insight_extractions_entity_tags" USING btree ("_order");
  CREATE INDEX "insight_extractions_entity_tags_parent_id_idx" ON "insight_extractions_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "insight_extractions_target_recommendation_queries_order_idx" ON "insight_extractions_target_recommendation_queries" USING btree ("_order");
  CREATE INDEX "insight_extractions_target_recommendation_queries_parent_id_idx" ON "insight_extractions_target_recommendation_queries" USING btree ("_parent_id");
  CREATE INDEX "insight_extractions_source_urls_order_idx" ON "insight_extractions_source_urls" USING btree ("_order");
  CREATE INDEX "insight_extractions_source_urls_parent_id_idx" ON "insight_extractions_source_urls" USING btree ("_parent_id");
  CREATE INDEX "insight_extractions_source_title_idx" ON "insight_extractions" USING btree ("source_title");
  CREATE INDEX "insight_extractions_source_type_idx" ON "insight_extractions" USING btree ("source_type");
  CREATE INDEX "insight_extractions_status_idx" ON "insight_extractions" USING btree ("status");
  CREATE INDEX "insight_extractions_captured_at_idx" ON "insight_extractions" USING btree ("captured_at");
  CREATE INDEX "insight_extractions_approved_at_idx" ON "insight_extractions" USING btree ("approved_at");
  CREATE INDEX "insight_extractions_approved_by_idx" ON "insight_extractions" USING btree ("approved_by");
  CREATE INDEX "insight_extractions_linked_content_job_id_idx" ON "insight_extractions" USING btree ("linked_content_job_id");
  CREATE INDEX "insight_extractions_last_reviewed_at_idx" ON "insight_extractions" USING btree ("last_reviewed_at");
  CREATE INDEX "insight_extractions_updated_at_idx" ON "insight_extractions" USING btree ("updated_at");
  CREATE INDEX "insight_extractions_created_at_idx" ON "insight_extractions" USING btree ("created_at");
  CREATE INDEX "entity_pages_target_questions_order_idx" ON "entity_pages_target_questions" USING btree ("_order");
  CREATE INDEX "entity_pages_target_questions_parent_id_idx" ON "entity_pages_target_questions" USING btree ("_parent_id");
  CREATE INDEX "entity_pages_target_recommendation_queries_order_idx" ON "entity_pages_target_recommendation_queries" USING btree ("_order");
  CREATE INDEX "entity_pages_target_recommendation_queries_parent_id_idx" ON "entity_pages_target_recommendation_queries" USING btree ("_parent_id");
  CREATE INDEX "entity_pages_entity_tags_order_idx" ON "entity_pages_entity_tags" USING btree ("_order");
  CREATE INDEX "entity_pages_entity_tags_parent_id_idx" ON "entity_pages_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "entity_pages_faq_entity_tags_order_idx" ON "entity_pages_faq_entity_tags" USING btree ("_order");
  CREATE INDEX "entity_pages_faq_entity_tags_parent_id_idx" ON "entity_pages_faq_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "entity_pages_faq_target_recommendation_queries_order_idx" ON "entity_pages_faq_target_recommendation_queries" USING btree ("_order");
  CREATE INDEX "entity_pages_faq_target_recommendation_queries_parent_id_idx" ON "entity_pages_faq_target_recommendation_queries" USING btree ("_parent_id");
  CREATE INDEX "entity_pages_faq_order_idx" ON "entity_pages_faq" USING btree ("_order");
  CREATE INDEX "entity_pages_faq_parent_id_idx" ON "entity_pages_faq" USING btree ("_parent_id");
  CREATE INDEX "entity_pages_internal_links_source_entity_tags_order_idx" ON "entity_pages_internal_links_source_entity_tags" USING btree ("_order");
  CREATE INDEX "entity_pages_internal_links_source_entity_tags_parent_id_idx" ON "entity_pages_internal_links_source_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "entity_pages_internal_links_target_entity_tags_order_idx" ON "entity_pages_internal_links_target_entity_tags" USING btree ("_order");
  CREATE INDEX "entity_pages_internal_links_target_entity_tags_parent_id_idx" ON "entity_pages_internal_links_target_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "entity_pages_internal_links_order_idx" ON "entity_pages_internal_links" USING btree ("_order");
  CREATE INDEX "entity_pages_internal_links_parent_id_idx" ON "entity_pages_internal_links" USING btree ("_parent_id");
  CREATE INDEX "entity_pages_title_idx" ON "entity_pages" USING btree ("title");
  CREATE UNIQUE INDEX "entity_pages_slug_idx" ON "entity_pages" USING btree ("slug");
  CREATE INDEX "entity_pages_status_idx" ON "entity_pages" USING btree ("status");
  CREATE INDEX "entity_pages_published_at_idx" ON "entity_pages" USING btree ("published_at");
  CREATE INDEX "entity_pages_last_reviewed_at_idx" ON "entity_pages" USING btree ("last_reviewed_at");
  CREATE INDEX "entity_pages_featured_image_idx" ON "entity_pages" USING btree ("featured_image_id");
  CREATE INDEX "entity_pages_updated_at_idx" ON "entity_pages" USING btree ("updated_at");
  CREATE INDEX "entity_pages_created_at_idx" ON "entity_pages" USING btree ("created_at");
  CREATE INDEX "pillar_pages_target_questions_order_idx" ON "pillar_pages_target_questions" USING btree ("_order");
  CREATE INDEX "pillar_pages_target_questions_parent_id_idx" ON "pillar_pages_target_questions" USING btree ("_parent_id");
  CREATE INDEX "pillar_pages_target_recommendation_queries_order_idx" ON "pillar_pages_target_recommendation_queries" USING btree ("_order");
  CREATE INDEX "pillar_pages_target_recommendation_queries_parent_id_idx" ON "pillar_pages_target_recommendation_queries" USING btree ("_parent_id");
  CREATE INDEX "pillar_pages_entity_tags_order_idx" ON "pillar_pages_entity_tags" USING btree ("_order");
  CREATE INDEX "pillar_pages_entity_tags_parent_id_idx" ON "pillar_pages_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "pillar_pages_faq_entity_tags_order_idx" ON "pillar_pages_faq_entity_tags" USING btree ("_order");
  CREATE INDEX "pillar_pages_faq_entity_tags_parent_id_idx" ON "pillar_pages_faq_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "pillar_pages_faq_target_recommendation_queries_order_idx" ON "pillar_pages_faq_target_recommendation_queries" USING btree ("_order");
  CREATE INDEX "pillar_pages_faq_target_recommendation_queries_parent_id_idx" ON "pillar_pages_faq_target_recommendation_queries" USING btree ("_parent_id");
  CREATE INDEX "pillar_pages_faq_order_idx" ON "pillar_pages_faq" USING btree ("_order");
  CREATE INDEX "pillar_pages_faq_parent_id_idx" ON "pillar_pages_faq" USING btree ("_parent_id");
  CREATE INDEX "pillar_pages_internal_links_source_entity_tags_order_idx" ON "pillar_pages_internal_links_source_entity_tags" USING btree ("_order");
  CREATE INDEX "pillar_pages_internal_links_source_entity_tags_parent_id_idx" ON "pillar_pages_internal_links_source_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "pillar_pages_internal_links_target_entity_tags_order_idx" ON "pillar_pages_internal_links_target_entity_tags" USING btree ("_order");
  CREATE INDEX "pillar_pages_internal_links_target_entity_tags_parent_id_idx" ON "pillar_pages_internal_links_target_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "pillar_pages_internal_links_order_idx" ON "pillar_pages_internal_links" USING btree ("_order");
  CREATE INDEX "pillar_pages_internal_links_parent_id_idx" ON "pillar_pages_internal_links" USING btree ("_parent_id");
  CREATE INDEX "pillar_pages_title_idx" ON "pillar_pages" USING btree ("title");
  CREATE UNIQUE INDEX "pillar_pages_slug_idx" ON "pillar_pages" USING btree ("slug");
  CREATE INDEX "pillar_pages_status_idx" ON "pillar_pages" USING btree ("status");
  CREATE INDEX "pillar_pages_published_at_idx" ON "pillar_pages" USING btree ("published_at");
  CREATE INDEX "pillar_pages_last_reviewed_at_idx" ON "pillar_pages" USING btree ("last_reviewed_at");
  CREATE INDEX "pillar_pages_featured_image_idx" ON "pillar_pages" USING btree ("featured_image_id");
  CREATE INDEX "pillar_pages_updated_at_idx" ON "pillar_pages" USING btree ("updated_at");
  CREATE INDEX "pillar_pages_created_at_idx" ON "pillar_pages" USING btree ("created_at");
  CREATE INDEX "cluster_pages_target_questions_order_idx" ON "cluster_pages_target_questions" USING btree ("_order");
  CREATE INDEX "cluster_pages_target_questions_parent_id_idx" ON "cluster_pages_target_questions" USING btree ("_parent_id");
  CREATE INDEX "cluster_pages_target_recommendation_queries_order_idx" ON "cluster_pages_target_recommendation_queries" USING btree ("_order");
  CREATE INDEX "cluster_pages_target_recommendation_queries_parent_id_idx" ON "cluster_pages_target_recommendation_queries" USING btree ("_parent_id");
  CREATE INDEX "cluster_pages_entity_tags_order_idx" ON "cluster_pages_entity_tags" USING btree ("_order");
  CREATE INDEX "cluster_pages_entity_tags_parent_id_idx" ON "cluster_pages_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "cluster_pages_faq_entity_tags_order_idx" ON "cluster_pages_faq_entity_tags" USING btree ("_order");
  CREATE INDEX "cluster_pages_faq_entity_tags_parent_id_idx" ON "cluster_pages_faq_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "cluster_pages_faq_target_recommendation_queries_order_idx" ON "cluster_pages_faq_target_recommendation_queries" USING btree ("_order");
  CREATE INDEX "cluster_pages_faq_target_recommendation_queries_parent_id_idx" ON "cluster_pages_faq_target_recommendation_queries" USING btree ("_parent_id");
  CREATE INDEX "cluster_pages_faq_order_idx" ON "cluster_pages_faq" USING btree ("_order");
  CREATE INDEX "cluster_pages_faq_parent_id_idx" ON "cluster_pages_faq" USING btree ("_parent_id");
  CREATE INDEX "cluster_pages_internal_links_source_entity_tags_order_idx" ON "cluster_pages_internal_links_source_entity_tags" USING btree ("_order");
  CREATE INDEX "cluster_pages_internal_links_source_entity_tags_parent_id_idx" ON "cluster_pages_internal_links_source_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "cluster_pages_internal_links_target_entity_tags_order_idx" ON "cluster_pages_internal_links_target_entity_tags" USING btree ("_order");
  CREATE INDEX "cluster_pages_internal_links_target_entity_tags_parent_id_idx" ON "cluster_pages_internal_links_target_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "cluster_pages_internal_links_order_idx" ON "cluster_pages_internal_links" USING btree ("_order");
  CREATE INDEX "cluster_pages_internal_links_parent_id_idx" ON "cluster_pages_internal_links" USING btree ("_parent_id");
  CREATE INDEX "cluster_pages_title_idx" ON "cluster_pages" USING btree ("title");
  CREATE UNIQUE INDEX "cluster_pages_slug_idx" ON "cluster_pages" USING btree ("slug");
  CREATE INDEX "cluster_pages_status_idx" ON "cluster_pages" USING btree ("status");
  CREATE INDEX "cluster_pages_published_at_idx" ON "cluster_pages" USING btree ("published_at");
  CREATE INDEX "cluster_pages_last_reviewed_at_idx" ON "cluster_pages" USING btree ("last_reviewed_at");
  CREATE INDEX "cluster_pages_featured_image_idx" ON "cluster_pages" USING btree ("featured_image_id");
  CREATE INDEX "cluster_pages_updated_at_idx" ON "cluster_pages" USING btree ("updated_at");
  CREATE INDEX "cluster_pages_created_at_idx" ON "cluster_pages" USING btree ("created_at");
  CREATE INDEX "frameworks_target_questions_order_idx" ON "frameworks_target_questions" USING btree ("_order");
  CREATE INDEX "frameworks_target_questions_parent_id_idx" ON "frameworks_target_questions" USING btree ("_parent_id");
  CREATE INDEX "frameworks_target_recommendation_queries_order_idx" ON "frameworks_target_recommendation_queries" USING btree ("_order");
  CREATE INDEX "frameworks_target_recommendation_queries_parent_id_idx" ON "frameworks_target_recommendation_queries" USING btree ("_parent_id");
  CREATE INDEX "frameworks_entity_tags_order_idx" ON "frameworks_entity_tags" USING btree ("_order");
  CREATE INDEX "frameworks_entity_tags_parent_id_idx" ON "frameworks_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "frameworks_faq_entity_tags_order_idx" ON "frameworks_faq_entity_tags" USING btree ("_order");
  CREATE INDEX "frameworks_faq_entity_tags_parent_id_idx" ON "frameworks_faq_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "frameworks_faq_target_recommendation_queries_order_idx" ON "frameworks_faq_target_recommendation_queries" USING btree ("_order");
  CREATE INDEX "frameworks_faq_target_recommendation_queries_parent_id_idx" ON "frameworks_faq_target_recommendation_queries" USING btree ("_parent_id");
  CREATE INDEX "frameworks_faq_order_idx" ON "frameworks_faq" USING btree ("_order");
  CREATE INDEX "frameworks_faq_parent_id_idx" ON "frameworks_faq" USING btree ("_parent_id");
  CREATE INDEX "frameworks_internal_links_source_entity_tags_order_idx" ON "frameworks_internal_links_source_entity_tags" USING btree ("_order");
  CREATE INDEX "frameworks_internal_links_source_entity_tags_parent_id_idx" ON "frameworks_internal_links_source_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "frameworks_internal_links_target_entity_tags_order_idx" ON "frameworks_internal_links_target_entity_tags" USING btree ("_order");
  CREATE INDEX "frameworks_internal_links_target_entity_tags_parent_id_idx" ON "frameworks_internal_links_target_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "frameworks_internal_links_order_idx" ON "frameworks_internal_links" USING btree ("_order");
  CREATE INDEX "frameworks_internal_links_parent_id_idx" ON "frameworks_internal_links" USING btree ("_parent_id");
  CREATE INDEX "frameworks_title_idx" ON "frameworks" USING btree ("title");
  CREATE UNIQUE INDEX "frameworks_slug_idx" ON "frameworks" USING btree ("slug");
  CREATE INDEX "frameworks_status_idx" ON "frameworks" USING btree ("status");
  CREATE INDEX "frameworks_published_at_idx" ON "frameworks" USING btree ("published_at");
  CREATE INDEX "frameworks_last_reviewed_at_idx" ON "frameworks" USING btree ("last_reviewed_at");
  CREATE INDEX "frameworks_featured_image_idx" ON "frameworks" USING btree ("featured_image_id");
  CREATE INDEX "frameworks_updated_at_idx" ON "frameworks" USING btree ("updated_at");
  CREATE INDEX "frameworks_created_at_idx" ON "frameworks" USING btree ("created_at");
  CREATE INDEX "case_studies_target_questions_order_idx" ON "case_studies_target_questions" USING btree ("_order");
  CREATE INDEX "case_studies_target_questions_parent_id_idx" ON "case_studies_target_questions" USING btree ("_parent_id");
  CREATE INDEX "case_studies_target_recommendation_queries_order_idx" ON "case_studies_target_recommendation_queries" USING btree ("_order");
  CREATE INDEX "case_studies_target_recommendation_queries_parent_id_idx" ON "case_studies_target_recommendation_queries" USING btree ("_parent_id");
  CREATE INDEX "case_studies_entity_tags_order_idx" ON "case_studies_entity_tags" USING btree ("_order");
  CREATE INDEX "case_studies_entity_tags_parent_id_idx" ON "case_studies_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "case_studies_faq_entity_tags_order_idx" ON "case_studies_faq_entity_tags" USING btree ("_order");
  CREATE INDEX "case_studies_faq_entity_tags_parent_id_idx" ON "case_studies_faq_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "case_studies_faq_target_recommendation_queries_order_idx" ON "case_studies_faq_target_recommendation_queries" USING btree ("_order");
  CREATE INDEX "case_studies_faq_target_recommendation_queries_parent_id_idx" ON "case_studies_faq_target_recommendation_queries" USING btree ("_parent_id");
  CREATE INDEX "case_studies_faq_order_idx" ON "case_studies_faq" USING btree ("_order");
  CREATE INDEX "case_studies_faq_parent_id_idx" ON "case_studies_faq" USING btree ("_parent_id");
  CREATE INDEX "case_studies_internal_links_source_entity_tags_order_idx" ON "case_studies_internal_links_source_entity_tags" USING btree ("_order");
  CREATE INDEX "case_studies_internal_links_source_entity_tags_parent_id_idx" ON "case_studies_internal_links_source_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "case_studies_internal_links_target_entity_tags_order_idx" ON "case_studies_internal_links_target_entity_tags" USING btree ("_order");
  CREATE INDEX "case_studies_internal_links_target_entity_tags_parent_id_idx" ON "case_studies_internal_links_target_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "case_studies_internal_links_order_idx" ON "case_studies_internal_links" USING btree ("_order");
  CREATE INDEX "case_studies_internal_links_parent_id_idx" ON "case_studies_internal_links" USING btree ("_parent_id");
  CREATE INDEX "case_studies_title_idx" ON "case_studies" USING btree ("title");
  CREATE UNIQUE INDEX "case_studies_slug_idx" ON "case_studies" USING btree ("slug");
  CREATE INDEX "case_studies_status_idx" ON "case_studies" USING btree ("status");
  CREATE INDEX "case_studies_published_at_idx" ON "case_studies" USING btree ("published_at");
  CREATE INDEX "case_studies_last_reviewed_at_idx" ON "case_studies" USING btree ("last_reviewed_at");
  CREATE INDEX "case_studies_featured_image_idx" ON "case_studies" USING btree ("featured_image_id");
  CREATE INDEX "case_studies_updated_at_idx" ON "case_studies" USING btree ("updated_at");
  CREATE INDEX "case_studies_created_at_idx" ON "case_studies" USING btree ("created_at");
  CREATE INDEX "faqs_target_questions_order_idx" ON "faqs_target_questions" USING btree ("_order");
  CREATE INDEX "faqs_target_questions_parent_id_idx" ON "faqs_target_questions" USING btree ("_parent_id");
  CREATE INDEX "faqs_target_recommendation_queries_order_idx" ON "faqs_target_recommendation_queries" USING btree ("_order");
  CREATE INDEX "faqs_target_recommendation_queries_parent_id_idx" ON "faqs_target_recommendation_queries" USING btree ("_parent_id");
  CREATE INDEX "faqs_entity_tags_order_idx" ON "faqs_entity_tags" USING btree ("_order");
  CREATE INDEX "faqs_entity_tags_parent_id_idx" ON "faqs_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "faqs_faq_entity_tags_order_idx" ON "faqs_faq_entity_tags" USING btree ("_order");
  CREATE INDEX "faqs_faq_entity_tags_parent_id_idx" ON "faqs_faq_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "faqs_faq_target_recommendation_queries_order_idx" ON "faqs_faq_target_recommendation_queries" USING btree ("_order");
  CREATE INDEX "faqs_faq_target_recommendation_queries_parent_id_idx" ON "faqs_faq_target_recommendation_queries" USING btree ("_parent_id");
  CREATE INDEX "faqs_faq_order_idx" ON "faqs_faq" USING btree ("_order");
  CREATE INDEX "faqs_faq_parent_id_idx" ON "faqs_faq" USING btree ("_parent_id");
  CREATE INDEX "faqs_internal_links_source_entity_tags_order_idx" ON "faqs_internal_links_source_entity_tags" USING btree ("_order");
  CREATE INDEX "faqs_internal_links_source_entity_tags_parent_id_idx" ON "faqs_internal_links_source_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "faqs_internal_links_target_entity_tags_order_idx" ON "faqs_internal_links_target_entity_tags" USING btree ("_order");
  CREATE INDEX "faqs_internal_links_target_entity_tags_parent_id_idx" ON "faqs_internal_links_target_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "faqs_internal_links_order_idx" ON "faqs_internal_links" USING btree ("_order");
  CREATE INDEX "faqs_internal_links_parent_id_idx" ON "faqs_internal_links" USING btree ("_parent_id");
  CREATE INDEX "faqs_title_idx" ON "faqs" USING btree ("title");
  CREATE UNIQUE INDEX "faqs_slug_idx" ON "faqs" USING btree ("slug");
  CREATE INDEX "faqs_status_idx" ON "faqs" USING btree ("status");
  CREATE INDEX "faqs_published_at_idx" ON "faqs" USING btree ("published_at");
  CREATE INDEX "faqs_last_reviewed_at_idx" ON "faqs" USING btree ("last_reviewed_at");
  CREATE INDEX "faqs_featured_image_idx" ON "faqs" USING btree ("featured_image_id");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE INDEX "glossary_terms_target_questions_order_idx" ON "glossary_terms_target_questions" USING btree ("_order");
  CREATE INDEX "glossary_terms_target_questions_parent_id_idx" ON "glossary_terms_target_questions" USING btree ("_parent_id");
  CREATE INDEX "glossary_terms_target_recommendation_queries_order_idx" ON "glossary_terms_target_recommendation_queries" USING btree ("_order");
  CREATE INDEX "glossary_terms_target_recommendation_queries_parent_id_idx" ON "glossary_terms_target_recommendation_queries" USING btree ("_parent_id");
  CREATE INDEX "glossary_terms_entity_tags_order_idx" ON "glossary_terms_entity_tags" USING btree ("_order");
  CREATE INDEX "glossary_terms_entity_tags_parent_id_idx" ON "glossary_terms_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "glossary_terms_faq_entity_tags_order_idx" ON "glossary_terms_faq_entity_tags" USING btree ("_order");
  CREATE INDEX "glossary_terms_faq_entity_tags_parent_id_idx" ON "glossary_terms_faq_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "glossary_terms_faq_target_recommendation_queries_order_idx" ON "glossary_terms_faq_target_recommendation_queries" USING btree ("_order");
  CREATE INDEX "glossary_terms_faq_target_recommendation_queries_parent_id_idx" ON "glossary_terms_faq_target_recommendation_queries" USING btree ("_parent_id");
  CREATE INDEX "glossary_terms_faq_order_idx" ON "glossary_terms_faq" USING btree ("_order");
  CREATE INDEX "glossary_terms_faq_parent_id_idx" ON "glossary_terms_faq" USING btree ("_parent_id");
  CREATE INDEX "glossary_terms_internal_links_source_entity_tags_order_idx" ON "glossary_terms_internal_links_source_entity_tags" USING btree ("_order");
  CREATE INDEX "glossary_terms_internal_links_source_entity_tags_parent_id_idx" ON "glossary_terms_internal_links_source_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "glossary_terms_internal_links_target_entity_tags_order_idx" ON "glossary_terms_internal_links_target_entity_tags" USING btree ("_order");
  CREATE INDEX "glossary_terms_internal_links_target_entity_tags_parent_id_idx" ON "glossary_terms_internal_links_target_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "glossary_terms_internal_links_order_idx" ON "glossary_terms_internal_links" USING btree ("_order");
  CREATE INDEX "glossary_terms_internal_links_parent_id_idx" ON "glossary_terms_internal_links" USING btree ("_parent_id");
  CREATE INDEX "glossary_terms_title_idx" ON "glossary_terms" USING btree ("title");
  CREATE UNIQUE INDEX "glossary_terms_slug_idx" ON "glossary_terms" USING btree ("slug");
  CREATE INDEX "glossary_terms_status_idx" ON "glossary_terms" USING btree ("status");
  CREATE INDEX "glossary_terms_published_at_idx" ON "glossary_terms" USING btree ("published_at");
  CREATE INDEX "glossary_terms_last_reviewed_at_idx" ON "glossary_terms" USING btree ("last_reviewed_at");
  CREATE INDEX "glossary_terms_featured_image_idx" ON "glossary_terms" USING btree ("featured_image_id");
  CREATE INDEX "glossary_terms_updated_at_idx" ON "glossary_terms" USING btree ("updated_at");
  CREATE INDEX "glossary_terms_created_at_idx" ON "glossary_terms" USING btree ("created_at");
  CREATE INDEX "lead_magnets_target_questions_order_idx" ON "lead_magnets_target_questions" USING btree ("_order");
  CREATE INDEX "lead_magnets_target_questions_parent_id_idx" ON "lead_magnets_target_questions" USING btree ("_parent_id");
  CREATE INDEX "lead_magnets_target_recommendation_queries_order_idx" ON "lead_magnets_target_recommendation_queries" USING btree ("_order");
  CREATE INDEX "lead_magnets_target_recommendation_queries_parent_id_idx" ON "lead_magnets_target_recommendation_queries" USING btree ("_parent_id");
  CREATE INDEX "lead_magnets_entity_tags_order_idx" ON "lead_magnets_entity_tags" USING btree ("_order");
  CREATE INDEX "lead_magnets_entity_tags_parent_id_idx" ON "lead_magnets_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "lead_magnets_faq_entity_tags_order_idx" ON "lead_magnets_faq_entity_tags" USING btree ("_order");
  CREATE INDEX "lead_magnets_faq_entity_tags_parent_id_idx" ON "lead_magnets_faq_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "lead_magnets_faq_target_recommendation_queries_order_idx" ON "lead_magnets_faq_target_recommendation_queries" USING btree ("_order");
  CREATE INDEX "lead_magnets_faq_target_recommendation_queries_parent_id_idx" ON "lead_magnets_faq_target_recommendation_queries" USING btree ("_parent_id");
  CREATE INDEX "lead_magnets_faq_order_idx" ON "lead_magnets_faq" USING btree ("_order");
  CREATE INDEX "lead_magnets_faq_parent_id_idx" ON "lead_magnets_faq" USING btree ("_parent_id");
  CREATE INDEX "lead_magnets_internal_links_source_entity_tags_order_idx" ON "lead_magnets_internal_links_source_entity_tags" USING btree ("_order");
  CREATE INDEX "lead_magnets_internal_links_source_entity_tags_parent_id_idx" ON "lead_magnets_internal_links_source_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "lead_magnets_internal_links_target_entity_tags_order_idx" ON "lead_magnets_internal_links_target_entity_tags" USING btree ("_order");
  CREATE INDEX "lead_magnets_internal_links_target_entity_tags_parent_id_idx" ON "lead_magnets_internal_links_target_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "lead_magnets_internal_links_order_idx" ON "lead_magnets_internal_links" USING btree ("_order");
  CREATE INDEX "lead_magnets_internal_links_parent_id_idx" ON "lead_magnets_internal_links" USING btree ("_parent_id");
  CREATE INDEX "lead_magnets_title_idx" ON "lead_magnets" USING btree ("title");
  CREATE UNIQUE INDEX "lead_magnets_slug_idx" ON "lead_magnets" USING btree ("slug");
  CREATE INDEX "lead_magnets_status_idx" ON "lead_magnets" USING btree ("status");
  CREATE INDEX "lead_magnets_published_at_idx" ON "lead_magnets" USING btree ("published_at");
  CREATE INDEX "lead_magnets_last_reviewed_at_idx" ON "lead_magnets" USING btree ("last_reviewed_at");
  CREATE INDEX "lead_magnets_featured_image_idx" ON "lead_magnets" USING btree ("featured_image_id");
  CREATE INDEX "lead_magnets_updated_at_idx" ON "lead_magnets" USING btree ("updated_at");
  CREATE INDEX "lead_magnets_created_at_idx" ON "lead_magnets" USING btree ("created_at");
  CREATE INDEX "email_subscribers_tags_order_idx" ON "email_subscribers_tags" USING btree ("_order");
  CREATE INDEX "email_subscribers_tags_parent_id_idx" ON "email_subscribers_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "email_subscribers_email_idx" ON "email_subscribers" USING btree ("email");
  CREATE INDEX "email_subscribers_updated_at_idx" ON "email_subscribers" USING btree ("updated_at");
  CREATE INDEX "email_subscribers_created_at_idx" ON "email_subscribers" USING btree ("created_at");
  CREATE INDEX "research_sources_supported_claims_order_idx" ON "research_sources_supported_claims" USING btree ("_order");
  CREATE INDEX "research_sources_supported_claims_parent_id_idx" ON "research_sources_supported_claims" USING btree ("_parent_id");
  CREATE INDEX "research_sources_title_idx" ON "research_sources" USING btree ("title");
  CREATE UNIQUE INDEX "research_sources_url_idx" ON "research_sources" USING btree ("url");
  CREATE INDEX "research_sources_published_at_idx" ON "research_sources" USING btree ("published_at");
  CREATE INDEX "research_sources_accessed_at_idx" ON "research_sources" USING btree ("accessed_at");
  CREATE INDEX "research_sources_updated_at_idx" ON "research_sources" USING btree ("updated_at");
  CREATE INDEX "research_sources_created_at_idx" ON "research_sources" USING btree ("created_at");
  CREATE INDEX "internal_links_source_entity_tags_order_idx" ON "internal_links_source_entity_tags" USING btree ("_order");
  CREATE INDEX "internal_links_source_entity_tags_parent_id_idx" ON "internal_links_source_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "internal_links_target_entity_tags_order_idx" ON "internal_links_target_entity_tags" USING btree ("_order");
  CREATE INDEX "internal_links_target_entity_tags_parent_id_idx" ON "internal_links_target_entity_tags" USING btree ("_parent_id");
  CREATE INDEX "internal_links_target_slug_idx" ON "internal_links" USING btree ("target_slug");
  CREATE INDEX "internal_links_anchor_text_idx" ON "internal_links" USING btree ("anchor_text");
  CREATE INDEX "internal_links_source_slug_idx" ON "internal_links" USING btree ("source_slug");
  CREATE INDEX "internal_links_updated_at_idx" ON "internal_links" USING btree ("updated_at");
  CREATE INDEX "internal_links_created_at_idx" ON "internal_links" USING btree ("created_at");
  CREATE INDEX "content_jobs_target_recommendation_queries_order_idx" ON "content_jobs_target_recommendation_queries" USING btree ("_order");
  CREATE INDEX "content_jobs_target_recommendation_queries_parent_id_idx" ON "content_jobs_target_recommendation_queries" USING btree ("_parent_id");
  CREATE INDEX "content_jobs_source_insight_ids_order_idx" ON "content_jobs_source_insight_ids" USING btree ("_order");
  CREATE INDEX "content_jobs_source_insight_ids_parent_id_idx" ON "content_jobs_source_insight_ids" USING btree ("_parent_id");
  CREATE INDEX "content_jobs_updated_at_idx" ON "content_jobs" USING btree ("updated_at");
  CREATE INDEX "content_jobs_created_at_idx" ON "content_jobs" USING btree ("created_at");
  CREATE INDEX "agent_runs_errors_order_idx" ON "agent_runs_errors" USING btree ("_order");
  CREATE INDEX "agent_runs_errors_parent_id_idx" ON "agent_runs_errors" USING btree ("_parent_id");
  CREATE INDEX "agent_runs_content_job_id_idx" ON "agent_runs" USING btree ("content_job_id");
  CREATE INDEX "agent_runs_started_at_idx" ON "agent_runs" USING btree ("started_at");
  CREATE INDEX "agent_runs_completed_at_idx" ON "agent_runs" USING btree ("completed_at");
  CREATE INDEX "agent_runs_updated_at_idx" ON "agent_runs" USING btree ("updated_at");
  CREATE INDEX "agent_runs_created_at_idx" ON "agent_runs" USING btree ("created_at");
  CREATE INDEX "query_authority_scorecards_mentioned_entities_order_idx" ON "query_authority_scorecards_mentioned_entities" USING btree ("_order");
  CREATE INDEX "query_authority_scorecards_mentioned_entities_parent_id_idx" ON "query_authority_scorecards_mentioned_entities" USING btree ("_parent_id");
  CREATE INDEX "query_authority_scorecards_cited_urls_order_idx" ON "query_authority_scorecards_cited_urls" USING btree ("_order");
  CREATE INDEX "query_authority_scorecards_cited_urls_parent_id_idx" ON "query_authority_scorecards_cited_urls" USING btree ("_parent_id");
  CREATE INDEX "query_authority_scorecards_citations_order_idx" ON "query_authority_scorecards_citations" USING btree ("_order");
  CREATE INDEX "query_authority_scorecards_citations_parent_id_idx" ON "query_authority_scorecards_citations" USING btree ("_parent_id");
  CREATE INDEX "query_authority_scorecards_competitors_recommended_order_idx" ON "query_authority_scorecards_competitors_recommended" USING btree ("_order");
  CREATE INDEX "query_authority_scorecards_competitors_recommended_parent_id_idx" ON "query_authority_scorecards_competitors_recommended" USING btree ("_parent_id");
  CREATE INDEX "query_authority_scorecards_source_urls_order_idx" ON "query_authority_scorecards_source_urls" USING btree ("_order");
  CREATE INDEX "query_authority_scorecards_source_urls_parent_id_idx" ON "query_authority_scorecards_source_urls" USING btree ("_parent_id");
  CREATE INDEX "query_authority_scorecards_collection_key_idx" ON "query_authority_scorecards" USING btree ("collection_key");
  CREATE INDEX "query_authority_scorecards_record_type_idx" ON "query_authority_scorecards" USING btree ("record_type");
  CREATE INDEX "query_authority_scorecards_query_idx" ON "query_authority_scorecards" USING btree ("query");
  CREATE INDEX "query_authority_scorecards_platform_idx" ON "query_authority_scorecards" USING btree ("platform");
  CREATE INDEX "query_authority_scorecards_itay_mentioned_idx" ON "query_authority_scorecards" USING btree ("itay_mentioned");
  CREATE INDEX "query_authority_scorecards_the_push_mentioned_idx" ON "query_authority_scorecards" USING btree ("the_push_mentioned");
  CREATE INDEX "query_authority_scorecards_proprietary_framework_mention_idx" ON "query_authority_scorecards" USING btree ("proprietary_framework_mentioned");
  CREATE INDEX "query_authority_scorecards_owned_url_cited_idx" ON "query_authority_scorecards" USING btree ("owned_url_cited");
  CREATE INDEX "query_authority_scorecards_recommendation_level_idx" ON "query_authority_scorecards" USING btree ("recommendation_level");
  CREATE INDEX "query_authority_scorecards_recommendation_position_idx" ON "query_authority_scorecards" USING btree ("recommendation_position");
  CREATE INDEX "query_authority_scorecards_confidence_idx" ON "query_authority_scorecards" USING btree ("confidence");
  CREATE INDEX "query_authority_scorecards_sentiment_idx" ON "query_authority_scorecards" USING btree ("sentiment");
  CREATE INDEX "query_authority_scorecards_checked_at_idx" ON "query_authority_scorecards" USING btree ("checked_at");
  CREATE INDEX "query_authority_scorecards_previous_score_idx" ON "query_authority_scorecards" USING btree ("previous_score");
  CREATE INDEX "query_authority_scorecards_current_score_idx" ON "query_authority_scorecards" USING btree ("current_score");
  CREATE INDEX "query_authority_scorecards_score_delta_idx" ON "query_authority_scorecards" USING btree ("score_delta");
  CREATE INDEX "query_authority_scorecards_gap_classification_idx" ON "query_authority_scorecards" USING btree ("gap_classification");
  CREATE INDEX "query_authority_scorecards_suggested_owning_agent_idx" ON "query_authority_scorecards" USING btree ("suggested_owning_agent");
  CREATE INDEX "query_authority_scorecards_capture_mode_idx" ON "query_authority_scorecards" USING btree ("capture_mode");
  CREATE INDEX "query_authority_scorecards_review_status_idx" ON "query_authority_scorecards" USING btree ("review_status");
  CREATE INDEX "query_authority_scorecards_recorded_at_idx" ON "query_authority_scorecards" USING btree ("recorded_at");
  CREATE INDEX "query_authority_scorecards_recorded_by_idx" ON "query_authority_scorecards" USING btree ("recorded_by");
  CREATE INDEX "query_authority_scorecards_source_count_idx" ON "query_authority_scorecards" USING btree ("source_count");
  CREATE INDEX "query_authority_scorecards_updated_at_idx" ON "query_authority_scorecards" USING btree ("updated_at");
  CREATE INDEX "query_authority_scorecards_created_at_idx" ON "query_authority_scorecards" USING btree ("created_at");
  CREATE INDEX "competitor_contracts_known_strengths_order_idx" ON "competitor_contracts_known_strengths" USING btree ("_order");
  CREATE INDEX "competitor_contracts_known_strengths_parent_id_idx" ON "competitor_contracts_known_strengths" USING btree ("_parent_id");
  CREATE INDEX "competitor_contracts_target_queries_where_they_appear_order_idx" ON "competitor_contracts_target_queries_where_they_appear" USING btree ("_order");
  CREATE INDEX "competitor_contracts_target_queries_where_they_appear_parent_id_idx" ON "competitor_contracts_target_queries_where_they_appear" USING btree ("_parent_id");
  CREATE INDEX "competitor_contracts_source_urls_order_idx" ON "competitor_contracts_source_urls" USING btree ("_order");
  CREATE INDEX "competitor_contracts_source_urls_parent_id_idx" ON "competitor_contracts_source_urls" USING btree ("_parent_id");
  CREATE INDEX "competitor_contracts_collection_key_idx" ON "competitor_contracts" USING btree ("collection_key");
  CREATE INDEX "competitor_contracts_record_type_idx" ON "competitor_contracts" USING btree ("record_type");
  CREATE UNIQUE INDEX "competitor_contracts_name_idx" ON "competitor_contracts" USING btree ("name");
  CREATE INDEX "competitor_contracts_category_idx" ON "competitor_contracts" USING btree ("category");
  CREATE INDEX "competitor_contracts_region_idx" ON "competitor_contracts" USING btree ("region");
  CREATE INDEX "competitor_contracts_recorded_at_idx" ON "competitor_contracts" USING btree ("recorded_at");
  CREATE INDEX "competitor_contracts_recorded_by_idx" ON "competitor_contracts" USING btree ("recorded_by");
  CREATE INDEX "competitor_contracts_source_count_idx" ON "competitor_contracts" USING btree ("source_count");
  CREATE INDEX "competitor_contracts_last_reviewed_at_idx" ON "competitor_contracts" USING btree ("last_reviewed_at");
  CREATE INDEX "competitor_contracts_updated_at_idx" ON "competitor_contracts" USING btree ("updated_at");
  CREATE INDEX "competitor_contracts_created_at_idx" ON "competitor_contracts" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_entities_id_idx" ON "payload_locked_documents_rels" USING btree ("entities_id");
  CREATE INDEX "payload_locked_documents_rels_entity_relationships_id_idx" ON "payload_locked_documents_rels" USING btree ("entity_relationships_id");
  CREATE INDEX "payload_locked_documents_rels_authority_gaps_id_idx" ON "payload_locked_documents_rels" USING btree ("authority_gaps_id");
  CREATE INDEX "payload_locked_documents_rels_competitors_id_idx" ON "payload_locked_documents_rels" USING btree ("competitors_id");
  CREATE INDEX "payload_locked_documents_rels_query_authority_scores_id_idx" ON "payload_locked_documents_rels" USING btree ("query_authority_scores_id");
  CREATE INDEX "payload_locked_documents_rels_insight_extractions_id_idx" ON "payload_locked_documents_rels" USING btree ("insight_extractions_id");
  CREATE INDEX "payload_locked_documents_rels_entity_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("entity_pages_id");
  CREATE INDEX "payload_locked_documents_rels_pillar_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pillar_pages_id");
  CREATE INDEX "payload_locked_documents_rels_cluster_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("cluster_pages_id");
  CREATE INDEX "payload_locked_documents_rels_frameworks_id_idx" ON "payload_locked_documents_rels" USING btree ("frameworks_id");
  CREATE INDEX "payload_locked_documents_rels_case_studies_id_idx" ON "payload_locked_documents_rels" USING btree ("case_studies_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_glossary_terms_id_idx" ON "payload_locked_documents_rels" USING btree ("glossary_terms_id");
  CREATE INDEX "payload_locked_documents_rels_lead_magnets_id_idx" ON "payload_locked_documents_rels" USING btree ("lead_magnets_id");
  CREATE INDEX "payload_locked_documents_rels_email_subscribers_id_idx" ON "payload_locked_documents_rels" USING btree ("email_subscribers_id");
  CREATE INDEX "payload_locked_documents_rels_research_sources_id_idx" ON "payload_locked_documents_rels" USING btree ("research_sources_id");
  CREATE INDEX "payload_locked_documents_rels_internal_links_id_idx" ON "payload_locked_documents_rels" USING btree ("internal_links_id");
  CREATE INDEX "payload_locked_documents_rels_content_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("content_jobs_id");
  CREATE INDEX "payload_locked_documents_rels_agent_runs_id_idx" ON "payload_locked_documents_rels" USING btree ("agent_runs_id");
  CREATE INDEX "payload_locked_documents_rels_query_authority_scorecards_idx" ON "payload_locked_documents_rels" USING btree ("query_authority_scorecards_id");
  CREATE INDEX "payload_locked_documents_rels_competitor_contracts_id_idx" ON "payload_locked_documents_rels" USING btree ("competitor_contracts_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "entities_target_recommendation_queries" CASCADE;
  DROP TABLE "entities_entity_tags" CASCADE;
  DROP TABLE "entities_same_as" CASCADE;
  DROP TABLE "entities_evidence_urls" CASCADE;
  DROP TABLE "entities" CASCADE;
  DROP TABLE "entity_relationships_target_recommendation_queries" CASCADE;
  DROP TABLE "entity_relationships_evidence_urls" CASCADE;
  DROP TABLE "entity_relationships" CASCADE;
  DROP TABLE "authority_gaps_target_recommendation_queries" CASCADE;
  DROP TABLE "authority_gaps_evidence_urls" CASCADE;
  DROP TABLE "authority_gaps" CASCADE;
  DROP TABLE "competitors_known_strengths" CASCADE;
  DROP TABLE "competitors_target_queries_where_they_appear" CASCADE;
  DROP TABLE "competitors_entity_tags" CASCADE;
  DROP TABLE "competitors_evidence_urls" CASCADE;
  DROP TABLE "competitors" CASCADE;
  DROP TABLE "query_authority_scores_mentioned_entities" CASCADE;
  DROP TABLE "query_authority_scores_competitor_names" CASCADE;
  DROP TABLE "query_authority_scores_cited_urls" CASCADE;
  DROP TABLE "query_authority_scores_citations" CASCADE;
  DROP TABLE "query_authority_scores_source_urls" CASCADE;
  DROP TABLE "query_authority_scores" CASCADE;
  DROP TABLE "insight_extractions_claims_evidence_urls" CASCADE;
  DROP TABLE "insight_extractions_claims_target_recommendation_queries" CASCADE;
  DROP TABLE "insight_extractions_claims_entity_tags" CASCADE;
  DROP TABLE "insight_extractions_claims" CASCADE;
  DROP TABLE "insight_extractions_evidence_urls" CASCADE;
  DROP TABLE "insight_extractions_entity_tags" CASCADE;
  DROP TABLE "insight_extractions_target_recommendation_queries" CASCADE;
  DROP TABLE "insight_extractions_source_urls" CASCADE;
  DROP TABLE "insight_extractions" CASCADE;
  DROP TABLE "entity_pages_target_questions" CASCADE;
  DROP TABLE "entity_pages_target_recommendation_queries" CASCADE;
  DROP TABLE "entity_pages_entity_tags" CASCADE;
  DROP TABLE "entity_pages_faq_entity_tags" CASCADE;
  DROP TABLE "entity_pages_faq_target_recommendation_queries" CASCADE;
  DROP TABLE "entity_pages_faq" CASCADE;
  DROP TABLE "entity_pages_internal_links_source_entity_tags" CASCADE;
  DROP TABLE "entity_pages_internal_links_target_entity_tags" CASCADE;
  DROP TABLE "entity_pages_internal_links" CASCADE;
  DROP TABLE "entity_pages" CASCADE;
  DROP TABLE "pillar_pages_target_questions" CASCADE;
  DROP TABLE "pillar_pages_target_recommendation_queries" CASCADE;
  DROP TABLE "pillar_pages_entity_tags" CASCADE;
  DROP TABLE "pillar_pages_faq_entity_tags" CASCADE;
  DROP TABLE "pillar_pages_faq_target_recommendation_queries" CASCADE;
  DROP TABLE "pillar_pages_faq" CASCADE;
  DROP TABLE "pillar_pages_internal_links_source_entity_tags" CASCADE;
  DROP TABLE "pillar_pages_internal_links_target_entity_tags" CASCADE;
  DROP TABLE "pillar_pages_internal_links" CASCADE;
  DROP TABLE "pillar_pages" CASCADE;
  DROP TABLE "cluster_pages_target_questions" CASCADE;
  DROP TABLE "cluster_pages_target_recommendation_queries" CASCADE;
  DROP TABLE "cluster_pages_entity_tags" CASCADE;
  DROP TABLE "cluster_pages_faq_entity_tags" CASCADE;
  DROP TABLE "cluster_pages_faq_target_recommendation_queries" CASCADE;
  DROP TABLE "cluster_pages_faq" CASCADE;
  DROP TABLE "cluster_pages_internal_links_source_entity_tags" CASCADE;
  DROP TABLE "cluster_pages_internal_links_target_entity_tags" CASCADE;
  DROP TABLE "cluster_pages_internal_links" CASCADE;
  DROP TABLE "cluster_pages" CASCADE;
  DROP TABLE "frameworks_target_questions" CASCADE;
  DROP TABLE "frameworks_target_recommendation_queries" CASCADE;
  DROP TABLE "frameworks_entity_tags" CASCADE;
  DROP TABLE "frameworks_faq_entity_tags" CASCADE;
  DROP TABLE "frameworks_faq_target_recommendation_queries" CASCADE;
  DROP TABLE "frameworks_faq" CASCADE;
  DROP TABLE "frameworks_internal_links_source_entity_tags" CASCADE;
  DROP TABLE "frameworks_internal_links_target_entity_tags" CASCADE;
  DROP TABLE "frameworks_internal_links" CASCADE;
  DROP TABLE "frameworks" CASCADE;
  DROP TABLE "case_studies_target_questions" CASCADE;
  DROP TABLE "case_studies_target_recommendation_queries" CASCADE;
  DROP TABLE "case_studies_entity_tags" CASCADE;
  DROP TABLE "case_studies_faq_entity_tags" CASCADE;
  DROP TABLE "case_studies_faq_target_recommendation_queries" CASCADE;
  DROP TABLE "case_studies_faq" CASCADE;
  DROP TABLE "case_studies_internal_links_source_entity_tags" CASCADE;
  DROP TABLE "case_studies_internal_links_target_entity_tags" CASCADE;
  DROP TABLE "case_studies_internal_links" CASCADE;
  DROP TABLE "case_studies" CASCADE;
  DROP TABLE "faqs_target_questions" CASCADE;
  DROP TABLE "faqs_target_recommendation_queries" CASCADE;
  DROP TABLE "faqs_entity_tags" CASCADE;
  DROP TABLE "faqs_faq_entity_tags" CASCADE;
  DROP TABLE "faqs_faq_target_recommendation_queries" CASCADE;
  DROP TABLE "faqs_faq" CASCADE;
  DROP TABLE "faqs_internal_links_source_entity_tags" CASCADE;
  DROP TABLE "faqs_internal_links_target_entity_tags" CASCADE;
  DROP TABLE "faqs_internal_links" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "glossary_terms_target_questions" CASCADE;
  DROP TABLE "glossary_terms_target_recommendation_queries" CASCADE;
  DROP TABLE "glossary_terms_entity_tags" CASCADE;
  DROP TABLE "glossary_terms_faq_entity_tags" CASCADE;
  DROP TABLE "glossary_terms_faq_target_recommendation_queries" CASCADE;
  DROP TABLE "glossary_terms_faq" CASCADE;
  DROP TABLE "glossary_terms_internal_links_source_entity_tags" CASCADE;
  DROP TABLE "glossary_terms_internal_links_target_entity_tags" CASCADE;
  DROP TABLE "glossary_terms_internal_links" CASCADE;
  DROP TABLE "glossary_terms" CASCADE;
  DROP TABLE "lead_magnets_target_questions" CASCADE;
  DROP TABLE "lead_magnets_target_recommendation_queries" CASCADE;
  DROP TABLE "lead_magnets_entity_tags" CASCADE;
  DROP TABLE "lead_magnets_faq_entity_tags" CASCADE;
  DROP TABLE "lead_magnets_faq_target_recommendation_queries" CASCADE;
  DROP TABLE "lead_magnets_faq" CASCADE;
  DROP TABLE "lead_magnets_internal_links_source_entity_tags" CASCADE;
  DROP TABLE "lead_magnets_internal_links_target_entity_tags" CASCADE;
  DROP TABLE "lead_magnets_internal_links" CASCADE;
  DROP TABLE "lead_magnets" CASCADE;
  DROP TABLE "email_subscribers_tags" CASCADE;
  DROP TABLE "email_subscribers" CASCADE;
  DROP TABLE "research_sources_supported_claims" CASCADE;
  DROP TABLE "research_sources" CASCADE;
  DROP TABLE "internal_links_source_entity_tags" CASCADE;
  DROP TABLE "internal_links_target_entity_tags" CASCADE;
  DROP TABLE "internal_links" CASCADE;
  DROP TABLE "content_jobs_target_recommendation_queries" CASCADE;
  DROP TABLE "content_jobs_source_insight_ids" CASCADE;
  DROP TABLE "content_jobs" CASCADE;
  DROP TABLE "agent_runs_errors" CASCADE;
  DROP TABLE "agent_runs" CASCADE;
  DROP TABLE "query_authority_scorecards_mentioned_entities" CASCADE;
  DROP TABLE "query_authority_scorecards_cited_urls" CASCADE;
  DROP TABLE "query_authority_scorecards_citations" CASCADE;
  DROP TABLE "query_authority_scorecards_competitors_recommended" CASCADE;
  DROP TABLE "query_authority_scorecards_source_urls" CASCADE;
  DROP TABLE "query_authority_scorecards" CASCADE;
  DROP TABLE "competitor_contracts_known_strengths" CASCADE;
  DROP TABLE "competitor_contracts_target_queries_where_they_appear" CASCADE;
  DROP TABLE "competitor_contracts_source_urls" CASCADE;
  DROP TABLE "competitor_contracts" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_entities_entity_type";
  DROP TYPE "public"."enum_entities_authority_tier";
  DROP TYPE "public"."enum_entities_status";
  DROP TYPE "public"."enum_entity_relationships_relationship_type";
  DROP TYPE "public"."enum_entity_relationships_status";
  DROP TYPE "public"."enum_authority_gaps_gap_type";
  DROP TYPE "public"."enum_authority_gaps_lifecycle_status";
  DROP TYPE "public"."enum_authority_gaps_owner_agent";
  DROP TYPE "public"."enum_competitors_status";
  DROP TYPE "public"."enum_query_authority_scores_sentiment";
  DROP TYPE "public"."enum_query_authority_scores_gap_classification";
  DROP TYPE "public"."enum_query_authority_scores_suggested_owning_agent";
  DROP TYPE "public"."enum_query_authority_scores_authority_tier";
  DROP TYPE "public"."enum_query_authority_scores_status";
  DROP TYPE "public"."enum_insight_extractions_source_type";
  DROP TYPE "public"."enum_insight_extractions_status";
  DROP TYPE "public"."enum_entity_pages_entity_tags_tag";
  DROP TYPE "public"."enum_entity_pages_schema_type";
  DROP TYPE "public"."enum_entity_pages_status";
  DROP TYPE "public"."enum_pillar_pages_entity_tags_tag";
  DROP TYPE "public"."enum_pillar_pages_schema_type";
  DROP TYPE "public"."enum_pillar_pages_status";
  DROP TYPE "public"."enum_cluster_pages_entity_tags_tag";
  DROP TYPE "public"."enum_cluster_pages_schema_type";
  DROP TYPE "public"."enum_cluster_pages_status";
  DROP TYPE "public"."enum_frameworks_entity_tags_tag";
  DROP TYPE "public"."enum_frameworks_schema_type";
  DROP TYPE "public"."enum_frameworks_status";
  DROP TYPE "public"."enum_case_studies_entity_tags_tag";
  DROP TYPE "public"."enum_case_studies_schema_type";
  DROP TYPE "public"."enum_case_studies_status";
  DROP TYPE "public"."enum_faqs_entity_tags_tag";
  DROP TYPE "public"."enum_faqs_schema_type";
  DROP TYPE "public"."enum_faqs_status";
  DROP TYPE "public"."enum_glossary_terms_entity_tags_tag";
  DROP TYPE "public"."enum_glossary_terms_schema_type";
  DROP TYPE "public"."enum_glossary_terms_status";
  DROP TYPE "public"."enum_lead_magnets_entity_tags_tag";
  DROP TYPE "public"."enum_lead_magnets_schema_type";
  DROP TYPE "public"."enum_lead_magnets_status";
  DROP TYPE "public"."enum_email_subscribers_status";
  DROP TYPE "public"."enum_research_sources_trust_level";
  DROP TYPE "public"."enum_internal_links_review_status";
  DROP TYPE "public"."enum_content_jobs_target_entity";
  DROP TYPE "public"."enum_content_jobs_intent_stage";
  DROP TYPE "public"."enum_content_jobs_status";
  DROP TYPE "public"."enum_agent_runs_agent_name";
  DROP TYPE "public"."enum_agent_runs_status";
  DROP TYPE "public"."enum_query_authority_scorecards_sentiment";
  DROP TYPE "public"."enum_query_authority_scorecards_gap_classification";
  DROP TYPE "public"."enum_query_authority_scorecards_suggested_owning_agent";
  DROP TYPE "public"."enum_query_authority_scorecards_capture_mode";
  DROP TYPE "public"."enum_query_authority_scorecards_review_status";
  DROP TYPE "public"."enum_competitor_contracts_capture_mode";
  DROP TYPE "public"."enum_competitor_contracts_review_status";`)
}
