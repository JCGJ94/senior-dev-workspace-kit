# Development Super Rule

## Purpose
Dictate the mandatory, cyclical workflow for any feature, bugfix, or refactor task.

## Scope
Task execution from inception to completion. (Tier 1 Priority).

## 1. Plan-First Execution (MANDATORY)
- **Stop and Plan:** You MUST ALWAYS begin by generating a tactical plan using `task_boundary` (Plan Mode).
- **No Rogue Edits:** Do not modify code architectures or write new modules deeply until a clear goal and implementation plan are synthesized and implicitly or explicitly accepted.

## 2. Chesterton’s Fence Principle
- Never delete, deeply refactor, or rewrite existing logic without first analyzing and understanding *why* it was originally written that way. If unsure, trace the file history or ask the user.

## 3. Atomic Implementation Loop
- Write code iteratively.
- Implement one logical chunk, test/build it locally, verify it compiles (`tsc --noEmit`), and only then move to the next.
- Do not mix pure refactoring tasks with new feature development in the same PR or atomic boundary.

## 4. Verification Before Completion
- Code written is not code finished. 
- You must inherently verify the success criteria (run the test runner, curl the endpoint, or request the user to visually inspect the dev server).
- Rely on explicit metrics, logs, and compiler checks over visual code review.

## 5. Escalation & Modularity
- Limit file lengths limit complexity. If a file crosses **500 lines**, pause. You must extract components, hooks, or utilities to restore modularity.
- If a task breaks standard execution rules, proactively delegate to specialized workflows (e.g., checking `workflows/feature_workflow.md`).
