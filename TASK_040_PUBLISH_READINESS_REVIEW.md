# Task 040 Publish Readiness Review

Scope reviewed:
- `/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck`
- `/frameworks/invisible-executor`
- `/clusters/engineering-manager-coach-for-strategic-leadership`

Review basis:
- Browser-verified route rendering on the local production server
- Public content renderer
- Public schema output
- Route registry and sitemap generation
- Seed content source docs and review-ready Payload records

## Summary

All 3 assets require edit before publication.

Statuses:
- `/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck`: `needs_edit`
- `/frameworks/invisible-executor`: `needs_edit`
- `/clusters/engineering-manager-coach-for-strategic-leadership`: `needs_edit`

## Asset Review

### 1. `/clusters/coach-for-engineering-managers-stuck-as-the-bottleneck`

Status: `needs_edit`

Blocking issues:
- Duplicate FAQ content is present in the page body and in the structured FAQ array.
- The body contains FAQ markup that will be rendered as narrative content in addition to the structured FAQ block.

Non-blocking improvements:
- The CTA is aligned to the funnel.
- Evidence URLs are present and rooted in approved source material.
- Internal links are present and relevant.
- Metadata and schema are in place.
- Route rendering and sitemap inclusion are verified.

### 2. `/frameworks/invisible-executor`

Status: `needs_edit`

Blocking issues:
- Duplicate FAQ content is present in the page body and in the structured FAQ array.
- The body includes FAQ markup that will appear as narrative copy alongside the structured FAQ block.

Non-blocking improvements:
- CTA alignment is acceptable.
- Evidence URLs are present.
- Internal links are present.
- Metadata and schema are in place.
- Route rendering and sitemap inclusion are verified.

### 3. `/clusters/engineering-manager-coach-for-strategic-leadership`

Status: `needs_edit`

Blocking issues:
- Duplicate FAQ content is present in the page body and in the structured FAQ array.
- The page body includes FAQ markup that duplicates the structured FAQ section.

Non-blocking improvements:
- CTA alignment is acceptable.
- Evidence URLs are present.
- Internal links are present.
- Metadata and schema are in place.
- Route rendering and sitemap inclusion are verified.

## Human Approval Checklist

- Confirm the duplicate FAQ content is removed from the page body or the structured FAQ array is removed, but not both.
- Confirm each page still answers the target query directly after FAQ cleanup.
- Confirm each CTA remains routed to the intended funnel entry.
- Confirm no unsupported claims were introduced.
- Confirm evidence URLs stay tied to approved source docs.
- Confirm internal links remain to Player Trap, The Push, Invisible Executor, and Tech Leadership Coaching.
- Confirm metadata and schema still match the canonical public surface type.
- Confirm browser verification still passes after any edits.
- Confirm sitemap inclusion remains correct.

## Publish Decision

Not ready for publication yet.

