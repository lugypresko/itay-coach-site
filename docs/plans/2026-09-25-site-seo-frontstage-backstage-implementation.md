# The Push SEO Frontstage/Backstage Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Align the public site with the North Star message while preserving the backstage SEO authority engine, fixing indexability conflicts, and adding repeatable verification before any Preview or Production release.

**Architecture:** Keep `publication-surface-projection.ts` as the discovery/indexability boundary and keep the existing authority records, target queries, schema inputs, analytics, and evidence backstage. Add a small explicit frontstage policy and route-intent contract so reader-facing renderers expose only buyer-useful copy. Promote pages into the sitemap only when the same publication decision makes them canonical, indexable, approved, and free of frontstage leakage.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Payload CMS 3, Vitest, ESLint, Vercel Preview.

---

## Settled product decisions

1. **North Star:** “Does this help the right manager recognize that the way work depends on them no longer fits the size of their role — and move toward a conversation? If not, remove it.”
2. **Frontstage:** visible headings, prose, navigation, CTA labels, forms, and rendered supporting content must pass the North Star.
3. **Backstage:** SEO architecture, schemas, target queries, authority graph, evidence, analytics, and internal content-decision metadata remain when they help attract or measure the right audience.
4. **Boundary rule:** remove backstage language from the customer experience; do not delete the engine or its data.
5. **Homepage hero:** use the approved copy exactly:
   - H1: `Your role grew. Your operating model didn’t.`
   - Support: `You’re still carrying decisions, escalations and execution work that keep you operating below the level your role requires.`
   - Brand line: `Stop being the system.`
6. **Hebrew:** low priority. Keep the route available, but do not advertise it to search engines until a correct locale-level `<html lang="he">` implementation is funded.
7. **Release scope:** Preview only during this plan. No Production deployment, database migration, seed, or real user-data submission.

## Route roles used by this plan

| Route | Frontstage job | Search intent | Initial publication rule |
|---|---|---|---|
| `/` | Primary offer and recognition page | broad technical leadership coaching | indexable |
| `/engineering-manager-coach` | Role-specific commercial page | Engineering Manager coach | promote only after copy/metadata review passes |
| `/pillars/tech-leadership-coaching` | Educational pillar that earns the category | informational/category intent | promote only after rewrite and review pass |
| `/faq` | Buyer questions and objection handling | question/decision support | indexable |
| `/about` | Trust and named-expert proof | person/coach evaluation | indexable |
| `/entities/*`, review-stage frameworks/problems | Backstage authority records with optional public projections | entity/topic support | noindex and absent from sitemap until the rendered page passes publication gates |
| `/he/problems/product-engineering-misalignment` | Deferred Hebrew experiment | Hebrew problem intent | temporarily noindex and absent from sitemap |

## Execution safety

- The current `site-next` worktree contains many modified and untracked files. Preserve them; do not reset, checkout, or bulk-format unrelated files.
- Before implementation, record `git status --short`, `git rev-parse HEAD`, and `git diff --stat` in the task evidence.
- Prefer a dedicated worktree only after the current WIP has a recoverable commit/checkpoint. Do not create a worktree from an uncommitted state and assume it contains this WIP.
- Each task below gets one focused commit. If unrelated dirty files prevent a clean commit, stage only the files named by that task.

## Atomic task tracker

| ID | Deliverable | Depends on | Priority |
|---|---|---|---|
| SEO-01 | Frontstage/backstage contract | None | P0 |
| SEO-02 | Homepage North Star hero | SEO-01 | P0 |
| SEO-03 | Single indexability contract | SEO-01 | P0 |
| SEO-04 | Frontstage leakage guard | SEO-01 | P0 |
| SEO-05 | Distinct homepage, EM-coach, and pillar roles | SEO-02, SEO-04 | P1 |
| SEO-06 | Metadata normalization | SEO-05 | P1 |
| SEO-07 | Consistent schema graph | SEO-03, SEO-05 | P1 |
| SEO-08 | Deferred Hebrew route made search-safe | SEO-03 | P1 |
| SEO-09 | Truthful discovery dates and llms parity | SEO-03 | P2 |
| SEO-10 | Automated SEO/indexability guard | SEO-03, SEO-04, SEO-06, SEO-07, SEO-08 | P1 |
| SEO-11 | Local and Preview verification | SEO-02–SEO-10 | P0 release gate |

