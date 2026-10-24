import { createHash, randomUUID } from 'node:crypto';
import pg from 'pg';
import { ANALYSIS_VERSION, VERSION, answerReferences, type Session, type Analysis, type PartialAnalysis, type FullAnalysis } from './contracts';
import { score } from './scoring';
import { FIRST_READ_SYSTEM, FULL_READ_SYSTEM, PROVIDER_GUARDRAILS } from './prompts';
import { sanitizeCase, providerAnswers } from './analysis';
import type { Store } from './store';
const hash = (s: string) => createHash('sha256').update(s).digest('hex');
type Client = { query: (sql: string, params?: unknown[]) => Promise<{ rows: pg.QueryResultRow[]; rowCount: number | null }> };
type Read = Analysis<PartialAnalysis | FullAnalysis>;
const aliases: Record<string,string> = { view:'diagnostic_view',start:'diagnostic_start',book_call_click:'booking_click' };
const noCall = new Set(['ai_disabled','zdr_unverified','missing_key','unsafe_input']);
function metadata(s: Session) {
  return { step:s.step,stage:s.stage,identified_at:s.identified_at,return_hash:s.return_hash,
    return_expires_at:s.return_expires_at,mail:s.mail,origin:s.origin ?? 'live' };
}
function questionStatus(s: Session) {
  return Object.fromEntries(Object.entries(answerReferences).filter(([q])=>q!=='CASE_CONTEXT').map(([q,fields])=>{
    const seen=s.events.some(e=>e.split(':')[1]===`q${q.slice(1)}_complete`);
    const answered=fields.some(f=>Boolean(s.answers[f as keyof typeof s.answers]));
    return [q,answered?'answered':seen?'skipped':'unseen'];
  }));
}
export function normalizedStore(pool: InstanceType<typeof pg.Pool>): Store {
  async function transaction<T>(fn:(c:Client)=>Promise<T>):Promise<T> {
    const c=await pool.connect();
    try { await c.query('BEGIN'); const out=await fn(c); await c.query('COMMIT'); return out; }
    catch(e) { await c.query('ROLLBACK'); throw e; } finally { c.release(); }
  }
  async function events(c:Client,s:Session,names:string[]) {
    for(const key of names) {
      const colon=key.indexOf(':'); const rev=Number(key.slice(0,colon));
      const rawName=key.slice(colon+1).split(':')[0];
      const name=aliases[rawName] ?? rawName;
      await c.query(`INSERT INTO diagnostic_v3_events(session_id,answer_revision,session_record_version,event_name,idempotency_key,actor_kind,origin)
        SELECT $1,$2,$3,$4,$5,'visitor',$6 WHERE EXISTS(SELECT 1 FROM diagnostic_v3_revisions WHERE session_id=$1 AND answer_revision=$2)
        ON CONFLICT(session_id,idempotency_key) DO NOTHING`,[s.id,rev,s.record_version,name,key,s.origin??'live']);
    }
  }
  async function revision(c:Client,s:Session,origin=s.origin??'live') {
    const serialized=JSON.stringify(s.answers);
    await c.query(`INSERT INTO diagnostic_v3_revisions(session_id,answer_revision,questionnaire_version,answers,answers_sha256,question_status,origin)
      VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT DO NOTHING`,[s.id,s.answer_revision,VERSION,s.answers,hash(serialized),questionStatus(s),origin]);
    const r=await c.query('SELECT answers FROM diagnostic_v3_revisions WHERE session_id=$1 AND answer_revision=$2',[s.id,s.answer_revision]);
    // Compare canonical JSON, since PostgreSQL jsonb reorders object keys.
    if(hash(canonical(r.rows[0].answers))!==hash(canonical(s.answers))) throw new Error('Immutable answer revision mismatch');
  }
  async function hydrate(c:Client,row:pg.QueryResultRow):Promise<Session> {
    if(row.current_answer_revision===null) throw new Error('Legacy diagnostic requires explicit snapshot import');
    const [revs,analyses,leads,quals,ev]=await Promise.all([
      c.query('SELECT answers FROM diagnostic_v3_revisions WHERE session_id=$1 AND answer_revision=$2',[row.id,row.current_answer_revision]),
      c.query('SELECT * FROM diagnostic_v3_analyses WHERE session_id=$1 AND answer_revision=$2 AND analysis_version=$3 AND is_selected',[row.id,row.current_answer_revision,ANALYSIS_VERSION]),
      c.query('SELECT * FROM diagnostic_v3_leads WHERE session_id=$1',[row.id]),
      c.query('SELECT * FROM diagnostic_v3_qualifications WHERE session_id=$1 AND answer_revision=$2 AND id=$3',[row.id,row.current_answer_revision,row.current_qualification_id]),
      c.query('SELECT idempotency_key FROM diagnostic_v3_events WHERE session_id=$1 ORDER BY recorded_at,id',[row.id]),
    ]);
    const s:Session={...row.payload,id:row.id,diagnostic_version:VERSION,record_version:row.record_version,
      answer_revision:row.current_answer_revision,answers:revs.rows[0].answers,
      created_at:new Date(row.created_at).toISOString(),expires_at:new Date(row.expires_at).toISOString(),
      events:ev.rows.map(r=>r.idempotency_key),scoring:score(revs.rows[0].answers)};
    // Normalized rows alone supply these values, regardless of legacy payload contents.
    delete s.identity; delete s.qualification; delete s.partial; delete s.full; delete s.sales_brief;
    delete s.qualification_skipped;
    if(leads.rows[0]) {
      const l=leads.rows[0]; s.identity={first_name:l.first_name,email:l.email,company:l.company};
      if(l.sales_brief) s.sales_brief=JSON.stringify(l.sales_brief);
    }
    if(quals.rows[0]) {
      const q=quals.rows[0];
      if(q.qualification_status==='submitted') s.qualification={role:q.role,org_size:q.org_size};
      s.qualification_skipped=q.qualification_status==='skipped';
      s.scoring={scoring_version:q.scoring_version,fit_status:q.fit_status,fit:q.fit,pain:q.pain,urgency:q.urgency,readiness:q.readiness,total:q.total,route:q.route,rule:q.routing_rule};
    }
    for(const a of analyses.rows) {
      const read={id:a.id,session_id:s.id,answer_revision:a.answer_revision,analysis_version:ANALYSIS_VERSION,data:a.output,
        source:a.provider==='groq'?'groq':'fallback',model:a.requested_model,returned_model:a.returned_model??undefined,provider_request_id:a.provider_request_id??undefined,
        fallback_reason:a.fallback_reason??undefined,provider_status:a.provider_http_status??undefined,duration_ms:a.duration_ms??undefined} as Read;
      if(a.pass==='partial') s.partial=read as Analysis<PartialAnalysis>;
      else s.full=read as Analysis<FullAnalysis>;
    }
    if(!s.partial && ['partial','full'].includes(s.stage)) {s.stage='answering';s.step=8;}
    return s;
  }
  async function write(c:Client,s:Session) {
    await revision(c,s);
    const ids:Record<string,string|null>={partial:null,full:null};
    for(const pass of ['partial','full'] as const) {
      const a=s[pass]; if(!a) continue;
      if(a.answer_revision!==s.answer_revision||a.analysis_version!==ANALYSIS_VERSION||!a.id) throw new Error('Analysis revision/version mismatch');
      const r=await c.query(`SELECT id FROM diagnostic_v3_analyses WHERE id=$1 AND session_id=$2 AND answer_revision=$3 AND analysis_version=$4
        AND pass=$5 AND status IN ('succeeded','fallback') AND schema_valid AND semantic_valid`,[a.id,s.id,s.answer_revision,ANALYSIS_VERSION,pass]);
      if(!r.rows[0]) throw new Error('Analysis not validated');
      if(pass==='full') {
        const linked=await c.query('SELECT first_read_analysis_id FROM diagnostic_v3_analyses WHERE id=$1',[a.id]);
        if(linked.rows[0].first_read_analysis_id!==s.partial?.id) throw new Error('Full analysis linked to a different first read');
      }
      await c.query('UPDATE diagnostic_v3_analyses SET is_selected=false WHERE session_id=$1 AND answer_revision=$2 AND analysis_version=$3 AND pass=$4 AND is_selected AND id<>$5',[s.id,s.answer_revision,ANALYSIS_VERSION,pass,a.id]);
      await c.query('UPDATE diagnostic_v3_analyses SET is_selected=true WHERE id=$1',[a.id]); ids[pass]=a.id;
    }
    let qid:string|null=null;
    if(s.identity) {
      await c.query(`INSERT INTO diagnostic_v3_leads(session_id,identified_answer_revision,first_name,email,company) VALUES($1,$2,$3,$4,$5)
        ON CONFLICT(session_id) DO UPDATE SET first_name=EXCLUDED.first_name,email=EXCLUDED.email,company=EXCLUDED.company,updated_at=now()`,[s.id,s.answer_revision,s.identity.first_name,s.identity.email,s.identity.company]);
      const q=s.scoring=score(s.answers,s.qualification);
      const status=s.qualification?'submitted':s.qualification_skipped?'skipped':'not_provided';
      const old=await c.query('SELECT * FROM diagnostic_v3_qualifications WHERE session_id=$1 AND answer_revision=$2 ORDER BY qualification_revision DESC LIMIT 1',[s.id,s.answer_revision]);
      const prev=old.rows[0];
      if(prev && prev.role===(s.qualification?.role??null) && prev.org_size===(s.qualification?.org_size??null) && prev.qualification_status===status && prev.scoring_version===q.scoring_version) qid=prev.id;
      else {
        qid=randomUUID();
        if (status !== 'not_provided') await events(c,s,[`${s.answer_revision}:qualification_${status==='skipped'?'skipped':'submit'}:${qid}`,`${s.answer_revision}:route_${q.route}:${qid}`]);
        await c.query(`INSERT INTO diagnostic_v3_qualifications(id,session_id,answer_revision,qualification_revision,role,org_size,qualification_status,scoring_version,fit_status,fit,pain,urgency,readiness,total,score_components,route,routing_rule)
          VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,[qid,s.id,s.answer_revision,(prev?.qualification_revision??-1)+1,s.qualification?.role??null,s.qualification?.org_size??null,status,q.scoring_version,q.fit_status,q.fit,q.pain,q.urgency,q.readiness,q.total,{answers:s.answers,qualification:s.qualification??null,fit:q.fit,pain:q.pain,urgency:q.urgency,readiness:q.readiness},q.route,q.rule]);
      }
      // Rebuild the brief from current normalized-bound inputs; never retain an old revision's brief.
      const brief={answers:s.answers,pattern:s.full?.data.primary_pattern??s.partial?.data.primary_pattern??null,
        impact:s.answers.impact??[],attempts:s.answers.attempts??[],desired_outcome:s.answers.desired??null,
        analysis:s.full?.data??s.partial?.data??null,scores:q,route:q.route,
        unresolved_question:s.full?.data.unresolved_question??null};
      s.sales_brief=JSON.stringify(brief);
      await c.query(`UPDATE diagnostic_v3_leads SET sales_brief=$1,brief_answer_revision=$2,brief_analysis_id=$3,brief_qualification_id=$4,brief_updated_at=now(),updated_at=now() WHERE session_id=$5`,[brief,s.answer_revision,ids.full??ids.partial,qid,s.id]);
      await events(c,s,[`${s.answer_revision}:sales_brief_saved:${s.record_version}`]);
    }
    await events(c,s,s.events.filter(key=>!/^\d+:(qualification_submit|qualification_skipped|route_[a-z_]+)$/.test(key)));
    await c.query(`UPDATE diagnostic_v3_sessions SET current_answer_revision=$1,current_analysis_version=$2,current_qualification_id=$3,normalized_at=COALESCE(normalized_at,now()),payload=$4,record_version=$5,expires_at=$6 WHERE id=$7`,[s.answer_revision,ANALYSIS_VERSION,qid,metadata(s),s.record_version,s.expires_at,s.id]);
  }
  const api:Store={
    async create(s,auth) {await transaction(async c=>{
      await c.query('INSERT INTO diagnostic_v3_sessions(id,auth_hash,payload,record_version,expires_at) VALUES($1,$2,$3,$4,$5)',[s.id,hash(auth),metadata(s),s.record_version,s.expires_at]);
      await write(c,s);
    });},
    async read(auth) {return transaction(async c=>{
      const r=await c.query('SELECT * FROM diagnostic_v3_sessions WHERE auth_hash=$1 AND expires_at>now() FOR UPDATE',[hash(auth)]);
      if(!r.rows[0]) return null;
      const row=r.rows[0];
      if(row.current_answer_revision===null) {
        const legacy=row.payload as Session;
        // Explicit legacy snapshot: no invented attempts, views or qualification history.
        if(legacy.partial||legacy.full||legacy.identity) throw new Error('Legacy analyzed case requires offline snapshot migration');
        await revision(c,legacy,'legacy_snapshot');
        await c.query('UPDATE diagnostic_v3_sessions SET current_answer_revision=$1,current_analysis_version=$2,normalized_at=now(),payload=$3 WHERE id=$4',[legacy.answer_revision,ANALYSIS_VERSION,metadata(legacy),legacy.id]);
        row.current_answer_revision=legacy.answer_revision;row.payload=metadata(legacy);
      }
      return hydrate(c,row);
    });},
    async save(s,expected) {return transaction(async c=>{
      const r=await c.query('SELECT record_version,current_answer_revision FROM diagnostic_v3_sessions WHERE id=$1 AND expires_at>now() FOR UPDATE',[s.id]);
      if(!r.rows[0]||r.rows[0].record_version!==expected||s.answer_revision<r.rows[0].current_answer_revision) return false;
      const next={...s,record_version:expected+1};await write(c,next);s.sales_brief=next.sales_brief;return true;
    });},
    async remove(auth) {await pool.query('DELETE FROM diagnostic_v3_sessions WHERE auth_hash=$1',[hash(auth)]);},
    async consumeReturn(value,newAuth) {
      const r=await pool.query(`UPDATE diagnostic_v3_sessions SET auth_hash=$1,record_version=record_version+1,payload=payload-'return_hash'-'return_expires_at'
        WHERE payload->>'return_hash'=$2 AND (payload->>'return_expires_at')::timestamptz>now() AND expires_at>now()`,[hash(newAuth),hash(value)]);return r.rowCount===1;
    },
    async recordViews(s,names) {await transaction(c=>events(c,s,names.map(n=>`${s.answer_revision}:${n}`)));},
    async beginAnalysis(s,pass) {return transaction(async c=>{
      const lock=await c.query('SELECT current_answer_revision FROM diagnostic_v3_sessions WHERE id=$1 FOR UPDATE',[s.id]);
      if(lock.rows[0]?.current_answer_revision!==s.answer_revision) throw new Error('Stale analysis input');
      const safe=sanitizeCase(s.answers,s.identity?[s.identity.first_name,s.identity.email,s.identity.company]:[]);
      const provider=process.env.DIAGNOSTIC_V3_AI_ENABLED==='true'&&process.env.GROQ_ZDR_VERIFIED==='true'&&process.env.GROQ_API_KEY&&safe.safe?'groq':'deterministic';
      const first=pass==='full'?s.partial?.id:null;
      if(pass==='full') {
        const validated=await c.query("SELECT id FROM diagnostic_v3_analyses WHERE id=$1 AND session_id=$2 AND answer_revision=$3 AND analysis_version=$4 AND pass='partial' AND schema_valid AND semantic_valid AND status IN ('succeeded','fallback')",[first,s.id,s.answer_revision,ANALYSIS_VERSION]);
        if(!validated.rows[0]) throw new Error('Full analysis requires persisted first read');
      }
      await c.query("UPDATE diagnostic_v3_analyses SET status='timeout',completed_at=now(),failure_code='abandoned_request' WHERE session_id=$1 AND answer_revision=$2 AND analysis_version=$3 AND pass=$4 AND status='pending' AND started_at<now()-interval '2 minutes'",[s.id,s.answer_revision,ANALYSIS_VERSION,pass]);
      const id=randomUUID();
      await c.query(`INSERT INTO diagnostic_v3_analyses(id,session_id,answer_revision,analysis_version,pass,attempt_number,first_read_analysis_id,prompt_version,prompt_sha256,framework_version,validator_version,input_sha256,provider,requested_model)
        SELECT $1,$2,$3,$4,$5,COALESCE(MAX(attempt_number),0)+1,$6,$4,$7,'the-push-v1','evidence-v2',$8,$9,$10
        FROM diagnostic_v3_analyses WHERE session_id=$2 AND answer_revision=$3 AND analysis_version=$4 AND pass=$5`,[id,s.id,s.answer_revision,ANALYSIS_VERSION,pass,first,hash((pass==='partial'?FIRST_READ_SYSTEM:FULL_READ_SYSTEM)+PROVIDER_GUARDRAILS),hash(JSON.stringify({answers:providerAnswers(safe.answers),previous_analysis:pass==='full'?s.partial?.data:null,pass})),provider,provider==='groq'?(process.env.DIAGNOSTIC_V3_GROQ_MODEL??'openai/gpt-oss-20b'):'deterministic-v1']);
      await events(c,s,[`${s.answer_revision}:analysis_started:${id}`]);
      return id;
    });},
    async finishAnalysis(s,id,read) {return transaction(async c=>{
      await c.query('SELECT id FROM diagnostic_v3_sessions WHERE id=$1 FOR UPDATE',[s.id]);
      const row=(await c.query('SELECT * FROM diagnostic_v3_analyses WHERE id=$1 AND session_id=$2 AND answer_revision=$3 FOR UPDATE',[id,s.id,s.answer_revision])).rows[0];
      if(!row||row.status!=='pending') throw new Error('Analysis attempt unavailable');
      if(read.source==='fallback'&&row.provider==='groq'&&!noCall.has(read.fallback_reason??'')) {
        await c.query(`UPDATE diagnostic_v3_analyses SET status=$1,failure_code=$2,provider_http_status=$3,completed_at=now(),duration_ms=$4 WHERE id=$5`,[read.fallback_reason==='timeout'?'timeout':'rejected',read.fallback_reason??'provider_failed',read.provider_status??null,read.duration_ms??0,id]);
        const next=randomUUID();
        await c.query(`INSERT INTO diagnostic_v3_analyses(id,session_id,answer_revision,analysis_version,pass,attempt_number,first_read_analysis_id,prompt_version,prompt_sha256,framework_version,validator_version,input_sha256,provider,requested_model)
          SELECT $1,session_id,answer_revision,analysis_version,pass,attempt_number+1,first_read_analysis_id,prompt_version,prompt_sha256,framework_version,validator_version,input_sha256,'deterministic','deterministic-v1' FROM diagnostic_v3_analyses WHERE id=$2`,[next,id]);id=next;
      }
      await c.query(`UPDATE diagnostic_v3_analyses SET status=$1,provider=$2,returned_model=$3,provider_http_status=$4,schema_valid=true,semantic_valid=true,validation_checks=$5,fallback_reason=$6,output=$7,completed_at=now(),duration_ms=$8,provider_request_id=$10 WHERE id=$9`,[read.source==='groq'?'succeeded':'fallback',read.source==='groq'?'groq':'deterministic',read.returned_model??read.model,read.provider_status??null,{schema:true,evidence:true,sanitized:true},read.fallback_reason??null,read.data,read.duration_ms??0,id,read.provider_request_id??null]);
      const name=read.source==='groq'?'analysis_completed':'analysis_fallback_used';
      await c.query(`INSERT INTO diagnostic_v3_events(session_id,answer_revision,session_record_version,event_name,idempotency_key,actor_kind,origin,analysis_id) VALUES($1,$2,$3,$4,$5,'server',$6,$7) ON CONFLICT DO NOTHING`,[s.id,s.answer_revision,s.record_version,name,`${s.answer_revision}:${name}:${id}`,s.origin??'live',id]);
      return id;
    });},
  };
  return api;
}
function canonical(value:unknown):string {
  if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';
  if(value&&typeof value==='object')return '{'+Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>JSON.stringify(k)+':'+canonical(v)).join(',')+'}';
  return JSON.stringify(value);
}
