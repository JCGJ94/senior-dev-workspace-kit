# Verification Before Completion

## Purpose
Ensure no work is claimed as finished until explicitly verified through concrete evidence (type-checks, linters, tests, diffs). Evidence over assertions, always.

## Use when
- You are about to report a task as complete.
- You are planning to commit, push, or create a Pull Request.
- You believe a bug is fixed or a test is now passing.

## Do not use when
- The task is still in its exploratory phase.
- You are strictly brainstorming without committing code.

## The Iron Law
**NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE.**
Violating this principle by claiming "it should work now" or relying on partial verification is considered a critical hallucination.

## The Gate Function Workflow
Before expressing satisfaction or completion:
1. **Identify**: What command objectively proves this claim?
2. **Run**: Execute the full verification command (e.g., `bun x tsc --noEmit`, `pytest`, `npm test`).
3. **Read**: Analyze the full output, exit codes, and failure counts.
4. **Verify**: Does the output explicitly confirm the claim without assumptions?
   - If **NO**: State the actual status with the evidence and start fixing.
   - If **YES**: State the claim *with* the evidence.

## Common Rationalizations to Avoid
- *"The linter passed, so the build succeeds."* (Linter ≠ Compiler)
- *"I'm confident it works."* (Confidence ≠ Evidence)
- *"The agent reported success."* (Independent verification is mandatory)
- *"Tests pass."* (If only referring to a previous run, it's invalid. Run it fresh.)
