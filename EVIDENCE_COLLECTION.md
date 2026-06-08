# Evidence Collection Log

Status: in progress
Phase: verification only
Release target: Authority Engine Alpha

This log records concrete evidence gathered after the release freeze.
It does not expand the product.

## Verified locally

- `npm test` passed.
- `npm run build` passed.
- `npm run typecheck` passed after build-generated `.next/types` were available.
- Docker is not available in the current environment.

## Verified on Vercel

- Public app loads: `https://itay-coach-site.vercel.app/` returned `200`.
- Root public route renders the knowledge graph and CTAs.
- Deployment state is `READY` for production.
- Build/deploy metadata matches the latest branch commit.

## Verified in code

- No agent has a publish path.
- Seed drafts are review-only and map to the approved insight.
- Query Authority and Entity Authority baseline snapshot templates exist.
- Release readiness checklist exists.

## Still missing evidence

- Live Boot Verification for Task 002
- CMS admin access smoke test
- Payload collections visible in a running admin
- Import evidence for the seed drafts
- Human review flow evidence for Task 006 / Task 006A
- VisibilityMonitor baseline run output
- Payload admin route currently returns `500` on Vercel.
- Payload API routes currently return `500` on Vercel.
- Collection endpoints currently return `500` on Vercel.
- Build logs were not independently fetched from the deployment tool.

## Blocker

- Production runtime currently fails Payload initialization on Vercel because Postgres resolves to `127.0.0.1:5432`, blocking admin/API/collection verification.

## Error evidence

- Unhandled Rejection: undefined
- `Error: cannot connect to Postgres. Details: connect ECONNREFUSED 127.0.0.1:5432`
- `payloadInitError: true`
- `digest: '2273660799'`
