# Pedrito Release Notes

## V5 — Orchestrator Protocol

- Orchestrator operates as coordinator only — Hard Stop Rule enforced across core rules
- Shared contracts: `return-envelope.md` and `engram-protocol.md` for sub-agent dispatch
- `allowed_ops.json` runtime state with `[OP_*]` token resolution (fail-closed)
- Task classification gate: direct, small, orchestrated, parallel
- Engram context loop integrated into dispatch lifecycle
- Skill pre-resolution cached per session
- 4 persona modes: pedrito-cubano (default), pedrito-colombiano, pedrito-neutral-latam, neutral-mode
- Validation scripts aligned with monorepo layout

## V4 — Production Monorepo

- Monorepo with three binaries: `pedrito` (installer CLI), `pedrito-engram` (memory server), `gga` (pre-commit reviewer)
- Engram: SQLite + FTS5 + REST API + MCP tooling
- GGA: staged-file inspection, provider abstraction (claude, gemini, opencode, ollama, lmstudio, github), SHA-based cache
- Installer: install, doctor, backup, mcp, profile, update, sync
- Team profiles: export/import/save/show/delete
- Self-update modules and skills sync framework
- Runtime personas as first-class assets with install-time selection (`--persona`)
- 60 skills, 48 registered in manifest, tiered activation (0-4 + Meta)
- Cross-platform release builds with codesigning and smoke validation

## Distribution

- Release build scripts generate cross-platform binaries and checksums
- macOS artifacts are ad-hoc codesigned in build pipeline
- Homebrew tap formula with automated SHA updates

## Verification

- `bun run typecheck` / `bun test` / `bash kit/scripts/validate-kit.sh`
- `bash scripts/build-release.sh <platform>` / `bash scripts/smoke-release.sh <platform>`
