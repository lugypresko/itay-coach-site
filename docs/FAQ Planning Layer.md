# The Push FAQ - SEO Planning Layer

Status: Internal planning draft  
Scope: Pre-copy planning only  
Public FAQ answers: Not written  
Primary conversion: Free 20-minute fit conversation at `/book-a-fit-call`

## Core service definition

The Push is a confidential 12-week, one-to-one strategic leadership process for Engineering Managers, Group Managers, and Engineering Directors. It combines coaching, advisory, and practical application across six biweekly sessions. The process follows a clear structure but is adapted to the client's real leadership challenges. Between sessions, clients apply targeted leadership experiments in their actual work.

Depending on the challenge, the process may include maps, plans, and operating tools related to decision rights, delegation, stakeholder alignment, meetings, strategic capacity, and team ownership.

The central problem every FAQ answer must return to:

> The leader has become too central to execution and needs to build a system that creates ownership, capacity, and strategic impact.

Core message:

> You are not buying templates. You are building a leadership system that no longer depends on your constant involvement.

## Repository and SEO architecture findings

- `/faq` exists and is wired to `AuthorityLaunchPage`.
- The current FAQ contains 20 placeholder-style entries, including non-buyer questions such as “Why does the FAQ hub matter?” and “What is the main CTA?”
- FAQ schema infrastructure exists, but public rendering is governed by the reader-facing artifact and publication-approval boundary.
- Confirmed route files exist for `/faq`, `/cto-coach`, `/engineering-manager-coach`, `/leadership-coach-for-engineering-managers`, `/strategic-leadership`, `/the-push-methodology`, `/player-trap`, `/book-a-fit-call`, and `/contact`.
- `/frameworks/invisible-executor` and `/frameworks/player-trap` are supported through the dynamic framework route; content availability should be runtime-verified before linking.
- The active commercial CTA is `/book-a-fit-call`; `/contact` is a secondary/general route.
- Dedicated pages already target the head terms `CTO coach`, `engineering manager coach`, `leadership coach for engineering managers`, `strategic leadership`, and `leadership coaching for tech leaders`.
- The FAQ must support long-tail and buyer-question intent without becoming the primary ranking page for those head terms.

## Keyword and search-intent map

