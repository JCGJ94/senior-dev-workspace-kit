# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-03-09

### Added
- Initial repository structure for the AI Engineering Workspace Kit.
- `ai_rules` system (`core`, `agent`, `architecture`, `project`, `safety`, `memory`, `token_optimization`, `context_loading`, `workflow`, `debugging`).
- `skills` directory (`frontend`, `backend`, `fullstack`, `debugging`, `ai_agent`).
- `workflows` directory (`feature`, `refactor`, `bugfix`, `release`).
- `scripts` directory including `bootstrap-workspace.sh`, `install-rules.sh`, `install-skills.sh`, `install-workflows.sh`, and `sync-workspace.sh`.
- Base `config` files (`workspace.manifest.json`, `project-types.json`).
- Minimal professional GitHub repository files (`README.md`, `.gitignore`, `LICENSE`).
- Release methodology defined in `docs/release-process.md`.

## [3.0.0] - 2026-03-16

### Changed
- Standardized the V3 contract around `AGENTS.md`, `core/` source assets, and `.agent/` runtime installation.
- Replaced the legacy sync path with `scripts/sync-workspace.sh` and kept `scripts/sync-workspace-v2.sh` as a compatibility wrapper.
- Updated onboarding and architecture docs to describe the actual V3 runtime model.
- Formalized developer approval gates for architectural, external skill, dependency, security, and deploy-sensitive actions.
- Added trusted JIT skill discovery guidance for `skills.sh`, `agents.md`, and `github.com/obra/superpowers`.

### Added
- Added `humanized-communication` as a V3 skill for calm, friendly, developer-facing communication.

### Deprecated
- Deprecated legacy references to `.devkit`, `skills_registry`, and obsolete install/sync scripts in the main operational path.
