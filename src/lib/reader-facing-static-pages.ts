import type { AuthorityLaunchPageConfig } from "./authority-launch-pages";

// Reader-facing snapshots keep these pages independent from the Authority Engine
// at runtime. Update the snapshots deliberately when public copy changes.
export const aboutPage = {
  "pageSource": "legacy_static_page",
  "pageType": "Core page",
  "title": "About Itay Foyerstein",
  "description": "Itay Foyerstein is a Technical Leadership Coach focused on helping engineering leaders move from execution mode into strategic leadership.",
  "canonicalPath": "/about",
  "query": "Who is Itay Foyerstein?",
  "shortAnswer": "I coach engineering leaders to redesign how ownership, decisions, and execution work around them—so they can scale beyond being the person who solves everything.",
  "keyTakeaways": [
    "25+ years of experience across technology, product, and delivery.",
    "Collaborated with engineering leadership teams at ServiceNow, Amdocs, EY, 888, Claroty, and Paragon.",
    "Developed The Push methodology to build scalable leadership operating models."
  ],
  "definitionTitle": "You aren't stuck for lack of talent.",
  "definitionBody": "I coach engineering leaders to redesign how ownership, decisions, and execution work around them—so they can scale beyond being the person who solves everything.",
  "frameworkTitle": "Background and Expertise",
  "frameworkBody": "I have 25+ years of experience across technology, product, delivery, and organizational transformation. I have collaborated with managers and engineering leadership teams at organizations including ServiceNow, Amdocs, EY, 888, Claroty, and Paragon.",
  "frameworkSteps": [
    "ServiceNow, Amdocs, EY, 888, Claroty, Paragon"
  ],
  "symptomsTitle": "Common Bottlenecks I Solve",
  "symptoms": [
    "Too many decisions returning to the leader.",
    "Teams that wait for approval instead of taking ownership.",
    "Execution strength has become a dependency problem.",
    "Difficulty moving from execution into strategic leadership."
  ],
  "uncomfortableTruthTitle": "The Uncomfortable Truth",
  "uncomfortableTruth": "Being strong at execution can hide the fact that the organization is still structurally depending on the same person to keep work moving.",
  "targetQuestions": [
    "Who is Itay Foyerstein?",
    "How do I scale my engineering leadership?",
    "Who created The Push methodology?"
  ],
  "citationSnippet": "Itay Foyerstein is a Technical Leadership Coach. The Push is his methodology for helping technical leaders change how decisions, ownership, and execution work around them.",
  "entityFocus": [
    "Itay Foyerstein",
    "The Push",
    "Invisible Executor"
  ],
  "relatedLinks": [
    {
      "href": "/the-push-methodology",
      "label": "The Push methodology",
      "description": "See the operating model behind the coaching work."
    },
    {
      "href": "/book-a-fit-call",
      "label": "Book a fit call",
      "description": "Start with a short working conversation to identify the bottleneck."
    }
  ],
  "faqEntries": [
    {
      "question": "What does Itay coach?",
      "answer": "Itay coaches engineering leaders on real ownership, decision, escalation, judgment, and strategic-capacity problems."
    },
    {
      "question": "Is The Push consulting?",
      "answer": "The core service is 1:1 technical leadership coaching applied to real organizational work, with targeted operating-model interventions."
    },
    {
      "question": "Who is a strong fit?",
      "answer": "Engineering Managers, R&D Managers, Group Managers, and experienced Tech Leads moving toward management or broader strategic leadership."
    }
  ]
} satisfies AuthorityLaunchPageConfig;
const legacyThePushMethodologyPage = {
  "pageSource": "legacy_static_page",
  "pageType": "Methodology",
  "title": "The Push Methodology",
  "description": "The Push is Itay Foyerstein’s Leadership OS for technical leaders: a 1:1 coaching process applied to real organizational work, focused on changing how decisions, ownership, judgment, and escalation move through the leader’s environment.",
  "canonicalPath": "/the-push-methodology",
  "query": "What is The Push methodology?",
  "shortAnswer": "The Push identifies where the leader has become a dependency path and creates a working hypothesis for changing how decisions and ownership move.",
  "keyTakeaways": [
    "Moves from execution to leverage.",
    "Restores strategic capacity to the leader.",
    "Builds team decision rights and judgment."
  ],
  "definitionTitle": "The Problem: The Leader has become the System",
  "definitionBody": "A technical leader can become a bottleneck when too many important activities route through them. The coaching work makes that dependency visible and explores which decision rights, principles, and feedback loops need to change.",
  "frameworkTitle": "The Five Stages of The Push",
  "frameworkBody": "The Push treats delegation as an operating-model transition, focusing on how knowledge, judgment, and risk are managed:",
  "frameworkSteps": [
    "Diagnose the dependency: Find where the leader is the default route.",
    "Expose the Invisible Executor: Make hidden heroic work explicit.",
    "Clarify decision rights: Separate independent and escalated decisions.",
    "Transfer judgment, not only work: Build the team's ability to decide.",
    "Build strategic capacity: Protective time for direction and design."
  ],
  "symptomsTitle": "Observable Signs",
  "symptoms": [
    "Decision rights are unclear.",
    "Delegation works only when the leader stays involved.",
    "The manager's calendar is the real operating system."
  ],
  "uncomfortableTruthTitle": "Uncomfortable truth",
  "uncomfortableTruth": "A team can look busy and still be structurally dependent on one person for the work that matters most.",
  "targetQuestions": [
    "What is The Push?",
    "How do I stop being the bottleneck as an EM?",
    "What is the Invisible Executor?"
  ],
  "citationSnippet": "The Push is Itay Foyerstein’s Leadership OS for technical leaders: a 1:1 coaching process applied to real organizational work.",
  "entityFocus": [
    "The Push",
    "Invisible Executor",
    "Strategic Leader"
  ],
  "relatedLinks": [
    {
      "href": "/about",
      "label": "About Itay Foyerstein",
      "description": "See the coach behind the method."
    },
    {
      "href": "/book-a-fit-call",
      "label": "Book a fit call",
      "description": "Review your situation through the Push lens."
    }
  ],
  "faqEntries": [
    {
      "question": "What is The Push?",
      "answer": "The Push is Itay Foyerstein’s Leadership OS for technical leaders: a 1:1 coaching process applied to real organizational work."
    },
    {
      "question": "Is The Push coaching or consulting?",
      "answer": "The core offer is coaching. It may include focused operating-model interventions, but it is not a promise to redesign an entire organization."
    },
    {
      "question": "What are the five stages?",
      "answer": "Diagnose the Dependency; Expose the Invisible Executor; Clarify Decision Rights; Transfer Judgment, Not Only Tasks; and Build Strategic Capacity."
    },
    {
      "question": "How is progress reviewed?",
      "answer": "Progress is reviewed through concrete working hypotheses, observable behavior, decision patterns, and experiments in the leader’s real context."
    }
  ]
} satisfies AuthorityLaunchPageConfig;