| Keyword | Cluster | Search intent | Funnel stage | Primary target page | FAQ | Suggested internal link | Cannibalization risk | Notes |
|---|---|---|---|---|---|---|---|---|
| technology leadership coaching | Core service | Find a coaching category | Solution research | `/leadership-coaching-for-tech-leaders` | No | Same | High | Dedicated landing-page term |
| tech leadership coach | Core service | Find a coach | Evaluation | `/leadership-coaching-for-tech-leaders` | No | Same | High | Supporting term only |
| engineering leadership coaching | Core service | Find engineering-specific coaching | Solution research | `/leadership-coaching-for-tech-leaders` | No | Same | High | Merge with adjacent service variants |
| strategic leadership coaching | Core service | Find coaching for strategic impact | Evaluation | `/strategic-leadership` | No | Same | High | Dedicated destination page |
| executive coaching for technology leaders | Core service | Evaluate executive coaching | Solution research | `/leadership-coaching-for-tech-leaders` | No | Same | High | Broad category term |
| technical leadership coaching | Core service | Find technical leadership support | Solution research | `/leadership-coaching-for-tech-leaders` | No | Same | Medium | Close variant merged |
| leadership coaching process | Core service | Understand the service model | Solution research | `/faq` | Yes | `/the-push-methodology` | Low | FAQ suitable |
| engineering manager coach | Core service | Find a role-specific coach | Evaluation | `/engineering-manager-coach` | No | Same | High | Dedicated service page |
| leadership coach for engineering managers | Core service | Find a leadership coach | Evaluation | `/leadership-coach-for-engineering-managers` | No | Same | High | Dedicated service page |
| CTO coach | Core service | Find CTO coaching | Evaluation | `/cto-coach` | No | Same | High | Dedicated service page |
| CTO coaching | Core service | Understand CTO coaching | Solution research | `/cto-coach` | No | Same | High | Dedicated service page |
| VP R&D coaching | Core service | Find coaching for VP R&D role | Evaluation | `/strategic-leadership` | No | Same | Medium | No dedicated VP R&D page confirmed |
| engineering director coaching | Core service | Find coaching for Directors | Evaluation | `/leadership-coaching-for-tech-leaders` | No | Same | Medium | Role included in offer |
| coaching for senior engineering leaders | Core service | Find senior-leader coaching | Evaluation | `/leadership-coaching-for-tech-leaders` | No | Same | Medium | Broad senior-leader phrase |
| coaching for Engineering Managers stuck in execution | Problem | Solve over-centralized execution | Problem recognition | `/faq` | Yes | `/player-trap` | Low | Strong FAQ intent |
| leadership bottleneck | Problem | Understand personal bottleneck | Problem recognition | `/why-engineering-managers-become-bottlenecks` | Yes | Same | Medium | FAQ should keep answer long-tail |
| team dependency on manager | Problem | Reduce team dependency | Problem recognition | `/faq` | Yes | `/the-push-methodology` | Low | Core problem language |
| delegation problems in engineering teams | Problem | Improve delegation | Problem recognition | `/faq` | Yes | `/engineering-manager-coach` | Low | Long-tail FAQ |
| decision dependency | Problem | Reduce decision routing | Problem recognition | `/faq` | Yes | `/the-push-methodology` | Low | Central problem |
| too many management meetings | Problem | Reduce reactive meeting load | Problem recognition | `/faq` | Yes | `/the-push-methodology` | Low | No fixed savings claim |
| team waits for manager approval | Problem | Build team independence | Problem recognition | `/faq` | Yes | `/the-push-methodology` | Low | Direct buyer question |
| every decision comes back to me | Problem | Diagnose dependency | Problem recognition | `/faq` | Yes | `/player-trap` | Low | Natural-language query |
| engineering manager is bottleneck | Problem | Diagnose bottleneck | Problem recognition | `/why-engineering-managers-become-bottlenecks` | Yes | Same | Medium | Dedicated page owns broad topic |
| how to stop being the bottleneck as an Engineering Manager | Problem | Find practical solution | Solution research | `/faq` | Yes | `/player-trap` | Low | Priority query |
| how to create strategic capacity | Problem | Protect strategic work | Solution research | `/faq` | Yes | `/strategic-leadership` | Low | Outcome as system change |
| how to build team ownership | Problem | Create ownership | Solution research | `/faq` | Yes | `/the-push-methodology` | Low | Core outcome |
| how to improve decision-making in engineering teams | Problem | Improve decision flow | Solution research | `/faq` | Yes | `/the-push-methodology` | Low | Distinct from delegation |
| how to reduce organizational bottlenecks | Problem | Improve organizational execution | Solution research | `/strategic-leadership` | No | Same | Medium | Broad authority topic |
| move from engineer to manager | Career transition | Prepare for management | Awareness | `/faq` | Yes | `/engineering-manager-coach` | Low | Secondary audience |
| move from Tech Lead to Engineering Manager | Career transition | Prepare for role transition | Solution research | `/faq` | Yes | `/engineering-manager-coach` | Low | Long-tail FAQ |
| move from Engineering Manager to Director | Career transition | Prepare for broader scope | Solution research | `/faq` | Yes | `/strategic-leadership` | Low | Relevant to Group Managers/Directors |
| prepare for VP R&D role | Career transition | Prepare for promotion/scope | Evaluation | `/faq` | Yes | `/strategic-leadership` | Low | No dedicated VP page confirmed |
| prepare for CTO role | Career transition | Prepare for executive role | Evaluation | `/cto-coach` | No | Same | Medium | Page owns head term |
| leadership coaching before promotion | Career transition | Assess promotion readiness | Evaluation | `/faq` | Yes | `/strategic-leadership` | Low | Strong buyer question |
| leadership coaching after promotion | Career transition | Stabilize in new role | Evaluation | `/faq` | Yes | `/engineering-manager-coach` | Low | Strong buyer question |
| first-time Engineering Manager coaching | Career transition | Find support for new manager | Solution research | `/engineering-manager-coach` | No | Same | Medium | Service page owns role |
| senior IC moving into management coaching | Career transition | Prepare for management | Solution research | `/engineering-manager-coach` | No | Same | Medium | Audience overlap |
| how does The Push work | Process | Understand method | Solution research | `/faq` | Yes | `/the-push-methodology` | Low | Core FAQ |
| how does leadership coaching work | Process | Understand process | Solution research | `/faq` | Yes | `/the-push-methodology` | Low | Generic term, FAQ suitable |
| how long does leadership coaching take | Process | Evaluate time commitment | Evaluation | `/faq` | Yes | `/the-push-methodology` | Low | Answer with 12 weeks |
| 12-week leadership coaching process | Process | Evaluate defined program | Evaluation | `/faq` | Yes | `/the-push-methodology` | Low | Specific commercial support |
| six biweekly coaching sessions | Process | Understand cadence | Evaluation | `/faq` | Yes | `/the-push-methodology` | Low | Specific operational query |
| coaching with practical application | Process | Evaluate implementation | Solution research | `/faq` | Yes | `/the-push-methodology` | Low | Differentiator |
| leadership experiments between coaching sessions | Process | Understand between-session work | Evaluation | `/faq` | Yes | `/the-push-methodology` | Low | Specific process detail |
| confidential leadership coaching | Process | Assess confidentiality | Evaluation | `/faq` | Yes | `/book-a-fit-call` | Low | Important risk reducer |
| coaching maps and operating tools | Process | Understand deliverables | Evaluation | `/faq` | Yes | `/the-push-methodology` | Low | Mention sparingly |
| decision rights map for engineering leaders | Process | Find practical tool | Solution research | `/faq` | Yes | `/the-push-methodology` | Low | Tool supports outcome |
| management operating system | Process | Understand operating model | Awareness | `/the-push-methodology` | No | Same | Medium | Methodology owns concept |
| leadership operating system | Process | Understand named framework | Awareness | `/the-push-methodology` | No | Same | Medium | Avoid FAQ domination |
| coaching vs mentoring | Comparison | Choose support type | Comparison | `/faq` | Yes | `/the-push-methodology` | Low | Distinct buyer question |
| coaching vs consulting | Comparison | Understand hybrid model | Comparison | `/faq` | Yes | `/the-push-methodology` | Low | Important because The Push combines both |
| leadership coaching vs therapy | Comparison | Assess suitability | Comparison | `/faq` | Yes | `/book-a-fit-call` | Low | Clarify boundaries |
| coaching vs management training | Comparison | Compare alternatives | Comparison | `/faq` | Yes | `/the-push-methodology` | Low | Relevant objection |
| individual coaching vs team coaching | Comparison | Choose engagement type | Evaluation | `/faq` | Yes | `/book-a-fit-call` | Low | The Push primary offer is 1:1 |
| is executive coaching worth it | Comparison | Evaluate value | Evaluation | `/faq` | Yes | `/book-a-fit-call` | Low | Avoid financial guarantees |
| when coaching is not the right solution | Comparison | Disqualify poor fit | Evaluation | `/faq` | Yes | `/book-a-fit-call` | Low | Trust-building question |
| outcomes of leadership coaching | Outcome | Understand expected change | Evaluation | `/faq` | Yes | `/the-push-methodology` | Low | Use reported outcomes only |
| improve team ownership through coaching | Outcome | Assess ownership result | Evaluation | `/faq` | Yes | `/the-push-methodology` | Low | Core outcome |
| faster engineering decisions through coaching | Outcome | Assess decision result | Evaluation | `/faq` | Yes | `/the-push-methodology` | Low | No guaranteed speed claim |
| reduce reactive leadership work | Outcome | Reduce reactive load | Evaluation | `/faq` | Yes | `/player-trap` | Low | Use “clients reported” |
| improve executive presence as Engineering Director | Outcome | Improve senior-leader impact | Evaluation | `/faq` | Yes | `/strategic-leadership` | Low | Frame as strategic visibility |
| measure leadership coaching progress | Outcome | Understand measurement | Evaluation | `/faq` | Yes | `/the-push-methodology` | Low | Define evidence approach |
| create management capacity | Outcome | Build capacity | Evaluation | `/faq` | Yes | `/strategic-leadership` | Low | Central message |
| build a leadership system that does not depend on the manager | Outcome | Evaluate core transformation | Evaluation | `/faq` | Yes | `/the-push-methodology` | Low | Core positioning |
| how to choose a technology leadership coach | Commercial | Compare providers | Evaluation | `/faq` | Yes | `/leadership-coaching-for-tech-leaders` | Low | FAQ can offer criteria |
| book a 20-minute fit conversation | Commercial | Convert | Conversion | `/book-a-fit-call` | Yes | Same | Low | Primary CTA |
| technology leadership coaching fit call | Commercial | Assess fit | Conversion | `/book-a-fit-call` | Yes | Same | Low | Conversion support |
| confidential fit conversation for Engineering Managers | Commercial | Reduce booking risk | Conversion | `/book-a-fit-call` | Yes | Same | Low | Trust query |
| The Push coaching program for Engineering Directors | Commercial | Evaluate exact offer | Conversion | `/faq` | Yes | `/book-a-fit-call` | Low | High-value audience |
| The Push 12-week coaching process | Commercial | Evaluate offer | Conversion | `/faq` | Yes | `/book-a-fit-call` | Low | Specific product query |

