# Repo State Audit — 2026-03-22

## Scope

This audit captures the current working tree state of the repository as of 2026-03-22.
It is file-by-file for every modified or untracked file currently visible in `git status`.

## Validation Summary

- `bun test` -> passed (`52/52`)
- `bun run typecheck` -> passed
- `bash kit/scripts/validate-kit.sh` -> passed after aligning the validator with the monorepo layout and shared skill contracts

## Current Risk Snapshot

- The V5 orchestrator foundation is partially implemented across runtime, core rules, shared contracts, personas, and CLI help.
- Runtime mirrors under `.agent/` were updated for the new orchestration model, but they are still generated artifacts and should stay aligned with source-kit changes.
- Several documentation and roadmap files were already modified outside the strict V5 phase implementation scope; they are included here as current repo state, not as fully re-reviewed contract changes.

## File-By-File State

| Path | Git State | Area | Audit State | Notes |
|---|---|---|---|---|
| `.agent/.gitignore` | Modified | Runtime | Reviewed | Unignores `state/allowed_ops.json` so the runtime OP map is versioned. |
| `.agent/core/01_core_rules.md` | Modified | Runtime core | Reviewed | Mirrors V5 coordinator identity and skill pre-resolution language. |
| `.agent/core/03_development_super_rule.md` | Modified | Runtime core | Reviewed | Mirrors mandatory orchestrated dispatch rule. |
| `.agent/core/06_memory_rules.md` | Modified | Runtime core | Reviewed | Mirrors Engram server integration lifecycle. |
| `.agent/core/08_activation_policy.md` | Modified | Runtime core | Reviewed | Mirrors `allowed_ops.json` source-of-truth and post-install verification. |
| `.agent/core/10_orchestrator_protocol.md` | Untracked | Runtime core | Reviewed | New V5 orchestrator protocol mirror. |
| `.agent/skills/_shared/engram-protocol.md` | Untracked | Runtime shared contract | Reviewed | New shared Engram persistence protocol. |
| `.agent/skills/_shared/return-envelope.md` | Untracked | Runtime shared contract | Reviewed | New shared return envelope contract. |
| `.agent/skills/architect-orchestrator-v3/SKILL.md` | Modified | Runtime skill | Reviewed | Mirrors imperative dispatch workflow, verification, and return-envelope model. |
| `.agent/state/allowed_ops.json` | Untracked | Runtime state | Reviewed | New V5 phase 1 OP token map. |
| `PEDRITO_V4_ROADMAP.md` | Modified | Planning | Observed | Pre-existing working tree change; not edited in this implementation pass. |
| `PEDRITO_V5_ORCHESTRATOR_PLAN.md` | Untracked | Planning | Observed | Source plan used for this V5 implementation sequence. |
| `README.md` | Modified | Product docs | Observed | Pre-existing working tree change; not part of the validator fix or V5 core patch set. |
| `RELEASE_READINESS_V4.md` | Modified | Release docs | Observed | Pre-existing working tree change; not edited in this pass. |
| `kit/AGENTS.md` | Modified | Runtime contract source | Reviewed | Added the Orchestration Protocol section and V5 dispatch contract references. |
| `kit/README.es.md` | Modified | Product docs | Observed | Pre-existing working tree change; not edited in this pass. |
| `kit/assets/hero.svg` | Modified | Asset | Observed | Pre-existing working tree change; not inspected in depth. |
| `kit/config/personas/README.md` | Modified | Persona docs | Reviewed | Updated to 4 explicit persona options plus compatibility wrapper. |
| `kit/config/personas/neutral-mode.md` | Modified | Persona | Observed | Pre-existing working tree change; not materially altered in this pass. |
| `kit/config/personas/pedrito-colombiano.md` | Untracked | Persona | Reviewed | New V5 persona mode. |
| `kit/config/personas/pedrito-cubano.md` | Untracked | Persona | Reviewed | New V5 default persona mode. |
| `kit/config/personas/pedrito-mode.md` | Modified | Persona | Reviewed | Converted to compatibility wrapper resolving to `pedrito-cubano` by default. |
| `kit/config/personas/pedrito-neutral-latam.md` | Untracked | Persona | Observed | Present in working tree but not created in this pass; verify whether it should be tracked now. |
| `kit/core/01_core_rules.md` | Modified | Source core | Reviewed | Establishes Pedrito as coordinator, not executor, with protocol reference. |
| `kit/core/03_development_super_rule.md` | Modified | Source core | Reviewed | Replaces generic modularity wording with mandatory orchestrated dispatch. |
| `kit/core/06_memory_rules.md` | Modified | Source core | Reviewed | Adds Engram lifecycle for dispatch and recovery. |
| `kit/core/08_activation_policy.md` | Modified | Source core | Reviewed | Resolves `[OP_*]` through `allowed_ops.json` and adds post-install trigger re-check. |
| `kit/core/10_orchestrator_protocol.md` | Untracked | Source core | Reviewed | New V5 orchestration protocol contract. |
| `kit/docs/en/00_agent_modes.md` | Modified | Docs | Observed | Pre-existing working tree change; not edited in this pass. |
| `kit/docs/en/01_why_pedrito.md` | Modified | Docs | Observed | Pre-existing working tree change; not edited in this pass. |
| `kit/docs/engram/decisions/001-pedrito-identity.md` | Modified | Engram decision | Reviewed | Updated identity decision to reflect 4 communication modes and wrapper compatibility. |
| `kit/docs/es/00_agent_modes.md` | Modified | Docs | Observed | Pre-existing working tree change; not edited in this pass. |
| `kit/scripts/validate-kit.sh` | Modified | Validation | Reviewed | Fixed to support monorepo `kit/` layout and pass repo-level validation. |
| `kit/scripts/validate-skills.py` | Modified | Validation | Reviewed | Exempts `_shared` directories from executable skill validation. |
| `kit/skills/_shared/engram-protocol.md` | Untracked | Shared contract | Reviewed | New source shared Engram contract. |
| `kit/skills/_shared/return-envelope.md` | Untracked | Shared contract | Reviewed | New source shared return-envelope contract. |
| `kit/skills/architect-orchestrator-v3/SKILL.md` | Modified | Source skill | Reviewed | Rewritten toward imperative dispatch, verification, and integration gates. |
| `packages/installer/src/cli.ts` | Modified | Installer | Reviewed | Help output updated to list the 4 persona modes expected by V5. |

## Notes Requiring Follow-Up

- `kit/config/personas/pedrito-neutral-latam.md` is currently untracked even though the repo already references that persona. Decide whether to add it explicitly or ignore/remove it.
- The working tree contains multiple pre-existing documentation changes outside the strict V5 implementation set. They should be reviewed separately before release.
- `.agent/` contains more runtime skill directories than the registry tracks. Validation now confirms all registered skills exist, but extra runtime content should remain an intentional policy decision.