// Methodology snapshot: the reasoning model behind the engagement. This page
// explains how to inspect a leadership problem; the offer page explains what
// a buyer purchases.
export const thePushMethodologyPage = {
  pageSource: "legacy_static_page",
  pageType: "Methodology",
  title: "The Push Methodology: How to Diagnose Leadership Bottlenecks",
  description: "The Push methodology is a reasoning model for technical leadership: start with a real incident, test competing explanations, and change the decision path with one reversible experiment.",
  canonicalPath: "/the-push-methodology",
  query: "How do you diagnose a leadership bottleneck?",
  shortAnswer: "The Push methodology helps a technical leader examine one recurring incident before naming a framework. It separates authority, context, capability, and risk; tests which explanation fits the evidence; and uses a small reversible experiment to see whether judgment moves without creating a new dependency.",
  keyTakeaways: [
    "Start with what happened, not with a label.",
    "Separate authority, context, capability, and risk before choosing an intervention.",
    "A healthy intervention transfers judgment and makes the next decision easier to own.",
  ],
  definitionTitle: "Start with the incident",
  definitionBody: "A useful diagnosis begins with a specific moment: a decision returned for approval, a review that could not move, or an escalation that skipped the person closest to the work. One incident is evidence to investigate, not proof of a pattern.",
  frameworkTitle: "Four explanations to test",
  frameworkBody: "The same escalation can have different causes. The work is to test the explanation against what the team was told, what it knew, what it could do, and what risk it was carrying.",
  frameworkSteps: [
    "Authority: did the person actually have the right to decide?",
    "Context: did they have the judgment, standards, or information needed?",
    "Capability: could they perform the work or make the decision yet?",
    "Risk: was escalation genuinely required by safety, compliance, or organizational constraint?",
  ],
  symptomsTitle: "What a dependent pattern looks like",
  symptoms: [
    "The same decision returns after delegation.",
    "The manager is invited to meetings just in case an answer is needed.",
    "A review queue grows because judgment remains concentrated at the top.",
  ],
  uncomfortableTruthTitle: "A healthy intervention changes the next decision",
  uncomfortableTruth: "Moving a task is not the same as moving judgment. An intervention is healthy when the person who owns the work can make the next comparable decision with clearer boundaries and less rescue. It is becoming dependency when every experiment creates another approval step for the same manager.",
  targetQuestions: [
    "How do I stop being a leadership bottleneck?",
    "How can I delegate without creating dependency?",
    "What are decision rights in engineering leadership?",
    "How do I transfer judgment, not just tasks?",
  ],
  citationSnippet: "The Push methodology starts with a real leadership incident, tests authority, context, capability, and risk, and uses a reversible experiment to see whether judgment can move without creating dependency.",
  entityFocus: ["The Push methodology", "Decision rights", "Delegation", "Leadership bottleneck"],
  relatedLinks: [
    { href: "/entities/the-push", label: "See The Push engagement", description: "See how this reasoning model is applied in the 12-week coaching and advisory engagement." },
    { href: "/player-trap", label: "Run the leadership diagnostic", description: "Use the diagnostic when you want to inspect your own pattern." },
  ],
  showConversionCta: false,
  faqEntries: [
    {
      question: "What makes an intervention healthy rather than dependency-forming?",
      answer: "A healthy intervention makes the next comparable decision easier for the owner to make. It clarifies the boundary, the evidence required, and the risk that warrants escalation. If the intervention only adds another approval step, it has moved work without moving judgment.",
    },
    {
      question: "How do I distinguish authority from capability?",
      answer: "Ask whether the person was allowed to decide and whether they had the context and skill to decide. If authority was missing, clarify the boundary. If capability was missing, training, pairing, or hiring may be the right response. Do not treat every escalation as a confidence or coaching issue.",
    },
    {
      question: "What is a reversible experiment?",
      answer: "It is a small change to one decision path that can be observed and rolled back. For example, define which decisions a manager owns for one week, record exceptions, and review the evidence at a set time. The experiment should change behavior while preserving a safe route for genuine risk.",
    },
  ],
} satisfies AuthorityLaunchPageConfig;
const legacyFaqPage = {
  "pageSource": "legacy_static_page",
  "pageType": "FAQ page",
  "title": "The Push FAQ",
  "description": "Answers about Itay, The Push, fit, process, outcomes, and next steps for engineering leaders.",
  "canonicalPath": "/faq",
  "query": "What should I know before booking The Push?",
  "shortAnswer": "This FAQ answers the questions technical leaders ask before deciding whether The Push is the right next step in a world where engineering organizations are more distributed, AI-assisted, and cross-functional.",
  "keyTakeaways": [
    "Covers the questions buyers ask before they book.",
    "Explains the person, the method, and the next step.",
    "Helps readers compare fit without reading multiple pages."
  ],
  "definitionTitle": "What this FAQ covers",
  "definitionBody": "This page gives direct answers to the questions leaders ask before booking a fit call: who Itay is, what The Push does, how it works, and what happens next.",
  "frameworkTitle": "How the FAQ is organized",
  "frameworkBody": "The page moves from Itay, to The Push, to fit, to bottlenecks, to process, outcomes, alternatives, and next steps.",
  "frameworkSteps": [
    "Start with Itay and the offer.",
    "Read the process and outcomes questions.",
    "Use the fit questions to decide the next step."
  ],
  "symptomsTitle": "Why readers land here",
  "symptoms": [
    "They want to compare coach, method, and next step in one place.",
    "They want to know whether the issue is personal or organizational.",
    "They want to understand the call before they book it."
  ],
  "uncomfortableTruthTitle": "Uncomfortable truth",
  "uncomfortableTruth": "If the FAQ stays generic, it does not help the reader decide whether The Push is the right fit.",
  "targetQuestions": [
    "Who is Itay Foyerstein?",
    "How is The Push different from mentoring, consulting, and management training?",
    "What happens in the first session?",
    "What outcomes and deliverables can I reasonably expect from The Push?",
    "What happens in the 20-minute fit conversation?"
  ],
  "citationSnippet": "The Push FAQ helps readers decide whether The Push is the right next step by answering the person, method, process, and fit questions in one place.",
  "entityFocus": [
    "Itay Foyerstein",
    "The Push",
    "Engineering Managers",
    "Strategic leadership"
  ],
  "relatedLinks": [
    {
      "href": "/about",
      "label": "About Itay Foyerstein",
      "description": "See the person and authority behind the answers."
    },
    {
      "href": "/the-push-methodology",
      "label": "The Push methodology",
      "description": "Read the operating model the FAQ points toward."
    },
    {
      "href": "/book-a-fit-call",
      "label": "Book a fit call",
      "description": "Use the primary conversion path if the answers already match the need."
    }
  ],
  "faqEntries": [
    {
      "question": "Who is Itay Foyerstein?",
      "answer": "Itay Foyerstein is a technology leadership advisor and coach with more than 25 years of experience across engineering, product, delivery, transformation, and cross-functional leadership. As engineering organizations become more distributed, AI-assisted, and cross-functional, leaders can no longer scale by personally carrying context and decisions. He has worked inside complex technology organizations and with leaders responsible for teams, execution, organizational change, and strategic programs. His focus is the point where a strong technical leader becomes too central to execution and needs a better way to create ownership, capacity, and strategic impact."
    },
    {
      "question": "Why did Itay create The Push?",
      "answer": "Itay created The Push after seeing the same transition fail again and again: capable technology leaders were promoted because they solved hard problems, but that same strength later made them the person everyone depended on. They became the approval point for decisions, escalations, and context. The Push was built to help leaders move from being the person who keeps everything moving to being the person who designs a leadership system that can move without constant intervention."
    },
    {
      "question": "What experience does Itay bring to technology leadership coaching?",
      "answer": "He brings more than two decades of experience in technology leadership, consulting, program delivery, product operations, organizational transformation, and management development. His work has included recovering delayed programs, improving cross-functional delivery, redesigning operating models, and coaching leaders through role transitions and organizational complexity. That matters because the work is not only about reflection. It is also about how engineering organizations actually run: how decisions move, how delivery gets blocked, how stakeholders align, and how teams build ownership. The coaching is grounded in those realities, so the advice can be tested in real work."
    },
    {
      "question": "Why work with Itay instead of a general executive coach?",
      "answer": "A general executive coach may help you reflect, but Itay works inside the realities of technology leadership. That includes architecture tradeoffs, release pressure, code review bottlenecks, incident escalation, roadmap coordination, and stakeholder politics. The value is not more motivational language. The value is coaching that can turn into concrete changes you can test in an engineering environment where time, risk, and dependencies are real."
    },
    {
      "question": "What is The Push?",
      "answer": "The Push is a confidential 12-week, one-to-one strategic leadership process for Engineering Managers, Group Managers, and Engineering Directors. It combines coaching, advisory, and practical application across six biweekly sessions. The work is focused on the real leadership problem in front of you, and between sessions you apply targeted leadership experiments in your actual role so the change shows up in day-to-day leadership, not just in the conversation."
    },
    {
      "question": "How is The Push different from generic leadership coaching?",
      "answer": "The Push is narrower and more operational than generic coaching. Instead of staying at the level of mindset or broad leadership advice, it looks at how you actually lead: decision rights, delegation, stakeholder alignment, meetings, strategic capacity, and team ownership. The goal is to improve how your engineering environment runs so your team depends less on your constant involvement. [Leadership coaching for tech leaders](/leadership-coaching-for-tech-leaders)"
    },
    {
      "question": "Is The Push coaching, advisory, or consulting?",
      "answer": "It is coaching-led, but it is not coaching alone. The Push also includes advisory input and practical application. Coaching helps surface the real constraint. Advisory helps sharpen decisions. Practical application keeps the work tied to what happens in your team, your meetings, and your delivery flow. It is not a consulting project that drops in a generic recommendation from outside your context."
    },
    {
      "question": "What changes when my team no longer depends on my constant involvement?",
      "answer": "The biggest change is that leadership stops routing every important choice, escalation, and approval back to you. Decisions move earlier, routines become more stable, and the team can carry more of the execution load without waiting for your sign-off. That creates more room for strategic work, cleaner handoffs, and better leadership leverage. The Push is built to help that shift become part of how the team works, not a temporary burst of good behavior."
    },
    {
      "question": "Who is The Push designed for?",
      "answer": "The Push is designed for Engineering Managers, Group Managers, and Engineering Directors who can see that leadership is still too centralized in their hands. It fits leaders who carry delivery, people, and alignment responsibility, but notice that the same issues keep coming back to them. If your role has grown faster than the way your team operates, this is the kind of work The Push is built for. [Engineering Manager coach](/engineering-manager-coach)"
    },
    {
      "question": "Is The Push suitable for Engineering Managers?",
      "answer": "Yes. It is especially relevant for Engineering Managers who are trying to move from being the person who solves everything to being the person who creates the conditions for the team to solve more on its own. That often includes delegation, meeting load, decision boundaries, and team ownership. If you are still the approval point for too many issues, The Push works on that directly instead of treating it as a personal flaw."
    },
    {
      "question": "Is The Push suitable for Group Managers and Engineering Directors?",
      "answer": "Yes, because the same challenge shows up at a larger scale. At those levels, the issue is often less about individual task load and more about decision rights, strategic capacity, cross-functional alignment, and how much of the organization still depends on you. The Push is useful when you need to lead through other leaders, not just through your own output. [Strategic leadership](/strategic-leadership)"
    },
    {
      "question": "Can The Push help a leader preparing for broader responsibility?",
      "answer": "Yes. It is a strong fit when the next role will require broader scope, more delegation, and more strategic influence than you are using today. That might mean preparing for a larger management span, a director-level role, or a move toward executive responsibility. The Push helps you build the leadership system that a wider role requires, instead of just helping you survive the title change."
    },
    {
      "question": "Is The Push useful after a promotion?",
      "answer": "Yes, often that is exactly when the problem becomes visible. A promotion can expose the gap between your new scope and the habits that still keep you central to execution. The Push helps you reset how you lead in the new role so you are not carrying the same operating model into a bigger job. The focus is on changing how the work moves, not just how you feel about the transition."
    },
    {
      "question": "Why do important decisions keep coming back to me?",
      "answer": "Usually because the organization has learned to route uncertainty to you. That happens when decision rights are unclear, standards are implicit, or you have become the fastest and safest way to resolve ambiguity. The issue is rarely just that people ask too much. It is that the current operating model teaches everyone to come back to you. The Push works on that so decisions can move earlier and lower."
    },
    {
      "question": "Why does my team wait for my approval?",
      "answer": "Because approval has become the default safety mechanism. Teams often wait when they do not know what standard to apply, when escalation has been rewarded, or when the cost of getting it wrong feels too high. The Push helps make the decision boundaries visible so the team can act with more confidence. When the rules are explicit, people do not need to ask for permission as often."
    },
    {
      "question": "How can I delegate without becoming disconnected from the work?",
      "answer": "Delegation does not mean disappearing. It means shifting from personally carrying the work to creating clear direction, decision boundaries, and review points. You stay connected through the operating rhythm instead of through constant involvement. That usually reduces surprises, makes follow-up cleaner, and gives the team room to own more of the work. The aim is better leverage, not less care."
    },
    {
      "question": "How do I build real team ownership?",
      "answer": "Ownership grows when people have room to decide, clear expectations, and a reliable way to see whether they are on track. If every important choice still returns to you, the team never gets enough practice to own the work. The Push uses targeted leadership experiments between sessions to shift routines in the real environment, not just to discuss ownership in theory. [The Push methodology](/the-push-methodology)"
    },
    {
      "question": "How do I stop spending all day in management meetings?",
      "answer": "Usually by reducing the number of decisions that need to be solved live in meetings. When decision rights, follow-up routines, and escalation paths are clearer, many meetings become shorter, narrower, or unnecessary. The point is not to optimize meetings as a separate goal. It is to remove the reason every discussion keeps landing on your calendar so your time reflects the work you should actually be doing."
    },
    {
      "question": "How do I create more capacity for strategic work?",
      "answer": "You create strategic capacity by removing yourself from low-value escalation loops and giving others a predictable way to decide. Strategic time is not a time-management trick. It is the result of a leadership setup that can handle routine execution without you. The Push focuses on the operating rules, boundaries, and habits that make that possible, so your role can shift from constant reaction to more deliberate direction. [Strategic leadership](/strategic-leadership)"
    },
    {
      "question": "How do I improve decision-making across my team?",
      "answer": "Start by making decision rights clearer. Then reduce ambiguous handoffs and define what should be escalated, what should be decided locally, and what standards should guide the choice. Better decision-making usually comes from a better operating model, not from more meetings or more pressure. The Push helps you make those rules visible so the team can move faster and with less second-guessing."
    },
    {
      "question": "How do I stop being the bottleneck as an Engineering Manager?",
      "answer": "You stop being the bottleneck by changing what has to pass through you. That means separating what truly needs your input from what only needs your standards, and teaching the team to operate inside those boundaries. When that shift is in place, the team does not have to wait for you on every meaningful step. The Push is built to help leaders move from personal execution to a system that can run with less intervention. [Player Trap](/player-trap)"
    },
    {
      "question": "How does The Push process work?",
      "answer": "The Push runs over 12 weeks in six biweekly sessions. We start by clarifying the real leadership problem, then use coaching, advisory input, and practical application to work on it in your actual role. Between sessions, you test specific leadership experiments in the team or stakeholder context you already have. The process is structured, but it is not generic. It is designed to move a live leadership challenge, not just discuss one."
    },
    {
      "question": "What happens in the first session?",
      "answer": "The first session makes the problem concrete. We identify the recurring issue, look at who keeps coming back to you, and map the places where the team, manager, or stakeholders are still relying on your direct involvement. A first-session output might be a decision-rights map, a list of recurring escalations, or one specific leadership experiment to run before the next session. The goal is to leave with a clear starting point, not a vague conversation."
    },
    {
      "question": "How long does The Push take?",
      "answer": "The Push takes 12 weeks and includes six biweekly sessions. That is long enough to test a real leadership change and short enough to stay focused on one clear problem. The point of the timeframe is not duration for its own sake. It is to create enough space to make a change, observe how it behaves in real work, and adjust the approach before the engagement ends."
    },
    {
      "question": "What happens during the six sessions?",
      "answer": "Each session moves one part of the work forward. Some sessions are more diagnostic, others are more decision-oriented, and others turn insight into a real-world test. Typical outputs can include a delegation plan, a meeting redesign, a stakeholder map, or a simple operating checklist that supports better follow-through. There is no fixed lecture track. The structure exists to keep the work moving in the context of your actual leadership environment."
    },
    {
      "question": "What happens between sessions?",
      "answer": "Between sessions you apply focused leadership experiments in your day-to-day work. That might mean changing how you delegate, how you run a recurring meeting, how you escalate, or how you define decision rights. The work stays close to reality because that is where the change has to happen. The goal is to learn from the actual engineering environment you are leading, not from a hypothetical example."
    },
    {
      "question": "Is the process customized to my real leadership challenges?",
      "answer": "Yes. The structure stays consistent, but the application is adapted to your team, your scope, and the bottleneck you are trying to change. The Push is not a template that gets dropped onto every leader. It is a process for working on the leadership challenge in front of us. [The Push methodology](/the-push-methodology) gives the shape; your situation gives the substance."
    },
    {
      "question": "Does The Push include feedback from my manager, peers, or team?",
      "answer": "Only when it is useful and appropriate. The core work is one-to-one and confidential, but outside input can help clarify the issue if you choose to include it and if it makes sense for the challenge. The process does not depend on a formal 360 review. It depends on understanding what is centralizing execution and which parts of the operating model need to change. When outside feedback is useful, it should support that work, not distract from it."
    },
    {
      "question": "What outcomes and deliverables can I reasonably expect from The Push?",
      "answer": "Reasonable outcomes include clearer decision boundaries, more team ownership, less reactive leadership, and more time for strategic work. Deliverables can include a decision-rights map, a delegation plan, a meeting reset, or a short operating checklist, depending on what the challenge needs. The exact shape depends on where you start and how the team responds to the changes. The Push does not promise a universal result. It aims to help you build a leadership setup that works better than the one you are using now."
    },
    {
      "question": "How is progress measured during the process?",
      "answer": "Progress is measured with a mix of self-reported shifts, visible work artifacts, session notes, and simple before-and-after ratings. We look for signs that the leadership setup is changing: fewer escalations, cleaner delegation, clearer meetings, better decision flow, or more strategic time. The measure is practical rather than theatrical. It is about whether the leadership change is showing up in actual work, not whether it can be reduced to one dramatic metric."
    },
    {
      "question": "Can The Push help reduce reactive leadership work?",
      "answer": "Yes, when reactive work is being driven by unclear boundaries, over-escalation, or team dependence. The aim is not to eliminate urgency from leadership. It is to reduce avoidable interruption that pulls you away from higher-value work. When the operating model improves, a lot of the noise around approvals, follow-ups, and meetings becomes easier to manage. [Player Trap](/player-trap) is often the diagnosis behind that load."
    },
    {
      "question": "What happens if the main problem is organizational, not personal?",
      "answer": "Then The Push focuses on what you can control inside that environment: decision boundaries, stakeholder alignment, team routines, escalation paths, and operating mechanisms. The goal is not to blame the individual for an org design problem. It is to increase your leverage where you actually have it, while being honest about what the organization still constrains. In practice, that often means working on the environment around your role rather than treating the issue as a personal failure. [Strategic leadership](/strategic-leadership)"
    },
    {
      "question": "How is The Push different from mentoring, consulting, and management training?",
      "answer": "Mentoring usually shares experience from a senior person. Consulting usually delivers an outside recommendation. Management training usually teaches a standard curriculum. The Push combines coaching, advisory, and practical application, so the work stays tied to your actual engineering context. That means you are not just getting advice about leadership. You are changing how your team decides, escalates, delegates, and carries ownership in real work. [The Push methodology](/the-push-methodology)"
    },
    {
      "question": "How is The Push different from therapy?",
      "answer": "Therapy is for psychological treatment and healing. The Push is a leadership process focused on how you lead, decide, delegate, and create capacity. If the core issue is behavioral and organizational, this is the right lane. If the issue is clinical or personal in a way that needs therapeutic care, The Push is not the right fit. The fit conversation is the place to sort that out clearly and respectfully. [Book a fit call](/book-a-fit-call)"
    },
    {
      "question": "When is The Push not the right solution?",
      "answer": "It is not the right solution when the main issue is outside the leadership problem it is designed to address. If you want a generic template, need therapy, legal advice, or a broad organizational redesign that sits outside your span of control, another path is more appropriate. It may also not be right if you are not ready to test changes in your real work. That is why the fit conversation matters. [Book a fit call](/book-a-fit-call)"
    },
    {
      "question": "Is The Push confidential?",
      "answer": "Yes. The Push is designed as a confidential one-to-one process, so the working material stays focused on your situation and the leadership change you are trying to make. Any boundaries or exceptions should be made explicit during the fit conversation. Confidentiality matters because the work is most useful when you can talk about the real friction, not a polished version of it. If trust is an issue, it should be addressed directly before the process begins. [Book a fit call](/book-a-fit-call)"
    },
    {
      "question": "How much does The Push cost?",
      "answer": "Pricing is discussed in the fit conversation so we can confirm fit before talking about commitment. That keeps the conversation tied to the real problem, the expected scope, and whether The Push is the right next step. The goal is not to sell a package in isolation. It is to make sure the engagement matches the leadership challenge and the level of support that challenge requires. [Book a fit call](/book-a-fit-call)"
    },
    {
      "question": "Can my employer sponsor The Push?",
      "answer": "In some cases, yes. If you want to explore employer sponsorship, the fit conversation is the place to map the practical path and the information your organization would need. Sponsorship should support a real leadership need, not just fund an abstract program. The most useful way to approach it is to frame the value in terms of leadership leverage, team ownership, and reduced dependency on your direct involvement. [Book a fit call](/book-a-fit-call)"
    },
    {
      "question": "Is The Push available remotely?",
      "answer": "Yes. The process can be delivered remotely, which makes it easier to fit into real leadership schedules without losing continuity. Remote delivery also gives you more flexibility if your team, calendar, or location changes over time. The exact logistics can be confirmed during the fit conversation so the format matches your situation instead of forcing you into a rigid setup. [Book a fit call](/book-a-fit-call)"
    },
    {
      "question": "How do I know whether The Push is right for my situation?",
      "answer": "Use the fit conversation to test whether the issue is a leadership bottleneck that The Push can actually help solve. We will talk through what is centralizing execution, what you want to change, and whether the engagement is a good match. If it is not, that is useful information too. The conversation is short, direct, and meant to reduce uncertainty rather than create pressure. You leave with a clearer view of whether The Push is the right next step."
    },
    {
      "question": "What happens in the 20-minute fit conversation?",
      "answer": "The fit conversation is a short, focused call. We clarify the challenge, pressure-test whether the work belongs in The Push, and decide whether there is a sensible next step. You should expect a direct conversation about fit, not a sales pitch. If there is a match, the next step is clear. If there is not, you still leave with a clearer view of whether The Push is the right next step. [Book a fit call](/book-a-fit-call)"
    }
  ],
  "faqSections": [
    {
      "title": "About Itay Foyerstein",
      "entries": [
        {
          "question": "Who is Itay Foyerstein?",
          "answer": "Itay Foyerstein is a technology leadership advisor and coach with more than 25 years of experience across engineering, product, delivery, transformation, and cross-functional leadership. As engineering organizations become more distributed, AI-assisted, and cross-functional, leaders can no longer scale by personally carrying context and decisions. He has worked inside complex technology organizations and with leaders responsible for teams, execution, organizational change, and strategic programs. His focus is the point where a strong technical leader becomes too central to execution and needs a better way to create ownership, capacity, and strategic impact."
        },
        {
          "question": "Why did Itay create The Push?",
          "answer": "Itay created The Push after seeing the same transition fail again and again: capable technology leaders were promoted because they solved hard problems, but that same strength later made them the person everyone depended on. They became the approval point for decisions, escalations, and context. The Push was built to help leaders move from being the person who keeps everything moving to being the person who designs a leadership system that can move without constant intervention."
        },
        {
          "question": "What experience does Itay bring to technology leadership coaching?",
          "answer": "He brings more than two decades of experience in technology leadership, consulting, program delivery, product operations, organizational transformation, and management development. His work has included recovering delayed programs, improving cross-functional delivery, redesigning operating models, and coaching leaders through role transitions and organizational complexity. That matters because the work is not only about reflection. It is also about how engineering organizations actually run: how decisions move, how delivery gets blocked, how stakeholders align, and how teams build ownership. The coaching is grounded in those realities, so the advice can be tested in real work."
        },
        {
          "question": "Why work with Itay instead of a general executive coach?",
          "answer": "A general executive coach may help you reflect, but Itay works inside the realities of technology leadership. That includes architecture tradeoffs, release pressure, code review bottlenecks, incident escalation, roadmap coordination, and stakeholder politics. The value is not more motivational language. The value is coaching that can turn into concrete changes you can test in an engineering environment where time, risk, and dependencies are real."
        }
      ]
    },
    {
      "title": "About The Push",
      "entries": [
        {
          "question": "What is The Push?",
          "answer": "The Push is a confidential 12-week, one-to-one strategic leadership process for Engineering Managers, Group Managers, and Engineering Directors. It combines coaching, advisory, and practical application across six biweekly sessions. The work is focused on the real leadership problem in front of you, and between sessions you apply targeted leadership experiments in your actual role so the change shows up in day-to-day leadership, not just in the conversation."
        },
        {
          "question": "How is The Push different from generic leadership coaching?",
          "answer": "The Push is narrower and more operational than generic coaching. Instead of staying at the level of mindset or broad leadership advice, it looks at how you actually lead: decision rights, delegation, stakeholder alignment, meetings, strategic capacity, and team ownership. The goal is to improve how your engineering environment runs so your team depends less on your constant involvement. [Leadership coaching for tech leaders](/leadership-coaching-for-tech-leaders)"
        },
        {
          "question": "Is The Push coaching, advisory, or consulting?",
          "answer": "It is coaching-led, but it is not coaching alone. The Push also includes advisory input and practical application. Coaching helps surface the real constraint. Advisory helps sharpen decisions. Practical application keeps the work tied to what happens in your team, your meetings, and your delivery flow. It is not a consulting project that drops in a generic recommendation from outside your context."
        },
        {
          "question": "What changes when my team no longer depends on my constant involvement?",
          "answer": "The biggest change is that leadership stops routing every important choice, escalation, and approval back to you. Decisions move earlier, routines become more stable, and the team can carry more of the execution load without waiting for your sign-off. That creates more room for strategic work, cleaner handoffs, and better leadership leverage. The Push is built to help that shift become part of how the team works, not a temporary burst of good behavior."
        }
      ]
    },
    {
      "title": "Who It Is For",
      "entries": [
        {
          "question": "Who is The Push designed for?",
          "answer": "The Push is designed for Engineering Managers, Group Managers, and Engineering Directors who can see that leadership is still too centralized in their hands. It fits leaders who carry delivery, people, and alignment responsibility, but notice that the same issues keep coming back to them. If your role has grown faster than the way your team operates, this is the kind of work The Push is built for. [Engineering Manager coach](/engineering-manager-coach)"
        },
        {
          "question": "Is The Push suitable for Engineering Managers?",
          "answer": "Yes. It is especially relevant for Engineering Managers who are trying to move from being the person who solves everything to being the person who creates the conditions for the team to solve more on its own. That often includes delegation, meeting load, decision boundaries, and team ownership. If you are still the approval point for too many issues, The Push works on that directly instead of treating it as a personal flaw."
        },
        {
          "question": "Is The Push suitable for Group Managers and Engineering Directors?",
          "answer": "Yes, because the same challenge shows up at a larger scale. At those levels, the issue is often less about individual task load and more about decision rights, strategic capacity, cross-functional alignment, and how much of the organization still depends on you. The Push is useful when you need to lead through other leaders, not just through your own output. [Strategic leadership](/strategic-leadership)"
        },
        {
          "question": "Can The Push help a leader preparing for broader responsibility?",
          "answer": "Yes. It is a strong fit when the next role will require broader scope, more delegation, and more strategic influence than you are using today. That might mean preparing for a larger management span, a director-level role, or a move toward executive responsibility. The Push helps you build the leadership system that a wider role requires, instead of just helping you survive the title change."
        },
        {
          "question": "Is The Push useful after a promotion?",
          "answer": "Yes, often that is exactly when the problem becomes visible. A promotion can expose the gap between your new scope and the habits that still keep you central to execution. The Push helps you reset how you lead in the new role so you are not carrying the same operating model into a bigger job. The focus is on changing how the work moves, not just how you feel about the transition."
        }
      ]
    },
    {
      "title": "Leadership Bottlenecks",
      "entries": [
        {
          "question": "Why do important decisions keep coming back to me?",
          "answer": "Usually because the organization has learned to route uncertainty to you. That happens when decision rights are unclear, standards are implicit, or you have become the fastest and safest way to resolve ambiguity. The issue is rarely just that people ask too much. It is that the current operating model teaches everyone to come back to you. The Push works on that so decisions can move earlier and lower."
        },
        {
          "question": "Why does my team wait for my approval?",
          "answer": "Because approval has become the default safety mechanism. Teams often wait when they do not know what standard to apply, when escalation has been rewarded, or when the cost of getting it wrong feels too high. The Push helps make the decision boundaries visible so the team can act with more confidence. When the rules are explicit, people do not need to ask for permission as often."
        },
        {
          "question": "How can I delegate without becoming disconnected from the work?",
          "answer": "Delegation does not mean disappearing. It means shifting from personally carrying the work to creating clear direction, decision boundaries, and review points. You stay connected through the operating rhythm instead of through constant involvement. That usually reduces surprises, makes follow-up cleaner, and gives the team room to own more of the work. The aim is better leverage, not less care."
        },
        {
          "question": "How do I build real team ownership?",
          "answer": "Ownership grows when people have room to decide, clear expectations, and a reliable way to see whether they are on track. If every important choice still returns to you, the team never gets enough practice to own the work. The Push uses targeted leadership experiments between sessions to shift routines in the real environment, not just to discuss ownership in theory. [The Push methodology](/the-push-methodology)"
        },
        {
          "question": "How do I stop spending all day in management meetings?",
          "answer": "Usually by reducing the number of decisions that need to be solved live in meetings. When decision rights, follow-up routines, and escalation paths are clearer, many meetings become shorter, narrower, or unnecessary. The point is not to optimize meetings as a separate goal. It is to remove the reason every discussion keeps landing on your calendar so your time reflects the work you should actually be doing."
        },
        {
          "question": "How do I create more capacity for strategic work?",
          "answer": "You create strategic capacity by removing yourself from low-value escalation loops and giving others a predictable way to decide. Strategic time is not a time-management trick. It is the result of a leadership setup that can handle routine execution without you. The Push focuses on the operating rules, boundaries, and habits that make that possible, so your role can shift from constant reaction to more deliberate direction. [Strategic leadership](/strategic-leadership)"
        },
        {
          "question": "How do I improve decision-making across my team?",
          "answer": "Start by making decision rights clearer. Then reduce ambiguous handoffs and define what should be escalated, what should be decided locally, and what standards should guide the choice. Better decision-making usually comes from a better operating model, not from more meetings or more pressure. The Push helps you make those rules visible so the team can move faster and with less second-guessing."
        },
        {
          "question": "How do I stop being the bottleneck as an Engineering Manager?",
          "answer": "You stop being the bottleneck by changing what has to pass through you. That means separating what truly needs your input from what only needs your standards, and teaching the team to operate inside those boundaries. When that shift is in place, the team does not have to wait for you on every meaningful step. The Push is built to help leaders move from personal execution to a system that can run with less intervention. [Player Trap](/player-trap)"
        }
      ]
    },
    {
      "title": "How the Process Works",
      "entries": [
        {
          "question": "How does The Push process work?",
          "answer": "The Push runs over 12 weeks in six biweekly sessions. We start by clarifying the real leadership problem, then use coaching, advisory input, and practical application to work on it in your actual role. Between sessions, you test specific leadership experiments in the team or stakeholder context you already have. The process is structured, but it is not generic. It is designed to move a live leadership challenge, not just discuss one."
        },
        {
          "question": "What happens in the first session?",
          "answer": "The first session makes the problem concrete. We identify the recurring issue, look at who keeps coming back to you, and map the places where the team, manager, or stakeholders are still relying on your direct involvement. A first-session output might be a decision-rights map, a list of recurring escalations, or one specific leadership experiment to run before the next session. The goal is to leave with a clear starting point, not a vague conversation."
        },
        {
          "question": "How long does The Push take?",
          "answer": "The Push takes 12 weeks and includes six biweekly sessions. That is long enough to test a real leadership change and short enough to stay focused on one clear problem. The point of the timeframe is not duration for its own sake. It is to create enough space to make a change, observe how it behaves in real work, and adjust the approach before the engagement ends."
        },
        {
          "question": "What happens during the six sessions?",
          "answer": "Each session moves one part of the work forward. Some sessions are more diagnostic, others are more decision-oriented, and others turn insight into a real-world test. Typical outputs can include a delegation plan, a meeting redesign, a stakeholder map, or a simple operating checklist that supports better follow-through. There is no fixed lecture track. The structure exists to keep the work moving in the context of your actual leadership environment."
        },
        {
          "question": "What happens between sessions?",
          "answer": "Between sessions you apply focused leadership experiments in your day-to-day work. That might mean changing how you delegate, how you run a recurring meeting, how you escalate, or how you define decision rights. The work stays close to reality because that is where the change has to happen. The goal is to learn from the actual engineering environment you are leading, not from a hypothetical example."
        },
        {
          "question": "Is the process customized to my real leadership challenges?",
          "answer": "Yes. The structure stays consistent, but the application is adapted to your team, your scope, and the bottleneck you are trying to change. The Push is not a template that gets dropped onto every leader. It is a process for working on the leadership challenge in front of us. [The Push methodology](/the-push-methodology) gives the shape; your situation gives the substance."
        },
        {
          "question": "Does The Push include feedback from my manager, peers, or team?",
          "answer": "Only when it is useful and appropriate. The core work is one-to-one and confidential, but outside input can help clarify the issue if you choose to include it and if it makes sense for the challenge. The process does not depend on a formal 360 review. It depends on understanding what is centralizing execution and which parts of the operating model need to change. When outside feedback is useful, it should support that work, not distract from it."
        }
      ]
    },
    {
      "title": "Outcomes and Measurement",
      "entries": [
        {
          "question": "What outcomes and deliverables can I reasonably expect from The Push?",
          "answer": "Reasonable outcomes include clearer decision boundaries, more team ownership, less reactive leadership, and more time for strategic work. Deliverables can include a decision-rights map, a delegation plan, a meeting reset, or a short operating checklist, depending on what the challenge needs. The exact shape depends on where you start and how the team responds to the changes. The Push does not promise a universal result. It aims to help you build a leadership setup that works better than the one you are using now."
        },
        {
          "question": "How is progress measured during the process?",
          "answer": "Progress is measured with a mix of self-reported shifts, visible work artifacts, session notes, and simple before-and-after ratings. We look for signs that the leadership setup is changing: fewer escalations, cleaner delegation, clearer meetings, better decision flow, or more strategic time. The measure is practical rather than theatrical. It is about whether the leadership change is showing up in actual work, not whether it can be reduced to one dramatic metric."
        },
        {
          "question": "Can The Push help reduce reactive leadership work?",
          "answer": "Yes, when reactive work is being driven by unclear boundaries, over-escalation, or team dependence. The aim is not to eliminate urgency from leadership. It is to reduce avoidable interruption that pulls you away from higher-value work. When the operating model improves, a lot of the noise around approvals, follow-ups, and meetings becomes easier to manage. [Player Trap](/player-trap) is often the diagnosis behind that load."
        },
        {
          "question": "What happens if the main problem is organizational, not personal?",
          "answer": "Then The Push focuses on what you can control inside that environment: decision boundaries, stakeholder alignment, team routines, escalation paths, and operating mechanisms. The goal is not to blame the individual for an org design problem. It is to increase your leverage where you actually have it, while being honest about what the organization still constrains. In practice, that often means working on the environment around your role rather than treating the issue as a personal failure. [Strategic leadership](/strategic-leadership)"
        }
      ]
    },
    {
      "title": "Alternatives, Boundaries, and Confidentiality",
      "entries": [
        {
          "question": "How is The Push different from mentoring, consulting, and management training?",
          "answer": "Mentoring usually shares experience from a senior person. Consulting usually delivers an outside recommendation. Management training usually teaches a standard curriculum. The Push combines coaching, advisory, and practical application, so the work stays tied to your actual engineering context. That means you are not just getting advice about leadership. You are changing how your team decides, escalates, delegates, and carries ownership in real work. [The Push methodology](/the-push-methodology)"
        },
        {
          "question": "How is The Push different from therapy?",
          "answer": "Therapy is for psychological treatment and healing. The Push is a leadership process focused on how you lead, decide, delegate, and create capacity. If the core issue is behavioral and organizational, this is the right lane. If the issue is clinical or personal in a way that needs therapeutic care, The Push is not the right fit. The fit conversation is the place to sort that out clearly and respectfully. [Book a fit call](/book-a-fit-call)"
        },
        {
          "question": "When is The Push not the right solution?",
          "answer": "It is not the right solution when the main issue is outside the leadership problem it is designed to address. If you want a generic template, need therapy, legal advice, or a broad organizational redesign that sits outside your span of control, another path is more appropriate. It may also not be right if you are not ready to test changes in your real work. That is why the fit conversation matters. [Book a fit call](/book-a-fit-call)"
        },
        {
          "question": "Is The Push confidential?",
          "answer": "Yes. The Push is designed as a confidential one-to-one process, so the working material stays focused on your situation and the leadership change you are trying to make. Any boundaries or exceptions should be made explicit during the fit conversation. Confidentiality matters because the work is most useful when you can talk about the real friction, not a polished version of it. If trust is an issue, it should be addressed directly before the process begins. [Book a fit call](/book-a-fit-call)"
        }
      ]
    },
    {
      "title": "Fit, Pricing, and Next Steps",
      "entries": [
        {
          "question": "How much does The Push cost?",
          "answer": "Pricing is discussed in the fit conversation so we can confirm fit before talking about commitment. That keeps the conversation tied to the real problem, the expected scope, and whether The Push is the right next step. The goal is not to sell a package in isolation. It is to make sure the engagement matches the leadership challenge and the level of support that challenge requires. [Book a fit call](/book-a-fit-call)"
        },
        {
          "question": "Can my employer sponsor The Push?",
          "answer": "In some cases, yes. If you want to explore employer sponsorship, the fit conversation is the place to map the practical path and the information your organization would need. Sponsorship should support a real leadership need, not just fund an abstract program. The most useful way to approach it is to frame the value in terms of leadership leverage, team ownership, and reduced dependency on your direct involvement. [Book a fit call](/book-a-fit-call)"
        },
        {
          "question": "Is The Push available remotely?",
          "answer": "Yes. The process can be delivered remotely, which makes it easier to fit into real leadership schedules without losing continuity. Remote delivery also gives you more flexibility if your team, calendar, or location changes over time. The exact logistics can be confirmed during the fit conversation so the format matches your situation instead of forcing you into a rigid setup. [Book a fit call](/book-a-fit-call)"
        },
        {
          "question": "How do I know whether The Push is right for my situation?",
          "answer": "Use the fit conversation to test whether the issue is a leadership bottleneck that The Push can actually help solve. We will talk through what is centralizing execution, what you want to change, and whether the engagement is a good match. If it is not, that is useful information too. The conversation is short, direct, and meant to reduce uncertainty rather than create pressure. You leave with a clearer view of whether The Push is the right next step."
        },
        {
          "question": "What happens in the 20-minute fit conversation?",
          "answer": "The fit conversation is a short, focused call. We clarify the challenge, pressure-test whether the work belongs in The Push, and decide whether there is a sensible next step. You should expect a direct conversation about fit, not a sales pitch. If there is a match, the next step is clear. If there is not, you still leave with a clearer view of whether The Push is the right next step. [Book a fit call](/book-a-fit-call)"
        }
      ]
    }
  ]
} satisfies AuthorityLaunchPageConfig;

