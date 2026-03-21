# Systematic Debugging

## Purpose
Apply a rigorous, hypothesis-driven methodology to isolate, diagnose, and resolve complex defects while ensuring zero regression and high system reliability.

## Use when
- Investigating high-impact or intermittent bugs.
- Resolving defects that span multiple modules or services.
- Fixing issues that have resisted initial debugging attempts.
- Ensuring that a fix does not introduce side effects in sensitive areas.

## Do not use when
- The bug is trivial and easily identifiable.
- The failure is caused by a syntax error or obvious typo.
- You are implementing a new feature.

## Systematic Debugging Workflow

1. **Information Gathering**
   - Collect all available signals: stack traces, logs, environment state, and recent changes.
   - Map the observed failure to specific lines of code or data flows.

2. **Reproduction & Baselining**
   - Create a minimal, deterministic reproduction case (unit test or script).
   - Confirm the reproduction fails as expected in the current environment.
   - Establish a baseline where the system is known to work (e.g., a previous commit).

3. **Hypothesis Generation**
   - Formulate specific, testable hypotheses about the root cause.
   - Rank hypotheses by probability and ease of testing.

4. **Iterative Isolation**
   - Test hypotheses one by one using binary search (bisect) or targeted instrumentation.
   - Eliminate variables (headers, config, dependencies) until the smallest failure surface is found.
   - **Forbidden**: Making multiple simultaneous changes during isolation.

5. **Root Cause Identification**
   - Identify the exact mechanism of failure (e.g., race condition, logic error, memory leak).
   - Document **why** the bug happened, not just how.

6. **Minimal Surgical Fix**
   - Design the smallest possible change that resolves the root cause.
   - Prioritize architectural consistency over quick patches.

7. **Verification & Hardening**
   - Verify the reproduction test now passes.
   - Run the full regression suite to ensure zero impact on related modules.
   - Add edge-case tests to prevent similar bugs in the future.

8. **Post-Mortem & Documentation**
   - Summarize the bug, the fix, and any lessons learned for the repository's knowledge base.

## Rules
- **No Test, No Fix**: A bug is not considered fixed until a test proves it.
- **Isolate One Variable at a Time**: Change only one thing during diagnosis.
- **Trust No Assertion**: Verify assumptions with logs or debuggers.
- **Fix the Cause, Not the Symptom**: Avoid "if (value == null) return" patches unless that is the true fix.
- **Maintain State Integrity**: Ensure the fix handles state transitions and errors gracefully.

## Context Efficiency
- Focus on logs, stack traces, and affected files first.
- Only expand context to dependencies when isolation points to them.
- Avoid reading unrelated business logic.

## Validation
- The bug is reproduced deterministically.
- The fix resolves the root cause.
- No regressions were introduced in the full test suite.
- New tests cover the fix and its edge cases.

## Output

Return a Structured Debugging Report:

### Failure Context
Signs and symptoms observed.

### Reproduction
Command or test used to trigger the bug.

### Root Cause
Technical deep-dive into the failure mechanism.

### Fix Implementation
Surgical changes applied.

### Verification Evidence
Output of passing tests and regression checks.