### Task SEO-01: Codify the Frontstage/Backstage contract

**Files:**
- Create: `docs/contracts/frontstage-backstage-seo-contract.md`
- Create: `src/lib/frontstage-copy-policy.ts`
- Create: `tests/unit/frontstage-copy-policy.test.ts`

**Step 1: Write the contract document**

Document the settled decisions above, the exact North Star, the route-role table, and these non-negotiable examples:

```text
Allowed backstage: target queries, authority graph edges, schema IDs, evidence status, analytics dimensions.
Forbidden frontstage: “authority graph”, “target queries”, “evidence count”, “recommendation intent”, “content status”, “not reviewed yet”.
```

State explicitly that `llms.txt`, JSON-LD, analytics payloads, CMS fields, and internal governance files are not customer copy.

**Step 2: Write the failing policy tests**

Create a pure function contract:

```ts
export const frontstageForbiddenPatterns: readonly RegExp[];
export function findFrontstageLeaks(value: unknown): string[];
```

Test that the function rejects all six forbidden examples, accepts the approved homepage copy, recursively checks arrays/objects, and does not mutate its input.

**Step 3: Run the focused test and verify failure**

Run:

```powershell
npx vitest run tests/unit/frontstage-copy-policy.test.ts
```

Expected: FAIL because `frontstage-copy-policy.ts` does not exist.

**Step 4: Implement the minimal pure policy helper**

The helper must return stable machine-readable codes, not throw and not inspect hidden backstage records unless a caller explicitly passes a reader-facing projection.

**Step 5: Run the focused test**

Expected: PASS.

**Step 6: Commit**

```powershell
git add docs/contracts/frontstage-backstage-seo-contract.md src/lib/frontstage-copy-policy.ts tests/unit/frontstage-copy-policy.test.ts
git commit -m "docs: define frontstage backstage seo contract"
```

### Task SEO-02: Apply the approved homepage hero

**Files:**
- Modify: `src/app/(site)/page.tsx`
- Create: `tests/unit/homepage-north-star-copy.test.tsx`

**Step 1: Write the failing rendered-copy test**

Render `HomePage` with `renderToStaticMarkup` and assert:

```ts
expect(html).toContain("Your role grew. Your operating model didn’t.");
expect(html).toContain("You’re still carrying decisions, escalations and execution work that keep you operating below the level your role requires.");
expect(html).toContain("Stop being the system.");
expect(html).not.toContain("Your team can do the work. The decisions still come back to you.");
```

Also assert exactly one `<h1` and that the brand line is not the H1.

**Step 2: Verify the test fails**

Run:

```powershell
npx vitest run tests/unit/homepage-north-star-copy.test.tsx
```

Expected: FAIL on the new H1.

**Step 3: Make the minimal hero change**

In `src/app/(site)/page.tsx`:

```tsx
<h1 className="next-home-heading">Your role grew. Your operating model didn’t.</h1>
<p className="hero-copy">
  You’re still carrying decisions, escalations and execution work that keep you operating below the level your role requires.
</p>
<p className="hero-brand-line"><strong>Stop being the system.</strong></p>
```

Do not rewrite lower-page sections in this task.

**Step 4: Run the focused test**

Expected: PASS.

**Step 5: Visually inspect desktop and mobile locally**

Verify no hero clipping at `1440x900` and `390x844`, and that the H1, support line, brand line, and primary CTA appear before the first long scroll.

**Step 6: Commit**

```powershell
git add src/app/(site)/page.tsx tests/unit/homepage-north-star-copy.test.tsx
git commit -m "feat: align homepage hero with north star"
```

### Task SEO-03: Make indexability one explicit contract

