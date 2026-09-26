import { METHOD_BRANCHES, EXPERIMENT_LIBRARY, READ_SIGNALS } from './push-method-library';

export type Step = 'incident' | 'reflection' | 'role' | 'pain' | 'impact' | 'why' | 'fork' | 'insight' | 'contact' | 'diagnosis' | 'intent' | 'route' | 'talk_contact';
export type Route = 'TALK_NOW' | 'NURTURE' | 'NO_FIT' | 'INSUFFICIENT_EVIDENCE';
export type Choice = { value: string; label: string };
export type Turn = { step: Step; label: string; answer: string };
export type Contact = { name: string; email: string; processing: boolean; marketing: boolean };
export type Action = { expected: Step; operation: string; answer?: string; category?: string; contact?: Contact };
export type Journey = {
  version: 1; step: Step; answers: Record<string, string>; turns: Turn[];
  category: string; contact: 'offered' | 'skipped' | 'submitted';
  intent: string | null; route: Route | null; reasons: string[];
  operations: string[]; operationPayloads?: Record<string, string>; requested: boolean;
};
const choice = (value: string, label: string): Choice => ({value, label});
export const forks: Record<string, { question: string; choices: Choice[] }> = {
  decision_escalation: { question: 'Did they have enough context and authority to make this decision safely?', choices: [choice('A','Yes — they had enough'),choice('B','No — something important was missing'),choice('mixed','Partly, or I am not sure')] },
  ownership: { question: 'Did the owner know what they could decide without you?', choices: [choice('A','Yes — the boundary was clear'),choice('B','No — the boundary was unclear'),choice('mixed','It became unclear under pressure')] },
  coordination: { question: 'Did both sides have enough shared context to resolve this directly?', choices: [choice('A','Yes — but I was still the connector'),choice('B','No — shared context was missing'),choice('mixed','Partly, or I am not sure')] },
  capacity: { question: 'If the temporary load disappeared, would the leadership work fit back into your week?', choices: [choice('A','Yes — mostly'),choice('B','No — the role would still be overloaded'),choice('mixed','It would help, but not fully')] },
  unclear: { question: 'Has essentially the same situation happened before?', choices: [choice('A','Yes — a comparable situation'),choice('B','No — this was unusual'),choice('mixed','I do not have enough evidence yet')] },
};
export function initialJourney(): Journey {
  return {version:1,step:'incident',answers:{},turns:[],category:'unclear',contact:'offered',intent:null,route:null,reasons:[],operations:[],operationPayloads:{},requested:false};
}
function operationPayload(action: Action): string {
  return JSON.stringify({expected: action.expected, answer: action.answer ?? null, category: action.category ?? null, contact: action.contact ?? null});
}
export function prompt(j: Journey): { title: string; help: string; choices?: Choice[] } {
  const prompts: Record<Step, {title:string; help:string; choices?:Choice[]}> = {
    incident: {title:'Bring one real leadership situation.',help:'What happened, who was involved, and what came back to you? Use roles rather than names. Do not include confidential or identifying details.'},
    reflection: {title:'Did I capture the situation accurately?',help:'Your account is shown below in your own words. Confirm it or correct it before we interpret it.',choices:[choice('confirm','Yes, that is accurate'),choice('correct','I want to correct it')]},
    role: {title:'What responsibility do you hold?',help:'This helps put the situation at the right level.',choices:[choice('manager','Engineering or group manager'),choice('director','Director or head of engineering'),choice('vp','VP Engineering, VP R&D or CTO'),choice('other','Another role')]},
    pain: {title:'Is this something you want to change?',help:'An accurate description does not necessarily mean there is a problem.',choices:[choice('yes','Yes — it is getting in the way'),choice('no','No — my involvement seems appropriate'),choice('unclear','I am still working that out')]},
    impact: {title:'What changes when this happens?',help:'Describe the effect on decisions, people, delivery or your attention. No financial estimate is required.'},
    why: {title:'Why does this matter now?',help:'Choose the closest answer; urgency is not assumed.',choices:[choice('growth','My responsibility or organization has grown'),choice('pressure','The pressure or impact is increasing'),choice('leadership','Leading through others has become harder'),choice('later','I am exploring, with no immediate need')]},
    fork: forks[j.category] ? {title:forks[j.category].question,help:'This tests an explanation; it does not prove a cause.',choices:forks[j.category].choices} : {title:'What happened?',help:''},
    insight: {title:'One working hypothesis. One move to try.',help:'This is based on your account, not a verdict on your leadership.',choices:[choice('continue','Continue')]},
    contact: {title:'Would you like Itay to have your details?',help:'This is optional. Your diagnosis is available either way. Providing details does not request a conversation.'},
    diagnosis: {title:'Your situation, your next move.',help:'READ and ADJUST begin after you try the move. You can continue independently.',choices:[choice('continue','Choose what happens next')]},
    intent: {title:'What would be useful next?',help:'Choose freely. There is no requirement to speak with Itay.',choices:[choice('talk_now','Discuss this with Itay'),choice('later','Perhaps later'),choice('self_serve','I will try this myself')]},
    route: {title:j.requested?'Your conversation request has been received.':j.route==='TALK_NOW'?'A conversation could be useful.':j.route==='NO_FIT'?'A coaching conversation may not be the right next step.':j.route==='NURTURE'?'Keep this for when the timing is right.':'Continue with the experiment.',help:j.requested?'Itay can review your request. No email delivery is implied.':'Your diagnosis and experiment remain below. No follow-up is scheduled automatically.',choices:j.route==='TALK_NOW'&&!j.requested?[choice('request','Request a conversation')]:undefined},
    talk_contact: {title:'How can Itay respond to your request?',help:'Your diagnosis remains available below. Add only the details needed to respond.'},
  };
  return prompts[j.step];
}
/** A bounded reflection grounded in the participant's latest wording. */
export function reflection(j: Journey): string {
  const incident = j.answers.incident?.trim() ?? '';
  if (!incident || incident.length < 20) {
    return 'I need clarification and one more concrete detail: what happened, who was involved by role, and what came back to you?';
  }
  const excerpt = incident.replace(/\s+/g, ' ').slice(0, 180);
  if (/\b(decision|approve|approval|release)\b/i.test(incident)) {
    return `You described a decision or approval returning to you: “${excerpt}” What was the specific decision that could not close without you?`;
  }
  if (/\b(team|teams|connector|cross[- ]team|ownership|owner)\b/i.test(incident)) {
    return `You described work between people or teams coming back through you: “${excerpt}” What did you have to carry or connect personally?`;
  }
  if (/\b(load|capacity|week|pressure|calendar|overload|overloaded)\b/i.test(incident)) {
    return `You described leadership work being displaced by pressure or load: “${excerpt}” Which leadership activity was pushed out?`;
  }
  return `You described this situation in your own words: “${excerpt}” What specific responsibility or decision came back to you?`;
}
export function diagnosis(j: Journey) {
  const b=METHOD_BRANCHES[j.category]?.[j.answers.fork ?? 'mixed'] ?? METHOD_BRANCHES.unclear.mixed;
  const move=EXPERIMENT_LIBRARY[b.allowed_experiments[0]];
  return { observed:j.answers.incident ?? '', hypothesis:b.leading_label, explanation:b.answer_meaning, openQuestion:b.open_loop_template, move:move.behavior, measure:move.measure, signals:READ_SIGNALS[b.leading_hypothesis], limitation:'This explanation is provisional. If the move requires authority you do not have, or creates material risk, pause and clarify those conditions first.' };
}
export function view(j: Journey) {
  return {step:j.step,prompt:prompt(j),reflection:j.step === 'reflection' ? reflection(j) : null,turns:j.turns,incident:j.answers.incident ?? '',category:j.category,contact:j.contact,intent:j.intent,route:j.route,reasons:j.reasons,requested:j.requested,diagnosis:['insight','contact','diagnosis','intent','route','talk_contact'].includes(j.step)?diagnosis(j):null};
}
export function transition(current: Journey, action: Action): Journey {
  if (!/^[a-zA-Z0-9_-]{16,100}$/.test(action.operation ?? '')) throw new Error('Invalid operation.');
  if(current.operations.includes(action.operation)) {
    const previousPayload = current.operationPayloads?.[action.operation];
    if (previousPayload && previousPayload !== operationPayload(action)) throw new Error('Operation payload changed.');
    return current;
  }
  if(action.expected!==current.step) throw new Error('This answer is not expected. Reload the saved conversation.');
  const j=structuredClone(current); const answer=action.answer ?? ''; const step=j.step;
  if(['incident','impact'].includes(step)) {
    if(answer.trim().length<10 || answer.length>4000) throw new Error('Please use 10–4000 characters.');
    j.answers[step]=answer; // Raw wording is retained.
  } else if(prompt(j).choices && !prompt(j).choices?.some(c=>c.value===answer)) throw new Error('Choose one of the available answers.');
  if(step==='incident') { j.step='reflection'; }
  if(step==='reflection') {
    if(answer==='correct') j.step='incident';
    else { if(!Object.hasOwn(METHOD_BRANCHES,action.category ?? '')) throw new Error('Choose the closest pattern.'); j.category=action.category!; j.step='role'; }
  }
  if(step==='role') {j.answers.role=answer;j.step='pain';}
  if(step==='pain') {j.answers.pain=answer;j.step='impact';}
  if(step==='impact') j.step='why';
  if(step==='why') {j.answers.why=answer;j.step='fork';}
  if(step==='fork') {j.answers.fork=answer;j.step='insight';}
  if(step==='insight') j.step='contact';
  if(step==='contact'||step==='talk_contact') {
    if(answer==='skip') {j.contact=j.contact==='submitted'?'submitted':'skipped';j.step=step==='talk_contact'?'route':'diagnosis';}
    else {
      const c=action.contact;
      if(!c || c.processing!==true || !c.name.trim() || c.name.length>100 || c.email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) throw new Error('Add your name, a valid email and the processing acknowledgement.');
      j.contact='submitted';j.step=step==='talk_contact'?'route':'diagnosis';
      if(step==='talk_contact') j.requested=true;
    }
  }
  if(step==='diagnosis') j.step='intent';
  if(step==='intent') {
    j.intent=answer;
    if(j.answers.role==='other'||j.answers.pain==='no') {j.route='NO_FIT';j.reasons=['role_or_need_not_matched'];}
    else if(j.answers.pain==='unclear'||j.category==='unclear') {j.route='INSUFFICIENT_EVIDENCE';j.reasons=['pattern_or_need_unresolved'];}
    else if(answer==='talk_now') {j.route='TALK_NOW';j.reasons=['relevant_role','pain_confirmed','talk_requested'];}
    else if(answer==='later'||j.answers.why==='later') {j.route='NURTURE';j.reasons=['not_ready_for_conversation'];}
    else {j.route='INSUFFICIENT_EVIDENCE';j.reasons=['self_serve_chosen'];}
    j.step='route';
  }
  if(step==='route') {
    if(j.route!=='TALK_NOW'||answer!=='request'||j.requested) throw new Error('A conversation request is not available.');
    if(j.contact==='submitted') j.requested=true; else j.step='talk_contact';
  }
  if(!['contact','talk_contact'].includes(step)) j.turns.push({step,label:prompt(current).title,answer:prompt(current).choices?.find(c=>c.value===answer)?.label ?? answer});
  j.operations.push(action.operation);
  j.operationPayloads = {...(j.operationPayloads ?? {}), [action.operation]: operationPayload(action)};
  return j;
}
