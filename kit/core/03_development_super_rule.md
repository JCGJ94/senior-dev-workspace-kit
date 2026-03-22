# Development Super Rule

## Purpose
Dictate the mandatory, cyclical workflow for any feature, bugfix, or refactor task.

## Scope
Task execution from inception to completion. (Tier 1 Priority).

## 1. V3 Spec-Driven Development (MANDATORY)
- Non-trivial work MUST follow the V3 9-phase SDD lifecycle.
- The canonical artifact space is `specs/<change-id>/`.
- Required phases: Intake, Explore, Proposal, Spec, Design, Tasks, Apply, Verify, Archive.
- Do not begin deep implementation if the required earlier phase artifacts do not exist.

## 2. Chesterton’s Fence Principle
- Never delete, deeply refactor, or rewrite existing logic without first analyzing and understanding *why* it was originally written that way. If unsure, trace the file history or ask the user.

## 3. Atomic Implementation Loop
- Write code iteratively.
- Implement one logical chunk, test/build it locally, verify it compiles (`tsc --noEmit`), and only then move to the next.
- Do not mix pure refactoring tasks with new feature development in the same PR or atomic boundary.
- Keep `specs/<change-id>/07-implementation-log.md` and `specs/<change-id>/summary.md` aligned with the current execution state.

## 4. Verification Before Completion
- Code written is not code finished. 
- You must inherently verify the success criteria (run the test runner, curl the endpoint, or request the user to visually inspect the dev server).
- Rely on explicit metrics, logs, and compiler checks over visual code review.
- Verification evidence belongs in `specs/<change-id>/08-verification.md` for non-trivial work.

## 5. Orchestrated Dispatch (MANDATORY)
- Limit file lengths limit complexity. If a file crosses **500 lines**, pause. You must extract components, hooks, or utilities to restore modularity.
- All code execution, deep code reading, and implementation work MUST be delegated through the orchestration model defined in `10_orchestrator_protocol.md`.
- If a task breaks standard execution rules, proactively delegate to specialized workflows (e.g., checking `workflows/feature_workflow.md`).
- When the task spans memory, verification, security, and deploy concerns together, prefer `architect-orchestrator-v3` as the top-level coordinator.
