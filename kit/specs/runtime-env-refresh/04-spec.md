# Spec

## Functional Requirements
- `OP_INSTALL`: `echo 'No runtime deps — agent kit is config-only'`
- `OP_TEST`: `bash scripts/validate-kit.sh`
- `OP_TYPECHECK`: `python scripts/validate-skills.py`
- `OP_LINT`: `bash scripts/validate-skills.sh`
- `OP_BUILD`: `bash scripts/provision.sh --non-interactive`
- `OP_DEPLOY`: `echo 'Kit deploy: push to main + CI validates'`
- `env_state.json` must report `project_type: "agent-kit"`, `detected_stacks: ["shell", "python", "markdown"]`

## Non-Functional Requirements
- Valid JSON in both state files
- Backward-compatible: existing types (node, python, hybrid, generic) do not break

## Acceptance Criteria
- [x] `allowed_ops.json` is valid JSON with 6 operations mapped to real commands
- [x] `env_state.json` has `project_type: "agent-kit"`
- [x] `provision.sh` detects `agent-kit` type when finding `AGENTS.md` + `core/` + `skills/`
- [x] Workflows resolve `[OP_*]` tokens without errors

## Edge Cases
- Repo having `AGENTS.md` but NOT `core/` or `skills/` → not detected as `agent-kit`, falls back to standard detection
