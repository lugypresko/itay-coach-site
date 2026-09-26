"use client";
import {useEffect,useRef,useState,type FormEvent} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {track} from '@vercel/analytics';
import type {view,Action,Step} from '@/lib/push-conversation';
import './push-conversation.css';
type View=ReturnType<typeof view>;
export function PushConversation(_props:Record<string,unknown> = {}){
 const [v,setV]=useState<View|null>(null),[started,setStarted]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(''),[text,setText]=useState(''),[category,setCategory]=useState('unclear'),[local,setLocal]=useState(false);
 const heading=useRef<HTMLHeadingElement>(null);const errorMessage=useRef<HTMLDivElement>(null);const pending=useRef<Action|null>(null);const [name,setName]=useState(''),[email,setEmail]=useState(''),[processing,setProcessing]=useState(false),[marketing,setMarketing]=useState(false);
 async function restore(){setBusy(true);setError('');try{const r=await fetch('/api/player-trap/conversation',{cache:'no-store'});if(!r.ok)throw Error('Unable to restore your conversation. Please retry.');const d=await r.json();setV(d.view);setLocal(d.localReview);if(d.view.turns.length)setStarted(true);}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
 useEffect(()=>{void restore();},[]);
 useEffect(()=>{if(started)heading.current?.focus();},[v?.step,started]);
 useEffect(()=>{if(error)errorMessage.current?.focus();},[error]);
 async function send(answer:string,contact?:Action['contact']){
  if(!v||busy)return;setBusy(true);setError('');
  const next={expected:v.step,answer,category,contact};
  if(!pending.current || JSON.stringify({...pending.current,operation:undefined})!==JSON.stringify(next))pending.current={...next,operation:crypto.randomUUID()};
  try{const attribution:Record<string,string>={};const params=new URLSearchParams(location.search);for(const key of ['source','medium','campaign','content','term']){const value=params.get(`utm_${key}`);if(value&&/^[a-zA-Z0-9_.-]{1,80}$/.test(value))attribution[`utm${key[0].toUpperCase()}${key.slice(1)}`]=value;}
   const r=await fetch('/api/player-trap/conversation',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...pending.current,attribution})});const d=await r.json();if(!r.ok)throw Error(d.error||'Could not save your answer.');
   if(!d.replayed){const fields={step:v.step,route:d.view.route??'pending'};track('diagnostic_turn_completed',fields);if(d.view.step==='insight')track('diagnostic_micro_insight_delivered',fields);if(contact)track('diagnostic_contact_earned',fields);if(d.view.requested&&!v.requested)track('request_to_talk_submitted',fields);}
   setV(d.view);setText(d.view.step==='incident'?d.view.incident:'');pending.current=null;
  }catch(e){setError((e as Error).message);}finally{setBusy(false);}
 }
 const contact=v&&['contact','talk_contact'].includes(v.step);
 const textStep=v&&['incident','impact'].includes(v.step);
 const progress:Partial<Record<Step,string>>={incident:'SEE',reflection:'SEE',role:'SEE',pain:'SEE',impact:'SEE',why:'SEE',fork:'CHALLENGE',insight:'MOVE'};
 const submit=(e:FormEvent)=>{e.preventDefault();void send('submit',{name,email,processing,marketing});};
 return <div className={`push-diagnostic ${started?'is-active':''}`}>
 {!started?<section className="push-intro"><div><p className="push-eyebrow">The Push · One real situation</p><h1>What keeps coming back to you—and why?</h1><p className="push-lead">Bring one real leadership situation. We’ll examine the pattern, challenge the first explanation and identify one small move to test.</p><button className="push-primary" disabled={!v||busy} onClick={()=>{setStarted(true);track('diagnostic_started',{step:'incident'});}}>Diagnose one situation</button><p>No contact details required to receive your diagnosis.</p></div><aside className="push-credibility"><Image src="/itay-home-photo.jpg" alt="Itay Foyerstein" width={100} height={124}/><p><strong>I’m Itay.</strong> 25+ years across technology, product, delivery and organizational change. 1,000+ coaching hours.</p></aside><details><summary>How this works</summary><p>SEE the situation. CHALLENGE the first explanation. MOVE with one practical experiment. READ the response and ADJUST afterward. You can do this independently.</p></details></section>:v?<section className="push-chat" aria-busy={busy}>
 <p className="push-eyebrow">{progress[v.step]??'Your next step'} · One situation at a time</p>
 {v.turns.length>0&&<details className="push-history"><summary>Your conversation so far</summary>{v.turns.map((t,i)=><div key={i}><strong>{t.label}</strong><p>{t.answer}</p></div>)}</details>}
 <h1 ref={heading} tabIndex={-1}>{v.prompt.title}</h1><p>{v.prompt.help}</p>
 {v.step==='reflection'&&<><blockquote>{v.incident}</blockquote><p className="push-reflection">{v.reflection}</p><label htmlFor="pattern">Which part of this situation should we examine?</label><select id="pattern" value={category} onChange={e=>setCategory(e.target.value)}><option value="unclear">Not clear yet</option><option value="decision_escalation">A decision came back to me</option><option value="ownership">Ownership came back to me</option><option value="coordination">I had to connect teams or people</option><option value="capacity">Pressure crowded out leadership work</option></select></>}
 {v.diagnosis&&<article className="push-insight"><p className="push-eyebrow">Working hypothesis · not a verdict</p><h2>{v.diagnosis.hypothesis}</h2><blockquote>{v.diagnosis.observed}</blockquote><p>{v.diagnosis.explanation}</p><h3>One move to try</h3><p>{v.diagnosis.move}</p><h3>What to watch</h3><p>{v.diagnosis.measure}</p><details><summary>What could change this explanation?</summary><p>{v.diagnosis.openQuestion}</p><ul>{v.diagnosis.signals.map(x=><li key={x}>{x}</li>)}</ul></details><p className="push-boundary">{v.diagnosis.limitation}</p><p>READ and ADJUST: pending real-world evidence.</p></article>}
 {textStep&&<form onSubmit={e=>{e.preventDefault();void send(text);}}><label htmlFor="answer">{v.prompt.title}</label><textarea id="answer" rows={4} value={text} maxLength={4000} onChange={e=>setText(e.target.value)} required minLength={10}/><button className="push-primary" disabled={busy}>{busy?'Saving…':'Continue'}</button></form>}
 {contact&&<form onSubmit={submit}><label htmlFor="contact-name">Name</label><input id="contact-name" name="name" autoComplete="given-name" required maxLength={100} value={name} onChange={e=>setName(e.target.value)}/><label htmlFor="contact-email">Email</label><input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={e=>setEmail(e.target.value)}/><label className="push-check"><input type="checkbox" checked={processing} required onChange={e=>setProcessing(e.target.checked)}/>I acknowledge the processing of my details and diagnostic for this request. <Link href="/privacy">Privacy policy</Link></label><label className="push-check"><input type="checkbox" checked={marketing} onChange={e=>setMarketing(e.target.checked)}/>Optional: I would like updates from Itay.</label><button className="push-primary" disabled={busy}>{busy?'Saving…':v.step==='talk_contact'?'Submit conversation request':'Save my details'}</button><button className="push-secondary" type="button" disabled={busy} onClick={()=>void send('skip')}>Continue without contact details</button></form>}
 {v.prompt.choices&&<div className="push-choices">{v.prompt.choices.map((c,i)=><button key={c.value} className={i===0?'push-primary':'push-secondary'} disabled={busy} onClick={()=>void send(c.value)}>{c.label}</button>)}</div>}
 {v.step==='route'&&v.route!=='TALK_NOW'&&<Link href="/entities/the-push">Understand the engagement</Link>}
 </section>:null}
 {error&&<div className="push-error" role="alert" tabIndex={-1} ref={errorMessage}><p>{error}</p>{!v&&<button onClick={()=>void restore()}>Retry connection</button>}{v&&<p>Your input is preserved. Retry the same action when ready.</p>}</div>}
 {local&&<p className="push-review">Local review environment. Data stays in a local test store; no email is sent.</p>}
 </div>;
}
