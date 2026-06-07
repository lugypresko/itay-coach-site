# SECURITY_RULES.md

## Security Principles

This repo will eventually connect to a CMS, database, email provider, model provider, and deployment platform. Treat secrets, publishing rights, and generated content as high-risk surfaces.

## Secret Handling

Never commit:

- `DATABASE_URL`
- `PAYLOAD_SECRET`
- `OPENROUTER_API_KEY`
- `RESEND_API_KEY`
- `CRON_SECRET`
- S3 credentials
- Vercel tokens
- Any production API key

Use environment variables and local `.env` files that are ignored by git.

## Agent Permissions

Agents may:

- Generate drafts.
- Suggest edits.
- Suggest internal links.
- Suggest schema.
- Run evaluations.

Agents must not:

- Publish content directly.
- Send emails to subscribers without explicit human approval.
- Change production environment variables.
- Delete content records without explicit human approval.
- Create unsupported claims.
- Bypass quality gates.

## CMS Safety

The CMS must support role-based access before production use.

Recommended roles:

- Admin
- Editor
- Reviewer
- Agent

The Agent role must not have publish permission.

## API Safety

Future API routes should:

- Validate inputs.
- Authenticate protected operations.
- Rate-limit content generation.
- Log agent runs.
- Reject requests without `CRON_SECRET` for cron endpoints.
- Never expose provider keys to the browser.

## Content Safety

Generated content must not:

- Invent Itay Foyerstein credentials.
- Invent client names.
- Invent case-study metrics.
- Misrepresent coaching outcomes.
- Promise promotion, compensation increase, hiring success, or business results.

Claims must be sourced, framed as opinion, or removed.