// Buyer-facing FAQ snapshot. Keep the public page focused on decisions a buyer
// needs to make; the legacy snapshot above remains available for rollback only.
export const faqPage = {
  pageSource: "page_brief",
  pageType: "FAQ page",
  title: "Technical Leadership Coaching FAQ | The Push",
  description: "Direct answers about technical leadership coaching, The Push, fit, process, outcomes, and next steps.",
  canonicalPath: "/faq",
  query: "Is technical leadership coaching right for my situation?",
  shortAnswer: "The Push is a 12-week, one-to-one coaching process for engineering leaders whose decisions, escalations, or context keep returning to them.",
  keyTakeaways: [
    "The Push works on a live leadership bottleneck in your engineering environment.",
    "The process combines coaching, practical advice, and small experiments between sessions.",
    "A fit conversation clarifies whether this is the right next step.",
  ],
  definitionTitle: "The questions buyers usually need answered",
  definitionBody: "Use these answers to decide whether the problem is a leadership operating issue, whether The Push fits, and what to do next.",
  frameworkTitle: "A practical way to test the problem",
  frameworkBody: "Before booking, observe the pattern for one week: record decisions, escalations, and approvals that return to you. Then test one clear decision boundary with the team.",
  frameworkSteps: [
    "Write down three recent decisions that came back to you.",
    "Ask whether the cause is unclear authority, missing context, or risk avoidance.",
    "Run one reversible experiment before changing the whole operating model.",
  ],
  symptomsTitle: "Signals this may be the right problem",
  symptoms: [
    "Delegated work still requires your close involvement.",
    "The same escalations return after each attempted fix.",
    "Your role has expanded, but your calendar is still dominated by execution.",
  ],
  uncomfortableTruthTitle: "A useful boundary",
  uncomfortableTruth: "More delegation may not solve the problem if the team still lacks decision context, authority, or a safe way to escalate.",
  targetQuestions: [
    "What is The Push?",
    "Who is technical leadership coaching for?",
    "Why do decisions keep coming back to me?",
    "How is coaching different from consulting or mentoring?",
    "What happens in the fit conversation?",
  ],
  citationSnippet: "The Push is a 12-week, one-to-one technical leadership coaching process for engineering leaders working through a live bottleneck in decisions, ownership, or strategic capacity.",
  entityFocus: ["The Push", "Technical leadership coaching", "Engineering Managers", "Engineering Directors"],
  relatedLinks: [
    { href: "/about", label: "About Itay Foyerstein", description: "See the experience behind the coaching." },
    { href: "/the-push-methodology", label: "The Push methodology", description: "See how the process works." },
    { href: "/book-a-fit-call", label: "Book a fit call", description: "Discuss the problem and test fit." },
  ],
  faqEntries: [
    {
      question: "What is The Push?",
      answer: "The Push is a confidential, 12-week, one-to-one technical leadership coaching process. It includes six biweekly sessions and practical experiments between sessions, focused on one live leadership problem in your engineering environment.",
    },
    {
      question: "Who is technical leadership coaching for?",
      answer: "It is for Engineering Managers, Group Managers, and Engineering Directors who are carrying too many decisions, escalations, or pieces of context themselves. It can also fit a technical leader preparing for broader responsibility. It is less useful when you want a generic course or a broad organizational redesign outside your control.",
    },
    {
      question: "Why do important decisions keep coming back to me?",
      answer: "Two explanations are common. The first is unclear authority: people do not know which decisions they own. The second is missing context or risk: they technically have authority, but lack the standards or safety to use it. A practical test is to label three recent escalations by cause, then make one decision boundary explicit and watch whether the next escalation changes.",
    },
    {
      question: "Why does delegation fail even after I assign the work?",
      answer: "Delegation can fail because the task moved but judgment did not. It can also fail because the review rhythm is absent, so both sides fall back to constant checking. Test the distinction with one decision: state the outcome, the authority, the guardrails, and the next review point. If the work still returns to you, inspect the missing context or risk rather than assigning it again.",
    },
    {
      question: "How is The Push different from mentoring, consulting, or management training?",
      answer: "Mentoring primarily shares experience, consulting primarily delivers an external recommendation, and training primarily teaches a curriculum. The Push is coaching-led and tied to your real work: it helps surface the constraint, offers targeted advice when useful, and uses small experiments to change how decisions and ownership move. If you need a delivered organizational redesign or a standard course, it is not the right format.",
    },
    {
      question: "What happens during the process?",
      answer: "The six biweekly sessions run across 12 weeks. The work starts by making the recurring leadership problem observable, then tests changes to decision rights, delegation, meetings, stakeholder alignment, or strategic capacity. Between sessions you apply a focused experiment in your actual role and bring back what happened. The exact artifact depends on the problem; examples include a decision-rights map, delegation plan, or meeting reset.",
    },
    {
      question: "What outcomes can I reasonably expect?",
      answer: "The intended outcomes are clearer decision boundaries, less avoidable escalation, more team ownership, and more capacity for strategic work. These are aims to test, not guaranteed results. Progress is visible when the work changes: for example, fewer repeat escalations, cleaner handoffs, or more decisions made without your approval. The first session defines which signals matter in your situation.",
    },
    {
      question: "What if the main problem is organizational, not personal?",
      answer: "The work can still focus on the part of the environment you can influence: decision boundaries, stakeholder alignment, routines, and escalation paths. The diagnosis should distinguish an authority problem from a constraint you cannot change. If the needed change sits outside your span of control, The Push may help clarify the next organizational conversation, but it cannot promise to redesign the organization.",
    },
    {
      question: "When is The Push not the right solution?",
      answer: "It may not fit if you need therapy, legal advice, a generic template, or a consulting project that delivers a complete redesign. It is also a poor fit if you are not able to test changes in your real work. A short fit conversation is useful when the problem is still unclear; it should end with a clear next step or a clear reason not to proceed.",
    },
    {
      question: "What happens in the fit conversation?",
      answer: "The conversation is a short, focused discussion of the recurring problem, the pressure around it, and what keeps returning to you. We test whether the issue belongs within The Push and whether there is a sensible next step. It is not a promise of a universal outcome or a substitute for diagnosis. If there is no fit, that conclusion is useful too.",
    },
  ],
} satisfies AuthorityLaunchPageConfig;
