# Pedrito V4 Release Readiness

Last updated: 2026-03-22

## Scope

This checklist is the final pre-release pass for Pedrito V4:

- Product behavior aligned with roadmap phases 0-9
- Documentation aligned with actual CLI/runtime behavior
- Build, test, and release pipeline sanity checks

## Product Readiness

- [x] `engram` memory server with REST + MCP endpoints
- [x] `gga` pre-commit guardian with cache/provider architecture
- [x] `pedrito` installer CLI with install/doctor/backup/mcp/profile/update/sync
- [x] Team profiles (export/import/save/show/delete)
- [x] Self-update modules (release lookup, download, replace, skills sync, sync layer)
- [x] Core polish: modern skills synced and personas as first-class runtime feature (`.agent/personas/`)

## Documentation Readiness

- [x] Root README command examples aligned with current CLI
- [x] Spanish README command examples aligned with current CLI
- [x] Phase 9 summary marked as complete and mapped to real files
- [x] GitHub Release notes sourced from `RELEASE_NOTES_V4.md` via workflow (`body_path`)

## Verification Commands

Run from repository root:

```bash
bun run typecheck
bun test
bun run packages/installer/src/cli.ts --help
bash -n scripts/build-release.sh
bash -n scripts/install.sh
bash -n scripts/smoke-release.sh
ruby -c Formula/pedrito.rb
(cd kit && bash scripts/validate-kit.sh)
```

Platform-specific release smoke (example macOS ARM64):

```bash
bash scripts/build-release.sh macos-arm64
bash scripts/smoke-release.sh macos-arm64
```

## Known External Dependencies (Post-merge / Post-tag)

These checks require network or GitHub release infrastructure and cannot be fully verified offline:

- `pedrito update --all --dry-run` against GitHub Releases API
- `scripts/install.sh` against real release assets on GitHub
- Homebrew tap update with real SHA256 values from the published release artifacts

## Release Owner Steps

1. Tag release: `git tag vX.Y.Z && git push --tags`
2. Confirm GitHub Actions `release.yml` produced all artifacts and checksums
3. Validate install script on clean macOS/Linux environments
4. Update Homebrew tap formula SHA256 values from release artifacts
5. Run a final smoke install:
   - `pedrito version`
   - `pedrito install --agents claude-code --preset full-pedrito`
   - `pedrito doctor`
