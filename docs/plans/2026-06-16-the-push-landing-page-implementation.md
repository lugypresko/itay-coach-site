# The Push Landing Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Turn the reviewed The Push landing page into a production `/ai-first-leadership` route with stronger hierarchy, clearer conversion intent, and mobile-safe rendering.

**Architecture:** Keep the existing Next.js App Router site shell and implement the page as a route-scoped landing page, not a new content system. Reuse the current authority-engine navigation and route structure, but replace the minimal AI-first page with the richer narrative from the reviewed HTML: hero, signal strip, three offer cards, method flow, fit guidance, proof, and a final CTA. Any proof claim that is not already supported by existing source material should be replaced with neutral copy or linked evidence.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript 5, existing global CSS layers, Vitest, browser-based screenshot verification.

---

### Task 1: Lock the page contract for `/ai-first-leadership`

**Files:**
- Modify: `src/app/(site)/ai-first-leadership/page.tsx`
- Modify: `tests/unit/ai-first-leadership-page.test.ts`

**Step 1: Write the failing test**

Add a route-level unit test that asserts the page renders the expected landing-page sections in order:
hero, signal bar, three ways to work, method, fit, proof, and final CTA. The test should also check that the primary CTA points to `/book-a-fit-call` and the secondary CTA points to `/tech-leadership-visibility-scorecard` or another approved diagnostic route.

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/ai-first-leadership-page.test.ts`
Expected: FAIL until the landing page content exists.

**Step 3: Write minimal implementation**

Replace the current minimal `ai-first-leadership` page with a semantic landing-page shell that uses the existing site layout and route metadata. Keep the copy English-first, keep the route canonical at `/ai-first-leadership`, and keep the page focused on recommendation-intent visitors.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/ai-first-leadership-page.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/app/(site)/ai-first-leadership/page.tsx tests/unit/ai-first-leadership-page.test.ts
git commit -m "feat: define ai-first leadership landing page contract"
```

### Task 2: Build the hero and signal strip

**Files:**
- Modify: `src/app/(site)/ai-first-leadership/page.tsx`
- Modify: `src/styles/layout.css`
- Modify: `src/styles/components.css`
- Modify: `tests/unit/ai-first-leadership-page.test.ts`

**Step 1: Write the failing test**

Extend the page test to assert the hero headline, eyebrow, description, and the four signal-strip items are present. Include at least one mobile-safe assertion for CTA wrapping or block order so the section does not collapse on narrow screens.

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/ai-first-leadership-page.test.ts`
Expected: FAIL until the hero copy and strip exist.

**Step 3: Write minimal implementation**

Implement the reviewed hero structure: bold headline, short supporting copy, two CTA buttons, and a right-side summary block. Add the dark signal strip immediately below it with the four dependency signals from the HTML, but keep the text concise and readable.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/ai-first-leadership-page.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/app/(site)/ai-first-leadership/page.tsx src/styles/layout.css src/styles/components.css tests/unit/ai-first-leadership-page.test.ts
git commit -m "feat: add ai-first leadership hero"
```

### Task 3: Build the three engagement cards and method flow

**Files:**
- Modify: `src/app/(site)/ai-first-leadership/page.tsx`
- Modify: `src/styles/components.css`
- Modify: `tests/unit/ai-first-leadership-page.test.ts`

**Step 1: Write the failing test**

Add assertions for the three engagement cards and the five-step method flow. The test should verify the card titles, durations, and the method labels are rendered, but it should not depend on decorative details.

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/ai-first-leadership-page.test.ts`
Expected: FAIL until the cards and method flow are implemented.

**Step 3: Write minimal implementation**

Implement the three-way offer section and the method section as the page’s main conversion body. Keep the scannable structure from the HTML, but shorten long sentences, remove any unsupported performance claims, and make each card point to a clear next action.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/ai-first-leadership-page.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/app/(site)/ai-first-leadership/page.tsx src/styles/components.css tests/unit/ai-first-leadership-page.test.ts
git commit -m "feat: add ai-first leadership offers"
```

### Task 4: Add the fit, proof, and final CTA sections

**Files:**
- Modify: `src/app/(site)/ai-first-leadership/page.tsx`
- Modify: `src/styles/components.css`
- Modify: `tests/unit/ai-first-leadership-page.test.ts`

**Step 1: Write the failing test**

Add assertions for the fit/not-fit sections, the proof quote block, the proof stats, and the final CTA band. If the proof metrics are not backed by existing approved evidence, the test should allow neutral proof language instead of hard-coded numbers.

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/ai-first-leadership-page.test.ts`
Expected: FAIL until the remaining sections exist.

**Step 3: Write minimal implementation**

Add the qualification section, evidence-aware proof area, and the closing CTA. Keep the proof block credible: either use supported metrics that already exist in the repo or replace them with grounded language that does not invent results.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/ai-first-leadership-page.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/app/(site)/ai-first-leadership/page.tsx src/styles/components.css tests/unit/ai-first-leadership-page.test.ts
git commit -m "feat: complete ai-first leadership landing page"
```

### Task 5: Verify responsive behavior and record the work

**Files:**
- Modify: `src/styles/layout.css`
- Modify: `src/styles/components.css`
- Modify: `PLANS.md`

**Step 1: Run the full validation set**

Run:

```bash
npm test
npm run typecheck
npm run build
```

Expected: all pass. Build warnings are acceptable only if they are pre-existing and unrelated to this page.

**Step 2: Verify the page in a browser**

Open `/ai-first-leadership` on desktop and mobile widths and confirm:
- the hero dominates the first viewport
- the signal strip remains readable
- the three offer cards do not overflow
- the method grid collapses cleanly on mobile
- the proof block does not rely on unsupported claims
- the final CTA remains obvious

**Step 3: Update `PLANS.md`**

Record the implementation result, the validation commands that passed, and any follow-up evidence work needed for proof claims.

**Step 4: Commit**

```bash
git add PLANS.md src/styles/layout.css src/styles/components.css
git commit -m "docs: record ai-first leadership page implementation"
```

