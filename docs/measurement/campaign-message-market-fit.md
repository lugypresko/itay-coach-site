# Campaign Message-Market Fit Measurement

Status: implementation-ready, not yet a live measurement window

## Scope

Measure the first three acquisition campaigns without treating campaign traffic as an SEO authority signal:

- `/campaigns/operators-memo` -> sponsor conversation
- `/campaigns/field-notes` -> individual fit conversation
- `/campaigns/leadership-os` -> Leadership Dependency Assessment

Campaign pages remain `noindex`, outside primary navigation, and separate from the canonical service and sponsor pages.

## Event Contract

Every campaign CTA should carry:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `lp_concept`
- `audience`
- `cta_id`
- `landing_path`

Tracked events:

- `campaign_cta_click`
- `assessment_start`
- `assessment_complete`

## Conversion Definitions

**Qualified individual:** an Engineering Manager, Tech Lead, Group Lead, or technical leader has an active leadership dependency, can describe its impact, is willing to change operating behavior, and has a realistic next step or timing.

**Qualified organization:** a CTO, VP R&D, People/HR sponsor, or authorized influencer identifies an active manager or leadership-layer problem, can support behavior and decision-right changes, and has a plausible purchase path. An approved budget is not required at first contact.

Persona and qualification status are separate fields. Do not infer revenue quality from a click or a completed form alone.

## Review Window

Record results at days 30, 60, and 90 from the first approved campaign launch:

- Day 30: verify tracking, destination integrity, and early conversation quality. Do not declare a winner.
- Day 60: compare qualified conversation rate by campaign, audience, and CTA.
- Day 90: decide which message should inform canonical pages, which campaign receives more investment, and which is paused.

Required review fields:

- campaign and landing path
- buyer persona
- booked call
- attended call
- qualified conversation
- problem fit
- urgency
- sponsor strength
- next step
- reason lost or not a fit

## Human Review Gate

Before external traffic is sent, review every claim, CTA destination, email recipient configuration, and consent/privacy behavior. This document does not authorize publication, paid traffic, or deployment.
