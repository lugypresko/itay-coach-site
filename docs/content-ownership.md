# Published content ownership — 2026-09-16

The current reader-facing offer is owned by the route modules in `src/app/(site)` and their imported content helpers. The diagnostic copy is owned by `src/components/push-conversation.tsx` and `src/lib/push-conversation.ts`; its public title and description are declared beside the route in `src/app/(site)/player-trap/page.tsx`.

| Surface | Owner | Published fields |
|---|---|---|
| Home | `src/app/(site)/page.tsx` and home components | title, description, H1, offer sections, schema |
| About | `src/app/(site)/about/page.tsx` | title, description, sections |
| Method | `src/app/(site)/the-push-methodology/page.tsx` | title, description, sections |
| FAQ | `src/app/(site)/faq/page.tsx` | title, description, FAQ sections |
| Contact | `src/app/(site)/contact/page.tsx` | title, description, contact sections |
| The Push offer | `src/app/(site)/entities/the-push/page.tsx` | title, description, engagement terms |
| Diagnostic | `src/app/(site)/player-trap/page.tsx`, `src/components/push-conversation.tsx` | title, description, prompts, diagnosis copy |

Payload governed public assets are projected through `src/lib/publication-surface-projection.ts`; they are not an alternate source for the fixed pages above.
