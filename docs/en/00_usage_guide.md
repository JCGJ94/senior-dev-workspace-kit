# AI Engineering Workspace Kit — Usage Guide

## Installation

Clone the kit and initialize a target project from its root:

```bash
git clone <repo> ai-engineering-workspace-kit
cd /path/to/target-project
bash /path/to/ai-engineering-workspace-kit/scripts/agent init
```

This provisions `.agent/`, `docs/engram/`, and `specs/` into the target repository and runs in non-interactive mode by default.

## Available Scripts

| Script | Purpose |
|---|---|
| `scripts/agent` | Unified V3 entrypoint (`init`, `sync`, `status`) |
| `scripts/provision.sh` | Installs the runtime into a target project |
| `scripts/sync-workspace.sh` | Refreshes an existing runtime from the source kit |
| `scripts/generate-registry.sh` | Regenerates `.agent/registry/skills.json` |
| `scripts/skill-manager.sh` | Installs trusted upstream skills into the runtime |
| `scripts/validate-kit.sh` | Validates the source kit structure |
| `scripts/validate-skills.sh` | Validates skill structure and frontmatter |
| `scripts/validate-skills.py` | Full skill metadata compliance check |

## Sync an Existing Runtime

```bash
bash /path/to/ai-engineering-workspace-kit/scripts/agent sync
```

Refreshes the runtime from the source kit while keeping the V3 model and Engram intact.

## Operational Rules

- `AGENTS.md` is the runtime contract — the agent reads it on every session.
- `.agent/core/` contains the installed rule set that governs behavior.
- `docs/engram/` stores durable cross-session memory (decisions, patterns, lessons).
- `specs/` stores non-trivial work artifacts (9-phase SDD lifecycle).
- The agent keeps context lean and activates the minimum necessary skill set.
- Resolve `[OP_*]` tokens via `.agent/state/allowed_ops.json`.

## Approval Model

**Autonomous:** analysis, planning, summaries, low-risk reversible changes.

**Requires developer approval:** architecture changes, external skill adoption, dependency changes, destructive file operations, and any security, deploy, or data-sensitive action.

## JIT Skills

When a skill is missing from the runtime, the trusted lookup order is:

1. Local kit or installed runtime skills
2. `https://skills.sh/`
3. `https://agents.md/`
4. `https://github.com/obra/superpowers`

External skills require explicit approval and V3 adaptation (frontmatter + registry entry) before activation.

## Non-Trivial Work

Any change that touches more than 3 files, modifies behavior, involves security or deploy, or takes more than 30 minutes **must** follow the SDD lifecycle via `specs/<change-id>/`. See `.agent/core/03_development_super_rule.md`.
