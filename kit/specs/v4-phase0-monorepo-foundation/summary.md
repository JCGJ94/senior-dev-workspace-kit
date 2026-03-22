# Summary — V4 Phase 0: Monorepo Foundation

**Status:** Complete
**Started:** 2026-03-21
**Completed:** 2026-03-21

## What Was Done
Converting Pedrito V3 pure-markdown kit into a Bun workspace monorepo.
Kit content moved to `kit/`. Three TypeScript package stubs created.
Agent interface defined. CI updated for new paths.

## Key Decisions
- TypeScript + Bun (not Go/Python) per roadmap rationale
- Monorepo in-place (repo root becomes workspace root)
- Kit content moved to `kit/` subdirectory, history preserved via `git mv`
- Root `setup.sh` becomes thin forwarder to `kit/setup.sh`
