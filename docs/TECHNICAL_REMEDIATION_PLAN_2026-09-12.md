# Technical remediation plan — publication, build and mobile

## Objective

Make the public site safe to crawl, reproducible to build, and usable on a mobile viewport without changing the Authority Engine or redesigning the site.

## Work sequence

1. **Publication boundary** — make metadata, sitemap and `llms.txt` consume the same publication decision; exclude every noindex or non-canonical route.
2. **Sitemap freshness** — replace request-time timestamps with the source record's `updatedAt`, `lastReviewedAt`, or a fixed route release date, with a deterministic fallback.
3. **Broken canonical route** — make `/engineering-manager-coach` render its approved reader-facing artifact; add a regression test that the route does not call `notFound()`.
4. **Build gate** — align the CI Node version with Prisma's supported range, run CI on pull requests, `main`, and the working release branch, and verify `npm ci` from a clean install.
5. **Mobile conversion** — fix Player Trap hero spacing and CTA hierarchy at narrow widths; verify with a real browser viewport.

## Definition of Done

- Every sitemap URL has a matching `index, follow` decision and self-canonical URL.
- No sitemap URL returns 404 or redirect.
- `lastModified` is deterministic and derived from content/release metadata.
- `/engineering-manager-coach` returns 200 and renders a buyer-facing page.
- `npm ci`, typecheck, lint, tests and build pass in CI.
- CI runs on PRs and pushes to `main` and `codex/push-code-to-github`.
- Player Trap mobile CTA text meets readable contrast/size and the primary action is visually dominant.
- No client evidence, metrics, testimonials, or invented claims are added.
- Every change is local, reversible, covered by a regression check, and documented by commit.

## Explicitly deferred

- Redirects for historical internal URLs until the exact GSC list is supplied.
- Authority Engine or manifest refactors.
- New SEO routes and a site-wide redesign.

## Rollback

Each workstream is isolated in its own commit. Revert the relevant commit if a live check reveals a regression; do not roll back unrelated content or diagnostic changes.