**Files:**
- Modify: `src/lib/publication-surface-projection.ts`
- Modify: `src/lib/public-authority-routes.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `tests/unit/publication-surface-projection.test.ts`
- Modify: `tests/unit/site-url-and-sitemap.test.ts`
- Create: `tests/unit/seo-indexability-contract.test.ts`

**Step 1: Write failing invariants**

For every sitemap entry, assert all of the following come from the same `PublicationSurfaceEntry`:

```ts
expect(entry.publicationDecision.indexable).toBe(true);
expect(entry.publicationDecision.sitemapEligible).toBe(true);
expect(new URL(entry.publicationDecision.canonicalUrl!).pathname).toBe(entry.pathname);
expect(entry.lastModified).toBeInstanceOf(Date);
```

Add negative fixtures proving that review, noindex, non-canonical, and missing-date entries never enter `sitemapPathnames` or `llmsTxtPathnames`.

**Step 2: Verify focused failures**

```powershell
npx vitest run tests/unit/publication-surface-projection.test.ts tests/unit/site-url-and-sitemap.test.ts tests/unit/seo-indexability-contract.test.ts
```

**Step 3: Remove duplicate sitemap policy**

Make `loadPublicationSurfaceProjection()` the sole source used by `sitemap.ts` and `llms.txt`. Keep audit registries such as `publicAuthorityAssetRoutes`, but do not derive crawlable URLs directly from registry membership.

`getPublicAuthoritySitemapPathnames()` may remain as a compatibility wrapper only if it delegates to the same publication policy; otherwise remove its use from tests and runtime code.

**Step 4: Add the regression assertion for the audited failure**

Given the current noindex set, verify none of these URLs is emitted until its publication decision is changed to indexable:

```ts
[
  "/entities/itay-foyerstein",
  "/entities/the-push",
  "/frameworks/invisible-executor",
  "/problems/engineering-managers-stuck-in-firefighting",
  "/problems/product-engineering-misalignment",
]
```

Do not hard-code a permanent noindex rule for the pillar; SEO-05 owns its promotion after the rewrite.

**Step 5: Run focused tests**

Expected: PASS with zero sitemap/noindex conflicts.

**Step 6: Commit**

```powershell
git add src/lib/publication-surface-projection.ts src/lib/public-authority-routes.ts src/app/sitemap.ts tests/unit/publication-surface-projection.test.ts tests/unit/site-url-and-sitemap.test.ts tests/unit/seo-indexability-contract.test.ts
git commit -m "fix: unify sitemap and indexability decisions"
```

### Task SEO-04: Prevent backstage language from leaking into Frontstage

**Files:**
- Modify: `src/ai/governance/reader-facing-artifact-governance.ts`
- Modify: `src/lib/reader-facing-publication.ts`
- Modify: `tests/unit/reader-facing-artifact-governance.test.ts`
- Modify: `tests/unit/canonical-authority-sprint.test.ts`
- Modify: `tests/unit/reader-facing-publication-boundary.test.ts`

**Step 1: Add failing leakage cases**

Extend the existing internal-language table with:

```ts
["authority graph", "internal_meta_copy"],
["target queries", "internal_meta_copy"],
["evidence count", "internal_meta_copy"],
["recommendation intent", "internal_meta_copy"],
["LLM SEO Authority Engine", "internal_meta_copy"],
```

Add a rendered-page test that passes a record containing valid backstage fields and verifies those fields remain on the record but do not appear in `PublicContentPage` HTML.

**Step 2: Verify failures**

```powershell
npx vitest run tests/unit/reader-facing-artifact-governance.test.ts tests/unit/canonical-authority-sprint.test.ts tests/unit/reader-facing-publication-boundary.test.ts
```

**Step 3: Reuse the shared frontstage policy**

Call `findFrontstageLeaks()` from the artifact governance layer and from reader-facing projection tests. Do not strip or delete the backstage fields from Payload records, PageBriefs, analytics, evidence registries, JSON-LD inputs, or authority-graph structures.

**Step 4: Verify the boundary**

Expected:

- reader HTML contains no forbidden phrases;
- backstage fixtures still contain target queries and authority relationships;
- `llms.txt` is not treated as visible customer copy;
- non-public records continue to emit no schema.

**Step 5: Commit**

```powershell
git add src/ai/governance/reader-facing-artifact-governance.ts src/lib/reader-facing-publication.ts tests/unit/reader-facing-artifact-governance.test.ts tests/unit/canonical-authority-sprint.test.ts tests/unit/reader-facing-publication-boundary.test.ts
git commit -m "fix: enforce frontstage backstage content boundary"
```

### Task SEO-05: Give the homepage, EM page, and pillar distinct jobs

**Files:**
- Modify: `src/lib/public-content.ts`
- Modify: `src/lib/authority-launch-pages.ts`
- Modify: `src/ai/content-decision/canonical-page-chain.ts`
- Modify: `src/seed/content-decision-page-mapping.ts`
- Modify: `src/app/(site)/engineering-manager-coach/page.tsx`
- Modify: `tests/unit/engineering-manager-coach-chain.test.ts`
- Modify: `tests/unit/canonical-authority-sprint.test.ts`
- Create: `tests/unit/search-intent-separation.test.ts`

**Step 1: Write the failing route-role test**

Assert that the three routes have unique titles, descriptions, H1s, primary intents, and reader outcomes:

```ts
expect(home.intent).toBe("primary_offer");
expect(engineeringManager.intent).toBe("role_specific_offer");
expect(pillar.intent).toBe("educational_pillar");
expect(new Set([home.title, engineeringManager.title, pillar.title]).size).toBe(3);
```

Do not label title overlap alone as proven cannibalization; Search Console evidence is a separate measurement task.

**Step 2: Verify failure**

```powershell
npx vitest run tests/unit/search-intent-separation.test.ts tests/unit/engineering-manager-coach-chain.test.ts tests/unit/canonical-authority-sprint.test.ts
```

**Step 3: Rewrite only reader-facing projections**

- Home: recognition and broad offer.
- Engineering Manager page: role-specific symptoms, operating-model gap, evidence, fit, and conversation CTA.
- Pillar: educational diagnosis, alternatives, examples, framework explanation, and links to the role-specific offer and diagnostic.

Preserve source insight IDs, target queries, PageBrief provenance, authority relationships, and evidence mappings backstage.

**Step 4: Apply the publication gate**

The EM page and pillar become indexable only when:

1. frontstage leakage check passes;
2. metadata is unique;
3. canonical is self-referencing;
4. human/publication approval is present;
5. rendered page has one primary CTA and useful body content.

Do not use a word-count threshold as the approval rule. Add a minimum completeness test based on required sections instead.

**Step 5: Run focused tests**

Expected: PASS; the authority engine data remains available and the rendered outputs have distinct jobs.

**Step 6: Human copy checkpoint**

Record Itay’s approval of the final EM page and pillar copy before changing either publication decision to indexable.

**Step 7: Commit**

```powershell
git add src/lib/public-content.ts src/lib/authority-launch-pages.ts src/ai/content-decision/canonical-page-chain.ts src/seed/content-decision-page-mapping.ts src/app/(site)/engineering-manager-coach/page.tsx tests/unit/engineering-manager-coach-chain.test.ts tests/unit/canonical-authority-sprint.test.ts tests/unit/search-intent-separation.test.ts
git commit -m "feat: separate offer role and pillar search intent"
```

### Task SEO-06: Normalize titles and descriptions

**Files:**
- Create: `src/lib/seo-metadata-policy.ts`
- Create: `tests/unit/seo-metadata-policy.test.ts`
- Modify: `src/app/(site)/page.tsx`
- Modify: `src/lib/authority-launch-pages.ts`
- Modify: `src/app/(site)/[section]/[slug]/page.tsx`
- Modify: `tests/unit/public-page-metadata.test.ts`

**Step 1: Write failing metadata-policy tests**

House rules:

- visible title target: 30–65 characters;
- description target: 110–160 characters;
- canonical must use `https://itayfoyerstein.com` in production;
- no duplicate title across the three primary intent pages;
- no backstage phrase in title or description.

