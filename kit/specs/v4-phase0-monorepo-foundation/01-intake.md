# Phase 0 Intake — V4 Monorepo Foundation

## Objective
Convert the Pedrito V3 pure-markdown kit into a Bun workspace monorepo that hosts three new TypeScript packages (engram, gga, installer) alongside the existing governance kit.

## Motivation
Pedrito V4 requires real tooling: a memory server (Engram), a pre-commit AI reviewer (GGA), and a TUI installer. These cannot be built in Markdown. The kit must evolve into a proper engineering product while preserving everything that makes V3 strong.

## Scope
- Move all existing kit content (`core/`, `skills/`, `workflows/`, `specs/`, `docs/`, `registry/`, `scripts/`, `AGENTS.md`, etc.) into a `kit/` subdirectory
- Initialize Bun workspaces at repo root with `package.json` + `tsconfig.base.json`
- Create placeholder packages: `packages/engram/`, `packages/gga/`, `packages/installer/`
- Define the `Agent` interface in TypeScript (core abstraction for Fase 3 installer)
- Update CI workflows to reflect the new `kit/` paths
- Add `build.yml` CI workflow for Bun test + typecheck

## Out of Scope (Fase 0)
- Actual implementation of Engram server (Fase 1)
- Actual implementation of GGA hook (Fase 2)
- Actual TUI installer (Fase 3)

## Success Criteria
See `08-verification.md`

## Status
In Progress — started 2026-03-21
