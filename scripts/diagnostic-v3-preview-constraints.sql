-- Preview-only assertions. All fixture changes are rolled back by the sentinel.
-- Project winter-resonance-15589128 / branch br-cold-credit-b9x1qomi.
DO $tests$
DECLARE
 a uuid := gen_random_uuid(); b uuid := gen_random_uuid();
 ai uuid := gen_random_uuid(); passed integer := 0; affected integer;
BEGIN
 BEGIN
  INSERT INTO public.diagnostic_v3_sessions(id,auth_hash,payload,expires_at)
   VALUES (a,encode(sha256(a::text::bytea),'hex'),'{}',now()+interval '1 day'),
          (b,encode(sha256(b::text::bytea),'hex'),'{}',now()+interval '1 day');
  INSERT INTO public.diagnostic_v3_revisions(session_id,answer_revision,questionnaire_version,answers,answers_sha256,origin)
   VALUES (a,0,'questions-v1','{}',repeat('a',64),'synthetic'),
          (b,0,'questions-v1','{}',repeat('b',64),'synthetic');
  SET CONSTRAINTS ALL IMMEDIATE;
  UPDATE public.diagnostic_v3_sessions SET record_version=record_version+1 WHERE id=a AND record_version=999;
  GET DIAGNOSTICS affected=ROW_COUNT;
  IF affected<>0 THEN RAISE EXCEPTION 'stale CAS unexpectedly wrote'; END IF;
  passed:=passed+1;
  BEGIN
   INSERT INTO public.diagnostic_v3_revisions(session_id,answer_revision,questionnaire_version,answers,answers_sha256)
    VALUES(a,0,'questions-v1','{}',repeat('a',64));
   RAISE EXCEPTION 'duplicate revision accepted';
  EXCEPTION WHEN unique_violation THEN passed:=passed+1; END;
  INSERT INTO public.diagnostic_v3_analyses(id,session_id,answer_revision,analysis_version,pass,attempt_number,prompt_version,prompt_sha256,framework_version,validator_version,input_sha256,provider,requested_model)
   VALUES(ai,a,0,'analysis-v2','partial',1,'first-read-v1',repeat('a',64),'the-push-v1','validator-v1',repeat('a',64),'groq','synthetic-model');
  BEGIN
   INSERT INTO public.diagnostic_v3_analyses(session_id,answer_revision,analysis_version,pass,attempt_number,prompt_version,prompt_sha256,framework_version,validator_version,input_sha256,provider,requested_model)
    VALUES(a,0,'analysis-v2','partial',2,'first-read-v1',repeat('a',64),'the-push-v1','validator-v1',repeat('a',64),'groq','synthetic-model');
   RAISE EXCEPTION 'duplicate pending analysis accepted';
  EXCEPTION WHEN unique_violation THEN passed:=passed+1; END;
  BEGIN
   INSERT INTO public.diagnostic_v3_analyses(session_id,answer_revision,analysis_version,pass,attempt_number,first_read_analysis_id,prompt_version,prompt_sha256,framework_version,validator_version,input_sha256,provider,requested_model)
    VALUES(b,0,'analysis-v2','full',1,ai,'full-read-v1',repeat('a',64),'the-push-v1','validator-v1',repeat('a',64),'groq','synthetic-model');
   RAISE EXCEPTION 'cross-session first read accepted';
  EXCEPTION WHEN foreign_key_violation THEN passed:=passed+1; END;
  INSERT INTO public.diagnostic_v3_leads(session_id,identified_answer_revision,first_name,email,company)
   VALUES(a,0,'Fictional','fictional-preview@example.com','Synthetic QA');
  BEGIN
   INSERT INTO public.diagnostic_v3_qualifications(session_id,answer_revision,qualification_revision,qualification_status,scoring_version,fit_status,pain,urgency,readiness,score_components,route,routing_rule)
    VALUES(a,0,0,'skipped','scoring-v1','unknown',0,0,0,'{}','conversation','1_missing_fit');
   RAISE EXCEPTION 'unknown fit conversation accepted';
  EXCEPTION WHEN check_violation THEN passed:=passed+1; END;
  BEGIN
   INSERT INTO public.diagnostic_v3_events(session_id,answer_revision,session_record_version,event_name,idempotency_key,actor_kind,origin)
    VALUES(a,0,0,'booking_complete','unconfirmed','visitor','synthetic');
   RAISE EXCEPTION 'unconfirmed booking accepted';
  EXCEPTION WHEN check_violation THEN passed:=passed+1; END;
  INSERT INTO public.diagnostic_v3_events(session_id,answer_revision,session_record_version,event_name,idempotency_key,actor_kind,origin,provider_name,provider_event_sha256,confirmation_source,confirmation_verified_at)
   VALUES(a,0,0,'booking_complete','confirmed-1','server','synthetic','synthetic',repeat('c',64),'verified_webhook',now());
  BEGIN
   INSERT INTO public.diagnostic_v3_events(session_id,answer_revision,session_record_version,event_name,idempotency_key,actor_kind,origin,provider_name,provider_event_sha256,confirmation_source,confirmation_verified_at)
    VALUES(a,0,0,'booking_complete','confirmed-2','server','synthetic','synthetic',repeat('c',64),'verified_webhook',now());
   RAISE EXCEPTION 'duplicate provider confirmation accepted';
  EXCEPTION WHEN unique_violation THEN passed:=passed+1; END;
  BEGIN
   UPDATE public.diagnostic_v3_sessions SET current_answer_revision=999,current_analysis_version='analysis-v2' WHERE id=a;
   RAISE EXCEPTION 'missing active revision accepted';
  EXCEPTION WHEN foreign_key_violation THEN passed:=passed+1; END;
  BEGIN
   INSERT INTO public.diagnostic_v3_events(session_id,answer_revision,session_record_version,event_name,idempotency_key,actor_kind,origin,provider_name,provider_event_sha256,confirmation_source,confirmation_verified_at)
    VALUES(a,0,0,'booking_complete','confirmed-1','server','synthetic','synthetic',repeat('d',64),'verified_webhook',now());
   RAISE EXCEPTION 'duplicate event accepted';
  EXCEPTION WHEN unique_violation THEN passed:=passed+1; END;
  RAISE EXCEPTION USING ERRCODE='ZX001',MESSAGE='rollback synthetic fixtures';
 EXCEPTION WHEN SQLSTATE 'ZX001' THEN NULL;
 END;
 IF passed<>9 THEN RAISE EXCEPTION 'expected nine assertions; got %',passed; END IF;
 RAISE NOTICE 'PASS: 9 constraint assertions; synthetic fixtures rolled back';
END
$tests$;
