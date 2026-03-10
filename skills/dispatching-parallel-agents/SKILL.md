# Executing Plans

## Purpose
Execute an approved implementation plan step-by-step while preserving task boundaries, minimizing context usage, and ensuring verification before completion.

## Use when
- A clear plan has been generated (for example by Writing Plans).
- A complex task requires structured execution.
- Work must be performed in sequential or staged steps.
- Implementation must follow predefined milestones.

## Do not use when
- No plan exists.
- The plan is incomplete or ambiguous.
- The task is trivial and does not require structured execution.
- Requirements have changed and the plan is outdated.

## Execution Workflow

1. **Load the Plan**
   - Read the full plan before starting execution.
   - Identify steps, dependencies, and expected outcomes.
   - Do not begin execution without understanding the full sequence.

2. **Execute One Step at a Time**
   - Follow the plan strictly.
   - Complete the current step before moving to the next.
   - Avoid jumping ahead or combining steps.

3. **Respect Step Boundaries**
   Each step should remain focused on its defined objective.

   Do not:
   - introduce unrelated improvements
   - refactor outside the step scope
   - add speculative changes.

4. **Minimize Context Usage**
   For each step load only:

   - files required for the step
   - relevant interfaces
   - configuration involved

   Avoid loading the full repository.

5. **Handle Dependencies**
   If a step depends on previous results:

   - confirm the previous step succeeded
   - verify outputs before continuing.

6. **Detect Plan Deviations**
   If execution reveals a mismatch between the plan and reality:

   - stop execution
   - report the issue
   - request plan revision.

7. **Verify Each Step**
   After completing a step:

   - run relevant tests or checks
   - confirm the expected result.

8. **Perform Final Verification**
   After the last step:

   - run repository verification commands
   - ensure no regressions were introduced.

## Rules
- Never skip plan steps.
- Do not modify the plan during execution.
- Follow the plan sequence strictly.
- Avoid scope creep.
- Verify each step before continuing.
- Stop if the plan becomes invalid.
- Respect repository conventions and tooling.

## Context Efficiency
When executing steps:

Prefer loading:
- specific files
- small code sections
- interfaces

Avoid loading:
- full repository
- unrelated modules
- large documentation files.

## Validation
Before confirming completion:

- All plan steps were executed.
- No step was skipped.
- Verification commands succeeded.
- The result matches the expected plan outcome.

## Output

Return execution report:

### Plan Summary
Short description of the plan executed.

### Steps Completed
List of executed steps.

### Verification
Commands executed and results.

### Deviations
Any differences between plan and execution.

### Final Status
Completed / Blocked / Requires Plan Update