## Intent-group consolidation notes

- `technology leadership coaching`, `technical leadership coaching`, and `engineering leadership coaching` are one service-category group.
- `CTO coach` and `CTO coaching` belong to `/cto-coach`, not to a primary FAQ target.
- `engineering manager coach`, `leadership coach for engineering managers`, and `first-time Engineering Manager coaching` are split between the service page and long-tail fit questions.
- `leadership bottleneck`, `team dependency`, `decision dependency`, and `every decision comes back to me` describe the same core problem, but can be separated by diagnosis versus solution.
- `too many meetings` and `strategic capacity` are symptoms of the same dependency pattern, not separate products.
- `coaching vs mentoring`, `coaching vs consulting`, and `coaching vs therapy` represent different purchase objections and should remain separate.
- `prepare for CTO role` and `prepare for VP R&D role` are sub-questions of broader strategic scope, not separate FAQ products.
- Remove questions about Itay, the purpose of the FAQ hub, AI-era leadership, and the CTA itself unless a future business decision makes them necessary.

## FAQ candidate inventory - 42 questions before pruning

All rows below are planning records only. No final answers have been written.

| # | Section | FAQ question | Primary intent | Primary keyword | Supporting keyword | Audience | Funnel stage | Business purpose | Internal link | Risk | Decision |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 1 | About The Push | What is The Push? | Understand the offer | The Push coaching process | strategic leadership process | All target roles | Solution research | Define the service | `/the-push-methodology` | Low | Keep |
| 2 | About The Push | How is The Push different from generic leadership coaching? | Understand differentiation | technology leadership coaching | practical application | All target roles | Comparison | Explain technical fit | `/leadership-coaching-for-tech-leaders` | Low | Keep |
| 3 | About The Push | Is The Push coaching, advisory, or consulting? | Understand service model | coaching vs consulting | coaching and advisory | All target roles | Comparison | Resolve category uncertainty | `/the-push-methodology` | Low | Keep |
| 4 | About The Push | What does it mean to build a leadership system? | Understand core promise | leadership operating system | team ownership | All target roles | Awareness | Reframe away from templates | `/the-push-methodology` | Medium | Keep |
| 5 | Who It Is For | Who is The Push designed for? | Assess audience fit | coaching for Engineering Managers | Group Managers, Directors | Target roles | Evaluation | Qualify reader | `/engineering-manager-coach` | Low | Keep |
| 6 | Who It Is For | Is The Push suitable for Engineering Managers? | Assess role fit | engineering manager coach | leadership bottleneck | Engineering Managers | Evaluation | Support primary audience | `/engineering-manager-coach` | Medium | Keep |
| 7 | Who It Is For | Is The Push suitable for Group Managers and Engineering Directors? | Assess seniority fit | engineering director coaching | strategic leadership | Group Managers, Directors | Evaluation | Support senior audience | `/strategic-leadership` | Low | Keep |
| 8 | Who It Is For | Can The Push help a leader preparing for broader responsibility? | Assess transition fit | prepare for VP R&D role | prepare for CTO role | Senior leaders | Evaluation | Address promotion readiness | `/strategic-leadership` | Low | Keep |
| 9 | Who It Is For | Is The Push useful after a promotion? | Assess timing | leadership coaching after promotion | management capacity | New senior managers | Evaluation | Address post-promotion uncertainty | `/engineering-manager-coach` | Low | Keep |
| 10 | Who It Is For | Is The Push relevant if I am already a strong technical leader? | Address objection | technical leadership coaching | execution strength | Experienced leaders | Evaluation | Reframe strength as dependency | `/player-trap` | Low | Keep |
| 11 | Bottlenecks | Why do important decisions keep coming back to me? | Diagnose decision dependency | decision dependency | leadership bottleneck | All target roles | Problem recognition | Name central problem | `/player-trap` | Low | Keep |
| 12 | Bottlenecks | Why does my team wait for my approval? | Diagnose approval dependency | team dependency on manager | decision rights | Engineering Managers | Problem recognition | Make dependency visible | `/the-push-methodology` | Low | Keep |
| 13 | Bottlenecks | How can I delegate without becoming disconnected from the work? | Improve delegation | delegation problems in engineering teams | team ownership | All target roles | Solution research | Address control objection | `/engineering-manager-coach` | Low | Keep |
| 14 | Bottlenecks | How do I build real team ownership? | Build ownership | improve team ownership | team accountability | All target roles | Solution research | Connect ownership to system | `/the-push-methodology` | Low | Keep |
| 15 | Bottlenecks | How do I stop spending all day in management meetings? | Reduce reactive load | too many management meetings | strategic capacity | All target roles | Problem recognition | Address visible symptom | `/the-push-methodology` | Low | Keep |
| 16 | Bottlenecks | How do I create more capacity for strategic work? | Protect strategic capacity | create strategic capacity | leadership capacity | Group Managers, Directors | Solution research | Connect capacity to dependency | `/strategic-leadership` | Low | Keep |
| 17 | Bottlenecks | How do I improve decision-making across my team? | Improve decision flow | improve decision-making in engineering teams | decision rights | All target roles | Solution research | Address decision quality | `/the-push-methodology` | Low | Keep |
| 18 | Bottlenecks | How do I stop being the bottleneck as an Engineering Manager? | Solve bottleneck | stop being the bottleneck | Player Trap | Engineering Managers | Solution research | Capture priority query | `/player-trap` | Low | Keep |
| 19 | Bottlenecks | How do I move from execution to strategic leadership? | Shift leadership level | move from execution to strategic leadership | executive presence | All target roles | Solution research | State transformation | `/strategic-leadership` | Medium | Keep |
| 20 | Process | How does The Push process work? | Understand process | how does The Push work | leadership coaching process | All target roles | Solution research | Explain structure | `/the-push-methodology` | Low | Keep |
| 21 | Process | How long does The Push take? | Evaluate time commitment | how long leadership coaching takes | 12-week process | All target roles | Evaluation | Set expectation | `/the-push-methodology` | Low | Keep |
| 22 | Process | What happens during the six sessions? | Understand cadence | six biweekly coaching sessions | one-to-one process | All target roles | Evaluation | Make engagement concrete | `/the-push-methodology` | Low | Keep |
| 23 | Process | What happens between sessions? | Understand application | leadership experiments between sessions | practical application | All target roles | Evaluation | Show implementation model | `/the-push-methodology` | Low | Keep |
| 24 | Process | Is the process customized to my real leadership challenges? | Assess customization | customized leadership coaching | real leadership challenges | All target roles | Evaluation | Differentiate from templates | `/the-push-methodology` | Low | Keep |
| 25 | Process | Is The Push confidential? | Resolve trust concern | confidential leadership coaching | one-to-one coaching | All target roles | Evaluation | Reduce risk | `/book-a-fit-call` | Low | Keep |
| 26 | Tools | What do I receive from The Push besides coaching conversations? | Understand deliverables | coaching maps and operating tools | practical application | All target roles | Evaluation | Clarify value | `/the-push-methodology` | Low | Keep |
| 27 | Tools | How can maps and plans help change how work moves through my team? | Understand tool-to-outcome link | decision rights map | team ownership | All target roles | Evaluation | Keep tools subordinate to outcome | `/the-push-methodology` | Low | Keep |
| 28 | Tools | Can The Push work with my actual meetings, decisions, and escalations? | Assess practical relevance | coaching with practical application | real leadership challenges | All target roles | Evaluation | Prove contextual fit | `/the-push-methodology` | Low | Keep |
| 29 | Tools | Am I buying templates or building a leadership system? | Resolve value objection | leadership operating system | management operating system | All target roles | Comparison | Reinforce core message | `/the-push-methodology` | Low | Keep |
| 30 | Outcomes | What outcomes can I reasonably expect from The Push? | Evaluate outcomes | outcomes of leadership coaching | team ownership | All target roles | Evaluation | Set credible expectations | `/the-push-methodology` | Low | Keep |
| 31 | Outcomes | How is progress measured during the process? | Understand evidence | measure leadership coaching progress | self-reported outcomes | All target roles | Evaluation | Establish credibility | `/the-push-methodology` | Low | Keep |
| 32 | Outcomes | Can The Push help reduce reactive leadership work? | Evaluate workload outcome | reduce reactive leadership work | management capacity | All target roles | Evaluation | Link symptom to system change | `/player-trap` | Low | Keep |
| 33 | Outcomes | Can The Push help improve delegation, accountability, and team ownership? | Evaluate ownership outcome | improve team ownership | delegation | All target roles | Evaluation | Combine related outcomes | `/engineering-manager-coach` | Low | Keep |
| 34 | Outcomes | Can The Push help me prepare for a Director, VP R&D, or CTO role? | Evaluate career outcome | prepare for CTO role | promotion readiness | Senior leaders | Evaluation | Address advancement without guarantees | `/strategic-leadership` | Medium | Keep |
| 35 | Alternatives | What is the difference between coaching, advisory, and mentoring? | Compare support types | coaching vs mentoring | coaching and advisory | All target roles | Comparison | Explain hybrid nature | `/the-push-methodology` | Low | Keep |
| 36 | Alternatives | How is The Push different from management consulting? | Compare service models | coaching vs consulting | practical application | All target roles | Comparison | Clarify boundaries | `/the-push-methodology` | Low | Keep |
| 37 | Alternatives | How is The Push different from therapy? | Assess suitability | leadership coaching vs therapy | confidentiality | All target roles | Comparison | Establish boundary | `/book-a-fit-call` | Low | Keep |
| 38 | Alternatives | When is The Push not the right solution? | Self-qualify | when coaching is not the right solution | fit conversation | All target roles | Evaluation | Build trust | `/book-a-fit-call` | Low | Keep |
| 39 | Fit | How do I know whether The Push is right for my situation? | Assess fit | how to choose a technology leadership coach | leadership bottleneck | All target roles | Evaluation | Move to fit | `/book-a-fit-call` | Low | Keep |
| 40 | Fit | What happens in the 20-minute fit conversation? | Understand conversion step | fit conversation | book a fit call | All target roles | Conversion | Reduce CTA friction | `/book-a-fit-call` | Low | Keep |
| 41 | Fit | What should I bring to a fit conversation? | Prepare for conversion | technology leadership coaching fit call | current bottleneck | All target roles | Conversion | Improve lead quality | `/book-a-fit-call` | Low | Keep |
| 42 | Fit | How do I get started with The Push? | Convert | 12-week coaching process | confidential fit conversation | All target roles | Conversion | Provide one next step | `/book-a-fit-call` | Low | Keep |