Treat length as a house warning for maintainability, not a Google ranking guarantee.

**Step 2: Verify failure**

```powershell
npx vitest run tests/unit/seo-metadata-policy.test.ts tests/unit/public-page-metadata.test.ts
```

**Step 3: Update metadata**

Use this homepage baseline unless copy review supplies a better variant:

```ts
title: "Technical Leadership Coaching for Engineering Managers"
description: "Technical leadership coaching for managers whose roles have grown but whose teams still depend on them for decisions, escalations and execution."
```

Keep Next.js’s root title template responsible for adding `| The Push` exactly once.

**Step 4: Run focused tests**

Expected: PASS with unique metadata and no doubled brand suffix.

**Step 5: Commit**

```powershell
git add src/lib/seo-metadata-policy.ts tests/unit/seo-metadata-policy.test.ts src/app/(site)/page.tsx src/lib/authority-launch-pages.ts src/app/(site)/[section]/[slug]/page.tsx tests/unit/public-page-metadata.test.ts
git commit -m "fix: normalize public seo metadata"
```

### Task SEO-07: Build a consistent schema graph without polluting Frontstage

**Files:**
- Create: `src/lib/site-schema.ts`
- Create: `tests/unit/site-schema.test.ts`
- Modify: `src/lib/public-schema.ts`
- Modify: `src/app/(site)/page.tsx`
- Modify: `src/app/(site)/about/page.tsx`
- Modify: `src/app/(site)/faq/page.tsx`
- Modify: `tests/unit/publication-schema-eligibility.test.ts`

