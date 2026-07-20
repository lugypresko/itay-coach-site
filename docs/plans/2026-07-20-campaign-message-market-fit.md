# Campaign Message-Market Fit Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Launch and measure five campaign landing pages that route different audiences into the canonical coaching and sponsor journeys without competing with canonical SEO pages.

**Architecture:** Keep `/technical-leadership-coaching` and `/for-organizations` as canonical pages. Add five no-navigation campaign landing pages under `/campaigns/*`, each with its own hook, audience, CTA, and UTM-aware analytics. Start with three campaigns, then expand only after sufficient conversation data.

**Tech Stack:** Next.js App Router, TypeScript, existing booking/form flow, Vercel Analytics, UTM parameters, existing Player Trap assessment.

---

### Task 1: Lock Campaign and Canonical Route Contracts

**Files:**
- Modify: `src/lib/public-authority-routes.ts`
- Modify: `src/lib/public-content.ts`
- Create: `src/lib/campaign-pages.ts`
- Test: `tests/unit/campaign-route-contract.test.ts`

**Steps:**
1. Preserve `/technical-leadership-coaching` as the service canonical and `/for-organizations` as the sponsor canonical.
2. Define the five campaign slugs: `operators-memo`, `field-notes`, `player-trap`, `blueprint`, and `leadership-os`.
3. Mark campaigns as acquisition landing pages, excluded from primary navigation and canonical SEO authority registries.
4. Define audience, primary CTA, secondary CTA, destination, and launch phase for each campaign.
5. Add tests proving campaign URLs do not replace or duplicate canonical authority URLs.

### Task 2: Implement UTM and Campaign Context Capture

**Files:**
- Modify: `src/lib/analytics.ts`
- Modify: existing booking/form components
- Test: `tests/unit/campaign-attribution.test.ts`

**Steps:**
1. Read only standard UTM fields: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, and `utm_term`.
2. Persist `lp_concept`, `audience`, `cta_id`, and `landing_path` as event parameters or hidden fields.
3. Preserve attribution through the booking and form flow.
4. Add events for `book_click`, `assessment_start`, and `assessment_complete`.
5. Test attribution persistence across campaign page to conversion flow.

### Task 3: Build the First Three Campaign Pages

**Files:**
- Create: `src/app/(site)/campaigns/operators-memo/page.tsx`
- Create: `src/app/(site)/campaigns/field-notes/page.tsx`
- Create: `src/app/(site)/campaigns/leadership-os/page.tsx`
- Reuse: `design-proposals/concept-a-operators-memo.html`
- Reuse: `design-proposals/concept-e-field-notes.html`
- Reuse: `design-proposals/concept-b-leadership-os-console.html`
- Test: `tests/unit/campaign-page-content.test.ts`

**Steps:**
1. Launch only Operator’s Memo, Field Notes, and Leadership OS Diagnostic.
2. Keep each page visually distinct while using the same underlying service language.
3. Set Operator’s Memo CTA to `Discuss coaching for your managers`.
4. Set Field Notes CTA to `Book a fit call` or `Start with a conversation`.
5. Set Leadership OS CTA to `Run the Leadership Dependency Assessment`.
6. Ensure each CTA matches the actual destination and does not promise an unavailable tool.
7. Add `noindex` if campaign pages are intended only for acquisition; otherwise define their search role explicitly before launch.

### Task 4: Repair or Build the Assessment Journeys

**Files:**
- Modify: existing Player Trap assessment files
- Create or modify: Leadership Dependency Assessment files
- Test: `tests/unit/assessment-journey.test.ts`

**Steps:**
1. Ensure Player Trap CTA opens a real interactive assessment, not a static checklist presented as a test.
2. Ensure Leadership OS CTA opens a real assessment or change the CTA before launch.
3. Route individual results to `Review your result with Itay`.
4. Route sponsor results to `Discuss the findings` or `/for-organizations`.
5. Track assessment start, completion, result type, and next-step CTA.

### Task 5: Add Sponsor and Individual Form Qualification

**Files:**
- Modify: `/for-organizations` form flow
- Modify: individual fit-call form flow
- Test: `tests/unit/lead-qualification-form.test.ts`

**Steps:**
1. Collect name, work email, role, company, support intent, main challenge, and timing.
2. Conditionally collect manager count, team count, sponsor role, and initiative status for organizational buyers.
3. Do not require an approved budget before booking.
4. Classify persona separately from status: individual, CTO/VP sponsor, People/HR sponsor, referral/influencer, or not a fit.
5. Record post-call qualification manually: problem fit, urgency, sponsor strength, next step, and reason lost/not fit.

### Task 6: Evidence and Claims Review

**Files:**
- Modify: campaign content sources
- Modify: `docs/seed-content/*` only where campaign copy is sourced
- Test: `tests/unit/campaign-claims.test.ts`

**Steps:**
1. Remove unsupported metrics such as `73%`, `41%`, and `2.5x`.
2. Replace unsupported proof language such as `tested in production`.
3. Audit `25+ years` and company names before publication.
4. Use AI claims as thesis or emerging evidence, not universal research conclusions.
5. Preserve the approved framework language without claiming scientific validation.