Note: The selected table currently contains 42 rows because the repository audit identified additional high-value fit and deliverable questions. Before final copy, reduce this to exactly 30–36 questions, with 34 as the recommended target. The rows most suitable for merging are 26–29, 35–37, and 40–41.

## Recommended final 34-question selection

To reach the required 30–36 range, keep rows 1–25, 30–34, and 38–42, then merge the following pairs:

- Merge rows 26 and 27 into one tools/deliverables question.
- Merge rows 28 and 29 into one practical application/value question.
- Merge rows 35 and 36 into one coaching/advisory/consulting comparison question.
- Keep row 37 as the therapy-boundary question.
- Merge rows 40 and 41 into one fit-conversation question.

This produces 34 final questions while preserving the requested coverage:

- Problem-aware: 9
- Role-specific and audience fit: 6
- Process, tools, and fit: 9
- Comparison and alternatives: 4
- Outcomes and measurement: 5
- Conversion: 3

## FAQ planning table - final 34 selected questions

| # | Section | FAQ question | Primary intent | Primary keyword | Supporting keyword | Audience | Funnel stage | Business purpose | Internal link | Risk | Decision |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 1 | About The Push | What is The Push? | Understand the offer | The Push coaching process | strategic leadership process | All target roles | Solution research | Define the service | `/the-push-methodology` | Low | Keep |
| 2 | About The Push | How is The Push different from generic leadership coaching? | Understand differentiation | technology leadership coaching | practical application | All target roles | Comparison | Explain technical fit | `/leadership-coaching-for-tech-leaders` | Low | Keep |
| 3 | About The Push | Is The Push coaching, advisory, or consulting? | Understand service model | coaching vs consulting | coaching and advisory | All target roles | Comparison | Resolve category uncertainty | `/the-push-methodology` | Low | Keep |
| 4 | About The Push | What does it mean to build a leadership system? | Understand core promise | leadership operating system | team ownership | All target roles | Awareness | Reframe away from templates | `/the-push-methodology` | Medium | Keep |
| 5 | Who It Is For | Who is The Push designed for? | Assess audience fit | coaching for Engineering Managers | Group Managers, Directors | Target roles | Evaluation | Qualify reader | `/engineering-manager-coach` | Low | Keep |
| 6 | Who It Is For | Is The Push suitable for Engineering Managers? | Assess role fit | engineering manager coach | leadership bottleneck | Engineering Managers | Evaluation | Support primary audience | `/engineering-manager-coach` | Medium | Keep |
| 7 | Who It Is For | Is The Push suitable for Group Managers and Engineering Directors? | Assess seniority fit | engineering director coaching | strategic leadership | Group Managers, Directors | Evaluation | Support senior audience | `/strategic-leadership` | Low | Keep |
| 8 | Who It Is For | Can The Push help a leader preparing for broader responsibility? | Assess transition fit | prepare for VP R&D role | prepare for CTO role | Senior leaders | Evaluation | Address promotion readiness | `/strategic-leadership` | Low | Keep |
| 9 | Who It Is For | Is The Push useful after a promotion? | Assess timing | leadership coaching after promotion | management capacity | New senior managers | Evaluation | Address post-promotion uncertainty | `/engineering-manager-coach` | Low | Keep |
| 10 | Who It Is For | Is The Push relevant if I am already a strong technical leader? | Address objection | technical leadership coaching | execution strength | Experienced leaders | Evaluation | Reframe strength as dependency | `/player-trap` | Low | Keep |
| 11 | Bottlenecks | Why do important decisions keep coming back to me? | Diagnose decision dependency | decision dependency | leadership bottleneck | All target roles | Problem recognition | Name central problem | `/player-trap` | Low | Keep |
| 12 | Bottlenecks | Why does my team wait for my approval? | Diagnose approval dependency | team dependency on manager | decision rights | Engineering Managers | Problem recognition | Make dependency visible | `/the-push-methodology` | Low | Keep |
| 13 | Bottlenecks | How can I delegate without becoming disconnected from the work? | Improve delegation | delegation problems in engineering teams | team ownership | All target roles | Solution research | Address control objection | `/engineering-manager-coach` | Low | Keep |
| 14 | Bottlenecks | How do I build real team ownership? | Build ownership | improve team ownership | team accountability | All target roles | Solution research | Connect ownership to system | `/the-push-methodology` | Low | Keep |
| 15 | Bottlenecks | How do I stop spending all day in management meetings? | Reduce reactive load | too many management meetings | strategic capacity | All target roles | Problem recognition | Address visible symptom | `/the-push-methodology` | Low | Keep |
| 16 | Bottlenecks | How do I create more capacity for strategic work? | Protect strategic capacity | create strategic capacity | leadership capacity | Group Managers, Directors | Solution research | Connect capacity to dependency | `/strategic-leadership` | Low | Keep |
| 17 | Bottlenecks | How do I improve decision-making across my team? | Improve decision flow | improve decision-making in engineering teams | decision rights | All target roles | Solution research | Address decision quality | `/the-push-methodology` | Low | Keep |
| 18 | Bottlenecks | How do I stop being the bottleneck as an Engineering Manager? | Solve bottleneck | stop being the bottleneck | Player Trap | Engineering Managers | Solution research | Capture priority query | `/player-trap` | Low | Keep |
| 19 | Process | How does The Push process work? | Understand process | how does The Push work | leadership coaching process | All target roles | Solution research | Explain structure | `/the-push-methodology` | Low | Keep |
| 20 | Process | How long does The Push take? | Evaluate time commitment | how long leadership coaching takes | 12-week process | All target roles | Evaluation | Set expectation | `/the-push-methodology` | Low | Keep |
| 21 | Process | What happens during the six sessions? | Understand cadence | six biweekly coaching sessions | one-to-one process | All target roles | Evaluation | Make engagement concrete | `/the-push-methodology` | Low | Keep |
| 22 | Process | What happens between sessions? | Understand application | leadership experiments between sessions | practical application | All target roles | Evaluation | Show implementation model | `/the-push-methodology` | Low | Keep |
| 23 | Process | Is the process customized to my real leadership challenges? | Assess customization | customized leadership coaching | real leadership challenges | All target roles | Evaluation | Differentiate from templates | `/the-push-methodology` | Low | Keep |
| 24 | Process | Is The Push confidential? | Resolve trust concern | confidential leadership coaching | one-to-one coaching | All target roles | Evaluation | Reduce risk | `/book-a-fit-call` | Low | Keep |
| 25 | Tools | What do I receive from The Push besides coaching conversations? | Understand deliverables | coaching maps and operating tools | practical application | All target roles | Evaluation | Clarify value | `/the-push-methodology` | Low | Keep |
| 26 | Tools | Can The Push work with my actual meetings, decisions, and escalations? | Assess practical relevance | coaching with practical application | real leadership challenges | All target roles | Evaluation | Prove contextual fit | `/the-push-methodology` | Low | Keep |
| 27 | Tools | Am I buying templates or building a leadership system? | Resolve value objection | leadership operating system | management operating system | All target roles | Comparison | Reinforce core message | `/the-push-methodology` | Low | Keep |
| 28 | Outcomes | What outcomes can I reasonably expect from The Push? | Evaluate outcomes | outcomes of leadership coaching | team ownership | All target roles | Evaluation | Set credible expectations | `/the-push-methodology` | Low | Keep |
| 29 | Outcomes | How is progress measured during the process? | Understand evidence | measure leadership coaching progress | self-reported outcomes | All target roles | Evaluation | Establish credibility | `/the-push-methodology` | Low | Keep |
| 30 | Outcomes | Can The Push help reduce reactive leadership work? | Evaluate workload outcome | reduce reactive leadership work | management capacity | All target roles | Evaluation | Link symptom to system change | `/player-trap` | Low | Keep |
| 31 | Outcomes | Can The Push help improve delegation, accountability, and team ownership? | Evaluate ownership outcome | improve team ownership | delegation | All target roles | Evaluation | Combine related outcomes | `/engineering-manager-coach` | Low | Keep |
| 32 | Alternatives | How is The Push different from mentoring, consulting, and management training? | Compare support types | coaching vs mentoring | coaching vs consulting | All target roles | Comparison | Explain hybrid nature | `/the-push-methodology` | Low | Keep |
| 33 | Alternatives | How is The Push different from therapy? | Assess suitability | leadership coaching vs therapy | confidentiality | All target roles | Comparison | Establish boundary | `/book-a-fit-call` | Low | Keep |
| 34 | Fit and Next Steps | How do I know whether The Push is right for my situation, and what happens in the fit conversation? | Assess fit and convert | how to choose a technology leadership coach | 20-minute fit conversation | All target roles | Conversion | Reduce friction and create next step | `/book-a-fit-call` | Low | Keep |

