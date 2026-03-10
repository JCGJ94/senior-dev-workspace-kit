# Verification Before Completion

## Purpose
Ensure that all implemented changes are verified with real evidence before declaring a task complete, preventing false success reports and undetected regressions.

## Use when
- Finishing any implementation task.
- Completing bug fixes or feature development.
- Finalizing code changes before committing or merging.
- Reporting task completion to the user or system.

## Do not use when
- No changes were made.
- The task is purely informational.
- Verification is impossible due to missing infrastructure.
- The task explicitly requires exploratory work without verification.

## Verification Workflow

1. **Confirm Implementation Scope**
   Review what was changed:

   - modified files
   - affected modules
   - configuration updates
   - dependency changes.

2. **Run Repository Verification Commands**
   Execute the repository’s real verification steps.

   Examples may include:

   - automated tests
   - lint checks
   - type checks
   - build validation
   - formatting checks.

   Use the project’s actual tooling rather than assumptions.

3. **Validate Expected Behavior**
   Confirm that the implemented behavior matches the task objective.

   Check:

   - feature works as intended
   - bug is resolved
   - no regressions appear.

4. **Inspect Related System Areas**
   Verify that the change does not break:

   - related modules
   - integration points
   - configuration logic
   - public interfaces.

5. **Confirm No Silent Failures**
   Ensure there are no hidden issues:

   - failing tests ignored
   - warnings masking errors
   - skipped verification steps.

6. **Check Repository State**
   Confirm the repository is in a stable state:

   - no uncommitted accidental changes
   - dependency updates are intentional
   - configuration files remain valid.

7. **Document Evidence**
   Provide evidence of successful verification:

   - test results
   - commands executed
   - observed outputs.

## Rules
- Never declare completion without verification evidence.
- Always run repository-native verification commands.
- Do not assume success without executing checks.
- Verify both the intended change and related system areas.
- Do not ignore failing tests or warnings.
- Avoid skipping verification steps for convenience.
- Prefer automated verification when available.

## Context Efficiency
When verifying:

Prefer examining:
- changed files
- affected modules
- verification command results

Avoid loading:
- entire repository
- unrelated components
- large generated outputs.

## Validation
Before confirming task completion:

- All relevant verification commands were executed.
- Expected behavior matches the implementation goal.
- No regressions were introduced.
- The repository remains in a stable state.

## Output

Return verification summary:

### Changes Verified
Files or modules affected.

### Commands Executed
Verification commands used.

### Results
Outcome of tests and checks.

### Regressions
Any detected issues.

### Final Status
Verified / Requires Fixes