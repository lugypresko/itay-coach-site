import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technical Leadership Coaching for Engineering Managers & Directors | The Push",
  description: "12-week 1:1 technical leadership coaching for Engineering Managers, Group Managers and Directors in growing B2B SaaS companies who are still the path for too many decisions, reviews and escalations.",
  alternates: { canonical: "/" }, robots: { index: true, follow: true },
};

const scenes = [
  ["The meeting you have to attend.", "You are accountable for the outcome, so being informed quietly turned into being present."],
  ["The decision that comes back for one last check.", "The team can do the work, but judgment still lives one level higher."],
  ["The strategic work that starts after the meetings end.", "Delivery is moving. Your calendar is full. The work only you should do gets pushed to later."],
];
const steps = [
  ["01", "Start with what actually happened.", "Who was involved? What decision, review or escalation came back?"],
  ["02", "Test competing explanations.", "Unclear authority? Missing context or judgment? Capability not ready? Or involvement genuinely justified by risk?"],
  ["03", "Run one reversible experiment.", "Change one boundary, review, escalation rule or meeting — not the entire organization."],
  ["04", "Inspect what came back.", "The evidence from the next cycle decides whether to continue, change the hypothesis or stop."],
];

export default function HomePage() {
  return <main className="home-v3" id="top">
    <section className="v3-hero"><div><p className="v3-eyebrow">Technical leadership coaching</p><h1>Stop being<br />the system.</h1><div className="v3-hero-image"><Image src="/itay-home-photo.jpg" alt="Itay Foyerstein, technical leadership coach" width={896} height={1195} priority /></div></div><div className="v3-hero-copy"><p>Your team can execute. But the hard decisions, reviews and escalations still come back to you. <strong>The Push helps you change that without stepping away from the work that actually needs your judgment.</strong></p><div className="v3-actions"><Link className="v3-primary" href="/player-trap">Bring one current case →</Link><Link className="v3-button" href="#work">See the engagement</Link></div><small>Engineering Managers · Group Managers · Directors<br />Growing B2B SaaS · typically 50–250 people<br />12 weeks · 6 private 1:1 sessions</small></div></section>
    <section className="v3-strip"><div><b>Recognition</b><p>Capable team. Too much still routes through you.</p></div>{scenes.map(([title, body]) => <div key={title}><b>{title}</b><p>{body}</p></div>)}</section>
    <section className="v3-section v3-dark"><div className="v3-two"><div><p className="v3-eyebrow">Observed in real work</p><blockquote>“I’m more precise. I know better what I want to ask. I cut meetings faster.”<cite>Avi · senior R&amp;D leader</cite></blockquote></div><div><h2>Not testimonials. Evidence from situations we worked on.</h2><p>The point is not that every leader has the same problem. The point is that we can look at a live situation, test the first explanation, and see what changes.</p><div className="v3-cards"><article><b>Calendar overload → control</b><span>Examined which meetings required a decision and where presence was unnecessary.</span></article><article><b>30 min</b><span>One meeting disappeared; accountability did not.</span></article><article><b>$10M → $20M</b><span>Distinguished business value from system dependency.</span></article></div></div></div></section>
    <section className="v3-section"><p className="v3-eyebrow">How I work</p><div className="v3-two"><h2>Do not call it a bottleneck before the evidence earns the diagnosis.</h2><p>One incident is a story. A repeated pattern, competing explanations and a reversible test give us something useful.</p></div><div className="v3-steps">{steps.map(([n, title, body]) => <article key={n}><small>{n}</small><h3>{title}</h3><p>{body}</p></article>)}</div></section>
    <section className="v3-section v3-paper" id="work"><p className="v3-eyebrow">The engagement</p><div className="v3-two"><h2>One live leadership problem. Six cycles of diagnosis, action and evidence.</h2><p>The Push is a 12-week 1:1 coaching and advisory engagement. We work on the real decisions, people, meetings and constraints in your role — not a generic leadership curriculum.</p></div><div className="v3-cards v3-offer"><article><b>12 weeks</b><span>Enough time to observe patterns and test behavior in real work.</span></article><article><b>6 sessions</b><span>Six biweekly private 1:1 sessions built around the live problem.</span></article><article><b>1 problem</b><span>One situation costing you attention, leverage or strategic capacity.</span></article></div></section>
    <section className="v3-section"><p className="v3-eyebrow">Fit</p><div className="v3-two"><h2>Sometimes coaching is not the answer.</h2><p>If the real constraint sits in the organization rather than in how you are operating, the useful move is to name that clearly.</p></div><div className="v3-fit"><article><h3>Strong fit</h3><ul><li>Your scope has grown, but too much judgment still routes through you.</li><li>You lead capable people and want more leverage without becoming disconnected.</li><li>You are willing to test changes between sessions.</li></ul></article><article><h3>Probably not a coaching problem</h3><ul><li>You do not have the authority the role requires.</li><li>The team is materially understaffed.</li><li>The role or organization design is unresolved.</li></ul></article></div></section>
    <section className="v3-section v3-dark"><div className="v3-two"><div><p className="v3-eyebrow">Start with your case</p><h2>Get something useful before you book anything.</h2></div><div><p>Bring one current decision, review, escalation or meeting that keeps coming back to you. The diagnostic returns a working hypothesis and one reversible experiment.</p><Link className="v3-primary" href="/player-trap">Start with my case →</Link></div></div></section>
  </main>;
}
