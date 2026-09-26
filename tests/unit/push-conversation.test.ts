import {describe,it,expect} from 'vitest';
import {randomUUID} from 'node:crypto';
import {initialJourney,transition,view,type Journey,type Action} from '../../src/lib/push-conversation';
function answer(j:Journey,value:string,extra:Partial<Action>={}){return transition(j,{expected:j.step,operation:randomUUID(),answer:value,...extra});}
function ready(role='manager',pain='yes',category='decision_escalation'){
 let j=initialJourney();j=answer(j,'A release decision came back to me yesterday.');j=answer(j,'confirm',{category});j=answer(j,role);j=answer(j,pain);j=answer(j,'The team waited and delayed a release.');j=answer(j,'growth');j=answer(j,'B');return j;
}
describe('The Push server-owned journey',()=>{
 it.each([['manager','yes','decision_escalation','talk_now','TALK_NOW'],['manager','yes','ownership','later','NURTURE'],['other','yes','capacity','talk_now','NO_FIT'],['manager','unclear','unclear','talk_now','INSUFFICIENT_EVIDENCE']])('routes %s / %s / %s / %s to %s',(role,pain,category,intent,route)=>{let j=ready(role,pain,category);expect(j.step).toBe('insight');expect(view(j).diagnosis?.move).toBeTruthy();j=answer(j,'continue');j=answer(j,'skip');expect(j.step).toBe('diagnosis');expect(j.contact).toBe('skipped');j=answer(j,'continue');j=answer(j,intent);expect(j.route).toBe(route);expect(j.requested).toBe(false);});
 it('preserves original wording and corrections before interpretation',()=>{let j=answer(initialJourney(),'  A decision returned.\nI asked for context.  ');expect(j.answers.incident).toBe('  A decision returned.\nI asked for context.  ');j=answer(j,'correct');j=answer(j,'Correction: the owner needed authority.');expect(j.turns[0].answer).toContain('I asked for context');expect(j.answers.incident).toBe('Correction: the owner needed authority.');});
	it('rejects out-of-order answers and permits safe retries',()=>{const j=initialJourney();const a:Action={expected:'incident',operation:randomUUID(),answer:'A decision came back to me.'};const next=transition(j,a);expect(transition(next,a)).toEqual(next);expect(()=>transition(next,{...a,operation:randomUUID()})).toThrow('not expected');});
	it('rejects the same operation with a changed payload',()=>{const a:Action={expected:'incident',operation:randomUUID(),answer:'A decision came back to me.'};const next=transition(initialJourney(),a);expect(()=>transition(next,{...a,answer:'A different decision came back to me.'})).toThrow('Operation payload changed.');});
 it('requires earned contact, separate processing consent, and minimal late contact',()=>{let j=ready();j=answer(j,'continue');expect(()=>answer(j,'submit',{contact:{name:'QA',email:'qa@example.com',processing:false,marketing:true}})).toThrow();j=answer(j,'skip');j=answer(j,'continue');j=answer(j,'talk_now');j=answer(j,'request');expect(j.step).toBe('talk_contact');expect(view(j).diagnosis).toBeTruthy();j=answer(j,'submit',{contact:{name:'QA',email:'qa@example.com',processing:true,marketing:false}});expect(j.requested).toBe(true);expect(JSON.stringify(view(j))).not.toContain('qa@example.com');});
 it('does not infer pain from confirming a reflection',()=>{let j=initialJourney();j=answer(j,'I was asked to approve an urgent release.');j=answer(j,'confirm',{category:'decision_escalation'});expect(j.answers.pain).toBeUndefined();});
 it('builds an incident-specific reflection and asks for clarification when evidence is thin',()=>{
  const decision=answer(initialJourney(),'The release decision came back to me after the team waited.');
  const conflict=answer(initialJourney(),'Two teams disagreed about ownership and I became the connector.');
  expect(view(decision).reflection).toContain('release decision');
  expect(view(conflict).reflection).toContain('teams');
  expect(view(decision).reflection).not.toEqual(view(conflict).reflection);
  expect(view(answer(initialJourney(),'Something happened.')).reflection).toMatch(/clarif|more detail/i);
 });
 it('preserves the complete safe view across serialization',()=>{const j=ready();expect(view(JSON.parse(JSON.stringify(j)))).toEqual(view(j));expect(JSON.stringify(view(j))).not.toMatch(/score|sessionId|token/);});
});
