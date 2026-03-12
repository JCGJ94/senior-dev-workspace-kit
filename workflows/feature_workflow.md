# 🏗️ Feature Workflow (Agnostic Runtime)

## Purpose
Develop new features using a plan-first workflow with environment-agnostic execution.
---

## 🟢 Phase 1: Planning (Discovery)
1. **Analyze Requirements**: Define Acceptance Criteria (AC).
2. **Detect Stack**: Consult `.agent/state/env_state.json` to identify tools.
3. **Plan-First (SDD Pinning)**: Execute `writing-plans` skill to outline the sequence.
   - **MANDATORY**: Create or update `.agent/state/current_spec.md`. The agent MUST read this file at the start of every iteration to prevent context decay.

---

## 🟡 Phase 2: Preparation (Setup)
1. **Dependency Check**: Execute `[OP_INSTALL]` if new packages have been added.
2. **Current State**: Verify that the project compiles and passes tests before making any changes (`[OP_TEST]`).

---

## 🔵 Phase 3: Implementation (Build)
1. **Atomic Coding**: Follow the plan step by step.
2. **Testing**: Create or update unit tests for the new functionality.
3. Execute skill: `commit-sentinel`.

---

## 🔴 Phase 4: Verification (Check)
0. **Context Purge**: Clear non-essential files from the context window (UI/DB layouts) and load strictly the files needed for testing.
1. **Engine Validation**: Execute `[OP_TYPECHECK]` and `[OP_LINT]`.
2. **Functional Validation**: Execute full `[OP_TEST]` for the affected suite.
3. Execute skill: `verification-before-completion`.

---

## 🏁 Phase 5: Closing (Ship)
1. **Clean Up**: Remove debug logs or temporary files.
2. **Final Review**: Evaluate the diff using `code-review-pro`.
3. **Handover**: Present the solution to the user with evidence of success.

---

## ⚙️ Operational Resolution
*Consult `env_state.json` to translate these tokens:*
- `[OP_INSTALL]`: `npm install`, `pip install -r req.txt`, `bun install`, etc.
- `[OP_TEST]`: `npm test`, `pytest`, `bun test`, etc.
- `[OP_TYPECHECK]`: `tsc --noEmit`, `mypy .`, `go build .`, etc.
- `[OP_LINT]`: `eslint`, `ruff`, `pnpm lint`, etc.
