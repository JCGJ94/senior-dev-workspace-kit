# Architecture overview

## V3 contract

- `AGENTS.md` is the runtime contract.
- `core/`, `registry/`, `skills/`, and `workflows/` are source-kit assets.
- `.agent/` is the installed runtime inside the developer project.

## Source kit versus runtime

The source kit lives in this repository so it can be versioned, validated, and forked on GitHub.

The runtime is what gets installed into a target project:

- `.agent/core/`
- `.agent/registry/`
- `.agent/skills/`
- `.agent/workflows/`
- `.agent/state/`

## Supporting layers

- `docs/engram/` - durable memory
- `specs/` - auditable artifacts for non-trivial work
- `scripts/` - install, sync, validation, and runtime utilities

## Design goals

- low integration complexity for GitHub forks
- governed autonomy with approval gates
- low-token context discipline
- reusable workflows and skills
- a human, calm developer-facing tone