This final table is the approval target. The larger candidate inventory above is retained for traceability and pruning rationale; it is not intended for publication.

## Cannibalization risks

### High risk

The FAQ must not become the primary page for:

- `technology leadership coaching`
- `tech leadership coach`
- `engineering manager coach`
- `leadership coach for engineering managers`
- `strategic leadership coaching`
- `CTO coach`
- `executive coaching for technology leaders`

These terms should remain anchored to dedicated service pages. The FAQ may use them naturally in supporting answers with contextual links.

### Medium risk

- `move from execution to strategic leadership`
- `leadership operating system`
- `prepare for CTO role`
- `engineering manager is bottleneck`
- `strategic leadership`

The FAQ should answer these briefly and route readers to `/strategic-leadership`, `/the-push-methodology`, or `/why-engineering-managers-become-bottlenecks`.

### Low risk

The safest FAQ ownership areas are:

- 12-week duration
- Six biweekly sessions
- Between-session experiments
- Confidentiality
- Fit conversation
- Coaching/advisory/mentoring distinction
- Actual leadership bottleneck symptoms
- Tools as support for outcomes
- Measurement and evidence boundaries

## Recommended internal-link map

| Context | Anchor text | Destination | Status |
|---|---|---|---|
| Role-specific coaching | engineering manager coach | `/engineering-manager-coach` | Confirmed route |
| Leadership coaching category | leadership coaching for tech leaders | `/leadership-coaching-for-tech-leaders` | Confirmed route |
| Strategic destination | strategic leadership | `/strategic-leadership` | Confirmed route |
| Method explanation | The Push methodology | `/the-push-methodology` | Confirmed route |
| Bottleneck diagnosis | Player Trap | `/player-trap` | Confirmed route |
| Framework explanation | Invisible Executor framework | `/frameworks/invisible-executor` | Dynamic route; runtime verification required |
| Fit conversion | 20-minute fit conversation | `/book-a-fit-call` | Confirmed route and primary CTA |
| General contact | Contact | `/contact` | Confirmed route; secondary to fit call |
| CTO-specific support | CTO coach | `/cto-coach` | Confirmed route |

