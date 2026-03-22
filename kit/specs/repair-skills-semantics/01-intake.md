# Intake

## Goal
Repair the broken semantic mapping between `code-review-pro` and `commit-sentinel`. Both skills had swapped content: `code-review-pro` contained commit hygiene logic (clone of commit-sentinel) and `commit-sentinel` lacked formal structure.

## Stakeholders
- Developer (JC) — approval and final verification
- Pedrito (agent) — analysis, execution, and automated verification
- Any future kit fork — inherits the fix

## Constraints
- Do not change the skill architecture or the registry model
- Do not rename skills (only fix their content)
- Maintain source → runtime sync

## Risks
- Workflows referencing `code-review-pro` as a closing step may no longer make sense if the content changes
- Potential overlap with `verification-before-completion`

## Initial Definition of Done
- `code-review-pro` contains real code quality audit (code review)
- `commit-sentinel` contains commit validation (atomicity, conventional, typing)
- Zero overlap in triggers between both skills
- Source and runtime registries aligned
- Runtime `.agent/skills/` is an exact copy of `skills/`
