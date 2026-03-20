# Debugging Skill

## Purpose
Systematically diagnose and resolve errors, failures, and unexpected behavior while preserving system stability and minimizing unnecessary changes.

## Use when
- A test is failing.
- An error message or stack trace appears.
- The system behaves differently than expected.
- A bug report or runtime issue needs investigation.

## Do not use when
- The task is implementing a new feature.
- The issue is already clearly identified and trivial to fix.
- The failure is caused by missing context or incomplete requirements.
- The system behavior is intentional.

## Debugging Workflow

1. **Reproduce the Problem**
   - Confirm the issue actually occurs.
   - Identify the command, input, or action that triggers it.
   - Capture the exact error message, stack trace, or failing behavior.

2. **Define Expected Behavior**
   - Determine what the system should do instead.
   - Compare expected output vs actual output.
   - Identify the discrepancy clearly.

3. **Isolate the Fault Area**
   Narrow the scope of investigation:

   - affected module
   - function involved
   - input data
   - configuration
   - dependency behavior

   Avoid exploring unrelated parts of the codebase.

4. **Identify the Root Cause**
   Investigate:

   - incorrect assumptions
   - missing edge cases
   - invalid input handling
   - state inconsistencies
   - dependency misuse

   Never assume the first hypothesis is correct.

5. **Propose the Minimal Fix**
   - Prefer the smallest safe change that resolves the issue.
   - Avoid refactoring unrelated code.
   - Maintain existing architecture and patterns.

6. **Verify the Fix**
   - Re-run tests or reproduction steps.
   - Confirm the bug no longer occurs.
   - Ensure no new failures were introduced.

7. **Check Side Effects**
   Evaluate potential impact on:

   - related modules
   - shared utilities
   - API behavior
   - data consistency

## Rules
- Do not modify code before identifying the root cause.
- Always reproduce the problem first.
- Focus on the smallest possible scope.
- Avoid speculative fixes.
- Prefer minimal changes over large refactors.
- Preserve repository conventions and architecture.
- Verify the fix before claiming resolution.

## Context Efficiency
When debugging:

Prefer examining:
- stack traces
- failing tests
- specific functions
- recent code changes

Avoid loading:
- entire repositories
- unrelated modules
- large generated files

Expand context only when necessary.

## Validation
Before confirming resolution:

- The problem was reproduced.
- The root cause was identified.
- The fix resolves the issue.
- No new errors were introduced.
- Verification commands succeed.

## Output

Return a structured debugging report:

### Issue
Description of the failure.

### Reproduction
Steps or commands that trigger the issue.

### Root Cause
Technical explanation of the problem.

### Fix
Code or configuration change applied.

### Verification
Evidence that the fix works.

### Risk Assessment
Potential side effects or follow-up checks.