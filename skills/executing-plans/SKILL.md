---
name: "executing-plans"
description: "Follow a previously established implementation plan with strict adherence, avoiding scope creep and context drift."
tier: 1
triggers: ["execute plan", "follow plan", "implement plan", "execute", "execute approved plan"]
context_cost: 200
---
# Executing Plans

## Purpose
Follow a previously established implementation plan with strict adherence, avoiding context drift, scope creep, and distractions.

## Use when
- Operating under an approved, check-boxed execution plan.

## Do not use when
- The plan is incomplete, ambiguous, or lacks explicit file paths and test criteria.

## Execution Workflow
1. **Load & Review**: Critically review the plan file. Raise any architectural concerns or blockers before starting.
2. **Execute Tasks**:
   - Process one bite-sized step at a time.
   - Run the specified verification commands exactly as requested.
   - Mark tasks as completed (checked) as progress is verified.
3. **Blocker Management**:
   - If a step fails significantly, **STOP**.
   - Do not force a hack or ignore the failure. Present the blocker to the human partner to decide whether to pivot the plan.
4. **Completion**: Once all steps are checked, announce completion and invoke the branch finalization protocol if applicable.

## Validation
- Ensure no steps are skipped.
- Ensure all verifications match the expected state defined in the plan before moving forward.
