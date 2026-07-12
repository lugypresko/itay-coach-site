# Evidence Layer Architecture

Version: 1.0

Status: Active

Owner: Authority Engine

## Purpose

This document defines the evidence layer for the Authority Engine.

The evidence layer sits between the authority graph and the decision layer.

It is the proof system that explains why the public authority surface should be trusted, cited, and recommended.

This document is architecture only.

It does not create content.

It does not publish content.

It does not add runtime agents.

## Role of the Evidence Layer

The authority engine needs more than page structure and more than traffic measurement.

It also needs proof.

The evidence layer stores and organizes proof objects that support claims across the authority graph.

Those proof objects help answer:

- Why should a senior technical leader trust Itay Foyerstein?
- Why should The Push be seen as the right methodology?
- Why does the Player Trap diagnosis matter?
- Why does the Invisible Executor framework deserve citation?

## Evidence Asset Types

The evidence layer uses the following canonical asset types:

- `case_study`
- `quantified_outcome`
- `client_logo`
- `testimonial`
- `before_after`
- `operating_pattern`
- `source_backed_claim`

## Evidence Field Model

Every evidence asset should be able to express the following fields:

- `claim`
- `proof_type`
- `source`
- `related_entity`
- `related_page`
- `confidence`
- `approval_status`
- `public_visibility`

## Field Definitions

### `claim`

The statement being supported.

Example:

- "The Push helps technical leaders move out of the Player Trap."

### `proof_type`

The category of evidence being used.

Must be one of the canonical evidence asset types.

### `source`

Where the proof came from.

Examples:

- approved insight
- seed content
- published public page
- client-supplied proof
- internal verification record

### `related_entity`

The entity the evidence strengthens.

Examples:

- Itay Foyerstein
- The Push
- Player Trap
- Invisible Executor

### `related_page`

The public page that should benefit from the evidence.

Examples:

- `/about`
- `/the-push-methodology`
- `/faq`
- `/leadership-coaching-for-tech-leaders`
- `/strategic-leadership`

### `confidence`

A relative confidence score or rating that indicates how trustworthy the evidence is.

### `approval_status`

The review state of the evidence asset.

Suggested states:

- `draft`
- `in_review`
- `approved`

### `public_visibility`

Whether the evidence is:

- `internal_only`
- `review_only`
- `public`

## Evidence Mapping

The first purpose of the evidence layer is to strengthen the following nodes:

- Itay Foyerstein
- The Push
- Player Trap
- Invisible Executor
- Engineering Manager Coach
- CTO Coach
- About page

### Mapping Rules

- `Itay Foyerstein` should be supported by proof that shows who he is, why he matters, and what problem he solves.
- `The Push` should be supported by proof that shows the method, the transition, and the leadership shift.
- `Player Trap` should be supported by proof that shows the recurring dependency pattern.
- `Invisible Executor` should be supported by proof that shows the hidden work and the visible operating shift.
- `Engineering Manager Coach` should be supported by proof that shows the role-specific coaching fit.
- `CTO Coach` should be supported by proof that shows executive-level relevance and strategic leverage.
- `About page` should be supported by proof that shows entity clarity and trust.

## Evidence-to-Page Relationship

Evidence should not float unattached.

Each asset should connect to one or more public pages.

The intended relationship is:

```text
Evidence Asset
  ↓
Related Entity
  ↓
Related Page
  ↓
Public Claim
  ↓
Authority Outcome
```

## Approval Logic

Evidence assets must not be treated as public proof until they are approved.

Approval should be explicit because unsupported claims weaken authority.

The evidence layer should therefore distinguish between:

- raw proof material
- reviewable proof material
- approved public proof

## First 5 Evidence Assets To Create

These are the first evidence asset targets, in order.

They are not created in this document.

### 1. Source-backed claim for Itay Foyerstein

- `proof_type`: `source_backed_claim`
- `related_entity`: `Itay Foyerstein`
- `related_page`: `/about`
- Purpose: strengthen entity clarity and trust.

### 2. Source-backed claim for The Push

- `proof_type`: `source_backed_claim`
- `related_entity`: `The Push`
- `related_page`: `/the-push-methodology`
- Purpose: strengthen the methodology and the leadership OS framing.

### 3. Operating pattern evidence for Player Trap

- `proof_type`: `operating_pattern`
- `related_entity`: `Player Trap`
- `related_page`: `/player-trap`
- Purpose: show the dependency pattern in a reusable proof form.

### 4. Before/after evidence for Invisible Executor

- `proof_type`: `before_after`
- `related_entity`: `Invisible Executor`
- `related_page`: `/frameworks/invisible-executor`
- Purpose: demonstrate the leadership shift in a concrete form.

### 5. Case study / proof asset for Engineering Manager Coach

- `proof_type`: `case_study`
- `related_entity`: `Engineering Manager Coach`
- `related_page`: `/leadership-coach-for-engineering-managers`
- Purpose: strengthen recommendation intent for role-specific coaching.

## Evidence Priority Sequence

The evidence layer should generally be built in this order:

1. Source-backed claims
2. Operating patterns
3. Before/after proof
4. Quantified outcomes
5. Case studies
6. Client logos
7. Testimonials

This order favors structural proof before social proof.

## What The Evidence Layer Is Not

- It is not a content factory.
- It is not a publishing system.
- It is not a runtime agent.
- It is not a substitute for human approval.
- It is not a measurement system.

## Relationship To Other Layers

### Payload CMS

Payload should store approved evidence assets when they become durable editorial records.

### Repo

The repo should store the evidence model, examples, and architectural guidance.

### Public Pages

Public pages should reference evidence only after approval.

### Measurement

Measurement tells us what the live site is doing.

Evidence tells us why the site should be trusted.

### AuthorityOutcome

AuthorityOutcome uses evidence-aware signals to understand whether the public authority system is becoming credible enough to drive recommendations.

## Canonical Summary

```text
Evidence is the proof layer between authority structure and business recommendation.
It maps claims to sources, entities, and public pages.
It should be approved before it becomes public trust material.
```