Linking rule: use no more than one relevant internal link in an answer unless a second link is needed for a distinct next step. Do not link every keyword occurrence.

## Evidence and claims guardrails

Use only ratings, self-reported outcomes, and documented artifacts. Do not claim guaranteed promotions, guaranteed time savings, guaranteed productivity gains, fixed meeting reductions, revenue caused by coaching, unverified client companies, or unverified participant counts.

Potentially safe supporting formulations, subject to evidence review:

- Clients reported greater clarity.
- Clients reported faster decision-making.
- Clients reported more structured and less reactive leadership.
- One client built and presented a €20M enterprise growth plan.
- One client reported reducing nearly half of recurring meetings.
- Clients rated progress, experience, expertise, and value between 4 and 5.

These should support answers, not become headline promises.

## Remaining data gaps before final writing

1. Does “confidential” mean full confidentiality of the 1:1 process, subject to standard legal and safety exceptions?
2. What counts as a documented outcome: written client feedback, session artifacts, before/after self-ratings, or anonymized work products?
3. Are maps, plans, and operating tools named products that may be named publicly, or should they remain generic?
4. Is the 20-minute fit conversation always free and always delivered by Itay?
5. Should the FAQ state that The Push is not therapy, or only explain the distinction?
6. Should `/book-a-fit-call` replace `/contact` as the only FAQ CTA?
7. Should pricing be addressed in the FAQ or deferred to the fit conversation?
8. Do Group Managers and Engineering Directors follow the same six-session structure?
9. Is “targeted leadership experiments” approved public wording, or should the softer “between-session applications” be used?
10. Before publication, the final copy and schema must pass the existing human-approval and reader-facing artifact gates.

