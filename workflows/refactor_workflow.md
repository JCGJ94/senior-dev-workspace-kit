# 🔨 Refactor Workflow (Agnostic Runtime)

## Purpose
Safe and structured procedure for improving code quality without altering external behavior.

---

## 🟢 Phase 1: Analysis (Detection)
1. **Identify Target**: Locate files > 500 lines, duplicated logic, or technical debt.
2. **Impact Assessment**: Determine which dependencies will be affected by the internal change.
3. **Plan Refactor (SDD Pinning)**: Execute skill: `writing-plans`.
   - **MANDATORY**: Create or update `.agent/state/current_spec.md`. The agent MUST read this file at the start of every iteration to prevent context decay.

---

## 🟡 Phase 2: Safety Net (Baseline)
1. **Current Status**: Execute `[OP_TEST]` and `[OP_TYPECHECK]` before starting. Do not refactor on broken code.
2. **State Snapshot**: Consult `.agent/state/env_state.json` to confirm the current stack.

---

## 🔵 Phase 3: Execution (Clean Coding)
1. **Behavior Preservation**: Apply structural changes. **Forbidden** to add new features during a refactor.
2. **Modularization**: Split large components into smaller, specialized units.
3. Execute skill: `commit-sentinel`.

---

## 🔴 Phase 4: Parity (Verification)
0. **Context Purge**: Clear non-essential files from the context window and load strictly the files needed for testing.
1. **Functional Parity**: Execute `[OP_TEST]`. Tests must pass exactly as they did in Phase 2.
2. **Type Safety**: Execute `[OP_TYPECHECK]`. A Senior refactor must improve type precision.
3. **Linting**: Execute `[OP_LINT]` to ensure style consistency.

---

## 🏁 Phase 5: Validation (Review)
1. Execute skill: `code-review-pro`.
2. **Clean Up**: Remove dead code or obsolete comments resulting from the change.
3. **Evidence**: Show comparative diff and validation results.

---

## ⚙️ Operational Resolution
*Consult `env_state.json` to translate these tokens:*
- `[OP_TEST]`: `npm test`, `pytest`, `bun test`, etc.
- `[OP_TYPECHECK]`: `tsc --noEmit`, `mypy .`, etc.
- `[OP_LINT]`: `eslint`, `ruff`, etc.