**Step 1: Write failing schema tests**

Define stable IDs:

```ts
const IDs = {
  website: "https://itayfoyerstein.com/#website",
  person: "https://itayfoyerstein.com/#itay-foyerstein",
  service: "https://itayfoyerstein.com/#the-push-service",
};
```

Assert:

- homepage emits `WebSite`, `WebPage`, `Person`, and `Service` in one `@graph`;
- About references the same Person `@id`;
- service pages reference the same provider and service IDs;
- FAQ schema contains only questions visibly rendered on `/faq`;
- noindex pages emit no public schema;
- every JSON-LD block serializes and parses successfully.

**Step 2: Verify failures**

```powershell
npx vitest run tests/unit/site-schema.test.ts tests/unit/publication-schema-eligibility.test.ts
```

**Step 3: Implement shared builders**

Keep schema generation backstage. Do not render schema labels or properties as visible copy. Reuse `buildPageJsonLd()` for dynamic authority pages and add the site-wide graph through `site-schema.ts`.

**Step 4: Run focused tests**

Expected: PASS. Do not claim that schema guarantees ranking or rich results.

**Step 5: Commit**

```powershell
git add src/lib/site-schema.ts tests/unit/site-schema.test.ts src/lib/public-schema.ts src/app/(site)/page.tsx src/app/(site)/about/page.tsx src/app/(site)/faq/page.tsx tests/unit/publication-schema-eligibility.test.ts
git commit -m "feat: add consistent public schema graph"
```

### Task SEO-08: Make the deferred Hebrew page search-safe

**Files:**
- Modify: `src/app/(site)/he/problems/product-engineering-misalignment/page.tsx`
- Modify: `src/lib/publication-surface-projection.ts`
- Modify: `tests/unit/site-url-and-sitemap.test.ts`
- Create: `tests/unit/hebrew-route-policy.test.tsx`

**Step 1: Write the failing temporary-policy test**

Assert that the Hebrew route:

- remains reachable and renders `<main lang="he" dir="rtl">`;
- declares `robots: { index: false, follow: true }`;
- is absent from sitemap and `llms.txt`;
- has no false hreflang declaration until a real reciprocal locale pair exists.

**Step 2: Verify failure**

```powershell
npx vitest run tests/unit/hebrew-route-policy.test.tsx tests/unit/site-url-and-sitemap.test.ts
```