### Task 7: Measurement Window and Decision Review

**Files:**
- Create: `docs/measurement/campaign-message-market-fit.md`
- Create: `tests/unit/campaign-measurement-schema.test.ts`

**Steps:**
1. Open a 90-day measurement window with checkpoints at days 30, 60, and 90.
2. Track clicks, bookings, completed conversations, qualified conversations, buyer persona, and next step.
3. Define `Qualified individual` and `Qualified organization` using ICP, active problem, impact, readiness, urgency, and purchase path.
4. Do not declare a winner at day 30.
5. At day 90, decide which message moves to canonical pages, which campaign receives more investment, and which campaign is paused.

### Verification

- Run focused campaign route, attribution, assessment, form, claims, and measurement tests.
- Run `npm test`.
- Run `npm run typecheck`.
- Run `npm run build`.
- Complete a human review of every claim and CTA destination.
- Do not publish or deploy until the human approval gate passes.

## Implementation Update - 2026-07-20

Completed:

- Tasks 1-3: five campaign contracts, three acquisition routes, canonical sponsor and assessment destinations, campaign metadata/noindex, and focused route/content tests.
- Task 2: standard UTM plus `lp_concept`, `audience`, `cta_id`, and `landing_path` propagation on campaign CTAs; assessment start/completion events.
- Task 4 partial: Leadership Dependency Assessment reuses the real Player Trap interactive journey and records assessment lifecycle events.
- Task 5 partial: shared lead qualification contract, sponsor/individual conditional fields, persona classification, and Resend-backed lead endpoint.
- Task 7: measurement specification added at `docs/measurement/campaign-message-market-fit.md`.

Open:

- Complete result-specific next-step CTA routing and add end-to-end assessment journey tests.
- Add booked-call/attended-call reconciliation and manual qualification recording.
- Complete claims audit and human review of proof, consent, recipient configuration, and CTA destinations.
- Resolve pre-existing repository typecheck failures in AI/runtime files before treating the repository as release-green.
- No publication, traffic launch, deployment, or external campaign activation is authorized by this plan.

## UX/UI Implementation Update - 2026-07-20

- Replaced the generic campaign layout with concept-specific renderers based on the original design proposals.
- Operator's Memo uses the editorial paper/lime memo language from Concept A.
- Field Notes uses the quieter personal editorial language from Concept E.
- Leadership OS uses the dark diagnostic console language from Concept B.
- Blueprint and Manifesto/Player Trap routes now preserve their original blueprint and manifesto composition from Concepts D and C.
- All concept routes remain acquisition-only, `noindex`, outside primary navigation, and retain the shared attribution-aware CTA behavior.

## Lead Destination Decision - 2026-07-20

- Resend is the existing email delivery boundary and remains the only notification provider for this work.
- The initial lead path is:

  `Form -> Next.js API -> Resend -> configured inbox`

- The form contract already includes persona, support intent, challenge, timing, sponsor fields, and attribution/UTM context.
- No additional email provider will be introduced.
- Lead persistence is a separate follow-up phase. When lifecycle tracking becomes necessary, add Payload/PostgreSQL persistence behind the same API contract rather than replacing the Resend path.
- Production recipient configuration must use `FIT_CALL_LEADS_TO` or an explicitly reviewed `RESEND_REPLY_TO`; the fallback address is not a deployment decision.

## Proof and Credibility Update - 2026-07-20

- Added `docs/evidence/campaign-claim-ledger.md` with blocked claims, allowed replacements, and publication actions.
- Added `docs/evidence/authority-evidence-registry.md` with E001-E012 and an explicit missing-evidence queue.
- Added `tests/unit/campaign-claims.test.ts` as a deterministic gate for unsupported campaign proof language.
- Design proposals remain source references; unsupported numbers and outcome language are not treated as publishable proof.
- Testimonials, case studies, quantified outcomes, and stronger company relationship wording remain behind the evidence and human-review gates.

## Canonical Proof and Resend Update - 2026-07-20

Completed in this batch:

- Strengthened `/about` and `/the-push-methodology` source copy with category definition, service boundaries, framework positioning, FAQ, evidence limits, and fit-call CTA.
- Extended the public renderer with reader-facing key takeaways, evidence/limits, FAQ, and continuation CTA without rendering PageBrief or governance metadata.
- Added a honeypot and network-error handling to the fit-call form.
- Added `FIT_CALL_LEADS_TO` to `.env.example`.
- Verified canonical metadata/publication tests and lead/claims tests.

Operational status:

- Resend integration is implemented, but no active Resend variables were found in local `.env.local`; local submissions therefore require dry-run or explicit local configuration.
- Production requires reviewed `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_REPLY_TO`, and `FIT_CALL_LEADS_TO` values.
- `/frameworks/invisible-executor` and `/pillars/tech-leadership-coaching` remain governed routes. Their final public copy requires the approved source/publication path and must not bypass Payload publication governance.
