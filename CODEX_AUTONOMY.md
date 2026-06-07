# CODEX_AUTONOMY.md

## Purpose

This file defines when Codex may proceed autonomously and when it must stop.

## Autonomy Rules

Codex may continue without asking for clarification when:

- the work is already specified in `PLANS.md`
- the work does not require changes to `DATA_CONTRACTS.md`
- the work does not require changes to `AGENTS.md`
- the work does not require changes to `SECURITY_RULES.md`
- the work does not require changes to publishing rules
- the task does not require unresolved runtime verification before it can be marked complete

Codex must stop and ask only when:

- a request would change a governed contract, agent rule, security rule, or publishing rule
- the request would change completion criteria or task scope
- the task depends on unavailable live verification or external state

## Blocked Task Handling

When a task is blocked, Codex must:

- update the task state in `PLANS.md`
- record the blocker explicitly
- record the explicit unblock step
- continue only with tasks that remain independently allowed

## Current Blocked Item

- Task 002 is blocked until live Docker/Postgres boot verification is possible on a machine with the required runtime.

## Non-Goals

- This file does not change the authority model
- This file does not change content strategy
- This file does not grant permission to publish content automatically
