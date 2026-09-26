import { NextResponse } from 'next/server';
import { transition, view, type Action } from '@/lib/push-conversation';
import { cookie, createCase, keyFor, localMode, readCase, saveCase, saveLead, tokenFrom } from '@/lib/push-store';
import { z } from 'zod';

export const runtime='nodejs';
const headers={'Cache-Control':'private, no-store','Referrer-Policy':'no-referrer'};
const locks=new Map<string,Promise<unknown>>();
function reply(data:unknown,status=200){return NextResponse.json(data,{status,headers});}
export async function GET(request:Request){
 try {const token=tokenFrom(request);const old=token?await readCase(keyFor(token)):null;
 if(old)return reply({view:view(old.journey),localReview:localMode()});
 const {token:created,record}=await createCase();return NextResponse.json({view:view(record.journey),localReview:localMode()},{headers:{...headers,'Set-Cookie':cookie(created)}});
 }catch{return reply({error:'The saved conversation is unavailable. Please retry.'},503);}
}
export async function POST(request:Request){
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return reply({error:'Origin not allowed.'},403);
 const token=tokenFrom(request);if(!token)return reply({error:'Start or restore your conversation first.'},401);
 const raw=await request.text();if(raw.length>12000)return reply({error:'Answer is too long.'},413);
 const schema=z.object({expected:z.enum(['incident','reflection','role','pain','impact','why','fork','insight','contact','diagnosis','intent','route','talk_contact']),operation:z.string().regex(/^[a-zA-Z0-9_-]{16,100}$/),answer:z.string().max(4000).optional(),category:z.string().max(40).optional(),contact:z.object({name:z.string().max(100),email:z.string().max(254),processing:z.boolean(),marketing:z.boolean()}).optional(),attribution:z.record(z.string(),z.string()).optional()}).strict();
 let action:Action & {attribution?:Record<string,string>};try{action=schema.parse(JSON.parse(raw));}catch{return reply({error:'Invalid request.'},400);}
 const key=keyFor(token);const previous=locks.get(key)??Promise.resolve();
 const run=previous.catch(()=>{}).then(async()=>{
 try {
 const record=await readCase(key);if(!record)return reply({error:'This session has expired. Start a new conversation.'},404);
 if(record.journey.operations.includes(action.operation))return reply({view:view(record.journey),replayed:true});
 if(action.contact&&(!['contact','talk_contact'].includes(record.journey.step)||action.answer==='skip'))return reply({error:'Contact is not expected.'},409);
 let next;try{next=transition(record.journey,action);}catch(e){return reply({error:(e as Error).message},409);}
 record.journey=next;
 if(action.attribution&&next.turns.length===1)for(const [k,v] of Object.entries(action.attribution)){if(/^utm(Source|Medium|Campaign|Content|Term)$/.test(k)&&typeof v==='string'&&/^[a-zA-Z0-9_.-]{1,80}$/.test(v))record.attribution[k]=v;}
 if(action.contact||next.requested||record.leadId)await saveLead(record,action.contact);
 await saveCase(record);return reply({view:view(next)});
 }catch{return reply({error:'We could not save this step. Your answer is still here; please retry.'},503);}
 });locks.set(key,run);try{return await run;}finally{if(locks.get(key)===run)locks.delete(key);}
}