## Next approval gate

Review this planning layer first. After approval and resolution of the data gaps, create the final English FAQ copy and visible FAQ schema. Do not modify `/faq`, Payload records, publication state, sitemap, or `llms.txt` before that review is complete.

---

## Revision 2026-07-21 - Seven-section FAQ architecture

This revision supersedes the earlier 8-section structure and the earlier 34-question selection. The FAQ should follow this journey:

> Problem -> fit -> process -> outcome -> objection removal -> conversion

### Section allocation

The proposed counts in the review summed to 38-39 questions. To stay within the required 30-36 range, the approved planning target is 36 questions:

| Section | Questions |
|---|---:|
| About The Push | 4 |
| Who It Is For | 5 |
| Leadership Bottlenecks | 8 |
| How the Process Works | 7 |
| Outcomes and Measurement | 4 |
| Alternatives, Boundaries, and Confidentiality | 4 |
| Fit, Pricing, and Next Steps | 4 |
| **Total** | **36** |

### Current 36-question selection

| # | Section | FAQ question | Primary intent | Primary keyword | Supporting keyword | Target audience | Funnel stage | Business purpose | Internal link | Risk | Decision |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 1 | About The Push | What is The Push? | Understand the offer | The Push coaching process | strategic leadership process | All target roles | Solution research | Define the service | `/the-push-methodology` | Low | Keep |
| 2 | About The Push | How is The Push different from generic leadership coaching? | Understand differentiation | technology leadership coaching | practical application | All target roles | Comparison | Explain technical fit | `/leadership-coaching-for-tech-leaders` | Low | Keep |
| 3 | About The Push | Is The Push coaching, advisory, or consulting? | Understand service model | coaching vs consulting | coaching and advisory | All target roles | Comparison | Explain the hybrid model | `/the-push-methodology` | Low | Keep |
| 4 | About The Push | What changes when my team no longer depends on my constant involvement? | Understand the core change | team dependency on manager | leadership capacity | All target roles | Awareness | Replace brand language with buyer language | `/the-push-methodology` | Low | Keep |
| 5 | Who It Is For | Who is The Push designed for? | Assess audience fit | coaching for Engineering Managers | Group Managers, Directors | Target roles | Evaluation | Qualify the reader | `/engineering-manager-coach` | Low | Keep |
| 6 | Who It Is For | Is The Push suitable for Engineering Managers? | Assess role fit | engineering manager coach | leadership bottleneck | Engineering Managers | Evaluation | Support primary audience | `/engineering-manager-coach` | Medium | Keep |
| 7 | Who It Is For | Is The Push suitable for Group Managers and Engineering Directors? | Assess seniority fit | engineering director coaching | strategic leadership | Group Managers, Directors | Evaluation | Support senior audience | `/strategic-leadership` | Low | Keep |
| 8 | Who It Is For | Can The Push help a leader preparing for broader responsibility? | Assess transition fit | prepare for VP R&D role | prepare for CTO role | Senior leaders | Evaluation | Address promotion readiness | `/strategic-leadership` | Low | Keep |
| 9 | Who It Is For | Is The Push useful after a promotion? | Assess timing | leadership coaching after promotion | management capacity | New senior managers | Evaluation | Address post-promotion uncertainty | `/engineering-manager-coach` | Low | Keep |
| 10 | Leadership Bottlenecks | Why do important decisions keep coming back to me? | Diagnose decision dependency | decision dependency | leadership bottleneck | All target roles | Problem recognition | Name the central problem | `/player-trap` | Low | Keep |
| 11 | Leadership Bottlenecks | Why does my team wait for my approval? | Diagnose approval dependency | team dependency on manager | decision rights | Engineering Managers | Problem recognition | Make dependency visible | `/the-push-methodology` | Low | Keep |
| 12 | Leadership Bottlenecks | How can I delegate without becoming disconnected from the work? | Improve delegation | delegation problems in engineering teams | team ownership | All target roles | Solution research | Address control objection | `/engineering-manager-coach` | Low | Keep |
| 13 | Leadership Bottlenecks | How do I build real team ownership? | Build ownership | improve team ownership | team accountability | All target roles | Solution research | Connect ownership to system design | `/the-push-methodology` | Low | Keep |
| 14 | Leadership Bottlenecks | How do I stop spending all day in management meetings? | Reduce reactive load | too many management meetings | strategic capacity | All target roles | Problem recognition | Address visible symptom | `/the-push-methodology` | Low | Keep |
| 15 | Leadership Bottlenecks | How do I create more capacity for strategic work? | Protect strategic capacity | create strategic capacity | leadership capacity | Group Managers, Directors | Solution research | Connect capacity to dependency | `/strategic-leadership` | Low | Keep |
| 16 | Leadership Bottlenecks | How do I improve decision-making across my team? | Improve decision flow | improve decision-making in engineering teams | decision rights | All target roles | Solution research | Address decision quality | `/the-push-methodology` | Low | Keep |
| 17 | Leadership Bottlenecks | How do I stop being the bottleneck as an Engineering Manager? | Solve bottleneck | stop being the bottleneck | Player Trap | Engineering Managers | Solution research | Capture priority query | `/player-trap` | Low | Keep |
| 18 | How the Process Works | How does The Push process work? | Understand process | how does The Push work | leadership coaching process | All target roles | Solution research | Explain structure | `/the-push-methodology` | Low | Keep |
| 19 | How the Process Works | What happens in the first session? | Understand onboarding | first leadership coaching session | real leadership challenges | All target roles | Evaluation | Make the start concrete | `/the-push-methodology` | Low | Keep |
| 20 | How the Process Works | How long does The Push take? | Evaluate time commitment | how long leadership coaching takes | 12-week process | All target roles | Evaluation | Set expectation | `/the-push-methodology` | Low | Keep |
| 21 | How the Process Works | What happens during the six sessions? | Understand cadence | six biweekly coaching sessions | one-to-one process | All target roles | Evaluation | Make engagement concrete | `/the-push-methodology` | Low | Keep |
| 22 | How the Process Works | What happens between sessions? | Understand application | leadership experiments between sessions | practical application | All target roles | Evaluation | Show implementation model | `/the-push-methodology` | Low | Keep |
| 23 | How the Process Works | Is the process customized to my real leadership challenges? | Assess customization | customized leadership coaching | real leadership challenges | All target roles | Evaluation | Differentiate from templates | `/the-push-methodology` | Low | Keep |
| 24 | How the Process Works | Does The Push include feedback from my manager, peers, or team? | Assess stakeholder involvement | leadership coaching feedback | stakeholder alignment | All target roles | Evaluation | Clarify involvement and boundaries | `/the-push-methodology` | Low | Keep |
| 25 | Outcomes and Measurement | What outcomes can I reasonably expect from The Push? | Evaluate outcomes | outcomes of leadership coaching | team ownership | All target roles | Evaluation | Set credible expectations | `/the-push-methodology` | Low | Keep |
| 26 | Outcomes and Measurement | How is progress measured during the process? | Understand evidence | measure leadership coaching progress | self-reported outcomes | All target roles | Evaluation | Establish credibility | `/the-push-methodology` | Low | Keep |
| 27 | Outcomes and Measurement | Can The Push help reduce reactive leadership work? | Evaluate workload outcome | reduce reactive leadership work | management capacity | All target roles | Evaluation | Link symptom to system change | `/player-trap` | Low | Keep |
| 28 | Outcomes and Measurement | What happens if the main problem is organizational, not personal? | Assess systemic fit | organizational bottleneck coaching | operating mechanisms | All target roles | Evaluation | Avoid blaming the leader; focus on controllables | `/strategic-leadership` | Low | Keep |
| 29 | Alternatives, Boundaries, and Confidentiality | How is The Push different from mentoring, consulting, and management training? | Compare support types | coaching vs mentoring | coaching vs consulting | All target roles | Comparison | Explain alternatives without splitting intent | `/the-push-methodology` | Low | Keep |
| 30 | Alternatives, Boundaries, and Confidentiality | How is The Push different from therapy? | Assess suitability | leadership coaching vs therapy | confidentiality | All target roles | Comparison | Establish boundary | `/book-a-fit-call` | Low | Keep |
| 31 | Alternatives, Boundaries, and Confidentiality | When is The Push not the right solution? | Self-qualify | when coaching is not the right solution | fit conversation | All target roles | Evaluation | Build trust | `/book-a-fit-call` | Low | Keep |
| 32 | Alternatives, Boundaries, and Confidentiality | Is The Push confidential? | Resolve trust concern | confidential leadership coaching | one-to-one coaching | All target roles | Evaluation | Reduce perceived risk | `/book-a-fit-call` | Low | Keep |
| 33 | Fit, Pricing, and Next Steps | How much does The Push cost? | Evaluate commercial fit | leadership coaching cost | 12-week process | All target roles | Evaluation | Remove pricing uncertainty | `/book-a-fit-call` | Low | Keep |
| 34 | Fit, Pricing, and Next Steps | Can my employer sponsor The Push? | Assess buyer path | employer-sponsored leadership coaching | Engineering Director support | Engineering Managers, Directors | Conversion | Enable sponsored purchase path | `/book-a-fit-call` | Low | Keep |
| 35 | Fit, Pricing, and Next Steps | Is The Push available remotely? | Assess delivery fit | remote leadership coaching | one-to-one process | All target roles | Evaluation | Remove logistical objection | `/book-a-fit-call` | Low | Keep |
| 36 | Fit, Pricing, and Next Steps | How do I know whether The Push is right for my situation, and what happens in the 20-minute fit conversation? | Assess fit and convert | how to choose a technology leadership coach | fit conversation | All target roles | Conversion | Create one clear next step | `/book-a-fit-call` | Low | Keep |