**Step 3: Apply the temporary low-priority policy**

Remove the Hebrew pathname from `indexableFixedPathnames` and change its metadata to `noindex, follow`. Keep the reader-visible Hebrew semantics on `<main>`.

Do not add fake `hreflang` tags and do not attempt a large route-layout refactor in this task.

**Step 4: Run focused tests**

Expected: PASS.

**Step 5: Commit**

```powershell
git add src/app/(site)/he/problems/product-engineering-misalignment/page.tsx src/lib/publication-surface-projection.ts tests/unit/site-url-and-sitemap.test.ts tests/unit/hebrew-route-policy.test.tsx
git commit -m "fix: defer hebrew route from search discovery"
```

### Task SEO-09: Make discovery timestamps and llms surfaces truthful

**Files:**
- Modify: `src/lib/publication-surface-projection.ts`
- Modify: `src/app/llms.txt/route.ts`
- Modify: `tests/unit/publication-surface-projection.test.ts`
- Modify: `tests/unit/site-url-and-sitemap.test.ts`

**Step 1: Write failing date and parity tests**

Assert that:

- each fixed route owns an explicit `lastModified` value;
- a fixed global date is not stamped onto every page;
- Payload-backed content prefers `updatedAt`, then `lastReviewedAt`, then `publishedAt`;
- every `llms.txt` route is canonical and indexable;
- a noindex route never appears in `llms.txt`.

**Step 2: Verify failure**

```powershell
npx vitest run tests/unit/publication-surface-projection.test.ts tests/unit/site-url-and-sitemap.test.ts
```

**Step 3: Replace the global fixed date**

Extend `FixedPublicationSurfaceRoute`:

```ts
interface FixedPublicationSurfaceRoute {
  pathname: string;
  llmsTxtEligible: boolean;
  lastModified: Date;
}
```

Update a route’s date only when its reader-facing content changes. Keep the technical `llms.txt` vocabulary backstage; change only inaccurate or non-public route claims.

**Step 4: Run focused tests**

Expected: PASS with multiple meaningful dates and exact sitemap/llms parity.

**Step 5: Commit**

```powershell
git add src/lib/publication-surface-projection.ts src/app/llms.txt/route.ts tests/unit/publication-surface-projection.test.ts tests/unit/site-url-and-sitemap.test.ts
git commit -m "fix: make discovery surfaces reflect publication truth"
```

### Task SEO-10: Add an automated SEO/indexability guard

**Files:**
- Create: `scripts/check-seo-contract.mjs`
- Create: `tests/unit/seo-contract-script.test.ts`
- Modify: `package.json`
- Modify: `.github/workflows/ci.yml`

**Step 1: Write failing parser tests**

Export pure functions from the script for tests. Given fixture HTML and sitemap XML, detect:

- non-200 URL;
- sitemap URL with `noindex`;
- missing or cross-page canonical;
- duplicate/missing H1;
- missing title/description;
- invalid JSON-LD;
- forbidden frontstage phrase;
- declared language mismatch when a route policy specifies a locale.

**Step 2: Verify failure**

```powershell
npx vitest run tests/unit/seo-contract-script.test.ts
```

**Step 3: Implement the read-only checker**

CLI contract:

```powershell
npm run check:seo -- --base-url http://localhost:3015
```

The command must read pages only, submit no forms, write no user data, and exit nonzero with one line per violated URL.

**Step 4: Add package and CI commands**

```json
{
  "scripts": {
    "check:seo": "node scripts/check-seo-contract.mjs"
  }
}
```

Run the pure unit tests in normal CI. Run the live URL mode only after CI starts the built application or receives a Preview URL.

**Step 5: Verify locally**

Expected: exit code `0`, no sitemap/noindex conflict, and no frontstage leakage.

**Step 6: Commit**

```powershell
git add scripts/check-seo-contract.mjs tests/unit/seo-contract-script.test.ts package.json .github/workflows/ci.yml
git commit -m "test: add automated seo publication guard"
```

