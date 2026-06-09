# Player Trap UX Copy Alignment Implementation Plan

> **For Claude:** Use the current verified production flow as the source of truth. Do not reintroduce any pre-assessment self-identification step or post-submit loading transition.

**Goal:** Improve conversion psychology inside the existing Player Trap flow without changing the core mechanics.

**Architecture:** Keep the current verified funnel intact:
`/player-trap`, `/player-trap-he`, `POST /api/player-trap/lead`, `GET|POST /api/player-trap/diagnosis-call`, and `/player-trap/report/[token]`. Adjust copy hierarchy, locked-form explanation, and report-page language only.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript 5, existing Payload subscriber records, existing Resend integration, existing CSS token system, Vitest.

---

### Task 1: Align page copy to the verified flow

**Files:**
- Modify: `src/app/(site)/player-trap/page.tsx`
- Modify: `src/app/(site)/player-trap-he/page.tsx`
- Modify: `src/app/(site)/player-trap/player-trap-assessment-client.tsx`
- Modify: `src/lib/player-trap.ts`
- Modify: `src/styles/components.css`
- Modify: `tests/unit/player-trap.test.ts`

**Steps:**
1. Update the hero, assessment intro, locked-form explanation, and CTA copy so they feel more diagnostic and less generic.
2. Keep the current 5-question assessment and lead gate unchanged.
3. Keep English and Hebrew copy native to each audience.
4. Re-run the focused Player Trap tests and confirm the verified flow still passes.

### Task 2: Tighten report-page wording inside the existing structure

**Files:**
- Modify: `src/app/(site)/player-trap/report/[token]/page.tsx`
- Modify: `src/lib/player-trap.ts`
- Modify: `tests/unit/player-trap.test.ts`

**Steps:**
1. Improve report hero, result cards, and CTA wording inside the current structure.
2. Keep the existing report page architecture intact.
3. Strengthen the diagnosis call CTA in English and Hebrew.
4. Re-run tests and confirm report language still matches the stored `pageLanguage`.

### Task 3: Fix outdated docs and broken encoding

**Files:**
- Modify: `PLANS.md`
- Modify: `docs/Task 023B — Player Trap Funnel Flow.txt`
- Add or modify: `docs/plans/*`

**Steps:**
1. Mark Task 023B as superseded.
2. Record the current verified flow as the canonical source of truth.
3. Fix any broken encoding or copied text in the relevant task docs.
4. Keep the documentation aligned with the implemented flow.

### Task 4: Verify end to end

**Files:**
- Modify: `PLANS.md`
- Test: `tests/unit/player-trap.test.ts`

**Steps:**
1. Run `npm test -- tests/unit/player-trap.test.ts`.
2. Run `npm test`.
3. Run `npm run typecheck`.
4. Run `npm run build`.
5. Verify English and Hebrew flows still complete end to end.
6. Confirm the lead record is still created, report redirect still works, and diagnosis-call tracking still works.
7. Mark the task complete only after verification passes.

---

## Canonical Flow

The verified production flow remains the source of truth:
- `/player-trap` and `/player-trap-he` are live.
- User completes the current 5-question assessment.
- Lead form unlocks only after all 5 questions are answered.
- Submit posts directly to `/api/player-trap/lead`.
- Server validates name, email, consent, language, answers, and UTM.
- Server creates `reportToken`, `reportUrl`, and `diagnosisCallUrl`.
- Subscriber record is saved in Payload.
- Resend email is sent when configured.
- Client redirects directly to `/player-trap/report/[token]`.
- Report page renders hero, result cards, CTA, and metadata.
- Diagnosis CTA posts to `/api/player-trap/diagnosis-call` and redirects to `/book-a-fit-call` with `lang` and `source` params.
