# Authority Engine Memory Model

Version: 1.0

Status: Active

Owner: Authority Engine

## Purpose

This document defines the memory architecture of the Authority Engine.

It explains which layers store durable truth, which layers define contracts, which layers expose public authority, and which layers capture live measurement.

This document is descriptive only.

It does not add runtime behavior, publishing behavior, governance changes, or new agent behavior.

## Core Idea

The Authority Engine has more than one kind of memory.

Not everything that the system knows should live in the same place.

The model separates:

- editorial memory
- structural memory
- contract memory
- public surface memory
- measurement memory
- decision memory

## System Overview

```text
Supabase Postgres
  ↓
Payload CMS
  ↓
Structured editorial collections
  ↓
Repo contracts and docs
  ↓
Public routes and published pages
  ↓
Live measurement and signals
  ↓
Outcome mapping and COS recommendations
```

## Memory Layers

### 1. Storage Layer

**Supabase Postgres**

This is the database engine beneath the system.

It stores the records used by Payload and related runtime data.

### 2. Editorial Memory

**Payload CMS collections**

This is the durable editorial source of truth for structured content and authority data.

Typical collections include:

- ApprovedInsights
- InsightExtractions
- KnowledgeAssets
- Entities
- EntityRelationships
- AuthorityGaps
- QueryAuthorityScores
- VisibilityMonitoring
- ContentJobs
- AgentRuns
- ResearchSources
- InternalLinks
- PillarPages
- ClusterPages
- Frameworks
- CaseStudies
- FAQs
- GlossaryTerms
- LeadMagnets
- EmailSubscribers

These collections store the material that should survive across sessions and support the public authority system.

### 3. Structural Memory

**Authority graph and content structure**

This layer captures the meaning relationships the system depends on:

- entities
- relationships
- frameworks
- pillar pages
- cluster pages
- FAQ surfaces
- glossary terms

This is the memory that helps the system understand what the authority site is about and how the concepts connect.

### 4. Contract Memory

**Repo contracts and docs**

This layer defines how the system should behave.

Examples:

- `DATA_CONTRACTS.md`
- `docs/cos/CHIEF_OF_STAFF_OPERATING_MODEL.md`
- `docs/cos/CHIEF_OF_STAFF_DELEGATION_MATRIX.md`
- worker operating models in `workers/`
- `PageBrief` contracts
- `AuthorityOutcome` mappings
- recommendation records
- baseline and verification reports

This layer is not the same as editorial truth.

It defines the rules, shapes, and decision boundaries that editorial memory and public pages must follow.

### 5. Public Surface Memory

**Routes and published pages**

This layer is what the public can read.

Examples:

- `/about`
- `/the-push-methodology`
- `/faq`
- `/contact`
- `/leadership-coaching-for-tech-leaders`
- `/strategic-leadership`
- `/why-engineering-managers-become-bottlenecks`
- `/from-star-player-to-strategic-leader`
- `/why-smart-managers-burn-out`

Public routes are the readable surface of the authority system.

They are not the same thing as the underlying contract or the measurement layer.

### 6. Measurement Memory

**Vercel Analytics, Google Search Console, PostHog if enabled, and visibility monitoring**

This layer records what the public surface is doing in the real world.

Examples:

- page views
- CTA clicks
- crawl and index status
- query visibility
- cited entities
- cited pages
- confidence scores
- performance signals

This layer tells the system whether the published memory is being discovered and used.

### 7. Decision Memory

**AuthorityOutcomes and Chief of Staff recommendations**

This layer summarizes what the system should do next based on signals.

It includes:

- `AuthorityOutcome`
- `Chief of Staff` recommendation records
- next-best-action guidance

This is the highest decision layer, but it is still not execution.

## What Lives Where

### Payload CMS

Payload should hold durable structured editorial state.

Best fit examples:

- Approved insights
- Knowledge assets
- Entities and relationships
- Public content collections
- Research sources
- Visibility monitoring records
- Content workflow records

### Repo

The repo should hold contracts, docs, page briefs, launch rules, and recommendation records.

Best fit examples:

- operating models
- delegation matrices
- memory model docs
- page brief contracts
- recommendation records
- baseline and audit reports

### Production

Production should hold:

- published routes
- sitemap
- robots
- analytics
- live behavior

## Memory Hierarchy

When there is a conflict, the system should prefer memory in this order:

1. Live production signals
2. Payload editorial records
3. Repo contracts and operating docs
4. Derived recommendation records

This does not mean contracts are unimportant.

It means live signals are the strongest evidence of what is actually happening, while contracts define what should be allowed.

## Key Distinctions

### ApprovedInsight

An approved insight is durable source material.

It belongs in the editorial memory layer.

### KnowledgeAsset

A knowledge asset is a structured editorial object derived from approved insight.

It belongs in the editorial memory layer.

### PageBrief

A page brief is a contract for creating a public page.

It belongs in contract memory, not as the primary editorial source of truth.

### Public Page

A public page is the surfaced version of an asset.

It belongs in public surface memory.

### PerformanceSignal

A performance signal is measurement memory.

It records what happened in the real world.

### AuthorityOutcome

An authority outcome is decision memory.

It summarizes the business-level meaning of measured signals.

### Chief of Staff Recommendation

A Chief of Staff recommendation is executive decision memory.

It does not execute tasks.

It chooses the next best action and the human owner of that action.

## Practical Rule

If something must be preserved as a durable editorial fact, it belongs in Payload.

If something defines how the system should behave, it belongs in the repo.

If something is visible to users, it belongs in public routes.

If something measures behavior, it belongs in the measurement layer.

If something summarizes what to do next, it belongs in AuthorityOutcome or COS recommendation memory.

## Current State

The current architecture is partially implemented and partially contract-driven.

Current reality:

- Payload contains the main structured content and authority collections.
- The repo contains the operating model, contracts, page briefs, and recommendation records.
- Public routes render the live authority surface.
- Analytics now provide measurement.
- Authority outcomes and COS recommendations exist as decision-layer contracts and records, not as autonomous runtime behavior.

## Canonical Summary

The best short description of the model is:

```text
Payload stores structured editorial memory.
Repo stores contracts and decision models.
Public routes store the visible authority surface.
Analytics store measurement memory.
AuthorityOutcome and COS records store decision memory.
```

