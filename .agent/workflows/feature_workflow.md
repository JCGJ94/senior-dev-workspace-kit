# 🏗️ Feature Workflow (Agnostic Runtime)

## Purpose
Develop new features using a plan-first workflow with environment-agnostic execution.

---

## 🟢 Phase 1: Plan (Intake)
1. **Analyze Requirements**: Define Acceptance Criteria (AC).
2. **Detect Stack**: Consult `.agent/state/env_state.json` to identify tools.
3. **Plan-First**: Execute skill: `writing-plans` to outline the sequence.
   - For non-trivial work, route into the SDD lifecycle via `sdd-manager`. The active artifact space is `specs/<change-id>/`.

---

## 🟡 Phase 2: Prepare (Setup)
1. **Dependency Check**: Execute `[OP_INSTALL]` if new packages have been added.
2. **Baseline**: Verify that the project compiles and passes tests before making any changes (`[OP_TEST]`).

---

## 🔵 Phase 3: Execute (Build)
1. **Atomic Coding**: Follow the plan step by step.
2. **Testing**: Create or update unit tests for the new functionality.
3. Execute skill: `commit-sentinel`.

---

## 🔴 Phase 4: Verify (Check)
0. **Context Purge**: Clear non-essential files from the context window and load strictly the files needed for testing.
1. **Engine Validation**: Execute `[OP_TYPECHECK]` and `[OP_LINT]`.
2. **Functional Validation**: Execute full `[OP_TEST]` for the affected suite.
3. Execute skill: `verification-before-completion`.

---

## 🏁 Phase 5: Close (Ship)
1. **Clean Up**: Remove debug logs or temporary files.
2. **Handover**: Present the solution to the user with evidence of success.

---

## ⚙️ Operational Resolution
*Consult `.agent/state/allowed_ops.json` to resolve these tokens:*
- `[OP_INSTALL]` · `[OP_TEST]` · `[OP_TYPECHECK]` · `[OP_LINT]`
