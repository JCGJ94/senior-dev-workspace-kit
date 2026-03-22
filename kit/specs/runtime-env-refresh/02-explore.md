# Explore

## Current State
- `allowed_ops.json` contained placeholders: all `[OP_*]` were `echo 'No ... configured'`
- `env_state.json` reported `project_type: "generic"` and incorrect stacks
- `provision.sh` generates both files dynamically but was never executed on this repo (no `package.json`)
- The real repo is an agent infrastructure toolkit, not an app. Stack: shell scripts, Python scripts, markdown, JSON, CI/CD.

## Relevant Files
- `.agent/state/allowed_ops.json`
- `.agent/state/env_state.json`
- `scripts/provision.sh` (lines 157-168 generate `env_state.json`)
- `config/project-types.json`

## Architecture Notes
- Workflows resolve `[OP_*]` tokens at runtime by querying `allowed_ops.json`
- If a token does not have a real command, the workflow fails silently
- The model is: provision.sh detects stack → generates allowed_ops + env_state

## Unknowns
- Does `project-types.json` have an `agent-kit` type? (verified: it didn't exist, had to be added)
- Would existing validation scripts serve as `OP_TEST`/`OP_LINT`? (yes: `validate-kit.sh`, `validate-skills.py`)
