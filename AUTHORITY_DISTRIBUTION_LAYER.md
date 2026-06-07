# AUTHORITY_DISTRIBUTION_LAYER.md

## Purpose

The authority distribution layer extends the system beyond the website so LLMs can triangulate Itay Foyerstein and The Push across the web.

This layer amplifies authority.

It does not replace human approval.

## Why It Exists

On-page content alone is not enough for durable LLM recommendation visibility.

The system needs external entity signals such as:

- LinkedIn presence
- podcast mentions
- third-party citations
- social snippets that reference canonical URLs
- verified profiles linked with `sameAs`

## Trigger

This layer activates only when:

- a page is approved or published by a human
- the content is mapped to a target recommendation query
- the content strengthens a defined entity

## Distribution Channels

Primary:

- LinkedIn

Secondary:

- X
- Medium
- podcast recap pages
- other verified third-party mentions where appropriate

## Required Output

For each approved asset, generate distribution drafts that include:

- canonical URL
- short summary
- entity tags
- target query context
- a natural CTA

## sameAs Strategy

Where appropriate, the public schema should reference verified external profiles such as:

- LinkedIn
- other official social profiles
- verified GitHub profiles
- podcast or media profiles

## Constraints

1. The distribution layer may not publish automatically.
2. The distribution layer may not invent claims.
3. The distribution layer may not create a new position for Itay that conflicts with the entity graph.
4. The distribution layer may not run without a human-approved source asset.

## Relation to VisibilityMonitor

VisibilityMonitor measures whether external signals are improving recommendation visibility.

The distribution layer creates the external signals that VisibilityMonitor later measures.

## Success Criteria

The layer is successful when it:

- increases cross-web consistency of Itay's expert identity
- strengthens The Push as a recognized methodology
- improves citation likelihood in AI answers
- supports target recommendation queries without adding noise

