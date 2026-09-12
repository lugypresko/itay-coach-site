# Production verification — 12 September 2026

Deployment: Vercel production deployment `dpl_DH3u4F4uNyvKEhNvYyWPLDjrAsif`  
Commit: `6a4577a53a3724abef29cdf580f3f0bc177a91e0`  
Domain: https://itayfoyerstein.com

## Deployment

- Vercel build state: `READY`
- Production alias: https://itayfoyerstein.com
- Inspector: https://vercel.com/fitay-yahoocoms-projects/itay-coach-site/DH3u4F4uNyvKEhNvYyWPLDjrAsif
- The build emitted the existing Postgres connection error while prerendering `sitemap.xml`/`llms.txt`; the deployment completed and the live endpoints returned 200. The database-backed live path still needs an environment/DB health check.

## Live HTTP checks

| URL | Status | Result |
|---|---:|---|
| `/robots.txt` | 200 | `Allow: /`; sitemap points to `/sitemap.xml` |
| `/sitemap.xml` | 200 | XML contains `/`, `/about`, `/the-push-methodology`, `/faq`, `/book-a-fit-call`; no redirects or 404s in the response |
| `/llms.txt` | 200 | Public routes and primary entities are listed |
| `/` | 200 | canonical: `https://itayfoyerstein.com` |
| `/about` | 200 | canonical self-reference; `robots: index, follow` |
| `/faq` | 200 | canonical self-reference; `robots: index, follow` |
| `/the-push-methodology` | 200 | canonical self-reference; `robots: index, follow` |
| `/book-a-fit-call` | 200 | canonical self-reference; no restrictive robots meta (default indexable) |

## GSC gate

No authenticated Google Search Console credentials or connected API were available in the local environment. A public `site:` query returned no result, which is not proof of non-indexing. The following must be checked in the verified GSC property:

1. URL Inspection for each canonical URL above.
2. Sitemap processing status and discovered URL count.
3. Page indexing reason for any excluded URL.
4. Canonical selected by Google versus user-declared canonical.
5. Non-branded impressions and clicks after the deployment date.

This document therefore marks technical production verification as complete and GSC verification as pending manual access. It does not claim that Google has indexed or served these pages.
