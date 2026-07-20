# Resend Production Configuration

The lead form sends through `POST /api/fit-call/lead` and `sendResendEmail`.

Configure these variables in Vercel for Preview/Production as appropriate:

- `RESEND_API_KEY`: secret API key from Resend.
- `RESEND_FROM_EMAIL`: verified sender, for example `The Push <no-reply@itayfoyerstein.com>`.
- `RESEND_REPLY_TO`: reply address used for lead conversations.
- `FIT_CALL_LEADS_TO`: inbox that receives fit-call requests.

`RESEND_API_KEY` is intentionally blank in `.env.example` and must never be committed. The application allows dry-run delivery locally when the key is absent, but fails explicitly in production instead of reporting a successful lead that was not delivered.

## Verification

1. Add the variables in Vercel Project Settings > Environment Variables.
2. Redeploy after changing variables.
3. Submit one real fit-call form with a controlled address.
4. Confirm the email arrives at `FIT_CALL_LEADS_TO` and replies target the submitted work email.
5. Check the function log for `deliveryMode: "live"`; do not treat `dry-run` as production success.
