# Explore

## Current State
- Multiple workflows try to read/update `.agent/state/current_spec.md`, which doesn't exist and breaks SDD which stores context in `specs/<change-id>/`.
- Stage names vary: "Planification", "Contextualization", "Review" vs "Plan", "Prepare", "Verify".
- `feature_workflow.md` and `bugfix_workflow.md` use `code-review-pro` to "validate clean commits", but that skill was repaired to be an actual code quality auditor. `commit-sentinel` is the correct skill for commits.
- Workflows lack a strict verification gate before marking an item as done.
- `deploy_workflow.md` uses `<!-- step -->` tags not present in other workflows and has disparate stages.

## Relevant Files
- `.agent/workflows/feature_workflow.md`
- `.agent/workflows/bugfix_workflow.md`
- `.agent/workflows/refactor_workflow.md`
- `.agent/workflows/release_workflow.md`
- `.agent/workflows/deploy_workflow.md`
- `docs/engram/decisions/` (need an engram decision to enforce unified stage names)
- `specs/repair-skills-semantics/04-spec.md` (provides rationale for swapping code-review-pro)

## Architecture Notes
- Workflows are the highest level of instruction. If they reference broken state (`current_spec.md`), the `architect-orchestrator-v3` will fail.
- True SDD uses `specs/<change-id>/summary.md` as active state, not a single monolithic file.

## Unknowns
- Are there other workflows in the `workflows/` dir? Yes, but focus is on the 5 core lifecycle workflows.
- Does deleting the `current_spec.md` references break anything else? No, `current_spec.md` doesn't exist anywhere in the provisioning or state logic.