### Task SEO-11: Run release-gate verification on Local and Preview

**Files:**
- Create: `output/site-next/seo-2026-09-25/local/result.md`
- Create: `output/site-next/seo-2026-09-25/preview/result.md`
- Update after results: `docs/plans/2026-09-25-site-seo-frontstage-backstage-implementation.md`

**Step 1: Refresh the code graph after implementation**

From `C:\Users\longy\itay-workspace\itaycoach`:

```powershell
graphify update .
```

Expected: graph update completes without shrinking/corruption warnings. Record any warning instead of hiding it.

**Step 2: Run focused SEO tests**

```powershell
npx vitest run tests/unit/frontstage-copy-policy.test.ts tests/unit/homepage-north-star-copy.test.tsx tests/unit/seo-indexability-contract.test.ts tests/unit/search-intent-separation.test.ts tests/unit/seo-metadata-policy.test.ts tests/unit/site-schema.test.ts tests/unit/hebrew-route-policy.test.tsx tests/unit/seo-contract-script.test.ts
```

Expected: all PASS.

**Step 3: Run the full local quality gate**

```powershell
npm test
npm run typecheck
npm run lint
npm run build
git diff --check
```

Expected: all exit `0`. Existing unrelated failures must be recorded with exact test names; do not relabel them as SEO failures.

**Step 4: Start the built app and run the read-only guard**

```powershell
$env:PORT='3015'
npm start
npm run check:seo -- --base-url http://localhost:3015
```

Expected: all intended indexable pages return 200 and pass the contract; no form submission occurs.

**Step 5: Capture Local visual evidence**

At `1440x900` and `390x844`, inspect:

- homepage hero hierarchy and CTA;
- Engineering Manager page role-specific message;
- pillar information architecture;
- FAQ visible questions;
- absence of backstage vocabulary.

**Step 6: Deploy Preview only**

Use the Vercel deployment workflow without `--prod`. Record Preview URL, deployment ID, branch, commit, and timestamp.

**Step 7: Run the read-only guard against Preview**

```powershell
npm run check:seo -- --base-url https://<preview-host>
```

Expected: exit `0`. Do not submit forms or real contact data.

**Step 8: Record Google-facing manual checks**

Use Rich Results Test for homepage, About, FAQ, pillar, and EM page. Record valid/invalid result and screenshots. Search Console recrawl/submission belongs to a separately authorized release task after Production deployment.

**Step 9: Update task statuses**

Mark a task PASS only with command output or browser evidence. Mark unresolved items BLOCKED with the exact blocker. Do not mark Production complete in this plan.

**Step 10: Commit verification evidence**

```powershell
git add output/site-next/seo-2026-09-25 docs/plans/2026-09-25-site-seo-frontstage-backstage-implementation.md
git commit -m "docs: record seo local and preview verification"
```

## Completion criteria

The plan is complete only when all conditions below are proven:

1. The approved homepage H1, support copy, and brand line render exactly once.
2. Every sitemap URL is canonical, indexable, dated, and returns 200.
3. No noindex URL appears in sitemap or `llms.txt`.
4. Backstage SEO data still exists and remains available to schema, analytics, authority, and content-decision systems.
5. No backstage vocabulary appears in customer-visible HTML.
6. Home, Engineering Manager, and pillar pages have distinct search and buyer jobs.
7. Schema is valid, consistent, tied to visible content, and absent from noindex pages.
8. The deferred Hebrew route is reachable but not advertised for indexing.
9. Focused tests, full tests, typecheck, lint, build, and `git diff --check` pass.
10. The read-only SEO guard passes on Local and Vercel Preview.
11. No Production deployment, migration, seed, or real-data submission occurred.

## Deferred follow-up work

- Implement a true Hebrew locale root and reciprocal hreflang only when Hebrew becomes a business priority.
- Connect Search Console API and measure real query-to-URL overlap before declaring cannibalization.
- Request recrawl and resubmit sitemap only after an explicitly authorized Production release.
- Add scheduled external monitoring after the deploy-time guard is stable.

