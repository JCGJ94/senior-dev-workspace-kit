# Pedrito V4 Release Notes

## Highlights

- Introduced a production-grade monorepo with three binaries:
  - `pedrito` (installer and operations CLI)
  - `pedrito-engram` (memory server)
  - `gga` (Guardian Angel pre-commit reviewer)
- Delivered Engram with SQLite persistence, REST API, MCP tooling, and OpenCode integration hooks.
- Delivered GGA with staged-file inspection, rules extraction, provider abstraction, response parsing, and SHA-based cache.
- Delivered installer capabilities for runtime provisioning, backups, MCP status/catalog, team profiles, self-update modules, and config sync.

## Core Features Added

- **Engram memory platform**
  - Sessions and observations API
  - FTS search/context retrieval
  - MCP handlers for list/call tools (save/search/context/delete)
- **GGA review engine**
  - `gga run`, `install`, `uninstall`, `config`, `cache`, `status`
  - Provider adapters (`claude`, `gemini`, `opencode`, `ollama`, `lmstudio`, `github`)
- **Installer operations**
  - `pedrito install`, `doctor`, `backup`, `mcp`, `profile`, `update`, `sync`
  - Team profile export/import/save/show/delete
  - Self-update modules and skills sync framework
- **Polish core (Phase 9)**
  - Runtime personas as first-class assets (`.agent/personas`)
  - Persona selection at install time (`--persona`)
  - Modern skill set and discrete SDD skill coverage synced to runtime

## Distribution

- Release build scripts generate cross-platform binaries and checksums.
- macOS release artifacts are ad-hoc codesigned in build pipeline.
- Local release smoke validation script is included (`scripts/smoke-release.sh`).

## Documentation

- English and Spanish README files are aligned with current CLI behavior.
- Release readiness checklist is available in `RELEASE_READINESS_V4.md`.

## Verification Snapshot

Validated locally before release:

- `bun run typecheck`
- `bun test`
- `bun run packages/installer/src/cli.ts --help`
- `bash scripts/build-release.sh macos-arm64`
- `bash scripts/smoke-release.sh macos-arm64`
- `ruby -c Formula/pedrito.rb`

## Known External Post-release Checks

- `pedrito update --all --dry-run` against live GitHub Releases API
- `scripts/install.sh` against published release assets
- Homebrew tap SHA256 updates from published artifacts
