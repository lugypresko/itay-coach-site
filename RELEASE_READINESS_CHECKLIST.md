# Release Readiness Checklist

Feature development is frozen until this checklist passes.

Release target:
- `Authority Engine Alpha`

Pass criteria:
- Each item below has concrete evidence, not a promise or a document-only placeholder.
- Any failed item remains a blocker for release.

## 1. Live boot verification for Task 002

- [ ] `docker compose up` starts Postgres successfully.
- [ ] `npm run dev` starts the app successfully.
- [ ] Payload admin loads locally without errors.
- [ ] Payload API responds locally without errors.
- Evidence:
  - [ ] Terminal output captured
  - [ ] Local URL captured
  - [ ] Admin/API smoke check captured

## 2. CMS admin access

- [ ] Admin login works with the configured local credentials.
- [ ] Admin shell renders without missing imports or runtime errors.
- [ ] Admin can access the expected collections.
- Evidence:
  - [ ] Login evidence captured
  - [ ] Collection access captured

## 3. Payload collections visible

- [ ] `entities`
- [ ] `entity_relationships`
- [ ] `authority_gaps`
- [ ] `competitors`
- [ ] `query_authority_scores`
- [ ] `insight_extractions`
- [ ] `visibility_monitoring`
- [ ] Core content collections appear as expected
- Evidence:
  - [ ] Collection list captured from admin
  - [ ] Collection config smoke checked

## 4. Seed drafts importable into CMS

- [ ] Entity draft for Itay Foyerstein imports
- [ ] The Push methodology draft imports
- [ ] Tech Leadership Coaching pillar draft imports
- [ ] Invisible Executor framework draft imports
- [ ] Case study draft imports
- [ ] Drafts remain `draft` or `review` on import
- Evidence:
  - [ ] Imported record IDs captured
  - [ ] Draft statuses captured

## 5. Human review flow for Task 006 / 006A

- [ ] Seed content requires human review before publication
- [ ] Insight intake requires human approval before generating new content
- [ ] Review status transitions are visible in CMS
- [ ] No agent can bypass review
- Evidence:
  - [ ] Review workflow captured
  - [ ] Approval/rejection example captured

## 6. VisibilityMonitor baseline run

- [ ] Baseline run executed for the first 10 scorecard queries
- [ ] Platforms included in baseline:
  - [ ] ChatGPT
  - [ ] Perplexity
  - [ ] Claude
  - [ ] Gemini
- [ ] Scorecard captures:
  - [ ] Platform
  - [ ] Prompt/query
  - [ ] Itay mentioned
  - [ ] The Push mentioned
  - [ ] Proprietary framework mentioned
  - [ ] URL cited
  - [ ] Competitors recommended
  - [ ] Recommendation position
  - [ ] Confidence/sentiment
  - [ ] Gap classification
  - [ ] Suggested owning agent
  - [ ] Previous score
  - [ ] Current score
  - [ ] Score delta
- Evidence:
  - [ ] Baseline report captured
  - [ ] One example scorecard captured

## 7. No agent can publish

- [ ] Agent users are blocked from publishing
- [ ] `draft` and `review` are allowed
- [ ] `approved` does not imply publish by automation
- [ ] Publishing requires human action
- Evidence:
  - [ ] Access rule check captured
  - [ ] Attempted publish block captured

## 8. All tests, typecheck, build pass

- [ ] `npm test`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- Evidence:
  - [ ] Command outputs captured

## Release Gate

Mark `Authority Engine Alpha` only when all 8 sections are fully checked and evidence is attached.

