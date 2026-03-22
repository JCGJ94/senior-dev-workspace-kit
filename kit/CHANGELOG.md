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

## [3.0.1] - 2026-03-21

### Fixed
- `systematic-debugging/SKILL.md`: added missing YAML frontmatter — was the only skill of 32 without it.
- `docs/en/05_v3_skill_adaptation_backlog.md`: corrected stale status; all 32 registered skills are now V3-adapted.
- Documentation audit: removed redundant `01_getting_started.md` (en/es), rewrote `00_guia_de_uso.md` in Spanish to V3 standard, translated `04_subagent_architecture_v3.md` to Spanish.

### Added
- `docs/es/04_subagent_arquitectura_v3.md`: Spanish translation of the V3 orchestration architecture.

## [3.0.0-patch] - 2026-03-20

### Fixed
- Runtime drift: 8 skills declared in `registry/skill_manifest.json` were missing from `.agent/skills/` (`backend`, `commit-sentinel`, `debugging`, `docs-pro`, `frontend`, `fullstack`, `python-ecosystem`, `typescript-ecosystem`). All 32 skills are now installed and aligned.
- `.agent/` is now version-controlled (core, registry, skills, workflows) with `.agent/.gitignore` excluding dynamic state files to prevent future drift.

## [3.0.0-identity] - 2026-03-19

### Added
- Pedrito identity formally documented in `docs/engram/decisions/001-pedrito-identity.md`.
- Unified 5-phase workflow vocabulary across all workflows (Plan → Prepare → Execute → Verify → Close).
- `docs/engram/decisions/003-unified-stage-vocabulary.md`: records the workflow standardization decision.
- `docs/engram/lessons/001-registry-drift-silent-failures.md`: operational lesson from the skill drift incident.

## [3.0.0] - 2026-03-16

### Changed
- Standardized the V3 contract around `AGENTS.md`, `core/` source assets, and `.agent/` runtime installation.
- Replaced the legacy sync path with `scripts/sync-workspace.sh` as the only supported sync entrypoint.
- Updated onboarding and architecture docs to describe the actual V3 runtime model.
- Formalized developer approval gates for architectural, external skill, dependency, security, and deploy-sensitive actions.
- Added trusted JIT skill discovery guidance for `skills.sh`, `agents.md`, and `github.com/obra/superpowers`.

### Added
- Added `humanized-communication` as a V3 skill for calm, friendly, developer-facing communication.

### Deprecated
- Deprecated legacy references to `.devkit`, `skills_registry`, and obsolete install/sync scripts in the main operational path.
