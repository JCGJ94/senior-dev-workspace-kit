# Intake

## Goal
Convert the 5 primary workflows (`feature`, `bugfix`, `refactor`, `release`, `deploy`) into fully executable pipelines. Currently, they contain non-existent dependencies, refer to incorrect skills, and have inconsistent stage vocabularies.

## Stakeholders
- Developer (JC) — execution, code quality
- Pedrito — automated execution of workflows via routing
- V3 Sub-agents — rely on exact skill references

## Constraints
- Do not add or remove pipelines. Keep the 5 core workflows.
- Workflow format must remain standard `.md` with yaml metadata and steps.
- Maintain existing workflow objectives.

## Risks
- Resolving one phantom dependency (e.g. `current_spec.md`) might require creating it. Decision needed on whether to create the dependency or remove the reference.
- `deploy_workflow.md` format differs heavily from the rest, making harmonization difficult.

## Initial Definition of Done
- No references to `.agent/state/current_spec.md` (phantom file).
- Stage names unified across all workflows (Plan, Prepare, Execute, Verify, Close).
- Incorrect usage of `code-review-pro` as a commit checker removed.
- Universal `verification-before-completion` gate added to all workflows.
- `deploy_workflow.md` format normalized.