### Question changes from the previous version

- Removed `Am I buying templates or building a leadership system?` as a standalone FAQ question. Keep that message as a headline, callout, or answer framing.
- Replaced it with `What changes when my team no longer depends on my constant involvement?`.
- Added first-session expectations, stakeholder-feedback boundaries, employer sponsorship, pricing, remote availability, and organizational-versus-personal problem handling.
- Kept generic coaching differentiation and the coaching/advisory distinction as separate questions; their answers must have clearly different jobs.

## Updated internal-linking rules

- `/engineering-manager-coach`: delegation, bottleneck, post-promotion, and Engineering Manager fit questions.
- `/strategic-leadership`: strategic capacity, broader responsibility, organizational constraints, and executive impact questions.
- `/player-trap`: technical strength becoming dependency, leadership bottleneck, and reactive-work questions.
- `/the-push-methodology`: process, first session, tools, between-session experiments, customization, and measurement.
- `/book-a-fit-call`: confidentiality, pricing, sponsorship, remote delivery, fit, and next step.

Use one relevant internal link per answer at most. Do not link every occurrence of a keyword. Vary anchor text naturally and create approximately 2-3 meaningful FAQ links to each service page rather than linking from ten answers.

Do not place a commercial CTA in every accordion.

## Updated CTA placement

1. After `Leadership Bottlenecks`:

   > If too many decisions still depend on you, explore how The Push works.

2. After `Outcomes and Measurement`:

   > Not sure whether the issue is delegation, capacity, or role transition? Start with a 20-minute fit conversation.

3. At the end of the page:

   Use the full CTA to schedule a confidential 20-minute fit conversation.

The primary CTA remains `/book-a-fit-call`.

## Updated schema and measurement position

- Use valid `FAQPage` schema only for questions and answers visibly present on the page.
- Do not add hidden FAQ entries.
- Do not frame the page around an expectation of FAQ rich snippets.
- The main value of the FAQ is useful content, internal linking, topical coverage, extractable answers, and conversion support.

## Remaining approval questions for the revised FAQ

1. What is the approved public pricing language: fixed price, starting price, range, or price only in the fit conversation?
2. Is remote delivery always available, and across which time zones?
3. Can employer sponsorship be stated as an available path in every case?
4. Does feedback from managers, peers, or team members occur routinely, optionally, or only when requested by the client?
5. What exactly happens in the first session?
6. What language should define confidentiality and its boundaries?
7. Should “targeted leadership experiments” remain the approved public phrase?
