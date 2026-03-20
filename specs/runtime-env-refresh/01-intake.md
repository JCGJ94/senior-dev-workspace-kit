# Intake

## Goal
Make the V3 runtime actually execute: `allowed_ops.json` should contain real commands mapped to the detected repo stack, and `env_state.json` should reflect reality.

## Stakeholders
- Developer (JC) — approval
- Pedrito — execution and verification
- V3 Workflows — consume `[OP_*]` tokens from `allowed_ops.json`

## Constraints
- Do not reimplement `provision.sh` completely — only add `agent-kit` type detection
- Maintain backward-compat with existing types (node, python, hybrid, generic)
- Do not change state files structure

## Risks
- CI smoke test expects specific structure (uses `touch package.json` → keeps working with node detection)
- Workflows with `[OP_*]` tokens that do not exist in the new mapping

## Initial Definition of Done
- `allowed_ops.json` contains real commands for `OP_INSTALL`, `OP_TEST`, `OP_TYPECHECK`, `OP_LINT`, `OP_BUILD`, `OP_DEPLOY`
- `env_state.json` has `project_type: "agent-kit"` and `detected_stacks: ["shell", "python", "markdown"]`
- Refresh procedure is documented
