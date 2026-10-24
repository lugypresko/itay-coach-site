import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import pg from 'pg';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { normalizedStore } from '@/lib/diagnostic-v3/normalized-store';
import { newSession, save, Conflict } from '@/lib/diagnostic-v3/store';
import { act } from '@/lib/diagnostic-v3/service';
import { partialFallback } from '@/lib/diagnostic-v3/analysis';
import { analyze } from '@/lib/diagnostic-v3/analysis';
import type { Answers } from '@/lib/diagnostic-v3/contracts';
let db:PGlite;
let store:ReturnType<typeof normalizedStore>;
const high:Answers={situation:'decision',absence:'wait',owner:'manager',authority:'checks',duration:'long',frequency:'several',attempts:['owner','decide'],impact:['customer','delivery'],desired:'own',context:'Two teams wait for the release decision despite an assigned owner.'};
const identity={first_name:'Synthetic',email:'synthetic@example.invalid',company:'Synthetic QA'};
beforeEach(async()=>{
  vi.stubEnv('DIAGNOSTIC_V3_AI_ENABLED','false');
  db=new PGlite();
  await db.exec(readFileSync('tests/fixtures/diagnostic-v3-schema.sql','utf8'));
  const client={query:async(sql:string,params?:unknown[])=>{
    const r=await db.query(sql,params);return {rows:r.rows,rowCount:r.affectedRows??r.rows.length};
  },release:()=>{}};
  store=normalizedStore({connect:async()=>client,query:client.query} as unknown as InstanceType<typeof pg.Pool>);
},30000);
afterEach(async()=>{await db.close();vi.unstubAllEnvs();});
async function fresh(){const s=newSession();s.origin='synthetic';await store.create(s,'test-private');return s;}
async function journey(answers:Answers,qualification?:{role:'vp'|'other';org_size:'51_100'},skip=false){
 const s=await fresh();
 // Start is an API operation; persist its state just as the route does.
 s.stage='answering';s.events.push('0:start');await save(store,s,s.record_version);
 const fields=['situation','absence','owner','authority','duration','attempts','impact','desired','context'] as const;
 const current:Answers={};
 for(let i=0;i<9;i++){
   Object.assign(current,{[fields[i]]:answers[fields[i]]});if(i===4)current.frequency=answers.frequency;
   await act(store,s,{action:'answers',answers:{...current},step:Math.min(i+1,8),completed_step:i+1,expected_version:s.record_version});
 }
 await act(store,s,{action:'partial',expected_version:s.record_version});
 await store.recordViews!(s,['partial_result_view','identity_gate_view']);
 await act(store,s,{action:'identify',identity,expected_version:s.record_version});
 await store.recordViews!(s,['full_result_view']);
 if(qualification||skip)await act(store,s,{action:'qualification',qualification,skip,expected_version:s.record_version});
 return s;
}
describe('normalized PostgreSQL application persistence',()=>{
 it.each([
  ['conversation',high,{role:'vp',org_size:'51_100'},false],
  ['nurture',high,{role:'other',org_size:'51_100'},false],
  ['self_service',{...high,absence:'handles',impact:['time'],frequency:'occasionally'},{role:'vp',org_size:'51_100'},false],
  ['unqualified_nurture',high,undefined,true],
 ] as const)('persists and restores the complete %s journey',async(route,answers,q,skip)=>{
   const s=await journey({...answers,attempts:[...answers.attempts!],impact:[...answers.impact!]},q,skip);
   const restored=await store.read('test-private');
   expect(restored?.scoring.route).toBe(route);expect(restored?.answers).toEqual(s.answers);
   expect(restored?.identity).toEqual(identity);expect(restored?.full?.id).toBeTruthy();
   expect(JSON.parse(restored!.sales_brief!)).toMatchObject({route,unresolved_question:expect.any(String)});
   const rows=await db.query<{payload:Record<string,unknown>}>('SELECT payload FROM diagnostic_v3_sessions WHERE id=$1',[s.id]);
   for(const field of ['answers','partial','full','identity','scoring','qualification','events','sales_brief'])expect(rows.rows[0].payload).not.toHaveProperty(field);
   const events=await db.query<{event_name:string}>('SELECT event_name FROM diagnostic_v3_events WHERE session_id=$1',[s.id]);
   expect(events.rows.map(r=>r.event_name)).toEqual(expect.arrayContaining(['diagnostic_start','q9_complete','partial_result_view','identity_submit','full_result_view',`route_${route}`]));
   await store.remove('test-private');expect(await store.read('test-private')).toBeNull();
   expect((await db.query('SELECT * FROM diagnostic_v3_analyses')).rows).toHaveLength(0);
 },30000);
 it('persists validated Groq output and ignores contaminated legacy payload fields',async()=>{
   const s=await fresh();s.answers=high;s.answer_revision=1;await save(store,s,0);
   vi.stubEnv('DIAGNOSTIC_V3_AI_ENABLED','true');vi.stubEnv('GROQ_ZDR_VERIFIED','true');vi.stubEnv('GROQ_API_KEY','synthetic-key');
   vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response(JSON.stringify({id:'synthetic-request',model:'synthetic-returned-model',choices:[{message:{content:JSON.stringify(partialFallback(high))}}]}),{status:200})));
   await act(store,s,{action:'partial',expected_version:s.record_version});
   expect(s.partial?.source).toBe('groq');
   await db.query(`UPDATE diagnostic_v3_sessions SET payload=payload || '{"answers":{"context":"WRONG"},"scoring":{"route":"WRONG"},"identity":{"email":"WRONG"}}'::jsonb WHERE id=$1`,[s.id]);
   const restored=await store.read('test-private');expect(restored?.answers).toEqual(high);expect(restored?.identity).toBeUndefined();expect(restored?.partial?.returned_model).toBe('synthetic-returned-model');
   vi.unstubAllGlobals();
 },30000);
 it('records a failed Groq attempt separately from its validated fallback',async()=>{
   const s=await fresh();s.answers=high;s.answer_revision=1;await save(store,s,0);
   vi.stubEnv('DIAGNOSTIC_V3_AI_ENABLED','true');vi.stubEnv('GROQ_ZDR_VERIFIED','true');vi.stubEnv('GROQ_API_KEY','synthetic-key');
   vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response('{}',{status:503})));
   await act(store,s,{action:'partial',expected_version:s.record_version});
   const rows=await db.query<{provider:string;status:string;is_selected:boolean;output:unknown}>('SELECT provider,status,is_selected,output FROM diagnostic_v3_analyses ORDER BY attempt_number');
   expect(rows.rows[0]).toMatchObject({provider:'groq',status:'rejected',is_selected:false,output:null});
   expect(rows.rows[1]).toMatchObject({provider:'deterministic',status:'fallback',is_selected:true});
   vi.unstubAllGlobals();
 },30000);
 it('rejects stale selection but preserves its completed analysis attempt',async()=>{
   const s=await fresh();s.answers=high;s.answer_revision=1;await save(store,s,0);
   const stale=structuredClone(s);const id=await store.beginAnalysis!(stale,'partial');
   await act(store,s,{action:'answers',answers:{...high,context:'A new case revision'},step:8,expected_version:s.record_version});
   stale.partial=await analyze(stale.id,stale.answer_revision,stale.answers,'partial');
   stale.partial.id=await store.finishAnalysis!(stale,id,stale.partial);
   await expect(save(store,stale,stale.record_version)).rejects.toBeInstanceOf(Conflict);
   const rows=await db.query<{is_selected:boolean}>('SELECT is_selected FROM diagnostic_v3_analyses WHERE id=$1',[id]);
   expect(rows.rows[0].is_selected).toBe(false);expect((await store.read('test-private'))?.partial).toBeUndefined();
 },30000);
 it('changes Role/Org without new answers or a provider attempt; an edit invalidates current reads',async()=>{
   const s=await journey(high,{role:'vp',org_size:'51_100'});
   const rev=s.answer_revision;const count=(await db.query('SELECT id FROM diagnostic_v3_analyses')).rows.length;
   await act(store,s,{action:'qualification',qualification:{role:'other',org_size:'51_100'},expected_version:s.record_version});
   expect(s.answer_revision).toBe(rev);expect((await db.query('SELECT id FROM diagnostic_v3_analyses')).rows).toHaveLength(count);
   await act(store,s,{action:'answers',answers:{...high,context:'Edited answer'},step:8,expected_version:s.record_version});
   const restored=await store.read('test-private');expect(restored?.answer_revision).toBe(rev+1);expect(restored?.partial).toBeUndefined();expect(restored?.full).toBeUndefined();
   expect((await db.query('SELECT id FROM diagnostic_v3_analyses')).rows).toHaveLength(count);
 },30000);
});
