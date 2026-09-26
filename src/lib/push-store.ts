import { createHash, randomBytes } from 'node:crypto';
import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';
import { initialJourney, type Journey, type Contact } from './push-conversation';

export const COOKIE='push_case';
export type RecordData={ key:string; expires:string; journey:Journey; attribution:Record<string,string>; contact?:Contact & { acceptedAt:string }; leadId?:string|number };
const folder=path.join(process.cwd(),'.local-diagnostic');
export function localMode(){return process.env.DIAGNOSTIC_LOCAL_STORE==='1' && process.env.NODE_ENV!=='production' && !process.env.VERCEL;}
export function keyFor(token:string){return createHash('sha256').update(token).digest('hex');}
export function tokenFrom(req:Request){const token=req.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith(`${COOKIE}=`))?.slice(COOKIE.length+1);return token&&/^[A-Za-z0-9_-]{43}$/.test(token)?token:null;}
export function cookie(token:string){return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400${localMode()?'':'; Secure'}`;}
export function payloadIntent(intent:Journey['intent']):'TALK_NOW'|'LATER'|'SELF_SERVE'|null{return intent==='talk_now'?'TALK_NOW':intent==='later'?'LATER':intent==='self_serve'?'SELF_SERVE':null;}
export async function createCase(){const token=randomBytes(32).toString('base64url'); const record:RecordData={key:keyFor(token),expires:new Date(Date.now()+86400000).toISOString(),journey:initialJourney(),attribution:{}};await saveCase(record);return {token,record};}
export async function readCase(key:string):Promise<RecordData|null>{
 if(!/^[a-f0-9]{64}$/.test(key))return null;
 if(localMode()){try {const r=JSON.parse(await readFile(path.join(folder,`${key}.json`),'utf8')) as RecordData;return Date.parse(r.expires)>Date.now()?r:null;}catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return null;throw e;}}
 const {getServerPayload}=await import('./payload');const p=await getServerPayload();
 const r=await p.find({collection:'diagnostic-sessions',where:{sessionId:{equals:key}},limit:1,overrideAccess:true});
 const doc=r.docs[0] as unknown as {expiresAt:string;signals:{push?:RecordData}}|undefined;
 return doc&&Date.parse(doc.expiresAt)>Date.now()?doc.signals?.push ?? null:null;
}
export async function saveCase(record:RecordData){
 if(localMode()){await mkdir(folder,{recursive:true});const file=path.join(folder,`${record.key}.json`);const tmp=`${file}.${randomBytes(6).toString('hex')}.tmp`;await writeFile(tmp,JSON.stringify(record),{mode:0o600});await rename(tmp,file);return;}
 const {getServerPayload}=await import('./payload');const p=await getServerPayload();
 const r=await p.find({collection:'diagnostic-sessions',where:{sessionId:{equals:record.key}},limit:1,overrideAccess:true});
 // Contact details belong to the Lead, not the anonymous session.
 const safe={...record};delete safe.contact;
 const data={sessionId:record.key,language:'en' as const,currentState:record.journey.step,answers:record.journey.answers,signals:{push:safe},completedTurns:record.journey.turns.length,expiresAt:record.expires,attribution:record.attribution};
 if(r.docs[0])await p.update({collection:'diagnostic-sessions',id:r.docs[0].id,data,overrideAccess:true});
 else await p.create({collection:'diagnostic-sessions',data,overrideAccess:true});
}
export async function saveLead(record:RecordData,contact?:Contact){
 if(localMode()){if(contact)record.contact={...contact,acceptedAt:new Date().toISOString()};record.leadId=record.leadId??record.key;return;}
 const {getServerPayload}=await import('./payload');const p=await getServerPayload();
 const found=await p.find({collection:'email-subscribers',where:{diagnosticSession:{equals:record.key}},limit:1,overrideAccess:true});
 const existing=found.docs[0];const now=new Date().toISOString();
 const data={diagnosticSession:record.key,diagnosticSnapshot:{answers:record.journey.answers,diagnosis:record.journey.category,route:record.journey.route,reasons:record.journey.reasons},explicitIntent:payloadIntent(record.journey.intent),dqlRoute:record.journey.route,routeReasonCodes:record.journey.reasons,...(record.journey.requested?{requestToTalkAt:now,requestToTalkStatus:'requested'}:{}),...(contact?{name:contact.name.trim(),email:contact.email.trim().toLowerCase(),processingConsentAccepted:true,processingConsentAcceptedAt:now,marketingConsentAccepted:contact.marketing,marketingConsentAcceptedAt:contact.marketing?now:null}:{}),...record.attribution};
 if(existing){await p.update({collection:'email-subscribers',id:existing.id,data:data as never,overrideAccess:true});record.leadId=existing.id;}
 else {if(!contact)throw new Error('Contact required.');const lead=await p.create({collection:'email-subscribers',data:{...data,status:'pending',source:'player-trap-diagnostic',leadSource:'player-trap',leadPath:'/player-trap',pageLanguage:'en',submissionId:record.key} as never,overrideAccess:true});record.leadId=lead.id;}
}
