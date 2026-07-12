# Player Trap Conversion Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign `/player-trap` into a diagnostic-first conversion funnel that increases test starts, test completions, and diagnosis call bookings without changing the homepage or global navigation.

**Architecture:** Keep the existing Player Trap backend, report route, and lead-capture API intact. Rebuild only the `/player-trap` page as a focused diagnostic experience with a dark authority visual system, a stronger hero, a short diagnostic section, a leadership evolution framework, a self-assessment, and a tighter CTA/form path into the current lead flow. Any new copy must stay consistent with the existing Player Trap, Invisible Executor, and Tech Leadership Coaching strategy.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript 5, existing CSS token system, existing Player Trap API routes, Vitest, Vercel deployment.

---

### Task 1: Rework the `/player-trap` hero

**Files:**
- Modify: `src/app/(site)/player-trap/page.tsx`
- Modify: `src/app/(site)/player-trap/player-trap-assessment-client.tsx`
- Modify: `src/styles/components.css`

**Step 1: Write the failing test**

Add or update a unit test that asserts the new Player Trap hero copy is present and that the page still renders the diagnostic entry point.

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/player-trap.test.ts`
Expected: FAIL until the new hero copy and page structure exist.

**Step 3: Write minimal implementation**

Replace the current neutral diagnostic hero with the approved Player Trap headline, subheadline, and microcopy. Keep the existing lead-capture flow, but make the primary CTA feel like a test start rather than a generic form submit.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/player-trap.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/app/(site)/player-trap/page.tsx src/app/(site)/player-trap/player-trap-assessment-client.tsx src/styles/components.css tests/unit/player-trap.test.ts
git commit -m "feat: redesign player trap hero"
```

### Task 2: Add the 4-sign diagnostic section and leadership evolution framework

**Files:**
- Modify: `src/app/(site)/player-trap/page.tsx`
- Modify: `src/styles/components.css`
- Modify: `src/styles/layout.css`

**Step 1: Write the failing test**

Add a unit test that checks the page content includes the four Player Trap signs and the evolution sequence: Star Player, Captain, System Builder, Pre-Promoted Leader.

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/player-trap.test.ts`
Expected: FAIL until the section content exists.

**Step 3: Write minimal implementation**

Add a stacked diagnostic section and a simple progression grid or diagram that keeps the funnel page visually authoritative without introducing gradients, motion, or decorative imagery.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/player-trap.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/app/(site)/player-trap/page.tsx src/styles/components.css src/styles/layout.css tests/unit/player-trap.test.ts
git commit -m "feat: add player trap diagnostic sections"
```

### Task 3: Rework the self-assessment and CTA/form copy

**Files:**
- Modify: `src/app/(site)/player-trap/player-trap-assessment-client.tsx`
- Modify: `src/lib/player-trap.ts`
- Modify: `src/styles/components.css`

**Step 1: Write the failing test**

Add or update tests that assert the self-assessment prompt language, the “Show My Result” style CTA, and the result-state copy remain aligned to the diagnostic funnel.

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/player-trap.test.ts`
Expected: FAIL until the new copy is implemented.

**Step 3: Write minimal implementation**

Keep the existing scoring and lead capture flow, but change the user-facing labels and result copy so the funnel feels diagnostic-first and less like a coaching sign-up form.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/player-trap.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/app/(site)/player-trap/player-trap-assessment-client.tsx src/lib/player-trap.ts src/styles/components.css tests/unit/player-trap.test.ts
git commit -m "feat: tighten player trap conversion copy"
```

### Task 4: Apply the dark authority visual system to `/player-trap`

**Files:**
- Modify: `src/styles/components.css`
- Modify: `src/styles/layout.css`
- Modify: `src/styles/base.css`
- Modify: `src/app/(site)/player-trap/page.tsx`

**Step 1: Write the failing test**

Add a style-focused test or update the existing Player Trap test to assert the funnel page uses the new dark authority classes and still exposes a readable diagnostic hierarchy.

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/player-trap.test.ts`
Expected: FAIL until the visual system changes are applied.

**Step 3: Write minimal implementation**

Update only the funnel page styles to a black/charcoal/white/gold palette, keep typography strong, and avoid gradients, shadows, motion, and stock imagery. Do not touch the homepage or global navigation styles.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/player-trap.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/app/(site)/player-trap/page.tsx src/styles/base.css src/styles/components.css src/styles/layout.css tests/unit/player-trap.test.ts
git commit -m "feat: apply player trap authority visual system"
```

### Task 5: Verify the funnel and update the plan record

**Files:**
- Modify: `PLANS.md`
- Test: `tests/unit/player-trap.test.ts`

**Step 1: Run the full verification set**

Run:

```bash
npm test
npm run typecheck
npm run build
```

Expected: all pass, with only the known pre-existing migration warnings during build.

**Step 2: Verify the page in a browser**

Open `/player-trap` on desktop and mobile widths and confirm:
- the hero is diagnostic-first
- the four-sign section is visible
- the evolution framework is visible
- the CTA starts the test
- the result state still reaches the existing lead flow

**Step 3: Update `PLANS.md` verification notes**

Record the exact checks that passed and note any remaining page-level follow-up work.

**Step 4: Commit**

```bash
git add PLANS.md
git commit -m "docs: record player trap conversion redesign"
```

### Task 6: Final push and handoff

**Files:**
- None, unless verification exposes a bug

**Step 1: Review git status**

Run: `git status --short`
Expected: clean working tree or only intentional remaining changes.

**Step 2: Push**

Run: `git push origin codex/push-code-to-github`
Expected: branch updates successfully.

**Step 3: Handoff**

Summarize the redesign changes, verification results, and any remaining conversion-risk items.

