import {NextResponse} from 'next/server';
import {z} from 'zod';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {localMode} from '@/lib/push-store';
const schema=z.object({submissionId:z.string().uuid(),name:z.string().trim().min(1).max(100),email:z.string().trim().email().max(254),intent:z.enum(['self','manager']),context:z.string().min(10).max(4000),processing:z.literal(true),marketing:z.boolean(),website:z.string().optional()});
export async function POST(request:Request){const headers={'Cache-Control':'private, no-store','Referrer-Policy':'no-referrer'};const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return NextResponse.json({error:'Origin not allowed'},{status:403,headers});
 try{const raw=await request.text();if(raw.length>12000)return NextResponse.json({error:'Request too large'},{status:413,headers});const parsed=schema.safeParse(JSON.parse(raw));if(!parsed.success)return NextResponse.json({error:'Please complete the required fields and acknowledgement.'},{status:400,headers});const b=parsed.data;if(b.website)return NextResponse.json({ok:true},{headers});
 const now=new Date().toISOString();const data={submissionId:b.submissionId,name:b.name,email:b.email.toLowerCase(),status:'pending',source:'website-conversation',processingConsentAccepted:true,processingConsentAcceptedAt:now,marketingConsentAccepted:b.marketing,marketingConsentAcceptedAt:b.marketing?now:null,requestToTalkStatus:'requested',requestToTalkAt:now,diagnosticSnapshot:{supportFor:b.intent,context:b.context}};
 if(localMode()){const dir=path.join(process.cwd(),'.local-diagnostic');await mkdir(dir,{recursive:true});try{await writeFile(path.join(dir,`request-${b.submissionId}.json`),JSON.stringify(data),{flag:'wx',mode:0o600});}catch(e){if((e as NodeJS.ErrnoException).code!=='EEXIST')throw e;}}
 else{const {getServerPayload}=await import('@/lib/payload');const p=await getServerPayload();const existing=await p.find({collection:'email-subscribers',where:{submissionId:{equals:b.submissionId}},limit:1,overrideAccess:true});if(!existing.docs[0])await p.create({collection:'email-subscribers',data:data as never,overrideAccess:true});}
 return NextResponse.json({ok:true,localReview:localMode()},{headers});
 }catch{return NextResponse.json({error:'Unable to save your request. Please retry.'},{status:503,headers});}}
