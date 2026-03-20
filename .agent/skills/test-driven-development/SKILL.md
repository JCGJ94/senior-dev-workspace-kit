---
name: "test-driven-development"
description: "Drive logic changes through failing tests first, then minimal implementation, then safe refactoring."
tier: 2
triggers: ["tdd", "test-first", "bugfix", "new-logic"]
context_cost: 450
---

# Test-Driven Development (TDD)

## Purpose
Ensure all logic changes are driven and verified by automated tests to guarantee structural quality and prevent regressions.

## Use when
- Implementing new features, fixing bugs, or performing refactors.

## Do not use when
- Building throwaway prototypes.
- Creating static configuration files.

## The Iron Law
**NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST.**
If code is written without a test, or a test passes immediately upon creation, the code must be deleted and rewritten following the TDD cycle.

## Red-Green-Refactor Workflow
1. **RED**: Write one minimal test showing what should happen.
2. **Verify RED**: Run the test. Confirm it fails for the *expected reason* (missing feature, not a typo).
3. **GREEN**: Write the absolute minimal, simplest code to pass the test. No over-engineering.
4. **Verify GREEN**: Run the test. Ensure it passes alongside the rest of the suite.
5. **REFACTOR**: Remove duplication, improve naming, without altering the established behavior.

## Quality Standards
- **Minimal**: Test one thing. If the test name has "and", split it.
- **Intent-driven**: Show how the API should be used, demonstrating desired behavior rather than mocking internals.
- **Edge-case inclusive**: Do not assume manual testing covers edge cases; automate them.
- Under V3, record RED-GREEN-REFACTOR evidence in the active SDD verification artifacts and coordinate final readiness with `test-verifier`.
