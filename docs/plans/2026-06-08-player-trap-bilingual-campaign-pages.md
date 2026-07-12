# Player Trap Bilingual Campaign Pages Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build separate English and Hebrew Player Trap campaign pages with native copy, shared scoring, language-aware lead tracking, and language-matched result pages.

**Architecture:** Keep Player Trap scoring and lead capture in `src/lib/player-trap.ts` and the existing `/api/player-trap/lead` route. Add a Hebrew page that reuses the assessment client with language-specific copy, persist `pageLanguage`, and render report/diagnosis CTA copy from the stored language.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript 5, Payload CMS 3, existing CSS token system, Vitest.

---

### Task 1: Add bilingual funnel contracts and tests

**Files:**
- Modify: `tests/unit/player-trap.test.ts`
- Modify: `src/lib/player-trap.ts`

**Steps:**
1. Write failing tests for English and Hebrew funnel copy, wrong-fix/reframe content, page language support, and report localization.
2. Run `npm test -- tests/unit/player-trap.test.ts` and verify failure.
3. Add minimal bilingual copy/data helpers in `src/lib/player-trap.ts`.
4. Re-run targeted tests and verify pass.

### Task 2: Render English and Hebrew campaign pages

**Files:**
- Modify: `src/app/(site)/player-trap/page.tsx`
- Create: `src/app/(site)/player-trap-he/page.tsx`
- Modify: `src/app/(site)/player-trap/player-trap-assessment-client.tsx`
- Modify: `src/styles/components.css`

**Steps:**
1. Write failing tests that assert `/player-trap-he` exists, uses RTL, and both pages use campaign copy.
2. Run targeted tests and verify failure.
3. Refactor the existing page around shared language-specific funnel data.
4. Add Hebrew page with native RTL copy and the same assessment flow.
5. Re-run targeted tests and verify pass.

### Task 3: Persist language and journey status

**Files:**
- Modify: `src/app/api/player-trap/lead/route.ts`
- Modify: `src/app/api/player-trap/diagnosis-call/route.ts`
- Modify: `src/payload/collections/content.ts`
- Modify: `src/lib/player-trap.ts`
- Modify: `tests/unit/player-trap.test.ts`

**Steps:**
1. Write failing tests for `pageLanguage` in request/record contracts and language-aware URLs.
2. Run targeted tests and verify failure.
3. Add `pageLanguage`, `testCompletedAt`, `resultProfile`, and `resultScore` fields to subscriber records.
4. Pass page language from client to API and store it.
5. Re-run targeted tests and verify pass.

### Task 4: Localize report page and verify end to end

**Files:**
- Modify: `src/app/(site)/player-trap/report/[token]/page.tsx`
- Modify: `tests/unit/player-trap.test.ts`
- Modify: `PLANS.md`

**Steps:**
1. Write failing tests for language-matched report CTA copy.
2. Run targeted tests and verify failure.
3. Render report labels, CTA, and score copy from stored `pageLanguage`.
4. Run `npm test -- tests/unit/player-trap.test.ts`, `npm test`, `npm run typecheck`, and `npm run build`.
5. Verify `/player-trap` and `/player-trap-he` locally in browser automation.
6. Update `PLANS.md` verification notes and mark Task 024 completed.

---

## Implementation Summary

Status: Completed on 2026-06-09.

Implemented routes:
- `/player-trap` - English campaign page, LTR.
- `/player-trap-he` - Hebrew campaign page, RTL.
- `/player-trap/report/[token]` - language-aware result report based on stored `pageLanguage`.

Key implementation notes:
- English and Hebrew pages share the same funnel architecture but use separate native copy.
- Hebrew diagnostic questions and answer choices are defined separately from the English diagnostic questions.
- The duplicated quick-check step was removed from the public assessment flow. Visitors now answer one scoring diagnostic, then submit details to receive the result.
- Result access is gated behind first name, email, and explicit consent for content and cookies.
- `/api/player-trap/lead` validates first name, email, `contentConsentAccepted`, and `cookiesConsentAccepted` server-side before creating or updating a subscriber.
- Lead records persist `pageLanguage`, result profile, result score, UTM attribution, journey timestamps, and consent fields.
- Diagnosis-call requests persist `diagnosisCallRequestedAt` and redirect with the stored language.

Data contract additions:
- `contentConsentAccepted`
- `cookiesConsentAccepted`
- `consentAcceptedAt`

Verification completed:
- `npm test -- tests/unit/player-trap.test.ts` passed.
- `npm test` passed: 16 files, 60 tests.
- `npm run typecheck` passed.
- `npm run build` passed with only pre-existing unused migration argument warnings.
- Production-mode local verification passed for `http://127.0.0.1:3023/player-trap` and `http://127.0.0.1:3023/player-trap-he`.
- Hebrew page verification confirmed Hebrew diagnostic questions and lead form are present, the old English diagnostic question is absent, and the removed quick-check prompt is absent.
