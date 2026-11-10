# Engineering Overview — Itay Coach Site

A TypeScript web application with an extensive set of design, implementation and operational documents. This overview is a **navigation guide to code and verifiable engineering controls**, not a claim that every documented feature is deployed.

## Start with the code

- [`package.json`](package.json): available commands and dependencies.
- [`.github/workflows/ci.yml`](.github/workflows/ci.yml): pull-request and main-branch validation.
- [`ARCHITECTURE.md`](ARCHITECTURE.md): intended architecture; compare it against actual implementation.
- [`EVALS.md`](EVALS.md): evaluation design/documentation, not automatically proof of an executed benchmark.
- [`AGENTS.md`](AGENTS.md): repository-level instructions for coding agents.

## Engineering controls

The checked-in CI workflow runs:

```text
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

It uses Node.js 20.19.0 and triggers on pull requests and pushes to `main` and `codex/push-code-to-github`.

## How to verify

1. Clone the repository.
2. Run `npm ci`.
3. Run `npm run typecheck && npm run lint && npm test && npm run build`.
4. Check the [GitHub Actions page](../../actions) for actual run outcomes before making claims about a passing pipeline.

**Verification status:** commands were read from the workflow, but they were **not executed** as part of this README update. Documentation, architecture proposals and test plans must be distinguished from shipped behavior.

## What this project demonstrates

- Maintaining a TypeScript application alongside explicit engineering guidance.
- Defining automated quality checks for changes.
- Documenting intended architecture, agent instructions and evaluation considerations.

## Next improvements

- Link to 2–3 specific implemented modules and explain their inputs, outputs and tests.
- Add a reproducible local demo and screenshots with non-sensitive sample data.
- Reduce top-level document clutter by grouping design drafts in `docs/`.
- Publish a verified CI status and an explicit list of production vs experimental capabilities.

## Contribution transparency

This portfolio overview does not imply every commit or generated artifact was handwritten. The Git history and individual PRs are the source of evidence for contributions.
